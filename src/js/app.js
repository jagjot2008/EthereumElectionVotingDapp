App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== undefined) {
      // if web3 instance is already provided by Meta Mask
      App.web3Provider = web3.currentProvider
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }
    web3 = new Web3(App.web3Provider)
    return App.initContract();
  },

  initContract: function() {
    /*
     * Replace me...
     */
     $.getJSON("Election.json", function(election) {
       App.contracts.Election = TruffleContract(election)
       App.contracts.Election.setProvider(App.web3Provider)
       return App.render()
     })
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader")
    var content = $("#content")
    loader.show()
    content.hide()

    // load the account currently being used
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account
        $("#accountAddress").html("Your account: " + account)
      }
    })

    // load contract data
    App.contracts.Election.deployed()
      .then(function(instance) {
        electionInstance = instance
        return instance.candidatesCount()
      }).then(function(count) {
        var candidatesResults = $("#candidatesResults")
        candidatesResults.empty()

        for(var i = 1; i <= count; i++) {
          electionInstance.candidates(i)
            .then(function(candidate) {
              var id = candidate[0]
              var name = candidate[1]
              var votes = candidate[2]

              // render result
              var tpl = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + votes + "</td></tr>"
              candidatesResults.append(tpl)
            })
        }
        loader.hide()
        content.show()
      }).catch(function(error) {
        console.warn(error)
      })
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
