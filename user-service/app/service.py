import user_pb2
import user_pb2_grpc
from models import UserMember
from repositories import UserRepository
from database import get_session
from opentelemetry import trace
from sqlalchemy import select

tracer = trace.get_tracer(__name__)

class UserManagementService(user_pb2_grpc.UserServiceServicer):

    async def CreateUser(self, request, context):
        with tracer.start_as_current_span("create_user"):
            async with get_session() as session:
                user = UserMember(
                    user_name=request.name,
                    email_id=request.email,
                    contactno=request.contactno,
                    address=request.address,
                    aadhar_id=request.aadhar_id
                )
                await UserRepository.create(session, user)
                return user_pb2.UserResponse(user_id=user.user_id)

    async def GetUser(self, request, context):
        with tracer.start_as_current_span("get_user"):
            async with get_session() as session:
                user = await UserRepository.get_by_id(session, request.user_id)
                if not user:
                    context.set_code(5)  # NOT_FOUND
                    context.set_details("User not found")
                    return user_pb2.GetUserResponse()
                return user_pb2.GetUserResponse(
                    name=user.user_name,
                    email=user.email_id,
                    contactno=user.contactno,
                    address=user.address,
                    aadhar_id=user.aadhar_id
                )

    async def UpdateUser(self, request, context):
        with tracer.start_as_current_span("update_user"):
            async with get_session() as session:
                user = await UserRepository.update_user(
                    session,
                    request.user_id if hasattr(request, 'user_id') else None,
                    user_name=request.name,
                    email_id=request.email,
                    contactno=request.contactno,
                    address=request.address,
                    aadhar_id=request.aadhar_id
                )
                if not user:
                    context.set_code(5)
                    context.set_details("User not found")
                    return user_pb2.UserResponse()
                return user_pb2.UserResponse(user_id=user.user_id)

    async def DeleteUser(self, request, context):
        with tracer.start_as_current_span("delete_user"):
            async with get_session() as session:
                user = await UserRepository.get_by_id(session, request.user_id)
                if not user:
                    context.set_code(5)
                    context.set_details("User not found")
                    return user_pb2.UserResponse()
                await UserRepository.soft_delete(session, user)
                return user_pb2.UserResponse(user_id=user.user_id)

    async def GetAllUsers(self, request, context):
        with tracer.start_as_current_span("get_all_users"):
            async with get_session() as session:
                users = await UserRepository.get_all_users(session)
                user_msgs = []
                for u in users:
                    user_msgs.append(user_pb2.Userdetails(
                        user_id=u.user_id,
                        name=u.user_name,
                        email=u.email_id,
                        contactno=u.contactno or "",
                        address=u.address or "",
                        aadhar_id=u.aadhar_id or ""
                    ))
                return user_pb2.GetAllUsersResponse(User=user_msgs)
