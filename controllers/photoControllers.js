const Photo = require('../models/Photo');
const fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  const page = req.query.page || 1; // Başlangıç sayfamız veya ilk sayfamız.
  const photosPerPage = 3; // Her sayfada bulunan fotoğraf sayısı
  const totalPhotos = await Photo.find().countDocuments(); // Toplam fotoğraf sayısı
  const photos = await Photo.find({})
  .sort('-uploadeAt')
  .skip((page-1) * photosPerPage) // Her sayfanın kendi fotoğrafları
  .limit(photosPerPage) // Her sayfada olmasını istediğimi F. sayısını sınırlıyoruz.

  res.render('index',{
    photos:photos,
    current:page,
    pages:Math.ceil(totalPhotos / photosPerPage)
  })};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
};

exports.creatPhoto = async (req, res) => {
  const uploadeDir = 'public/uploads';

  if (!fs.existsSync(uploadeDir)) {
    fs.mkdirSync(uploadeDir);
  }

  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadeImage.name;

  uploadeImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadeImage.name,
    });
    res.redirect('/');
  });
};

exports.updatePhoto = async (req, res) => {
  const uploadeDir = 'public/uploads';
  if (!fs.existsSync(uploadeDir)) {
    fs.mkdirSync(uploadeDir);
  }
  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadeImage.name;
  uploadeImage.mv(uploadPath, async () => {
    const photo = await Photo.findOne({ _id: req.params.id });
    photo.title = req.body.title;
    photo.description = req.body.description;
    photo.image = '/uploads/' + uploadeImage.name;
    await photo.save();
    res.redirect(`/photos/${req.params.id}`);
  });
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/../public' + photo.image;
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
};
