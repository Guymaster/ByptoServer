const Web3API = require('web3');

function UsdtService(){
    this.id = "usdt";
    this.tokenAddress = "0x55d398326f99059ff775485246999027b3197955";
    this.nom = "Tether USD"
    this.createWallet = function(){
        let web3 = new Web3API(new Web3API.providers.HttpProvider('https://mainnet.infura.io/v3/714df763c1af49e1bef4c930f8b40576'));
        let wallet = web3.eth.accounts.create();
        return wallet;
    }
    this.getBalance = async (walletAddress)=>{
        let contractABI = [
            {
              "constant": true,
              "inputs": [],
              "name": "name",
              "outputs": [
                {
                  "name": "",
                  "type": "string"
                }
              ],
              "payable": false,
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [],
              "name": "decimals",
              "outputs": [
                {
                  "name": "",
                  "type": "uint8"
                }
              ],
              "payable": false,
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [
                {
                  "name": "_owner",
                  "type": "address"
                }
              ],
              "name": "balanceOf",
              "outputs": [
                {
                  "name": "balance",
                  "type": "uint256"
                }
              ],
              "payable": false,
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [],
              "name": "symbol",
              "outputs": [
                {
                  "name": "",
                  "type": "string"
                }
              ],
              "payable": false,
              "type": "function"
            }
          ]
        ;
        let web3 = new Web3API(new Web3API.providers.HttpProvider('https://mainnet.infura.io/v3/714df763c1af49e1bef4c930f8b40576'));
        let tokenContract = new web3.eth.Contract(contractABI).at(this.tokenAddress)
        let decimal = tokenContract.decimals()
        let balance = tokenContract.balanceOf(walletAddress)
        let adjustedBalance = balance / Math.pow(10, decimal)
        let tokenName = tokenContract.name()
        let tokenSymbol = tokenContract.symbol()
        return adjustedBalance;
      }
    this.generateReceptionAddress = function(privateKey){
        let web3 = new Web3API(new Web3API.providers.HttpProvider('https://mainnet.infura.io/v3/714df763c1af49e1bef4c930f8b40576'));
        let wallet = web3.eth.accounts.privateKeyToAccount(privateKey);
        return wallet.address;
    }
}

module.exports = UsdtService;