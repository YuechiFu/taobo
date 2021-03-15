const fs = require('fs');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')
const Api = require('./api');
const numCPUs = require('os').cpus().length;

module.exports = {
    user :new Proxy({
        'isTokenExpired' : true
    },{
        get:function(user,key){
            switch(key){
                case 'isTokenExpired' :  return user.isTokenExpired;break;
            }
        },
        set:function(user,key,value){
            switch(key){
                case 'isTokenExpired' : 
                    if(!value){console.log('Token 已过期')}
                    else{ 
                        console.log('Token 有效,准备加签..');

                    };
                break;
            }
        }

    }),
    
    init(userData){
        if(!userData || !userData.length) return;
        let self = this ;
        this.userData = userData;
        self.checkAccount(token);
        
    },

    checkAccount(){
        let self = this ;
        let {token} = this.userData;
        let result = Api._validateExpire(token);
        result.then(res =>{
            console.log(res.data)
            if(res.data && res.data.bizCode  == 20000){
                this.user.isTokenExpired = true;
                this.getGeetValidate(res.data.data.verificMap.gt, res.data.data.verificMap.challenge);
            }else{ this.user.isTokenExpired = false ; }
        }).catch(err=>{
           console.log(err)
        })
    },

    getGeetValidate(gt,challenge){
        let self = this;
        let {gt,challenge} = self.userData;
        let result = Api._getGeetest(gt,challenge);
    }

}

