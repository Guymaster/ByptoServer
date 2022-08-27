UsdtService = require ('./usdt/usdtService');

function getCryptoServiceById(id){
    switch(id){
        case "usdt":
            return new UsdtService();
        case "ererer":
            return "dgdg";
    }
}

module.exports = getCryptoServiceById;