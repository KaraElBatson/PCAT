//NODE MODULES
const express = require('express');
const mongoose= require('mongoose');
const path = require('path');
const ejs =require('ejs');
const Photo =require('./models/Photo');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
// CONNECT MONGODB
mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('db çalıştı');
  })
  .catch((err) => {
    console.error('DB Connection Error:', err);
  });
//TEMPLATE ENGİNE
app.set("view engine","ejs");
//MIDDLEWARES
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
//ROUTES
app.get('/',async (req,res)=>{
    const photos = await Photo.find({}) //verileri projemizde anasayfamızda sıralamak istiyoruz.  verittabanından gets
    res.render("index",{
      photos
    })
});

app.get('/photos/:id', async(req,res)=>{
  const photo = await Photo.findById(req.params.id) //id lı fotolara id sine sahip url açarak fotolara sayfa oluşturma veritabanından get
  res.render('photo',{
    photo
  })
});

app.get('/about',(req,res)=>{
    res.render("about")
});

app.get('/add',(req,res)=>{
    res.render("add")
});
app.post('/photos',async (req,res)=>{
  await Photo.create(req.body) //body bilgisini Photo modeli sayesinde veritabanında dökümana dönüştürüyoruz.Veritabanına post
  res.redirect('/');
});
const port =3000;
app.listen(port, ()=>{
    console.log(`sunucu ${port} portunda başlatıldı..`)
});