FROM node:alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g pnpm@8.9.0

RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:alpine as production 

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g pnpm@8.9.0

RUN pnpm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/websocket/main"]