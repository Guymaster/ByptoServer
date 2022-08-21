const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/Users.js");
const { updateOne } = require("./models/Users.js");
const { request, response } = require("express");

app.use(cors());



mongoose
  .connect(
    "mongodb+srv://Yann:123@cluster0.3x5y5.mongodb.net/Back-bypto?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.post("/api/signIn", (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        nom: req.body.nom,
        prenom:req.body.prenom,
        email: req.body.email,
        password: hash,
      });

      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
});


app.get("/message", (req, res) =>
  res.status(200).send({ message: "Hello from the server !" })
);

app.post('api/forgetPassword',(res,req,next)=>{
  forgetPassword = async (req, res, next) => {
    try {
      const searchEmail = await User.findOne({ email: req.body.email });
      console.log(searchEmail);
      bcrypt.hash(req.body.password, 10).then((hash) => {
        searchEmail.password = hash;
        console.log(searchEmail);
        searchEmail.save();
      });
      res.status(200).json({
        message: "password update",
      });
    } catch (e) {
      console.log(e);
    }
  };
})

app.post("/api/Login", async (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
          res.status(200).json({
            titre: user.titre,
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
});

module.exports = app;
