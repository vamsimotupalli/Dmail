const fs = require('fs');
const { ethers } = require('hardhat');
async function main() {

  //deploy contracts
  const [deployer, user1] = await ethers.getSigners();
  const DmailFactory = await ethers.getContractFactory("Dmail");
  const dmail = await DmailFactory.deploy();
  //await dmail.deployed();

  const Dpay = await hre.ethers.getContractFactory("Dpay");
  const dpay = await Dpay.deploy(config["networks"][network.name]["eth_usd_priceFeed"]);
  //await dpay.deployed();

  // Save contract address file in project
  const contractsDir = __dirname + "/../src/contractsData";
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/dmail-address.json`,
    JSON.stringify({ address: dmail.address }, undefined, 2)
  );


  const dmailContractArtifact = artifacts.readArtifactSync("Dmail");

  fs.writeFileSync(
    contractsDir + `/dmail.json`,
    JSON.stringify(dmailContractArtifact, null, 2)
  );
  console.log("Dmail deployed to:", dmail.address);


  fs.writeFileSync(
    contractsDir + `/dpay-address.json`,
    JSON.stringify({ address: dpay.address }, undefined, 2)
  );

  const dpayContractArtifact = artifacts.readArtifactSync("Dpay");

  fs.writeFileSync(
    contractsDir + `/dpay.json`,
    JSON.stringify(dpayContractArtifact, null, 2)
  );
  console.log("Dpay deployed to:", dpay.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
