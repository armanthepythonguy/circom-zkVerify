const {zkVerifySession, Library, CurveType, ZkVerifyEvents} = require("zkverifyjs");
const fs = require("fs");
const proof = require("./data/proof.json");
const public = require("./data/public.json");
const key = require("./data/main.groth16.vkey.json");

async function start() {
    const session = await zkVerifySession.start().Testnet().withAccount("SEED_PHRASE");

    const {events, txResults} = await session.verify()
        .groth16(Library.snarkjs, CurveType.bn128).waitForPublishedAttestation()
        .execute({proofData: {
            vk: key,
            proof: proof,
            publicSignals: public
        }});

    // Listen for the 'includedInBlock' event
    let attestationId, leafDigest;
    events.on(ZkVerifyEvents.IncludedInBlock, (eventData) => {
        console.log('Transaction included in block:', eventData);
        attestationId = eventData.attestationId;
        leafDigest = eventData.leafDigest;
        // Handle the event data as needed
    });

    // Listen for the 'finalized' event
    events.on(ZkVerifyEvents.Finalized, (eventData) => {
        console.log('Transaction finalized:', eventData);
        // Handle the event data as needed
    });

    events.on(ZkVerifyEvents.AttestationConfirmed, async(eventData) => {
        console.log('Attestation Confirmed', eventData);
        const proofDetails = await session.poe(attestationId, leafDigest);
        fs.writeFileSync("attestation.json", JSON.stringify(proofDetails, null, 2));
        console.log("proofDetails", proofDetails);
    })


}

start()