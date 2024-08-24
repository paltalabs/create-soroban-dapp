#!/bin/bash

# Function to generate a unique project ID
generate_project_id() {
    local dir_name
    dir_name=$(basename "$PWD")
    local timestamp
    timestamp=$(date +%s)
    local project_id
    project_id="${dir_name}-${timestamp}"
    
    # Sanitize the project ID
    project_id=$(echo "$project_id" | tr -cd '[:alnum:]-_')

    echo "$project_id"
}

# Export the PROJECT_ID
export PROJECT_ID=$(generate_project_id)

# Check for existing containers with the same name
check_existing_containers() {
    if docker ps -a --filter "name=soroban-preview-${PROJECT_ID}" --filter "name=stellar-${PROJECT_ID}" | grep -q "soroban-preview-${PROJECT_ID}\|stellar-${PROJECT_ID}"; then
        echo "Error: A container with the name soroban-preview-${PROJECT_ID} or stellar-${PROJECT_ID} already exists."
        exit 1
    fi
}

check_existing_containers

# Modify docker-compose.yml with the PROJECT_ID
sed -i.bak "s/container_name: soroban-preview/container_name: soroban-preview-${PROJECT_ID}/" docker-compose.yml
sed -i.bak "s/container_name: stellar/container_name: stellar-${PROJECT_ID}/" docker-compose.yml

# Start Docker Compose using the correct command
docker-compose up -d