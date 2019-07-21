module.exports = app => {

    const auth = (req, res) => {
    	res.send('Hello world!')
    }

    return { auth }
}