const getAqiDataAction = require('../../models/aqi')

module.exports = async function () {
    try {
        const result = await getAqiDataAction.aqiData()
    } catch (err) {
        console.log(err)
        throw new RangeError(err.message)
    }
}
