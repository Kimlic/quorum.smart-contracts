let basePartyConsts = {
    legalNameValue: "legalName",
    shortNameValue: "shortName",
    businessAreaValue: "businessArea",
    legalResidenceCountryValue: "legalResidenceCountry",
    websiteValue: "website",
    dataPrivacyUrlValue: "dataPrivacyUrl"
}

let setLegalName = async (adapter, party, value) => {
    await adapter.setLegalName(party, value);
}

let setShortName = async (adapter, party, value) => {
    await adapter.setShortName(party, value);
}

let setBusinessArea = async (adapter, party, value) => {
    await adapter.setBusinessArea(party, value);
}

let setLegalResidenceCountry = async (adapter, party, value) => {
    await adapter.setLegalResidenceCountry(party, value);
}

let setWebsite = async (adapter, party, value) => {
    await adapter.setWebsite(party, value);
}

let setDataPrivacyUrl = async (adapter, party, value) => {
    await adapter.setDataPrivacyUrl(party, value);
}

let getLegalName = async (adapter, party) => {
    await adapter.getLegalName(party);
}

let getShortName = async (adapter, party) => {
    await adapter.getShortName(party);
}

let getBusinessArea = async (adapter, party) => {
    await adapter.getBusinessArea(party);
}

let getLegalResidenceCountry = async (adapter, party) => {
    await adapter.getLegalResidenceCountry(party);
}

let getWebsite = async (adapter, party) => {
    await adapter.getWebsite(party);
}

let getDataPrivacyUrl = async (adapter, party) => {
    await adapter.getDataPrivacyUrl(party);
}

let baseStorageAdapterTest = (storageAdapterGetMethod, address, values = basePartyConsts) => {
    it(`Should set LegalName. Value: "${values.legalNameValue}"`, async () => {
        let adapter = await storageAdapterGetMethod();
        await adapter.setLegalName(address, values.legalNameValue);
    });
    it(`Should set ShortName. Value: "${values.shortNameValue}"`, async () => {
        let adapter = await storageAdapterGetMethod();
        await adapter.setShortName(address, values.shortNameValue);
    });
    it(`Should set BusinessArea. Value: "${values.businessAreaValue}"`, async () => {
        let adapter = await storageAdapterGetMethod();
        await adapter.setBusinessArea(address, values.businessAreaValue);
    });
    it(`Should set LegalResidenceCountry. Value: "${values.legalResidenceCountryValue}"`, async () => {
        let adapter = await storageAdapterGetMethod();
        await adapter.setLegalResidenceCountry(address, values.legalResidenceCountryValue);
    });
    it(`Should set Website. Value: "${values.websiteValue}"`, async () => {
        let adapter = await storageAdapterGetMethod();
        await adapter.setWebsite(address, values.websiteValue);
    });
    it(`Should set DataPrivacyUrl. Value: "${values.dataPrivacyUrlValue}"`, async () => {
        let adapter = await storageAdapterGetMethod();
        await adapter.setDataPrivacyUrl(address, values.dataPrivacyUrlValue);
    });

    
    it(`Should get LegalName value. it must be equal to "${values.legalNameValue}"`, async () => {
        let adapter = await storageAdapterGetMethod();
        let value = await adapter.getLegalName.call(address);
        assert.equal(value, values.legalNameValue);
    });
    it(`Should get ShortName value. it must be equal to "${values.shortNameValue}"`, async () => {
        let adapter = await storageAdapterGetMethod();
        let value = await adapter.getShortName.call(address);
        assert.equal(value, values.shortNameValue);
    });
    it(`Should get BusinessArea value. it must be equal to "${values.businessAreaValue}"`, async () => {
        let adapter = await storageAdapterGetMethod();
        let value = await adapter.getBusinessArea.call(address);
        assert.equal(value, values.businessAreaValue);
    });
    it(`Should get LegalResidenceCountry value. it must be equal to "${values.legalResidenceCountryValue}"`, async () => {
        let adapter = await storageAdapterGetMethod();
        let value = await adapter.getLegalResidenceCountry.call(address);
        assert.equal(value, values.legalResidenceCountryValue);
    });
    it(`Should get Website value. it must be equal to "${values.websiteValue}"`, async () => {
        let adapter = await storageAdapterGetMethod();
        let value = await adapter.getWebsite.call(address);
        assert.equal(value, values.websiteValue);
    });
    it(`Should get DataPrivacyUrl value. it must be equal to "${values.dataPrivacyUrlValue}"`, async () => {
        let adapter = await storageAdapterGetMethod();
        let value = await adapter.getDataPrivacyUrl.call(address);
        assert.equal(value, values.dataPrivacyUrlValue);
    });
}

module.exports = { 
    basePartyConsts,
    setLegalName,
    setShortName,
    setBusinessArea,
    setLegalResidenceCountry,
    setWebsite,
    setDataPrivacyUrl,
    getLegalName,
    getShortName,
    getBusinessArea,
    getLegalResidenceCountry,
    getWebsite,
    getDataPrivacyUrl,
    baseStorageAdapterTest
};