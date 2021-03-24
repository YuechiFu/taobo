const { clear } = require('console');
const fs = require('fs');
const { parse } = require('path');
const { formatWithOptions } = require('util');
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
    initMain(isUpdate,allUser,targetProducts,refreshTimer){
        const self = this;
        if(!allUser || !allUser.length) return;

        // 设置当前用户
         this.allUser = allUser;

        // 如果此时只是用户校验更新
        if(isUpdate){log('用户校验数据更新');return};

        // 设置监控产品
         this.targetProducts = targetProducts || [];
        
         if(this.actionTT){clearInterval(this.actionTT);this.actionTT = null}
         self.getProductList();
         this.actionTT = setInterval(()=>{
             self.getProductList();
         },parseInt(refreshTimer))

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
            // return
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
            setTimeout(function(){ self.getProductList()},500)
           
        })
    },

    /**
     * 获取产品详情
     * @param id        String 商品id
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
            let sizeSkuData = self.getSizeSkuData(res.data.data);
            self.setOrderToUser(data,sizeSkuData);     
            console.log(
                `\n——————————发现商品——————————\n`+
                `${data.productCode} |  ${data.productName} |  ${data.shopName} |  ￥${data.salePrice}`
            )
            console.table(sizeSkuData);
        }).catch(err=>{
            log(err);
        })
    },

    /**
     * 创建订单
     * @param subOrderList  用户下单商品的生成的数据(店铺名,sku,size,stock...)
     * @param index         用户在用户列表的下标
     * -----------------
     * @param token         用户账号的鉴权token 
     * @param shippingId    用户地址ID
     * @param challenge     用户加签的challenge 
     * @param validata      用户加签的valiatge 
     */
    createOrder(index,subOrderList){
        let self = this;
        if(!subOrderList)return;
        let userItem = self.allUser[index];
        if(!userItem) return ;
        let {
            token,
            addressId:shippingId,
            geet:{challenge},
            geet:{validate},
        } = userItem;

        subOrderList[0].commodityList[0].shoppingcartId = userItem['cartId'];
        
        let orderDetail = {
            username    :  userItem.name,
            productName :  subOrderList[0].commodityList[0].productName,
            size        :  subOrderList[0].commodityList[0].sizeEur,
            price       :  subOrderList[0].commodityList[0].salePriceAmount,
            from        :  subOrderList[0].commodityList[0].shopAddress
        }

        let data = {
            "merchantNo"            : "TS",
            "rid"                   : '',
            "shippingId"            : shippingId,
            "subOrderList"          : subOrderList,
            "purchaseType"          : 2,
            "usedPlatformCouponList": [],
            "verificationType"      : 2,
            "validate"              : validate,
            "seccode"               : `${validate}|jordan`,
            "challenge"             : challenge
        };
        console.log(`——————————— Make Order Right Now , Wait ... ———————————`)
        Api._createOrder(token,data).then((res)=>{
            log(res.data)
            if(res.data && res.data.bizCode == 20000){
                console.log(`⭐⭐🎉🎉🎉Congratulations!!Order Success!!🎉🎉🎉⭐⭐`);
                console.table(orderDetail);
                console.log(`⭐⭐—————— Congratulations!!Order Success!! ————⭐⭐`);
            }else{
                log(`—————————— Order Failed ——————————`);
                console.table(orderDetail);
            }
        })
        
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


    /**
     * 为所有用户生成订单请求数据
     * @param data        Object 产品数据
     * @param sizeSkuData Array  过滤后得到的尺码数据
     */
     setOrderToUser(productData,sizeList){
        let self = this ;
        if(!productData || !sizeList || !sizeList.length) return ;
        console.table(sizeList);
        let allUser = self.allUser;
        let len = allUser.length ;
        for(let i=0; i<len; i++){
            let userItem = allUser[i];
            let index = parseInt( Math.random() * sizeList.length);
            let randomSizeItem = sizeList[index] ;
            if(!userItem['geet']) continue;
            if(parseInt(randomSizeItem.stock) > 0){
                self.actionTT && clearInterval(self.actionTT);
                let orderData = self.setSubOrderList(productData,randomSizeItem);
                randomSizeItem.stock-- ;
                randomSizeItem.stock == 0 && sizeList.splice(index,1);
                self.createOrder(i,orderData);
            } 
        }
    },


    /**
     * 生成subOrderList
     * @param productData Object 商品详情数据 
     * @param skuData     Object 商品尺码数据
     * 
     */
    setSubOrderList(data,skuData){
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

