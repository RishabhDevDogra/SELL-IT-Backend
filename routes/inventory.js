var express = require('express');
var router = express.Router();

let inventoryController = require('../controller/inventory');
let authController = require('../controller/auth');

// Connect to our model
// let Inventory = require('../models/inventory');

// function getErrorMessage(err) {    
//     if (err.errors) {
//         for (let errName in err.errors) {
//             if (err.errors[errName].message) return err.errors[errName].message;
//         }
//     } 
//     if (err.message) {
//         return err.message;
//     } else {
//         return 'Unknown server error';
//     }
// };

/* GET list of items */
router.get('/list', inventoryController.inventoryList);

// Routers for edit
// router.get('/edit/:id', requireAuth, inventoryController.displayEditPage);
router.put('/edit/:id', authController.requireAuth, authController.isOwner, inventoryController.processEdit);

// Delete
router.delete('/delete/:id', authController.requireAuth, authController.isOwner, inventoryController.performDelete);


/* GET Route for displaying the Add page - CREATE Operation */
// router.get('/add', requireAuth, inventoryController.displayAddPage);

/* POST Route for processing the Add page - CREATE Operation */
router.post('/add', authController.requireAuth, inventoryController.processAdd);

module.exports = router;