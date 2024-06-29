const commonFunction = require("../util/commonFunctions");

const buildBusinessJSON = {};

buildBusinessJSON.businessPartnerTypes = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "code" : data.code
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildBusinessJSON.commercialTerms = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildBusinessJSON.commissionTerms = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildBusinessJSON.businessVerticals = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '',
            "isExist" :  data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildBusinessJSON.businessVerticalGroups = function(datas)
{
    let resultJSON = [];
    let businessVerticalJSON = [];

    datas.forEach((data) => 
    { 
        businessVerticalJSON = [];

        businessVerticalJSON = {
            "id" : data.businessVerticalId,
            "name" : data.businessVerticalName
        }
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '',
            "businessVertical" : businessVerticalJSON,
            "isExist" :  data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildBusinessJSON.businessVerticalTypes = function(datas)
{
    let resultJSON = [];
    let businessVerticalJSON = [];
    let businessVerticalGroupJSON = [];

    datas.forEach((data) => 
    { 
        businessVerticalJSON = [];
        businessVerticalGroupJSON = [];

        businessVerticalJSON = {
            "id" : data.businessVerticalId,
            "name" : data.businessVerticalName
        }
        businessVerticalGroupJSON = {
            "id" : data.businessVerticalGroupId,
            "name" : data.businessVerticalGroupName
        }
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '',
            "businessVertical" : businessVerticalJSON,
            "businessVerticalGroup" : businessVerticalGroupJSON,
            "isExist" :  data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildBusinessJSON.coaches = function(datas)
{
    let resultJSON = [];
    let businessVerticalJSON = [];
    let businessVerticalGroupJSON = [];
    let businessVerticalTypeJSON = [];

    datas.forEach((data) => 
    { 
        businessVerticalJSON = [];
        businessVerticalGroupJSON = [];
        businessVerticalTypeJSON = [];

        businessVerticalJSON = {
            "id" : data.businessVerticalId,
            "name" : data.businessVerticalName
        }
        businessVerticalGroupJSON = {
            "id" : data.businessVerticalGroupId,
            "name" : data.businessVerticalGroupName
        }
        businessVerticalTypeJSON = {
            "id" : data.businessVerticalTypeId,
            "name" : data.businessVerticalTypeName
        }
/////Final JSON
        let finalJSON = {
            "uuid" : data.uuid,
            "code" : data.code,
            "name" : data.name,
            "email" : data.email,
            "mobile" : data.mobile,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '',
            "businessVertical" : businessVerticalJSON,
            "businessVerticalGroup" : businessVerticalGroupJSON,
            "businessVerticalType" : businessVerticalTypeJSON,
            "isExist" :  data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildBusinessJSON.academyEnclosureDocuments = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isCompulsory" : data.isCompulsory,
            "isActive" : data.isActive,
            "tableName" : data.tableName,
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildBusinessJSON.countries = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "tableName" : data.tableName
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildBusinessJSON.stateRegions = function(datas)
{
    let resultJSON = [];
    let countryJSON = [];

    datas.forEach((data) => 
    { 
        countryJSON = [];

        countryJSON = {
            "id" : data.countrytId,
            "name" : data.countryName
        }

/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "country" : countryJSON,
            "tableName" : data.tableName
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildBusinessJSON.districts = function(datas)
{
    let resultJSON = [];
    let countryJSON = [];
    let stateRegionJSON = [];

    datas.forEach((data) => 
    { 
        countryJSON = [];
        stateRegionJSON = [];

        countryJSON = {
            "id" : data.countrytId,
            "name" : data.countryName
        }

        stateRegionJSON = {
            "id" : data.stateRegionId,
            "name" : data.stateRegionName
        }

/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "country" : countryJSON,
            "stateRegion" : stateRegionJSON,
            "tableName" : data.tableName
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildBusinessJSON.cities = function(datas)
{
    let resultJSON = [];
    let countryJSON = [];
    let stateRegionJSON = [];
    let districtJSON = [];

    datas.forEach((data) => 
    { 
        countryJSON = [];
        stateRegionJSON = [];
        districtJSON = [];

        countryJSON = {
            "id" : data.countrytId,
            "name" : data.countryName
        }

        stateRegionJSON = {
            "id" : data.stateRegionId,
            "name" : data.stateRegionName
        }

        districtJSON = {
            "id" : data.districtId,
            "name" : data.districtName
        }

/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "country" : countryJSON,
            "stateRegion" : stateRegionJSON,
            "district" : districtJSON,
            "tableName" : data.tableName
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildBusinessJSON.businessPartners = function(datas)
{
    let resultJSON = [];
    let businessPartnerTypeJSON = [];
    let businessVerticalJSON = [];

    datas.forEach((data) => 
    { 
        businessPartnerTypeJSON = [];
        businessVerticalJSON = [];

        businessPartnerTypeJSON = {
            "id" : data.businessPartnerTypeId,
            "name" : data.businessPartnerTypeName
        }
        businessVerticalJSON = {
            "id" : data.businessVerticalId,
            "name" : data.businessVerticalName
        }
/////Final JSON
        let finalJSON = {
            "uuid" : data.uuid,
            "code" : data.code,
            "name" : data.name,
            "email" : data.email,
            "pincode" : data.pincode,
            "contactPerson" : data.contactPerson,
            "contactEmail" : data.contactEmail,
            "contactMobile" : data.contactMobile,
            "inchargePerson" : data.inchargePerson,
            "inchargeEmail" : data.inchargeEmail,
            "inchargeMobile" : data.inchargeMobile,
            "applicableFrom" : commonFunction.getFormattedDate(data.applicableFrom, 'yyyy-mm-dd'),
            "applicableTo" : commonFunction.getFormattedDate(data.applicableTo, 'yyyy-mm-dd'),
            "isHavingApplicable" : data.isHavingApplicable,
            "rewardApplicable" : data.rewardApplicable,
            "panNumber" : data.panNumber,
            "gstNumber" : data.gstNumber,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '',
            "businessPartnerType" : businessPartnerTypeJSON,
            "isExist" :  data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildBusinessJSON.businessPartner = function(datas)
{
    let resultJSON = [];
    let businessPartnerTypeJSON = [];
    let businessVerticalJSON = [];
    let countryJSON = [];
    let stateRegionJSON = [];
    let districtJSON = [];
    let cityJSON = [];
    let commissionTermJSON = [];
    let commercialTermJSON = [];

    datas.forEach((data) => 
    { 
        businessPartnerTypeJSON = [];
        businessVerticalJSON = [];
        countryJSON = [];
        stateRegionJSON = [];
        districtJSON = [];
        cityJSON = [];
        commissionTermJSON = [];
        commercialTermJSON = [];

        businessPartnerTypeJSON = {
            "id" : data.businessPartnerTypeId,
            "name" : data.businessPartnerTypeName
        }
        businessVerticalJSON = {
            "id" : data.businessVerticalId,
            "name" : data.businessVerticalName
        }
        countryJSON = {
            "id" : data.countryId,
            "name" : data.countryName
        }
        stateRegionJSON = {
            "id" : data.stateRegionId,
            "name" : data.stateRegionName
        }
        districtJSON = {
            "id" : data.districtId,
            "name" : data.districtName
        }
        cityJSON = {
            "id" : data.cityId,
            "name" : data.cityName
        }
        commissionTermJSON = {
            "id" : data.commissionTermId == null ? '' : data.commissionTermId,
            "name" : data.commissionTermName == null ? '' : data.commissionTermName
        }
        commercialTermJSON = {
            "id" : data.commercialTermId == null ? '' : data.commercialTermId,
            "name" : data.commercialTermName == null ? '' : data.commercialTermName
        }
/////Final JSON
        let finalJSON = {
            "uuid" : data.uuid,
            "code" : data.code,
            "name" : data.name,
            "email" : data.email,
            "pincode" : data.pincode,
            "contactPerson" : data.contactPerson,
            "contactEmail" : data.contactEmail,
            "contactMobile" : data.contactMobile,
            "inchargePerson" : data.inchargePerson,
            "inchargeEmail" : data.inchargeEmail,
            "inchargeMobile" : data.inchargeMobile,
            "applicableFrom" : commonFunction.getFormattedDate(data.applicableFrom, 'yyyy-mm-dd'),
            "applicableTo" : commonFunction.getFormattedDate(data.applicableTo, 'yyyy-mm-dd'),
            "isHavingApplicable" : data.isHavingApplicable,
            "rewardApplicable" : data.rewardApplicable,
            "panNumber" : data.panNumber,
            "gstNumber" : data.gstNumber,
            "isActive" : data.isActive,
            "businessPartnerType" : businessPartnerTypeJSON,
            "businessVertical" : businessVerticalJSON,
            "businessVerticalType" : JSON.parse(data.businessVerticalTypes),
            "country" : countryJSON,
            "stateRegion" : stateRegionJSON,
            "district" : districtJSON,
            "city" : cityJSON,
            "commissionTerm" : commissionTermJSON,
            "commercialTerm" : commercialTermJSON
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildBusinessJSON.businessPartnerContractHistories = function(datas)
{
    let resultJSON = [];
    
    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "contractFrom" : commonFunction.getFormattedDate(data.contractFrom, "yyyy-mm-dd"),
            "contractTo" : commonFunction.getFormattedDate(data.contractTo, "yyyy-mm-dd"),
            "isActive" : data.isActive
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

module.exports = buildBusinessJSON;