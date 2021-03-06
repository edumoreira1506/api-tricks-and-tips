const crypto = require('crypto');

function UsersDAO(connection){
	this._connection = connection;

	this.insert = (user, callback, admin = false) => {
		let email = user.email;
		let password = crypto.createHash('md5').update(user.password).digest('hex');
		let username = user.username;
		let description = user.description == null || user.description == undefined ? '' : user.description;
		let imagePath = user.imagePath == null || user.imagePath == undefined || user.imagePath == '' ? null : user.imagePath;		
		let bornDate = user.bornDate;

		let token = crypto.createHash('md5').update(`${user.username}.${Date.now()}.comum`).digest('hex');

		if(admin){
			this._connection.query('INSERT INTO users (admin, token, email, password, username, description, born_date, image_path) VALUES (1, ?, ?, ?, ?, ?, ?, ?)', 
			[token, email, password, username, description, bornDate, imagePath]
			,callback);
		}else{
			this._connection.query('INSERT INTO users (token, email, password, username, description, born_date, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)', 
			[token, email, password, username, description, bornDate, imagePath]
			,callback);
		}
	}

	this.edit = (email, password, description, imagePath, token, callback) => {
		this._connection.query('UPDATE users SET email = ?, password = ?, description = ? WHERE token = ?', [email, password, description, token], callback);
	}

	this.drop = (token, callback) => {
		this._connection.query('UPDATE users SET deleted = 1 WHERE token = ?', token, callback);
	}

	this.countByEmail = (email, callback) => {
		this._connection.query('SELECT COUNT(id_user) AS quantity FROM users WHERE email = ?', email, callback);
	}

	this.countByEmailToken = (email, token, callback) => {
		this._connection.query('SELECT COUNT(id_user) AS quantity FROM users WHERE email = ? AND token <> ?', [email, token], callback);
	}

	this.countByUsername = (username, callback) => {
		this._connection.query('SELECT COUNT(id_user) AS quantity FROM users WHERE username = ?', username, callback);
	}

	this.login = (username, password, callback) => {
		var password =  crypto.createHash('md5').update(password).digest('hex');
		this._connection.query('SELECT token, username, admin, image_path FROM users WHERE username = ? AND password = ? AND deleted = 0', [username, password], callback);
	}

	this.searchByToken = (token, callback) => {
		this._connection.query('SELECT * FROM users WHERE token = ? AND deleted = 0', token, callback);
	}

	this.searchByIdComment = (idComment, callback) => {
        this._connection.query('SELECT users.* FROM comments JOIN users USING(id_user) WHERE id_comment = ?', idComment, callback);
    }
	
}

module.exports = function(){
	return UsersDAO;
}