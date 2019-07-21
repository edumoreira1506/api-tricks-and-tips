const mysql = require('mysql');

const connection = function(){
	return mysql.createConnection({
		host : 'localhost',
		user : 'api',
		password : '102030',
		database : 'tricks_and_tips'
	});
}

module.exports = function () {
	return connection;
}