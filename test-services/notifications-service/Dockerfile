FROM node:20-alpine

WORKDIR /app

COPY server.js server.js
RUN npm init -y && npm install fastify

EXPOSE 3004

CMD ["node", "server.js"]
