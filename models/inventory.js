let mongoose = require('mongoose');

// Create a model class
let inventoryModel = mongoose.Schema(
    {
        item: String,
        condition: String,
        color: String,
        information: String,
        date: Date,
        enddate: Date,
        status: String,
        // Adds relationship with User model
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        ownername: String

    },
    {
        collection: "inventory"
    }
);

module.exports = mongoose.model('Inventory', inventoryModel);