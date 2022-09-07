const express = require('express');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// Récuperer tous les clients
recordRoutes.route('/clients').get(async function (_req, res) {
  const dbConnect = dbo.getDb();
  dbConnect
    .collection('client')
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
      }
    });
});

// Récupérer un seul client
recordRoutes.route('/client/:tel').get(async function (req, res) {
  const dbConnect = dbo.getDb();
  try {
    const clients = dbConnect.collection("utilisateur");
    // Query for a movie that has the title 'The Room'
    const query = { tel: _req.query.tel };
    const options = {
      // sort matched documents in descending order by rating
      //sort: { "imdb.rating": -1 },
      // Include only the `title` and `imdb` fields in the returned document
      //projection: { _id: 0, title: 1, imdb: 1 },
      //ToDo: hh
    };
    const client = await clients.findOne(query, options);
    // since this method returns the matched document, not a cursor, print it directly
    console.log(client);
  }catch(err){

  }
});

// Inscrire un client (Ajouter)
recordRoutes.route('/client/ajout/:nom/:prenoms/:sexe/:dateNaiss/:tel/:mdp').post(async function (req, res) {
    try {
      const clientCollection = dbConnect.collection("client");
      // create a document to insert
      const doc = {
        nom: "Record of a Shriveled Datum",
        prenom: "No bytes, no problem. Just insert a document, in MongoDB",
        tel: "",
        sexe:"",
        dateNaiss: "m",
        tel: "",
        mdp: ""
      }
      const result = await clientCollection.insertOne(doc);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
      await client.close();
    }
});

module.exports = recordRoutes;
