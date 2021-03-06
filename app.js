'use strict'
const Debug = require('debug');
const Fs = require('fs');
const Hapi = require('hapi');
const Http2 = require('http2');
const Inert = require('inert');

const server = new Hapi.Server();

let listener = Http2.createServer({
    key: Fs.readFileSync('./ssl/localhost.key'),
    cert: Fs.readFileSync('./ssl/localhost.crt')
});
listener.address = listener.address || function() { return this._server.address() }

let routes = [
    { method: 'get', path: '/{param*}', handler: { directory: {
        path: 'dist/html/reception', redirectToSlash: true, index: ['index.html'],
    } } },
    { method: 'get', path: '/js/{param*}', handler: { directory: { path: 'dist/js', } } },
    { method: 'get', path: '/css/{param*}', handler: { directory: { path: 'dist/css', } } },
];

server.connection({listener: listener, port: '3000', tls: true});
server.register(Inert, () => {});
server.route(routes);
server.start(err => {
    err && Debug('http2:error')(err);
    Debug('http2')(`Started ${server.connections.length} connections`);
});
