const searchCountyName = require('../../service/county')
const searchCountyId = require('../../service/county_info')
const searchWeatherAction = require('../../models/weather')

module.exports = async function getCountyNote(locationName) {
  try {
    const preProcessLocationName = searchCountyName[locationName]
    let locationId = 0
    for (let i = 0; i < searchCountyId.length; i += 1) {
      if (searchCountyId[i].Name.C === preProcessLocationName) {
        locationId = searchCountyId[i].ID
        break
      }
    }
    const result = await searchWeatherAction.countyNoteData(locationId)
    return [
      {
        type: 'text',
        text: result.title
      },
      {
        type: 'text',
        text: `資料更新時間：\n${result.dataTime}`
      },
      {
        type: 'text',
        text: result.content
      }
    ]
  } catch (err) {
    console.log(err)
    throw new RangeError(err.message)
  }
}
