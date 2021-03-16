const Vue  = require('../node_modules/vue/dist/vue.js');
const tool = require('./tool');
let userData = require('./mockData/userData.js');
let productData = require('./mockData/productData.js');
tool.init(
    userData[0],
    productData
    );


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