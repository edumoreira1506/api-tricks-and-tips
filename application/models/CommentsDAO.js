function CommentsDAO(connection){
	this._connection = connection;

    this.insert = (idUser, comment, idPost, callback) => {
		this._connection.query('INSERT INTO comments (comment, id_user, id_post) VALUES (?, ?)', [comment, idUser, idPost], callback);
    }
    
    this.edit = (comment, idComment, callback) => {
		this._connection.query('UPDATE comments SET comment = ? WHERE id_comment = ?',[comment, idComment], callback);
	}

	this.drop = (idComment, callback) => {
		this._connection.query('UPDATE comments SET deleted = 1 WHERE id_comment = ?', idComment, callback);
	} 
	
}

module.exports = function(){
	return CommentsDAO;
}