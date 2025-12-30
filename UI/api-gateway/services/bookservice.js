import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";

// Load proto
const PROTO_PATH = path.join(process.cwd(), "./proto/book.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const bookProto = grpc.loadPackageDefinition(packageDefinition).library;

// Singleton gRPC client
const target = "book-service:5002";
console.log("Connecting to BookService at:", target);

const client = new bookProto.BookService(
  target,
  grpc.credentials.createInsecure()
);

// Helper to call gRPC with Promises
function grpcCall(method, request) {
  if (!client[method]) {
    return Promise.reject(
      new Error(`gRPC method ${method} not found on BookService`)
    );
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

// Exposed API for API Gateway
export default {
  addBook: (payload) => grpcCall("AddBook", payload),
  updateBook: (payload) => grpcCall("UpdateBook", payload),
  deleteBook: (payload) => grpcCall("DeleteBook", payload),
  getAllBooks: () => grpcCall("GetAllBooks", {}),
  getBook: (book_id) => grpcCall("GetBook", { book_id }),
  addCategory: (payload) => grpcCall("AddCategory", payload),
  updateCategory: (payload) => grpcCall("UpdateCategory", payload),
  deleteCategory: (payload) => grpcCall("DeleteCategory", payload),
  getAllCategories: () => grpcCall("GetAllCategories", {}),
  getCategory: (category_id) => grpcCall("GetCategory", { category_id })
};
