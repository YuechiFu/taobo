const axios = require("axios");
var tssign = require("../origin/topTssign");
export default {
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

  requestHeader: {
    "Content-Type": "application/json",
    Authorization: token,
    "User-Agent":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.15(0x17000f31) NetType/WIFI Language/zh_CN",
  },

  getTsign() {
    return tssign.AES_Encrypt(`tsmall#${new Date().getTime()}`);
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
      }/order/confirmationOrder?tssign=${self.getTsign()}#/order/confirmationOrder`,
      method: "post",
      data: self.demoConfirmData,
      headers: self.requestHeader,
    });
  },

  /**
   * 获取商品列表
   */
  _getProductList() {
    let self = this;
    return axios({
      url: `${
        self.baseStorePath
      }/search/shopCommodity/list?shopNo=&sortColumn=upShelfTime&filterIds=&current=1&pageSize=3&tssign=${self.getTsign()}#/search/shopCommodity/list)`,
      method: "get",
      timeout: 3000,
      headers: self.requestHeader,
    });
  },

  /**
   * 获取固定店铺的某个商品
   * @params
   *    storeNo     String
   *    productCode String  商品货号
   *
   */
  _getFixedProductList(storeNo, productCode) {
    let self = this;
    return axios({
      url: `${
        self.baseStorePath
      }/search/shopCommodity/list?searchKeyword=${productCode}&current=1&pageSize=20&sortColumn=upShelfTime&sortType=asc&filterIds=&shopNo=${storeNo}&tssign=${self.getTsign()}#/search/shopCommodity/list`,
      method: "get",
      timeout: 3000,
      headers: self.requestHeader,
    });
  },

  /**
   * 获取商品信息
   * @params
   *    id          String  商品id
   */
  _getProductInfo(id) {
    let self = this;
    return axios({
      url: `${
        self.baseStorePath
      }/shopCommodity/queryShopCommodityDetail/${id}?tssign=${self.getTsign()}#/shopCommodity/queryShopCommodityDetail/${id}`,
      method: "get",
      headers: self.requestHeader,
    });
  },

   /**
   * 生成订单
   * @params
   * shippingId string
   * subOrderList  string
   */

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
