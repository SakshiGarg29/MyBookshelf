const https = require("https");

module.exports = {
    /*
    ** This method returns a promise
    ** which gets resolved or rejected based
    ** on the result from the API
    */
    make_Google_API_call : async function(url){
        return new Promise((resolve) => {
            let data = ''
            https.get(url, res => {
                res.on('data', chunk => { data += chunk }) 
                res.on('end', () => {
                   resolve(data);
                })
            }) 
        })
    }
}