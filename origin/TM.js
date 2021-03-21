const Vue = require('vue');
const axios = require('axios');
var tssign = require('./topTssign.js');
const userInfoArr = [ 
   {token:'Bearer 92362747-0f5b-4ef8-907a-7f31ae6188c7',name: 'LA',    cartId:'3d7a847c3efc4ea3ac55cd7d4c73d0f9',addressId:'8a7a8ce06f42f001016f590b05fd0863'},
{token:'Bearer 6e3439a4-bb81-404a-871e-df23ccdf9164',name: 'U',    cartId:'2a7aecb8e740413dadda1e5494a6d503',addressId:'8a7a099874d3cbdc0175317d6f357b37'},
  {token:'Bearer 586e264e-6fcc-4c1e-ba60-6668f2ae4bc1',name:'xinayu',    cartId:'94992a3824714eb3b18c31bf7cf39376',addressId:'8a7a08b57647010201764b60b8466e67'},
  
  
  
]
let cartArr = []
new Vue({
  el: '#app',
  data: function () {
    return {
      timer: null, //定时器名称
    }
  },
  methods: {
    getValidate() {
      userInfoArr.forEach((item, index) => {
        axios({
          url: `https://wxmall.topsports.com.cn/members/memberCenterQuery?tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/members/memberCenterQuery`)}`,
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': item.token,
            'User-Agent': ' Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.15(0x17000f31) NetType/WIFI Language/zh_CN'
          }
        }).then(res => {
          if (res.data.bizCode == 20000) {
            console.log(`${userInfoArr[index].name}的Token验证成功`);
          } else {
            console.log(`${userInfoArr[index].name}的Token失效,请更换token`)
          }
        })
      })
    },
    getCart(){
      userInfoArr.forEach((item, index) => {
        axios({
          url: `https://wxmall.topsports.com.cn/shoppingcart/index?tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/shoppingcart/index`)}`,
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': item.token,
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.15(0x17000f31) NetType/WIFI Language/zh_CN'
          }
        }).then(resCart => {
          if (resCart.data.bizCode == 20000) {
            cartArr[index] = resCart.data.data.willBuyList[0].buyCommodityVOList[0].shoppingcartId
            cartArr.forEach(item1=>{
              if(!!item1 && cartArr.length == userInfoArr.length) {
                console.log(cartArr);
              }
            })            
          } else {
            console.log(resCart.data);
            
          }
        })
        // .catch(error => {
        //   this.getCart(item,index)
        // })
      })
    },
    getProductInfo(id, shopName, productName) {
      console.log(`这家傻逼店-----→${shopName || '固定监听店铺'}偷摸发售${productName || '固定监听商品'}了-------------------------------${new Date().toLocaleString()}`);
      console.log('-------------------------去商品详情ing-------------------------------' + new Date().toLocaleString());
      axios({
        url: `https://wxmall.topsports.com.cn/shopCommodity/queryShopCommodityDetail/${id}?tssign=${tssign.AES_Encrypt(`tsmall#${new Date().getTime()}#/shopCommodity/queryShopCommodityDetail/${id}`)}`,
        method: 'get',
        timeout: 3000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat'
        }
      }).then(res => {
        console.table(res.data.data.skuList);
      })
    },
  },
  mounted() {
    this.getValidate()                                                           //校验Tokens
    this.getCart()                                                            //获取购物车ID
    // this.getProductInfo('180f03b4fa9344129c38db1228ea1318')
  }
})
