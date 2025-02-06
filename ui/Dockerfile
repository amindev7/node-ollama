FROM node:lts-alpine3.21 AS build

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

# DEV
CMD ["yarn", "dev"]

# PROD 
# RUN yarn build
# FROM nginx:stable-alpine-slim
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=build /app/dist /usr/share/nginx/html
# EXPOSE 3000
# CMD ["nginx", "-g", "daemon off;"]