const fs = require('fs');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')
const Api = require('./api');
const numCPUs = require('os').cpus().length;

function log(msg){
    console.log(`${new Date().toLocaleString()} : `, `${msg}`)
}

module.exports = {
    
    init(userData,targetProducts,validateTimer){
        const self = this;
        if(!userData) return;
        this.userData = userData;
        this.targetProducts = targetProducts || [];
        self.watch();
        self.validateTimer = parseInt(validateTimer) > 0 ? parseInt(validateTimer) : 30000 * 60;
        self.checkAccount();
    },


    resetValidateTimer(){
        const self = this;
        self.validateTT && clearTimeout(self.validateTT);
        self.validateTT = setTimeout(()=>{
            log(`${parseFloat(self.validateTimer / 1000)}秒已到，重新进行人机校验`);
            self.user.validateExpired = true ;
        },self.validateTimer)
    },

    watch(){
        const self = this ;
        self.user = new Proxy({
            'isTokenExpired' : true
        },{
            get:function(user,key){
                switch(key){
                    case 'isTokenExpired' :   return self.user.isTokenExpired;break;
                    case 'validateExpired' :  return self.user.validateExpired;break;
                    case 'now' : return new Date().toLocaleString();break;
                }
            },
            set:function(user,key,value){
                switch(key){
                    case 'isTokenExpired' : 
                        log( value ?  'Token 已过期':'Token 有效,准备加签..') ;
                        break;
                    case 'validateExpired' :
                        value && self.checkAccount();
                        break;
                    case 'isResetAction' :
                        value && self.resetActionTT(); 
                         
                }
            }
    
        })
    },
    

    checkAccount(){
        let self = this ;
        let {token} = this.userData;
        let result = Api._validateExpire(token);
        result.then(res =>{
            // log(res.data)
            if(res.data && res.data.bizCode  == 20000){
                this.user.isTokenExpired = false;
                this.getGeetValidate(res.data.data.verificMap.gt, res.data.data.verificMap.challenge);
            }else{ this.user.isTokenExpired = true ; }
        }).catch(err=>{
           log(err)
        })
    },

    getGeetValidate(gt,challenge){
        let self = this;
        let result = Api._getGeetest(gt,challenge);
        result.then(res => {
            // log(res.data)
            if(res.data.msg == '识别成功'){
                log(`通过人机校验`);
                self.userData['geet'] = {
                    'challenge' : res.data.data.challenge,
                    'validate'  : res.data.data.validate
                }
                self.resetValidateTimer();
                self.user.isResetAction = true ;
            }else{
                log(`未通过人机校验，再来一次..`)
                self.user.validateExpired = true ;
            }
        })
    },

    resetActionTT(action){
        let self = this;
        self.actionTT && clearInterval(self.actionTT);
        self.actionTT = setInterval(()=>{
            // self.getProductList()
        },200);
        self.getProductList()
    },


    getProductList(){
        let self = this ;
        let result = Api._getProductList();
        result.then(res=>{
            log(`刷新列表数据 共${res.data.data.spu.list.length}条数据`);
            let searchResults = self.searchTargetProduct(res.data.data.spu.list);
            if(searchResults.length){
                log(searchResults)
            }
        }).catch(err => {
            log(err)
            log(`列表数据获取失败,重新获取..`);
            // self.getProductList();
        })
    },

    getFixedProductList(storeCode,productCode){
        let self = this ;
        let result =  (storeCode || productCode) ? Api._getFixedProductList(storeCode,productCode) : Api._getProductList();
        result.then(res=>{
            log(`共找到${res.data.data.spu.list.length}条数据`);
            let searchResults = self.searchTargetProduct(res.data.data.spu.list);
            if(searchResults.length){
                console.log(searchResults)
            }
        }).catch(err => {
            log(err)
            log(`列表数据获取失败,重新获取..`);
            // self.getProductList();
        })
    },

    

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

    getProductInfo(productData){
        let {id,shopName,productName} = productData;
        console.table(productData);
        if(!id) return ;
        let result = Api._getProductInfo(id);
        result.then(res=>{
            console.table(res.data.data.skuList);
        })
    }

}

