const searchTyphoonData = require('../models/typhoon_data')

module.exports = async function () {
    try {
        const typhoonImage = await searchTyphoonData()
        let result = []
        typhoonImage.map(element => {
            result.push({
                type: 'image',
                originalContentUrl: element,
                previewImageUrl: element
            })
        })
        return result
    } catch (err) {
        console.log(err)
        throw new RangeError(err.message)
    }
}

