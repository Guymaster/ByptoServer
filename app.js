const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/Users.js");
const { updateOne } = require("./models/Users.js");
const { request, response } = require("express");
const config = require('./config.js');

const getCryptoServiceById = require ('./crypto/registry');

app.use(cors());



mongoose
  .connect(
    config.mongoURI,
    // { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((e) => console.log("Connexion à MongoDB échouée !", e));

app.use(express.json());

app.post("/api/signUp", (req, res, next) => {
  bcrypt
    .hash(req.query.password, 10)
    .then((hash) => {
      let UsdtService = getCryptoServiceById("usdt"); //Boite à outils USDT
      let usdtWallet = UsdtService.createWallet(); //Nouveau wallet USDT
      const user = new User({
        nom: req.query.nom,
        prenom:req.query.prenom,
        email: req.query.email,
        password: hash,
        wallets: {
          usdt: {
            key: usdtWallet.privateKey
          }
        }
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
      const searchEmail = await User.findOne({ email: req.query.email });
      console.log(searchEmail);
      bcrypt.hash(req.querypassword, 10).then((hash) => {
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

app.get("/api/Login", async (req, res, next) => {
  User.findOne({ email: req.query.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      bcrypt
        .compare(req.query.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
          res.status(200).json({
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

//Generer une adresse de reception, besoin du tel, du mdp, du nom de la crypto et du code secret
app.post("/api/wallet/getReceiveAddress", async (req, res, next) => {
  User.findOne({ email: req.query.email })
    .then((user) => {
      if (!user) {
        let UsdtService = getCryptoServiceById("usdt"); //Boite à outils USDT
        switch(crypto){
          case "usdt": return getCryptoServiceById("usdt").generateReceptionAddress(user.wallets.usdt.privateKey);
          default: return "NULL";
        }
      }
      bcrypt
        .compare(req.query.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
          res.status(200).json({
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

//Recuperer le solde, besoin du tel, du mdp, du nom de la crypto et du code secret
app.post("/api/wallet/getBalance", async (req, res, next) => {
  User.findOne({ email: req.query.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      bcrypt
        .compare(req.query.password, user.password)
        .then(async(valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
        let walletAdress;
        let balance;
        switch(req.query.crypto){
          case "usdt": walletAdress = getCryptoServiceById("usdt").generateReceptionAddress(user.wallets.usdt.key); balance = await getCryptoServiceById("usdt").getBalance(walletAdress);  break;
        }
        console.log(balance);
          res.status(200).json({
            userId: user._id,
            balance: balance,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => {console.log(error); return res.status(500).json({ error });});
    })
    .catch((error) => {console.log(error); return res.status(500).json({ error });});
});

//Envoyer des actifs, besoin du tel, du mdp, du nom de la crypto, du nombre à envoyer et du code secret
app.post("/api/wallet/send", async (req, res, next) => {
  
});

app.post("/api/test", async (req, res, next) => { //Pour les test
  console.log("recu")
  let CryptoService = getCryptoServiceById("usdt");
  CryptoService.createWallet();
});

module.exports = app;
