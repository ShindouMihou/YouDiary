FROM node:17-alpine
WORKDIR /usr/src/app

# Copy all the package.json first.
COPY . .

# Install all the dependencies
RUN npm ci

EXPOSE 2312

CMD ["npm", "run", "prod"]