FROM node:lts-alpine as development
WORKDIR /app
COPY ./package.json ./
RUN npm install -g rimraf

# RUN yarn
COPY . .

CMD ["npm", "run", "start:debug"]

EXPOSE 8080