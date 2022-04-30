FROM node:17.3.0
WORKDIR . .
COPY . .
RUN npm install
RUN npm install -g pm2
RUN npm run build
CMD ["pm2-runtime", "./ecosystem.config.js"]