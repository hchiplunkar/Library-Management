import user_pb2
import user_pb2_grpc
from models import UserMember
from repositories import UserRepository
from database import get_session
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

class UserManagementService(user_pb2_grpc.UserServiceServicer):

    async def CreateUser(self, request, context):
        with tracer.start_as_current_span("create_user"):
            async with get_session() as session:
                user = UserMember(
                    user_name=request.name,
                    email_id=request.email,
                    contactno=request.contact_no,
                    address=request.address,
                    aadhar_id=request.aadhar_id
                )
                await UserRepository.create(session, user)
                return user_pb2.UserResponse(
                    user_id=user.user_id,
                    name=user.user_name,
                    email=user.email_id,
                    contact_no=user.contactno,
                    address=user.address,
                    aadhar_id=user.aadhar_id,
                    status=user.status
                )

    async def GetUser(self, request, context):
        with tracer.start_as_current_span("get_user"):
            async with get_session() as session:
                user = await UserRepository.get_by_id(session, request.user_id)
                if not user:
                    context.set_code(5)  # NOT_FOUND
                    context.set_details("User not found")
                    return user_pb2.UserResponse()
                return user_pb2.UserResponse(
                    user_id=user.user_id,
                    name=user.user_name,
                    email=user.email_id,
                    contact_no=user.contactno,
                    address=user.address,
                    aadhar_id=user.aadhar_id,
                    status=user.status
                )
