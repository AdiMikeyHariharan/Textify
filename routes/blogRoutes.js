const express = require('express')
const Blog = require('../models/blogs.js')
const User = require('../models/users')
const router = express.Router()
    router.get('/create', (req, res) => {
        res.render('create', { title: 'Create a new blog' });
    });
   router.get('/',(req,res)=>{
    let blogsPromise = Blog.find().exec(); 
    let usersPromise = User.find().exec(); 

    Promise.all([blogsPromise, usersPromise])
        .then((results) => {
            let blogs = results[0]; 
            let users = results[1];

            res.render('index', { title: 'All Blogs', blogs: blogs, users: users });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });
   })
  
  
   router.post('/',(req,res) =>{
    const blog = new Blog(req.body);
    blog.save()
      .then((result)=>{
        res.redirect('/')
      })
      .catch((err)=>console.log(err));
   })
  
   router.get('/:id',(req,res) =>{
      const id = req.params.id
      Blog.findById(id)
        .then((result)=>{
          res.render('details',{blog : result , title : 'Blog Details'})
        })
        .catch(err =>{
          console.log(err);
        })
   })
  
   router.delete('/:id', (req, res)=>{
      const id=req.params.id;
      Blog.findByIdAndDelete(id)   
      .then(()=>{
         res.json({redirect : '/'})
      })
      .catch((err)=>{
        console.log(err);
    })
   })

module.exports = router