let dbConn = require('../util/dbConnection');
const commonFunction = require('../util/commonFunctions');
const { resolve } = require('path');
const { error } = require('console');
const { promises } = require('dns');
const { console } = require('inspector');
let db = {};

db.getPaymentMethods = () =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name 
            FROM admission_payment_method apm`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getPaymentMethod = (id) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name 
            FROM admission_payment_method apm 
            WHERE id = ${id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

    
db.getApplicationTypes = () =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name 
            FROM admission_application_type aat`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getApplicationType = (id) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name 
            FROM admission_application_type aat 
            WHERE id=${id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getApplicationFormStatuses = () =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name 
            FROM admission_application_form_status aafs`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getApplicationFormStatus = (name, id) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name 
            FROM admission_application_form_status aafs`;
            if(name != "")
            {
                sql = sql + ` WHERE name = '${name}'`;
            }
            else if(id != "")
            {
                sql = sql + ` WHERE id = ${id}`;
            }
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getGenders = () =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name 
            FROM admission_gender ag`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getGender = (id) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name 
            FROM admission_gender ag 
            WHERE id=${id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getLeadStudentTypes = () =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name 
            FROM admission_lead_student_type alst`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getLeadStudentType = (id) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name 
            FROM admission_lead_student_type alst 
            WHERE id=${id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getMarketLeadTypes = () =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name 
            FROM admission_market_lead_type amlt`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getMarketLeadType = (id) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name 
            FROM admission_market_lead_type amlt 
            WHERE id = ${id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getWalkInModes = () =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name 
            FROM admission_walkin_mode awim`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getWalkInMode = (id) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name 
            FROM admission_walkin_mode awim 
            WHERE id = ${id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getSiblingTypes = () =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name 
            FROM admission_sibling_type ast`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getSiblingType = (id) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name 
            FROM admission_sibling_type ast 
            WHERE id=${id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getStudentProfileCompletions = () =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name 
            FROM admission_student_profile_completion aspc`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getStudentProfileCompletion = (id) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name 
            FROM admission_student_profile_completion aspc 
            WHERE id = ${id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getParentUndertakings = (profileCompletionId) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name 
            FROM admission_parent_undertaking aput 
            WHERE student_profile_completion_id = ${profileCompletionId}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getParentUndertaking = (profileCompletionId, id) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name 
            FROM admission_parent_undertaking aput 
            WHERE student_profile_completion_id = ${profileCompletionId} AND id = ${id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getApplicationStudents = (academicSessionId) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT aaf.id, aaf.uuid, aaf.application_number AS applicationNumber, aaf.enrollment_number AS enrollmentNumber, aaf.admission_date AS admissionDate, aaf.student_name AS studentName, ap.id AS parentId, ap.name AS parentName, ap.mobile AS parentMobile, ap.email AS parentEmail, gd.id AS gradeId, gd.name AS gradeName,
            aat.id AS applicationTypeId, aat.name AS applicationTypeName,
            ast.id AS siblingTypeId, ast.name AS siblingTypeName,
            aafs.id AS applicationStatusId, aafs.name AS applicationStatusName
            FROM admission_application_form aaf 
            JOIN admission_application_type aat ON aat.id = aaf.application_type_id
            LEFT JOIN admission_sibling_type ast ON ast.id = aaf.sibling_type_id
            JOIN school s ON s.id = aaf.school_id
            JOIN grade gd ON gd.id = aaf.grade_id
            JOIN schooling_program sp ON sp.id = aaf.schooling_program_id
            JOIN academic_session acs ON acs.id = aaf.academic_session_id
            JOIN admission_parent ap ON ap.id = aaf.parent_id
            JOIN admission_application_form_status aafs ON aafs.id = aaf.application_form_status_id 
            WHERE acs.id = ${academicSessionId} ORDER BY aaf.student_name`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getApplicationForms = (applicationFor, schoolUUID, schoolingProgramId, academicSessionId, studyCenterUUID, statusId) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT aaf.id, aaf.uuid, aaf.application_number AS applicationNumber, aaf.enrollment_number AS enrollmentNumber, aaf.admission_date AS admissionDate, aaf.student_name AS studentName, ap.id AS parentId, ap.name AS parentName, ap.mobile AS parentMobile, ap.email AS parentEmail, gd.id AS gradeId, gd.name AS gradeName,
            aat.id AS applicationTypeId, aat.name AS applicationTypeName,
            ast.id AS siblingTypeId, ast.name AS siblingTypeName,
            aspc.id AS profileCompletionId, aspc.name AS profileCompletionName,
            aafs.id AS applicationStatusId, aafs.name AS applicationStatusName,
            sc.uuid AS studyCenterUUID, sc.name AS studyCenterName
            FROM admission_application_form aaf 
            JOIN admission_application_type aat ON aat.id = aaf.application_type_id
            LEFT JOIN admission_sibling_type ast ON ast.id = aaf.sibling_type_id
            JOIN school s ON s.id = aaf.school_id
            JOIN grade gd ON gd.id = aaf.grade_id
            JOIN schooling_program sp ON sp.id = aaf.schooling_program_id
            JOIN academic_session acs ON acs.id = aaf.academic_session_id
            JOIN admission_parent ap ON ap.id = aaf.parent_id
            JOIN study_center sc ON sc.id = aaf.study_center_id
            JOIN admission_student_profile_completion aspc ON aspc.id = aaf.student_profile_completion_id
            JOIN admission_application_form_status aafs ON aafs.id = aaf.application_form_status_id 
            WHERE aaf.application_for = '${applicationFor}' AND s.uuid = '${schoolUUID}' AND sp.id = ${schoolingProgramId} AND acs.id = ${academicSessionId}`;

            if(studyCenterUUID != "")
            {
                sql =sql + ` AND sc.uuid = '${studyCenterUUID}'`;
            }
            if(statusId != "")
            {
                sql =sql + ` AND aafs.id = ${statusId}`;
            }

            sql =sql + ` ORDER BY aaf.id DESC`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getApplicationStudentProfile = (uuid) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT aaf.id, aaf.uuid, aaf.application_number AS applicationNumber, aaf.enrollment_number AS enrollmentNumber, aaf.admission_date AS admissionDate, aaf.student_name AS studentName, aaf.dob, aaf.nationality, aaf.aadhar_number AS aadharNumber, aaf.passport_number AS passportNumber,
            agd.id AS genderId, agd.name AS genderName,
            aat.id AS applicationTypeId, aat.name AS applicationTypeName,
            ast.id AS siblingTypeId, ast.name AS siblingTypeName,
            acs.id AS academicSessionId, acs.year AS academicSessionYear, acs.batch_year AS batchYear,
            s.uuid AS schoolUUID, s.name AS schoolName,
            sp.id AS schoolingProgramId, sp.name AS schoolingProgramName,
            sy.id AS syllabusId, sy.name AS syllabusName,
            gc.id AS gradeCategoryId, gc.name AS gradeCategoryName,
            g.id AS gradeId, g.name AS gradeName,
            aspc.id AS profileCompletionId, aspc.name AS profileCompletionName,
            apu.id AS parentUndertakingId, apu.name AS parentUndertakingName, 
            alst.id AS leadStudentTypeId, alst.name AS leadStudentTypeName,
            amlt.id AS marketLeadTypeId, amlt.name AS marketLeadTypeName,
            awim.id AS walkinModeId, awim.name AS walkinModeName,
            lacs.id AS lAcademicSessionId, lacs.year AS lAcademicSessionYear, lacs.batch_year AS lBatchYear,
            lye.uuid AS lEnrollmentUUID, lye.enrollment_number AS lEnrollmentNumber, lye.student_name AS lStudentName,
            cacs.id AS cAcademicSessionId, cacs.year AS cAcademicSessionYear, cacs.batch_year AS cBatchYear,
            cya.uuid AS cAppplicationUUID, cya.application_number AS cApplicationNumber, cya.student_name AS cStudentName,
            sc.uuid AS studyCenterUUID, sc.name AS studyCenterName, 
            tus.uuid AS tieupSchoolUUID, tus.name AS tieupSchoolName,      
            aafs.id AS applicationStatusId, aafs.name AS applicationStatusName 
            FROM admission_application_form aaf 
            JOIN admission_gender agd ON agd.id = aaf.gender_id
            JOIN admission_application_type aat ON aat.id = aaf.application_type_id
            JOIN school s ON s.id = aaf.school_id
            JOIN schooling_program sp ON sp.id = aaf.schooling_program_id
            JOIN academic_session acs ON acs.id = aaf.academic_session_id
            JOIN syllabus sy ON sy.id = aaf.syllabus_id
            JOIN grade_category gc ON gc.id = aaf.grade_category_id
            JOIN grade g ON g.id = aaf.grade_id
            JOIN admission_student_profile_completion aspc ON aspc.id = aaf.student_profile_completion_id
            JOIN admission_parent_undertaking apu ON apu.id = aaf.parent_undertaking_id
            JOIN study_center sc ON sc.id = aaf.study_center_id
            JOIN admission_lead_student_type alst ON alst.id = aaf.lead_student_type_id
            JOIN admission_market_lead_type amlt ON amlt.id = aaf.market_lead_type_id
            LEFT JOIN admission_walkin_mode awim ON awim.id = aaf.walkin_mode_id
            LEFT JOIN admission_sibling_type ast ON ast.id = aaf.sibling_type_id
            LEFT JOIN academic_session lacs ON lacs.id = aaf.last_academic_session_id
            LEFT JOIN academic_session cacs ON cacs.id = aaf.current_academic_session_id
            LEFT JOIN admission_application_form lye ON lye.id = aaf.last_year_enrollment_id
            LEFT JOIN admission_application_form cya ON cya.id = aaf.current_year_application_id
            LEFT JOIN tie_up_school tus ON tus.id = aaf.tie_up_school_id
            JOIN admission_application_form_status aafs ON aafs.id = aaf.application_form_status_id
            WHERE aaf.uuid = '${uuid}'`
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getApplicationParentProfile = (uuid) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT ap.id as id, ap.name AS parentName, ap.email AS parentEmail, ap.mobile AS parentMobile, ap.relationship AS parentRelationship, ap.aadhar_number AS parentAadhanrNumber, ap.pan_number AS parentPanNumber, ap.passport_number AS parentPassportNumber, ap.address AS parentAddress, ap.pincode AS parentPincode,
            pcou.id AS parentCountryId, pcou.name AS parentCountryName,
            psr.id AS parentStateId, psr.name AS parentStateName,
            pd.id AS parentDistrictId, pd.name AS parentDistrictName,
            pc.id AS parentCityId, pc.name AS parentCityName
            FROM admission_application_form aaf 
            JOIN admission_parent ap ON ap.id = aaf.parent_id
            LEFT JOIN country pcou ON pcou.id = ap.country_id
            LEFT JOIN state_region psr ON psr.id = ap.state_id
            LEFT JOIN district pd ON pd.id = ap.district_id
            LEFT JOIN city pc ON pc.id = ap.city_id
            WHERE aaf.uuid = '${uuid}'`
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getApplicationSubjectGroup = (uuid) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT asg.id, asg.group_name AS name, 
            GROUP_CONCAT(sub.id ORDER BY sub.id) AS subjectIds, GROUP_CONCAT(sub.name ORDER BY sub.id) AS subjectNames, GROUP_CONCAT(sub.total_session ORDER BY sub.id) AS totalSessions, GROUP_CONCAT(sub.session_duration ORDER BY sub.id) AS sessionDurations, GROUP_CONCAT(sub.has_practical ORDER BY sub.id) AS hasPracticals, GROUP_CONCAT(sub.is_mandatory ORDER BY sub.id) AS isMandatories, GROUP_CONCAT(st.id ORDER BY sub.id) AS subjectTypeIds, GROUP_CONCAT(st.name ORDER BY sub.id) AS subjectTypeNames, bt.id AS batchTypeId, bt.name AS batchTypeName, bt.start_time AS startTime, bt.end_time AS endTime
            FROM admission_application_form aaf 
            JOIN admission_subject_group asg ON asg.id = aaf.subject_group_id
            JOIN batch_type bt ON bt.id = aaf.batch_type_id
            JOIN admission_application_subject aas ON aas.application_form_id = aaf.id
            JOIN subject sub ON sub.id = aas.subject_id
            JOIN subject_type st ON st.id = sub.subject_type_id
            WHERE aaf.uuid = '${uuid}' GROUP BY asg.id`
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getApplicationSportEngagement = (uuid) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT aaf.is_practicing_sport AS isPracticingSport, aaf.engagement_since AS engagementDate, aaf.other_academy_name AS otherAcademyName, aaf.other_academy_address AS otherAcademyAddress, 
            cou.id AS otherAcademyCountryId, cou.name AS otherAcademyCountryName,
            sr.id AS otherAcademyStateId, sr.name AS otherAcademyStateName,
            d.id AS otherAcademyDistrictId, d.name AS otherAcademyDistrictName,
            c.id AS otherAcademyCityId, c.name AS otherAcademyCityName,
            bp.uuid AS businessPartnerUUID, bp.name AS businessPartnerName, bp.address AS businessPartnerAddress, co.uuid AS coachUUID, co.name AS coachName, co.mobile AS coachMobile, co.email AS coachEmail, bvt.id AS businessVerticalTypeId, bvt.name AS businessVerticalTypeName,
            aaf.other_academy_coach AS otherAcademyCoach, aaf.other_academy_coach_mobile AS otherAcademyCoachMobile, aaf.other_academy_coach_email AS otherAcademyCoachEmail, aaf.other_academy_sport AS otherAcademySport,
            bpcou.id AS businessPartnerCountryId, bpcou.name AS businessPartnerCountryName,
            bpsr.id AS businessPartnerStateId, bpsr.name AS businessPartnerStateName,
            bpd.id AS businessPartnerDistrictId, bpd.name AS businessPartnerDistrictName,
            bpc.id AS businessPartnerCityId, bpc.name AS businessPartnerCityName
            FROM admission_application_form aaf 
            LEFT JOIN business_partner bp ON bp.id = aaf.business_partner_id
            LEFT JOIN coach co ON co.id = aaf.business_partner_coach_id
            LEFT JOIN business_vertical_type bvt ON bvt.id = co.business_vertical_type_id
            LEFT JOIN country cou ON cou.id = aaf.other_academy_country_id
            LEFT JOIN state_region sr ON sr.id = aaf.other_academy_state_id
            LEFT JOIN district d ON d.id = aaf.other_academy_district_id
            LEFT JOIN city c ON c.id = aaf.other_academy_city_id
            LEFT JOIN country bpcou ON bpcou.id = bp.country_id
            LEFT JOIN state_region bpsr ON bpsr.id = bp.state_region_id
            LEFT JOIN district bpd ON bpd.id = bp.district_id
            LEFT JOIN city bpc ON bpc.id = bp.city_id
            WHERE aaf.uuid = '${uuid}'`
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getApplicationUndergoneEducation = (uuid) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT aaf.student_undergone AS studentUndergone, aaf.formal_school_name AS formalSchoolName, aaf.formal_school_address AS formalSchoolAddress, aaf.formal_school_medium AS formalSchoolMedium, aaf.formal_school_last_academic_year AS formalLastAcademicYear, aaf.is_declaration_correct AS declarationCorrect,
            cou.id AS formalCountryId, cou.name AS formalCountryName,
            sr.id AS formalStateId, sr.name AS formalStateName,
            d.id AS formalDistrictId, d.name AS formalDistrictName,
            c.id AS formalCityId, c.name AS formalCityName,
            g.id AS formalGradeId, g.name AS formalGradeName,
            sy.id AS formalSyllabusId, sy.name AS formalSyllabusName 
            FROM admission_application_form aaf 
            LEFT JOIN syllabus sy ON sy.id = aaf.formal_school_syllabus_id
            LEFT JOIN grade g ON g.id = aaf.formal_school_grade_id
            LEFT JOIN country cou ON cou.id = aaf.formal_school_country_id
            LEFT JOIN state_region sr ON sr.id = aaf.formal_school_state_id
            LEFT JOIN district d ON d.id = aaf.formal_school_district_id
            LEFT JOIN city c ON c.id = aaf.formal_school_city_id 
            WHERE aaf.uuid = '${uuid}'`
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getApplicationUndertakingDocument = (uuid) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT aaf.undertaking_file_name AS undertakingFileName, aaf.undertaking_sign_file_name AS undertakingSignFileName, aaf.admission_file_name AS admissionFileName
            FROM admission_application_form aaf 
            WHERE aaf.uuid = '${uuid}'`
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getApplicationStudentDocuments = (uuid) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT asd.id, asd.name, aasd.file_name AS fileName
            FROM admission_student_document asd
            LEFT JOIN admission_application_form aaf ON aaf.uuid = '${uuid}'
            LEFT JOIN admission_application_student_docs aasd ON aasd.application_form_id = aaf.id AND aasd.student_document_id = asd.id 
            ORDER BY asd.id`
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getApplicationFeeStructure = (uuid) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT 
            afs.uuid, 
            afc.id AS feeCategoryId, 
            afc.name AS feeCategoryName, 
            aaf.total_installment AS totalInstallment, 
            aaf.other_discount AS otherDiscount, 
            aft.id AS feeTypeId, 
            aft.name AS feeTypeName, 
            aaft.amount AS feeTypeAmount, 
            NULL AS discountTypeId, 
            NULL AS discountTypeName, 
            NULL AS discountTypeAmount, 
            NULL AS installmentId, 
            NULL AS installmentName, 
            NULL AS installmentDueDate, 
            NULL AS installmentRate, 
            NULL AS installmentAmount, 
            NULL AS installmentAmountPaid, 
            NULL AS totalsId, 
            NULL AS totalsTaxRateId, 
            NULL AS totalsTaxRate, 
            NULL AS totalsTaxTypeId, 
            NULL AS totalsTaxTypeName, 
            NULL AS totalsTotalAmount, 
            NULL AS totalsTotalDiscount, 
            NULL AS totalsNetAmount, 
            NULL AS totalsTaxAmount, 
            NULL AS totalsGrossAmount,
            'Fee Type' AS unionName
            FROM admission_application_form aaf
            JOIN admission_fee_structure afs ON afs.id = aaf.fee_structure_id
            JOIN admission_fee_category afc ON afc.id = afs.fee_category_id
            JOIN admission_application_fee_type aaft ON aaft.application_form_id = aaf.id
            JOIN admission_fee_type aft ON aft.id = aaft.fee_type_id
            WHERE aaf.uuid = '${uuid}'

        UNION

        SELECT 
            afs.uuid, 
            afc.id AS feeCategoryId, 
            afc.name AS feeCategoryName, 
            aaf.total_installment AS totalInstallment, 
            aaf.other_discount AS otherDiscount, 
            NULL AS feeTypeId, 
            NULL AS feeTypeName, 
            NULL AS feeTypeAmount, 
            adt.id AS discountTypeId, 
            adt.name AS discountTypeName, 
            aadt.amount AS discountTypeAmount, 
            NULL AS installmentId, 
            NULL AS installmentName, 
            NULL AS installmentDueDate, 
            NULL AS installmentRate, 
            NULL AS installmentAmount,
            NULL AS installmentAmountPaid, 
            NULL AS totalsId, 
            NULL AS totalsTaxRateId, 
            NULL AS totalsTaxRate, 
            NULL AS totalsTaxTypeId, 
            NULL AS totalsTaxTypeName, 
            NULL AS totalsTotalAmount, 
            NULL AS totalsTotalDiscount, 
            NULL AS totalsNetAmount, 
            NULL AS totalsTaxAmount, 
            NULL AS totalsGrossAmount,
            'Discount Type' AS unionName
            FROM admission_application_form aaf
            JOIN admission_fee_structure afs ON afs.id = aaf.fee_structure_id
            JOIN admission_fee_category afc ON afc.id = afs.fee_category_id
            JOIN admission_application_discount_type aadt ON aadt.application_form_id = aaf.id
            JOIN admission_discount_type adt ON adt.id = aadt.discount_type_id
            WHERE aaf.uuid = '${uuid}'

        UNION

        SELECT 
            afs.uuid, 
            afc.id AS feeCategoryId, 
            afc.name AS feeCategoryName, 
            aaf.total_installment AS totalInstallment, 
            aaf.other_discount AS otherDiscount, 
            NULL AS feeTypeId, 
            NULL AS feeTypeName, 
            NULL AS feeTypeAmount, 
            NULL AS discountTypeId, 
            NULL AS discountTypeName, 
            NULL AS discountTypeAmount, 
            aafi.id AS installmentId, 
            aafi.name AS installmentName, 
            aafi.due_date AS installmentDueDate, 
            aafi.installment_rate AS installmentRate, 
            aafi.amount AS installmentAmount, 
            aafi.amount_paid AS installmentAmountPaid, 
            NULL AS totalsId, 
            NULL AS totalsTaxRateId, 
            NULL AS totalsTaxRate, 
            NULL AS totalsTaxTypeId, 
            NULL AS totalsTaxTypeName, 
            NULL AS totalsTotalAmount, 
            NULL AS totalsTotalDiscount, 
            NULL AS totalsNetAmount, 
            NULL AS totalsTaxAmount, 
            NULL AS totalsGrossAmount,
            'Installments' AS unionName
            FROM admission_application_form aaf
            JOIN admission_fee_structure afs ON afs.id = aaf.fee_structure_id
            JOIN admission_fee_category afc ON afc.id = afs.fee_category_id
            JOIN admission_application_fee_installment aafi ON aafi.application_form_id = aaf.id
            WHERE aaf.uuid = '${uuid}'

        UNION

        SELECT 
            afs.uuid, 
            afc.id AS feeCategoryId, 
            afc.name AS feeCategoryName, 
            aaf.total_installment AS totalInstallment, 
            aaf.other_discount AS otherDiscount, 
            NULL AS feeTypeId, 
            NULL AS feeTypeName, 
            NULL AS feeTypeAmount, 
            NULL AS discountTypeId, 
            NULL AS discountTypeName, 
            NULL AS discountTypeAmount, 
            NULL AS installmentId, 
            NULL AS installmentName, 
            NULL AS installmentDueDate, 
            NULL AS installmentRate, 
            NULL AS installmentAmount, 
            NULL AS installmentAmountPaid, 
            aafto.id AS totalsId, 
            atr.id AS totalsTaxRateId, 
            atr.rate AS totalsTaxRate, 
            att.id AS totalsTaxTypeId, 
            att.name AS totalsTaxTypeName, 
            aafto.total_amount AS totalsTotalAmount, 
            aafto.total_discount AS totalsTotalDiscount, 
            aafto.net_amount AS totalsNetAmount, 
            aafto.tax_amount AS totalsTaxAmount, 
            aafto.gross_amount AS totalsGrossAmount,
            'Totals' AS unionName
            FROM admission_application_form aaf
            JOIN admission_fee_structure afs ON afs.id = aaf.fee_structure_id
            JOIN admission_fee_category afc ON afc.id = afs.fee_category_id
            JOIN admission_application_fee_totals aafto ON aafto.application_form_id = aaf.id
            LEFT JOIN admission_tax_rate atr ON atr.id = aafto.tax_rate_id
            LEFT JOIN admission_tax_type att ON att.id = atr.tax_type_id
            WHERE aaf.uuid = '${uuid}';`
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getApplicationFeePayments = (uuid) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT aafp.id, CONCAT(acs.year,'/GSP/',aafp.id) AS receiptNumber, 'Tuition Fee' AS paymentFor, aafp.payment_date AS paymentDate, aafp.amount, aafp.bank_reference AS bankReference, aafp.bank_charges AS bankCharges,
            apm.id AS paymentMethodId, apm.name AS paymentMethodName 
            FROM admission_application_fee_payment aafp
            LEFT JOIN admission_application_form aaf ON aaf.id = aafp.application_form_id 
            JOIN academic_session acs ON acs.id = aaf.academic_session_id
            LEFT JOIN admission_payment_method apm ON apm.id = aafp.payment_method_id
            WHERE aaf.uuid = '${uuid}' ORDER BY aafp.id`
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.checkValidApplicationForm = (uuid, id, applicationFor) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT aaf.id, aaf.application_number AS applicationNumber, aaf.enrollment_number AS enrollmentNumber, aaf.admission_date AS admissionDate, aaf.parent_id AS parentId, aaf.renewal_count AS renewalCount, aaf.undertaking_file_name AS undertakingFileName, aaf.admission_file_name AS admissionFileName, 
            aafs.id AS applicationStatusId, aafs.name AS applicationStatusName
            FROM admission_application_form aaf 
            JOIN admission_application_form_status aafs ON aafs.id = aaf.application_form_status_id`;
            if(uuid != "")
            {
                sql =sql + ` WHERE aaf.uuid = '${uuid}'`;
                if(applicationFor != "")
                {
                    sql = sql + ` AND aaf.application_for = '${applicationFor}'`;
                }
            }
            else if(id != "")
            {
                sql =sql + ` WHERE aaf.id = ${id}`;
                if(applicationFor != "")
                {
                    sql = sql + ` AND aaf.application_for = '${applicationFor}'`;
                }
            }
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.checkDuplicateParentEmailMobile = (value, action, id) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT ap.id, ap.name, ap.email, ap.mobile
            FROM admission_parent ap`;
            if(action == "Email")
            {
                sql =sql + ` WHERE ap.email = '${value}'`;
            }
            else if(action == "Mobile")
            {
                sql =sql + ` WHERE ap.mobile = '${value}'`;
            }
            if(id != "")
            {
                sql =sql + ` AND ap.id != ${id}`;
            }
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.checkDuplicateStudentAadhar = (applicationId, aadharNumber) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT aaf.id, aaf.student_name AS studentName
            FROM admission_application_form aaf 
            WHERE aaf.id != ${applicationId} AND aaf.aadhar_number = '${aadharNumber}'`;
                        
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.checkDuplicateParentAadhar = (parentId, aadharNumber) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT ap.id, ap.name
            FROM admission_parent ap 
            WHERE ap.id != ${parentId} AND ap.aadhar_number = '${aadharNumber}'`;
              
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.duplicateApplicationForm = (applicationType, studentName, parentId) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let applicationTypeId = applicationType[0].name == 'Primary Application' ? applicationType[0].id : 0;
            parentId = parentId == '' ? 0 : parentId;

            let sql = `SELECT aaf.id, aaf.student_name AS studentName
            FROM admission_application_form aaf 
            WHERE aaf.application_type_id = ${applicationTypeId} AND aaf.student_name = '${studentName}' AND aaf.parent_id = ${parentId}`;
              
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.insertB2CApplicationForm1 = (application) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO admission_application_form (uuid, parent_undertaking_code, application_for, application_type_id, school_id, schooling_program_id, academic_session_id, batch_year_id, sibling_type_id, last_academic_session_id, last_year_enrollment_id, current_academic_session_id, current_year_application_id, student_name, parent_id, gender_id, syllabus_id, grade_category_id, grade_id, subject_group_id, batch_type_id, student_profile_completion_id, parent_undertaking_id, admission_date, study_center_id, lead_student_type_id, market_lead_type_id, walkin_mode_id, application_form_status_id, registered_on, registered_by_id)
            VALUES ('${application.uuid}', NULLIF('${application.parentUndertakingCode}', ''), '${application.applicationFor}', ${application.applicationTypeId}, ${application.schoolId}, ${application.schoolingProgramId}, ${application.academicSessionId}, ${application.batchYearId}, NULLIF('${application.siblingTypeId}', ''), NULLIF('${application.lastAcademicSessionId}', ''), NULLIF('${application.lastYearEnrollmentId}', ''), NULLIF('${application.currentAcademicSessionId}', ''), NULLIF('${application.currentYearApplicationId}', ''), '${application.studentName}', NULLIF('${application.parentId}', ''), ${application.genderId}, ${application.syllabusId}, ${application.gradeCategoryId}, ${application.gradeId}, ${application.subjectGroupId}, ${application.batchTypeId}, ${application.studentProfileCompletionId}, ${application.parentUndertakingId}, '${application.admissionDate}', ${application.studyCenterId}, ${application.leadStudentTypeId}, ${application.marketLeadTypeId}, NULLIF('${application.walkInModeId}', ''), ${application.applicationStatusId}, NOW(), ${application.createdById})`;
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                let applicationId = result.insertId;
                application.applicationNumber = application.applicationNumber + applicationId;
        /////Save Parent
                if(application.parentId == "")
                {
                    let sql1 = `INSERT INTO admission_parent (name, email, mobile, relationship, created_on, created_by_id) VALUES ('${application.parentName}', '${application.parentEmail}', '${application.parentMobile}', '${application.studentRelationship}', NOW(), ${application.createdById})`;
                    dbConn.query(sql1, (error1, result1) => 
                    {
                        if(error1)
                        {
                            return reject(error1);
                        }
                        application.parentId = result1.insertId;
                        /////Update Application Number, Parent Id In Apllication Form
                        let sql2 = `UPDATE admission_application_form SET application_number = '${application.applicationNumber}', parent_id = ${application.parentId} WHERE id = ${applicationId}`;

                        dbConn.query(sql2, (error2, result2) => 
                        {
                            if(error2)
                            {
                                return reject(error2);
                            }
                        });
                    });
                }
                else
                {
                    /////Update Application Number, Parent Id In Apllication Form
                    let sql2 = `UPDATE admission_application_form SET application_number = '${application.applicationNumber}', parent_id = ${application.parentId} WHERE id = ${applicationId}`;

                    dbConn.query(sql2, (error2, result2) => 
                    {
                        if(error2)
                        {
                            return reject(error2);
                        }
                    });
                }
    
                let sqlValues1 = "";
                for(let i=0;i<application.subjectIds.length;i++)
                {
                    let subject = application.subjectIds[i];
                    if(sqlValues1 == "") 
                    {
                        sqlValues1 = `(${applicationId}, ${subject.id}, NOW(), ${application.createdById})`;
                    }
                    else
                    {
                        sqlValues1 = sqlValues1 + `, (${applicationId}, ${subject.id}, NOW(), ${application.createdById})`;
                    }
                }
                if(sqlValues1 != "")
                {
                    let sql2 = `INSERT INTO admission_application_subject (application_form_id, subject_id, created_on, created_by_id)
                    VALUES ${sqlValues1}`;
                    dbConn.query(sql2, (error2, result2) => 
                    {
                        if(error2)
                        {
                            return reject(error2);
                        }
                    });
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.updateB2CApplicationForm2 = (application) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE admission_application_form SET fee_structure_id = ${application.feeStructureId}, total_installment = ${application.fees.feeInstallments.length}, other_discount = ${application.otherDiscount}, tie_up_school_id = NULLIF('${application.tieupSchoolId}', ''), application_form_status_id = ${application.applicationStatusId}, fee_configured_on = NOW(), fee_configured_by_id = ${application.createdById} WHERE id = ${application.applicationFormId}`;
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                
        /////Save Fee Types
                let feeTypes = application.fees.feeTypes;
                let sqlValues1 = "";
                for(let i=0;i<feeTypes.length;i++)
                {
                    if(sqlValues1 == "")
                    {
                        sqlValues1 = `(${application.applicationFormId}, ${feeTypes[i].feeTypeId}, ${feeTypes[i].amount}, NOW(), ${application.createdById})`;
                    }
                    else
                    {
                        sqlValues1 = sqlValues1 + `, (${application.applicationFormId}, ${feeTypes[i].feeTypeId}, ${feeTypes[i].amount}, NOW(), ${application.createdById})`;
                    }
                }
                let sql1 = `INSERT INTO admission_application_fee_type (application_form_id, fee_type_id, amount, created_on, created_by_id) VALUES ${sqlValues1}`;
                dbConn.query(sql1, (error1, result1) => 
                {
                    if(error1)
                    {
                        return reject(error1);
                    }

                /////Save Discount Types
                    let discountTypes = application.fees.discountTypes;
                    let sqlValues2 = "";
                    for(let i=0;i<discountTypes.length;i++)
                    {
                        if(sqlValues2 == "")
                        {
                            sqlValues2 = `(${application.applicationFormId}, ${discountTypes[i].discountTypeId}, ${discountTypes[i].amount}, NOW(), ${application.createdById})`;
                        }
                        else
                        {
                            sqlValues2 = sqlValues2 + `, (${application.applicationFormId}, ${discountTypes[i].discountTypeId}, ${discountTypes[i].amount}, NOW(), ${application.createdById})`;
                        }
                    }
                    let sql2 = `INSERT INTO admission_application_discount_type (application_form_id, discount_type_id, amount, created_on, created_by_id) VALUES ${sqlValues2}`;
                    dbConn.query(sql2, (error2, result2) => 
                    {
                        if(error2)
                        {
                            return reject(error2);
                        }

                /////Save Installments
                        let feeInstallments = application.fees.feeInstallments;
                        let sqlValues3 = "";
                        for(let i=0;i<feeInstallments.length;i++)
                        {
                            if(sqlValues3 == "")
                            {
                                sqlValues3 = `(${application.applicationFormId}, '${feeInstallments[i].name}', ${feeInstallments[i].installmentRate}, '${feeInstallments[i].dueDate}', ${feeInstallments[i].amount}, NOW(), ${application.createdById})`;
                            }
                            else
                            {
                                sqlValues3 = sqlValues3 + `, (${application.applicationFormId}, '${feeInstallments[i].name}', ${feeInstallments[i].installmentRate}, '${feeInstallments[i].dueDate}', ${feeInstallments[i].amount}, NOW(), ${application.createdById})`;
                            }
                        }
                        let sql3 = `INSERT INTO admission_application_fee_installment (application_form_id, name, installment_rate, due_date, amount, created_on, created_by_id) VALUES ${sqlValues3}`;
                        dbConn.query(sql3, (error3, result3) => 
                        {
                            if(error3)
                            {
                                return reject(error3);
                            }
                //////Save Totals
                            let feeTotal = application.fees.total; 
                            let sql4 = `INSERT INTO admission_application_fee_totals (application_form_id, tax_rate_id, total_amount, total_discount, net_amount, tax_amount, gross_amount, created_on, created_by_id) VALUES (${application.applicationFormId}, NULLIF('${feeTotal.taxRateId}', ''), ${feeTotal.totalAmount}, ${feeTotal.totalDiscount}, ${feeTotal.netAmount}, ${feeTotal.taxAmount}, ${feeTotal.grossAmount}, NOW(), ${application.createdById})`;
                            
                            dbConn.query(sql4, (error4, result4) => 
                            {
                                if(error4)
                                {
                                    return reject(error4);
                                }
                            });
                        });
                    });
                    return resolve(result);
                });
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.updateB2CApplicationForm3 = (application) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE admission_application_form SET dob = '${application.dob}', nationality = '${application.nationality}', aadhar_number = '${application.aadharNumber}', passport_number = NULLIF('${application.passportNumber}', ''), is_practicing_sport = ${application.isPracticingSport}, business_partner_id = NULLIF('${application.businessPartnerId}', ''), business_partner_coach_id = NULLIF('${application.coachId}', ''), engagement_since = NULLIF('${application.engagementDate}', ''), other_academy_name = NULLIF('${application.otherAcademyName}', ''), other_academy_country_id = NULLIF('${application.otherAcademyCountryId}', ''), other_academy_state_id = NULLIF('${application.otherAcademyStateId}', ''), other_academy_district_id = NULLIF('${application.otherAcademyDistrictId}', ''), other_academy_city_id = NULLIF('${application.otherAcademyCityId}', ''), other_academy_address = NULLIF('${application.otherAcademyAddress}', ''), other_academy_coach = NULLIF('${application.otherAcademyCoach}', ''), other_academy_sport = NULLIF('${application.otherAcademySportName}', ''), other_academy_coach_email = NULLIF('${application.otherAcademyCoachEmail}', ''), other_academy_coach_mobile = NULLIF('${application.otherAcademyCoachMobile}', ''), student_undergone = '${application.studentUndergone}', formal_school_name = NULLIF('${application.formalSchoolName}', ''), formal_school_address = NULLIF('${application.formalSchoolAddress}', ''), formal_school_country_id = NULLIF('${application.formalCountryId}', ''), formal_school_state_id = NULLIF('${application.formalStateId}', ''), formal_school_district_id = NULLIF('${application.formalDistrictId}', ''),  formal_school_city_id = NULLIF('${application.formalCityId}', ''), formal_school_grade_id = NULLIF('${application.formalGradeId}', ''), formal_school_syllabus_id = NULLIF('${application.formalSyllabusId}', ''), formal_school_medium = NULLIF('${application.formalMedium}', ''), formal_school_last_academic_year = NULLIF('${application.formalLastAcademicYear}', ''), is_declaration_correct = ${application.declarationCorrect}, application_form_status_id = ${application.applicationStatusId}, submitted_on = NOW(), submitted_by_id = ${application.createdById} WHERE id = ${application.applicationFormId}`;
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                
        /////Update Parent
                let sql1 = `UPDATE admission_parent SET address = '${application.parentAddress}', country_id = ${application.parentCountryId}, state_id = ${application.parentStateId}, district_id = ${application.parentDistrictId}, city_id = ${application.parentCityId}, pincode = ${application.parentPinCode}, aadhar_number = '${application.parentAadharNumber}', passport_number = NULLIF('${application.parentPassportNumber}', ''), pan_number = NULLIF('${application.parentPanNumber}', ''), updated_on = NOW(), updated_by_id = ${application.createdById} WHERE id = ${application.parentId}`;
                dbConn.query(sql1, (error1, result1) => 
                {
                    if(error1)
                    {
                        return reject(error1);
                    }
                    return resolve(result);
                });
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.updateB2CApplicationForm4 = (application) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = "";
            if(application.documentName == "Admission_Form")
            {
                sql = `UPDATE admission_application_form SET admission_file_name = '${application.fileName}' WHERE id = ${application.applicationFormId}`;
            }
            else
            {
                sql = `UPDATE admission_application_form SET undertaking_file_name = '${application.fileName}' WHERE id = ${application.applicationFormId}`;
            }
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                
        /////Get Admission Form Data
                let sql1 = `SELECT aaf.uuid, aafs.id AS applicationStatusId, aafs.name AS applicationStatusName
                FROM admission_application_form aaf
                JOIN admission_application_form_status aafs ON aafs.id = aaf.application_form_status_id
                WHERE aaf.id = ${application.applicationFormId} AND aaf.admission_file_name IS NOT NULL AND aaf.undertaking_file_name IS NOT NULL`;
                dbConn.query(sql1, (error1, result1) => 
                {
                    if(error1)
                    {
                        return reject(error1);
                    }
                    if(result1.length == 1 && result1[0].applicationStatusName != 'Enrolled/Renewed')
                    {
                        let sql2 = `UPDATE admission_application_form SET application_form_status_id = ${application.applicationStatusId}, undertaking_on = NOW(), undertaking_by_id = ${application.createdById} WHERE id = ${application.applicationFormId} AND application_form_status_id != ${application.applicationStatusId}`;
                        dbConn.query(sql2, (error2, result2) => 
                        {
                            if(error2)
                            {
                                return reject(error2);
                            }
                            return resolve(result);
                        });
                    }
                    else
                    {
                        return resolve(result);
                    }
                });
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.insertB2BApplicationForm1 = (application) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO admission_application_form (uuid, parent_undertaking_code, application_for, application_type_id, school_id, schooling_program_id, academic_session_id, batch_year_id, is_practicing_sport, business_partner_id, engagement_since, business_partner_coach_id, sibling_type_id, last_academic_session_id, last_year_enrollment_id, current_academic_session_id, current_year_application_id, student_name, parent_id, gender_id, syllabus_id, grade_category_id, grade_id, subject_group_id, batch_type_id, student_profile_completion_id, parent_undertaking_id, admission_date, study_center_id, lead_student_type_id, market_lead_type_id, walkin_mode_id, application_form_status_id, registered_on, registered_by_id)
            VALUES ('${application.uuid}', NULLIF('${application.parentUndertakingCode}', ''), '${application.applicationFor}', ${application.applicationTypeId}, ${application.schoolId}, ${application.schoolingProgramId}, ${application.academicSessionId}, ${application.batchYearId}, ${application.isPracticingSport}, ${application.businessPartnerId}, '${application.engagementDate}', NULLIF('${application.coachId}', ''), NULLIF('${application.siblingTypeId}', ''), NULLIF('${application.lastAcademicSessionId}', ''), NULLIF('${application.lastYearEnrollmentId}', ''), NULLIF('${application.currentAcademicSessionId}', ''), NULLIF('${application.currentYearApplicationId}', ''), '${application.studentName}', NULLIF('${application.parentId}', ''), ${application.genderId}, ${application.syllabusId}, ${application.gradeCategoryId}, ${application.gradeId}, ${application.subjectGroupId}, ${application.batchTypeId}, ${application.studentProfileCompletionId}, ${application.parentUndertakingId}, '${application.admissionDate}', ${application.studyCenterId}, ${application.leadStudentTypeId}, ${application.marketLeadTypeId}, NULLIF('${application.walkInModeId}', ''), ${application.applicationStatusId}, NOW(), ${application.createdById})`;
        
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                let applicationId = result.insertId;
                application.applicationNumber = application.applicationNumber + applicationId;
        /////Save Parent
                if(application.parentId == "")
                {
                    let sql1 = `INSERT INTO admission_parent (name, email, mobile, relationship, created_on, created_by_id) VALUES ('${application.parentName}', '${application.parentEmail}', '${application.parentMobile}', '${application.studentRelationship}', NOW(), ${application.createdById})`;
                    dbConn.query(sql1, (error1, result1) => 
                    {
                        if(error1)
                        {
                            return reject(error1);
                        }
                        application.parentId = result1.insertId;
                        /////Update Application Number, Parent Id In Apllication Form
                        let sql2 = `UPDATE admission_application_form SET application_number = '${application.applicationNumber}', parent_id = ${application.parentId} WHERE id = ${applicationId}`;

                        dbConn.query(sql2, (error2, result2) => 
                        {
                            if(error2)
                            {
                                return reject(error2);
                            }
                        });
                    });
                }
                else
                {
                    /////Update Application Number, Parent Id In Apllication Form
                    let sql2 = `UPDATE admission_application_form SET application_number = '${application.applicationNumber}', parent_id = ${application.parentId} WHERE id = ${applicationId}`;

                    dbConn.query(sql2, (error2, result2) => 
                    {
                        if(error2)
                        {
                            return reject(error2);
                        }
                    });
                }
    
                let sqlValues1 = "";
                for(let i=0;i<application.subjectIds.length;i++)
                {
                    let subject = application.subjectIds[i];
                    if(sqlValues1 == "") 
                    {
                        sqlValues1 = `(${applicationId}, ${subject.id}, NOW(), ${application.createdById})`;
                    }
                    else
                    {
                        sqlValues1 = sqlValues1 + `, (${applicationId}, ${subject.id}, NOW(), ${application.createdById})`;
                    }
                }
                if(sqlValues1 != "")
                {
                    let sql2 = `INSERT INTO admission_application_subject (application_form_id, subject_id, created_on, created_by_id)
                    VALUES ${sqlValues1}`;
                    dbConn.query(sql2, (error2, result2) => 
                    {
                        if(error2)
                        {
                            return reject(error2);
                        }
                    });
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.updateB2BApplicationForm2 = (application) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE admission_application_form SET dob = '${application.dob}', nationality = '${application.nationality}', aadhar_number = '${application.aadharNumber}', passport_number = NULLIF('${application.passportNumber}', ''), student_undergone = '${application.studentUndergone}', formal_school_name = NULLIF('${application.formalSchoolName}', ''), formal_school_address = NULLIF('${application.formalSchoolAddress}', ''), formal_school_country_id = NULLIF('${application.formalCountryId}', ''), formal_school_state_id = NULLIF('${application.formalStateId}', ''), formal_school_district_id = NULLIF('${application.formalDistrictId}', ''),  formal_school_city_id = NULLIF('${application.formalCityId}', ''), formal_school_grade_id = NULLIF('${application.formalGradeId}', ''), formal_school_syllabus_id = NULLIF('${application.formalSyllabusId}', ''), formal_school_medium = NULLIF('${application.formalMedium}', ''), formal_school_last_academic_year = NULLIF('${application.formalLastAcademicYear}', ''), is_declaration_correct = ${application.declarationCorrect}, application_form_status_id = ${application.applicationStatusId}, submitted_on = NOW(), submitted_by_id = ${application.createdById} WHERE id = ${application.applicationFormId}`;
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                
        /////Update Parent
                let sql1 = `UPDATE admission_parent SET address = '${application.parentAddress}', country_id = ${application.parentCountryId}, state_id = ${application.parentStateId}, district_id = ${application.parentDistrictId}, city_id = ${application.parentCityId}, aadhar_number = '${application.parentAadharNumber}', passport_number = NULLIF('${application.parentPassportNumber}', ''), pan_number = NULLIF('${application.parentPanNumber}', ''), updated_on = NOW(), updated_by_id = ${application.createdById} WHERE id = ${application.parentId}`;
                dbConn.query(sql1, (error1, result1) => 
                {
                    if(error1)
                    {
                        return reject(error1);
                    }
                    return resolve(result);
                });
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.checkStudentDocumentExist = (applicationFormId, documentId) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT aasd.id, aasd.file_name AS fileName
            FROM admission_application_student_docs aasd 
            WHERE aasd.application_form_id = ${applicationFormId} 
            AND student_document_id = ${documentId}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getApplicationStudentDocument = (applicationFormId, documentId) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `SELECT aasd.id, aasd.file_name AS fileName
            FROM admission_application_student_docs aasd 
            WHERE aasd.application_form_id = ${applicationFormId} AND aasd.student_document_id = ${documentId}`;
    
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    });
}; 

db.insertApplicationStudentDoc = (application) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO admission_application_student_docs (application_form_id, student_document_id, file_name, created_on, created_by_id) VALUES (${application.applicationFormId}, ${application.documentId}, '${application.fileName}', NOW(), ${application.createdById})`;
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.deleteApplicationStudentDoc = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM admission_application_student_docs WHERE id = ${id}`;
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.deleteApplicationUndertakingDoc = (applicationFormId, documentName) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = "";
            if(documentName == "Admission_Form")
            {
                sql = `UPDATE admission_application_form SET admission_file_name = NULL 
                WHERE id = ${applicationFormId}`;
            }
            else if(documentName == "Undertaking_Form")
            {
                sql = `UPDATE admission_application_form SET undertaking_file_name = NULL 
                WHERE id = ${applicationFormId}`;
            }
            if(sql != "")
            {
                dbConn.query(sql, (error, result) => 
                {
                    if(error)
                    {
                        return reject(error);
                    }
                    /////Get Admission Form Data
                    let sql1 = `SELECT aaf.uuid, aafs.id AS applicationStatusId, aafs.name AS applicationStatusName
                    FROM admission_application_form aaf
                    JOIN admission_application_form_status aafs ON aafs.id = aaf.application_form_status_id
                    WHERE aaf.id = ${applicationFormId}`;
                    dbConn.query(sql1, (error1, result1) => 
                    {
                        if(error1)
                        {
                            return reject(error1);
                        }
                        if(result1.length == 1 && result1[0].applicationStatusName == 'Undertaking Accepted')
                        {
                            let sql2 = `UPDATE admission_application_form SET application_form_status_id = 3, undertaking_on = NULL, undertaking_by_id = NULL WHERE id = ${applicationFormId}`;
                            dbConn.query(sql2, (error2, result2) => 
                            {
                                if(error2)
                                {
                                    return reject(error2);
                                }
                                return resolve(result);
                            });
                        }
                        else
                        {
                            return resolve(result);
                        }
                    });
                });
            }
            else
            {
                return false;
            }
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.checkApplicationFeeInstallmentExist = (applicationFormId, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id FROM admission_application_fee_installment WHERE application_form_id = ${applicationFormId} AND FIND_IN_SET(id, '${id}') > 0`;
        
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.insertApplicationFeePayment = (feePayment) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO admission_application_fee_payment (application_form_id, amount, payment_date, payment_method_id, bank_reference, created_on, created_by_id) VALUES (${feePayment.applicationFormId}, ${feePayment.totalAmount}, '${feePayment.paymentDate}', ${feePayment.paymentMethodId}, NULLIF('${feePayment.bankReference}', ''), NOW(), ${feePayment.createdById})`;
                        
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                let sql1 = '';
                for(let k=0;k<feePayment.feeInstallment.length;k++)
                {
                    if(sql1 == "")
                    {
                        sql1 = `UPDATE admission_application_fee_installment SET amount_paid = amount_paid + ${feePayment.amounts[k]} WHERE id = ${feePayment.feeInstallment[k].id};`;
                    }
                    else
                    {
                        sql1 = sql1 + `UPDATE admission_application_fee_installment SET amount_paid = amount_paid + ${feePayment.amounts[k]} WHERE id = ${feePayment.feeInstallment[k].id};`
                    }
                }
                
                if(sql1 != "")
                {
                    dbConn.query(sql1, (error1, result1) => 
                    {
                        if(error1)
                        {
                            return reject(error1);
                        }
                        return resolve(result);
                    });
                }
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.saveStudentEnrollment = (enrollment) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE admission_application_form SET enrollment_number = '${enrollment.enrollmentNumber}', application_form_status_id = ${enrollment.applicationStatusId}, enrolled_on = NOW(), enrolled_by_id = ${enrollment.createdById} WHERE id = ${enrollment.applicationFormId}`;
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.updateFeePaymentBankCharges = (feePayment) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE admission_application_fee_payment SET bank_charges = ${feePayment.amount} WHERE id = ${feePayment.feePaymentId} AND application_form_id = ${feePayment.applicationId}`;
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.updateStudentProfile = (student) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE admission_application_form SET student_name = '${student.studentName}', dob = '${student.dob}', gender_id = ${student.genderId}, nationality = '${student.nationality}', aadhar_number = '${student.aadharNumber}', passport_number = NULLIF('${student.passportNumber}', ''), updated_on = NOW(), updated_by_id = ${student.updatedById} WHERE id = '${student.applicationId}'`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.updateParentProfile = (parent) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE admission_parent SET name = '${parent.name}', email = '${parent.email}', mobile = '${parent.mobile}', relationship = '${parent.relationship}', aadhar_number = '${parent.aadharNumber}', passport_number = NULLIF('${parent.passportNumber}', ''), pan_number = NULLIF('${parent.panNumber}', ''), address = '${parent.address}', country_id = ${parent.countryId}, state_id = ${parent.stateId}, district_id = ${parent.districtId}, city_id = ${parent.cityId}, pincode = ${parent.pincode}, updated_on = NOW(), updated_by_id = ${parent.updatedById} WHERE id = ${parent.id}`;
           
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

module.exports = db