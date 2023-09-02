# src : https://nodejs.org/en/docs/guides/nodejs-docker-webapp/#creating-a-dockerfile
# Currently using Node LTS Hydrogen
FROM node:lts-hydrogen

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install npm@^8
# This should remove the outdated npm warning until v10
RUN [ "npm", "install", "npm@9", "-g" ]

# Bundle app source
COPY . .

# Install production dependencies
#RUN [ "npm", "ci", "--omit=dev", ]
RUN [ "npm", "ci" ]

EXPOSE 7378

# Run the service
# Use node for production
#CMD [ "node", "app.js" ]
CMD [ "nodemon", "app.js" ]
