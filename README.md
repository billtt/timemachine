TimeMachine
===========

TimeMachine is a web server written in Node.js, which keeps track of your everyday life.

Installation of TimeMachine is quite easy:
1. Prerequisites: mongodb, npm
2. run "npm update" in project folder to install and update Node.js modules
3. run "node app.js" to start the server, the default port is 3000
Now you can visit http://localhost:3000/ to test your installation

Startup parameters:

Set server listening port and app path:
  export PORT=1234
  node app.js "/time"
Now TimeMachine is located at http://localhost:1234/time/
