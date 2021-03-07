const mongoose = require("mongoose");
const env = require("../environment");
/**
 * Connection to mongoDB
 */
mongoose
  .connect(env.dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));

  