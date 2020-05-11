const express = require('express')
const app = express()
cors = require('cors')
const server = require('http').Server(app)
const io = module.exports.io = require('socket.io')(server)
var multer  = require('multer')

const PORT = process.env.PORT || 3001
allUsersList=[]
allUsersData=[]
img_type = ['image/jpeg','image/jpg','image/png','image/gif'];
video_type = ['video/mp4','video/avi','video/WMV','video/MOV','video/FLV'];

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: false
// }));
app.use(cors());

const socketApi = require('./socket')
app.use(express.static(__dirname+'/../../build'))
app.use(express.static(__dirname+'/../../public'))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log('file 11111111śśśś' +__dirname)
        // console.log('file 333333333333333' + __dirname+'/../../public/uploads')
        // console.log('file 4444444444' + __dirname+'/../public/uploads')
        // console.log('file 555555555555555' + __dirname+'/public/uploads')
        cb(null, __dirname+'/../../public/uploads');
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, new Date().valueOf()+ '-' + fileName.slice(-10));
    }
});

var upload = multer({
    storage: storage,
    limits:{
        files: 10,
        fileSize: 1024 * 1024 *10
    },
    fileFilter: (req, file, cb) => {
        // console.log('files 2222222222222222')
        if ( img_type.indexOf(file.mimetype) !== -1) {
            cb(null, true);
        } 
        else if(video_type.indexOf(file.mimetype) !== -1){
            cb(null, true);
        }
        else {
            cb(null, false);
            return cb(new Error('This format is not allowed!'));
        }
    }
});



io.on('connection', socketApi)



app.get("/users", (req, res, next) => {
    console.log('@users alluserslist ',allUsersList)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var response = {
        "success": true,
        "users":allUsersList
    };
    res.json(response);
});

app.post('/upload', upload.array('myFile', 10), function (req, res, next) {
    console.log('files ',req.files)
    var data=[]


    req.files.forEach((el,ind)=>{
        console.log('uploaded element type',el.mimetype)
        let tmpdata={
            type:'image',
            file:el.filename
        }
    
        if ( img_type.indexOf(el.mimetype) !== -1) {
            tmpdata.type='image';
            
        } 
        else if(video_type.indexOf(el.mimetype) !== -1){
            tmpdata.type='video';
        }
        data.push(tmpdata);
    })
    res.json(data);
    

    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
})


server.listen(PORT, ()=>{
	console.log("Connected to port:" + PORT);
})