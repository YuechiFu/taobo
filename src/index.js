const Vue  = require('../node_modules/vue/dist/vue.js');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const tool = require('./tool');
const numCPUs = require('os').cpus().length;

let userData = require('./mockData/userData.js');
let productData = require('./mockData/productData.js');



if(isMainThread){
    tool.initMain(
        userData,
        productData,
        1000 * 3 
    )
    new Proxy(userData,{
        set:function(){
            console.log('更新userdata')
            tool.initMain(
                userData,
                productData,
                1000 * 3 
            )
        }
    })
    
   

    const threads = new Set()
    for(let [userIndex,userItem] of userData.entries()){
        threads.add(
            new Worker(__filename,{
                workerData:{ 
                    userItem,
                    userIndex
                 }
            })
        )
    }

    for(let worker of threads){
        let {threadId} = worker; 
        worker.on('error' , (err)=>{ throw err })
        worker.on('exit',()=>{
            threads.delete(worker);
            console.log(`---线程${threadId}停止, 剩余 ${threads.size}个线程运行中---\n`);
        })
        worker.on('online',()=>{
            console.log(`---线程${worker.threadId}正在执行---\n`);
        })
        worker.on('message', (msg) => {
            if(!msg || !msg.userItem) return ;
           console.log(`---第${msg.index+1}个用户校验更新---\n`);
           console.table(msg.userItem.geet)
           userData.splice(msg.index,1,msg.userItem);
        })
    }
}else{
    tool.init(
        userData,
        workerData.userIndex,
        productData,
        1000 * 60 * 9 
    );
}





/* new Vue({
    data(){
        return {
            userInfoArr:userData,
            productList:productData
        }
        
    },
    methods:{
        
    },
})
 */