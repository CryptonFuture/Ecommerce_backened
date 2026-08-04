const app = require('./app')
const connectMongoDB  = require('./src/mongodb_connection/connection')
require("./src/grpc/server");

const port = process.env.PORT

connectMongoDB()

app.listen(port, () => {
      console.log(`listening on port: ${port}`);
})