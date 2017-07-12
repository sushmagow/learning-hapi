const Hapi = require('hapi');
const Path = require('path');
const server = new Hapi.Server();

const mysql = require('mysql');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'hapi'
});

connection.connect();

//connection.end();

server.connection({
	host: 'localhost',
	port: 3000
});

const io = require('socket.io')(server.listener);

// get post delete

//server register
server.register([require('inert'),require('vision')], function (err) {
	if(err){
		throw err;
	}
	server.route({
		method: 'GET',
		path: '/',
		handler: function (request, reply) {
			reply('Main page');
		}
	});

	server.route({
		method: 'GET',
		path: '/hello',
		handler: function (request, reply){
			reply('HELLO WORLD');
		}
	});

	server.route({
		method: 'GET',
		path: '/image',
		handler: function (request, reply) {
			reply('<img src="/assets/images.png">');
		}
	});
	//servering static files
	server.route({
		method: 'GET',
		path: '/assets/images.png',
		handler: function (request, reply) {
			reply.file('assets/images.png');
		}
	});

	server.route({
		method: 'GET',
		path: '/user/{username}',
		handler: function (request, reply){
			let username = encodeURIComponent(request.params.username);
			reply(`Hello ${username}`);
		}
	});

	//views
	server.views({
		engines: {
			html: require('handlebars')
		},
		relativeTo: __dirname,
		path: 'templates'
	});

	server.route({
		method: 'GET',
		path: '/index',
		handler: function (request, reply) {
			reply.view('index', {name: 'Su'});
		}
	});

	server.route({
		method: 'GET',
		path: '/index/{username}',
		handler: function (request, reply) {
			let username = encodeURIComponent(request.params.username);
			reply.view('index', {name: username});
		}
	});

	//mysql connections
	server.route({
		method: 'GET',
		path: '/mysql',
		handler: function (request, reply) {
			connection.query('SELECT * FROM People', function (error, results, fields) {
			  if (error) throw error;
			  reply(`The Name is: ${results[0].NAME} with ID ${results[0].ID}`);
			});
		}
	});

	//socket io

	server.route({
		method: 'GET',
		path: '/socketio',
		handler: function (request, reply){
			reply.file('templates/socketio.html');
		}
	});

});

io.on('connection', function (socket) {
	socket.emit('news', 'hi');

	socket.on('burp', function (data) {
		console.log('data:', data);
	})
});
server.start(function(){
	console.log('server started', server.info.uri);
});

