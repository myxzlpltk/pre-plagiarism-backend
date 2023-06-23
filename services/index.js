const { Firestore } = require("@google-cloud/firestore")
const { PubSub } = require("@google-cloud/pubsub")
const { Storage } = require("@google-cloud/storage")

const credentials = JSON.parse(process.env.SERVICE_ACCOUNT_INFO)
const services = {
  db: new Firestore({
    projectId: process.env.PROJECT_ID,
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key
    }
  }),
  storage: new Storage({
    projectId: process.env.PROJECT_ID,
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key
    }
  }),
  pubsub: new PubSub({
    projectId: process.env.PROJECT_ID,
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key
    }
  })
}

module.exports = services