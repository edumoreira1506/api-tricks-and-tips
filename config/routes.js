module.exports = app => {
    app.post('/auth', app.application.controllers.users.login)

    app.post('/user', app.application.controllers.users.register)
    app.patch('/user', app.application.controllers.users.edit)
    app.delete('/user', app.application.controllers.users.drop)

    app.post('/comment', app.application.controllers.comments.comment)
    app.patch('/comment', app.application.controllers.comments.edit)
    app.delete('/comment', app.application.controllers.comments.drop)
}