const fs = require('fs');
const { parse } = require('path');
const {parentPort} = require('worker_threads');
const Api = require('./api');
const { filter } = require('./mockData/productData');
const SizeData = require('./mockdata/sizeData');
const numCPUs = require('os').cpus().length;


function log(msg){
    console.log(`${new Date().toLocaleString()} : `, `${msg}`)
}

module.exports = {

    /**
     * 子进程的初始化
     */
     init(allUser,userIndex,targetProducts,validateTimer){
        const self = this;
        if(!allUser || !allUser.length ||!allUser[userIndex]) return;

        // 设置当前用户
        this.allUser = allUser;
        this.userIndex = userIndex;
        this.userData = allUser[userIndex] || {};

        // 设置监控产品
        this.targetProducts = targetProducts || [];
        
        // 人机校验频率间隔
        self.validateTimer = parseInt(validateTimer) >= 0 ? parseInt(validateTimer) : 30000 * 60;



        // 监控相关属性
        self.watch();

        self.user.isGeetExpired = true ;
        
    },

    /**
     * 主进程的初始化
     */
    initMain(allUser,targetProducts,refreshTimer){
        const self = this;
        if(!allUser || !allUser.length) return;
        log('主进程执行')

         // 设置当前用户
         this.allUser = allUser;
         // 设置监控产品
         this.targetProducts = targetProducts || [];
        
         if(this.actionTT){clearInterval(this.actionTT);this.actionTT = null}
         this.actionTT = setInterval(()=>{
             self.getProductList();
         },parseInt(refreshTimer) ||  3000)

    }, 






    /**
     * 基于Proxy监听
     */
     watch(){
        const self = this ;
        self.user = new Proxy({
            'isTokenExpired' : true
        },{
            get:function(user,key){
                switch(key){
                    case 'isTokenExpired' :   return self.user.isTokenExpired;break;
                    case 'isGeetExpired' :  return self.user.isGeetExpired;break;
                }
            },
            set:function(user,key,value){
                switch(key){
                    case 'isTokenExpired' : 
                        log( value ?  'Token 已过期':'Token 有效,准备加签..') ;
                        break;
                    case 'isGeetExpired' :
                        value && self.checkAccount();
                        break;
                         
                }
            }
    
        })
    },

    

    /**
     * 重置人机校验的定时器
     * @param action String 函数名  
     */
    resetValidateTimer(){
        const self = this;
        self.validateTT && clearTimeout(self.validateTT);
        self.validateTT = setTimeout(()=>{
            log(`${parseFloat(self.validateTimer / 1000)}秒已到，重新进行人机校验`);
            self.user.isGeetExpired = true ;
        },self.validateTimer)
    },


     
    
    /**
     * 校验tocken 是否过期 
     * 触发更新人机校验
     */
    checkAccount(){
        let self = this ;
        let {token} = this.userData;
        let result = Api._validateExpire(token);
        result.then(res =>{
            if(res.data && res.data.bizCode  == 20000){
                this.user.isTokenExpired = false;
                this.getGeetValidate(res.data.data.verificMap.gt, res.data.data.verificMap.challenge);
            }else{ this.user.isTokenExpired = true ; }
        }).catch(err=>{
           log(err)
        })
    },


    /**
     * 人机校验签名更新 challenge 
     */
    getGeetValidate(gt,challenge){
        let self = this;
        let result = Api._getGeetest(gt,challenge);
        result.then(res => {
            if(res.data && res.data.msg == '识别成功'){
                log(`通过人机校验`);
                self.userData['geet'] = {
                    'challenge' : res.data.data.challenge,
                    'validate'  : res.data.data.validate
                }
                self.resetValidateTimer();
                parentPort.postMessage({
                    userItem : self.userData,
                    index : self.userIndex
                });
            }else{
                log(`未通过人机校验，再来一次..`);
                self.user.isGeetExpired = true ;
            }
        })
    },

    
    /**
     * 获取产品列表数据
     */
    getProductList(){
        let self = this ;
        let result = Api._getProductList();
        result.then(res=>{
            log(`刷新列表数据 共${res.data.data.spu.list.length}条数据`);
            let searchResults = self.searchTargetProduct(res.data.data.spu.list);
            if(searchResults.length){
                for(let i=0; i<searchResults.length; i++){
                    let productItem = searchResults[i];
                    let {id,shopName,productName} = productItem;
                    self.getProductInfo(id,shopName,productName);
                }
            }
        }).catch(err => {
            log(err)
            log(`列表数据获取失败,重新获取..`);
            self.getProductList();
        })
    },

    /**
     * 获取产品详情
     */
    getProductInfo(id,shopName,productName){
        if(!id) return ;
        let self = this;
        let result = Api._getProductInfo(id);
        result.then(res=>{
            if (res.data.data.status != 3) {
                log(`获取商品'${id}:${productName}'数据失败`);
                return
            }
            let data = res.data.data;
            console.log(
                `\n-------------------------\n`+
                `${data.productCode} |  ${data.productName} |  ${data.shopName} |  ￥${data.salePrice}`
            )
            let sizeSkuData = self.getSizeSkuData(res.data.data);
            console.table(sizeSkuData);
        }).catch(err=>{
            log(err);
        })
    },

    /**
     * 创建订单
     * create Order 
     */
    createOrder(){

    },


    /**
     * 遍历产品列表匹配目标产品
     * @param allProducts Array 
     */
     searchTargetProduct(allProducts){
        let self = this ;
        let arr = []
        for(let productItem of allProducts){
            arr.push(productItem);
            if(arr.length === 2){
                return arr
            }
            /* for(let targetItem of self.targetProducts){
                if(productItem['productCode'] == targetItem){
                    self.getProductInfo(productItem);
                }
            } */
        }
        return arr ;
    },
    
    /**
     * 遍历尺码列表 
     * 匹配目标尺码 或 有库存的尺码 
     */
    getSizeSkuData(data){
        if(!data || !data.skuList) return false;
        let { skuList, productCode } = data,
            specialSize = new Set(SizeData[productCode] || []);
            filterSkuList = [];

        if(specialSize.size){
            // 特殊产品码数匹配
            for(let skuItem of skuList){
                skuItem.stock / 1 > 0 
                && specialSize.has(parseFloat(skuItem.sizeCode)) 
                && filterSkuList.push(skuItem);
            } 
        }else{
            // 普通产品码数匹配 
            for(let skuItem of skuList){
                skuItem.stock / 1 > 0 &&  filterSkuList.push(skuItem);
            } 
        }
        return filterSkuList;
    },

    getRandomSize(sizeList){
        if(!sizeList) return false ;
    },

    /**
     * 生成subOrderList
     * @param productData Object 商品详情数据 
     * 
     */
    setSubOrderList(data){
        if(!data) return false;
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
        return subOrderList;
    }



}

