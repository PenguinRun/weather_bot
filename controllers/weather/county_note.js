const searchCountyName = require('../../services/county')
const searchCountyId = require('../../services/county_info')
const searchWeatherAction = require('../../models/weather')

module.exports = async function getCountyNote(locationName) {
  try {
    const preProcessLocationName = searchCountyName[locationName]
    let locationId = 0
    for (let i = 0; i < searchCountyId.length; i += 1) {
      if (searchCountyId[i].Name.C === preProcessLocationName) {
        locationId = searchCountyId[i].ID
        break
      }
    }
    const result = await searchWeatherAction.countyNoteData(locationId)
    return {
      "type": "flex",
      "altText": "天氣概況",
      "contents": {
        "type": "carousel",
        "contents": [
          {
            "type": "bubble",
            "hero": {
              "type": "image",
              "url": "https://images.unsplash.com/photo-1471899236350-e3016bf1e69e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2251&q=80.png",
              "size": "full",
              "aspectRatio": "20:10",
              "aspectMode": "cover",
              "action": {
                "type": "message",
                "text": "空氣品質"
              }
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "spacing": "md",
              "contents": [
                {
                  "type": "text",
                  "text": `${result.title}`,
                  "wrap": true,
                  "weight": "bold",
                  "gravity": "center",
                  "size": "xl"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "margin": "lg",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "更新",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 1
                        },
                        {
                          "type": "text",
                          "text": `${result.dataTime}`,
                          "wrap": true,
                          "size": "sm",
                          "color": "#666666",
                          "flex": 4
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "地點",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 1
                        },
                        {
                          "type": "text",
                          "text": `${locationName}`,
                          "wrap": true,
                          "color": "#666666",
                          "size": "sm",
                          "flex": 4
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "細節",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 1
                        },
                        {
                          "type": "text",
                          "text": `${result.content}`,
                          "wrap": true,
                          "color": "#666666",
                          "size": "sm",
                          "flex": 4
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    }
  } catch (err) {
    console.log(err)
    throw new RangeError(err.message)
  }
}
