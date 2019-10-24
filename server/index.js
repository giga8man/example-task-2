const express = require('express')
const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

const treshhold = 5 * 60000; // 5 minutes
const gpsData = require('../data/tracking.json')

app.get('/', (req, res) => {
  // TODO(Task 1): Split tracking data into trip segments for example by using the time property.

  gpsData.sort((a,b)=> (new Date(a.time)).getTime() - (new Date(b.time)).getTime());  // sorting gpsData with time 
  let tripSegments = []; // all trips should be here after the process
  let segmentIndex = 0 ; // indicator for the active trip while searching for related gps point
  tripSegments[segmentIndex] = [gpsData[0]]; // assume that the first gps point is the begging for the first trip 
  for (let gpsPointIndex = 0; gpsPointIndex < gpsData.length -1 ; gpsPointIndex++) {
    //check if the next gps point's time within the gps point's time included treshhold 
    if ((new Date(gpsData[gpsPointIndex +1].time).getTime() <= (new Date(gpsData[gpsPointIndex].time)).getTime() + treshhold)) {
      //if yes so the gps point ( gpsData[gpsPointIndex + 1] ) belongs to the current trip
      tripSegments[segmentIndex].push(gpsData[gpsPointIndex + 1]);
    }
    else {
      //if no so the gps point ( gpsData[gpsPointIndex + 1] ) is a begging for a new trip
      tripSegments[++segmentIndex] = [gpsData[gpsPointIndex + 1]];
    }
  }
  res.send(tripSegments)
})

app.get('/location/:when', (req, res) => {
  // TODO(Task 2): Return the tracking data closest to `req.params.when` from `gpsData`.
  res.send({})
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
