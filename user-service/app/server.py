
import asyncio
from grpc.experimental import aio
from opentelemetry.instrumentation.grpc import GrpcInstrumentorServer
from common.telemetry import setup_tracing
import user_pb2_grpc
from service import UserManagementService

setup_tracing("user-service")
GrpcInstrumentorServer().instrument()

async def serve():
    server = aio.server()
    #register service here
    user_pb2_grpc.add_UserServiceServicer_to_server(UserManagementService(), server)
    server.add_insecure_port("[::]:5001")
    await server.start()
    print("user-service running")
    await server.wait_for_termination()

if __name__ == "__main__":
    asyncio.run(serve())
