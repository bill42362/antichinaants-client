'use strict'
const Debug = require('debug');
const Fs = require('fs');
const Hapi = require('hapi');
const Http2 = require('http2');

const server = new Hapi.Server();

let listener = Http2.createServer({
    key: Fs.readFileSync('./ssl/localhost.key'),
    cert: Fs.readFileSync('./ssl/localhost.crt')
});

listener.address = listener.address || function() { return this._server.address() }

server.connection({listener: listener, port: '3000', tls: true});
server.route({
    method: 'get', path: '/', handler: (request, reply) => reply('hello world')
});

server.start(err => {
    err && Debug('http2:error')(err);
    Debug('http2')(`Started ${server.connections.length} connections`);
});
