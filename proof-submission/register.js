const {zkVerifySession, Library, CurveType, ZkVerifyEvents} = require("zkverifyjs");
const fs = require("fs");
const key = require("./data/main.groth16.vkey.json");

async function register(){

    const session = await zkVerifySession.start().Testnet().withAccount("SEED_PHRASE");

    const {events, regResult} = await session.registerVerificationKey().groth16(Library.snarkjs, CurveType.bn128).execute(key);

    events.on(ZkVerifyEvents.Finalized, (eventData) => {
        console.log('Verification finalized:', eventData);
        fs.writeFileSync("vkey.json", JSON.stringify({"vkey": eventData.statementHash}, null, 2));
        return eventData.statementHash
    });

}

register();