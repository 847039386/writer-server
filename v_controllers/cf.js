const { Topic ,Drama ,User } = require('../proxy')


const Home = async ( ctx , next ) => {
    let resultPromise = new Promise((resolve ,reject) => {
        Promise.all([Topic.find(1,5),Drama.find(1,5),User.find(1,5,{sort :{'follow' :-1} })]).then((result) => {
            if(result[0].success && result[1].success && result[2].success){
                let newResult = { data : {topics :result[0].data ,dramas :result[1].data ,authors :result[2].data} ,success :true }
                resolve(newResult);
            }else{
                resolve({success :false , msg :'未知错误'});
            }
        }).catch((e) => {
            resolve({success :false , msg :'未知错误'});
        })
    })
    let result = await resultPromise;
    ctx.body = result;
    
}

module.exports = {
    Home
}