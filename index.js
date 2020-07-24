const express = require('express');

const server = express();

server.use(express.json());

//localhost:3000/teste 
//query parms = ?teste=1
//Route parms = /users/1
//Request body = { "name": "Tiago", "email": "tiagomonteiro1@outlook.com.br"}
//CRUD - Create, Read, Update, Delete etc

const users = ['Tiago', 'Keli', 'Willians', 'Rozenval', 'Odaleria'];

server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  
  next();
  console.timeEnd('Request');
});

function checkUserExists(req, res, next){
  if (!req.body.name){
    return res.status(400).json({ error : 'User name is required'});
  }

  return next();
}

function checkUserInArray (req, res, next){
  const user = users[req.params.index]
  if(!user) {
    return res.status(400).json({ error : 'User does not exixts'});
  }
  
  req.user = user;

  return next();
}
server.get('/users', checkUserInArray, (req, res) => {
return res.json(users);
})
server.get('/users/:index', checkUserInArray, (req, res) => {
    return res.json(req.user);
})
server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
})
server.put('/users/:index', checkUserInArray, checkUserExists, (req, res)=> {
  const { index } = req.params;
  const {name} = req.body;

  users[index] = name;

  return res.json(users);
}); 

server.delete ('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);
  
  return res.send();
});

server.listen(3000);