const { expect } = require("chai");

describe("Dmail contract", function () {

    let dmail;
    let dmail_deployed;
    let owner;

    beforeEach(async function () {
        dmail = await ethers.getContractFactory("Dmail");
        [owner] = await ethers.getSigners();
        dmail_deployed = await dmail.deploy();
    });

    describe("Deployment", function () {

        it("Getting TokenURI", async function () {
            await dmail_deployed.mint(owner.address, "ssss");
            expect(dmail_deployed.user[owner] == true);
        });

        it("Getting URI", async function () {
            expect(dmail_deployed.getURI(owner) == dmail_deployed.tokenURI(owner));
        });

        it("Uploading Mail", async function () {
            await dmail_deployed.uploadMail(owner.address, "hihi");
            expect(dmail_deployed.mailCount > 0);
        });

    });

});