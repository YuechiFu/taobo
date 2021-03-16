const axios = require("axios");
const nodemailer = require('nodemailer');
var tssign = require("../origin/topTssign");
module.exports = {
  baseStorePath: "https://wxmall-lv.topsports.com.cn",
  demoConfirmData: JSON.stringify({
    merchantNo: "TS",
    shippingId: "",
    subOrderList: [
      {
        shopNo: "NKCC42",
        expressType: 2,
        commodityList: [
          {
            productCode: "DC0589-601",
            sizeNo: "20160426000036",
            skuNo: "20201103001512",
            sizeCode: "4",
            num: 1,
            shoppingcartId: "",
            itemFlag: 0,
            assignProNo: "0",
            roomId: "",
            roomName: "",
            liveType: 0,
            shopCommodityId: "f74c014ce0974df09b7eacae64873ec7",
          },
        ],
      },
    ],
    purchaseType: 1,
  }),
  

  /**
   * 生成请求的header
   * @params token string 账号token
   */
  requestHeader(token){
    let obj = {
      "Content-Type": "application/json",
      "User-Agent":  "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.18(0x17001227) NetType/WIFI Language/zh_CN",
    }
    if(token) obj["Authorization"] = token;
    return obj ;
  },
  

  /**
   * 根据日期生成TSSIGN 
   */
  getTsign(path) {
    return tssign.AES_Encrypt(`tsmall#${new Date().getTime()+path}`);
  },

  /**
   * 校验当前账号TOKEN 是否过期
   * @params token string 账号token
   */
  _validateExpire(token) {
    let self = this;
    return axios({
      url: `${
        self.baseStorePath
      }/order/confirmationOrder?tssign=${self.getTsign('#/order/confirmationOrder')}`,
      method: "post",
      data:self.demoConfirmData,
      headers: self.requestHeader(token),
    });
  },

  /**
   * 获取商品列表
   * @params token string 账号token
   */
  _getProductList() {
    let self = this;
    return axios({
      url: `${
        self.baseStorePath
      }/search/shopCommodity/list?shopNo=&sortColumn=upShelfTime&filterIds=&current=1&pageSize=3&tssign=${self.getTsign('#/search/shopCommodity/list')})`,
      method: "get",
      timeout: 3000,
      headers: self.requestHeader(),
    });
  },

  /**
   * 获取固定店铺的某个商品
   * @params token string 账号token
   *    storeNo       String
   *    productCode   String  商品货号
   *
   */
  _getFixedProductList(storeNo, productCode) {
    let self = this;
    return axios({
      url: `${
        self.baseStorePath
      }/search/shopCommodity/list?searchKeyword=${productCode}&current=1&pageSize=20&sortColumn=upShelfTime&sortType=asc&filterIds=&shopNo=${storeNo}&tssign=${self.getTsign('#/search/shopCommodity/list')}`,
      method: "get",
      timeout: 3000,
      headers: self.requestHeader(),
    });
  },

  /**
   * 获取商品信息
   * @params 
   *    token       String 账号token
   *    id          String  商品id
   */
  _getProductInfo(id) {
    let self = this;
    return axios({
      url: `${
        self.baseStorePath
      }/shopCommodity/queryShopCommodityDetail/${id}?tssign=${self.getTsign('#/shopCommodity/queryShopCommodityDetail/'+id)}`,
      method: "get",
      headers: self.requestHeader(),
    });
  },

   /**
   * 生成订单
   * @params 
   *    token         string   账号token
   *    shippingId    string
   *    subOrderList  string
   */
  _createOrder(token,orderData){
    return axios({
      url : `${this.baseStorePath}/order/create?tssign=${self.getTsign('#/order/create')}`,
      method: 'post',
      data: orderData,
      headers:self.requestHeader(token)
    })
  },




  /**
   * geetest 验证加签
   * @params
   * gt         string
   * challenge  string
   */
  _getGeetest(gt, challenge) {
    return axios({
      method: "get",
      url: `http://api.ddocr.com/api/gateway.jsonp?wtype=geetest&secretkey=bbe7764080464234a046befa79624816&gt=${gt}&referer=https://servicewechat.com/wx71a6af1f91734f18/30/page-frame.html&challenge=${challenge}`,
      headers: {
        Accept: "text/html",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 Chrome/77.0.3865.120 Safari/537.36",
      },
    });
  },
};
