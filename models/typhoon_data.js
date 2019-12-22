// https://www.cwb.gov.tw/Data/js/typhoon/TY_NEWS-Data.js?
// 圖片依照：TY_DataTime = '201911101200'; 來去拿取
// 並由 https://www.cwb.gov.tw/Data/typhoon/TY_NEWS/PTA_IMGS_201912051200_zhtw.json? 中去提取
// example: https://www.cwb.gov.tw/Data/typhoon/TY_NEWS/PTA_201912051200-0_KAMMURI_zhtw.png

const request = require('request')
const cheerio = require('cheerio')

module.exports = async function () {
    const imageDate = await getTyphoonData()
    const imageUrl = await getTyphoonImageUrl(imageDate.imageDataTime)
    return imageUrl
}

async function getTyphoonData() {
    return new Promise((resolve, reject) => {
        const url = 'https://www.cwb.gov.tw/Data/js/typhoon/TY_NEWS-Data.js?'
        request({
            url,
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        }, function (error, response, body) {
            if (error) {
                return reject(new Error(error))
            }
            const imageDataTime = Function(`${body}; return TY_DataTime;`)
            // console.log('==getAllNoteDatas: ', getAllNoteDatas())
            const $ = cheerio.load(body)
            // console.log($('.panel-body', '#collapse-A1').text())
            // $('div[class="panel-heading"]').find('span').each(function (index, element) {
            //     typhoonInformation.push($(element[0]).text());
            //     typhoonInformation.push($(element[1]).text());
            // });
            const typhoonLevel = $('.panel-heading').find('span').eq(0).text()
            const typhoonName = $('.panel-heading').find('span').eq(1).text()
            const typhoonNumber = $('.panel-heading').find('a').eq(0).text().match(/\d/g).join('')
            let typhoonNow = []
            $('.typ-path ul').eq(0).each((index, element) => {
                typhoonNow.push($(element).text().replace(/[\s+]/g, '').replace(/'/g, ','))
            })
            typhoonNow = typhoonNow.join(',,')
            console.log('===: ', typhoonNow)
            const typhoonInformation = {
                typhoonLevel,
                typhoonName,
                typhoonNumber
            }
            console.log('===typhoonInformation: ', typhoonInformation)
            const typhoonDataTime = Function(`${body}; return TY_TIME.E;`)
            return resolve({imageDataTime: imageDataTime(),typhoonDataTime: typhoonDataTime(), })
        })
    })
}

async function getTyphoonImageUrl(date) {
    return new Promise((resolve, reject) => {
        const url = `https://www.cwb.gov.tw/Data/typhoon/TY_NEWS/PTA_IMGS_${date}_zhtw.json?`
        request({
            url,
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        }, function (error, response, body) {
            if (error) {
                return reject(new Error(error))
            }
            const result = JSON.parse(body)
            const wholeImage = 'https://www.cwb.gov.tw/Data/typhoon/TY_NEWS/'+ result.WHOLE[result.WHOLE.length - 1]
            const eachImage = 'https://www.cwb.gov.tw/Data/typhoon/TY_NEWS/' + result.EACH[0].list[result.EACH[0].list.length - 1]
            return resolve([wholeImage, eachImage])
        })
    })
}
