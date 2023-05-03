import Web3 from 'web3/dist/web3.min.js';
import axios from "axios";

export default {
  connectWallet: function(callback) {
    console.log("connecting wallet..");

    (async () => {

      if (window.ethereum) {

        // Get web3 instance
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

        // detect Metamask account change
        window.ethereum.on('accountsChanged', (accounts) => {

          (async () => {
            let account = accounts[0];
            let chainId = await web3.eth.getChainId();
            let walletData = JSON.stringify({
              walletAddress: account,
              chainId: chainId
            });
            console.log('accountsChanged', account);

            callback(null, 'accountsChanged', walletData);
          })();


          /*
          _this.didLoadMembership = false;

          // If user has locked/logout from MetaMask, this resets the accounts array to empty
          if (!accounts.length || !accounts[0]) {

            console.log("Wallet not detected");
            _this.isWalletConnected = false;
            _this.walletAddress = null;

          } else {

            console.log('accountsChanged', accounts[0]);
            _this.walletAddress = accounts[0];
          }
          */
        });

        // detect Network account change
        window.ethereum.on('chainChanged', function(networkId){
          
          console.log('chainChanged', networkId);

          (async () => {

            let accounts = await web3.eth.getAccounts();
            let account = accounts[0];
            let chainId = parseInt(networkId, 16);
            let walletData = JSON.stringify({
              walletAddress: account,
              chainId: chainId
            });
            console.log('chainChanged', account);

            callback(null, 'chainChanged', walletData);

          })();



          /*
          _this.didLoadMembership = false;

          // Reset chain name
          let chainId = parseInt(networkId, 16);
          console.log("  > chain id:", chainId);
          _this.setChainName(chainId);
          */

        });

        //
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        /*
        // Set chain name
        let chainId = await web3.eth.getChainId();
        _this.setChainName(chainId);
        // Set wallet address
        var accounts = await web3.eth.getAccounts();
        var account = accounts[0];
        _this.walletAddress = account;
        _this.isWalletConnected = true;
        */

        let chainId = await web3.eth.getChainId();
        let accounts = await web3.eth.getAccounts();
        let account = accounts[0];
        let walletData = JSON.stringify({
          walletAddress: account,
          chainId: chainId
        });

        //
        callback(null, "connected", walletData);

      } else {


        // Handle error
        callback("err", null, null)

      } 
    })();

  },
  logout: function(localCacheKey) {

    console.log("shared: logging out..", localCacheKey);

    /* Clear local token related cache */
    localStorage.removeItem(localCacheKey); 

    /* Go to top */
    this.$router.push('/');
  },
  handleError: function() {

    this.$swal({
      title: 'Sorry, something went wrong',
      text: "Please try again. error code: 1001",
      type: 'warning',
      showCancelButton: false,
      cancelButtonColor: '#1DA1F2',
      confirmButtonColor: '#AAB8C2',
      timer: 1500
        }).then((result) => {
        
        if (result.value) {
          window.location.reload();
        }
    });
  },
  handleSuccess: function() {

    this.$swal({
      position: 'top-end',
      icon: 'success',
      title: 'Success',
      type: 'success',
      showCancelButton: false,
      timer: 1500
    });
  },
  showDraftLossAlert: function(callback) {

      // Show alert before leave comment view
      this.$swal({
      title: this.$t("are_you_sure_quit_posting"),
      text: this.$t("draft_will_lost"),
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: this.$t("keep_posting"),
      cancelButtonColor: '#1DA1F2',
      confirmButtonText: this.$t("quit_posting"),
      confirmButtonColor: '#AAB8C2'
      
      }).then((result) => {

        if (result.value) {
          callback();
        }
      });
  },
  validateUrl: function(value) {
    return value.match(/^https:\/\//);
    // return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  },
  getOgp: function(url, callback) {
    /*
    fetch(url)
    .then(res => res.text())
    .then(text => {
        const el = new DOMParser().parseFromString(text, "text/html");
        const headEls = (el.head.children);

        Array.from(headEls).map(v => {
            const prop = v.getAttribute('property');
            if (!prop) return;
            console.log(prop, v.getAttribute("content"));
        });

        callback(null);
    });
    */

    (async () => {

      const response = await axios.get(url);
      const data = response.data;
      console.log("html data", data);

      callback(data);
   
    })();


  }


}