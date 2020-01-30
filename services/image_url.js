const uvi = 'https://www.cwb.gov.tw/Data/UVI/UVI.png'

const rainfall = function () {
    return `https://www.cwb.gov.tw/Data/rainfall/${onTime()}_${getHoursAndMinutesForRainfall()}.QZJ8.jpg`
}

const temperature = function () {
    return `https://www.cwb.gov.tw/Data/temperature/${onTime()}_${getHoursAndMinutesForTemperature()}.GTP8.jpg`
}

const aqi = function () {
    const date = Date.now()
    return `https://taqm.epa.gov.tw/taqm/Chart/AqiMap/map2.aspx?lang=tw&ts=${date}`
}

const wxImage = function (value, meridiem) {
    const wxImage = require(`${__dirname}/../public/weather_icons.json`)
    return wxImage[meridiem][value]
}

module.exports = { uvi, rainfall, temperature, aqi, wxImage }

const onTime = () => {
    const date = new Date();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();

    return [date.getFullYear(), "-" +
        (mm > 9 ? '' : '0') + mm, "-" +
        (dd > 9 ? '' : '0') + dd
    ].join('');
}

// 每半小時更新一次
const getHoursAndMinutesForRainfall = () => {
    const date = new Date();
    const hour = date.getHours()
    // 因應氣象局溫度傳訊不是那麼即時用 15 分鐘作為緩衝。
    const minutes = date.getMinutes() - 15
    return [(hour > 9 ? '' : '0') + hour +
        (minutes < 30 ? '00' : '30')
    ].join('');
}

// 每小時更新一次
const getHoursAndMinutesForTemperature = () => {
    const date = new Date();
    let hour = date.getHours()
    const minutes = date.getMinutes()
    hour = minutes < 30 ? hour - 1 : hour
    // 因應氣象局溫度傳訊不是那麼即時用 30 分鐘作為緩衝。
    return [(hour > 9 ? '' : '0') + hour + '00'
    ].join('');
}
