#!/bin/sh

# Wait for MongoDB replicas to be ready
until nc -z mongo_replica_1 27017 && nc -z mongo_replica_2 27018 && nc -z mongo_replica_3 27019; do
    echo "Waiting for MongoDB replicas to be ready..."
    sleep 2
done

# Wait for types to be ready (if you have a specific port or health check)
# For example, replace `types_service:port` with an actual readiness check if applicable
echo "Waiting for types service..."
# Add any readiness check here

echo "All services are ready, starting backend..."
exec "$@"
