FROM node:17.3.0
WORKDIR . .
COPY . .
RUN npm install
RUN npm install -g ts-node
RUN cd ./src && npx prisma generate
ENV PORT=8080
EXPOSE 8080
CMD ["ts-node", "./src/app.ts"]