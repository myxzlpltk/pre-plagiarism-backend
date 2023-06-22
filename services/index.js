const { Firestore } = require("@google-cloud/firestore")
const { PubSub } = require("@google-cloud/pubsub")
const { Storage } = require("@google-cloud/storage")

const services = {
  db: new Firestore({
    projectId: process.env.PROJECT_ID,
    keyFilename: 'service-account.json'
  }),
  storage: new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: 'service-account.json'
  }),
  pubsub: new PubSub({
    projectId: process.env.PROJECT_ID,
    keyFilename: 'service-account.json'
  })
}

module.exports = services