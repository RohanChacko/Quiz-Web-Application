# Quiz Web Application

Quiz Web App made with React for frontend and Go for frontend. Go uses the Gin framework and Material UI is used in React

## Install dependencies

### Installing node and yarn
  * Ubuntu:
  ```bash
  curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
  sudo apt-get install -y nodejs
  npm install -g yarn
  ```

  * MacOS:
  ```bash
  brew install node   
  npm install -g yarn
  ```
``` yarn install ```

## Running the Application

### Running the backend
``` go run server.go ```

### Running the frontend
``` yarn start ```

## Directory Structure
```
├── backend
│   └── src
│       ├── app
│       │   └── app.go
│       ├── routes
│       │   ├── callback
│       │   │   └── callback.go
│       │   └── login
│       │       └── login.go
│       ├── server.db
│       └── server.go
├── frontend
│   └── quiz_app
│       ├── package.json
│       ├── package-lock.json
│       ├── public
│       │   ├── favicon.ico
│       │   ├── index.html
│       │   └── manifest.json
│       ├── src
│       │   ├── components
│       │   │   ├── App.css
│       │   │   ├── App.js
│       │   │   ├── Dashboard.js
│       │   │   ├── Home.css
│       │   │   ├── Home.js
│       │   │   ├── LeaderBoard.js
│       │   │   ├── MulChoice.js
│       │   │   ├── Question.js
│       │   │   ├── Quiz.js
│       │   │   ├── Register.js
│       │   │   └── TakeQuiz.js
│       │   ├── index.css
│       │   ├── index.js
│       │   └── registerServiceWorker.js
│       └── yarn.lock
└── README.md ```

## Additional Notes

* Basic form of user authentication implemented using cookies
* Admin user can create, edit, delete quizes
* Various levels of diffculty for a range of genres available
* All frontend components were made using Material UI
