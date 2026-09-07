# Hide-WIN Development Makefile

.PHONY: up down build logs test lint clean

up:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

down:
	docker-compose down -v

build:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml build

logs:
	docker-compose logs -f

test:
	pytest tests/

lint:
	flake8 .

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	docker system prune -f
