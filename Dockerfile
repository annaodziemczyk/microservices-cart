FROM node:6.9.2
EXPOSE 3001
COPY . .
RUN npm install
CMD node app.js