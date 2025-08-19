# MERN Stack Capstone Project

This assignment focuses on designing, developing, and deploying a comprehensive full-stack MERN application that showcases all the skills you've learned throughout the course.

## Assignment Overview

You will:
1. Plan and design a full-stack MERN application
2. Develop a robust backend with MongoDB, Express.js, and Node.js
3. Create an interactive frontend with React.js
4. Implement testing across the entire application
5. Deploy the application to production

## Getting Started

1. Accept the GitHub Classroom assignment
2. Clone the repository to your local machine
3. Follow the instructions in the `Week8-Assignment.md` file
4. Plan, develop, and deploy your capstone project

## Files Included

- `Week8-Assignment.md`: Detailed assignment instructions

## Requirements

- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- npm or yarn
- Git and GitHub account
- Accounts on deployment platforms (Render/Vercel/Netlify/etc.)

## Project Ideas

The `Week8-Assignment.md` file includes several project ideas, but you're encouraged to develop your own idea that demonstrates your skills and interests.

## Submission

Your project will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Commit and push your code regularly
2. Include comprehensive documentation
3. Deploy your application and add the live URL to your README.md
4. Create a video demonstration and include the link in your README.md

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [GitHub Classroom Guide](https://docs.github.com/en/education/manage-coursework-with-github-classroom)

## Deployment

- **Frontend:** Deployed at: [YOUR_FRONTEND_URL_HERE]
- **Backend:** Deployed at: [(https://week-8-capstone-leemo-ui.onrender.com)]

### CI/CD

- Automated testing and deployment are set up using [GitHub Actions/Other CI Tool].
- On every push to `main`, tests run and the app is deployed automatically.

### Monitoring & Error Tracking

- Monitoring is enabled via [e.g., UptimeRobot, Pingdom, etc.].
- Error tracking is configured with [e.g., Sentry, LogRocket, etc.].

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
   cd YOUR-REPO
   ```
2. Install dependencies for both frontend and backend:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env` in both `backend` and `frontend` folders and fill in the required values.
4. Start MongoDB locally or use MongoDB Atlas.
5. Run the backend:
   ```bash
   cd backend
   node server.js
   ```
6. Run the frontend:
   ```bash
   cd frontend
   npm run dev
   ```
7. Visit the frontend URL (usually http://localhost:5173).

## API Documentation

### Authentication

- `POST /api/auth/register`  
  Register a new user.  
  **Body:** `{ name, email, password }`

- `POST /api/auth/login`  
  Login and receive a JWT token.  
  **Body:** `{ email, password }`

### Courses

- `GET /api/courses`  
  Get all courses.

- `GET /api/courses/:id`  
  Get a single course by ID.

- `POST /api/courses`  
  Create a new course (admin only).

- `PUT /api/courses/:id`  
  Update a course (admin only).

- `DELETE /api/courses/:id`  
  Delete a course (admin only).

## User Guide

- Register for an account or login.
- Browse available courses.
- View course details.
- (Admin) Add, update, or delete courses.

## Technical Architecture Overview

- **Frontend:** React (Vite), communicates with backend via REST API, uses Socket.io for real-time updates.
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT authentication, RESTful API, Socket.io for real-time events.
- **Deployment:** [Describe your deployment platform, e.g., Render, Vercel, Netlify, Heroku, etc.]
- **CI/CD:** [Describe your CI/CD setup, e.g., GitHub Actions workflow file, etc.]
- **Monitoring:** [Describe your monitoring/error tracking setup.]

## Presentation

- [Link to video demonstration](YOUR_VIDEO_LINK_HERE)
- [Link to presentation slides](YOUR_SLIDES_LINK_HERE)