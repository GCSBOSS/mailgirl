
FROM node:12-alpine
ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i --no-optional -P

COPY . .

# This was commented to work on Windows (might be a bad idea)
# USER mailgirl

CMD ["node", "./bin/mailgirl.js"]
