const commonFunction = require("../util/commonFunctions");

const buildBusinessJSON = {};

buildBusinessJSON.businessPartnerTypes = function(datas, action = 1)
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
        if(action == 1)
        {
            resultJSON.push(finalJSON);
        }
        else
        {
            resultJSON = finalJSON;
        }
    });

    return resultJSON;
}

buildBusinessJSON.deliveryModes = function(datas, action = 1)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name
        }
        if(action == 1)
        {
            resultJSON.push(finalJSON);
        }
        else
        {
            resultJSON = finalJSON;
        }
    });

    return resultJSON;
}

buildBusinessJSON.studyCenterTypes = function(datas, action = 1)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name
        }
        if(action == 1)
        {
            resultJSON.push(finalJSON);
        }
        else
        {
            resultJSON = finalJSON;
        }
    });

    return resultJSON;
}

buildBusinessJSON.studyCenterRewardTypes = function(datas)
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

buildBusinessJSON.coaches = function(datas, action = 1)
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
            "id" : data.id,
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
        if(action == 1)
        {
            resultJSON.push(finalJSON);
        }
        else
        {
            resultJSON = finalJSON;
        }
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
            "tableName" : data.tableName,
            "isExist" : data.isExist
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
            "id" : data.countryId,
            "name" : data.countryName
        }

/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "country" : countryJSON,
            "tableName" : data.tableName,
            "isExist" : data.isExist
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
            "id" : data.countryId,
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
            "tableName" : data.tableName,
            "isExist" : data.isExist
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

/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "country" : countryJSON,
            "stateRegion" : stateRegionJSON,
            "district" : districtJSON,
            "tableName" : data.tableName,
            "isExist" : data.isExist
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
            "name" : data.businessPartnerTypeName,
            "code" : data.businessPartnerTypeCode
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
            "inchargePerson" : data.inchargePerson != null ? data.inchargePerson : "",
            "inchargeEmail" : data.inchargeEmail != null ? data.inchargeEmail : "",
            "inchargeMobile" : data.inchargeMobile != null ? data.inchargeMobile : "",
            "applicableFrom" : commonFunction.getFormattedDate(data.applicableFrom, 'yyyy-mm-dd'),
            "applicableTo" : commonFunction.getFormattedDate(data.applicableTo, 'yyyy-mm-dd'),
            "isHavingContract" : data.isHavingContract != null ? data.isHavingContract : "",
            "rewardApplicable" : data.rewardApplicable != null ? data.rewardApplicable : "",
            "panNumber" : data.panNumber != null ? data.panNumber : "",
            "gstNumber" : data.gstNumber != null ? data.gstNumber : "",
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
    let contractJSON= [];

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
        contractJSON = [];

        businessPartnerTypeJSON = {
            "id" : data.businessPartnerTypeId,
            "name" : data.businessPartnerTypeName,
            "code" : data.businessPartnerTypeCode
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
        if(data.businessPartnerTypeCode == 'B2C')
        {
            if(data.contractId != null)
            {
                contractJSON = {
                    "id" : data.contractId,
                    "contractFrom" : commonFunction.getFormattedDate(data.contractFrom, "yyyy-mm-dd"),
                    "contractTo" : commonFunction.getFormattedDate(data.contractTo, "yyyy-mm-dd")
                }
            }
        }
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "uuid" : data.uuid,
            "code" : data.code,
            "name" : data.name,
            "email" : data.email,
            "address" : data.address,
            "pincode" : data.pincode,
            "contactPerson" : data.contactPerson,
            "contactEmail" : data.contactEmail,
            "contactMobile" : data.contactMobile,
            "inchargePerson" : data.inchargePerson != null ? data.inchargePerson : "",
            "inchargeEmail" : data.inchargeEmail != null ? data.inchargeEmail : "",
            "inchargeMobile" : data.inchargeMobile != null ? data.inchargeMobile : "",
            "applicableFrom" : commonFunction.getFormattedDate(data.applicableFrom, 'yyyy-mm-dd'),
            "applicableTo" : commonFunction.getFormattedDate(data.applicableTo, 'yyyy-mm-dd'),
            "isHavingContract" : data.isHavingContract != null ? data.isHavingContract : "",
            "rewardApplicable" : data.rewardApplicable != null ? data.rewardApplicable : "",
            "panNumber" : data.panNumber != null ? data.panNumber : "",
            "gstNumber" : data.gstNumber != null ? data.gstNumber : "",
            "isActive" : data.isActive,
            "businessPartnerType" : businessPartnerTypeJSON,
            "businessVertical" : businessVerticalJSON,
            "businessVerticalTypes" : JSON.parse(data.businessVerticalTypes),
            "country" : countryJSON,
            "stateRegion" : stateRegionJSON,
            "district" : districtJSON,
            "city" : cityJSON,
            "commissionTerm" : commissionTermJSON,
            "commercialTerm" : commercialTermJSON,
            "contract" : contractJSON,
            "isExist" : data.isExist
        }
        resultJSON = finalJSON;
    });

    return resultJSON;
}

