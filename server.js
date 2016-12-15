
var http = require('http');
var gulp = require('gulp');
const PORT=8888;

function handleRequest(request, response){
    response.end('It Works!! Path Hit: ' + request.url);
}

server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});