
import asyncio
from grpc.experimental import aio
from opentelemetry.instrumentation.grpc import GrpcInstrumentorServer
from common.telemetry import setup_tracing
import book_pb2_grpc
from service import BookService

setup_tracing("book-service")
GrpcInstrumentorServer().instrument()

async def serve():
    server = aio.server()
    #register service here
    book_pb2_grpc.add_BookServiceServicer_to_server(BookService(), server)
    server.add_insecure_port("[::]:5002")
    await server.start()
    print("book-service running")
    await server.wait_for_termination()

if __name__ == "__main__":
    asyncio.run(serve())
