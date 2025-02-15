#!/bin/bash

# Function to start a service
start_service() {
  local service_name="$1"
  local service_path="$2"

  echo "Starting $service_name..."
  $service_path &  # Run in background
  local service_pid=$!  # Capture PID of last background process
  echo "$service_name is running (PID: $service_pid)"

  # Store PID in an array for later cleanup
  SERVICE_PIDS+=($service_pid)
}

# Array to store service PIDs
SERVICE_PIDS=()

# Start services with delays
start_service "API Server" "./services/api-server.sh"
sleep 5

start_service "API Gateway" "./services/api-gateway.sh"
sleep 5

start_service "Core Service" "./services/core.sh"
sleep 5ls -l run.sh services/



start_service "Reports Service" "./services/reports.sh"
start_service "Notification Service" "./services/notification.sh"
start_service "Front-End Service" "./services/front-end.sh"
start_service "RAG Module Service" "./services/rag_module.sh"

# Trap to clean up processes on exit
trap "echo 'Stopping all services...'; kill ${SERVICE_PIDS[*]}; echo 'All services stopped'; exit" SIGINT SIGTERM

# Wait for all services to keep script running
wait "${SERVICE_PIDS[@]}"
