module.exports = app => {

    const auth = (req, res) => {
    	res.send('Hello world!')
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

            user.searchByEmail(req.body.email, function(error, result){
                if(result[0].quantity == 0){
                    user.searchByUsername(req.body.username, function(error, result){
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

    return { auth, register }
}