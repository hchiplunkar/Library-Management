import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";

// Load proto
const PROTO_PATH = path.join(process.cwd(), "./proto/reservation.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const reservationProto = grpc.loadPackageDefinition(packageDefinition).library;

const target = "reservation-service:5003";
console.log("Connecting to ReservationService at:", target);

const client = new reservationProto.ReservationService(target, grpc.credentials.createInsecure());

function grpcCall(method, request) {
  if (!client[method]) {
    return Promise.reject(new Error(`gRPC method ${method} not found on ReservationService`));
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
  reserveBook: (payload) => grpcCall("ReserveBook", payload),
  returnBook: (payload) => grpcCall("Returnbook", payload),
  deleteReservation: (payload) => grpcCall("DeleteReservation", payload),
  getAllReservations: (payload) => grpcCall("GetAllReservations", payload || {}),
};
