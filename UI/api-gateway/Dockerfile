FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
#RUN npm install --production
RUN npm install -g npm@11.7.0

COPY . .

RUN npm install

# Optional: OTEL collector endpoint
ENV OTEL_EXPORTER_OTLP_ENDPOINT=grpc://otel-collector:4317
# Book service
ENV BOOK_SERVICE_HOST=book-service
ENV BOOK_SERVICE_PORT=50051

EXPOSE 8080
CMD ["node", "index.js"]
#CMD ["sleep", "infinity"]
