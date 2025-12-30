
import asyncio
from grpc.experimental import aio
from opentelemetry.instrumentation.grpc import GrpcInstrumentorServer
from common.telemetry import setup_tracing
import reservation_pb2_grpc
from service import ReservationService

setup_tracing("reservation-service")
GrpcInstrumentorServer().instrument()

async def serve():
    server = aio.server()
    #register service here
    reservation_pb2_grpc.add_ReservationServiceServicer_to_server(ReservationService(), server)
    server.add_insecure_port("[::]:5003")
    await server.start()
    print("reservation-service running")
    await server.wait_for_termination()

if __name__ == "__main__":
    asyncio.run(serve())
