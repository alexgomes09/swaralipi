import mongoose from 'mongoose';

var db = {
    production_db: "mongodb+srv://admin:swaralipi@swaralipi.f7rw1m1.mongodb.net",//process.env.production_db,
    development_db: 'mongodb://localhost/swaralipi'
};

var databaseUrl = db.production_db || db.development_db; // change this in productions

var options = {
    useNewUrlParser:true,
    loggerLevel: "error",
    keepAlive: true,
    dbName:"swaralipi"
};

mongoose.set('strictQuery', true);

mongoose.Promise = global.Promise; //Without this you would get a warning on console when user gets saved to DB

// mongoose.connect(databaseUrl, options);

// when the connection starts
mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to '+ databaseUrl);
});

// log error if error occurs
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ');
});

// when the connection ends
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection to ' + databaseUrl + ' is closed');
});

// close the connection if node process ends
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose connection closed through app termination');
        process.exit(0);
    });
});