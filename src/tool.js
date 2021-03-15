const fs = require('fs');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')
const Api = require('./api');
const numCPUs = require('os').cpus().length
let userData = require('./mockData/userData.js');
let productData = require('./mockData/productData.js');

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
                    else{ console.log('Token 有效');}; 
                break;
            }
        }

    }),
    
    init(){
        let self = this ;
        let token = userData[0].token;
        console.log(token)
        self.checkAccount(token);
        
    },

    checkAccount(token){
        let self = this ;
        let result = Api._validateExpire(token);
        result.then(res =>{
            console.log(res.data)
            if(res.data && res.data.bizCode  == 20000){
                this.user.isTokenExpired = true;
            }else{ this.user.isTokenExpired = false ; }
        }).catch(err=>{
           console.log(err)
        })
    },


}

