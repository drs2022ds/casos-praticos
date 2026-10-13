FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY lib ./lib
COPY public ./public
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
USER node
CMD ["node", "lib/standalone.js"]
