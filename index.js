const express = require('express');
const multer = require('multer');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');


require('dotenv').config();


const app = express();

//=========================================
// Note on how to use 'multer' package
//=========================================
// 'multer' is a express library specifically used to handle multipart/form-data POST requests,
//  like what bodyParser library does
//
//  Once middleware is applied, the req object will have 'body', 'file' or 'files'
//
//  To start, require multer. Then, pass into the multer function a series of options as seen here:
//      
//      const multer = require('multer');
//      const uploader = multer({
//          dest/storage:   Choose either one. For 'dest', pass in a filepath to store uploads
//                          For storage, we have DiskStorage or MemoryStorage. Talk about this later
//          fileFilter:     Function to filter out upload files.
//          limits:         Another option object. See about this later
//          preservePath:   Whether to preserve full path name
//      });
//
//  > DiskStorage and MemoryStorage
//      Created by calling multer.diskStorage({...}) or multer.memoryStorage({...}). Only two options available:
//      Eg:
//              multer.diskStorage({
//                  destination: (req, file, cb)=> {
//                      ...;  cb(error, filepath)
//                  }
//                  filename: (req, file, cb)=> {
//                      ...;  cb(error, filename)
//                  }
//              })
//
//  > Finally, we need to apply multer middleware. We have several options:
//      - uploader.single(fieldname)                        => For single file upload
//      - uploader.array(fieldname [, maxCount])            => For multiple file upload
//      - uploader.fields([                                 => Multiple file input fields
//          { name [, maxCount] }...
//        ])
//      - uploader.any()                                    => Wildcard
//      - uploader.none()                                   => Only form fields
//
// For the 'limits' option and the 'file'/'files' in req object, you can refer to offcial API. 
// This already teach you how to setup


//===============================
// Configuration and Middlewares
//===============================
//  CORS - to allow access from FreeCodeCamp
if (!process.env.DISABLE_XORIGIN) {
    app.use(function(req, res, next) {
        var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
        var origin = req.headers.origin || '*';
        if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        }
        next();
    });
}


// HelmetJS for header security
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            scriptSrc: ["'self'", 'cdnjs.cloudflare.com'],
        }
    }
}));


//=============================
// Rate Limiting
//=============================
const viewRateLimiter = rateLimiter({
    windowMs: 5 * 60 * 1000,                         // 5 minute window
    max: 100                                         // ~1 request per 3 second
});

const uploadRateLimiter = rateLimiter({
    windowMs: 1 * 60 * 1000,                         // 1 minute window
    max: 5,                                          // 5 uploads per minute only
    message: "Too much uploads! Try again later"
});

app.set('views', './views');
app.set('view engine', 'pug');

app.use('/public', express.static('./public'));

// Multer
const uploader = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024                  // 10MBytes allowed filesize
    }
});



//==================================
// Routes and API
//==================================
app.get('/', viewRateLimiter, (req,res)=> {
    res.status(200).render('index');
});


app.post('/api/fileanalyse', uploadRateLimiter, uploader.single('upfile'), (req,res)=> {
    if (!req.file)
        return res.status(400).json({error: "No file uploaded"});
    
    res.status(200).json({
        name: req.file.originalname,
        type: req.file.mimetype, 
        size: req.file.size
    });
});


//=================================================
app.listen(process.env.PORT || 3000, ()=> {
    console.log('Web application started at port ' + (process.env.PORT || 3000));
    console.log('Mode: ' + process.env.NODE_ENV);
});