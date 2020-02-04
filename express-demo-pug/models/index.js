// import mongoose from 'mongoose';
// import User from './user';
// import Message from './message';

// mongoose = require('mongoose')
var {User} = require('./user')
var {Message} = require('./message')

const connectDb = () => {
    return mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
};
const models = { User, Message };
// export { connectDb };
// export default models;


module.exports = {
    models, connectDb
}

