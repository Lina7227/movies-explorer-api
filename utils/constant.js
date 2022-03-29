const { MONGODB_URL, NODE_ENV } = process.env;

const BD_URL = NODE_ENV === 'production' ? MONGODB_URL : 'mongodb://localhost:27017/moviesdb';

module.exports = BD_URL;
