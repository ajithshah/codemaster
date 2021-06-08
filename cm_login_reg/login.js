var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session'); 
var path = require('path');
var usersModel = require('./usermodel');
const moongoseUtils = require('./moongoseUtils');
var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
})); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (request, response) {
	response.sendFile(path.join(__dirname + '/register.html'));
});
app.get('/registerform', function (request, response) {
	response.sendFile(path.join(__dirname + '/register.html'));
});
app.get('/loginform', function (request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});
app.post('/register', async function (request, response) {
	let reqData = request.body;
	reqData.createdOn = new Date();
	let addUser = new usersModel(reqData);
	await addUser.save().then(function (data) {
		response.redirect('http://127.0.0.1:3000/loginform');
	}).catch(function (error) {
		let errorMessage = moongoseUtils.mongooseErrorHandler(error, reqData.userName);
		response.send(errorMessage);
	});
}); 
app.post('/login', async function (request, response) {
	const userName = request.body.userName; 
	const password = request.body.password;
	await usersModel.findOne({ userName: userName, password: password }).exec().then(function (data) {
		request.session.loggedin = data != null ? true : false;
		request.session.username = userName;
		response.redirect('/home');
	}).catch(function (error) {
		request.session.loggedin = false;
		request.session.username = userName;
		response.redirect('/home'); 
	});
});
app.get('/home', function (request, response) {
	if (request.session.loggedin) {
		response.redirect('http://127.0.0.1:5500/course/courses.html');		
	} 
		else {
		response.send('Invalid Username & Password!');
	}
	response.end();
});
app.listen(3000);