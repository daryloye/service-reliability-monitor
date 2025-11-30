FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install --build-from-source=better-sqlite3

COPY src ./src
COPY tsconfig.json ./

RUN npm run build
RUN cp src/dashboard.html dist/

EXPOSE 8000
CMD ["node", "dist/index.js"]
