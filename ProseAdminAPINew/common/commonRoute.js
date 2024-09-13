const express = require('express');
const commonRoute = express.Router();
let errorCodes = require('../util/errorCodes');
let errorCode = new errorCodes();
let uploads = require('../util/multerConfig.js');

///////Routes
commonRoute.use('/updateStatus', require('../util/validateToken.js'), require('./update-status.js'));
commonRoute.use('/duplicateEmailMobile', require('../util/validateToken.js'), require('./duplicate-email-mobile.js'));
commonRoute.use('/getModules', require('../util/validateToken.js'), require('./modules.js'));
commonRoute.use('/getUserGrades', require('./user-grades.js'));
commonRoute.use('/getUserCategories', require('./user-categories.js'));
commonRoute.use('/getUserRoles', require('../util/validateToken.js'), require('./user-roles.js'));
commonRoute.use('/saveUserRole', require('../util/validateToken.js'), require('./save-user-role.js'));
commonRoute.use('/deleteUserRole', require('../util/validateToken.js'), require('./delete-user-role.js'));
commonRoute.use('/getUserTypes', require('../util/validateToken.js'), require('./user-types.js'));
commonRoute.use('/saveUserType', require('../util/validateToken.js'), require('./save-user-type.js'));
commonRoute.use('/deleteUserType', require('../util/validateToken.js'), require('./delete-user-type.js'));
commonRoute.use('/downloadExcelFormat', require('./download-excel-format.js'));

///Academic Admin
commonRoute.use('/getGradeCategories', require('../util/validateToken.js'), require('./grade-categories.js'));
commonRoute.use('/saveGradeCategory', require('../util/validateToken.js'), require('./save-grade-category.js'));
commonRoute.use('/deleteGradeCategory', require('../util/validateToken.js'), require('./delete-grade-category.js'));
commonRoute.use('/getGrades', require('../util/validateToken.js'), require('./grades.js'));
commonRoute.use('/saveGrade', require('../util/validateToken.js'), require('./save-grade.js'));
commonRoute.use('/deleteGrade', require('../util/validateToken.js'), require('./delete-grade.js'));
commonRoute.use('/getSyllabuses', require('../util/validateToken.js'), require('./syllabuses.js'));
commonRoute.use('/getSyllabus', require('../util/validateToken.js'), require('./syllabus.js'));
commonRoute.use('/saveSyllabus', require('../util/validateToken.js'), require('./save-syllabus.js'));
commonRoute.use('/deleteSyllabus', require('../util/validateToken.js'), require('./delete-syllabus.js'));
commonRoute.use('/addSyllabusGradeCategories', require('../util/validateToken.js'), require('./add-syllabus-grade-category.js'));
commonRoute.use('/deleteSyllabusGradeCategory', require('../util/validateToken.js'), require('./delete-syllabus-grade-category.js'));
commonRoute.use('/getSchoolingGroups', require('../util/validateToken.js'), require('./schooling-groups.js'));
commonRoute.use('/saveSchoolingGroup', require('../util/validateToken.js'), require('./save-schooling-group.js'));
commonRoute.use('/deleteSchoolingGroup', require('../util/validateToken.js'), require('./delete-schooling-group.js'));
commonRoute.use('/getSchoolingCategories', require('../util/validateToken.js'), require('./schooling-categories.js'));
commonRoute.use('/saveSchoolingCategory', require('../util/validateToken.js'), require('./save-schooling-category.js'));
commonRoute.use('/deleteSchoolingCategory', require('../util/validateToken.js'), require('./delete-schooling-category.js'));
commonRoute.use('/getSchoolingPrograms', require('../util/validateToken.js'), require('./schooling-programs.js'));
commonRoute.use('/saveSchoolingProgram', require('../util/validateToken.js'), require('./save-schooling-program.js'));
commonRoute.use('/updateSchoolingProgram', require('../util/validateToken.js'), require('./update-schooling-program.js'));
commonRoute.use('/deleteSchoolingProgram', require('../util/validateToken.js'), require('./delete-schooling-program.js'));
commonRoute.use('/getAcademicSessions', require('../util/validateToken.js'), require('./academic-sessions.js'));
commonRoute.use('/saveAcademicSession', require('../util/validateToken.js'), require('./save-academic-session.js'));
commonRoute.use('/updateAcademicSession', require('../util/validateToken.js'), require('./update-academic-session.js'));
commonRoute.use('/deleteAcademicSession', require('../util/validateToken.js'), require('./delete-academic-session.js'));
commonRoute.use('/getSchoolSubGroups', require('../util/validateToken.js'), require('./school-sub-groups.js'));
commonRoute.use('/saveSchoolSubGroup', require('../util/validateToken.js'), require('./save-school-sub-group.js'));
commonRoute.use('/deleteSchoolSubGroup', require('../util/validateToken.js'), require('./delete-school-sub-group.js'));
commonRoute.use('/getBatchTypes', require('../util/validateToken.js'), require('./batch-types.js'));
commonRoute.use('/saveBatchType', require('../util/validateToken.js'), require('./save-batch-type.js'));
commonRoute.use('/updateBatchType', require('../util/validateToken.js'), require('./update-batch-type.js'));
commonRoute.use('/deleteBatchType', require('../util/validateToken.js'), require('./delete-batch-type.js'));
commonRoute.use('/saveSubject', require('../util/validateToken.js'), require('./save-subject.js'));
commonRoute.use('/getSubjects', require('../util/validateToken.js'), require('./subjects.js'));
commonRoute.use('/getSubject', require('../util/validateToken.js'), require('./subject.js'));
commonRoute.use('/updateSubject', require('../util/validateToken.js'), require('./update-subject.js'));
commonRoute.use('/deleteSubject', require('../util/validateToken.js'), require('./delete-subject.js'));
commonRoute.use('/changeSubChapTopStatus', require('../util/validateToken.js'), require('./change-sub-chap-top-status.js'));
commonRoute.use('/getCurrentAcademicSession', require('../util/validateToken.js'), require('./current-academic-session.js'));
commonRoute.use('/getChapters', require('../util/validateToken.js'), require('./chapters.js'));
commonRoute.use('/saveChapter', require('../util/validateToken.js'), require('./save-chapter.js'));
commonRoute.use('/updateChapter', require('../util/validateToken.js'), require('./update-chapter.js'));
commonRoute.use('/deleteChapter', require('../util/validateToken.js'), require('./delete-chapter.js'));

commonRoute.use('/getChapterWiseTopics', require('../util/validateToken.js'), require('./topics.js'));
commonRoute.use('/saveTopic', require('../util/validateToken.js'), require('./save-topic.js'));
commonRoute.use('/updateTopic', require('../util/validateToken.js'), require('./update-chapter-wise-topic.js'));
commonRoute.use('/deleteTopic', require('../util/validateToken.js'), require('./delete-chapter-wise-topic.js'));

commonRoute.use('/',(req,res,next) => 
{
    return res.status(400).json({
        "status_code" : 400,
        "message" : "Something went wrong",
        "status_name" : errorCode.getStatus(400),
        "error"     : "Wrong method or api"
    }) 
})
module.exports = commonRoute