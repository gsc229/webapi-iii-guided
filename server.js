const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

//the three amigos
function dateLogger(req, res, next) {
  console.log(new Date().toISOString());

  next();
}

//global middleware: runs on every requests that comes into the server. 
server.use(helmet()); // third party middleware
server.use(express.json());
server.use(dateLogger); //custom middleware -not invoked

server.use('/', function (req, res, next) { // GET 'http://www.example.com/admin/new'
  console.log(req.originalUrl) // '/admin/new'
  console.log(req.baseUrl) // '/admin'
  console.log(req.path) // '/new'
  console.log(req.method)
  next()
})

server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

module.exports = server;
