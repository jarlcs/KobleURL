'use strict';

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "localhost",            //127.0.0.1:3306
  user: "root",
  password: "Varga123",
  database: "URL",
});

connection.connect()


// generer hash
var sha256 = require('js-sha256');

// tar inn en longURL og hasher den til en shortURL 
// skal deretter legge inn i tabell i databasen som må opprettes
// henter ut longURL på event.body

//funksjon nr1 
module.exports.forkorter = (event, context, callback) => {

  //convert text into a JavaScript object:
  const longUrl = JSON.parse(event.body).longUrl;

  const shortUrl = "http//www.koble.jobs/" +sha256(longUrl).slice(0, 6);

  let sql = 'INSERT INTO urler(shortUrl, longURL) VALUES (shortUrl, longUrl)';
  connection.query(sql);
  connection.end();


  const payload = {
    shortUrl: shortUrl,
    longUrl: longUrl,
  };

  const response = {
    statusCode: 200,
    body: JSON.stringify(payload),
  };

  callback(null, response);
};

// tar inn en shortURL og ser etter match i databasen
//returnerer den tilsvarende longURL-en

//funksjon nr2 
module.exports.forlenger = (event, context, callback) => {
  const shortUrl = event.queryStringParameters.shortUrl;
  console.log(shortUrl);
  connection.query(
    'SELECT * FROM `urler` WHERE `shortUrl` = ' + shortUrl, function(error, results, fields) {
      
      
      const payload = {
        shortUrl: shortUrl,
        longUrl: results,
        results: "results",
      };

      const response = {
        statusCode: 200,
        body: JSON.stringify(payload),
      };

      callback(null, response);
    }
  );

  connection.end; 
};
