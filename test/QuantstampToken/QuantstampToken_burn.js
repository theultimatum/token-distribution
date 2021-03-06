// Unit tests for the constructor

var bigInt = require("big-integer");
var QuantstampToken = artifacts.require("./QuantstampToken.sol");
var QuantstampSale = artifacts.require("./QuantstampSale.sol");

contract('QuantstampToken.burn', function(accounts) {
    // account[0] points to the owner on the testRPC setup
    var owner = accounts[0];
    var admin = accounts[1];
    var user2 = accounts[2];
    var user3 = accounts[3];

    beforeEach(
        function() {
            return QuantstampSale.deployed().then(
        function(instance) {
            sale = instance;
            return QuantstampToken.deployed();
        }).then(
        function(instance2){
            token = instance2;
            return token.INITIAL_SUPPLY();
        });
    });

    it("should not be able to burn tokens when transfers are not enabled", async function() {
        try {
            await token.burn(1);
        }
        catch (e) {
            return true;
        }
        throw new Error("burn was called when transfers were not enabled");
    });

    it("should burn a token from total supply (by regular user)", async function() {
        let burner = user2;

        await token.transferFrom(owner, burner, 1, {from: admin});
        let burnerBalance = await token.balanceOf(burner);
        //assert.equal(burnerBalance);

        // Send a token to the burner
        //await token.transferFrom(owner, burner, 1, {from: admin});
        /*let user2Balance = await token.balanceOf(burner);
        console.log(user2Balance);
        assert.equal(user2Balance, 1);

        // the burner burns the token
        /*let oldUser2Balance = await token.balanceOf(burner);
        await token.burn(1, {from: burner});
        let newUser2Balance = await token.balanceOf(burner);

        assert.equal(oldUser2Balance.minus(newUser2Balance), 1);*/
    });

    // From here, transfers ARE enabled
    it("should burn a token from total supply (by token owner)", async function() {
        await token.enableTransfer();

        let oldOwnerBalance = await token.balanceOf(owner);
        let oldTotalSupply = await token.totalSupply();

        await token.burn(1);

        let newTotalSupply = await token.totalSupply();
        let newOwnerBalance = await token.balanceOf(owner);

        assert.equal(oldTotalSupply.minus(newTotalSupply), 1);
        assert.equal(oldOwnerBalance.minus(newOwnerBalance), 1);
    });
});

contract('QuantstampToken.burn (burn all tokens)', function(accounts) {
       beforeEach(
        function() {
            return QuantstampSale.deployed().then(
        function(instance) {
            sale = instance;
            return QuantstampToken.deployed();
        }).then(
        function(instance2){
            token = instance2;
            return token.INITIAL_SUPPLY();
        });
    });

    // From here, transfers ARE enabled
    it("should burn all tokens", async function() {
        await token.enableTransfer();
        let totalSupply = await token.totalSupply();
        await token.burn(totalSupply); // burn them all! burn!
        let newTotalSupply = await token.totalSupply();
        assert.equal(newTotalSupply, 0);
    });
});
