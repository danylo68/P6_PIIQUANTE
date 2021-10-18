
const fs = require('fs');
const Sauce = require('../models/sauces');

// CREATON SAUCE :::::::::::::::::::::::::::::::

exports.createSauce = (req, res, next) => {
  const sauceObjet = JSON.parse(req.body.sauce);
  delete sauceObjet._id;
  const sauce = new Sauce({
    ...sauceObjet,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0 
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
  .catch((error) => res.status(404).json({ error }));
};


// recuperation SAUCE ::::::::::::::::::::::::::

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
   .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// MODIFICATION SAUCE ::::::::::::::::::::::::::
exports.modifySauce = (req, res, next) => {
  const saucesObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...saucesObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiés !'}))
    .catch(error => res.status(400).json({ error }));
};


// SUPPRESSION SAUCE ::::::::::::::::::::::::::::::::
 exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


// RECUPERE TOUTES LES SAUCES ::::::::::::::::::::::::::
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch( error => res.status(400).json({ error }));
};


// AJOUTE LIKE SAUCE ::::::::::::::::::::::::::::::::::::
// update-increment and save avec enchainement de condition likedislike update 
   
exports.likeIdSauce = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;
  try {
 
    if (like == 1) { 
   // ajout like avec les operateurs push et inc
      Sauce.updateOne(
          { _id: req.params.id },
          { $push: { usersLiked: userId },
            $inc: { likes: 1 } }
      )
        .then(() => res.status(200).json({ message: "j'adore" }))
        .catch((error) => res.status(400).json({ error }));
        
    } else  
    if (like == -1) {  
      Sauce.updateOne(
          { _id: req.params.id },
          { $push: { usersDisliked: userId },
            $inc: { dislikes: 1 } }
      )
        .then(() => res.status(200).json({ message: "Je n'aime pas!" }))
        .catch((error) => res.status(400).json({ error }));
        
    } else {
         // SUPRESSION DES AVIS LIKED AVEC l'ID DU USER opérateurs mangoDB $pull et $inc
      Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
        Sauce.updateOne(
              { _id: req.params.id },
              { $pull: { usersLiked: userId },
                $inc: { likes: -1 } }
          )
          .then(() => res.status(200).json({ message: "Supprimé" }))
          .catch((error) => res.status(400).json({ error }));
            
        } else if (sauce.usersDisliked.includes(userId)) {         
          Sauce.updateOne(
            { _id: req.params.id },
            { $pull: { usersDisliked: userId },
              $inc: { dislikes: -1 } }
          )
          .then(() => res.status(200).json({ message: 'Supprimé !' }))
          .catch((error) => res.status(400).json({ error }));
        }
      });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};










