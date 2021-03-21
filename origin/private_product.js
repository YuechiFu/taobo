const Vue = require('vue');
const axios = require('axios');
const nodemailer = require('nodemailer')
var tssign = require('./topTssign.js');
const userInfoArr = [
  // {token:'Bearer 646013d0-642e-4e18-8c34-ade01870c4f1',name:'GITR',    cartId:'952b79ae5d064694aef4bd7cfc8957f7',addressId:'8a7a08b678122f41017820ad9b844ca7'},
  
  // {token:'Bearer c4f54753-3a6b-41b9-a451-60549d4494ec',name:'CY',    cartId:'045814b5360d41ad99b43399e66174a0',addressId:'8a7a08b678122f41017820ad9b844ca7'}, 
  // {token:'Bearer 6aaf3765-67bb-4454-8cd1-f32ee2b58640',name:'VITO',    cartId:'50d507ecbdde42679f83a8251816ea50',addressId:'8a7a08b678122f41017820ad9b844ca7'},
  // {token:'Bearer a3662175-edec-40f7-ad29-8d3c5a732cf7',name:'JJ',    cartId:'cd6860c79caa427c8d29010bde487fd5',addressId:'8a7a08b57597cc05017597d2bd57011f'},
  // // 
 /*  {token:'Bearer 92077e27-8f78-4f06-83a5-74去ddf5c82986',name:'huangxi',    cartId:'01a94f6b69db4de897c0158ac9cb4244',addressId:'8a7a08b57597cc05017597d2bd57011f'},
  {token:'Bearer fa2c89c0-c1cb-4595-823c-a723cdaf452a4',name:'Y',    cartId:'8f10aba142ae40b1893d33c19e91b216',addressId:'8a7a08b57597cc05017597d2bd57011f'},
  {token:'Bearer 9c15c8a8-1a3c-4f55-8fc6-603a80d647770',name:'J',    cartId:'3929eccc05e648bbae7207453309661f',addressId:'8a7a08b57597cc05017597d2bd57011f'},
    */ 

  {
    token:'Bearer 2ae2051f-6a39-40bb-9862-acb82a4ff331',
    name:'hcw',    
    cartId:'1f28b86e11e84131b2f3ca680acc4e99',
    addressId:'b98cd66ab8e540fda5098a6fc45d8d8e'
}

    
    

]

let geetestArr = []
//  时效待测试
// const productCodeLatestArr = ['CU2016-002']
const productCodeLatestArr = [
  '554724-075',//aj11 adapt
  'DD3522-100',//aj11 adapt
  // 'CW2190-300',//科6
  '555088-105',//摩卡男
  '575441-105',//摩卡女
  '555112-103',//粉熊猫
  'BQ6472-800',//奶茶mid
  'BQ6472-202',//红豆mid
  '554724-073',//黑白灰

  'CT0979-602',//zoom拼接
  'CT0979-107',//zoom绿茶
  'CT0979-100',//zoom奶茶
  'CT0979-601',//zoom樱花
  'DD2224-200',//zoom粉橘

  'DD1503-100',   //dunk北卡蓝
  'DD1869-102',   //dunk high紫
  'DD1503-101',   //dunk熊猫 699
  'BQ6817-500',   //dunk黑紫
  'CW1590-002',   //dunk灰红
  'DD1391-102',   //dunk灰红
  'DD1399-100',   //dunk灰白
  'DB2179-101',   //dunk灰白
  'DD1391-100',   //dunk熊猫 599
  'CW1590-100',   //dunk熊猫 799
  'BQ6931-114',   //3d
  'CW7104-601',   //ice
  'DD2192-001',   //panda mid
  ] //需要监听的产品CODE

