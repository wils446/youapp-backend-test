# Table of Content

- [Installation](#Installation)
- [API endpoints](#API-endpoints)
  - [Auth](#auth)
  - [Profile](#profile)
  - [Message](#message)
- [Websocket](#Websocket)
  - [Events](#events)


# Installation

1. Clone this repository (or [Download](https://github.com/wils446/youapp-backend-test/archive/refs/heads/main.zip))

```
git clone https://github.com/wils446/youapp-backend-test
```

2. Copy `.env.example` to `.env`, there are 2 `.env.example` one is located in the `/apps/api` and the other is in `/app/websocket`

```
cp .\apps\api\.env.example .\apps\api\.env
cp .\apps\websocket\.env.example .\apps\websocket\.env
```

3. Modify `.env` value as needed, here are some descriptions about the environment variables

| Key                         | Description                                                                                                            | Example                                                     |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `JWT_SECRET`                | [Very long randomly generated string](<(https://www.lastpass.com/features/password-generator)>) for API authentication | `L0Ng-RaNDom-StrING`                                        |
| `JWT_EXPIRES`               | Time for the token expires, expressed in seconds or a string ([vercel/ms](https://github.com/vercel/ms))               | `14d`(default)                                              |
| `MONGODB_URI`               | MongoDB URI, **leave this value to default**                                                                           | `mongodb://root:password123@mongodb-primary:27017`(default) |
| `RABBIT_MQ_URI`             | RabbitMQ URI, **leave this value to default**                                                                          | `amqp://user:password@rabbitmq:5672`(default)               |
| `RABBIT_MQ_WEBSOCKET_QUEUE` | used for naming a queue, **leave this value to default**                                                               | `websocket`(default)                                        |
| `API_URI`                   | URI to fetch data from api app, **leave this value to default**                                                        | `http://api:3000`(default)                                  |

4. Run the containers

```
docker-compose up
```

5. Try with open browser and navigate to [http://localhost:3000](http://localhost:3000)

# API endpoints

default port for api is `3000`

## Auth

- `POST` `http://localhost:3000/register`
  - body :
    - username `string`
    - email `string`
    - password `string`
  - response example :
  ```json
  {
    "token": "jwt-auth-token"
  }
  ```
- `POST` `http://localhost:3000/login`
  - body:
    - usernameOrEmail `string`
    - password `string`
  - response example :
  ```json
  {
    "token": "jwt-auth-token"
  }
  ```

## Profile

- `POST` `http://localhost:3000/createProfile`
  - auth token required
  - body :
    - name `string`
    - birthday `string`
    - height `number`
    - weight `number`
    - interests `string[]`
  - response example :
  ```json
  {
    "name": "Andi",
    "birthday": "29 Sept",
    "height": 200,
    "weight": 90,
    "interests": ["ate", "sleep", "playing game", "reading"],
    "credential": "660d2e857a23064e4ab7707d",
    "_id": "660d2f827a23064e4ab77082",
    "createdAt": "2024-04-03T10:29:22.063Z",
    "updatedAt": "2024-04-03T10:29:22.063Z"
  }
  ```
- `GET` `http://localhost:3000/getProfile`
  - auth token required
  - by default it will target auth user profile
  - body :
    - targetUser `string` `optional`
  - response example :
  ```json
  {
    "_id": "660d2f827a23064e4ab77082",
    "name": "Andi",
    "birthday": "29 Sept",
    "height": 200,
    "weight": 90,
    "interests": ["ate", "sleep", "playing game", "reading"],
    "credential": "660d2e857a23064e4ab7707d",
    "createdAt": "2024-04-03T10:29:22.063Z",
    "updatedAt": "2024-04-03T10:29:22.063Z"
  }
  ```
- `PATCH` `http://localhost:3000/updateProfile`
  - auth token required
  - body :
    - name `string` `optional`
    - birthday `string` `optional`
    - weight `number` `optional`
    - height `number` `optional`
    - interests `string[]` `optional`
  - response example :
  ```json
  {
    "_id": "660d2f827a23064e4ab77082",
    "name": "Andi",
    "birthday": "29 Sept",
    "height": 200,
    "weight": 90,
    "interests": ["ate", "sleep", "playing game"],
    "credential": "660d2e857a23064e4ab7707d",
    "createdAt": "2024-04-03T10:29:22.063Z",
    "updatedAt": "2024-04-03T10:32:40.018Z"
  }
  ```

## Message

- `POST` `http://localhost:3000/sendMessage`

  - auth token required
  - body :
    - message `string`
    - targetUser `string`
  - response example :

  ```json
  {
    "message": "woi nes",
    "room": "660d31607a23064e4ab77096",
    "user": "660d2f827a23064e4ab77082",
    "_id": "660d31617a23064e4ab77098",
    "createdAt": "2024-04-03T10:37:21.065Z",
    "updatedAt": "2024-04-03T10:37:21.065Z"
  }
  ```

- `POST` `http://localhost:3000/viewMessage`

  - auth token required
  - body :
    - targetUser `string`
  - response example :

    ```json
    {
      "messages": [
        {
          "_id": "660d35295a80073009a80cf3",
          "message": "woi son",
          "room": "660d35295a80073009a80cf1",
          "user": "660d346a5a80073009a80cd5",
          "createdAt": "2024-04-03T10:53:29.346Z",
          "updatedAt": "2024-04-03T10:53:29.346Z"
        }
      ]
    }
    ```

# WebSocket

**Note:** every credential need to create profile/user to access the websocket
for the websocket the default is listening to port `8123`, and its require the auth token at header, for example :

```js
const socket = io('ws://localhost:8123', {
  extraHeaders: {
    authorization: 'Bearer AUTH-TOKEN-HERE',
  },
});
```

## events

- `receive-message`
  - the data you received when its trigger :
    ```json
    {
      "newMessage": {
        "message": "woi son",
        "room": "660d35a85a80073009a80cfd",
        "user": "660d347a5a80073009a80cdd",
        "_id": "660d35a85a80073009a80cff",
        "createdAt": "2024-04-03T10:55:36.271Z",
        "updatedAt": "2024-04-03T10:55:36.271Z"
      }
    }
    ```
- `unauthorized-error`
  - it will trigger if you auth token is not valid
