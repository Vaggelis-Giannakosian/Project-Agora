FROM node:16
WORKDIR /app
COPY ./src .
RUN npm ci --no-audit --prefer-offline
CMD ["node", "src/index.js"]
