// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CheckHash} from "../src/CheckHash.sol";

contract CounterScript is Script {
    CheckHash public checkHash;


    function run() public {
        vm.startBroadcast();

        address zkVerify = vm.envAddress("ZKVERIFY_CONTRACT_ADDRESS");
        bytes32 vkey = vm.envBytes32("VK_HASH");

        checkHash = new CheckHash(zkVerify, vkey);

        vm.stopBroadcast();
    }
}
