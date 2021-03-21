const Vue = require('vue');
const axios = require('axios');
const fs = require('fs');
const nodemailer = require('nodemailer')
var tssign = require('./topTssign.js');
const userInfoArr = [  
  {token:'Bearer 00fa951f-128c-47e3-83f1-31f86e6aab68',
  name: 'LA',    
  cartId:'41a370ff6a184d7c839e8d3c4b619a1c',
  addressId:'8a7a8ce06f42f001016f590b05fd0863'},

  {token:'Bearer 40824e96-0697-4118-8f67-688018e325ad',
  name: 'U',    
  cartId:'6aa8fde894434b97a3f688e3cb028a69',
  addressId:'8a7a099874d3cbdc0175317d6f357b37'},

    {token:'Bearer 7cac429a-342c-411b-b2b1-1b3a145efbec',
    name:'xinayu',    
    cartId:'b16d340096874626bfd1f4ce8d18c5ac',
    addressId:'8a7a08b57647010201764b60b8466e67'},
      




  
]
let geetestArr = []
const productCodeLatestArr = [
  'GY7658',//350
   'DC5255-043',
   'GY7924',//700v2
  'BQ6472-500',//粉mid
  'DC0481-100',//小sacai
  'DA7995-100',//小sacai
  'CT0979-101',//复活节cmf
  // 'CW1140-100',//彩色拼接
  // 'DJ4695-122',//黑红midgs
  'DC0774-601',//粉底low
  'DD1869-100',//男雪城
  'DD1399-101',//w雪城
  'DB2179-100',//GS雪城
  // '554724-122',//黑红mid
  'DH9888-600',//kobe全明星
  'DD1399-101',//全明星dunk gs
  '555088-134',//大学蓝1
  'CT1137-900',//CNCPTS
  '554725-132',//薄荷绿gs
  // '554724-132',//薄荷绿mid
  // '510815-101',//樱花12
  'DH4270-800',//浓橘色mid
  'DH0210-100',//黑粉白
  'DD9682-100',//TC7900
  'DD3384-600',//情人节af1
  'CW5379-600',//数码樱花粉
  'DD1398-300',//全明星dunk
  'CZ5624-100',//大巴黎4
  'CD0461-601',//蛇纹
  'DC9533-001',//union4
  'DB4612-300',//喜力
  'DB3610-105',//PSG CMFT
  'DJ4342-400',//鸳鸯low
  '442960-100',//AJ7GS
  'BQ6931-802',//二次元橙GS
  'DD6834-402',//二次元蓝
  // 'DD6834-802',//二次元橙
  'BQ6931-402',//二次元蓝GS
  // 'BQ4422-100',//白85
  'DC9857-200',//clot14
  'DD3384-600',//情人节af1
  'DD1391-001',//皇家蓝dunk
  'CD0461-001',//液态银
  'DB0732-200',//AJ4 TS
  'Dd2233-001',//寿鞋
  'DD2192-001',//全明星mid gs
  'CW1590-001',//皇家蓝dunk low
  'DD1869-101',//红dunkhigh
  'DD1503-102',//白粉dunk
  '555088-105',//摩卡男
  '575441-105',//摩卡女
  'DC1788-100',//午夜男
  '575441-141',//午夜女
  'BQ6817-009',//大象dunk
    'DD1666-100',//mid冰淇淋
    'CW7104-601',//aj1 冰激凌gs
    'DD2224-200',//淡橘色
    'CZ4385-016',//酒红mi1d
    '555112-103',//粉熊猫
    'DD1527-114',//裸眼3dLOW
    'BQ6472-800',//奶茶mid
    'BQ6472-202',//红豆mid
    '554724-073',//黑白灰
    'BQ6931-114',//裸眼3DMID
    'CT0979-602',//zoom拼接
    'CT0979-601',//zoom樱花
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
    'GZ6984',
    'DD1649-001',//全明星mid
    'CW0898-400',//AJ4
    'CW1574-100',//双钩af1
  //    '554724-075',
] //需要监听的产品CODE2

