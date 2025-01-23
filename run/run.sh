#!/bin/bash

start_service() {
  local service_name=$1
  local service_path=$2

  echo "Starting $service_name..."
  $service_path &
  local service_pid=$!
  echo "$service_name is running (PID: $service_pid)"
  return $service_pid
}

start_service "API Server" "./services/api-server.sh"
API_SERVER_PID=$?

sleep 5

start_service "API Gateway" "./services/api-gateway.sh"
API_GATEWAY_PID=$?

sleep 5

start_service "Core Service" "./services/core.sh"
CORE_PID=$?

sleep 5

start_service "Reports Service" "./services/reports.sh"
REPORTS_PID=$?

start_service "Notification Service" "./services/notification.sh"
NOTIFICATION_PID=$?

start_service "Front-End Service" "./services/front-end.sh"
FRONT_END_PID=$?

start_service "RAG Module Service" "./services/rag_module.sh"
RAG_MODULE_PID=$?

trap "kill $API_SERVER_PID $API_GATEWAY_PID $CORE_PID $REPORTS_PID $NOTIFICATION_PID $FRONT_END_PID $RAG_MODULE_PID; echo 'All services stopped'; exit" SIGINT SIGTERM

wait $API_SERVER_PID $API_GATEWAY_PID $CORE_PID $REPORTS_PID $NOTIFICATION_PID
