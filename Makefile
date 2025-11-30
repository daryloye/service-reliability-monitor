API_COMPOSE_FILE=docker-compose.yml
TEST_SERVICES_COMPOSE_FILE=docker-compose.test-services.yml

.PHONY: up down api-up api-down services-up services-down clean rebuild tests

# Start api & test services
up:
	@echo "Starting api & test services..."
	docker-compose -f $(TEST_SERVICES_COMPOSE_FILE) up --build -d
	docker-compose -f $(API_COMPOSE_FILE) up --build -d

# Stop api & test services
down:
	@echo "Stopping api & test services..."
	docker-compose -f $(TEST_SERVICES_COMPOSE_FILE) down
	docker-compose -f $(API_COMPOSE_FILE) down


# Start api
api-up:
	@echo "Starting api..."
	docker-compose -f $(API_COMPOSE_FILE) up --build -d

# Stop api
api-down:
	@echo "Stopping api..."
	docker-compose -f $(API_COMPOSE_FILE) down


# Start all test services
services-up:
	@echo "Starting test services..."
	docker-compose -f $(TEST_SERVICES_COMPOSE_FILE) up --build -d

# Stop all test services
services-down:
	@echo "Stopping test services..."
	docker-compose -f $(TEST_SERVICES_COMPOSE_FILE) down


clean:
	@echo "Removing containers, images, and volumes for test services..."
	docker-compose -f $(TEST_SERVICES_COMPOSE_FILE) down --rmi all --volumes --remove-orphans
	docker-compose -f $(API_COMPOSE_FILE) down --rmi all --volumes --remove-orphans

rebuild:
	@echo "Rebuilding all services..."
	docker-compose -f $(TEST_SERVICES_COMPOSE_FILE) down --rmi all --volumes --remove-orphans
	docker-compose -f $(API_COMPOSE_FILE) down --rmi all --volumes --remove-orphans
	docker-compose -f $(TEST_SERVICES_COMPOSE_FILE) up --build -d
	docker-compose -f $(API_COMPOSE_FILE) up --build -d

tests:
	@echo "Running tests..."
	npm run test
