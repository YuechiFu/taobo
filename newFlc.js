const Vue = require('vue');
const axios = require('axios');
const fs = require('fs');
const nodemailer = require('nodemailer')
var tssign = require('./topTssign.js');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length



const userInfoArr = [

  {
    token:'Bearer 4fa57a9f-3efa-4e3e-925c-56409d25aacb',
    name:'hcw',    
    cartId:'19e3d03fed5543c5b43cd4bb947e291c',
    addressId:'8a7a08b67597c46d0175a577df714932'}


  
]

let geetestArr = []

const productCodeLatestArr = [
    'CZ6222-001',//AJ23
    'DD3522-100',//aj11 adapt
    'DD1666-100',//mid冰淇淋
    'CW7104-601',//aj1 冰激凌gs
    '555088-105',//摩卡男
    'DD2224-200',//淡橘色
    'DJ2756-100',//court aj1
    'CZ4385-016',//酒红mi1d
    '575441-105',//摩卡女
    '555112-103',//粉熊猫
    'DD1527-114',//裸眼3dLOW
    'BQ6472-800',//奶茶mid
    'BQ6472-202',//红豆mid
    '554724-073',//黑白灰
    'BQ6931-114',//裸眼3DMID
    'CT0979-602',//zoom拼接
    'CT0979-107',//zoom绿茶
    'CV0152-401',//小闪电aj1
    'CT0979-100',//zoom奶茶
    'DD1503-100',   //dunk北卡蓝
    'DD1869-102',   //dunk high紫
    'DD1503-101',   //dunk熊猫 699
    'BQ6817-500',   //dunk黑紫
    'CW1590-002',   //dunk灰红
    'DD1391-102',   //dunk灰红
    'DD1399-100',   //dunk灰白
    'DD1391-100',   //dunk熊猫 599
    'CW1590-100',   //dunk熊猫 599 
  //   'CW1574-100',//双钩af1
    // '554724-075',
] //需要监听的产品CODE2


const threadCount = userInfoArr.length || 1;
const threads = new Set();


// const productCodeLatestArr = ['CU4962-010'] //需要监听的产品CODE

