import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";

// Load proto
const PROTO_PATH = path.join(process.cwd(), "./proto/user.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(packageDefinition).library;

const target = "user-service:5001";
console.log("Connecting to UserService at:", target);

const client = new userProto.UserService(target, grpc.credentials.createInsecure());

function grpcCall(method, request) {
  if (!client[method]) {
    return Promise.reject(new Error(`gRPC method ${method} not found on UserService`));
  }
  return new Promise((resolve, reject) => {
    client[method](request, (err, response) => {
      if (err) {
        err.grpcMethod = method;
        return reject(err);
      }
      resolve(response);
    });
  });
}

export default {
  createUser: (payload) => grpcCall("CreateUser", payload),
  updateUser: (payload) => grpcCall("UpdateUser", payload),
  deleteUser: (payload) => grpcCall("DeleteUser", payload),
  getUser: (payload) => grpcCall("GetUser", payload),
  getAllUsers: (payload) => grpcCall("GetAllUsers", payload || {}),
};
