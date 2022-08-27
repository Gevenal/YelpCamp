const mongoose = require('mongoose');
const campground = require('../models/campground');
const Campground = require('../models/campground');
const { places, descriptions, descriptors } = require('./seedHelpers');
const cities = require('./cities');
//set up the database
mongoose.connect('mongodb://localhost:27017/yelp-camp');

//catch error of db
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('database connected...');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        var price = Math.floor(Math.random() * 20) + 10;
        var random1000 = Math.floor(Math.random() * 1000);
        var camp = new Campground({
            //USER ID
            author: '62fbe38ecf246693d78eacd3',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: 'https://source.unsplash.com/collection/11649432',
            description: 'Best Camp Place in the world',
            price: price,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude,
                cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/djkdzs4um/image/upload/v1661289964/YelpCamp/n6erylndyftijx5psdfj.jpg',
                    filename: 'YelpCamp/n6erylndyftijx5psdfj'

                }
            ]
        })
        await camp.save();
    }
}

//自动关闭节点
seedDB().then(() => {
    mongoose.connection.close();
})