pragma solidity ^0.4.2;

contract Election {

  // model candidate
  struct Candidate {
    uint id;
    string name;
    uint voteCount;
  }

  // store array of candidates
  mapping(uint => Candidate) public candidates;
  uint public candidatesCount;

  // constructor
  function Election() public {
    addCandidate("Jagjot Singh");
    addCandidate("Harjit Kumar");
  }

  function addCandidate(string _name) private {
    candidatesCount++;
    candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
  }


}
