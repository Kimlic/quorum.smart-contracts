
const { createAccountAndSet1EthToBalance } = require("./AccountHelper.js");


const basePartyConsts = {
    legalNameValue: "legalName",
    shortNameValue: "shortName",
    businessAreaValue: "businessArea",
    legalResidenceCountryValue: "legalResidenceCountry",
    websiteValue: "website",
    dataPrivacyUrlValue: "dataPrivacyUrl"
}

const baseStorageAdapterTest = (storageAdapterGetMethod, values) => {
    let accountAddress;
    
    it("init account", async () => {
        const account = await createAccountAndSet1EthToBalance(web3);
        accountAddress = account.accountAddress;
    }); 

    it(`Should set LegalName. Value: "${values.legalNameValue}"`, async () => {
        const adapter = await storageAdapterGetMethod();
        await adapter.setLegalName(accountAddress, values.legalNameValue);
    });
    it(`Should set ShortName. Value: "${values.shortNameValue}"`, async () => {
        const adapter = await storageAdapterGetMethod();
        await adapter.setShortName(accountAddress, values.shortNameValue);
    });
    it(`Should set BusinessArea. Value: "${values.businessAreaValue}"`, async () => {
        const adapter = await storageAdapterGetMethod();
        await adapter.setBusinessArea(accountAddress, values.businessAreaValue);
    });
    it(`Should set LegalResidenceCountry. Value: "${values.legalResidenceCountryValue}"`, async () => {
        const adapter = await storageAdapterGetMethod();
        await adapter.setLegalResidenceCountry(accountAddress, values.legalResidenceCountryValue);
    });
    it(`Should set Website. Value: "${values.websiteValue}"`, async () => {
        const adapter = await storageAdapterGetMethod();
        await adapter.setWebsite(accountAddress, values.websiteValue);
    });
    it(`Should set DataPrivacyUrl. Value: "${values.dataPrivacyUrlValue}"`, async () => {
        const adapter = await storageAdapterGetMethod();
        await adapter.setDataPrivacyUrl(accountAddress, values.dataPrivacyUrlValue);
    });

    
    it(`Should get LegalName value. it must be equal to "${values.legalNameValue}"`, async () => {
        const adapter = await storageAdapterGetMethod();
        const value = await adapter.getLegalName.call(accountAddress);
        assert.equal(value, values.legalNameValue);
    });
    it(`Should get ShortName value. it must be equal to "${values.shortNameValue}"`, async () => {
        const adapter = await storageAdapterGetMethod();
        const value = await adapter.getShortName.call(accountAddress);
        assert.equal(value, values.shortNameValue);
    });
    it(`Should get BusinessArea value. it must be equal to "${values.businessAreaValue}"`, async () => {
        const adapter = await storageAdapterGetMethod();
        const value = await adapter.getBusinessArea.call(accountAddress);
        assert.equal(value, values.businessAreaValue);
    });
    it(`Should get LegalResidenceCountry value. it must be equal to "${values.legalResidenceCountryValue}"`, async () => {
        const adapter = await storageAdapterGetMethod();
        const value = await adapter.getLegalResidenceCountry.call(accountAddress);
        assert.equal(value, values.legalResidenceCountryValue);
    });
    it(`Should get Website value. it must be equal to "${values.websiteValue}"`, async () => {
        const adapter = await storageAdapterGetMethod();
        const value = await adapter.getWebsite.call(accountAddress);
        assert.equal(value, values.websiteValue);
    });
    it(`Should get DataPrivacyUrl value. it must be equal to "${values.dataPrivacyUrlValue}"`, async () => {
        const adapter = await storageAdapterGetMethod();
        const value = await adapter.getDataPrivacyUrl.call(accountAddress);
        assert.equal(value, values.dataPrivacyUrlValue);
    });
}

module.exports = { 
    basePartyConsts,
    baseStorageAdapterTest
};