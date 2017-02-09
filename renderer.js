// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

require(__dirname + '/app/service/torrent-service');
require(__dirname + '/app/app');

// const io = require('socket.io-client')
// var socket = null;

// const saySomething = function () {
//     console.log('try to print something!!!');
// }

// console.log(angular);

console.log('require libs loaded');