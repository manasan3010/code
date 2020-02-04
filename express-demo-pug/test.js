var http = require('http');
var events = require('events');
var fs = require('fs');
express = require('express');

app = express()

fs.readFile('package.json', function (err, data) {
    if (err) return;
    console.log(JSON.parse(data.toString())["name"])
})

var server = http.createServer(app)

app.get('/t', function (req, res) {
    // res.redirect('//ata.com')
    res.end('<div></div>')
    eventEmitter.emit('requested')
})

server.listen(3000, '127.0.0.1', () => console.log('Server Started Woohoo!!!'))


var eventEmitter = new events.EventEmitter()

eventEmitter.on('requested', function () {
    console.log('Emitted ')
})
