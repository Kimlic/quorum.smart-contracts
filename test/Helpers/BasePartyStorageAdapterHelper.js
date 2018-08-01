

const { getNetworkDeployedConfig } = require("../../deployedConfigHelper");

const { createAccountAndSet1EthToBalance } = require("../../commonLogic");


const basePartyConsts = {
    legalNameValue: "legalName",
    shortNameValue: "shortName",
    businessAreaValue: "businessArea",
    legalResidenceCountryValue: "legalResidenceCountry",
    websiteValue: "website",
    dataPrivacyUrlValue: "dataPrivacyUrl"
}

const baseStorageAdapterTest = (getStorageAdapter, values, ) => {
    const deployedConfig = getNetworkDeployedConfig(web3.version.network);
    let accountAddress;
    let secondAddress;
    
    it("init account", async () => {
        const account = await createAccountAndSet1EthToBalance(web3, deployedConfig.deployerAddress);
        accountAddress = account.accountAddress;
        const secondAccount = await createAccountAndSet1EthToBalance(web3, deployedConfig.deployerAddress);
        secondAddress = secondAccount.accountAddress;
    }); 

    it(`Should set LegalName. Value: "${values.legalNameValue}"`, async () => {
        const adapter = await getStorageAdapter();
        await adapter.setLegalName(accountAddress, values.legalNameValue);
    });
    it(`Should not set LegalName from other account`, async () => {
        const adapter = await getStorageAdapter();
        try {
            await adapter.setLegalName(accountAddress, values.legalNameValue + "2", { from: secondAddress });
        } catch (error) {
            return;
        }
        assert.fail();
    });

    it(`Should set ShortName. Value: "${values.shortNameValue}"`, async () => {
        const adapter = await getStorageAdapter();
        await adapter.setShortName(accountAddress, values.shortNameValue);
    });
    it(`Should not set ShortName from other account`, async () => {
        const adapter = await getStorageAdapter();
        try {
            await adapter.setShortName(accountAddress, values.shortNameValue + "2", { from: secondAddress });
        } catch (error) {
            return;
        }
        assert.fail();
    });

    it(`Should set BusinessArea. Value: "${values.businessAreaValue}"`, async () => {
        const adapter = await getStorageAdapter();
        await adapter.setBusinessArea(accountAddress, values.businessAreaValue);
    });
    it(`Should not set BusinessArea from other accountusinessAreaValue}"`, async () => {
        const adapter = await getStorageAdapter();
        try {
            await adapter.setBusinessArea(accountAddress, values.businessAreaValue + "2", { from: secondAddress });
        } catch (error) {
            return;
        }
        assert.fail();
    });

    it(`Should set LegalResidenceCountry. Value: "${values.legalResidenceCountryValue}"`, async () => {
        const adapter = await getStorageAdapter();
        await adapter.setLegalResidenceCountry(accountAddress, values.legalResidenceCountryValue);
    });
    it(`Should not set LegalResidenceCountry from other accountegalResidenceCountryValue}"`, async () => {
        const adapter = await getStorageAdapter();
        try {
            await adapter.setLegalResidenceCountry(accountAddress, values.legalResidenceCountryValue + "2", { from: secondAddress });
        } catch (error) {
            return;
        }
        assert.fail();
    });

    it(`Should set Website. Value: "${values.websiteValue}"`, async () => {
        const adapter = await getStorageAdapter();
        await adapter.setWebsite(accountAddress, values.websiteValue);
    });
    it(`Should not set Website from other account`, async () => {
        const adapter = await getStorageAdapter();
        try {
            await adapter.setWebsite(accountAddress, values.websiteValue + "2", { from: secondAddress });
        } catch (error) {
            return;
        }
        assert.fail();
    });

    it(`Should set DataPrivacyUrl. Value: "${values.dataPrivacyUrlValue}"`, async () => {
        const adapter = await getStorageAdapter();
        await adapter.setDataPrivacyUrl(accountAddress, values.dataPrivacyUrlValue);
    });
    it(`Should not set DataPrivacyUrl from other account`, async () => {
        const adapter = await getStorageAdapter();
        try {
            await adapter.setDataPrivacyUrl(accountAddress, values.dataPrivacyUrlValue + "2", { from: secondAddress });
        } catch (error) {
            return;
        }
        assert.fail();
    });

    
    it(`Should get LegalName value. it must be equal to "${values.legalNameValue}"`, async () => {
        const adapter = await getStorageAdapter();
        const value = await adapter.getLegalName.call(accountAddress);
        assert.equal(value, values.legalNameValue);
    });
    it(`Should get ShortName value. it must be equal to "${values.shortNameValue}"`, async () => {
        const adapter = await getStorageAdapter();
        const value = await adapter.getShortName.call(accountAddress);
        assert.equal(value, values.shortNameValue);
    });
    it(`Should get BusinessArea value. it must be equal to "${values.businessAreaValue}"`, async () => {
        const adapter = await getStorageAdapter();
        const value = await adapter.getBusinessArea.call(accountAddress);
        assert.equal(value, values.businessAreaValue);
    });
    it(`Should get LegalResidenceCountry value. it must be equal to "${values.legalResidenceCountryValue}"`, async () => {
        const adapter = await getStorageAdapter();
        const value = await adapter.getLegalResidenceCountry.call(accountAddress);
        assert.equal(value, values.legalResidenceCountryValue);
    });
    it(`Should get Website value. it must be equal to "${values.websiteValue}"`, async () => {
        const adapter = await getStorageAdapter();
        const value = await adapter.getWebsite.call(accountAddress);
        assert.equal(value, values.websiteValue);
    });
    it(`Should get DataPrivacyUrl value. it must be equal to "${values.dataPrivacyUrlValue}"`, async () => {
        const adapter = await getStorageAdapter();
        const value = await adapter.getDataPrivacyUrl.call(accountAddress);
        assert.equal(value, values.dataPrivacyUrlValue);
    });
}

module.exports = { 
    basePartyConsts,
    baseStorageAdapterTest
};