const hre = require("hardhat"); // Corrected typo: "hardhart"
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data, value) => {
    const rpcLink = hre.network.config.url;
    const [encryptedData] = await encryptDataField(rpcLink, data);
    return await signer.sendTransaction({
        from: signer.address,
        to: destination,
        data: encryptedData,
        value,
    });
};

async function main() {
    const contractAddress = "0x314A7284E9a28D37C453D179faf5ad732AF8cA9f";
    const [signer] = await hre.ethers.getSigners();

    const contractFactory = await hre.ethers.getContractFactory("TestToken");
    const contract = contractFactory.attach(contractAddress);

    const functionName = "mint100tokens";
    const mint100tokensTx = await sendShieldedTransaction(
        signer,
        contractAddress,
        contract.interface.encodeFunctionData(functionName), // Corrected "contarct" typo
        0
    );

    await mint100tokensTx.wait();
    console.log("Transaction Receipt:", mint100tokensTx.hash); // Corrected log format
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
