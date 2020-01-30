const searchWeatherAction = require('../../models/weather')
const imagUrl = require('../../services/image_url')

module.exports = async function getCountyWeather(locationName) {
  try {
    // 將 locationName 轉成 encode
    const preProcessLocationName = encodeURIComponent(locationName)
    // 藉由氣象局 API 來取得資料。
    const result = await searchWeatherAction.recentCountyData(preProcessLocationName)
    const containerData = await containerFilterDatas(locationName, result)
    return {
      "type": "flex",
      "altText": "一週天氣",
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
  let uviIndex = 0
  // const startTime = data.uviDatas[0].startTime.substring(0, 10)
  let originWeekArray = []
  for (let i = 0 ; i < data.minTDatas.length; i += 1) {
    originWeekArray.push(data.minTDatas[i].startTime.substring(0, 10))
  }
  
  const weekArray = Array.from(new Set(originWeekArray))

  const startTime = data.minTDatas[0].startTime.substring(0, 10)
  const uviTime = data.uviDatas[0].startTime
  // 若取得天氣資料的第一個起始時間比紫外線資料的第一個起始時間還要來的早則不會顯示該天的紫外線數值
  if (new Date(startTime) < new Date(uviTime)) {
    uviIndex = -1
  }
  for (let i = 0; i < weekArray.length; i += 1) {
    // 英文對照
    const englishDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    // 日期顏色對照
    const colors = ['#F44336', '#FFB11B', '#F596AA', '#227D51', '#F17C67', '#0D5661', '#592C63']
    let date = new Date(weekArray[i])
    const dayInfomation = `${locationName} - ${date.getMonth() + 1} / ${date.getDate()} ${englishDays[date.getDay()]}`
    let dateString = ''
    if (date.getDate() < 10) {
      dateString = `${date.getMonth() + 1}-0${date.getDate()}`
    } else {
      dateString = `${date.getMonth() + 1}-${date.getDate()}`
    }

    const component = {
      "type": "bubble",
      "header": {
        "type": "box",
        "layout": "horizontal",
        "contents": [
          {
            "type": "text",
            "text": dayInfomation,
            "size": "xl",
            "weight": "bold",
            "color": "#FFFFFF"
          }
        ],
        "backgroundColor": colors[date.getDay()]
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
            "contents": filterDatas(data, dateString, uviIndex)
          }
        ]
      }
    }
    containers.push(component)
    uviIndex = uviIndex + 1
  }
  return containers
}

function filterDatas(data, date, uviIndex) {
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
      } else if (startTime === '12:00:00') {
        timeInterval = '中午至下午'
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
  if (uviIndex !== -1) {
    const uviComponent = {
      type: 'box',
      layout: 'baseline',
      contents: [
        {
          type: 'text',
          text: `紫外線指數：${data.uviDatas[uviIndex].parameter[0].value}`,
          weight: 'bold',
          margin: 'xs',
          size: 'xs',
          align: 'start',
          flex: 0
        },
        {
          type: 'text',
          text: `曝曬級數：${data.uviDatas[uviIndex].parameter[1].value}`,
          weight: 'bold',
          margin: 'xs',
          size: 'xs',
          align: 'end',
          flex: 1
        }
      ]
    }
    outside.push(uviComponent)
  }
  return outside
}


function reduceDays(date, days) {
  let result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}
