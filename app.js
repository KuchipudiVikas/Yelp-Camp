
const express = require('express');
const Campground = require('./models/campground');
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected!!")
})

const app = express();
app.engine('ejs', ejsMate)
const path = require('path');
const campground = require('./models/campground');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('campgrounds/home');
})


app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    console.log(campgrounds);
    res.render('campgrounds/index', { campgrounds });
})



app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')

})

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground })
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
}))


app.post('/campgrounds', catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)

}))




app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
})



app.delete('/campgrounds/:id', catchAsync(async (req, res) => {

    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}))

app.use((err, req, res, next) => {
    res.send('oh we got an error')
})


app.listen(3000, () => {
    console.log("serving port 3000")
})
