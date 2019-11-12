const request = require('request')

module.exports = async function ({ startTime, endTime }) {
  try {
    const result = await getEarthquakeData({ startTime, endTime })
    return result
  } catch (err) {
    console.log(err)
    throw new RangeError(err.message)
  }
}

function getEarthquakeData({ startTime, endTime }) {
  return new Promise((resolve, reject) => {
    const url = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/E-A0016-001?' +
      'Authorization=' + process.env.AUTHORIZATION
      '&limit=3' +
      '&timeFrom=' + startTime +
      '&timeTo=' + endTime
    request({
      url,
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    }, function (error, response, body) {
      if (error) {
        return reject(new Error(error))
      }
      const earthquakeAllData = JSON.parse(body)
      if (earthquakeAllData.success !== 'true') {
        return reject(new Error('get earthquake data fail'))
      }
      const earthquakeRecord = earthquakeAllData.records.earthquake
      let earthquakeResult = []
      for (let i = 0; i < earthquakeRecord.length; i += 1) {
        earthquakeResult.push(earthquakeRecord[i].reportImageURI)
      }
      return resolve(earthquakeResult)
    })
  })
}
