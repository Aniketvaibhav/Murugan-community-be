# Aarupadaiyappan Community Platform

A modern community platform built with Node.js, TypeScript, and Express.

## Project Overview

Aarupadaiyappan is a community platform that provides a space for users to connect, share, and engage with each other. The platform features user authentication, social media integration, and file upload capabilities.

## Features

- User authentication and authorization
- Social media login (Facebook and Google)
- File upload functionality
- RESTful API architecture
- TypeScript for type safety
- MongoDB database integration
- JWT-based authentication
- CORS support
- Input validation

## Tech Stack

### Backend
- Node.js
- TypeScript
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Passport.js for social authentication
- Multer for file uploads
- Express Validator for input validation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aarupadaiyappan.git
cd aarupadaiyappan
```

2. Install dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Project Structure

```
backend/
├── src/           # Source files
├── uploads/       # Uploaded files
├── dist/          # Compiled JavaScript
├── node_modules/  # Dependencies
├── .env          # Environment variables
├── package.json  # Project configuration
└── tsconfig.json # TypeScript configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
