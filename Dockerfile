FROM node:12.21.0
ENV NODE_ENV=production
WORKDIR ./BACKD
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --production
COPY . .
CMD ["node", "bin/www.js"]
