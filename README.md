# CRUD Operations using NodeJS and ExpressJS

A simple Node.js backend microservice for CRUD operations.

## Installation

1. Clone the repository.
2. Install dependencies using `npm install`.
3. The project root folder requires a `.env` file with the following variables.
    PORT= port_number_for_node_application
    HOST= database_server_hostname
    USER= database_username
    PASSWORD= database_password
    DB= database_name

## Usage

1. Start the server using `npm start`.
2. Access the API endpoints using a tool like Postman.

## API Endpoints

- **POST /entity**: Insert a new record into the database.
- **GET /entity/:id**: Retrieve details of a specific entity by ID.
- **PUT /entity/:id**: Update details of a specific entity by ID.
- **DELETE /entity/:id**: Delete a specific entity by ID.

## Testing

1. Import the provided Postman collection. (Named as Testing CRUD Operations Endpoints.postman_collection.json)
2. Test the API endpoints.
3. The postman collection contains the guide to test the endpoints.

## Notes

- The project root folder requires a `.env` file with the required variables.
- Project execution requires a database server.
