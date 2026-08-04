const app = require('./app')
const connectMongoDB  = require('./src/mongodb_connection/connection')
require("./src/grpc/server");
const { connectRedis } = require("./src/config/redis");

// const port = process.env.PORT

async function startServer() {

    try {

        await connectMongoDB()

        await connectRedis();

        app.listen(process.env.PORT, () => {

            console.log(
                `🚀 Server Running on Port ${process.env.PORT}`
            );

        });

    } catch (err) {

        console.log(err);

    }

}

startServer();

// app.listen(port, () => {
//       console.log(`listening on port: ${port}`);
// })