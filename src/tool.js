const fs = require('fs');
const Api = require('./api');
const SizeData = require('./mockdata/sizeData');
const numCPUs = require('os').cpus().length;


function log(msg){
    console.log(`${new Date().toLocaleString()} : `, `${msg}`)
}

module.exports = {

    /**
     * 初始化操作
     */
     init(userData,targetProducts,validateTimer){
        const self = this;
        if(!userData) return;

        // 设置当前用户
        this.userData = userData;
        // 设置监控产品
        this.targetProducts = targetProducts || [];
        
        // 人机校验频率间隔
        self.validateTimer = parseInt(validateTimer) >= 0 ? parseInt(validateTimer) : 30000 * 60;

        // 刷新产品数据时间间隔
        self.refreshTimer = 1000;

        // 监控相关属性
        self.watch();

        self.user.isGeetExpired = true ;



        
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
            }else{
                log(`未通过人机校验，再来一次..`);
                self.getGeetValidate(gt,challenge);
                // self.user.isGeetExpired = true ;
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
                    // self.getProductInfo(id,shopName,productName);
                }
            }
        }).catch(err => {
            log(err)
            log(`列表数据获取失败,重新获取..`);
            // self.getProductList();
        })
    },

    /**
     * 获取产品详情
     */
    getProductInfo(id,shopName,productName){
        if(!id) return ;
        let result = Api._getProductInfo(id);
        result.then(res=>{
            if (res.data.data.status != 3) {
                log(`获取商品'${id}:${productName}'数据失败`);
                return
            }
            let data = res.data.data;
            console.log(
                `\n******************************************************\n`+
                `${data.productCode} |  ${data.productName} |  ${data.shopName} |  ￥${data.salePrice}`
            )
            console.table(res.data.data.skuList);
        }).catch(err=>{
            log(err);
        })
    },


    /**
     * 匹配目标
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


}

