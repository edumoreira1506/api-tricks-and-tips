const app = require('./config/server');
const port = 3000;

const server = app.listen(port, function(){
	console.log(`Api online on port ${port}`);
});