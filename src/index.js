const Vue  = require('../node_modules/vue/dist/vue.js');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const tool = require('./tool');
const numCPUs = require('os').cpus().length;

let userData = require('./mockData/userData.js');
let productData = require('./mockData/productData.js');


if(isMainThread){
    let actionTT = setInterval(()=>{
        tool.getProductList();
    },1000 * 3)
   

    const threads = new Set()
    for(let userItem of userData){
        threads.add(
            new Worker(__filename,{
                workerData:{ userItem }
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
            console.log(msg)
        })
    }
}else{
    tool.init(
        workerData.userItem,
        productData,
        1000 * 60 * 9 
    );
    // parentPort.postMessage(data)
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