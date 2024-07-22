FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --silent
COPY . .
RUN mkdir -p /usr/src/app/uploads && \
    chown -R node:node /usr/src/app
USER node
EXPOSE 3000
CMD ["node", "src/index.js"]