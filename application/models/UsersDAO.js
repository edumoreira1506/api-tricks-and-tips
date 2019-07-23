const crypto = require('crypto');

function UsersDAO(connection){
	this._connection = connection;

	this.insert = (user, callback) => {
		let email = user.email;
		let password = crypto.createHash('md5').update(user.password).digest('hex');
		let username = user.username;
		let description = user.description == null || user.description == undefined ? '' : user.description;

		//let imagePath = user.imagePath == undefined || user.imagePath == '' ? null : 
		
		let bornDate = user.bornDate;
		let token = crypto.createHash('md5').update(`${user.username}.${Date.now()}.comum`).digest('hex');

		this._connection.query('INSERT INTO users (token, email, password, username, description, born_date) VALUES (?, ?, ?, ?, ?, ?)', 
		[token, email, password, username, description, bornDate]
		,callback);
	}

	this.searchByEmail = (email, callback) => {
		this._connection.query('SELECT COUNT(id_user) AS quantity FROM users WHERE email = ?', email, callback);
	}

	this.searchByUsername = (username, callback) => {
		this._connection.query('SELECT COUNT(id_user) AS quantity FROM users WHERE username = ?', username, callback);
	}
}

module.exports = function(){
	return UsersDAO;
}