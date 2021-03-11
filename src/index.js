const Vue  = require('../node_modules/vue/dist/vue.js');
let userData = require('./mockData/userData.js');
let productData = require('./mockData/productData.js')
new Vue({
    data(){
        return {
            userInfoArr:userData,
            productList:productData
        }
        
    },
    methods:{
        
    },
})
