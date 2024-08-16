// const express=require('express');
// const app = express();

// const port =3001;

// app.get('/', (req, res) => {
//     res.json({message:"This is home page"})
// });

// app.get('/users', (req, res) => {
//     res.json({message:"get all users"})
// });

// app.get('/users/:id', (req, res) => {
//     res.json({message:`get  user with ID ${req.params.id}`})
// });

// app.post('/users/', (req, res) => {
//     res.json({message:`create new user`})
// });

// app.put('/users/:id', (req, res) => {
//     res.json({message:`update  user with ID ${req.params.id}`})
// });

// app.delete('/users/:id', (req, res) => {
//     res.json({message:`delete  user with ID ${req.params.id}`})
// });

// app.listen(port, ()=>{
//     console.log(`example port listening ${port}`)
// })

const { message } = require("antd");
const express = require("express")
const path =require("path");
const multer = require("multer");
const logger = require("morgan");
const router=express.Router();
const upload =multer({dest:"./public/uploads"})
const app= express();

const port = 5001;


//middleware types
//Built in middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/static",express.static(path.join(__dirname, "public",)))

//Appplication level middleware
const loggerMiddleware=(req,res,next) =>{
    console.log(`${new Date()}  ---- Request [${req.method}] [${req.url}] `);
    next();
}

app.use(loggerMiddleware);

//Third Party middleware
app.use(logger("combined"));



//Router level middleware
app.use("/api/users",router)

const fakeAuth = (req,res,next) =>{
    const authSataus=true;
    if(authSataus){
        console.log("user authenticated:",authSataus);
        next();
    }else{
        res.status(401);
        throw new Error("user autthenciation gfailed")
    }
}
const getUsers =(req,res)=>{
  res.json({message:"get all users"})
}


const createUser =(req,res)=>{
    console.log("This is req body",req.body)
    res.json({message:"create new users"})
}
router.use(fakeAuth);

router.route("/").get(getUsers).post(createUser)


//Error handleing midlleware 

const errorHandler = (err,req,res,next) =>{
    const statusCode = req.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    switch(statusCode){
        case 401 :
            res.json({
                title:"UnAuthorized",
                message : err.message
            });
        break;
        case 404:
            res.json({
                title:"Not Found",
                message : err.message   
            });
        break;
        case 500:
            res.json({
                title:"Server Error",
                message : err.message   
            });
        break;
        default :
        break;
    }
}


app.post("/upload",upload.single("image"),(req,res,next)=>{
    console.log(req.file,req.body);
    res.send(req.file)
},(err,req,res,next)=>{
    res.status(400).send({err:err.message})
})


app.all("*",(req,res)=>{
    res.status(404);
    throw new Error("Route not found")
})

app.use(errorHandler);
app.listen(port ,()=>{
    console.log(`Server runs pn port ${port}`);
 })