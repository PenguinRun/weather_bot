const imageUrl = require('../../service/image_url')

module.exports = function getUvi() {
    return {
        type: 'image',
        originalContentUrl: imageUrl.uvi,
        previewImageUrl: imageUrl.uvi
    }
}
