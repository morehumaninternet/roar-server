process.env.NODE_ENV = "test"

require("chai").use(require("chai-http")).use(require("sinon-chai"))

process.on("unhandledRejection", (reason) => {
  throw reason
})
