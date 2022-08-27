FROM node:16

RUN npm install -g nodemon ts-node

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

#RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE ${NODE_PORT}
CMD [ "npm", "run", "start:nodemon" ]
