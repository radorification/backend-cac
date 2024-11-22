# StreamTube

-[Data Model Link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)



## Overview

**StreamTube** is an production-level backend video streaming app with features like video uploads, streaming, watch history, subscriptions, comments, profile customization (avatars/cover images), JWT-based authentication, MongoDB for robust data management, secure password hashing with bcrypt, file handling via Cloudinary, and advanced aggregation pipelining, built to industry standards.

## Features

- **Authentication and Authorization**: Implements secure user authentication using JSON Web Tokens (JWT) with access and refresh token mechanisms.
- **Password Security**: Ensures secure password management using bcrypt for proper password hashing.
- **File Handling**: Efficiently manages video, avatar, and cover image uploads with Cloudinary's robust file-handling capabilities.
- **Database Management**: Uses MongoDB for efficient storage and management of all user and video-related data.
- **Aggregation Pipelining**: Supports complex data analytics and efficient query handling using MongoDB aggregation pipelines.
- **Scalability and Reliability**: Designed to meet industry standards for scalability, maintainability, and performance.
- This backend application serves as a powerful foundation for a video streaming platform and is fully equipped for integration with a frontend application or API clients for real-world use cases.

## Usage

1. **Clone the Repository**
    ```bash
    git clone https://github.com/radorification/backend-cac
    cd backend-cac
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Start the Server**
    ```bash
    npm run start
    ```

4. **API Testing:**

Use Postman or any other API testing software to test the endpoints listed below. Send requests to http://localhost:5000/<endpoint>:

## Endpoints

**User Authentication and Management:**

- **POST /registerUser**: Register a new user
- **POST /loginUser**: Login a user and receive access and refresh tokens.
- **POST /logoutUser**: Logout the current user.
- **POST /refreshAccessToken**: Get a new access token using a refresh token.
- **POST /changeCurrentPassword**: Change the password of the current user.


**User Profile Management:**

- **POST /fetchCurrentUser**: Fetch the current user's information.
- **PATCH /updateUsername**: Update the username of the current user.
- **PATCH /updateFullname**: Update the full name of the current user.
- **PATCH /updateUserAvatar**: Upload or update the user's profile avatar.
- **PATCH /updateUserCoverImage**: Upload or update the user's cover image.


## Notes

1. Ensure the database connection is properly configured in the project settings.
2. For authentication-required endpoints, include a valid JWT token in the headers (e.g., Authorization: Bearer <token>).
3. Follow the API documentation or code comments for request payloads and response formats.

This setup allows you to explore and test the backend features of the app.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or feedback, please contact [kumarankur131@gmail.com.com](mailto:kumarankur131@gmail.com).
