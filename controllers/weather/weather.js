const searchCountyName = require('../../services/county')
const searchWeatherAction = require('../../models/weather')

module.exports = async function getCountyWeather(locationName) {
  try {
    const preProcessLocationName = encodeURIComponent(searchCountyName[locationName])
    const result = await searchWeatherAction.recentCountyData(preProcessLocationName)
    // console.log('===result: ', result.uviDatas[0].parameter)
    const uviData = fileterDatas(result.uviDatas)
    return {
      "type": "flex",
      "altText": "this is a flex message",
      "contents": {
        "type": "bubble",
        "hero": {
          "type": "image",
          "url": "https://images.unsplash.com/photo-1506126383447-1baf4fb3c267?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=80.png",
          "size": "full",
          "aspectRatio": "20:13",
          "aspectMode": "cover"
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "spacing": "md",
          "contents": [
            {
              "type": "text",
              "text": "紫外線",
              "size": "xl",
              "weight": "bold"
            },
            {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "contents": uviData
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "spacer",
              "size": "xxl"
            }
          ]
        }
      }
    }
    // return {
    //   type: 'text',
    //   text: result
    // }
  } catch (err) {
    console.log(err)
    throw new RangeError(err.message)
  }
}

function fileterDatas(data) {
  let outside = []
  const noteComponent = {
    type: 'box',
    layout: 'baseline',
    contents: [
      {
        type: 'text',
        text: '日期',
        weight: 'bold',
        margin: 'xs',
        size: 'xs',
        align: 'start'
      },
      {
        type: 'text',
        text: '紫外線指數',
        weight: 'bold',
        margin: 'xs',
        size: 'xs',
        align: 'center'
      },
      {
        type: 'text',
        text: '曝曬級數',
        weight: 'bold',
        margin: 'xs',
        size: 'xs',
        align: 'end'
      }
    ]
  }
  outside.push(noteComponent)
  for (let i = 0; i < data.length; i += 1) {
    let inside = []
    let firstComponent = {
      type: 'text',
      text: data[i].startTime.substring(5, 10),
      weight: 'bold',
      margin: 'xs',
      size: 'xs',
      align: 'start'
    }
    let secondComponent = {
      type: 'text',
      text: data[i].parameter[0].value,
      weight: 'bold',
      margin: 'xs',
      size: 'xs',
      align: 'center'
    }
    let thridComponent = {
      type: 'text',
      text: data[i].parameter[1].value,
      weight: 'bold',
      margin: 'xs',
      size: 'xs',
      align: 'end'
    }
    inside.push(firstComponent, secondComponent, thridComponent)
    let outerCasing = {
      type: 'box',
      layout: 'baseline',
      contents: inside
    }
    outside.push(outerCasing)
  }
  return outside
}
