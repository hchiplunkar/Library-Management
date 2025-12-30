!/bin/bash

python -m grpc_tools.protoc -I proto --python_out=. --grpc_python_out=. proto/user.proto
python -m grpc_tools.protoc -I proto --python_out=. --grpc_python_out=. proto/book.proto
python -m grpc_tools.protoc -I proto --python_out=. --grpc_python_out=. proto/reservation.proto
