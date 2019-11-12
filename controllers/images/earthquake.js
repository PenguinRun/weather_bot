const searchEarquakeAction = require('../../models/earthquake_data')

module.exports = async function getEarthquake() {
  try {
    const startTime = new Date().reduceDays(3)
    const endTime = new Date()
    const earthquakeImage = await searchEarquakeAction({ startTime, endTime })
    let result = []

    for (let i = 0; i < earthquakeImage.length; i += 1) {
      result.push({
        type: 'image',
        originalContentUrl: earthquakeImage[i],
        previewImageUrl: earthquakeImage[i]
      })
    }
    return result
  } catch (err) {
    console.log(err)
    throw new RangeError(err.message)
  }
}

Date.prototype.reduceDays = function (days) {
  this.setDate(this.getDate() - days);
  return this;
}