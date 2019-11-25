const searchCountyName = require('../../services/county')
const searchWeatherAction = require('../../models/weather')
const imagUrl = require('../../services/image_url')

module.exports = async function getCountyWeather(locationName) {
  try {
    const preProcessLocationName = encodeURIComponent(searchCountyName[locationName])
    const result = await searchWeatherAction.recentCountyData(preProcessLocationName)
    // console.log('===result: ', result.uviDatas[0].parameter)
    // const uviData = fileterDatas(result.uviDatas)
    const containerData = await containerFilterDatas(locationName, result)
    return {
      "type": "flex",
      "altText": "this is a flex message",
      "contents": {
        "type": "carousel",
        "contents": containerData
      }
    }
  } catch (err) {
    console.log(err)
    throw new RangeError(err.message)
  }
}

function containerFilterDatas(locationName, data) {
  let containers = []
  for (let i = 0; i < data.uviDatas.length; i += 1) {
    let date = data.uviDatas[i].startTime.substring(5, 10)
    const englishDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const colors = ['#FFB11B','#F596AA','#227D51','#F17C67','#0D5661','#592C63','#F44336']
    const day = new Date(date)
    const component = {
      "type": "bubble",
      "header": {
        "type": "box",
        "layout": "horizontal",
        "contents": [
          {
            "type": "text",
            "text": `${locationName} - ${date.replace('-', '/')} ${englishDays[day.getDay()]}`,
            "size": "xl",
            "weight": "bold",
            "color": "#FFFFFF"
          }
        ],
        "backgroundColor": colors[day.getDay()]
      },
      // "hero": {
      //   "type": "box",
      //   "layout": "horizontal",
      //   "spacing": "md",
      //   "contents": [
      //     {
      //       "type": "text",
      //       "text": `hi`,
      //       "size": "xl",
      //       "weight": "bold"
      //     }
      //   ]
      // },
      "body": {
        "type": "box",
        "layout": "vertical",
        "spacing": "md",
        "contents": [
          {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": filterDatas(data, date, i)
          }
        ]
      }
    }
    containers.push(component)
  }
  return containers
}

function filterDatas(data, date, index) {
  let outside = []
  for (let i = 0; i < data.minTDatas.length; i += 1) {
    if (data.minTDatas[i].startTime.includes(date) === true) {
      const startTime = data.minTDatas[i].startTime.substring(11, data.minTDatas[i].startTime.length)
      const endTime = data.minTDatas[i].endTime.substring(11, data.minTDatas[i].endTime.length)
      let timeInterval = ''
      let meridiem = ''
      let blockColor = ''
      if (startTime === '00:00:00') {
        timeInterval = '凌晨至早上'
        meridiem = 'night'
        blockColor = '#FFF9C4'
      } else if (startTime === '06:00:00') {
        timeInterval = '早上至下午'
        meridiem = 'day'
        blockColor = '#BBDEFB'
      } else {
        timeInterval = '晚上至凌晨'
        meridiem = 'night'
        blockColor = '#F5F5F5'
      }
      const noteComponent = {
        type: 'box',
        layout: 'baseline',
        contents: [
          {
            type: 'text',
            text: `${timeInterval}`,
            weight: 'bold',
            margin: 'xs',
            size: 'xs',
            align: 'start',
            flex: 0
          }
        ],
        paddingTop: '10px'
      }
      outside.push(noteComponent)
      const temperatureComponent = {
        type: 'box',
        layout: 'horizontal',
        contents: [
          {
            type: 'image',
            url: imagUrl.wxImage(data.wxDatas[i].parameter[1].value, meridiem),
            margin: 'lg',
            size: 'xs',
            align: 'start',
            flex: 0
          },
          {
            type: 'text',
            text: `${data.minTDatas[i].parameter[0].value}° ~ ${data.maxTDatas[i].parameter[0].value}°`,
            weight: 'bold',
            margin: 'lg',
            size: 'xxl',
            gravity: 'center',
            align: 'start',
            flex: 1
          }
        ]
      }
      outside.push(temperatureComponent)
      const atComponent = {
        type: 'box',
        layout: 'baseline',
        contents: [
          {
            type: 'text',
            text: '體感溫度',
            weight: 'bold',
            margin: 'xs',
            size: 'xs',
            align: 'start',
            flex: 0
          },
          {
            type: 'text',
            text: `${data.minATDatas[i].parameter[0].value}° ~ ${data.maxATDatas[i].parameter[0].value}°`,
            weight: 'bold',
            margin: 'lg',
            size: 'md',
            align: 'start',
            flex: 1
          }
        ],
        paddingTop: '3px',
        paddingBottom: '3px'
      }
      outside.push(atComponent)
      let popValue = data.popDatas[i].parameter[0].value
      // 降雨機率會有空值的問題發生
      if (popValue === ' ') {
        popValue = 0
      }
      const popComponent = {
        type: 'box',
        layout: 'baseline',
        contents: [
          {
            type: 'text',
            text: '降雨機率',
            weight: 'bold',
            margin: 'xs',
            size: 'xs',
            align: 'start',
            flex: 0
          },
          {
            type: 'text',
            text: `${popValue}%`,
            weight: 'bold',
            margin: 'lg',
            size: 'md',
            align: 'start',
            flex: 1
          }
        ],
        paddingBottom: '10px'
      }
      outside.push(popComponent)
      const separatorComponent = {
        type: 'separator',
        color: '#212121'
      }
      outside.push(separatorComponent)
    }
  }
  const uviComponent = {
    type: 'box',
    layout: 'baseline',
    contents: [
      {
        type: 'text',
        text: `紫外線指數：${data.uviDatas[index].parameter[0].value}`,
        weight: 'bold',
        margin: 'xs',
        size: 'xs',
        align: 'start',
        flex: 0
      },
      {
        type: 'text',
        text: `曝曬級數：${data.uviDatas[index].parameter[1].value}`,
        weight: 'bold',
        margin: 'xs',
        size: 'xs',
        align: 'end',
        flex: 1
      }
    ]
  }
  outside.push(uviComponent)
  return outside
}
