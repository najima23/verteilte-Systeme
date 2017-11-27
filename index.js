const express = require('express'); /* Import Express-Middleware */
const app = express(); /* Start Instanz of Express */
const port = 30000; /* Define the Port */
const moment = require('moment'); /* Import Moment do display time sexy, instead of new Date()... */

/* Create a middleware to be processed on every request, which sets the Content-Type to text/html, 'next' is a NodeJS Pattern for Middlewares */
function setHTML(req, res, next) {
  res.header('Content-Type', 'text/html');
  next();
}

/* use setHTML middleware in app */
app.use(setHTML);

/* NodeJS/Express is really performant and checks the ETAGS if the request etag is the same as the response etag, it does
 * not send the body @all. So in the first call we get Status-Code 200, after that we get 304 (content not modified), until the time changes!. To force
 * a status Code of 200 we need to disable etags */
app.disable('etag');

/* define the catch-all route to handle all incoming routes. Display results in console.log and send the response with time */
app.get('*', (req, res) => {
  const time = new moment().format('HH:mm');
  const html = `<html><body>${time}</body></html>`;
  /* Calculate length of Content and send output to console.log */
  const length = Buffer.byteLength(html, 'utf8');

  /* If StatusCode is 200, set StatusMessage to "OK". */
  if (res.statusCode === 200) {
    res.statusMessage = 'Ok';
  }
  console.log('===========================================')
  console.log(`Content-Type: ${res.get('Content-Type')}`)
  console.log(`HTTP/${req.httpVersion} ${res.statusCode} ${res.statusMessage}`)
  console.log(`Content-Length: ${length} Bytes`)
  console.log(html)
  console.log('===========================================')

  /* you can also skip it and check in Browser if you don't believe the Byte count =) */
  res.header('Content-Length', length);
  /* Status can be skipped, 200 is the default on "successfull request" */
  res.status('200').send(html);
});

/* Start the Server on defined Port */
app.listen(port, () => {
  console.log(`Connected to Port: ${port}. Please visit http://localhost:${port}`);
});
