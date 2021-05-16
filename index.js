const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vbld0.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const servicesCollection = client.db("tannyInterior").collection("services");
    const reviewCollection = client.db("tannyInterior").collection("reviews");
    const adminCollection = client.db("tannyInterior").collection("admin");
    const addBookCollection = client.db("tannyInterior").collection("orders");

    // make admin
    app.post('/makeAdmin', (req, res) => {
        const admin = req.body;
        adminCollection.insertOne(admin)
        .then(result => {
            res.send(result.insertedCount)
        })
    })

    // find admin email
    app.get('/admin/:email', (req, res) => {
        const email = req.params.email
        adminCollection.find({ email: email })
        .toArray((err, document) => {
            res.send(document[0])
        })
    })

    // add new service
    app.post('/addService', (req, res) => {
        const services = req.body;
        servicesCollection.insertOne(services)
        .then(result => {
            res.send(result.insertedCount)
        })
    })

    // all services
    app.get('/services', (req, res) => {
        servicesCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    // single Service
    app.get('/service/:id', (req, res) => {
        servicesCollection.find({ _id: ObjectId(req.params.id) })
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    // Delete Service
    app.delete('/delete/:id', (req, res) => {
        servicesCollection.deleteOne({ _id: ObjectId(req.params.id) })
        .then(result => {
            res.send(result.deletedCount > 0)
        })
    })

    // add new Review
    app.post('/addReview', (req, res) => {
        const reviews = req.body;
        reviewCollection.insertOne(reviews)
        .then(result => {
            res.send(result.insertedCount)
        })
    })

    // all Reviews
    app.get('/reviews', (req, res) => {
        reviewCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    // add booking orders
    app.post('/addOrder', (req, res) => {
        const orders = req.body;
        addBookCollection.insertOne(orders)
        .then(result => {
            res.send(result.insertedCount)
        })
    })

    // all booking orders
    app.get('/orders', (req, res) => {
        addBookCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    // user booking orders
    app.get('/order', (req, res) => {
        const email = req.query.email
        addBookCollection.find({ email: email })
            .toArray((err, documents) => {
            res.send(documents)
        })
    })

});

app.get('/', (req, res) => {
    res.send('Server Working...')
})
app.listen(process.env.PORT || port);