const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const packageDef = protoLoader.loadSync(
    path.join(__dirname, "../../proto/auth.proto")
);

const proto = grpc.loadPackageDefinition(packageDef);

const authService = require("./grpc-services/auth.services.grpc");

const server = new grpc.Server();

server.addService(
    proto.auth.AuthService.service,
    authService
);

server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
        console.log("gRPC Server Running on 50051");
        server.start();
    }
);