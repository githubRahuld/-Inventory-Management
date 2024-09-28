# Inventory Management API

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

The **Inventory Management API** is a backend system designed to facilitate product management, including user registration, product uploads, admin review processes, and public product visibility. The API supports functionalities for both users and admins, allowing efficient management of inventory and product statuses.

## Features

- **User Authentication**: Users can register and log in securely.
- **Product Management**: Users can upload products with details such as name, description, price, quantity, and images.
- **Admin Dashboard**: Admins can review, approve, or reject products and manage their publication status.
- **Role-Based Access Control**: Different functionalities for users and admins.
- **Cloud Storage Integration**: Product images are uploaded to Cloudinary for efficient storage and retrieval.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: NoSQL database for storing user and product data.
- **Multer**: Middleware for handling file uploads.
- **Cloudinary**: Image storage service for managing product images.
- **OpenAPI/Swagger**: For API documentation.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/githubRahuld/-Inventory-Management.git
   cd inventory-management-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```plaintext
   MONGODB_URI=your_mongodb_connection_string
   CLOUDINARY_URL=your_cloudinary_url
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Usage

- The API runs on `http://localhost:8000`.
- Use tools like Postman or CURL to interact with the API endpoints.

### Example Endpoints:

- **User Registration**: `POST /register`
- **User Login**: `POST /login`
- **Admin Approve Product**: `POST /admin/products/approve/:id`
- **Admin Reject Product**: `POST /admin/products/reject/:id`
- **Admin publish Product**: `POST /admin/products/publish/:id`
- **List Approved Products**: `GET /products`

## API Documentation

For detailed API documentation, visit the Swagger UI at `http://localhost:3000/api-docs`.

## Contributing

Contributions are welcome! If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
