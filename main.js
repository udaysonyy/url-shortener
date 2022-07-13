const express = require('express');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');
const app = express();

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    const sUrls = await shortUrl.find();
    res.render('index', { sUrls : sUrls });
})

app.post('/shortUrls', async (req,res) => { 
    // console.log("pre executed");
    await shortUrl.create({ full:req.body.fullURL });
    // console.log("post executed");
    res.redirect('/');
})

app.get('/:su', async (req, res) => {
    const su = await shortUrl.findOne({ short: req.params.su });
    if ( su === null ) return res.sendStatus(404);
    su.clicks++;
    su.save();
    res.redirect(su.full);
})

app.listen(3000);