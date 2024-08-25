# URL Shortener Project

This is a URL Shortener web application that allows users to shorten long URLs, track their visits, and analyze the visit statistics, such as daily visits and country-based visits. The project is built using Node.js, Express, MongoDB, and EJS templating.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Features](#features)
- [Middleware](#middleware)
- [License](#license)

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/url-shortener.git
    cd url-shortener
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root of your project and configure your environment variables. Refer to the [Environment Variables](#environment-variables) section.

4. Start the development server:

    ```bash
    npm run dev
    ```

5. Visit `http://localhost:3000` in your browser.

## Environment Variables

You need to set up the following environment variables in your `.env` file:

```env
PORT=3000
MONGO_URI=your_mongo_uri
SECRET=your_session_secret
PORT: The port on which the server will run.
MONGO_URI: The MongoDB connection string.
SECRET: A secret key used for session management.
```

## Project Structure
Here's an overview of the project structure:

```bash
├── config.json           # Configuration file for the app
├── middleware/           # Middleware files
│   ├── errorLogger.js    # Logs errors and handles them
│   ├── requireLogin.js   # Middleware to protect routes
│   └── prank.js          # Middleware for prank endpoint
├── models/               # Mongoose models
│   ├── Link.js           # Schema for storing link information
│   └── User.js           # Schema for user authentication
├── routes/               # Express routes
│   ├── analyse.js        # Route for analysis page
│   ├── dashboard.js      # Route for dashboard page
│   ├── index.js          # Main route
│   ├── login.js          # Route for login page
│   ├── signup.js         # Route for signup page
│   └── api/              # API-related routes
├── public/               # Static files
├── views/                # EJS templates
│   ├── index.ejs         # Homepage template
│   ├── dashboard.ejs     # Dashboard template
│   ├── analyse.ejs       # Analysis page template
│   ├── login.ejs         # Login page template
│   ├── signup.ejs        # Signup page template
│   ├── 404.ejs           # 404 error page template
│   └── 500.ejs           # 500 error page template
├── app.js                # Main application file
├── .env                  # Environment variables
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## Usage
### Authentication
- Signup: Navigate to `/signup` to create a new user account.
- Login: Navigate to `/login` to log in with an existing account.
- URL Shortening Create Short URL: After logging in, use the homepage form to submit a long URL and generate a shortened version. You can also specify an expiration date or custom keyword.
- Dashboard: View and manage all your shortened URLs, sort them by date, visits, etc.
### Analysis
- Analyse Links: Navigate to `/analyse/:redirectString` to view visit statistics for a specific shortened URL, including daily visits and country-based visits.

## Features
- User Authentication: Secure user login and registration with hashed passwords.
- Shorten URLs: Convert long URLs into short, easily shareable links.
- Tracking & Analytics: Track visits by country and date, and analyze usage patterns.
- QR Code Generation: Generate QR codes for shortened URLs.
- Link Management: Edit, delete, and toggle the active status of shortened URLs.
- Error Handling: Custom 404 and 500 error pages.
- Middleware: Prank middleware for fun, error logging, and user authentication.

## Middleware
`errorLogger.js`
- logError: Logs errors into a file for debugging purposes.
- errorHandler: Handles errors and sends appropriate responses to the client.
`requireLogin.js`
- Protects routes by ensuring that only logged-in users can access them.
`prank.js`
- A fun middleware that could be used to play pranks on users.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
