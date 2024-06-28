const express = require('express');
const commonRoute = express.Router();
let errorCodes = require('../util/errorCodes');
let errorCode = new errorCodes();

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

///Academic Admin
commonRoute.use('/getAcademicSessions', require('../util/validateToken.js'), require('./academic-sessions.js'));
commonRoute.use('/saveAcademicSession', require('../util/validateToken.js'), require('./save-academic-session.js'));
commonRoute.use('/updateAcademicSession', require('../util/validateToken.js'), require('./update-academic-session.js'));
commonRoute.use('/deleteAcademicSession', require('../util/validateToken.js'), require('./delete-academic-session.js'));
commonRoute.use('/getSchoolingPrograms', require('../util/validateToken.js'), require('./schooling-programs.js'));
commonRoute.use('/saveSchoolingProgram', require('../util/validateToken.js'), require('./save-schooling-program.js'));
commonRoute.use('/deleteSchoolingProgram', require('../util/validateToken.js'), require('./delete-schooling-program.js'));
commonRoute.use('/getSyllabuses', require('../util/validateToken.js'), require('./syllabuses.js'));
commonRoute.use('/saveSyllabus', require('../util/validateToken.js'), require('./save-syllabus.js'));
commonRoute.use('/deleteSyllabus', require('../util/validateToken.js'), require('./delete-syllabus.js'));
commonRoute.use('/getGradeCategories', require('../util/validateToken.js'), require('./grade-categories.js'));
commonRoute.use('/saveGradeCategory', require('../util/validateToken.js'), require('./save-grade-category.js'));
commonRoute.use('/deleteGradeCategory', require('../util/validateToken.js'), require('./delete-grade-category.js'));
commonRoute.use('/getGrades', require('../util/validateToken.js'), require('./grades.js'));
commonRoute.use('/saveGrade', require('../util/validateToken.js'), require('./save-grade.js'));
commonRoute.use('/deleteGrade', require('../util/validateToken.js'), require('./delete-grade.js'));
commonRoute.use('/getGradeWiseSyllabuses', require('../util/validateToken.js'), require('./grade-wise-syllabuses.js'));
commonRoute.use('/saveGradeWiseSyllabus', require('../util/validateToken.js'), require('./save-grade-wise-syllabus.js'));
commonRoute.use('/updateGradeWiseSyllabus', require('../util/validateToken.js'), require('./update-grade-wise-syllabus.js'));
commonRoute.use('/deleteGradeWiseSyllabus', require('../util/validateToken.js'), require('./delete-grade-wise-syllabus.js'));
commonRoute.use('/getSyllabusWiseSubjects', require('../util/validateToken.js'), require('./syllabus-wise-subjects.js'));
commonRoute.use('/saveSyllabusWiseSubject', require('../util/validateToken.js'), require('./save-syllabus-wise-subject.js'));
commonRoute.use('/updateSyllabusWiseSubject', require('../util/validateToken.js'), require('./update-syllabus-wise-subject.js'));
commonRoute.use('/deleteSyllabusWiseSubject', require('../util/validateToken.js'), require('./delete-syllabus-wise-subject.js'));
commonRoute.use('/getSubjectWiseChapters', require('../util/validateToken.js'), require('./subject-wise-chapters.js'));
commonRoute.use('/saveSubjectWiseChapter', require('../util/validateToken.js'), require('./save-subject-wise-chapter.js'));
commonRoute.use('/updateSubjectWiseChapter', require('../util/validateToken.js'), require('./update-subject-wise-chapter.js'));
commonRoute.use('/deleteSubjectWiseChapter', require('../util/validateToken.js'), require('./delete-subject-wise-chapter.js'));
commonRoute.use('/getChapterWiseTopics', require('../util/validateToken.js'), require('./chapter-wise-topics.js'));
commonRoute.use('/saveChapterWiseTopic', require('../util/validateToken.js'), require('./save-chapter-wise-topic.js'));
commonRoute.use('/updateChapterWiseTopic', require('../util/validateToken.js'), require('./update-chapter-wise-topic.js'));
commonRoute.use('/deleteChapterWiseTopic', require('../util/validateToken.js'), require('./delete-chapter-wise-topic.js'));

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