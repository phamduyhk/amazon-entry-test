const NeDB = require('nedb-promises')
var db = {};

queryLimit = 10;
db.users = new NeDB({
    filename: 'database'
});
db.users.load();
// console.log("successful remote connect database first time");
// insert
db.addstock = function (name = isRequired(), amount) {
    if(amount==undefined){
        amount = 1;
    }
    db.users.update({
        name: name,
    }, {
        $set: {
            amount: amount
        }
    }, {
        upsert: true
    })
}

db.checkstock = function (name) {
    if(name){
        return db.users.find({
            name: name
        })
    }
    else{
        return db.users.find({
            amount: {
                $ne: "0"
            }
        }).sort({
            name: 1
        })
    }
}

db.sell = function (name = isRequired(), amount, price) {
    if(amount==undefined){
        amount = 1;
    }
    let dbAmount = "0";
    db.users.findOne({
        name:name
    }).then(function(data){
        let sale = 0;
        if(data.sale){
            sale = data.sale;
        }
        if(data.amount){
            dbAmount = data.amount;
        }
        let dbAmountNum = Number(dbAmount);
        let reqAmount = Number(amount);
        let AmountValue = 0;
        if(dbAmount-reqAmount>0){
            AmountValue = dbAmount-reqAmount;
        }
        db.users.update({
            name: name,
        }, {
            $set: {
                amount: AmountValue,
                sale: sale+Number(price)*reqAmount
            }
        }, {
            upsert: true
        })

    }) 
}

db.checksales = function(){
    return db.users.find({
        sale: {
            $exists: true
        }
    })
}

db.deleteall = function(){
    db.users.remove({
    }, {
        multi: true
    })
}


module.exports = db;