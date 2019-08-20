const crypto = require('crypto');

module.exports = app => {

    const login = (req, res) => {
        if (!req.body.password || !req.body.username) {
            let response = {
                status: false,
                message: "Nome de usuário e senha são obrigatórios!"
            }

            res.send(response)
        } else {
            let connection = app.config.dbConnection();
            let user = new app.application.models.UsersDAO(connection);

            user.login(req.body.username, req.body.password, function (error, result) {
                if (result.length == 0) {
                    let response = {
                        status: false,
                        message: "Nome de usuário ou senha inválidos!"
                    }

                    res.send(response)
                }else{
                    let response = {
                        status: true,
                        message: "Login efetuado com sucesso!",
                        token: result[0].token,
                        username: result[0].username,
                        admin: result[0].admin,
                        userImage: result[0].image_path
                    }

                    res.send(response)
                }
            })
        }
    }

    const register = (req, res) => {        
        if (!req.body.email || !req.body.password || !req.body.confirmPassword || !req.body.username || !req.body.bornDate) {
            let response = {
                status: false,
                message: "Email, senha, confirmação de senha, nome de usuário e data de nascimento são obrigatórios!"
            }

            res.send(response)
        } else if (req.body.password != req.body.confirmPassword) {
            let response = {
                status: false,
                message: "Senha e confirmação de senha estão diferentes!"
            }

            res.send(response)
        } else if (req.body.password.length >= 18 || req.body.password.length < 8) {
            let response = {
                status: false,
                message: "Senha precisa ter entre 8 a 18 caracteres!"
            }

            res.send(response)
        } else if(req.body.description.length > 254){
            let response = {
                status: false,
                message: "Descrição precisa ter entre 0 e 255 caracteres!"
            }

            res.send(response)
        }else {
            let arrayDate = req.body.bornDate.split('-');
            let date = new Date(arrayDate[0], arrayDate[1], arrayDate[2], 0, 0, 0);
            let now = new Date();

            if (date.getTime() > now.getTime()) {
                let response = {
                    status: false,
                    message: 'Data de nascimento não pode estar no futuro'
                }

                res.send(response)
            } else {
                let connection = app.config.dbConnection();
                let user = new app.application.models.UsersDAO(connection);

                user.countByEmail(req.body.email, function (error, result) {
                    if (result[0].quantity == 0) {
                        user.countByUsername(req.body.username, function (error, result) {
                            if (result[0].quantity == 0) {
                                user.insert(req.body, function (error, result) {
                                    if (error) {
                                        let response = {
                                            status: false,
                                            message: "Erro interno no servidor!"
                                        }

                                        res.send(response)
                                    } else if (result.affectedRows == 1) {
                                        let response = {
                                            status: true,
                                            message: "Usuário cadastrado com sucesso!"
                                        }

                                        res.send(response)
                                    }
                                })
                            } else {
                                let response = {
                                    status: false,
                                    message: "Nome de usuário já está em uso!"
                                }

                                res.send(response)
                            }
                        })
                    } else {
                        let response = {
                            status: false,
                            message: "E-mail já está em uso!"
                        }

                        res.send(response)
                    }
                })
            }
        }
    }

    const edit = (req, res) => {
        if (!req.header('token')) {
            let response = {
                status: false,
                message: 'Token inválido.'
            }

            res.send(response)
        } else {
            let token = req.header('token');
            let connection = app.config.dbConnection();
            let tokenValidation = new app.application.models.TokensDAO(connection);

            tokenValidation.isValid(token, function (error, result) {
                if (result[0].valid) {
                    let user = new app.application.models.UsersDAO(connection);

                    user.searchByToken(token, function (error, result) {
                        if (error) {
                            let response = {
                                status: false,
                                message: 'Desculpe, erro interno no servidor.'
                            }

                            res.send(response)
                        } else {
                            let email = req.body.email ? req.body.email : result[0].email
                            let password = req.body.password ? crypto.createHash('md5').update(req.body.password).digest('hex') : result[0].password
                            let description = req.body.description ? req.body.description : result[0].description
                            let imagePath = req.body.imagePath ? req.body.imagePath : result[0].image_path

                            if (req.body.email) {
                                user.countByEmailToken(email, token, function (error, result) {
                                    if (result[0].quantity == 0) {
                                        user.edit(email, password, description, imagePath, token, function (error, result) {
                                            if (error) {
                                                let response = {
                                                    status: false,
                                                    mensagem: "Desculpe, erro interno no servidor"
                                                }

                                                res.send(response)
                                            } else {
                                                let response = {
                                                    status: true
                                                }

                                                res.send(response)
                                            }
                                        })
                                    } else {
                                        let response = {
                                            status: false,
                                            message: "E-mail já está por outra pessoa em uso!"
                                        }

                                        res.send(response)
                                    }
                                })
                            } else {

                            }
                        }
                    })
                } else {
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
        if (!req.header('token')) {
            let response = {
                status: false,
                message: 'Campos obrigatórios: Token.'
            }

            res.send(response)
        } else {
            let token = req.header('token');
            let connection = app.config.dbConnection();
            let tokenValidation = new app.application.models.TokensDAO(connection);

            tokenValidation.isValid(token, function (error, result) {
                if (result[0].valid) {
                    let user = new app.application.models.UsersDAO(connection);

                    user.drop(token, function (error, result) {
                        if (error) {
                            let response = {
                                status: false,
                                message: 'Erro interno no servidor!'
                            }
                        } else {
                            let response = {
                                status: true,
                            }
                        }

                        res.send(response)
                    })
                } else {
                    let response = {
                        status: false,
                        message: 'Desculpe, token inválido.'
                    }

                    res.send(response)
                }
            })
        }
    }

    return { login, register, edit, drop }
}