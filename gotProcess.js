const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')
const got = require('./gotAction')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length

const userInfoArr = [
    {   
        token: "Bearer fc7a5028-200c-48c4-b241-a86da936f925",
        name: "FYC",
        cartId: "19e3d03fed5543c5b43cd4bb947e291c",
      },
      
    // {
    //     token:'Bearer cc43b8ae-b40d-4494-8b60-20978de0caa7',
    //     name:'Y',    
    //     cartId:'eea09d66749c424392fc612b7caf237f',addressId:'8a7a08b57597cc05017597d2bd57011f'
    // }
   
  ]

 
let productCodeLatestArr = [
      'CZ6222-001',//AJ23
      'DD3522-100',//aj11 adapt
      'DD1666-100',//mid冰淇淋
      'CW7104-601',//aj1 冰激凌gs
      '555088-105',//摩卡男
      'DD2224-200',//淡橘色
      'DJ2756-100',//court aj1
      'CZ4385-016',//酒红mi1d
      '575441-105',//摩卡女
      '555112-103',//粉熊猫
      'DD1527-114',//裸眼3dLOW
      'BQ6472-800',//奶茶mid
      'BQ6472-202',//红豆mid
      '554724-073',//黑白灰
      'BQ6931-114',//裸眼3DMID
      'CT0979-602',//zoom拼接
      'CT0979-107',//zoom绿茶
      'CV0152-401',//小闪电aj1
      'CT0979-100',//zoom奶茶
      'DD1503-100',   //dunk北卡蓝
      'DD1869-102',   //dunk high紫
      'DD1503-101',   //dunk熊猫 699
      'BQ6817-500',   //dunk黑紫
      'CW1590-002',   //dunk灰红
      'DD1391-102',   //dunk灰红
      'DD1399-100',   //dunk灰白
      'DD1391-100',   //dunk熊猫 599
      'CW1590-100',   //dunk熊猫 599
    //   'CW1574-100',//双钩af1
      // '554724-075',
  ] //需要监听的产品CODE2



if (isMainThread) {

//   const threadCount = +process.argv[4] || 4
  const threadCount = userInfoArr.length || 1;
  const threads = new Set();
  console.log(
      `当前设备的CPU内核数:${numCPUs}\n.总共${userInfoArr.length}个账号\n 生成${threadCount}个线程\n`)
    
  for(let item of userInfoArr){
    threads.add(new Worker(__filename,{
        workerData:{
            users : [item],
            products : productCodeLatestArr
        }
    }))
  }


  for (let worker of threads) {
    worker.on('error', (err) => { throw err })
    worker.on('exit', () => {
      threads.delete(worker)
      console.log(`Thread exiting, ${threads.size} running...`)
      if (threads.size === 0) {
        // console.log(primes.join('\n'))
      }
    })

    worker.on('online',()=>{
        console.log(`===========线程${worker.threadId}正在执行=======`)
    })

    worker.on('message', (msg) => {
        // console.log(`线程${worker.threadId}消息:\n${msg}`) 
    })
  }
} else {
  const data = got(workerData.users,workerData.products);
  parentPort.postMessage(data)
}