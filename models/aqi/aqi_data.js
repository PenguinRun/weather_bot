const request = require('request')

module.exports = async function() {
  try {
    const result = await getAqiData()
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1'
  } catch (err) {
     console.log(err)
     throw new RangeError(err.message)
  }
}

async function getAqiData() {
    return new Promise((resolve, reject) => {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
        const url = 'https://opendata.epa.gov.tw/api/v1/AQI?%24skip=0&%24top=1000&%24format=json'
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
          console.log('===body: ', body)
        })
      })
}
