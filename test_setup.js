process.env.NODE_ENV = "test"

require('source-map-support').install()
require("chai").use(require("chai-http")).use(require("sinon-chai"))

process.on("unhandledRejection", (reason) => {
  throw reason
})
