COMPOSE_FILE=docker-compose.test-services.yml

.PHONY: up down clean rebuild

# Start all test services
up:
	@echo "Starting test services..."
	docker-compose -f $(COMPOSE_FILE) up --build -d

# Stop all test services
down:
	@echo "Stopping test services..."
	docker-compose -f $(COMPOSE_FILE) down

# Completely remove containers, images, and volumes
clean:
	@echo "Removing containers, images, and volumes for test services..."
	docker-compose -f $(COMPOSE_FILE) down --rmi all --volumes --remove-orphans

# Rebuild everything from scratch
rebuild:
	@echo "Rebuilding test services..."
	docker-compose -f $(COMPOSE_FILE) down --rmi all --volumes --remove-orphans
	docker-compose -f $(COMPOSE_FILE) up --build -d
