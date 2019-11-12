const request = require('request')

module.exports = async function (locationName) {
    try {
      const result = await getCountyWeahterData(locationName)
      return result
    } catch (err) {
        console.log(err)
        throw new RangeError(err.message)
    }
}

function getCountyWeahterData(locationName) {
    return new Promise((resolve, reject) => {
      const url = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?' +
        'Authorization=' + process.env.AUTHORIZATION +
        '&locationName=' + locationName
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
        const result = JSON.parse(body)
        const weatherElement = result.records.locations[0].location[0].weatherElement
        let maxTDatas = []
        let minTDatas = []
        let maxCIDatas = []
        let minCIDatas = []
        let popDatas = []
        let wxDatas = []
        let uviDatas = []
        for (let i = 0; i < weatherElement.length; i += 1) {
          if (weatherElement[i].elementName === 'MaxT') {
            maxTDatas = insertData(weatherElement[i].time)
          }
          if (weatherElement[i].elementName === 'MinT') {
            minTDatas = insertData(weatherElement[i].time)
          }
          if (weatherElement[i].elementName === 'MaxCI') {
            maxCIDatas = insertData(weatherElement[i].time)
          }
          if (weatherElement[i].elementName === 'MinCI') {
            minCIDatas = insertData(weatherElement[i].time)
          }
          if (weatherElement[i].elementName === 'PoP12h') {
            popDatas = insertData(weatherElement[i].time)
          }
          if (weatherElement[i].elementName === 'Wx') {
            wxDatas = insertData(weatherElement[i].time)
          }
          if (weatherElement[i].elementName === 'UVI') {
            uviDatas = insertData(weatherElement[i].time)
          }
        }
        return resolve({ minTDatas, maxTDatas, popDatas, wxDatas, maxCIDatas, minCIDatas, uviDatas })
      })
    })
  }
  
  function insertData(items) {
    let datas = []
    for (let i = 0; i < items.length; i += 1) {
      datas.push({
        startTime: items[i].startTime,
        endTime: items[i].endTime,
        parameter: items[i].elementValue
      })
    }
    return datas
  }
  