const imageUrl = require('../../service/image_url')

module.exports = function getRainfall() {
    console.log(imageUrl.rainfall())
    return {
        type: 'image',
        originalContentUrl: imageUrl.rainfall(),
        previewImageUrl: imageUrl.rainfall()
    }
}