new Vue({
  el: '#app',
  data: function () {
    return {
    }
  },
  methods: {
    addGeetestArrGetProductList(func, value1 = '', value2 = '') {
      this.fixedAddGeetestArr()
      this.timer = setInterval(() => {
        this.fixedAddGeetestArr()
      }, 540000)
      this[func](value1, value2)
    },
    fixedAddGeetestArr() {
      geetestArr = []
      userInfoArr.forEach((item, index) => {
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
            this.getGeetestArr(res.data.data.verificMap.gt, res.data.data.verificMap.challenge, item)
          } else {
            console.log(res.data.bizMsg || 'token失效,请更换token')
          }
        })
      })
      // 
    },
    getGeetestArr(gt, challenge, item) {
      axios({
      method: 'get',
      url: `http://api.ddocr.com/api/gateway.jsonp?wtype=geetest&secretkey=69a60c135da64d94839ef5fb3a323ec4&gt=${gt}&referer=https://servicewechat.com/wx71a6af1f91734f18/30/page-frame.html&challenge=${challenge}`,
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
      this.getGeetestArr(res.data.data.verificMap.gt, res.data.data.verificMap.challenge, item)
      } else {
      console.log(res.data.bizMsg || 'token失效,请更换token')
      }
      })
      console.log(res1.data);
      }
      })
      },
    getProductList(){
      let number = 0
      axios({
        url: `https://wxmall.topsports.com.cn/search/shopCommodity/list?shopNo=&sortColumn=upShelfTime&filterIds=&current=1&pageSize=3&tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/search/shopCommodity/list`)}`,
        method: 'get',
        timeout: 3000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':' Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.15(0x17000f31) NetType/WIFI Language/zh_CN'
        }
      }).then(res => {
        res.data.data.spu.list.map(spuItem =>{
          productCodeLatestArr.map(productItem =>{
            if(spuItem.productCode == productItem){
              this.getProductInfo(spuItem.id,spuItem.shopName,spuItem.productName)
              number++
            }
          })
        })
        number == 0 && setTimeout(()=>{
          this.getProductList()
          console.log(`${new Date().toLocaleString()}刷新`);
        },100)
      }).catch(error=>{
         console.log('refresh');
         this.getProductList()
      })
    },
    // 固定店铺固定产品
    getFixedProductList(storeNo,productCode){
      axios({
        url: `https://wxmall.topsports.com.cn/search/shopCommodity/list?searchKeyword=${productCode}&current=1&pageSize=20&sortColumn=upShelfTime&sortType=asc&filterIds=&shopNo=${storeNo}&tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/search/shopCommodity/list`)}`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':' Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.15(0x17000f31) NetType/WIFI Language/zh_CN'
        }
      }).then(res => {
        if(res.data.data.spu.list.length > 0 && res.data.data.spu.list[0].productCode == productCode){
          this.getProductInfo(res.data.data.spu.list[0].id,res.data.data.spu.list[0].shopName,res.data.data.spu.list[0].productName)
        } else {
          this.getFixedProductList(storeNo,productCode)
          console.log(`${new Date().toLocaleString()}刷新`);
        }
      })
    },
    sendEmail(content){
      let transporter = nodemailer.createTransport({
        service:"163",  //  邮箱
        secure:true,    //  安全的发送模式
        auth:{
          user: "z382414867@163.com", //  发件人邮箱
          pass: "VGDBEZLGAIXLTNMW"//  授权码
        }
      })
      let mailOptions = {
        from:"z382414867@163.com",
        to:'609041063@qq.com',
        subject: "秒杀成功冲冲冲",
        text: content || '测试'
      }
      transporter.sendMail(mailOptions,(err,data) => {
        if(err){
            console.log(err);
            res.json({status:400,msg:"send fail....."})
        }else{
            res.json({status:200,msg:"邮件发送成功....."})
        }
      })
    },
    getProductInfo(id,shopName,productName,limit = 1){
      console.log(`这家傻逼店-----→${shopName || '指定的店'}偷摸发售${productName || '蹲的东西'}了-------------------------------${new Date().toLocaleString()}`);
      console.log('-------------------------去商品详情ing-------------------------------' + new Date().toLocaleString());
      axios({
        url: `https://wxmall.topsports.com.cn/shopCommodity/queryShopCommodityDetail/${id}?tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/shopCommodity/queryShopCommodityDetail/${id}`)}`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':' Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.15(0x17000f31) NetType/WIFI Language/zh_CN'
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
          } else if (res.data.data.productCode == 'DD2224-200' )  {
            fixSizeArr = [ 5.5, 6, 6.5]
          } else if (res.data.data.productCode == '554724-075') {
            fixSizeArr = [7,7.5]
          } else if (res.data.data.productCode == 'BQ6472-202' ) {
            fixSizeArr = [5, 5.5, 6, 6.5, 7, 9]
          } else if (res.data.data.productCode == 'CW2190-300') {
            fixSizeArr = [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12]
          } else {
            // fixSizeArr = [5,5.5,6,6.5,7,7.5]  //男女款
            fixSizeArr = ['5Y','6Y','6.5Y','7Y'] //跑所有商品
            fixSizeArr = [7,8,8.5]  //男
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
                  //⬇是data.id
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
        } else if (res.data.data.status == 2||res.data.data.status  == 4) {
          console.log('暂未上架');
          setTimeout(() => {
            this.getProductInfo(id, shopName, productName)
          }, 60)
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
    getValidate(){
      TokenArr.forEach((item,index)=>{
        axios({
          url: `https://wxmall.topsports.com.cn/members/memberCenterQuery?tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/members/memberCenterQuery`)}`,
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': item,
            'User-Agent':' Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.15(0x17000f31) NetType/WIFI Language/zh_CN'
          }
        }).then(res => {
          if(res.data.bizCode == 20000){
            console.log(`TokenArr中第${index+1}个Token验证成功`);
          } else {
            console.log(`TokenArr中第${index+1}个Token失效,请更换token`)
          }
        })
      })
    },
    // confirmationOrder(dataObj,token,rid,index) {
    //   let data = {
    //     "merchantNo": "TS",
    //     "shippingId": "",
    //     "subOrderList": [JSON.parse(dataObj)],
    //     "purchaseType": 2
    //   }
    //   axios({
    //     url: `https://wxmall.topsports.com.cn/order/confirmationOrder?tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/order/confirmationOrder`)}`,
    //     method: 'post',
    //     data: data,
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': token,
    //       'User-Agent':' Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.15(0x17000f31) NetType/WIFI Language/zh_CN'
    //     }
    //   }).then(res => {
    //     if(res.data.bizCode == 20000){
    //       this.creatOrder(res.data.data.shippingId,res.data.data.subOrderList,token,rid,res.data.data.consigneeName,index)
    //     } else {
    //       console.log(res.data.bizMsg || 'token失效,请更换token')
    //     }
    //   })
    // },
    //  
    creatOrder(shippingId, subOrderList, token, challenge, validate,index) {
      subOrderList[0].commodityList[0].shoppingcartId = userInfoArr[index].cartId
      let data = {
        "merchantNo": "TS",
        "rid": '',
        "shippingId":userInfoArr[index].addressId,//* userInfoArr[index].addressId
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
          console.log(successMsg)
          this.sendEmail(`商品已下单,请尽快付款,${userInfoArr[index].name}:${subOrderList[0].commodityList[0].productName}:${subOrderList[0].commodityList[0].sizeEur}`)
        } else {
          let failMsg = `抢购尺码:${subOrderList[0].commodityList[0].sizeEur}失败:${res.data.bizMsg}`
          console.log(failMsg)
        }
      })
    },
  },
  mounted() {
    // this.addGeetestArrGetProductList('getProductList')                     //跑监控(所有店铺)
    this.addGeetestArrGetProductList('getProductInfo','3fcddaabc0344795b3ce190e9909401c')  //私密链接监控
    // this.addGeetestArrGetProductList('getFixedProductList','NKXM45','CZ1786-001')      //xx店铺马上发xx了

  }
})
// '555088-105',//摩卡男
//   '575441-105',//摩卡女
// 天津南门外 NKTJ83
// 重庆环城 NKCQ08
// 厦门99  NKXM45
// 长沙188 NKCA77
// 成都ifs NKCD94
// 福州泰禾jd NKFZ52
// 成都万象城jd NKND11
// 广州西湖路nba  BBGZ01
// 重庆北城天街nkjordan  NKCQ46
// 重庆北城天街nk  NKCQ67
// 重庆沙贝 NKCQ54
// 重庆万象城 NKCQ78
// 西安lcg   NKXA81

// 天津南门外 NKTJ831

// 重庆环球 NKCQ08
// 重庆万象城 NKCQ46
// 重庆沙坝 NKCQ54
// 厦门99  NKXM45
// 重庆北城天街nk  NKCQ67
// 重庆北城JD NKCQ46

// 长沙188 NKCA771
// 长沙九龙仓 NKCA63
// 成都ifs NKCD941
// 福州泰禾jd NKFZ52
// 成都万象城jd NKND11
// 广州西湖路nba  BBGZ01
// 沈阳中街NK NKSY58