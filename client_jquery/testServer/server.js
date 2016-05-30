var http = require('http');
var express = require('express');
var app = express();

app.use(express.static('../app'));

var words = [];
words[0] = ['SALASANA', 'Sana jota ei kerrota kaikille.'];
words[1] = ['TALITIAINEN', 'Lentävänä eläin, jossa keltaista väritystä.'];
words[2] = ['PERISKOOPPI', 'Laite jolla näet vaikka sinua ei nähdä.'];
words[3] = ['KESÄLOMA', 'Vuoden paras aika.'];

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
    var id = Math.floor((Math.random() * words.length));
    res.json( { id: id, length: words[id][0].length } );
})

app.get('/HirsiServer_JAX-RS/services/words/letterInWord/:id', function (req, res)
{
    var id = req.params.id;
    var letter = req.query.letter;

    var jsonData = {};

    for( var i = 0; i < words[id][0].length; i++ )
    {
        if( words[id][0][i] == letter )
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
    jsonData[0] = words[id][1];

    res.json( jsonData );
})
