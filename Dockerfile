FROM node:17.3.0
WORKDIR . .
COPY . .
RUN npm install
RUN npm install -g pm2
RUN npm run build
# note: i'm kind of lost
CMD ["pm2-runtime", "./ecosystem.config.js"]