// const productCodeLatestArr = ['CU4962-010'] //需要监听的产品CODE
new Vue({
  el: '#app',
  data: function () {
    return {
      timer: null, //定时器名称
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
        url: `https://wxmall.topsports.com.cn/search/shopCommodity/list?shopNo=&sortColumn=upShelfTime&filterIds=&current=1&pageSize=2&tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/search/shopCommodity/list`)}`,
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
          },33)
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
            url: `https://wxmall.topsports.com.cn/order/confirmationOrder?tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/order/confirmationOrder`)}`,
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
        url: `http://api.faka168.com/api/gateway.jsonp?wtype=geetest&secretkey=cce3db215335453ab30ecf6c5c8e59b5&gt=${gt}&referer=https://servicewechat.com/wx71a6af1f91734f18/30/page-frame.html&challenge=${challenge}`,
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
            url: `https://wxmall.topsports.com.cn/order/confirmationOrder?tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/order/confirmationOrder`)}`,
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
        url: `https://wxmall.topsports.com.cn/search/shopCommodity/list?searchKeyword=${productCode}&current=1&pageSize=20&sortColumn=upShelfTime&sortType=asc&filterIds=&shopNo=${storeNo}&tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/search/shopCommodity/list`)}`,
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
      console.log(id);
      console.log(`这家傻逼店-----→${shopName || '固定监听店铺'}偷摸发售${productName || '固定监听商品'}了-------------------------------${new Date().toLocaleString()}`);
      console.log('-------------------------去商品详情ing-------------------------------' + new Date().toLocaleString());
      axios({
        url: `https://wxmall.topsports.com.cn/shopCommodity/queryShopCommodityDetail/${id}?tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/shopCommodity/queryShopCommodityDetail/${id}`)}`,
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
          } else if (res.data.data.productCode == 'CT0979-107' || res.data.data.productCode == 'CT0979-602'  || res.data.data.productCode =='CW2919-100') {
            fixSizeArr = [5, 5.5, 6, 6.5,7,9.5, 10, 10.5, 11]
          } else if (res.data.data.productCode == 'DD1649-001' || res.data.data.productCode == 'DD6834-402' || res.data.data.productCode == 'CW6576-100'){
            fixSizeArr = [7,7.5,8,8.5]
          } else if (res.data.data.productCode == '554724-132' || res.data.data.productCode == '554725-135')  {
            fixSizeArr = [7,7.5,8,8.5,9,'3.5Y','4Y','4.5Y','5Y']
          } else if (res.data.data.productCode == 'CW2919-100'|| res.data.data.productCode ==   'GW0089' || res.data.data.productCode ==   'GY7658' )  {
            fixSizeArr = [4,4.5,5,5.5,6,6.5]
          } else if (res.data.data.productCode == 'BQ6472-202' ||res.data.data.productCode == 'BQ6931-114'||res.data.data.productCode =='442960-100' ) {
            fixSizeArr = [5,5.5,6,6.5,'3.5Y','4Y','4.5Y','5Y']
          } else if (res.data.data.productCode == 'CW2190-300' ||res.data.data.productCode == 'CW0898-400') {
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
                  clearInterval(this.timer)
                  this.creatOrder(data.id, subOrderList, item.token, geetestArr[index].challenge, geetestArr[index].validate, index)
                }
                console.log('-------------------------确认订单ing-------------------------------' + new Date().toLocaleString());
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
          user: "mei690188686@163.com", //  发件人邮箱
          pass: "ZKIWENORDBZYEMLM"//  授权码
        }
      })
      let mailOptions = {
        from:"mei690188686@163.com",
        to:'690188686@qq.com',
        subject: "秒杀成功,冲冲冲冲冲！！！！",
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
        url: `https://wxmall.topsports.com.cn/order/create?tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/order/create`)}`,
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