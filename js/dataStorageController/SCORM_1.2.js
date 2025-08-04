/// <reference path="../_references.js" />

var HShell = window.HShell || {},
    SCORM = window.SCORM || {};

HShell.autoSetup = HShell.autoSetup || {};

SCORM.clientSpecific = {
    suspendData: {
        parseSuspendDataPrefix: function(){}
    }
};

(function () {
    var pipwerks = window.pipwerks || {};

    var scormConnection = pipwerks;
    scormConnection.SCORM.version = '1.2';
    scormConnection.SCORM.handleExitMode = false;				// |rework| Not actually rework, we have to understand what is the connection between this and the green ribbon on jZero

    HShell.autoSetup.SCORM = SCORM;

    // ----------------------------
    // --- SCORM object
    // ----------------------------

    SCORM.user_name = new Array('', 'cmi.core.student_name', 'HShell.savedData.user_name');
    SCORM.user_id = new Array('', 'cmi.core.student_id', 'HShell.savedData.user_id');
    SCORM.selected_language = new Array('', 'cmi.student_preference.language', 'HShell.userData.selected_language');
    SCORM.completion_status = new Array('incomplete', 'cmi.core.lesson_status', 'HShell.savedData.completion_status');
    SCORM.success_status = new Array('unknown', 'cmi.success_status', 'HShell.savedData.success_status');
    SCORM.last_location = new Array('start', 'cmi.core.lesson_location', 'HShell.savedData.last_location');			// --- posible options: 'lang' , 'role', 'pre_a', 'audioAvailable' , 'mod', 'post_a'
    SCORM.suspendData = new Array(new Object(), 'cmi.suspend_data', '');

    SCORM.interactionsSaved = new Array(0, 'cmi.interactions._count');
    SCORM.interactionsArray = new Array();

    SCORM.objectivesSaved = new Array(0, 'cmi.objectives._count');
    SCORM.objectivesArray = new Array();
    SCORM.assessmentObjectivesArray = new Array();
    SCORM.objectivesPreSaved = 0;
    SCORM.score = {
        raw: new Array(0, 'cmi.core.score.raw', ''),
        max: new Array(0, 'cmi.core.score.max'),
        min: new Array(0, 'cmi.core.score.min')
    };
    SCORM.exit = new Array('suspend', 'cmi.core.exit');
    SCORM.courseFinished = false;
    SCORM.progress_measure_pattern = new Array('content_completion_status', 'quiz_completion_status');

    SCORM.getAllStoredData = function () {
        var initStatus = scormConnection.SCORM.init();

        if (initStatus) {
            SCORM.SCORMGetOneItem(SCORM.user_name);
            SCORM.SCORMGetOneItem(SCORM.user_id);
            SCORM.SCORMGetOneItem(SCORM.selected_language);
            SCORM.SCORMGetOneItem(SCORM.completion_status);
            SCORM.SCORMGetOneItem(SCORM.interactionsSaved);
            SCORM.SCORMGetOneItem(SCORM.objectivesSaved);
            SCORM.objectivesSaved[0] = Number(SCORM.objectivesSaved[0]);
            SCORM.SCORMGetOneItem(SCORM.score.raw);
            SCORM.SCORMGetOneItem(SCORM.score.max);
            SCORM.SCORMGetOneItem(SCORM.score.min);
            SCORM.SCORMGetOneItem(SCORM.last_location);
            SCORM.SCORMGetOneItem(SCORM.suspendData);

            SCORM.interactionsArray = [];
            SCORM.objectivesArray = SCORMGetAllObjectives();
            SCORM.assessmentObjectivesArray = SCORMGetAllAssessmentObjectives();
        } else {
            HShell.storage.gotoServerErrorMessage();			// 8.dataStorageController.js
            return false;
        }

        if (String(SCORM.suspendData[0].commitCount) == 'undefined') {
            HShell.savedData.user_name = SCORM.user_name[0];
            return false;
        }
        console.log(SCORM.suspendData);
        return {
            user_name: SCORM.user_name[0],
            user_id: SCORM.user_id[0],
            completion_status: SCORM.completion_status[0],
            last_location: SCORM.last_location[0],
            selected_language: SCORM.selected_language[0] === '' ? 'en' : SCORM.selected_language[0],
            role: SCORM.suspendData[0].role,
            roleCode: SCORM.suspendData[0].roleCode,
            roleNoPreAssessment: SCORM.suspendData[0].roleNoPreAssessment,
            commitCount: SCORM.suspendData[0].commitCount,
            preAFinishedModules: SCORM.suspendData[0].preAFinishedModules,
            posAFinishedModules: SCORM.suspendData[0].posAFinishedModules,
            posAAttempts: SCORM.suspendData[0].posAAttempts,

            interactionsArray: SCORM.interactionsArray,
            interactionsCount: SCORM.interactionsSaved[0],
            objectivesArray: SCORM.objectivesArray,
            assessmentObjectivesArray: SCORM.assessmentObjectivesArray,
            obejectivesCount: SCORM.objectivesSaved[0],
            objectivesPreSaved: SCORM.objectivesPreSaved,
            surveyPassed: SCORM.suspendData[0].surveyPassed,

            timeSpendInsideCoures: SCORM.suspendData[0].timeSpendInCourse,
            modulesCustomData: SCORM.suspendData[0].modulesCustomData
        };
    };

    // ________________________________________________________

    SCORM.SCORMGetOneItem = function(item) {
        var parseSuspendDataPrefix = SCORM.clientSpecific.suspendData.parseSuspendDataPrefix;

        if (typeof (item[0]) == 'object') {
            var tempItem = scormConnection.SCORM.get(item[1]);
            if (tempItem.length > 2) {
                if (tempItem.indexOf('|') != -1) {												// --- Used in the SuspendData field
                    var suspendDataString = tempItem.slice(0, tempItem.indexOf('$'));

                    parseSuspendDataPrefix(suspendDataString);		// --- Parses the String and turns it in to one object with multiple items

                    // console.log('SCORM.selected_language');
                    // console.log(SCORM.selected_language);
                    if (SCORM.selected_language.length < 1 ||
                        SCORM.selected_language[0] == '' ||
                        SCORM.selected_language[0] == 'undefined' ||
                        typeof SCORM.selected_language[0] == 'undefined'
                    ) {
                        var suspendDataStringObj = suspendDataString.split('|');
                        var suspendDataLang = suspendDataStringObj[1];
                        if (suspendDataLang && typeof suspendDataLang == 'string' && suspendDataLang != '') {
                            suspendDataLang = suspendDataLang.replace('LA=', '');
                            console.log('suspendDataLang = ' + suspendDataLang);
                            SCORM.selected_language[0] =
                                suspendDataLang && typeof suspendDataLang == 'string' && suspendDataLang != '' ? suspendDataLang : 'null';
                        } else {
                            SCORM.selected_language[0] = 'null';
                        }
                    }

                    tempItem = tempItem.slice(tempItem.indexOf('$') + 1, tempItem.length);
                }

                if (HShell.contentSetup.SCORM_suspendDataCompression) {
                    item[0] = window.jsonpack.unpack(tempItem);
                } else {
                    item[0] = JSON.parse(tempItem);
                }
            }
        } else {
            item[0] = scormConnection.SCORM.get(item[1]);
        }

    }
    SCORM.SCORMSetOneItem = function(place, value) { return scormConnection.SCORM.set(place, value); }

    // ________________________________________________________
    // --- Get all Objectives

    function SCORMGetAllObjectives() {
        var tempAllObjectives = new Array();

        if (String(SCORM.suspendData[0].objectivesArr) != 'undefined') {
            //if (SCORM.objectivesSaved[0] > SCORM.suspendData[0].objectivesArr.length) {		// --- If the saved objectives are more than the SuspendData objectives, this means that there is pre-assessment item
            //	SCORM.objectivesPreSaved = 1;
            //}

            var increaseBy = 0;
            if (HShell.contentSetup.have_pre_a) {
                increaseBy++;
            }

            if (HShell.contentSetup.have_post_a) {
                increaseBy++;
            }

            for (var i = 0; i < SCORM.suspendData[0].objectivesArr.length; i++) {
                var tempObjective = new Object();
                tempObjective.id = SCORM.suspendData[0].objectivesArr[i].modId;

                tempObjective.scoreRaw = Number(scormConnection.SCORM.get('cmi.objectives.' + (i + increaseBy) + '.score.raw'));
                tempObjective.scoreMax = Number(scormConnection.SCORM.get('cmi.objectives.' + (i + increaseBy) + '.score.max'));
                tempObjective.scoreMin = Number(scormConnection.SCORM.get('cmi.objectives.' + (i + increaseBy) + '.score.min'));
                tempObjective.progress_measure = generateObjectFromProgressMeasure(SCORM.suspendData[0].objectivesArr[i].progMeasure);
                tempObjective.completion_status = scormConnection.SCORM.get('cmi.objectives.' + (i + increaseBy) + '.status'); // completionStatusFromProgressMesure(tempObjective.progress_measure);
                tempObjective.scoreScaled = 0;

                tempAllObjectives.push(tempObjective);
            }

        }
        return tempAllObjectives;
    }

    function SCORMGetAllAssessmentObjectives() {
        var allAssessmentObjectives = new Array();
        var objectivesSaved = parseInt(scormConnection.SCORM.get('cmi.objectives._count'));
        var currentAssessmentObjective = {};
        if (objectivesSaved > 0) {
            if (HShell.contentSetup.have_pre_a) {
                currentAssessmentObjective = {};

                currentAssessmentObjective.id = scormConnection.SCORM.get('cmi.objectives.0.id');
                currentAssessmentObjective.scoreRaw = Number(scormConnection.SCORM.get('cmi.objectives.0.score.raw'));
                currentAssessmentObjective.scoreMax = Number(scormConnection.SCORM.get('cmi.objectives.0.score.max'));
                currentAssessmentObjective.scoreMin = Number(scormConnection.SCORM.get('cmi.objectives.0.score.min'));
                currentAssessmentObjective.completion_status = scormConnection.SCORM.get('cmi.objectives.0.status');

                allAssessmentObjectives.push(currentAssessmentObjective);
            }

            if (HShell.contentSetup.have_post_a) {
                var id = 0;
                if (HShell.contentSetup.have_pre_a) {
                    id = 1;
                }

                currentAssessmentObjective = {};

                currentAssessmentObjective.id = scormConnection.SCORM.get('cmi.objectives.' + id + '.id');
                currentAssessmentObjective.scoreRaw = Number(scormConnection.SCORM.get('cmi.objectives.' + id + '.score.raw'));
                currentAssessmentObjective.scoreMax = Number(scormConnection.SCORM.get('cmi.objectives.' + id + '.score.max'));
                currentAssessmentObjective.scoreMin = Number(scormConnection.SCORM.get('cmi.objectives.' + id + '.score.min'));
                currentAssessmentObjective.completion_status = scormConnection.SCORM.get('cmi.objectives.' + id + '.status');

                allAssessmentObjectives.push(currentAssessmentObjective);
            }
        }

        return allAssessmentObjectives;
    }

    function completionStatusFromProgressMesure(pm) {		// --- 'pm' stands for progress measure
        var notAttCout = 0;
        var completeCount = 0;

        $(pm).each(function (i, item) {
            if (item === 'not attempted') { notAttCout++; }
            if (item === 'completed') { completeCount++; }
        });

        if (completeCount === pm.length) return 'completed';
        if (notAttCout === pm.length) return 'not attempted';
        return 'incomplete';
    }

    // ________________________________________________________
    // --- Commit data

    SCORM.continueWithCommit = function (data) {
        SCORMsaveChangedItem(SCORM.selected_language);
        SCORMsaveChangedItem(SCORM.completion_status);
        SCORMsaveChangedItem(SCORM.last_location);

        getSuspendData(data);
        SCORMsaveSuspendData();

        // var sessionTime = HShell.utils.ConvertMilliSecondsIntoSCORM2004Time(HShell.autoSetup.sessionTime * 1000);
        SCORM.SCORMSetOneItem('cmi.core.session_time', HShell.autoSetup.sessionTime * 1000);

        SCORMsaveChangedInteractions();
        SCORMsaveChangedSurvey();
        SCORMsaveChangedObjectives();
        SCORM.SCORMsaveChangedAssessmentObjectives();

        var result = scormConnection.SCORM.data.save();
        if (SCORM.exit[1] == 'suspend') SCORM.SCORMSetOneItem(SCORM.exit[1], SCORM.exit[0]);

        HShell.utils.trace(result, 'SCORM.commit: ');
        if (String(result) == 'false') {
            HShell.storage.gotoServerErrorMessage();
        }
    };

    function SCORMsaveChangedItem(item) {
        var subItems = item[2].split('.');							// Gets the element form the HShell object  (it dose it via string to remove the possibility for object references)
        var tempHshell = window[subItems[0]];
        for (var i = 1; i < subItems.length; i++) { tempHshell = tempHshell[subItems[i]]; }

        if (item[0] != tempHshell) {
            item[0] = tempHshell;
            SCORM.SCORMSetOneItem(item[1], item[0]);
            HShell.utils.trace(item[1], 'SCORM.saveData: ');
        }
    }

    function SCORMsaveSuspendData() {
        var clientSuspendData,
            prefixData;

        SCORM.clientSpecific.suspendData = SCORM.clientSpecific.suspendData || { getData: function () { } };
        clientSuspendData = SCORM.clientSpecific.suspendData;
        prefixData = clientSuspendData.getPrefixData();																// --- gets all the dynamically collected data just before storing in the to LMS

        var itemString = SCORM.suspendData[0];

        if (clientSuspendData.structure) { itemString = clientSuspendData.structure(itemString); }
        if (typeof SCORM.suspendData[0] === 'object') { itemString = JSON.stringify(itemString); }
        if (HShell.contentSetup.SCORM_suspendDataCompression) {
            itemString = jsonpack.pack(itemString);
        }
        if (prefixData) { itemString = prefixData + itemString; }		// --- Adds CS Prefix if needed
        if (clientSuspendData.sufix) { itemString = itemString + clientSuspendData.sufix; }		// --- Adds CS Suffix if needed

        SCORM.SCORMSetOneItem(SCORM.suspendData[1], itemString);
    }

    function SCORMsaveChangedInteractions() {
        if (HShell.contentSetup.have_pre_a) {
            getOneInteractionType(HShell.content.preAssessObj, 'pre');
        }
        if (HShell.contentSetup.have_post_a) {
            getOneInteractionType(HShell.content.postAssessObj, 'post');
        }
        if (HShell.contentSetup.have_final_survey) {
            getOneInteractionType(HShell.content.finalSurveyObj, 'post');
        }
    }

    function SCORMsaveChangedSurvey() {
        if (HShell.contentSetup.have_survey) {
            getOneInteractionType(HShell.content.surveyObj, 'survey');
        }
    }

    function getOneInteractionType(aObj, sections) {
        if (!aObj || !aObj.answersArray) {
            return;
        }
        $(aObj.answersArray).each(function (i, item) {
            if (item.interactionIsSaved) {
                return true;
            }

            var modId = 0,
                modGId = 0;

            $(SL.allModules).each(function (index, itemX) {
                if (item.assessmentModuleId == itemX.mod_id) {
                    modId = itemX.moduleInGroupId + 1;
                    modGId = itemX.moduleGroupId + 1;
                }
            });

            // --- |rework| Please change the names of the variables to make more sense, so that there is no need for comments

            var tempObj = {
                modId: modId,			// --- The ID of the module inside the module group
                modGId: modGId,			// --- The ID of the module group

                module: (aObj.answersArray[i].assessmentModuleId - 1),			// --- The ID of the module (starting from 1 and incrementing 1 for every new module)
                quizArrayId: item.questionGroupId,									// --- The ID of the group of questions
                questionArrId: item.questionId,										// --- The ID of the specific question inside its group
                type: aObj.answersArray[i].questionType,
                sections: sections,

                questionText: aObj.answersArray[i].questionText,
                description: aObj.answersArray[i].selectedItemText,
                learnerResponse: aObj.answersArray[i].learnerResponse,
                result: aObj.answersArray[i].correctState,
                correctAnswer: aObj.answersArray[i].correctAnswer,
                weighting: Math.round(100 / aObj.answersArray.length),
                timeStamp: HShell.utils.convertDateToTime(aObj.answersArray[i].timeStamp),
                latency: HShell.utils.convertSecondsToTime(aObj.answersArray[i].latency),
                attempt: aObj.attempts
            };

            saveOneIneraction(tempObj);		// Inside client specific
            item.interactionIsSaved = true;
        });
    }

    function SCORMsaveChangedObjectives() {
        var tempOriginal = new Array();
        var indexOffset = SCORM.assessmentObjectivesArray.length;		// --- |rework| this must not exist, the logic is somewhat flawed and it requires flag for the initial save, after you close the course and restore it will not need this
        var tempNumberArr = [];	// --- Used for temporary storing the number of the objective inside the group

        $(SL.allModules).each(function (i, item) {
            var compleation = String(item.completion_status).toLowerCase();
            var progress_measure = generateProgressMesarueFromObject(item);
            var scoreRaw = 0;
            var scoreScaled = 0;
            var tempObjectiveId = item.objectiveId + indexOffset;

            if (compleation == 'completed') {
                scoreRaw = 100;
                scoreScaled = 1;
            }
            if (String(tempNumberArr[Number(item.moduleGroupId)]) == 'undefined') {
                tempNumberArr[Number(item.moduleGroupId)] = 1;
            } else {
                tempNumberArr[Number(item.moduleGroupId)] = Number(tempNumberArr[Number(item.moduleGroupId)]) + 1;
            }
            tempOriginal.push({
                id: 'Mod_' + (item.moduleGroupId + 1) + '_' + tempNumberArr[Number(item.moduleGroupId)],
                objectiveId: Number(tempObjectiveId),
                scoreMax: 100,
                scoreMin: 0,
                scoreRaw: scoreRaw,
                scoreScaled: scoreScaled,
                completion_status: item.completion_status,
                progress_measure: progress_measure
            });
        });


        $(tempOriginal).each(function (i, item) {
            if (String(SCORM.objectivesArray[i + SCORM.objectivesPreSaved]) != 'undefined') {			// --- If there is such objective saved and there is difference form the new one -> update it
                var tempOriginalItem = JSON.stringify(item);
                var tempCopyItem = JSON.stringify(SCORM.objectivesArray[i + SCORM.objectivesPreSaved]);


                if (tempOriginalItem != tempCopyItem) {
                    SCORM.objectivesArray[i + SCORM.objectivesPreSaved] = JSON.parse(tempOriginalItem);
                    saveOneObjective(item);
                }
            } else {																						// --- Else -> create it
                SCORM.objectivesArray[i + SCORM.objectivesPreSaved] = JSON.parse(JSON.stringify(item));
                saveOneObjective(item);
                SCORM.objectivesSaved[0]++;
            }
        });
    }

    SCORM.SCORMsaveChangedAssessmentObjectives = function () {
        if (SCORM.assessmentObjectivesArray.length !== 0) {
            var tempNew = [];
            var tempSaved = [];

            if (HShell.contentSetup.have_pre_a) {
                tempNew.push({
                    scoreRaw: typeof HShell.content.preAssessObj.quizArray !== 'undefined' &&
                        HShell.content.preAssessObj.quizArray.length !== 0 &&
                        HShell.content.preAssessObj.correctAnswers == HShell.content.preAssessObj.quizArray.length
                        ? 100
                        : 0,
                    completion_status: HShell.content.preAssessObj.completion_status || 'not attempted'
                });

                tempSaved.push({
                    scoreRaw: SCORM.assessmentObjectivesArray[0].scoreRaw,
                    completion_status: SCORM.assessmentObjectivesArray[0].completion_status
                });
            }

            if (HShell.contentSetup.have_post_a) {
                tempNew.push({
                    scoreRaw: typeof HShell.content.postAssessObj.quizArray !== 'undefined' &&
                        HShell.content.postAssessObj.quizArray.length !== 0 &&
                        HShell.content.postAssessObj.correctAnswers == HShell.content.postAssessObj.quizArray.length ?
                        100 :
                        0,
                    completion_status: HShell.content.postAssessObj.completion_status || 'not attempted'
                });

                var id = 0;
                if (HShell.contentSetup.have_pre_a) {
                    id = 1;
                }
                tempSaved.push({
                    scoreRaw: SCORM.assessmentObjectivesArray[id].scoreRaw,
                    completion_status: SCORM.assessmentObjectivesArray[id].completion_status
                });
            }

            for (var i = 0; i < SCORM.assessmentObjectivesArray.length; i++) {
                if (tempNew[i].completion_status != '' && tempNew[i].completion_status != 'not attempted') {
                    var tempSavedItem = JSON.stringify(tempSaved[i]);
                    var tempNewItem = JSON.stringify(tempNew[i]);

                    if (tempSavedItem != tempNewItem) {
                        SCORM.assessmentObjectivesArray[i].scoreRaw = tempNew[i].scoreRaw;
                        SCORM.assessmentObjectivesArray[i].completion_status = tempNew[i].completion_status;
                        SCORM.assessmentObjectivesArray[i].objectiveId = i;
                        saveOneObjective(SCORM.assessmentObjectivesArray[i]);
                    }
                }
            }
        } else {
            if (HShell.contentSetup.have_pre_a) {
                SCORM.assessmentObjectivesArray[0] = {
                    id: 'Pre_assessment',
                    objectiveId: 0,
                    scoreMax: 100,
                    scoreMin: 0,
                    scoreRaw: 0,
                    scoreScaled: 0,
                    completion_status: 'not attempted',
                    progress_measure: 1
                };

                saveOneObjective(SCORM.assessmentObjectivesArray[0]);
            }

            if (HShell.contentSetup.have_post_a) {
                var id = 0;
                if (HShell.contentSetup.have_pre_a) {
                    id++;
                }
                SCORM.assessmentObjectivesArray[id] = {
                    id: 'Post_assessment',
                    objectiveId: id,
                    scoreMax: 100,
                    scoreMin: 0,
                    scoreRaw: 0,
                    scoreScaled: 0,
                    completion_status: 'not attempted',
                    progress_measure: 1
                };
                saveOneObjective(SCORM.assessmentObjectivesArray[id]);
            }
        }
    };

    function saveOneObjective(item) {
        var i = item.objectiveId;

        SCORM.SCORMSetOneItem('cmi.objectives.' + i + '.id', item.id);
        logLMSResponse('cmi.objectives.' + i + '.id', item.id);

        SCORM.SCORMSetOneItem('cmi.objectives.' + i + '.score.raw', item.scoreRaw);
        logLMSResponse('cmi.objectives.' + i + '.score.raw', item.scoreRaw);

        SCORM.SCORMSetOneItem('cmi.objectives.' + i + '.score.max', item.scoreMax);
        logLMSResponse('cmi.objectives.' + i + '.score.max', item.scoreMax);

        SCORM.SCORMSetOneItem('cmi.objectives.' + i + '.score.min', item.scoreMin);
        logLMSResponse('cmi.objectives.' + i + '.score.min', item.scoreMin);

        SCORM.SCORMSetOneItem('cmi.objectives.' + i + '.status', item.completion_status);
        logLMSResponse('cmi.objectives.' + i + '.status', item.completion_status);

        //SCORM.SCORMSetOneItem('cmi.objectives.' + i + '.progress_measure', item.progress_measure);
    }

    function logLMSResponse(field, value) {
        if (!HShell.globalSetup.demoMode && !HShell.contentSetup.isExtranetCourse) {
            var responseCode = scormConnection.SCORM.API.handle.LMSGetLastError();
            var responseMsg = scormConnection.SCORM.API.handle.LMSGetErrorString(responseCode);
            HShell.utils.trace(field + ' = ' + value);
            HShell.utils.trace(responseCode + ' ' + responseMsg);
        }
    }

    function generateProgressMesarueFromObject(obj) {
        var progM = 0;
        var precision = 10000;      // --- Used to prevent floating point math error

        for (var i = 0; i < SCORM.progress_measure_pattern.length; i++) {
            var temp = progMCompletionStatusToNumber(obj[SCORM.progress_measure_pattern[i]]);
            temp = temp * Math.pow(10, -(i + 1));
            if (temp != 'Infinity' && temp != 'NaN') progM = Math.round((progM * precision) + (precision * temp)) / precision;
        }

        return progM;
    }
    function progMCompletionStatusToNumber(status) {
        var number = 0;

        switch (status) {
            case 'unknown': number = 0; break;        // --- not existing
            case 'not attempted': number = 1; break;        // --- not started
            case 'incomplete': number = 2; break;        // --- started but not finished
            case 'completed': number = 3; break;
        }

        return number;
    }

    function generateObjectFromProgressMeasure(progress_measure) {
        var progM = Number(progress_measure);
        var precision = 10000;      // --- Used to prevent floating point math error
        var positionInPattern = 0;
        var result = new Array();

        do {
            var tempNum = progM * 10;
            var wholePart = Math.floor(tempNum);
            var progM = Math.floor(tempNum * precision - wholePart * precision) / precision;

            result[positionInPattern] = progMNumberToCompletionStatus(wholePart);

            positionInPattern++;
        } while (progM != 0);

        return result;
    }

    function progMNumberToCompletionStatus(status) {
        switch (status) {
            case 0: status = 'unknown'; break;
            case 1: status = 'not attempted'; break;
            case 2: status = 'incomplete'; break;
            case 3: status = 'completed'; break;
        }
        return status;
    }

    function getSuspendData(data) {
        var surveyPassed = HShell.content.surveyObj.finished || false,
            runOnDesktop = +(HShell.autoSetup.runOn.deviceType === HShell.consts.deviceType.desktop);

        SCORM.suspendData[0].deviceType = {MB: +!runOnDesktop, DT: runOnDesktop};
        SCORM.suspendData[0].role = HShell.content.selected_roleObj.code;
        SCORM.suspendData[0].roleCode = HShell.content.selected_roleObj.roleCode;
        SCORM.suspendData[0].roleNoPreAssessment = HShell.content.roleNoPreAssessment;
        SCORM.suspendData[0].commitCount = HShell.autoSetup.commitCount++;
        SCORM.suspendData[0].preAFinishedModules = HShell.content.preAssessObj.finishedModules;
        SCORM.suspendData[0].posAFinishedModules = HShell.autoSetup.postAssessFinishedModules;
        SCORM.suspendData[0].posAAttempts = HShell.content.postAssessObj.attempts;
        SCORM.suspendData[0].objectivesArr = fillSuspendDataObjectives();
        SCORM.suspendData[0].interactionsArr = fillSuspendDataInteractions();
        SCORM.suspendData[0].timeSpendInCourse = HShell.autoSetup.timeSpendInsideCoures;
        SCORM.suspendData[0].surveyPassed = surveyPassed;
        // disable to reduce suspend data size. The field has limited size (4000 chars) on SAP
        // SCORM.suspendData[0].modulesCustomData = data.modulesCustomData;

        if(HShell.userData.selected_brand){
            SCORM.suspendData[0].brand = HShell.userData.selected_brand;
        }
    }

    function fillSuspendDataObjectives() {
        var objectivesArr = new Array();

        if (String(SL.allModules) !== 'undefined') {
            for (var i = 0; i < SL.allModules.length; i++) {
                var tempObj = {};
                tempObj.modId = 'Mod_' + SL.allModules[i].moduleGroupId + '_' + SL.allModules[i].mod_id;
                tempObj.type = SL.allModules[i].type;
                tempObj.progMeasure = generateProgressMesarueFromObject(SL.allModules[i]);

                objectivesArr.push(tempObj);
            }
        }

        return objectivesArr;
    }

    function fillSuspendDataInteractions() {
        var interactionsArr = new Array();



        return interactionsArr;
    }

    SCORM.saveDataOnUnload = function () {
        if (!SCORM.courseFinished) {
            var data = HShell.storage.getCommitData();

            SCORM.continueWithCommit(data);
            scormConnection.SCORM.set('cmi.core.exit', 'suspend');
            scormConnection.SCORM.quit();
        }
    };

    // ________________________________________________________

    SCORM.continueWithSetCourseAsCompleated = function () {
        SCORM.SCORMSetOneItem('cmi.core.session_time', HShell.autoSetup.sessionTime * 1000);

        SCORM.SCORMSetOneItem(SCORM.completion_status[1], 'completed');
        SCORM.SCORMSetOneItem(SCORM.score.raw[1], 100);
        SCORM.SCORMSetOneItem(SCORM.score.min[1], 0);
        SCORM.SCORMSetOneItem(SCORM.score.max[1], 100);
        SCORM.SCORMSetOneItem('cmi.progress_measure', 1);
        SCORM.SCORMSetOneItem(SCORM.exit[1], '');

        SCORM.courseFinished = true;
    };

    SCORM.continueWithsaveCourseEndData = function () {
        // scormConnection.SCORM.connection.terminate();
        SCORM.continueWithSetCourseAsCompleated();
    };

    //	SCORM.saveSuspendData = function(){        SCORM.saveItem( 'cmi.suspend_data', JSON.stringify( SCORM.suspendData ) );        }
    //
})();
