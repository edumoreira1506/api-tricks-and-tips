module.exports = app => {
    app.post('/auth', app.application.controllers.users.auth)
}