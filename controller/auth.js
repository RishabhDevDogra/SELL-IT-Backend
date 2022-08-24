let passport = require('passport');
let Inventory = require('../models/inventory');
let Question = require('../models/question');
let UserModel = require('../models/user');

function getErrorMessage(err) {    
    if (err.errors) {
        for (let errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } 
    if (err.message) {
        return err.message;
    } else {
        return 'Unknown server error';
    }
};

// helper function for guard purposes
exports.requireAuth = function(req, res, next)
{
    passport.authenticate('tokencheck', { session: false }, function(err, user, info) {
        if (err) return res.status(401).json(
          { 
            success: false, 
            message: getErrorMessage(err)
          }
        );
        if (info) return res.status(401).json(
          { 
            success: false, 
            message: info.message
          }
        );
        req.payload = user;
        next();
      })(req, res, next);
}

exports.isOwner = async function (req, res, next){

    try {
    
        let id = req.params.id;
        let inventoryItem = await Inventory.findById(id).populate('owner');
        
        console.log(inventoryItem);
        if(inventoryItem == null) // Item not found
        {
            throw new Error('Item not found'); // Express catches the error.
        }
        else if(inventoryItem.owner != null){ // Item has a owner

            if(inventoryItem.owner._id != req.payload.id){

                let currentUser = await UserModel.findOne({_id: req.payload.id}, 'admin');

                if(currentUser.admin != true){ // User is not a admin
                    console.log('====> Not authorized');
                    return res.status(403).json(
                        { 
                            success: false, 
                            message: 'User is not authorized to modify this item.'
                        }
                    );
                }
            }
        }
    
        next();
    
    } catch (error) {
    console.log(error);
    return res.status(400).json(
        { 
            success: false, 
            message: getErrorMessage(error)
        }
    );
    }

}

exports.isQuestionOwner = async function (req, res, next){

    try {
    
        let id = req.params.id;
        let questionComment = await Question.findById(id).populate('owner');
        
        console.log(questionComment);
        if(questionComment == null) // Item not found
        {
            throw new Error('Item not found'); // Express catches the error.
        }
        else if(questionComment.owner != null){ // Item has a owner

            
            if(questionComment.owner._id != req.payload.id){

                let currentUser = await UserModel.findOne({_id: req.payload.id}, 'admin');

                if(currentUser.admin != true){ // User is not a admin
                    console.log('====> Not authorized');
                    return res.status(403).json(
                        { 
                            success: false, 
                            message: 'User is not authorized to answer this question.'
                        }
                    );
                }
            }
        }
    
        next();
    
    } catch (error) {
    console.log(error);
    return res.status(400).json(
        { 
            success: false, 
            message: getErrorMessage(error)
        }
    );
    }

}