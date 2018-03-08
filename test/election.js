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
      return electionInstance.candidates(1)
    }).then(function(candidate) {
      assert.equal(candidate[0], 1, "contains the correct ID")
      assert.equal(candidate[1], "Jagjot Singh", "contains the correct name")
      assert.equal(candidate[2], 0, "contains correct vote count")
      return electionInstance.candidates(2)
    }).then(function(candidate) {
      assert.equal(candidate[0], 2, "contains the correct ID")
      assert.equal(candidate[1], "Harjit Kumar", "contains the correct name")
      assert.equal(candidate[2], 0, "contains correct vote count")
    })
  })

  it('allows a voter to cast a vote', function() {
    return Election.deployed()
      .then(function(instance) {
        electionInstance = instance
        candidateId = 1
        return electionInstance.vote(candidateId, { from: accounts[0] })
      })
      .then(function(receipt) {
        return electionInstance.voters(accounts[0])
      })
      .then(function(voted) {
        assert(voted, "the voter was marked as voted")
        return electionInstance.candidates(candidateId)
      })
      .then(function(candidate) {
        var voteCount = candidate[2]
        assert(voteCount, 1, "increments the candidate's vote count")
      })
  })

  it('throws an exception for invalid candidates', function() {
    return Election.deployed()
      .then(function(instance) {
        electionInstance = instance
        return electionInstance.vote(99, { from: accounts[1] })
      })
      .then(assert.fail)
      .catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, "error message must contain revert")
        return electionInstance.candidates(1)
      })
      .then(function(candidate) {
        var voteCount = candidate[2]
        assert.equal(voteCount, 1, "Jagjot Singh did not get any votes")
        return electionInstance.candidates(2)
      })
      .then(function(candidate) {
        var voteCount = candidate[2]
        assert.equal(voteCount, 0, "Harjit Singh did not get any votes")
      })
  })

  if('throws an exception on double voting', function() {
    return Election.deployed()
      .then(function(instance) {
        electionInstance = instance
        candidateId = 2
        electionInstance.vote(candidateId, { from: accounts[1] })
        return electionInstance.candidates(candidateId)
      })
      .then(function(candidate) {
        var voteCount = candidate[2]
        assert(voteCount, 1, "Harjit Singh [id=2] accepts first vote")
        return electionInstance.vote(candidateId, { from: accounts[1] })
      })
      .then(assert.fail)
      .catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, "error message must contain revert")
        return electionInstance.candidates(1)
      })
      .then(function(candidate1) {
        var voteCount = candidate1[2]
        assert(voteCount, 1, "Jagjot Singh [id=1] did not receive any votes")
        return electionInstance.candidates(2)
      })
      .then(function(candidate2) {
        var voteCount = candidate2[2]
        assert(voteCount, 1, "Harjit Singh [id=2] did not receive any votes")
      })
  })

});
