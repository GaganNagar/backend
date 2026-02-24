const mongoose = require('mongoose');

async function connectDB() {
    await mongoose.connect("mongodb+srv://Gagan:tzm6BNIiOPjyrkGX@backend-learn.lvddptc.mongodb.net/Gagan")
    console.log('DB Connected')
}

module.exports = connectDB;