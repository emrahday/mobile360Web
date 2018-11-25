const express = require('express');
const bodyParser = require('body-parser'); // middleware to handle post body
const hbs = require('hbs');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // use middleware in order to get req.body for Content-Type: application/json
app.use(bodyParser.urlencoded({ extended: false })); // use middleware in order to get req.body for Content-Type: application/x-www-form-urlencoded
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname+'/views');

app.get('/', (req, res) => {
    res.render('index.hbs', //hbs files must be inside views directory
        {
            title: 'Sandbox',
            year: new Date().getFullYear()
        }
    ); 
});

app.listen(3010, () => { console.log('Server listening port:3010 ...');});