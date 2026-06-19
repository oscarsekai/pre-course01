const header = require('./header');

function sendResponse(res, statusCode, data, status = 'success') {
  res.writeHead(statusCode, header);
  res.write(
    JSON.stringify({
      status,
      data,
    }),
  );
  res.end();
}

module.exports = sendResponse;