# Specify a base image
FROM node:alpine

# Set working directory
WORKDIR /usr/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./

COPY yarn.lock ./

RUN yarn

# add app
COPY . ./

RUN yarn build

# Default Command
CMD ["serve", "-s", "build"]
