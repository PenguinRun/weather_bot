const { client } = require('../config/line_bot')
const countyList = require('../services/county')
const weatherInformation = require('./weather')
const images = require('./images')

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
    if (event.message.text === '降雨機率') {
        return client.replyMessage(event.replyToken, await images.rainfall());
    }
    const foundCounty = Object.keys(countyList).find(element => {
        return element === event.message.text
    })
    if (foundCounty !== undefined) {
        return client.replyMessage(event.replyToken, await weatherInformation.getCountyWeahter(countyList[foundCounty]))
        // return client.replyMessage(event.replyToken, await weatherInformation.getCountyNote(countyList[foundCounty]))
    }
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text
    });
}
