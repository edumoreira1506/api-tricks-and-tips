module.exports = app => {
    app.post('/auth', app.application.controllers.users.login)

    app.post('/user', app.application.controllers.users.register)

    app.post('/comment', app.application.controllers.users.comment)
}