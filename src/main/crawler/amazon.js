import superagent from 'superagent';
require('superagent-charset')(superagent);
import cheerio from 'cheerio';
import { parseHtmlToTypes } from './tool';
import { ipcMain } from 'electron';
import { crawlerByTypes } from './apify/crawlerPdByType';
import Crawler from 'crawler';

// 亚马逊中国主站
const baseUrl = 'https://www.amazon.cn'

/**
 * 获取产品类型数组
 */
export function getProductTypes(mainWindow, winId) {
    const url = 'https://www.amazon.cn/gp/site-directory/458-6902022-1392943?ie=UTF8&ref_=nav_shopall_btn';
    superagent.get(url).end((err, res) => {
        if (err) {
            return console.log('页面拉取失败！');
        }
        const productTypes = parseHtmlToTypes(res.text);
        mainWindow.webContents.send('productType', productTypes, winId)
    })
}

/**
 * 监听render进程爬取请求
 */
export function spiderListen() {
    ipcMain.on('goSpider', (e, data) => {
        try {
            // 爬取商品信息
            var a = crawlerByTypes(data);
            console.log('调取爬取商品',a)
        } catch (error) {
            console.log(error);
        }
    })
    
}