FROM node:16 AS builder

WORKDIR /app

COPY . .
RUN npm install npm@8.13.2
RUN npm install
RUN npm run build:tsc

FROM node:16
WORKDIR /app
COPY --from=builder /app ./
CMD ["npm", "run", "-e NODE_ENV=production","start"]