new Vue({
  el: '#app',
  data: function () {
    return {
      timer: null, //定时器名称
      enableWorker : true // 开启多线程下单
    }
  },
  methods: {
    addGeetestArrGetProductList(func, value1 = '', value2 = '') {
      this.fixedAddGeetestArr(func, value1 = '', value2 = '')
      this.timer = setInterval(() => {
        this.fixedAddGeetestArr(func, value1 = '', value2 = '')
      }, 540000)
      this[func](value1, value2)
    },
    getProductList() {
      let number = 0
      axios({
        url: `https://wxmall-lv.topsports.com.cn/search/shopCommodity/list?shopNo=&sortColumn=upShelfTime&filterIds=&current=1&pageSize=3&tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/search/shopCommodity/list`)}`,
        method: 'get',
        timeout: 3000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.15(0x17000f31) NetType/WIFI Language/zh_CN'
        }
      }).then(res => {
        res.data.data.spu.list.map(spuItem => {
          productCodeLatestArr.map(productItem => {
            if (spuItem.productCode == productItem) {
              this.getProductInfo(spuItem.id, spuItem.shopName, spuItem.productName)
              number++
            }
          })
        })
        if(number == 0 && userInfoArr.length == geetestArr.length){
          setTimeout(() => {
            this.getProductList()
            console.log(`${new Date().toLocaleString()}刷新`);
          }, 0)
        }
      })
      .catch(error => {
        console.log('refresh');
        this.getProductList()
      })
    },
    fixedAddGeetestArr(func, value1 = '', value2 = '') {
      geetestArr = []
      userInfoArr.forEach((item, index) => {
        setTimeout(()=>{
          axios({
            url: `https://wxmall-lv.topsports.com.cn/order/confirmationOrder?tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/order/confirmationOrder`)}`,
            method: 'post',
            data: '{"merchantNo":"TS","shippingId":"","subOrderList":[{"shopNo":"NKCC42","expressType":2,"commodityList":[{"productCode":"DC0589-601","sizeNo":"20160426000036","skuNo":"20201103001512","sizeCode":"4","num":1,"shoppingcartId":"","itemFlag":0,"assignProNo":"0","roomId":"","roomName":"","liveType":0,"shopCommodityId":"f74c014ce0974df09b7eacae64873ec7"}]}],"purchaseType":1}',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': item.token,
              'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.18(0x17001227) NetType/WIFI Language/zh_CN'
            }
          }).then(res => {
            if (res.data.bizCode == 20000) {
              this.getGeetestArr(res.data.data.verificMap.gt, res.data.data.verificMap.challenge, item, func, value1 = '', value2 = '')
            } else {
              console.log(res.data.bizMsg || 'token失效,请更换token')
            }
          })
        },index * 40)
      })
      // 
    },
    getGeetestArr(gt, challenge, item, func, value1 = '', value2 = '') {
      axios({
        method: 'get',
        url: `http://api.ddocr.com/api/gateway.jsonp?wtype=geetest&secretkey=bbe7764080464234a046befa79624816&gt=${gt}&referer=https://servicewechat.com/wx71a6af1f91734f18/30/page-frame.html&challenge=${challenge}`,
        headers: {
          'Accept': 'text/html',
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 Chrome/77.0.3865.120 Safari/537.36'
        }
      }).then(res1 => {
        console.log(`${new Date().toLocaleString()}刷新`);
        if (res1.data.msg == '识别成功') {
          geetestArr.push({
            challenge: res1.data.data.challenge,
            validate: res1.data.data.validate,
          })
          if(geetestArr.length == userInfoArr.length){
            this[func](value1, value2)
          }
          console.table(geetestArr);
        } else {
          axios({
            url: `https://wxmall-lv.topsports.com.cn/order/confirmationOrder?tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/order/confirmationOrder`)}`,
            method: 'post',
            data: '{"merchantNo":"TS","shippingId":"","subOrderList":[{"shopNo":"NKCC42","expressType":2,"commodityList":[{"productCode":"DC0589-601","sizeNo":"20160426000036","skuNo":"20201103001512","sizeCode":"4","num":1,"shoppingcartId":"","itemFlag":0,"assignProNo":"0","roomId":"","roomName":"","liveType":0,"shopCommodityId":"f74c014ce0974df09b7eacae64873ec7"}]}],"purchaseType":1}',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': item.token,
              'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.18(0x17001227) NetType/WIFI Language/zh_CN'
            }
          }).then(res => {
            if (res.data.bizCode == 20000) {
              console.log('再次识别');
              this.getGeetestArr(res.data.data.verificMap.gt, res.data.data.verificMap.challenge, item, func, value1 = '', value2 = '')
            } else {
              console.log(res.data.bizMsg || 'token失效,请更换token')
            }
          })
          console.log(res1.data);
        }
      })
    },
    getFixedProductList(storeNo, productCode) {
      axios({
        url: `https://wxmall-lv.topsports.com.cn/search/shopCommodity/list?searchKeyword=${productCode}&current=1&pageSize=20&sortColumn=upShelfTime&sortType=asc&filterIds=&shopNo=${storeNo}&tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/search/shopCommodity/list`)}`,
        method: 'get',
        timeout: 3000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': ' Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.15(0x17000f31) NetType/WIFI Language/zh_CN'
        }
      }).then(res => {
        if (res.data.data.spu.list.length > 0 && res.data.data.spu.list[0].productCode == productCode) {
          this.getProductInfo(res.data.data.spu.list[0].id, res.data.data.spu.list[0].shopName, res.data.data.spu.list[0].productName)
        } else {
          this.getFixedProductList(storeNo, productCode)
          console.log(`${new Date().toLocaleString()}刷新`);
        }
      }).catch(error => {
        console.log('refresh getFixedProductList');
        this.getFixedProductList(storeNo, productCode)
      })
    },
    getProductInfo(id, shopName, productName) {
      console.log(`这家傻逼店-----→${shopName || '固定监听店铺'}偷摸发售${productName || '固定监听商品'}了-------------------------------${new Date().toLocaleString()}`);
      console.log('-------------------------去商品详情ing-------------------------------' + new Date().toLocaleString());
      axios({
        url: `https://wxmall-lv.topsports.com.cn/shopCommodity/queryShopCommodityDetail/${id}?tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/shopCommodity/queryShopCommodityDetail/${id}`)}`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': ' Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.15(0x17000f31) NetType/WIFI Language/zh_CN'
        }
      }).then(res => {
        console.table(res.data.data.skuList);
        if (res.data.data.status == 3) {
          let data = res.data.data
          let tempSkuData = []
          let fixSizeArr
          if (res.data.data.productCode == '554724-073' || res.data.data.productCode == 'CW0898-400' || res.data.data.productCode == '555088-118') {
            fixSizeArr = [ 3.5, 4, 4.5, 5, 7, 7.5, 8, 8.5, 9, 9.5, 10]
          } else if (res.data.data.productCode == 'CD4991-700' || res.data.data.productCode == 'CD4991-101' || res.data.data.productCode == 'DD3522-100' || res.data.data.productCode == 'DD3522-100') {
            fixSizeArr = [9, 9.5, 10, 10.5]
          } else if (res.data.data.productCode == 'CT0979-107' || res.data.data.productCode == 'CT0979-602' ) {
            fixSizeArr = [5, 5.5, 6, 6.5, 9.5, 10, 10.5, 11]
          } else if (res.data.data.productCode == '554724-075') {
            fixSizeArr = [7,7.5]
          } else if (res.data.data.productCode == 'BQ6472-202' ) {
            fixSizeArr = [5, 5.5, 6, 6.5, 7, 9]
          } else if (res.data.data.productCode == 'CW2190-300') {
            fixSizeArr = [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12]
          } else {
            // fixSizeArr = [5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11, 11.5, 12,'3.5Y','4Y','4.5Y','5Y','5.5Y','6Y']  //男女款
          }
          if (!!fixSizeArr && fixSizeArr.length > 0) {
            fixSizeArr.forEach(item => {
              data.skuList.forEach(dataItem => {
                if (dataItem.sizeCode == item && dataItem.stock / 1 > 0) {
                  tempSkuData.push(dataItem)
                }
              })
            })
          } else {
            data.skuList.forEach(item => {
              item.stock / 1 > 0 && tempSkuData.push(item)
            })
          }
          if (tempSkuData.length > 0) {
            let tempSkuDataSec = JSON.parse(JSON.stringify(tempSkuData))
            userInfoArr.forEach((item, index) => {
              let skuData = {}
              let tempIndex = tempSkuDataSec.length > 0 ? parseInt(Math.random() * tempSkuDataSec.length) : parseInt(Math.random() * tempSkuData.length)
              if (!!fixSizeArr && fixSizeArr.length > 0) {
                skuData = tempSkuDataSec.length > 0 ? tempSkuDataSec[tempIndex] : tempSkuData[tempIndex]
              } else {
                // skuData = tempSkuDataSec[parseInt(Math.random()*tempSkuDataSec.length / 2)]            // 有库存的前一半尺码
                skuData = tempSkuDataSec.length > 0 ? tempSkuDataSec[tempIndex] : tempSkuData[tempIndex]   // 有库存的全尺码
                // skuData = tempSkuDataSec[0]                                   // 有库存的第一个尺码
              }
                let subOrderList = [{
                  "shopNo": data.shopNo,
                  "shopName": data.shopName,
                  "mdmShopName": data.shopName,
                  "shopAddress": data.shopName,
                  "totalNum": 1,
                  "totalPrice": null,
                  "virtualShopFlag": 0,
                  "expressType": 2,
                  "remark": '',
                  "fullDiscountAmount": null,
                  "fullReductionAmount": null,
                  "couponAmount": "0.00",
                  "commodityList": [{
                    "map": {},
                    "orderByClause": null,
                    "shoppingcartId": "",
                    "paterId": null,
                    "productCode": data.productCode,
                    "productNo": data.productNo,
                    "colorNo": "00",
                    "colorName": "默认",
                    "sizeNo": skuData.sizeNo,
                    "sizeCode": skuData.sizeCode,
                    "sizeEur": skuData.sizeEur,
                    "productName": data.productName,
                    "picPath": data.picList[0] || "",
                    "brandDetailNo": "NK01",
                    "proNo": null,
                    "proName": null,
                    "assignProNo": "0",
                    "skuId": skuData.id,
                    "skuNo": skuData.skuNo,
                    "shopCommodityId": data.id,
                    "salePrice": data.salePrice,
                    "tagPrice": data.tagPrice,
                    "num": 1,
                    "status": 3,
                    "itemFlag": 0,
                    "usedTicket": null,
                    "activityType": 0,
                    "activityTypeStr": null,
                    "usedTickets": null,
                    "liveType": 0,
                    "roomId": null,
                    "roomName": "",
                    "zoneQsLevel": data.zoneQsLevel
                  }],
                  "ticketCodes": null,
                  "vipPrefAmount": "0.00",
                  "prefAmount": "0.00",
                  "ticketDtos": [],
                  "unTicketDtos": [],
                  "orderTickets": null,
                  "ticketPresentDtos": null,
                  "expressAmount": "0.00",
                  "expressAmountStr": "包邮",
                  "cashOnDelivery": 0,
                  "salePriceAmount": data.salePrice + '',
                  "promotionAmount": "0.00"
                }]
                if (!!geetestArr[index].challenge) {
                  if (tempSkuDataSec.length > 0) {
                    tempSkuDataSec[tempIndex].stock--
                    if (tempSkuDataSec[tempIndex].stock === 0) {
                      tempSkuDataSec.splice(tempIndex, 1);
                    }
                  }
                  clearInterval(this.timer);
                  this.enableWorker ? 
                  this.createOrderWorker(data.id, subOrderList, item.token, geetestArr[index].challenge, geetestArr[index].validate, index)
                  :
                  this.creatOrder(data.id, subOrderList, item.token, geetestArr[index].challenge, geetestArr[index].validate, index)
                }
                if(!this.enableWorker)console.log('-------------------------确认订单ing-------------------------------' + new Date().toLocaleString());
            })
          } else {
            console.log('暂无库存');
            setTimeout(() => {
              this.getProductList()
            }, 150)
          }
        } else if (res.data.data.status == 2) {
          console.log('暂未上架');
          setTimeout(() => {
            this.getProductInfo(id, shopName, productName)
          }, 0)
        } else {
          console.log('已售罄或暂无匹配尺码');
          this.getProductList()
        }
      })
        // .catch(error => {
        //   console.log('refresh getProductInfo');
        //   this.getProductInfo(id, shopName, productName, 1)
        // })
    },
    sendEmail(content) {
      let transporter = nodemailer.createTransport({
        service: "163",  //  邮箱
        secure: true,  //  安全的发送模式
        auth: {
          user: "z382414867@163.com", //  发件人邮箱
          pass: "VGDBEZLGAIXLTNMW"//  授权码
        }
      })
      let mailOptions = {
        from:"z382414867@163.com",
        to:'609041063@qq.com',
        subject: "秒杀成功,15分钟之内请支付",
        text: content || '测试'
      }
      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          console.log(err);
          res.json({ status: 400, msg: "send fail....." })
        } else {
          res.json({ status: 200, msg: "邮件发送成功....." })
        }
      })
    },
    createOrderWorker(id, subOrderList,  token,  challenge,  validate, index){
      if (isMainThread) {
          threads.add(new Worker(__filename,{
              workerData:{ id, subOrderList,  token,  challenge,  validate, index }
          }))

          for (let worker of threads) {
            worker.on('error', (err) => { throw err })
        
            worker.on('online',()=>{
                console.log(`===========线程${worker.threadId}正在执行=======\n-------------------------确认订单ing-------------------------------'${new Date().toLocaleString()}`);
            })
          }

      }else{
        const data = this.creatOrder(workerData.id,workerData.subOrderList,workerData.token,workerData.challenge,workerData.validate,workerData.index);
        parentPort.postMessage(data)
      }
    },
    creatOrder(shippingId, subOrderList, token, challenge, validate,index) {
      subOrderList[0].commodityList[0].shoppingcartId = userInfoArr[index].cartId
      let data = {
        "merchantNo": "TS",
        "rid": '',
        "shippingId": userInfoArr[index].addressId,
        "subOrderList": subOrderList,
        "purchaseType": 2,
        "usedPlatformCouponList": [],
        "verificationType": 2,
        "validate": validate,
        "seccode": `${validate}|jordan`,
        "challenge": challenge
      }
      axios({
        url: `https://wxmall-lv.topsports.com.cn/order/create?tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/order/create`)}`,
        method: 'post',
        data: data,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          'User-Agent': ' Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.18(0x17001227) NetType/WIFI Language/zh_CN'
        }
      }).then(res => {
        if (res.data.bizCode == 20000) {
          Object.assign(this.$data, this.$options.data())
          let successMsg = `---确认订单成功---收件人:${userInfoArr[index].name},商品名称:${subOrderList[0].commodityList[0].productName},尺码:${subOrderList[0].commodityList[0].sizeEur}`
          console.log("\033[33m" + successMsg +  "\033[0m")
          this.sendEmail(`商品已下单,请尽快付款,${userInfoArr[index].name}:${subOrderList[0].commodityList[0].productName}:${subOrderList[0].commodityList[0].sizeEur}`)
        } else {
          let failMsg = `抢购尺码:${subOrderList[0].commodityList[0].sizeEur}失败:${res.data.bizMsg}`
          console.log("\033[31m" + failMsg +  "\033[0m")
        }
      })
    },
  },
  mounted() {
    this.addGeetestArrGetProductList('getProductList')                     //跑监控(所有店铺)
    // this.addGeetestArrGetProductList('getProductInfo','bbc8c4d09de74532b88945df588a3fa7')  //私密链接监控
    // this.addGeetestArrGetProductList('getFixedProductList','NKSG73','CT0979-107')      //xx店铺马上发xx了
  }
})
/* 

*/