buildBusinessJSON.businessPartnerDocuments = function(datas)
{
    let resultJSON = [];
    let enclosureDocumentJSON = [];
    
    datas.forEach((data) => 
    { 
        enclosureDocumentJSON = [];

        enclosureDocumentJSON = {
            "id" : data.documentId,
            "name" : data.documentName
        }

/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "enclosureDocument" : enclosureDocumentJSON,
            "fileName" : data.fileName,
            "uploadedOn" : commonFunction.getFormattedDate(data.uploadedOn, "yyyy-mm-dd")
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
            "isActive" : data.isActive,
            "tableName" : data.tableName
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildBusinessJSON.businessPartnerCoaches = function(datas, action = 1)
{
    let resultJSON = [];
    let coachJSON = [];
    let businessVerticalTypeJSON = [];

    datas.forEach((data) => 
    { 
        coachJSON = [];
        businessVerticalTypeJSON = [];

        coachJSON = {
            "uuid" : data.coachUUID,
            "name" : data.coachName,
            "email" : data.coachEmail,
            "mobile" : data.coachMobile,
            "isActive" : data.coachIsActive
        }

        businessVerticalTypeJSON = {
            "id" : data.businessVerticalTypeId,
            "name" : data.businessVerticalTypeName
        }
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '',
            "coach" : coachJSON,
            "businessVerticalType" : businessVerticalTypeJSON

        }
        if(action == 1)
        {
            resultJSON.push(finalJSON);
        }
        else
        {
            resultJSON = finalJSON;
        }
    });

    return resultJSON;
}

buildBusinessJSON.tieUpSchools = function(datas, action = 1)
{
    let resultJSON = [];
    let syllabusJSON = [];
    let countryJSON = [];
    let contractJSON = [];
    let stateRegionJSON = [];
    let districtJSON = [];
    let cityJSON = [];

    datas.forEach((data) => 
    { 
        syllabusJSON = [];
        countryJSON = [];
        stateRegionJSON = [];
        districtJSON = [];
        cityJSON = [];
        contractJSON = [];

        syllabusJSON = {
            "id" : data.syllabusId,
            "name" : data.syllabusName
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
        if(action == 0)
        {
            contractJSON = {
                "id" : data.contractId != null ? data.contractId : "",
                "contractFrom" : commonFunction.getFormattedDate(data.contractFrom, "yyyy-mm-dd"),
                "contractTo" : commonFunction.getFormattedDate(data.contractTo, "yyyy-mm-dd"),
            }
        }
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "uuid" : data.uuid,
            "name" : data.name,
            "email" : data.email,
            "mobile" : data.mobile,
            "website" : data.website,
            "address" : data.address,
            "pincode" : data.pincode,
            "contactPerson" : data.contactPerson,
            "panNumber" : data.panNumber,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '',
            "syllabus" : syllabusJSON,
            "country" : countryJSON,
            "stateRegion" : stateRegionJSON,
            "district" : districtJSON,
            "city" : cityJSON,
            "contract" : contractJSON,
            "isExist" : data.isExist
        }
        if(action == 1)
        {
            resultJSON.push(finalJSON);
        }
        else
        {
            resultJSON = finalJSON;
        }
    });

    return resultJSON;
}

buildBusinessJSON.tieUpSchoolSyllabuses = function(datas, action = 1)
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
        if(action == 1)
        {
            resultJSON.push(finalJSON);
        }
        else
        {
            resultJSON = finalJSON;
        }
    });

    return resultJSON;
}

