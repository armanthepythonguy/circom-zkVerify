pragma circom 2.1.6;

include "circomlib/poseidon.circom";

template Example () {
    signal input a;
    signal input b;
    
    component hash = Poseidon(1);
    hash.inputs[0] <== a;

    log("hash", hash.out);
    assert(b==hash.out);
}

component main { public [ b ] } = Example();

/* INPUT = {
    "a": "5",
    "b": "19065150524771031435284970883882288895168425523179566388456001105768498065277"
} */