FROM node:erbium-buster-slim
LABEL mainteneiner = 'Ricardo David Ortiz'
WORKDIR /bank-web
COPY package*.json ./
RUN npm install
COPY ./ ./
EXPOSE 3000
CMD npm run build \
&& npm run start:prod
