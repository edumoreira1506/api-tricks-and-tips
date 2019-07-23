module.exports = app => {
    app.post('/auth', app.application.controllers.users.auth)

    app.post('/user', app.application.controllers.users.register)
}