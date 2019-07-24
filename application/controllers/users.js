module.exports = app => {

    const login = (req, res) => {
    	if(!req.body.password || !req.body.username){
            let response = {
                status: false,
                message: "Nome de usuário e senha são obrigatórios!"
            }

            res.send(response)
        }else{
            let connection = app.config.dbConnection();
            let user = new app.application.models.UsersDAO(connection);

            user.login(req.body.username, req.body.password, function(error, result){
                if(result.length == 0){
                    let response = {
                        status: false,
                        message: "Nome de usuário ou senha inválidos!"
                    }
                }else{
                    let response = {
                        status: true,
                        message: "Login efetuado com sucesso!",
                        token: result[0].token
                    }
                }

                res.send(response)
            }) 
        }
    }

    const register = (req, res) => {
    	if(!req.body.email || !req.body.password || !req.body.confirmPassword || !req.body.username || !req.body.bornDate){
            let response = {
                status: false,
                message: "Email, senha, confirmação de senha, nome de usuário e data de nascimento são obrigatórios!"
            }

            res.send(response)
        }else if(req.body.password != req.body.confirmPassword){
            let response = {
                status: false,
                message: "Senha e confirmação de senha estão diferentes!"
            }

            res.send(response)
        }else if(req.body.password.length >= 18 || req.body.password.length < 8){
            let response = {
                status: false,
                message: "Senha precisa ter entre 8 a 18 caracteres!"
            }

            res.send(response)
        }else{
            let connection = app.config.dbConnection();
            let user = new app.application.models.UsersDAO(connection);

            user.countByEmail(req.body.email, function(error, result){
                if(result[0].quantity == 0){
                    user.countByUsername(req.body.username, function(error, result){
                        if(result[0].quantity == 0){
                            user.insert(req.body, function(error, result){
                                if(error) {
                                    let response = {
                                        status: false,
                                        message: "Erro interno no servidor!"
                                    }
                        
                                    res.send(response)
                                }else if(result.affectedRows == 1){
                                    let response = {
                                        status: true,
                                        message: "Usuário cadastrado com sucesso!"
                                    }
                        
                                    res.send(response)
                                }
                            })
                        }else{
                            let response = {
                                status: false,
                                message: "Nome de usuário já está em uso!"
                            }
                
                            res.send(response)
                        }
                    })
                }else{
                    let response = {
                        status: false,
                        message: "E-mail já está em uso!"
                    }
        
                    res.send(response)
                }
            })            
        }
    }

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
                    let user = new app.application.models.UsersDAO(connection);

                    user.insertComment(token, comment, idPost, function(error, result){
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

    const editComment = (req, res) => {
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
                            user.editComment(comment, idComment, function(error, result){
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

    const deleteComment = (req, res) => {
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
                            user.deleteComment(idComment, function(error, result){
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

    return { login, register, comment, editComment, deleteComment }
}