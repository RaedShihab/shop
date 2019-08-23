const express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const saltRounds = 10;
const router = express.Router();
const User = require('../BackEnd/models')
const db = require('../BackEnd/sequelizeInstance');

// add users to database (signup)
router.post('/signup', (req, res) => 
User.findOne({ 
    where:{email: req.body.email,}  
})
.then(user => {
    if(user) {
        res.status(409).json({Messege: 'Mail exsist'})
    } 
    else {
        const myPlaintextPassword = req.body.password
        bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
            // Store hash password DB.
                    if(err) {console.log('errerere',err)}
                User.create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hash
                })
            });  
    }
})
.then(user => {console.log('USER',user)
res.send('user added')
})
.catch(err => console.log('ERROR',err))
)
// check user's information (signin)
router.post('/login', (req, res) => {
    User.findOne({
        where: {email: req.body.email} 
    })
    .then(user => {
      if (user === null) {
        return res.status(401).json({
          message: "Auth failed1"
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
          console.log(user.password)
        if (err) {
            console.log('i am here')
            res.status(401).json({
            message: "Auth failed2"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user.id
            },
            'process.env.JWT_KEY',
            {
                expiresIn: "1h"
            }
          );
           res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
})


//get user with cirtain id
router.get('/user', (req, res) => 
User.findAll({
    where: {
        id : 12
    }
})
.then(user=> {
    console.log(user)
    res.send(user)
}
)
.catch(err => console.log(err))
)
// update user
router.put('/updateUser', (req, res) => 
User.update({
    firstName : "Soso",
    lastName : 'Shihab'
},
{
    where : {id : 12}
}
)
.then(user => {
    console.log(user)
    res.send(user)
})
)

// creatre table if not exsist:
// we can use this   User.sync({force: true});
// or this:
db.sync();

module.exports = router;