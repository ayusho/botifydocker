var mongoose = require('mongoose');

var mongoDB = 'mongodb://mongo/botifyDb';
mongoose.connect(mongoDB, {
    useMongoClient: true
});

var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', function () {
    // we're connected!
    console.log("Connected!!");
});

var Schema = mongoose.Schema;

// creating a schema
var userSchema = new Schema({
    userName: String,
    password: String,
    password: String,
    profile: String
});
// creating a User
var User = mongoose.model("User", userSchema);

module.exports = function () {
    // Insert
    this.insert = function insert(items, callback) {

        User.insertMany(items, function (err, docs) {
            if (docs)
                docs = docs.map(o => o.toObject());

            callback(err, docs);
        });
    }

    // Select
    this.select = function select(query, callback) {

        User.find(query).lean().exec(function (err, doc) {
            callback(err, doc);
        });
    }

    // SelectOne
    this.selectOne = function selectOne(query, callback) {

        User.findOne(query).lean().exec(function (err, doc) {
            console.log(err);
            console.log(doc);

            callback(err, doc);
        });
    }

    // FTS
    this.search = function search(searchString, callback) {

        User.find({
            $text: {
                $search: searchString
            }
        }, {
            score: {
                $meta: "textScore"
            }
        }).lean().exec(function (err, docs) {
            callback(err, docs);
        });
    }

    // Query with Id
    this.selectByIds = function selectByIds(ids, callback) {

        User.find({
            '_id': {
                $in: ids.map(function (id) {
                    return mongoose.Types.ObjectId(id);
                })
            }
        }, function (err, docs) {
            callback(err, docs);
        });
    }

    // Update
    this.upsertField = function upsertField(condition, itemName, value, callback) {

        User.update(condition, {
            [itemName]: value
        }, {
            upsert: true,
            setDefaultsOnInsert: true
        }, function (err, docs) {

            callback(err, docs);
        });
    }

    // Push value
    this.pushValues = function pushValues(condition, itemName, values, callback) {

        User.findOneAndUpdate(condition, {
            $push: {
                [itemName]: {
                    $each: values
                }
            }
        }, function (err, docs) {
            console.log(docs);

            callback(err, [docs]);
        });
    }

    // Delete

    // Close connection
    this.close = function close() {
        db.close();
    }
};
