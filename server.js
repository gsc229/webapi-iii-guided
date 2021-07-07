const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const hubsRouter = require('./hubs/hubs-router.js');
const morgan = require('morgan');

const server = express();

//the three amigos
function dateLogger(req, res, next) {
  console.log(new Date().toISOString());

  next();
}
// change the gatekeeper to return a 400 if no password is provided and a message
// that says please provide a password
// if a password is provided and it is mellon, call next, otherwise return a 401
// and the you shall not pass message
function gateKeeper(req, res, next) {
  //data can come in on the body, params, query string, headers
  const password = req.headers.password;
  if (!password) {
    res.status(400).json({ message: "You did not provide a password" })
    console.log("YOU DID PROVIDE A PASSWORD!")
  }
  else if (password.toLowerCase() === 'mellon') {
    console.log("CORRECT PASSWORD! YOU SHALL PASS!!!")
    next();
  } else {
    console.log("WRONG PASSWORD!")
    res.status(401).json({ you: 'cannot pass!!!' });
  }
}

//global middleware: runs on every requests that comes into the server. 
server.use(helmet()); // third party middleware
server.use(express.json());
server.use(gateKeeper);
server.use(dateLogger); //custom middleware -not invoked


server.use('/', function (req, res, next) { // GET 'http://www.example.com/admin/new'
  console.log(req.originalUrl) // '/admin/new'
  console.log(req.baseUrl) // '/admin'
  console.log(req.path) // '/new'
  console.log(req.method)
  next()
})

server.use('/api/hubs', hubsRouter);
server.use(morgan('dev'));


server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

module.exports = server;
