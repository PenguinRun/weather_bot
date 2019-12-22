const request = require('request')

module.exports = async function (locationId) {
  try {
    const result = await getCountyNoteData(locationId)
    return result
  } catch (err) {
    console.log(err)
    throw new RangeError(err.message)
  }
}

function getCountyNoteData(locationId) {
  return new Promise((resolve, reject) => {
    const url = 'https://www.cwb.gov.tw/Data/js/fcst/W50_Data.js?'
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
      // 另外種做法可用 eval 或 使用 JSON parse 的方式來執行。但 JSON parse 需將資料統整成標準的 JSON 格式才行。
      // let result = body.replace('var W50_County=', '').replace(/\s/g, "").replace(/[""]/g, '').replace(/[']/g, '"')
      const getAllNoteDatas = Function(`${body}; return W50_County;`)
      const allNoteDatas = getAllNoteDatas()
      let title, content, dataTime
      for (let key in allNoteDatas) {
        if (key === locationId) {
          title = allNoteDatas[key].Title.replace('【', '').replace('】', '').replace('；', '\n')
          content = allNoteDatas[key].Content
          dataTime = allNoteDatas[key].DataTime
          break
        }
      }
      content = content.join('\n\n')
      return resolve({ title, content, dataTime })
    })
  })
}
