FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

# Set ENV
ENV NODE_ENV=production

# Bundle app source
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD ["yarn", "start"]