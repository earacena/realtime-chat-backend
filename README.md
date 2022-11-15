# Real-time Chat Web Application, Backend

## Description
The backend for a realtime chat web application written in Typescript. Deployed live [here]()

The frontend repository of this project can be found [here](https://github.com/earacena/forum-app-frontend).

### Routes
  * /api/login
  * /api/messages
  * /api/requests
  * /api/users

### Technologies
  * Typescript
  * PostgreSQL
  * Expressjs
  * Nodejs
  * Socket.io

## Usage
### Download
While in terminal with chosen directory, enter the command:
```
git clone https://github.com/earacena/realtime-chat-backend.git
```

### Install
While in the root project folder, enter the command:
```
npm install
```

### Setup
In order to run the backend, deploy locally, or run tests, a .env file with the following variables must be in root project folder:
```
DEV_DATABASE_URL="postgres://pguser:pgpass@localhost:3003/pgdb"
TEST_DATABASE_URL="postgres://pguser:pgpass@localhost:3003/test_pgdb"
DATABASE_URL="postgres://..." # For live deployment, add connection URL for database 
PORT=3001
SECRET_JWT_KEY="abcd1234" # Generate your own key and paste here
```

### Deploy locally for development
In one terminal, run the following in the root project folder:
```
docker-compose -f docker-compose.dev.yml up --build
```

In another terminal, run:
```
npm run dev
```