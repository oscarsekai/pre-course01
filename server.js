const http = require('http');
const { v4: uuidv4 } = require('uuid');
const sendResponse = require('./sendResponse');
const handleError = require('./errorHandle');
const headers = require('./header');
const todos = [];
const requestListner = (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  if (req.url === '/todos' && req.method === 'GET') {
    sendResponse(res, 200, todos);
  } else if (req.url === '/todos' && req.method === 'POST') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        const isValidTitle = typeof title === 'string' && title.trim() !== '';
        if (isValidTitle) {
          todos.push({
            id: uuidv4(),
            title,
          });
          sendResponse(res, 200, todos);
        } else {
          handleError(res);
        }
      } catch (error) {
        handleError(res);
      }
    });
  } else if (req.url === '/todos' && req.method === 'DELETE') {
    todos.length = 0;
    sendResponse(res, 200, todos);
  } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todos.findIndex((item) => item.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
      sendResponse(res, 200, todos);
    } else {
      handleError(res);
    }
  } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        const id = req.url.split('/').pop();
        const index = todos.findIndex((item) => item.id === id);
        const isValidTitle = typeof title === 'string' && title.trim() !== '';
        if (isValidTitle && index !== -1) {
          todos[index].title = title;
          sendResponse(res, 200, todos);
        } else {
          handleError(res);
        }
      } catch (error) {
        handleError(res);
      }
    });
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  }
};

const server = http.createServer(requestListner);
const port = process.env.PORT || 3000;
server.listen(port, '0.0.0.0');
