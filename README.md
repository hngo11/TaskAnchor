# App Description
TaskAnchor is Issue tracking app that allows teams and members to report, track, assign and manage bugs and issues in a software development project.
Created by Huan Ngo as part of Master's Project for CIS600 at UMassD


## Technologies 
TaskAnchor is full-stack application developed with MERN stack (MongoDB, Express.js, ReactJS, Node.js) and includes authentication with JWT and protected routing as well as Security tools such as Bcrypt for password protection.The core technologies, frameworks, and libraries for this project include:

- Frontend: ReactJS, React-Bootstrap for UI Elements, Vite front-end build tool, JWT-decode for authentication
- Backend: MongoDB, Mongoose, Express, Node.js, CORS
- Authentication and Security: JWT (JSON Web Token), bcrypt
- Tooling: dotenv and GitHub

# API Endpoints

| Method | Route                    | Description                                    | Protection     |
|--------|--------------------------|------------------------------------------------|----------------|          
| POST   | /api/auth/login          | Log in with credentials and receive JWT        | Not Protected  |
| POST   | /api/auth/register       | Registers a new user                           | Not Protected  |
| POST   | /api/newTicket           | Creates a new issue ticket                     | Protected      |
| GET    | /api/allUsers            | Gets all users in the database (PW, exlcuded)  | Protected      |
| GET    | /api/allTickets          | Gets all tickets in the database               | Protected      |
| GET    | /api/user                | Gets the users profile (PW excluded)           | Protected      |
| GET    | /api/users/:userID       | Gets a specific user data                      | Protected      |
| GET    | /api/tickets/:ticketID   | Gets a specific ticket data                    | Protected      |
| PATCH  | /api/update/:ticketID    | Updates ticket objects                         | Protected      | 

# Setup Instructions

# 1. Clone the repository

Use the clone button, or create a codespace for the project.

# 2. Install dependencies

On the main terminal, run the code below to install frontend and backend dependencies.

For frontend, run:  
<br>`cd client` &nbsp; &nbsp; (use ../client if you are in the server folder and not the root folder)
<br>`npm install`


For backend, run:   
<br>`cd server` &nbsp; &nbsp; (use ../server if you are in the client folder and not the root folder)
<br>`npm install`

# 3. Update Environment Variables

In the the .env file inside the server/ directory, edit the MONGODB_URI and JWT_SECRET fields with your own values. (Note: getting the MongoDB connection string requires a mongodb account)

<br>`MONGODB_URI= mongodb_connection_string`
<br>(e.g. mongodb+srv://<db_username>:<db_password>@cluster0.etbixwo.mongodb.net/TaskAnchor)
<br>`PORT=3000`
<br>`JWT_SECRET= jwt_secret` &nbsp; &nbsp; (This can be any string)


# 4. Start the server

On the main terminal, run the code below to start the server.

<br>`cd server`
<br>`node index.js`


# 5. Start the client and View Website

Open a second terminal and run the code below to start the client.

<br>`cd client`
<br>`npm run dev`

You should see a similar link (See below) on the terminal to view the site. Ctrl+LeftClick the link to visit and view the web application
[http://localhost:5173](http://localhost:5173)

