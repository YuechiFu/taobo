const Vue = require('vue');
const axios = require('axios');
const nodemailer = require('nodemailer')
var tssign = require('./topTssign.js');
const userInfoArr =  [

  // {token:'Bearer c6798893-48dd-4324-b9b6-472fd49b86d8',name:'GIFT',    cartId:'fca27bcaaf05463087ba1cb09ab4056c'},
  // {token:'Bearer cece1201-9d00-4956-80c0-e0a92da364fc',name:'CY',    cartId:'e23758982d8649e1bf1c932727c73af0'},
  // {token:'Bearer 229de6a0-5435-47f7-a756-fa2f1badc048',name:'VITO',    cartId:'995cbf642e9247d3902b5a66f03d7d60'},
  {token:'Bearer 18ef7837-a65c-4138-8fae-b05ab2dc677f',name:'Y',    cartId:'67cfa9abf4644aba8699220e24d8a9ee'},
  // {token:'Bearer b4e37d1a-2b97-4d73-84d6-d16abce9f0e6',name:'J',    cartId:'56346d8ee6294f949c08652f9eec58c3'},
  // {token:'Bearer c2e6339f-da8c-42ed-bd7a-7fd93ecd51ac',name:'HUANGXIN',    cartId:'8aa58bd9a7f8464eb006eb27f0ffe604'},




]

