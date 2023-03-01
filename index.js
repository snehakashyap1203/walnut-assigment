const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const geolib = require('geolib');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const apiKey = 'AIzaSyAfVOOuoaRrF2oMhYciRv_t_g3ExvOcMVI';

app.get('/distance/:city1/:city2', function(req, res) {
  const city1 = req.params.city1;
  const city2 = req.params.city2;

  const url1 = `https://maps.googleapis.com/maps/api/geocode/json?address=${city1}&key=${apiKey}`;
  const url2 = `https://maps.googleapis.com/maps/api/geocode/json?address=${city2}&key=${apiKey}`;

  request(url1, function(err, response, body1) {
    if (err) throw err;
    const location1 = JSON.parse(body1).results[0]?.geometry?.location;
    if (!location1) {
      return res.status(400).json({ error: 'Invalid city name: ' + city1 });
    }
    request(url2, function(err, response, body2) {
      if (err) throw err;
      const location2 = JSON.parse(body2).results[0]?.geometry?.location;
      if (!location2) {
        return res.status(400).json({ error: 'Invalid city name: ' + city2 });
      }
      const distanceInMeters = geolib.getDistance(location1, location2);
      const distanceInKilometers = distanceInMeters / 1000;
      res.json({ distance: distanceInKilometers });
    });
  });
});

app.listen(3002, function() {
  console.log('Server listening on port 3002');
});
