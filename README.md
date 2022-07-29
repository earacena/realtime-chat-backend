# realtime-chat-webapp
A realtime chat web application written in Typescript.

## Description
This is backend of a forum web application.

### Technologies
  * Typescript
  * PostgreSQL
  * Expressjs
  * Nodejs

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