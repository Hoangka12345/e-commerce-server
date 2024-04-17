const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const dbname = process.env.DB_NAME;

const mongodb_uri = `mongodb+srv://${username}:${password}@cluster0.2acvwgo.mongodb.net/${dbname}?retryWrites=true&w=majority`;

module.exports = { mongodb_uri };
