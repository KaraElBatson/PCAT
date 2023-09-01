const express = require('express');
const ejs = require('ejs');
const path = require('path');

const dotenv = require('dotenv');


dotenv.config();

conn = () => {
  mongoose
    .connect(process.env.DB_URI, {
      dbName: 'lenslight_tr',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to the DB succesully');
    })
    .catch((err) => {
      console.log(`DB connection err:, ${err}`);
    });
};


const app = express();
//TEMPLATE ENGINE
app.set('view engine', 'ejs');

//MIDDLEWARES
app.use(express.static('public'));

//ROUTES
app.get('/', (req, res) => {

  res.render('index');
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/add', (req, res) => {
  res.render('add');
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda baslatildi..`);
});