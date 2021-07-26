FROM node:14.16.0
ENV NODE_ENV=production
WORKDIR ./BACKD
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --production
CMD ["node", "bin/www.js"]
