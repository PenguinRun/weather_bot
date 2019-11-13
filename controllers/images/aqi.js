const imageUrl = require('../../services/image_url')

module.exports = function getAqi() {
    return {
        type: 'image',
        originalContentUrl: imageUrl.aqi(),
        previewImageUrl: imageUrl.aqi()
    }
}
