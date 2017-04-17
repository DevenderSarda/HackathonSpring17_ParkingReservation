/**
 * Created by deven on 4/15/2017.
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require("body-parser");
var express = require('express');
var cors = require('cors');
var app = express();
const nodemailer = require('nodemailer');
var url = 'mongodb://dev:dev@ds161410.mlab.com:61410/hackathon';
//var url = 'mongodb://DevSarda:DevSarda@ds135800.mlab.com:35800/demodatabase';
var z;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/push', function (req, res) {
    console.log(JSON.stringify(req.body));
    const transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'goparkinghost@gmail.com',
            pass: 'hack1234',
        },
    });
    const mailOptions = {
        from: 'goparkinghost@gmail.com',
        to: req.body.email,
        subject: 'Go Parking - Reservation Confirmation',
        html: req.body.content,
    };
    transport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        console.log('Message sent: ${info.response}');
    });
});
app.post('/reserve', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        console.log(JSON.stringify(req.body));
        insertDocument(db, req.body, function() {
            res.write("Successfully inserted");
            res.end();
        });
    });
});
var insertDocument = function(db, data, callback) {
    db.collection('parkingreservation').insertOne( data, function(err, result) {
        if(err)
        {
            res.write("Registration Failed, Error While Registering");
            res.end();
        }
        console.log("Inserted a document into the parkingreservation collection.");
        console.log(result);
        callback();
    });
};
app.get('/sign', function (req, res,next) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        z = req.query.email;
        db.collection('parkingreservation', function (err, collection) {
            collection.findOne({'email': z}, function (err, item) {
                if (err) {
                    res.write("failed to validate");
                    res.end();
                }
                if (item != null) {
                    console.log('Inside mongo.js'+item);
                        console.log('Profile Data'+JSON.stringify(item));
                    res.send(item);
                    res.end();
                }

            });
        });

    });
});

app.get('/remove',function (req,res,next) {
    MongoClient.connect(url,function (err,db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        var x = req.query.email;



        console.log('value of x in remove mongo:'+x);

        db.collection('userdatabase',function (err,collection) {
            collection.deleteOne({"email1": x},function (err,item) {
                if(err)
                {
                    res.write("failed to fetch");
                    res.end();
                }
                if(item!=null)
                {
                    res.send("successfully deleted");
                    res.end();

                }

            })
        })
    })
});

app.get('/cancel',function (req,res,next) {
    MongoClient.connect(url,function (err,db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        var x = req.query.email;



        console.log('value of x in cancel mongo:'+x);

        db.collection('parkingreservation',function (err,collection) {
            collection.deleteOne({"email": x},function (err,item) {
                if(err)
                {
                    res.write("failed to fetch");
                    res.end();
                }
                if(item!=null)
                {
                    res.send("successfully deleted");
                    res.end();

                }

            })
        })
    })
});
app.post('/register', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        registerDocument(db, req.body, function() {
            res.write("Successfully inserted");
            res.end();
        });
    });
})
var registerDocument = function(db, data, callback) {
    db.collection('userdatabase').insertOne( data, function(err, result) {
        if(err)
        {
            res.write("Registration Failed, Error While Registering");
            res.end();
        }
        console.log("Inserted a document into USers database collection.");
        callback();
    });
};

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});