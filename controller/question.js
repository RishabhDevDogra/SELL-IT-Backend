// create a reference to the model
let Inventory = require('../models/inventory');
let QuestionModel = require('../models/question');
let Question = require('../models/question');
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

module.exports.questionList = async function(req, res, next) {  
    try {
        let questionList = await QuestionModel.find().populate();

        res.status(200).json(questionList);
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
        let id = req.params.id

        let comment = await Question.findById(id);
        let comment2 = comment.comment;
        let item = comment.item;
        let inventory = comment.inventory;
        let owner = comment.owner;

        let updatedComment = QuestionModel({
            _id: id, //id is not present in the body.
            answer: req.body.answer

        });

        QuestionModel.updateOne({_id: id}, updatedComment, (err) => {
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
                        message: 'Comment updated successfully.'
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

        CommentModel.remove({_id: id}, (err) => {
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
        let id = req.params.id;
        let inventory = await Inventory.findById(id);
        let itemname = inventory.item;
        let owner = inventory.owner;
        let user = await User.findById(owner);
        let ownername = user.username;
        let newComment = QuestionModel({
            _id: req.body.id,
            comment: req.body.comment,
            item: itemname,
            inventory: inventory,
            owner: owner,
            answer: 'waiting for owner answer',
            ownername: ownername
        });
    
        QuestionModel.create(newComment, (err, comment) =>{
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
                res.status(200).json(comment);     
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