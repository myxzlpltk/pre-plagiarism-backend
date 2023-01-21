FROM node:18-alpine
ENV NODE_ENV production
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install --production
# Copy app files
COPY . .
# Expose port
EXPOSE 3000
# Start app
CMD ["yarn", "start"]