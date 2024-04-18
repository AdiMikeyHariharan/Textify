const express = require('express');
const session = require('express-session')
const { default: mongoose } = require('mongoose');
const morgan = require('morgan')
const User = require('./models/users.js')
const UserVerification = require('./models/userVerification.js')
const MongoDBSession = require('connect-mongodb-session')(session)
const blogRoutes = require( './routes/blogRoutes' )  //imports the routes
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const {v4 : uuidv4} = require('uuid')
const dotenv = require("dotenv")
dotenv.config() 
const transporter = nodemailer.createTransport({
  service:"gmail",
  host: "smtp.gmail.com",
  port:587,
  secure:false,
  auth:{
    user:process.env.AUTH_EMAIL,
    pass:process.env.AUTH_PASS
  }
})

transporter.verify((err,success) =>{
  if(err){
    console.log(err);
  }
  else{
    console.log("Ready for messages");
    console.log("Success");
  }
})
const sendVerificationEmail = ({_id,email},res) =>{
  const currentUrl = "localhost:3000/"
  const uniqueString = uuidv4() + _id;

  const mailOptions = {
    from:process.env.AUTH_EMAIL,
    to:email,
    subject:"Verify your Email",
    html: `<p>Verify your email address to complete the signup and to login into your account.</p><p> This link<b> expires in 6 hours</b>Press <a href=${currentUrl + "verify" + "/" + _id + "/" + uniqueString+ " "}>here</a> to proceed</p>`,
  }
  const saltRounds = 10
  bcrypt.hash(uniqueString,saltRounds)
  .then((hashedUniqueString)=>{
    const newVerification = new UserVerification({
      userId:_id,
      uniqueString: hashedUniqueString,
      createdAt: Date.now(),
      expiresAt:Date.now()+ 21600000,
    })
 
    newVerification.save()
    .then(()=>{
      transporter.sendMail(mailOptions)
      .then(()=>{
        const message = "Verfication Email Sent"
        res.redirect(`/verified/${message}`)
      })
      .catch((err)=>{
        res.json({
          status:"Failed",
          message:"An error occurred while hashing email data"
        })
      })
    })
    .catch((err)=>{
      console.log(err);
      res.json({
        status:"Failed",
        message:"An error occurred while hashing email data"
      })
    })
  })
  .catch(()=>{
    res.json({
      status : "Failed",
      message:"An Error Occurred"
    })
  })
}
// express app
const app = express();
//coonect to mongodb
const dbURI = 'mongodb+srv://adityahariharna19:D8xZ8d2E0RK4CV0X@nodeapp.avajkzf.mongodb.net/?retryWrites=true&w=majority&appName=nodeapp'
// listen for requests
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err))

const store = new MongoDBSession({
  uri: dbURI,
  collection:'UserSessions',
  timestamps : true,
  ttl:86400
})
app.use(session({
  secret : 'Hello Niggesh this is my key',
  resave : false,
  saveUninitialized : false,
  store:store,
})
)
// register view engine
app.set('view engine', 'ejs');
// app.set('views', 'myviews');
app.use(express.static('public'));
app.use(morgan('dev'))
app.use(express.urlencoded({extended : true})) // parse form data

const isAuth = (req,res,next)=>{
  if(req.session.isAuth){
    next();
  }
  else{
    res.redirect('/login')
  }
}
app.get('/verify/:userId/:uniqueString',(req,res)=>{
  const {userId,uniqueString} = req.params
  console.log(userId)
  UserVerification
  .find({userId})
  .then((result)=>{
    
    if(result.length > 0){
      const {expiresAt} = result[0]
      console.log(expiresAt);
      const hashedUniqueString = result[0].uniqueString

      if(expiresAt < Date.now()){
          UserVerification.deleteOne({userId})
          .then((res)=>{
            User.deleteOne({_id : userId})
            .then(()=>{
             const message = "Link expired Try Again"
             res.redirect(`/verified/?message=${message}`)
            })
            .catch(err=>console.log(err))
             const message = "error occurred"
             res.redirect(`/verified/?message=${message}`)
          })
          .catch((err)=>{
            console.log(err);
            const message = "An error occurred"
            res.redirect(`/verified/?message${message}`);
          })
      }
      else{
          bcrypt.compare(uniqueString,hashedUniqueString)
          .then((res)=>{
            if(res){
              User.updateOne({_id : userId},{verified : true})
              .then(()=>{
                UserVerification.deleteOne({userId})
                .then(()=>{
                  const message ="Account Verified Successfully"
                  res.redirect(`/verified/?message=${message}`)
                })
                .catch((err)=>{
                  const message = "An error in finalizing successful verification"
                  res.redirect(`/verified/?message${message}`)
                })
              })
              .catch((err)=>{
                const message = "An error Occurred while updating user record to show verified ! !"
                res.redirect(`/verified/?message=${message}`)
              })
            }
            else{

            }
          })
          .catch(err=>{
            console.log("Error ")
          })
      }
    }
    else{
      const message = "The Account does not exist or has been verified already.Please sign in or log in"
      res.redirect(`/verified/?message=${message}`)
    }
  })
  .catch((err)=>{
    console.log(err);
    const message = "An error occurred"
    res.redirect(`/verified/?message=${message}`)
  })
})

app.get("/verified/:message",(req,res)=>{
  const message = req.params[0]
  res.render('verified',{message : message})
})
app.get('/', (req, res) => {
  if(req.session.isAuth){
    res.redirect('/blogs')
  }
  res.render('register',{message : ''})
});


app.get('/about', (req, res) => {
  if(req.session.isAuth){
    res.render('about', { title: 'About' });
  }
  res.render('register',{message : ''})
});

app.get('/register',(req,res)=>{
  res.render('register',{message : ""})
})
app.post('/register',(req,res)=>{
  const saltRounds = 10
  bcrypt
  .hash(req.body.password,saltRounds)
  .then((hashedPassword) =>{
    req.body.password = hashedPassword
    req.body.email = req.body.email.toLowerCase()
    req.body.verified = false
    const user = User(req.body)
    const userExists =  User.findOne({
      email : req.body.email,
      username:req.body.username
    })
    .then((result)=>{
      console.log(result)
    })
    .catch((err)=>{
      console.log(err);
    })
    user.save()
    .then((result)=>{
      sendVerificationEmail(result,res)
    })
    .catch((err)=>{
      return res.render('register', { message: "This Email is Already Registered ! !" });
    });
  })
})

app.get('/login',(req,res) =>{
  res.render('login',{message : ""})
})

app.get('/user/:username',(req,res)=>{
  const username = req.params
  User.findOne({username : username})
  .then((res)=>{
    if(res != null){
      return true
    }
    else{
      return false
    }
  })
})
app.post('/login', (req, res) => {
  const email = req.body.email.toLowerCase()
  const password = req.body.password

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.render('login', { message: "Username or Password is Wrong" });
      }
      if (user.password !== password) {
        return res.render('login', { message: "Username or Password is Wrong" });
      }
      req.session.isAuth = true
      res.redirect('/blogs');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
});
app.get('/logout', (req, res) => {
  req.session.isAuth = false
});
app.use('/blogs',isAuth,blogRoutes)
// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});