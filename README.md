# TS Auth API

A robust TypeScript-based authentication API built with Node.js and Express, providing secure user authentication and authorization functionality.

## 🚀 Features

- **User Registration & Login** - Secure user account creation and authentication
- **JWT Token Authentication** - Stateless authentication using JSON Web Tokens
- **Password Hashing** - Secure password storage using bcrypt
- **Input Validation** - Comprehensive request validation and sanitization
- **Error Handling** - Centralized error handling with detailed logging
- **TypeScript Support** - Full TypeScript implementation for type safety
- **Environment Configuration** - Configurable environment variables

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB or your preferred database

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/sachinggsingh/ts-auth-api.git
cd ts-auth-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
PORT=3000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
```

4. Build the TypeScript code:
```bash
npm run build
```

5. Start the development server:
```bash
npm run dev
```

## 📚 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | `{ email, password, name }` |
| POST | `/api/auth/login` | Login user | `{ email, password }` |
| POST | `/api/auth/logout` | Logout user | - |
| GET | `/api/auth/me` | Get current user | - |

### Protected Routes

| Method | Endpoint | Description | Headers |
|--------|----------|-------------|---------|
| GET | `/api/users/profile` | Get user profile | `Authorization: Bearer <token>` |
| PUT | `/api/users/profile` | Update user profile | `Authorization: Bearer <token>` |

## 🔧 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 📁 Project Structure

```
ts-auth-api/
├── src/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── app.ts           # Express app configuration
├── dist/                # Compiled JavaScript (generated)
├── logs/                # Application logs
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Security Features

- **Password Hashing**: Uses bcrypt for secure password storage
- **JWT Authentication**: Stateless authentication with configurable expiration
- **Input Validation**: Validates and sanitizes all user inputs
- **Rate Limiting**: Prevents brute force attacks
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Helmet Integration**: Sets various HTTP headers for security

## 🧪 Testing

Run the test suite:

```bash
npm test
```

For test coverage:

```bash
npm run test:coverage
```

## 📝 Environment Variables

Create a `.env` file based on `.env.example`:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | Database connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `BCRYPT_SALT_ROUNDS` | Bcrypt salt rounds | `12` |
| `NODE_ENV` | Environment mode | `development` |

## 🚀 Deployment

### Using Docker

1. Build the Docker image:
```bash
docker build -t ts-auth-api .
```

2. Run the container:
```bash
docker run -p 3000:3000 --env-file .env ts-auth-api
```


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 👨‍💻 Author

**Sachin Singh** - [sachinggsingh](https://github.com/sachinggsingh)

## 🙏 Acknowledgments

- Express.js team for the excellent web framework
- TypeScript team for bringing type safety to JavaScript
- All contributors who help improve this project

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/sachinggsingh/ts-auth-api/issues) page
2. Create a new issue if your question isn't already addressed
3. Reach out via email or social media

---

⭐ Star this repository if you find it helpful!
```

This README.md file provides comprehensive documentation for your TypeScript authentication API project [^1][^3]. It includes all the essential sections that make it easy for developers to understand, install, and contribute to your project.

