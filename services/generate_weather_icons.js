require('dotenv').config({ path: `${__dirname}/../.env` })
const fs = require('fs')
const request = require('request')
const svgToImg = require('svg-to-img')

// TODO: 補 setTimeout 規則
async function generateWeatherIconsUrl() {
  console.log('Start generating weather_icons.json files...')
  let result = {
    day: {},
    night: {}
  }
  // 目前氣象局有 42 個 icons 可以使用 文件: https://opendata.cwb.gov.tw/opendatadoc/MFC/D0047.pdf
  // 需注意，imgur 有每小時最多 50 個請求的限制，超過就會被 ban 1 小時。來源：https://help.imgur.com/hc/en-us/articles/115000083326-What-files-can-I-upload-What-is-the-size-limit-
  for (let i = 22; i <= 42; i += 1) {
    const index = i < 10 ? '0' + i.toString() : i.toString()
    const dayBase64Code = await getSvgBase64Code('day', index)
    const dayIconImgurUrl = await getImgurURL(dayBase64Code)

    const nightBase64Code = await getSvgBase64Code('night', index)
    const nightIconImgurUrl = await getImgurURL(nightBase64Code)
    if (dayIconImgurUrl === false || nightIconImgurUrl === false) {
      console.log('Stop generating weather_icons.json files...')
      break
    }
    result.day[index] = dayIconImgurUrl
    result.night[index] = nightIconImgurUrl
    console.log('loading...', i)
  }

  const weatherIconData = JSON.stringify(result)
  fs.writeFileSync('../public/weather_icons.json', weatherIconData, function (err) {
    if (err) {
      console.log('generate the weather_icons.json file was fail.')
    }
  })
  console.log('The weather_icons.json file has been saved.')
}

generateWeatherIconsUrl()

function getSvgBase64Code(interval, value) {
  return new Promise((resolve, reject) => {
    request.get(`https://www.cwb.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/${interval}/${value}.svg`,
      async function (err, res, body) {
        if (err) {
          console.log('==request svg buffer fail: ', err)
          return reject(new Error(err.message))
        }
        const image = await svgToImg.from(body).toPng({
          encoding: "base64"
        })
        return resolve(image)
      })
  })
}
function getImgurURL(imageBufferResult) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      request.post({
        url: 'https://api.imgur.com/3/image',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Client-ID ' + process.env.IMGUR_CLIENT_ID
        },
        form: {
          'image': imageBufferResult
        }
      }, function (err, res, body) {
        if (err) {
          console.log('==getImgurURL err: ', err)
          return resolve(false)
        }
        const imgurObject = JSON.parse(body)
        if (imgurObject.success === false) {
          console.log('############')
          console.log('imgur says: ', imgurObject.data.error.message)
          console.log('############')
          return resolve(false)
        }
        return resolve(imgurObject.data.link)
      })
    }, 5000)
  })
}
