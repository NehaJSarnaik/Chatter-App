var http = require('http')
const url = require('url');
allUsersList=[]

var app=http.createServer((req,resp)=>{
    
    
    const reqUrl = url.parse(req.url, true);
    
	if (reqUrl.pathname == '/users' && req.method === 'GET') {
        var service = require('./api.js');
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.getUserList(req, resp);
    }
});
var io = module.exports.io = require('socket.io')(app)

const PORT = 3001

const socketApi = require('./socket')

io.on('connection', socketApi)

app.listen(PORT, ()=>{
	console.log("Connected to port:" + PORT);
})