let geetestArr = [
  {
    challenge: '27bec1bdbe89cf4983fc02362e03ea87',
    validate: 'a5079f9a262dae958b4b3abce89deaed'
  }
]
//  时效待测试
// const productCodeLatestArr = ['CU2016-002']
const productCodeLatestArr = [
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
      // geetestArr = []
      userInfoArr.forEach((item, index) => {
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
        url: `https://wxmall-lv.topsports.com.cn/search/shopCommodity/list?shopNo=&sortColumn=upShelfTime&filterIds=&current=1&pageSize=3&tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/search/shopCommodity/list`)}`,
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
        },0)
      }).catch(error=>{
         console.log('refresh');
         this.getProductList()
      })
    },
    // 固定店铺固定产品
    getFixedProductList(storeNo,productCode){
      axios({
        url: `https://wxmall-lv.topsports.com.cn/search/shopCommodity/list?searchKeyword=${productCode}&current=1&pageSize=20&sortColumn=upShelfTime&sortType=asc&filterIds=&shopNo=${storeNo}&tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/search/shopCommodity/list`)}`,
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
        service:"163",  //  
        secure:true,    //  
        auth:{
            user:"z382414867@163.com", //  \
            pass:"VGDBEZLGAIXLTNMW"//  
        }
      })
      let mailOptions = {
        from:"z382414867@163.com",
        to:'382414867@qq.com',
        subject:"秒杀成功",
        text:content || '测试'
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
        url: `https://wxmall-lv.topsports.com.cn/shopCommodity/queryShopCommodityDetail/${id}?tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/shopCommodity/queryShopCommodityDetail/${id}`)}`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':' Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.15(0x17000f31) NetType/WIFI Language/zh_CN'
        }
      }).then(res => {
        console.table(res.data.data.skuList);
        if(res.data.data.status == 3){
          let data = res.data.data
          let tempSkuData = []
          let fixSizeArr
          // fixSizeArr = [3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11]   //男女款
          //3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11
          // fixSizeArr = [5.5,6,6.5]
          // fixSizeArr = ['3.5Y','4Y','4.5Y']  //针对GS大童
          // fixSizeArr = [8] //成人
          // fixSizeArr = ['3.5Y','4Y','4.5Y','5Y','5.5Y',5,5.5,6,6.5,7,7.5,8,8.5] //跑所有商品
          if(!!fixSizeArr && fixSizeArr.length > 0){
            fixSizeArr.forEach(item=>{
              data.skuList.forEach(dataItem =>{
                if(dataItem.sizeCode == item  && dataItem.stock / 1 > 0){
                  tempSkuData.push(dataItem)
                }
              })
            })
          } else { 
            data.skuList.forEach(item =>{
              item.stock / 1 > 0 && tempSkuData.push(item)
            })
          }
          if(tempSkuData.length > 0){
            userInfoArr.forEach((item,index)=>{
              for(let i = 0 ; i < limit ; i ++){
                let skuData = {}
                if(!!fixSizeArr && fixSizeArr.length > 0){
                  skuData = tempSkuData[parseInt(Math.random()*tempSkuData.length)]
                  } else {
                  //  skuData = tempSkuData[parseInt(Math.random()*tempSkuData.length / 2)] //尺码前一半随机
                   skuData = tempSkuData[parseInt(Math.random()*tempSkuData.length)] //全部尺码随机
                  //  skuData = tempSkuData[0]   //第一个有库存的尺码
                 }
                let tempDataObj = {
                  "shopNo": data.shopNo,
                  "expressType": 2,
                  "commodityList": [{
                    "productCode": data.productCode,
                    "sizeNo": skuData.sizeNo,
                    "skuNo": skuData.skuNo,
                    "sizeCode": skuData.sizeCode,
                    "num": 1,
                    "shoppingcartId": "",
                    "itemFlag": 0,
                    "assignProNo": "0",
                    "roomId": "",
                    "roomName": "",
                    "liveType": 0,
                    "shopCommodityId": data.id
                  }]
                }
                this.confirmationOrder(JSON.stringify(tempDataObj),item.token,geetestArr[index],index)
                // this.addCart(data,skuData,item,index,tempDataObj)
                console.log('-------------------------确认订单ing-------------------------------' + new Date().toLocaleString());
              }
            })
          } else {
            console.log('暂无库存');
            setTimeout(()=>{
              this.getProductInfo(id,1)
            },500)
          }
        } else if (res.data.data.status == 2){
          console.log('暂未上架');
          setTimeout(()=>{
            this.getProductInfo(id,1)
          },0)
        } else {
          this.getProductList()
        }
      })
    },
    getValidate(){
      TokenArr.forEach((item,index)=>{
        axios({
          url: `https://wxmall-lv.topsports.com.cn/members/memberCenterQuery?tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/members/memberCenterQuery`)}`,
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
    confirmationOrder(dataObj,token,rid,index) {
      let data = {
        "merchantNo": "TS",
        "shippingId": "",
        "subOrderList": [JSON.parse(dataObj)],
        "purchaseType": 2
      }
      axios({
        url: `https://wxmall-lv.topsports.com.cn/order/confirmationOrder?tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/order/confirmationOrder`)}`,
        method: 'post',
        data: data,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          'User-Agent':' Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.15(0x17000f31) NetType/WIFI Language/zh_CN'
        }
      }).then(res => {
        if(res.data.bizCode == 20000){
          this.creatOrder(res.data.data.shippingId,res.data.data.subOrderList,token,rid,res.data.data.consigneeName,index)
        } else {
          console.log(res.data.bizMsg || 'token失效,请更换token')
        }
      })
    },
    //  
    creatOrder(shippingId,subOrderList,token,rid,consigneeName ,index) {
      subOrderList[0].commodityList[0].shoppingcartId = userInfoArr[index].cartId
      let data = {
        "merchantNo": "TS",
        "rid": '',
        "shippingId": shippingId,
        "subOrderList": subOrderList,
        "purchaseType": 2,
        "usedPlatformCouponList": [],
        "verificationType": 2,
        "validate": rid.validate,
        "seccode": `${rid.validate}|jordan`,
        "challenge": rid.challenge
      }
      axios({
        url: `https://wxmall-lv.topsports.com.cn/order/create?tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/order/create`)}`,
        method: 'post',
        data: data,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          'User-Agent':' Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.15(0x17000f31) NetType/WIFI Language/zh_CN'
        }
      }).then(res => {
        if(res.data.bizCode == 20000){
          Object.assign(this.$data,this.$options.data())
          console.log(`---确认订单成功---收件人:${consigneeName},商品名称:${subOrderList[0].commodityList[0].productName},尺码:${subOrderList[0].commodityList[0].sizeCode}`);
          this.sendEmail(`商品已下单,请尽快付款,${consigneeName}:${subOrderList[0].commodityList[0].productName}:${subOrderList[0].commodityList[0].sizeCode}`)
        } else {
          console.log(`抢购尺码:${subOrderList[0].commodityList[0].sizeEur}失败:${res.data.bizMsg}`);
        }
      })
    },
  },
  mounted() {
    this.addGeetestArrGetProductList('getProductList')                     //跑监控(所有店铺)
    // this.addGeetestArrGetProductList('getProductInfo','3555cba65f544f81bc61e6c62cd5acf6')  //私密链接监控
    // this.addGeetestArrGetProductList('getFixedProductList','NKXM45','CZ1786-001')      //xx店铺马上发xx了
    // this.getValidate()    //校验token
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