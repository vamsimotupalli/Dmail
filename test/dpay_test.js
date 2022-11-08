const { expect } = require("chai");

describe("Dpay contract", function () {

    let dpay;
    let dpay_deployed;
    let owner;

    beforeEach(async function () {
        dpay = await ethers.getContractFactory("Dpay");
        [owner] = await ethers.getSigners();

        dpay_deployed = await dpay.deploy(config["networks"]["rinkeby"]["eth_usd_priceFeed"]);
    });

    describe("Transfer", function () {
        it("To Address", async function () {
            expect(await dpay_deployed.transfer(owner.address) == true);
        });
    });

});