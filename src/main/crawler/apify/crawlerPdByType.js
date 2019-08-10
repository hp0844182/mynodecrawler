"use strict";
import Apify from 'apify';
/**
 * 根据render进程传入过来的产品类型页面进行爬取
 * @types :string[],url集合。
 */
export async function crawlerByTypes(types) {
    Apify.main(async () => {
        // 创建爬取url列表
        const requestList = await Apify.openRequestList('typeUrls', types);
        const requestQueue = await Apify.openRequestQueue('typeProducts');
        const crawler = new Apify.CheerioCrawler({
            // maxRequestsPerCrawl: 50, // 最多请求的页面数量，但是应为请求是并行，实际可能会高于此数
            requestList, // requestList创建之后就无法更改，它会被添加到请求队列当中
            requestQueue, // 爬行过程中会动态添加
            handlePageFunction: async ({ $, request }) => {
                console.log(request.url)
                // Only enqueue new links from the category pages.
                if (!request.userData.detailPage) {
                    await Apify.utils.enqueueLinks({
                        $,
                        requestQueue,
                        pseudoUrls: ['https://www.amazon.cn[.*]'],
                        // selector: 'div.left_nav  a,',
                        baseUrl: request.loadedUrl,
                        transformRequestFunction: req => {
                            // 进入详情页面之后就不再向下爬取
                            if (req.url.indexOf('https://www.amazon.cn/dp') > -1)
                                req.userData.detailPage = true;
                            return req;
                        },
                    });
                } else {
                    // 当前为详情页面
                    console.log($('#productTitle').text())
                }
            },
        })
            await crawler.run().then(() => {
                console.log('商品爬取结束啦！')
            })
        console.log(423432)
    })
return 1;
}




