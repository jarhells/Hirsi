var http = require('http');
var express = require('express');
var app = express();

app.use(express.static('../app'));

var theWord = 'SALASANA';

app.listen(9000, function () 
{
  console.log('Test server running in port 9000');
});

app.use(function(req, res, next) 
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/HirsiServer_JAX-RS/services/words/getWord', function (req, res)
{
    res.json( { id: '5', length: theWord.length } );
})

app.get('/HirsiServer_JAX-RS/services/words/letterInWord/:id', function (req, res)
{
    var id = req.params.id;
    var letter = req.query.letter;

    var jsonData = {};

    for( var i = 0; i < theWord.length; i++ )
    {
        if( theWord[i] == letter )
        {
            jsonData[i] = letter;  
        }
    }

    res.json( jsonData );
})

app.get('/HirsiServer_JAX-RS/services/words/getHint/:id', function (req, res)
{
    var id = req.params.id;

    var jsonData = {};

    jsonData[0] = 'Sana jota ei kerrota kaikille.';

    res.json( jsonData );
})
