const { client } = require('../config/line_bot')
const countyList = require('../services/county')
const weatherInformation = require('./weather')
const images = require('./images')
const typhoon = require('./typhoon')

module.exports = (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result)).catch(err => { console.log('line err: ', err) });
}

async function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    if (event.message.text === '地震') {
        return client.replyMessage(event.replyToken, await images.earthquake());
    }
    if (event.message.text === '紫外線') {
        return client.replyMessage(event.replyToken, await images.uvi());
    }
    if (event.message.text === '空氣品質') {
        return client.replyMessage(event.replyToken, await images.aqi());
    }
    if (event.message.text === '溫度') {
        return client.replyMessage(event.replyToken, await images.temperature());
    }
    if (event.message.text === '雨量') {
        return client.replyMessage(event.replyToken, await images.rainfall());
    }
    if (event.message.text === '颱風') {
        return client.replyMessage(event.replyToken, await typhoon())
    }
    const county = foundCounty(event.message.text)
    if (county !== undefined) {
        const userProfile = await client.getProfile(event.source.userId)
        const displayName = userProfile.displayName
        return client.replyMessage(event.replyToken, await weatherInformation.getWeatherMenu(countyList[county], displayName))
    }
    if (event.message.text.includes('天氣概況') === true) {
        const processString = event.message.text.replace('天氣概況', '')
        const secondFoundCounty = foundCounty(processString)
        if (secondFoundCounty !== undefined) {
            return client.replyMessage(event.replyToken, await weatherInformation.getCountyNote(countyList[secondFoundCounty]))
        }
    }
    if (event.message.text.includes('一週天氣') === true) {
        const processString = event.message.text.replace('一週天氣', '')
        const secondFoundCounty = foundCounty(processString)
        if (secondFoundCounty !== undefined) {
            return client.replyMessage(event.replyToken ,await weatherInformation.getCountyWeahter(countyList[secondFoundCounty]))
        }
    }
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text
    });
}

function foundCounty(message) {
    return Object.keys(countyList).find(element => element === message)
}
