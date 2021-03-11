module.exports = {
  development:{
    dbUrl: "mongodb://localhost:27017/memory?retryWrites=true"
  },
  production:{
    dbUrl: "mongodb://mongo:27017/memory?retryWrites=true",
  }
}
