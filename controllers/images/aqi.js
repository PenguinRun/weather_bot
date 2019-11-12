const imageUrl = require('../../service/image_url')

module.exports = function getAqi() {
    return {
        type: 'image',
        originalContentUrl: imageUrl.aqi(),
        previewImageUrl: imageUrl.aqi()
    }
}
