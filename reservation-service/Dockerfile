
FROM python:3.11-slim
WORKDIR /home/app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
#COPY common /home/app/common
COPY app /home/app
CMD ["python", "-m", "server"]
