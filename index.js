
require('express-async-errors');
const morgan= require('morgan');
const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const docs = require('./routes/docs');
const fields = require('./routes/fields')
const users = require('./routes/users');
const groups = require('./routes/groups');
const templates = require('./routes/templates');
const home = require('./routes/home');
const auth = require('./routes/auth');
const error = require('./middleware/error')

const app = express();

if(!config.get('jwtPrivateKey')) {
    console.log("Fatal ERRor: jwtPrivateKey is not defined");
    process.exit(1);
}
const db_password = config.get("dbPass");
// mongoose.connect('mongodb://test:12test12@ds237337.mlab.com:37337/com_doc_db',{ keepAlive: true, keepAliveInitialDelay: 300000 })
mongoose.connect(`mongodb://${db_password}@ds237337.mlab.com:37337/com_doc_db`,{ keepAlive: true, keepAliveInitialDelay: 300000 })
     .then(()=>console.log("Connected to mongoDB..."))
    .catch((err)=>console.error("Could not connect to mongodb",err))

app.use(express.json());

if(app.get('env') === 'development') {
app.use(morgan('tiny'));
console.log("morgan enabled...");
console.log("config key: ", config.get('jwtPrivateKey'));
}
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE');
    
    res.setHeader('Access-Control-Allow-Headers','*, content-type');
    next();
})
app.use('/api/docs', docs);
app.use('/api/fields', fields);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/groups', groups);
app.use('/api/templates', templates);

app.use('/', home);
app.use(error);
// console.log(config.get('name'));
// console.log(config.get('password'));

const port = process.env.PORT || 1338;




app.listen(port, () => console.log(`Listening on port ${port}...`));