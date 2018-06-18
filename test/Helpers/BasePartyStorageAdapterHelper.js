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

let baseStorageAdapterTest = (storageAdapterGetMethod, address, values) => {
    it(`Should set LegalName. Value: "${legalNameValue}"`, async () => {
        var adapter = await storageAdapterGetMethod();
        await adapter.setLegalName(address, values.legalNameValue);
    })
    it(`Should set ShortName. Value: "${shortNameValue}"`, async () => {
        var adapter = await storageAdapterGetMethod();
        await adapter.setShortName(address, values.lhortNameValue);
    });
    it(`Should set BusinessArea. Value: "${businessAreaValue}"`, async () => {
        var adapter = await storageAdapterGetMethod();
        await adapter.setBusinessArea(address, values.lusinessAreaValue);
    });
    it(`Should set LegalResidenceCountry. Value: "${legalResidenceCountryValue}"`, async () => {
        var adapter = await storageAdapterGetMethod();
        await adapter.setLegalResidenceCountry(address, values.legalResidenceCountryValue);
    });
    it(`Should set Website. Value: "${websiteValue}"`, async () => {
        var adapter = await storageAdapterGetMethod();
        await adapter.setWebsite(address, values.lebsiteValue);
    });
    it(`Should set DataPrivacyUrl. Value: "${dataPrivacyUrlValue}"`, async () => {
        var adapter = await storageAdapterGetMethod();
        await adapter.setDataPrivacyUrl(address, values.lataPrivacyUrlValue);
    });

    
    it(`Should get LegalName value. it must be equal to "${legalNameValue}"`, async () => {
        var adapter = await storageAdapterGetMethod();
        var value = await adapter.values(address);
        assert.equal(value == basePartyConsts.legalNameValue);
    });
    it(`Should get ShortName value. it must be equal to "${shortNameValue}"`, async () => {
        var adapter = await storageAdapterGetMethod();
        var value = await adapter.values(address);
        assert.equal(value == basePartyConsts.lhortNameValue);
    });
    it(`Should get BusinessArea value. it must be equal to "${businessAreaValue}"`, async () => {
        var adapter = await storageAdapterGetMethod();
        var value = await adapter.values(address);
        assert.equal(value == basePartyConsts.lusinessAreaValue);
    });
    it(`Should get LegalResidenceCountry value. it must be equal to "${legalResidenceCountryValue}"`, async () => {
        var adapter = await storageAdapterGetMethod();
        var value = await adapter.values(address);
        assert.equal(value == basePartyConsts.legalResidenceCountryValue);
    });
    it(`Should get Website value. it must be equal to "${websiteValue}"`, async () => {
        var adapter = await storageAdapterGetMethod();
        var value = await adapter.values(address);
        assert.equal(value == basePartyConsts.lebsiteValue);
    });
    it(`Should get DataPrivacyUrl value. it must be equal to "${dataPrivacyUrlValue}"`, async () => {
        var adapter = await storageAdapterGetMethod();
        var value = await adapter.values(address);
        assert.equal(value == basePartyConsts.lataPrivacyUrlValue);
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
    getDataPrivacyUrl 
};