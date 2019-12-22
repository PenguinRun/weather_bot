module.exports = async function (locationName, displayName) {
    return {
        "type": "flex",
        "altText": "天氣選單",
        "contents": {
            "type": "carousel",
            "contents": [
                {
                    "type": "bubble",
                    "header": {
                        "type": "box",
                        "layout": "vertical",
                        "spacing": "md",
                        "contents": [
                            {
                                "type": "text",
                                "text": `Hi, ${displayName}`,
                                "size": "md",
                                "weight": "bold"
                            },
                            {
                                "type": "text",
                                "text": `想查詢${locationName}的什麼天氣資訊呢？`,
                                "size": "xs",
                                "weight": "bold"
                            }
                        ]
                    },
                    "footer": {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [
                            {
                                "type": "button",
                                "style": "primary",
                                "color": "#E1A679",
                                "action": {
                                    "type": "message",
                                    "label": "今天天氣",
                                    "text": `${locationName}天氣概況`
                                }
                            },
                            {
                                "type": "button",
                                "style": "primary",
                                "color": "#985F2A",
                                "margin": "md",
                                "action": {
                                    "type": "message",
                                    "label": "一週天氣",
                                    "text": `${locationName}一週天氣`
                                }
                            }
                        ],
                        "margin": "xxl"
                    }
                }
            ]
        }
    }
}