const express=require('express');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate')
const path=require('path')
const methodOverride=require('method-override')


const User=require('./models/user')

mongoose.connect('mongodb://127.0.0.1:27017/managing',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('connected to the database')
}).catch(e=>{
    console.log(e.message)
})
const app=express()

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))


app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))


app.use(express.static(path.join(__dirname,'public')))

app.get('/',(req,res)=>{
    res.send('this is the home page for the management system')
})
app.get('/users',async(req,res)=>{
    const users=await User.find();
    //console.log(users)
    res.render('index',{users})

})
app.get('/users/new',(req,res)=>{
    
    res.render('new')
})

app.post('/users/new',async(req,res)=>{

    const user=new User(req.body.user);
   
    await user.save();
    res.redirect('/users')
})

app.get('/users/:id/edit',async(req,res)=>{
    const {id}=req.params;
    const user=await User.findById(id);
    //console.log(user)
    res.render('edit',{user})
})
app.put('/users/:id',async(req,res)=>{
    const {name,email,gender,status}=req.body.user
    const {id}=req.params
    await User.findByIdAndUpdate(id,{...req.body.user})
    // await User.findByIdAndUpdate(id,{name,email,gender,status})
    res.redirect('/users')
})

app.delete('/users/:id',async(req,res)=>{
    const {id}=req.params;
    await User.findByIdAndDelete(id);
    res.redirect('/users')
})
app.listen(3000,()=>{
    console.log('listening on port 3000')
}) 
