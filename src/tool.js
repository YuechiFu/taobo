const fs = require('fs');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')
const Api = require('./api');
const numCPUs = require('os').cpus().length;

function log(msg){
    console.log(`${new Date().toLocaleString()} : `, `${msg}`)
}

module.exports = {
    
    init(userData,validateTimer){
        const self = this;
        if(!userData ) return;
        this.userData = userData;
        self.watch();
        self.validateTimer = parseInt(validateTimer) > 0 ? parseInt(validateTimer) : 30000;
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
                        value && self.resetActionTT(self.getProductList()); 
                         
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
                self.getProductList();
            }else{
                log(`未通过人机校验，再来一次..`)
                self.user.validateExpired = true ;
            }
        })
    },

    resetActionTT(action){
        self.actionTT = setInterval(()=>{
            action();
        },50)
    },


    getProductList(){
        const self = this ;
        let result = Api._getProductList();
        result.then(res=>{
            log(`刷新列表数据 共${res.data.data.spu.list.length}条数据`);
        })
    }

}

