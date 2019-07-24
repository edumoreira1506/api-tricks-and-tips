function TokensDAO(connection){
	this._connection = connection;

	this.isValid = (token, callback) => {
        this._connection.query('SELECT COUNT(id_user) AS valid FROM users WHERE token = ?', token, callback);
    }
}

module.exports = function(){
	return TokensDAO;
}