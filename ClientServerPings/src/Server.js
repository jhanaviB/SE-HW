import http from 'http';
import querystring from 'querystring';
import xml2js from 'xml2js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const handleRequest = async (request, response) => {
  if (request.method === 'POST') {
    let content = '';

    request.on('data', (data) => {
      content += data;
    });

    request.on('end', async () => {
      const contentType = request.headers['content-type'];

      if (contentType === 'application/json') {
        try {
          const jsonData = JSON.parse(content);
          console.log('Received JSON data:', jsonData);
          await delay(30); 
          response.statusCode = 200;
          response.setHeader('content-type', 'application/json');
          response.end(JSON.stringify(jsonData));
        } catch (error) {
          await delay(30);
          response.statusCode = 400;
          response.setHeader('content-type', 'text/plain');
          response.end('Error: Invalid JSON format');
        }
      } else if (contentType === 'application/x-www-form-urlencoded') {
        const formData = querystring.parse(content);
        await delay(30);
        response.statusCode = 200;
        response.setHeader('content-type', 'application/x-www-form-urlencoded');
        response.end(JSON.stringify(formData));
      } else if (contentType === 'application/xml') {
        const parser = new xml2js.Parser();

        parser.parseString(content, async (err, result) => {
          if (err) {
            await delay(30);
            response.statusCode = 400;
            response.setHeader('content-type', 'application/json');
            response.end(JSON.stringify({ error: 'Invalid XML' }));
          } else {
            await delay(30);
            response.statusCode = 200;
            response.setHeader('content-type', 'application/json');
            response.end(JSON.stringify(result));
          }
        });
      } else {
        await delay(30);
        response.statusCode = 415;
        response.setHeader('content-type', 'text/plain');
        response.setHeader('Accept', 'application/json, application/xml, application/x-www-form-urlencoded');
        response.end('Error: Unsupported Content-Type');
      }
    });
  } else if (request.method === 'GET') {
    await delay(30);
    response.statusCode = 200;
    response.setHeader('content-type', 'application/json');
    response.end(JSON.stringify('Return'));
  } else {
    await delay(30);
    response.statusCode = 405;
    response.setHeader('Allow', 'POST/GET');
    response.end('Error: Method Not Allowed');
  }
};

const server = http.createServer(handleRequest);

const port = 2090;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default server;
