var Election = artifacts.require("./Election.sol");

contract("Electron", function(accounts) {
  it("initializes with two candidates", function() {
    return Election.deployed().then(function(instance) {
      return instance.candidatesCount();
    }).then(function(count) {
      assert.equal(count, 2);
    });
  });

  it('initializes the candidates with correct values', function() {
    return Election.deployed().then(function(instance) {
      electronInstance = instance
      return electronInstance.candidates(1)
    }).then(function(candidate) {
      assert.equal(candidate[0], 1, "contains the correct ID")
      assert.equal(candidate[1], "Jagjot Singh", "contains the correct name")
      assert.equal(candidate[2], 0, "contains correct vote count")
      return electronInstance.candidates(2)
    }).then(function(candidate) {
      assert.equal(candidate[0], 2, "contains the correct ID")
      assert.equal(candidate[1], "Harjit Kumar", "contains the correct name")
      assert.equal(candidate[2], 0, "contains correct vote count")
    })
  })

});
