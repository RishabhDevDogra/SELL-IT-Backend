// create a reference to the model
let InventoryModel = require('../models/inventory');
let User = require('../models/user');

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

module.exports.inventoryList = async function(req, res, next) {  
    try {
        let inventoryList = await InventoryModel.find().populate({
            path: 'owner',
            select: 'firstName lastName email username admin created'
        });

        res.status(200).json(inventoryList);
    } catch (error) {
        return res.status(400).json(
            { 
                success: false, 
                message: getErrorMessage(error)
            }
        );
    }
    
}

// module.exports.displayEditPage = (req, res, next) => {
    
//     let id = req.params.id;

//     InventoryModel.findById(id, (err, itemToEdit) => {
//         if(err)
//         {
//             console.log(err);
//             res.end(err);
//         }
//         else
//         {
//             //show the edit view
//             res.render('inventory/add_edit', {
//                 title: 'Edit Item', 
//                 item: itemToEdit,
//                 userName: req.user ? req.user.username : ''
//             })
//         }
//     });
// }


module.exports.processEdit = async (req, res, next) => {

    try {
        let id = req.params.id;
        let owner = req.payload.id;
        let user = await User.findById(owner);
        let ownername = user.username;

        let updatedItem = InventoryModel({

            _id: id, //id is not present in the body.
            item: req.body.item,
            condition: req.body.condition,
            color: req.body.color,
            information: req.body.information,
            date: req.body.date,
            enddate: req.body.enddate,
            owner: (req.body.owner == null || req.body.owner == "")? req.payload.id : req.body.owner,
            ownername: ownername
        });

        InventoryModel.updateOne({_id: id}, updatedItem, (err) => {
            if(err)
            {
                console.log(err);
                // res.end(err);
                return res.status(400).json(
                    { 
                        success: false, 
                        message: getErrorMessage(err)
                    }
                );
            }
            else
            {
                // console.log(req.body);
                // refresh the book list
                // res.redirect('/inventory/list');
                return res.status(200).json(
                    { 
                        success: true, 
                        message: 'Item updated successfully.'
                    }
                );
            }
        });
    } catch (error) {
        return res.status(400).json(
            { 
                success: false, 
                message: getErrorMessage(error)
            }
        );
    }  

}


module.exports.performDelete = (req, res, next) => {

    try {
        let id = req.params.id;

        InventoryModel.remove({_id: id}, (err) => {
            if(err)
            {
                console.log(err);
                // res.end(err);
                return res.status(400).json(
                    { 
                        success: false, 
                        message: getErrorMessage(err)
                    }
                );
            }
            else
            {
                // refresh the book list
                // res.redirect('/inventory/list');
                return res.status(200).json(
                    { 
                        success: true, 
                        message: 'Item deleted successfully.'
                    }
                );
            }
        });
    
    } catch (error) {
        return res.status(400).json(
            { 
                success: false, 
                message: getErrorMessage(error)
            }
        );   
    }
    
}


// module.exports.displayAddPage = (req, res, next) => {

//     let newItem = InventoryModel();

//     res.render('inventory/add_edit', {
//         title: 'Add a new Item',
//         item: newItem,
//         userName: req.user ? req.user.username : ''
//     })          

// }

module.exports.processAdd = async (req, res, next) => {

    try {
        let owner = req.payload.id;
        let user = await User.findById(owner);
        let ownername = user.username;

        let newItem = InventoryModel({
            _id: req.body.id,
            item: req.body.item,
            condition: req.body.condition,
            color: req.body.color,
            information: req.body.information,
            date: req.body.date,
            enddate: req.body.enddate,
            owner: (req.body.owner == null || req.body.owner == "")? req.payload.id : req.body.owner,
            ownername: ownername
        });
    
        InventoryModel.create(newItem, (err, item) =>{
            if(err)
            {
                console.log(err);
                // res.end(err);
                return res.status(400).json(
                    { 
                        success: false, 
                        message: getErrorMessage(err)
                    }
                );
            }
            else
            {
                // refresh the book list
                // console.log(item);
                // res.redirect('/inventory/list');
                res.status(200).json(item);     
            }
        });
    } catch (error) {
        return res.status(400).json(
            { 
                success: false, 
                message: getErrorMessage(error)
            }
        );   
    }       
}