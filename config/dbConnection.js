const mysql = require('mysql');

const connection = function(){
	return mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : 'eduardo',
		database : 'tricks_and_tips'
	});
}

module.exports = function () {
	return connection;
}