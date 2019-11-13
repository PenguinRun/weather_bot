const imageUrl = require('../../services/image_url')

module.exports = function getTemperature() {
    return {
        type: 'image',
        originalContentUrl: imageUrl.temperature(),
        previewImageUrl: imageUrl.temperature()
    }
}
