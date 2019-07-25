module.exports = app => {

    const comment = (req, res) => {
        if(!req.header('token') || !req.body.comment || !req.body.idPost){
            let response = {
                status: false,
                message: 'Campos obrigatórios: Token, id do post e comentários.'
            }

            res.send(response)
        }else{
            let token = req.header('token');
            let comment = req.body.comment;
            let idPost = req.body.idPost;

            let connection = app.config.dbConnection();
            let tokenValidation = new app.application.models.TokensDAO(connection);
    
            tokenValidation.isValid(token, function(error, result){
                if(result[0].valid){
                    let commentDb = new app.application.models.CommentsDAO(connection);
                    let user = new app.application.models.UsersDAO(connection);

                    user.searchByToken(token, function(error, result){
                        commentDb.insert(result[0].id_user, comment, idPost, function(error, result){
                            if(error){
                                let response = {
                                    status: false,
                                    message: 'Erro interno no servidor'
                                }
                            }else{
                                let response = {
                                    status: true
                                }
                            }
    
                            res.send(response)
                        })  
                    })
                }else{
                    let response = {
                        status: false,
                        message: 'Desculpe, token inválido.'
                    }

                    res.send(response)
                }
            })
        }
        
    }

    const edit = (req, res) => {
        if(!req.header('token') || !req.body.comment || !req.body.idComment){
            let response = {
                status: false,
                message: 'Campos obrigatórios: Token, comentário, id do comentário.'
            }

            res.send(response)
        }else{
            let token = req.header('token');
            let comment = req.body.comment;
            let idComment = req.body.idComment;

            let connection = app.config.dbConnection();
            let tokenValidation = new app.application.models.TokensDAO(connection);
    
            tokenValidation.isValid(token, function(error, result){
                if(result[0].valid){
                    let user = new app.application.models.UsersDAO(connection);

                    user.searchByIdComment(idComment, function(error, result){
                        if(error){
                            let response = {
                                status: false,
                                message: 'Erro interno no servidor!'
                            }

                            res.send(response)
                        }else if(token != result[0].token){
                            let response = {
                                status: false,
                                message: 'Token incorreto do comentário.'
                            }

                            res.send(response)
                        }else{
                            let commentDb = new app.application.models.CommentsDAO(connection);

                            commentDb.edit(comment, idComment, function(error, result){
                                if(error){
                                    let response = {
                                        status: false,
                                        message: 'Erro interno no servidor!'
                                    }
                                }else{
                                    let response = {
                                        status: true,
                                    }
                                }

                                res.send(response)
                            })
                        }
                    })
                }else{
                    let response = {
                        status: false,
                        message: 'Desculpe, token inválido.'
                    }

                    res.send(response)
                }
            })
        }
    }

    const drop = (req, res) => {
        if(!req.header('token') ||  !req.body.idComment){
            let response = {
                status: false,
                message: 'Campos obrigatórios: Token, e id do comentário.'
            }

            res.send(response)
        }else{
            let token = req.header('token');
            let idComment = req.body.idComment;

            let connection = app.config.dbConnection();
            let tokenValidation = new app.application.models.TokensDAO(connection);
    
            tokenValidation.isValid(token, function(error, result){
                if(result[0].valid){
                    let user = new app.application.models.UsersDAO(connection);

                    user.searchByIdComment(idComment, function(error, result){
                        if(error){
                            let response = {
                                status: false,
                                message: 'Erro interno no servidor!'
                            }

                            res.send(response)
                        }else if(token != result[0].token){
                            let response = {
                                status: false,
                                message: 'Token incorreto do comentário.'
                            }

                            res.send(response)
                        }else{
                            let commentDb =  new app.application.models.CommentsDAO(connection);

                            commentDb.drop(idComment, function(error, result){
                                if(error){
                                    let response = {
                                        status: false,
                                        message: 'Erro interno no servidor!'
                                    }
                                }else{
                                    let response = {
                                        status: true,
                                    }
                                }

                                res.send(response)
                            })
                        }
                    })
                }else{
                    let response = {
                        status: false,
                        message: 'Desculpe, token inválido.'
                    }

                    res.send(response)
                }
            })
        }
    }

    return { comment, edit, drop }
}