buildBusinessJSON.tieUpSchoolDocuments = function(datas)
{
    let resultJSON = [];
    let enclosureDocumentJSON = [];
    
    datas.forEach((data) => 
    { 
        enclosureDocumentJSON = [];

        enclosureDocumentJSON = {
            "id" : data.documentId,
            "name" : data.documentName
        }

/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "enclosureDocument" : enclosureDocumentJSON,
            "fileName" : data.fileName,
            "uploadedOn" : commonFunction.getFormattedDate(data.uploadedOn, "yyyy-mm-dd")
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildBusinessJSON.tieUpSchoolContractHistories = function(datas)
{
    let resultJSON = [];
    
    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "contractFrom" : commonFunction.getFormattedDate(data.contractFrom, "yyyy-mm-dd"),
            "contractTo" : commonFunction.getFormattedDate(data.contractTo, "yyyy-mm-dd"),
            "isActive" : data.isActive,
            "tableName" : data.tableName
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildBusinessJSON.studyCenters = function(datas, action = 1)
{
    let resultJSON = [];
    let studyCenterTypeJSON = [];
    let businessPartnerJSON = [];
    let rewardTypeJSON = [];
    let countryJSON = [];
    let stateRegionJSON = [];
    let districtJSON = [];
    let cityJSON = [];
    let agreementJSON = [];

    datas.forEach((data) => 
    { 
        studyCenterTypeJSON = [];
        businessPartnerJSON = [];
        rewardTypeJSON = [];
        countryJSON = [];
        stateRegionJSON = [];
        districtJSON = [];
        cityJSON = [];
        agreementJSON = [];

        studyCenterTypeJSON = {
            "id" : data.studyCenterTypeId,
            "name" : data.studyCenterTypeName
        }
        rewardTypeJSON = {
            "id" : data.rewardTypeId != null ? data.rewardTypeId : "",
            "name" : data.rewardTypeName != null ? data.rewardTypeName : ""
        }
        businessPartnerJSON = {
            "uuid" : data.businessPartnerUUID != null ? data.businessPartnerUUID : "",
            "name" : data.businessPartnerName != null ? data.businessPartnerName : ""
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
        if(action == 0)
        {
            agreementJSON = {
                "id" : data.agreementId != null ? data.agreementId : "",
                "agreementFrom" : commonFunction.getFormattedDate(data.agreementFrom, "yyyy-mm-dd"),
                "agreementTo" : commonFunction.getFormattedDate(data.agreementTo, "yyyy-mm-dd"),
            }
        }
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "uuid" : data.uuid,
            "name" : data.name,
            "code" : data.code,
            "email" : data.email,
            "mobile" : data.mobile,
            "studyCenterType" : studyCenterTypeJSON,
            "address" : data.address,
            "pincode" : data.pincode,
            "contactPersonName" : data.contactPersonName != null ? data.contactPersonName : "",
            "contactPersonEmail" : data.contactPersonEmail != null ? data.contactPersonEmail : "",
            "contactPersonMobile" : data.contactPersonMobile != null ? data.contactPersonMobile : "",
            "landlordName" : data.landlordName != null ? data.landlordName : "",
            "panNumber" : data.panNumber != null ? data.panNumber : "",
            "gstNumber" : data.gstNumber != null ? data.gstNumber : "",
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '',
            "businessPartner" : businessPartnerJSON,
            "country" : countryJSON,
            "stateRegion" : stateRegionJSON,
            "district" : districtJSON,
            "city" : cityJSON,
            "rewardType" : rewardTypeJSON,
            "agreement" : agreementJSON,
            "isExist" : data.isExist
        }
        if(action == 1)
        {
            resultJSON.push(finalJSON);
        }
        else
        {
            resultJSON = finalJSON;
        }
    });

    return resultJSON;
}

buildBusinessJSON.studyCenterDocuments = function(datas)
{
    let resultJSON = [];
    let enclosureDocumentJSON = [];
    
    datas.forEach((data) => 
    { 
        enclosureDocumentJSON = [];

        enclosureDocumentJSON = {
            "id" : data.documentId,
            "name" : data.documentName
        }

/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "enclosureDocument" : enclosureDocumentJSON,
            "fileName" : data.fileName,
            "uploadedOn" : commonFunction.getFormattedDate(data.uploadedOn, "yyyy-mm-dd")
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildBusinessJSON.studyCenterAgreementHistories = function(datas)
{
    let resultJSON = [];
    
    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "agreementFrom" : commonFunction.getFormattedDate(data.agreementFrom, "yyyy-mm-dd"),
            "agreementTo" : commonFunction.getFormattedDate(data.agreementTo, "yyyy-mm-dd"),
            "isActive" : data.isActive,
            "tableName" : data.tableName
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildBusinessJSON.schools = function(datas, action = 1)
{
    let resultJSON = [];
    let schoolingGroupJSON = [];
    let schoolSubGroupJSON = [];
    let schoolingCategoryJSON = [];
    let countryJSON = [];
    let stateRegionJSON = [];
    let districtJSON = [];
    let cityJSON = [];
    let deliveryModeJSON = [];

    datas.forEach((data) => 
    { 
        schoolingGroupJSON = [];
        schoolSubGroupJSON = [];
        schoolingCategoryJSON = [];
        countryJSON = [];
        stateRegionJSON = [];
        districtJSON = [];
        cityJSON = [];
        deliveryModeJSON = [];

        schoolingGroupJSON = {
            "id" : data.schoolingGroupId,
            "name" : data.schoolingGroupName
        }
        schoolSubGroupJSON = {
            "id" : data.schoolSubGroupId,
            "name" : data.schoolSubGroupName
        }
        schoolingCategoryJSON = {
            "id" : data.schoolingCategoryId,
            "name" : data.schoolingCategoryName
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
        deliveryModeJSON = {
            "id" : data.deliveryModeId,
            "name" : data.deliveryModeName
        }
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "uuid" : data.uuid,
            "name" : data.name,
            "code" : data.code,
            "email" : data.email,
            "website" : data.website,
            "mobile1" : data.mobile1,
            "mobile2" : data.mobile2,
            "landline1" : data.landline1,
            "landline2" : data.landline2,
            "address" : data.address,
            "pincode" : data.pincode,
            "schoolingGroup" : schoolingGroupJSON,
            "schoolSubGroup" : schoolSubGroupJSON,
            "schoolingCategory" : schoolingCategoryJSON,
            "country" : countryJSON,
            "stateRegion" : stateRegionJSON,
            "district" : districtJSON,
            "city" : cityJSON,
            "deliveryMode" : deliveryModeJSON,
            "contractFrom" : commonFunction.getFormattedDate(data.contractFrom, "yyyy-mm-dd"),
            "contractTo" : commonFunction.getFormattedDate(data.contractTo, "yyyy-mm-dd"),
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '',
            "isExistDetail" : data.isExistDetail,
            "isExist" : data.isExist,
            "schoolingProgramIds" : data.schoolingProgramIds || ""
        }
        if(action == 1)
        {
            resultJSON.push(finalJSON);
        }
        else
        {
            resultJSON = finalJSON;
        }
    });

    return resultJSON;
}

buildBusinessJSON.schoolSchoolingPrograms = function(datas, action = 1)
{
    let resultJSON = [];
    let schoolingProgramJSON = [];
    
    datas.forEach((data) => 
    { 
        schoolingProgramJSON = [];

        schoolingProgramJSON = {
            "id" : data.schoolingProgramId,
            "name" : data.schoolingProgramName
        }
        
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "schoolingProgram" : schoolingProgramJSON,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '',
            "isExist" : data.isExist
        }
        if(action == 1)
        {
            resultJSON.push(finalJSON);
        }
        else
        {
            resultJSON = finalJSON;
        }
    });

    return resultJSON;
}

buildBusinessJSON.schoolSchoolingProgramValidities = function(datas)
{
    let resultJSON = [];
    let academicSessionJSON = [];
    let schoolingProgramJSON = [];
    let batchTypeJSON = [];
    
    datas.forEach((data) => 
    { 
        academicSessionJSON = [];
        batchTypeJSON = [];

        academicSessionJSON = {
            "id" : data.academicSessionId,
            "year" : data.academicSessionYear
        }

        let batchTypeIdArray = data.batchTypeIds.toString().split(",");
        let batchTypeNameArray = data.batchTypeNames.toString().split(",");
        let batchTypeStartTimeArray = data.batchTypeStartTimes.toString().split(",");
        let batchTypeEndTimeArray = data.batchTypeEndTimes.toString().split(",");
        for(let i=0;i<batchTypeIdArray.length;i++)
        {
            batchTypeJSON.push({
                "id" : batchTypeIdArray[i],
                "name" : batchTypeNameArray[i],
                "startTime" : batchTypeStartTimeArray[i],
                "endTime" : batchTypeEndTimeArray[i]
            })
        }

/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "startDate" : commonFunction.getFormattedDate(data.startDate, "yyyy-mm-dd"),
            "endDate" : commonFunction.getFormattedDate(data.endDate, "yyyy-mm-dd"),
            "admissionStartDate" : commonFunction.getFormattedDate(data.admissionStartDate, "yyyy-mm-dd"),
            "admissionEndDate" : commonFunction.getFormattedDate(data.admissionEndDate, "yyyy-mm-dd"),
            "academicSession" : academicSessionJSON,
            "batchTypes" : batchTypeJSON,
            "isActive" : data.isActive,
            "tableName" : data.tableName,
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildBusinessJSON.schoolSchoolingProgramBatches = function(datas)
{
    let resultJSON = [];
    
    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.batchTypeId,
            "name" : data.batchTypeName,
            "startTime" : data.batchTypeStartTime,
            "endTime" : data.batchTypeEndTime
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

module.exports = buildBusinessJSON;