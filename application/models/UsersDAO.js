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

	this.countByEmail = (email, callback) => {
		this._connection.query('SELECT COUNT(id_user) AS quantity FROM users WHERE email = ?', email, callback);
	}

	this.countByUsername = (username, callback) => {
		this._connection.query('SELECT COUNT(id_user) AS quantity FROM users WHERE username = ?', username, callback);
	}

	this.login = (username, password, callback) => {
		var password =  crypto.createHash('md5').update(password).digest('hex');

		this._connection.query('SELECT token FROM users WHERE username = ? AND password = ?', [username, password], callback);
	}

	this.searchByToken = (token, callback) => {
		this._connection.query('SELECT * FROM users WHERE token = ?', token, callback);
	}

	this.insertComment = (token, comment, idPost, callback) => {
		this.searchByToken(token, function(error, result){
			this._connection.query('INSERT INTO comments (comment, id_user, id_post) VALUES (?, ?)', [comment, result[0].id_user, idPost], callback);
		})
	}

	this.editComment = (comment, idComment, callback) => {
		this._connection.query('UPDATE comments SET comment = ? WHERE id_comment = ?',[comment, idComment], callback);
	}

	this.deleteComment = (idComment, callback) => {
		this._connection.query('UPDATE comments SET deleted = 1 WHERE id_comment = ?', idComment, callback);
	} 

	this.searchByIdComment = (idComment, callback) => {
        this._connection.query('SELECT users.* FROM comments JOIN users USING(id_user) WHERE id_comment = ?', idComment, callback);
    }
	
}

module.exports = function(){
	return UsersDAO;
}