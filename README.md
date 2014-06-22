TimeMachine
===========

TimeMachine is a web server written in Node.js, which keeps track of your everyday life.

Installation
------------
* Prerequisites: mongodb, npm
* Install and update Node.js modules in project folder:
```
npm update
```
* Start the server, with default port 3000:
```
node app.js
```

Now you can visit http://localhost:3000/ to test your installation

Startup Parameters
------------------
Set server listening port and app path:
```
export PORT=1234
node app.js "/time"
```  
Now TimeMachine is located at http://localhost:1234/time/
