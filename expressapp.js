var express = require('express');
var bodyParser = require('body-parser');
var path = require('path'); //to simply file path and its a core node js module
var expressValidator = require('express-validator');
var mongojs=require('mongojs');
var db=mongojs('customerapp',['customers']);

var app = express();

//Order of middleware is very important
var logger = function (req, res, next) {
    console.log('loggig.....');
    next();
};

//Using looger
app.use(logger);

//View Engine
app.set('view engine', 'ejs');
app.set('Views', path.join(__dirname, 'Views'));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//set static path
/* app.use(express.static(path.join(__dirname,'public')));
 */
var person = [{
    name: 'Ruchir Saxena',
    age: 30
}, {
    name: 'Rohit Kumar',
    age: 28
}];


//Creating request 
//returning text
app.get('/getText', function (req, res) {
    res.send('Hello World 1234');
});

//returing json
app.get('/getJson', function (req, res) {
    res.json(person);
});

//For putting global variables in our app
app.use(function (req,res,next) {
    res.locals.errors=null;
    res.locals.customers=null;
    next();
});

//Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function name(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//Customer object
customers = [{
    id: 1,
    first_name: 'Ajay',
    last_name: 'Kumar',
    email: 'ajay@gmail.com'
},
{
    id: 2,
    first_name: 'Ruchir',
    last_name: 'Saxena',
    email: 'ruchirsaxena@gmail.com'
}, {
    id: 3,
    first_name: 'Rochak',
    last_name: 'Raj',
    email: 'raj@gmail.com'
}
];

//rturning html/View
app.get('/getIndex', function (req, res) {
    db.customers.find(function name(err,docs) {
        console.log(docs);
        res.render('index', {
            customers: docs
        });
    });
    
});

app.post("/users/add", function (req, res) {
    console.log("From Data");

    //Validation
    req.checkBody('first_name', 'First name is require').notEmpty();
    req.checkBody('last_name', 'Last name cannot be empty').notEmpty();
    req.checkBody('email', 'Email cannot be empty').notEmpty();

    errors = req.validationErrors();

    if (errors) {
        console.log('Errors');
        res.render('index',{
            customers: customers,
            errors:errors
        });
    } else {
        //Getting Data
        var newCustomer = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        };
        db.customers.insert(newCustomer,function(err,res){
            if(err){
                console.log(err);
            }
           // res.redirect('/getIndex');
        });
        console.log(newCustomer);
    }
});

//Hosting on post
app.listen('3000', function () {
    console.log("Server started on port 3000");
});