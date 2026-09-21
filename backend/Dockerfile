FROM node:22.12-alpine

WORKDIR /backend

# Copy our package.json
COPY package*.json ./


#Install app dependecies
RUN npm install

# Copy the rest of our app into the container
COPY . .

EXPOSE 5000

CMD ["npm","start"]