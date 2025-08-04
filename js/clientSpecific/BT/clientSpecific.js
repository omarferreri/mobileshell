// --- Client name: |		BT		|

// ________________________________________________________________________________________________________________________________

var HShell = window.HShell || {},
    SCORM = window.SCORM || {};

HShell.clientSpecific = HShell.clientSpecific || {};
SCORM.clientSpecific = SCORM.clientSpecific || {};

// ****************************
// --- Global var declaration
// ****************************

HShell.clientSpecific.GlobalVarDeclaration = function () {

    // --- Social SharePoint
    have_socialContent = false;
    have_subjectSpecialists = false;
    have_events = false;
    have_discussions = false;
    socialPartsExpected = 0;
    socialPartsLoaded = 0;

    // --- We need this XMLs because of the reporting to the OBI. They are using the order of the items inside the XML for indexing the items inside the assessment. The only way to know the element order is by getting the element form the exact XMl (no easy way to calculate it, and if we actually make it so, it will be very easy to make errors)
    preXML_oldStructure = null;		// --- It will contain the XML object for the English. This means that we assume that the order of the elements in all languages are exactly the same, else the reporting will be inaccurate.
    postXML_oldStructure = null;		// --- Same as the previous item, but for post-assessment.

    if (typeof Audio !== 'undefined') {
        HShell = HShell || {};
        HShell.courseSpecific = HShell.courseSpecific || {};
        HShell.courseSpecific.content = {
            // moduleEndAudio: new Audio()
        };
    }
};

// ________________________________________________________________________________________________________________________________

// ****************************
// --- Read from XMLs
// ****************************

function clientSpecificReadFromConfigXML(settingsXML) {

    // --- Social SharePoint
    $(settingsXML).find('have_socialContent').each(function () {
        have_socialContent = Boolean(Number($(this).attr('state')));
        if (have_socialContent) {
            sharePointSocialSubjectURL = $(this).find('subjectURL').text();

            // --- The next part here, basically cuts the URL, till the subject root sub-site. If you have put another URL in the config file, that is in another sub-site or page inside the subject, the integration will work as well.
            // --- Mainly used because of the Authoring tool, where the user dose not know what is the thing that they have to put in the filed.
            var tempURL = sharePointSocialSubjectURL.slice(sharePointSocialSubjectURL.indexOf('/academy/subject/') + 17, sharePointSocialSubjectURL.length);
            tempURL = tempURL.slice(0, tempURL.indexOf('/'));
            sharePointSocialSubjectURL = sharePointSocialSubjectURL.slice(0, sharePointSocialSubjectURL.indexOf(tempURL) + tempURL.length);
            sharePointSocialSubjectName = $(this).find('subjectName').text();

            have_subjectSpecialists = Boolean(Number($(this).find('have_subjectSpecialists').text()));
            have_events = Boolean(Number($(this).find('have_events').text()));
            have_discussions = Boolean(Number($(this).find('have_discussions').text()));
        }
    });
}

function getClientSpecificXMLs() {
    var xmlsLoaded = 0;
    // --- The next 2 XMLs are user to create the suspend data for the client based on the old structure of the XMLs
    HShell.xml.readFromXml('content/en/pre_oldStructure.xml', getOldStructureXMLPre);			/// --- The path is hard-coded because we assume that the order of the elements inside the XMl in the "en" folder will be the same as all else.
    HShell.xml.readFromXml('content/en/post_oldStructure.xml', getOldStructureXMLPost);

    function getOldStructureXMLPre(xml) {
        preXML_oldStructure = xml;
        xmlsLoaded++;
        checkIfAllXMLsLoaded();
    }

    function getOldStructureXMLPost(xml) {
        postXML_oldStructure = xml;
        xmlsLoaded++;
        checkIfAllXMLsLoaded();
    }

    function checkIfAllXMLsLoaded() {
        if (xmlsLoaded == 2) {		// --- if we load only 2 XMLs the value that we check against will be 2.
            HShell.autoSetup.clientSpecificXMLsLoaded = true;
            continueAfterDataColection();
        }
    }
}

// ________________________________________________________________________________________________________________________________

// ****************************
// --- UI
// ****************************

function buildSocialPart() {
    var html = '';
    if (have_socialContent) {
        html += '<div id="homeSocialContainer" class="rel">';
        html += '<div id="homeSocialLoader"></div>';

        if (have_subjectSpecialists) {
            html += '<div id="homeSocialSubjectSpecialistsContainer" class="rel socialOneItemContainer">';
            html += '<div class="homeSocialTitle langItem noSelect" data-languageItem="subjectSpecialists">' + SL.UI.subjectSpecialists + '</div>';
            html += '<div class="homeSocialInnerContentContainer rel" data-height="405"></div>';
            html += '<a class="homeSocialViewAll rel langItem" data-languageItem="viewAll" href="' + sharePointSocialSubjectURL + '/Pages/SubjectSpecialists.aspx" target="_blank" data-height="35">' + SL.UI.viewAll + '</a>';
            html += '</div>';

            socialPartsExpected++;
        }
        if (have_events) {
            html += '<div id="homeSocialEventsContainer" class="rel socialOneItemContainer">';
            html += '<div class="homeSocialTitle langItem noSelect" data-languageItem="events">' + SL.UI.events + '</div>';
            html += '<div class="homeSocialInnerContentContainer rel" data-height="405"></div>';
            html += '<a class="homeSocialViewAll rel langItem" data-languageItem="viewAll"  href="' + sharePointSocialSubjectURL + '/Pages/EventsList.aspx" target="_blank" data-height="35">' + SL.UI.viewAll + '</a>';
            html += '</div>';

            socialPartsExpected++;
        }
        if (have_discussions) {
            html += '<div id="homeSocialDiscussionsContainer" class="rel socialOneItemContainer">';
            html += '<div class="homeSocialTitle langItem noSelect" data-languageItem="discussions">' + SL.UI.discussions + '</div>';
            html += '<div class="homeSocialInnerContentContainer rel" data-height="405"></div>';
            html += '<a class="homeSocialViewAll rel langItem" data-languageItem="viewAll"  href="' + sharePointSocialSubjectURL + '/Pages/Discussions.aspx" target="_blank" data-height="35">' + SL.UI.viewAll + '</a>';
            html += '</div>';

            socialPartsExpected++;
        }
        html += '<iframe id="sharepointComs" src="http://office.clarityinternational.info:32013/academy/Pages/FrontEndShell.aspx" aria-hidden="true"></iframe>';
    }
    html += '</div>';

    return html;
}

// ________________________________________________________

function buildOneSubjectSpecialist(name, title, imageUrl, linkURL) {
    var html = '';
    html += '<a class="oneSubjectSpecialistContainer rel" href="' + linkURL + '" target="_blank">';
    html += '<div class="oneSubjSpecImage" style="background-image:url(\'' + imageUrl + '\')"></div>';
    html += '<div class="oneSubjSpecDetailesContainer rel">';
    html += '<div class="oneSubjSpecName rel">' + name + '</div>';
    html += '<div class="oneSubjSpecTitle rel">' + title + '</div>';
    html += '</div>';
    html += '</a>';
    return html;
}

// ________________________________________________________

function buildOneEvent(content, date, month, URL) {

    var html = '';
    html += '<a class="oneEventContainer rel" tabindex="0" href="' + URL + '" target="_blank">';
    html += '<div class="oneEventDateContainer rel">';
    html += '<div class="oneEventDate">' + date + '</div>';
    html += '<div class="oneEventMonth">' + month + '</div>';
    html += '</div>';
    html += '<div class="oneEventContent rel">' + content + '</div>';
    html += '</a>';

    return html;
}

// ________________________________________________________

function buildOneDiscussionItem(content, url) {
    if (content.length > 85) {
        content = content.slice(0, 83) + ' ...';
    }
    var html = '';
    html += '<div class="oneDiscussionItem rel" ><a href="' + url + '" target="_blank">' + content + '</a></div>';

    return html;
}

// ________________________________________________________________________________________________________________________________

// ****************************
// --- Go to addOns
// ****************************

// ________________________________________________________

// --- gotoModuleSelection
function clientSpecificHomePageFunctions() {

    // --- Social SharePoint
    $('#homePageContainer').after().append(buildSocialPart());

    if (have_socialContent) enableSocialFunction();
}

// --- Social SharePoint
function enableSocialFunction() {
    $('.homeSocialTitle').parent().children().each(function () {
        if (!$(this).hasClass('homeSocialTitle')) {
            $(this).stop().animate({ height: '0px', marginTop: '0px' });
        }
    });
    $('.homeSocialTitle').click(function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).parent().children().each(function () {
                if (!$(this).hasClass('homeSocialTitle')) {
                    $(this).stop().animate({ height: '0px', marginTop: '0px' });
                }
            });
        } else {
            $('.homeSocialTitle.active').click();
            $(this).addClass('active');
            $(this).parent().children().each(function () {
                if (!$(this).hasClass('homeSocialTitle')) {
                    $(this).stop().animate({ height: $(this).attr('data-height'), marginTop: $(this).attr('data-marginTop') });
                }
            });
        }
    });

    $('#homeSocialContainer').addClass('itemsNumber' + socialPartsExpected);
    var SPSocialEventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';	// --- One is for old IEs the other is for everything else;
    var SPSocialEventer = window[SPSocialEventMethod];
    var SPSocialMessageEvent = SPSocialEventMethod == 'attachEvent' ? 'onmessage' : 'message';	// --- One is for old IEs the other is for everything else;
    var isContentLoaded = false;

    setTimeout(function () {
        if (!isContentLoaded) {
            $('#homeSocialContainer').hide();
        }
    }, 1.5 * Math.pow(10, 4));

    SPSocialEventer(SPSocialMessageEvent, function (e) {
        var responceObj = JSON.parse(e.data);
        socialPartsLoaded++;

        $('#homeSocialContainer').show();
        switch (responceObj.target) {
            case 'subjectSpecialists':
                for (var i = 0; i < responceObj.responce.subjectSpecialists.length; i++) {
                    var r = responceObj.responce.subjectSpecialists[i];
                    $('#homeSocialSubjectSpecialistsContainer .homeSocialInnerContentContainer').append(buildOneSubjectSpecialist(r.name, r.jobDescription, r.pictureURL, r.specialistURL));
                    if (i == 2) {
                        $('.oneSubjectSpecialistContainer').last().addClass('last');
                        break;
                    }
                }
                isContentLoaded = true;
                break;

            case 'recentDiscussions':
                for (var i = 0; i < responceObj.responce.recentDiscussions.length; i++) {
                    var r = responceObj.responce.recentDiscussions[i];
                    $('#homeSocialDiscussionsContainer .homeSocialInnerContentContainer').append(buildOneDiscussionItem(r.discussionTitle, r.discussionURL));
                    if (i == 2) break;
                }
                isContentLoaded = true;
                break;

            case 'events':
                for (var i = 0; i < responceObj.responce.events.length; i++) {
                    var r = responceObj.responce.events[i];
                    var date = new Date(r.date);
                    var monthsArray = HShell.consts.monthsArray;

                    $('#homeSocialEventsContainer .homeSocialInnerContentContainer')
                        .append(buildOneEvent(r.title, date.getDate(), monthsArray[date.getMonth()], r.eventURL));
                    if (i == 2) break;
                }
                isContentLoaded = true;
                break;

            case 'spComsReady':
                var e = new Object();
                e.socialURL = sharePointSocialSubjectURL;
                //console.log(sharePointSocialSubjectURL);
                e.socialSubjectName = sharePointSocialSubjectName;
                e.socialRequestedItems = new Object();
                e.socialRequestedItems.subjectSpecialists = have_subjectSpecialists;
                e.socialRequestedItems.events = have_events;
                e.socialRequestedItems.recentDiscussions = have_discussions;
                var e = JSON.stringify(e);

                document.getElementById('sharepointComs').contentWindow.postMessage(e, '*');
                break;
        }

        $('.socialOneItemContainer').last().addClass('last');

        if (socialPartsLoaded == socialPartsExpected) {
            $('#homeSocialContainer').children().each(function () {
                $(this).stop().slideDown();
            });
            $('#homeSocialLoader').slideUp();
        }
    }, false);
}

// ________________________________________________________

// ________________________________________________________________________________________________________________________________

// ****************************
// --- Data saving (8_2.SCORM_1.2.js)
// ****************************

// ---- For other clients, even if none of the functionality is used, the function must be defined, to prevent errors from happening.
// ---- 'CS' stands for 'Client Specific'
// ---- They are 3 different items that can be used for CS options
// ----		1: 'prefix' (String to be concatenated in the beginning)
// ----		2: 'structure' change (function that runs with parameter the value that must be stored ) Used if you need to make deeper changed on what is stored in the field
// ----		3: 'suffix' (String to be concatenated in the end)
// ---- You can use "getData" function as one of the items in the object. This function will be executed before the other items are used, so you can get the latest data before using it

SCORM.clientSpecific.suspendData = {
    prefixes: {},

    getPrefixData: function () {
        var tempPostTIme = HShell.content.postAssessObj.timeSpend,
            dataPrefix = SCORM.clientSpecific.suspendData.prefixes,
            runOnDesktop = HShell.autoSetup.runOn.deviceType === HShell.consts.deviceType.desktop,
            prefix;

        tempPostTIme = tempPostTIme || 0;
        dataPrefix && (dataPrefix.postTime = dataPrefix.postTime || 0);

        prefix =    'PT=' + HShell.content.selected_roleObj.roleCode + '|' +
                    'LA=' + HShell.userData.selected_language + '|' +
                    addIfNotUndefined(('PRE=' + HShell.content.preAssessObj.timeSpend), dataPrefix.preTime) + '|' +
                    'POST=' + (tempPostTIme + dataPrefix.postTime) + '|' +

                    'TOTAL=' + HShell.autoSetup.timeSpendInsideCoures + '|' +

                    addIfNotUndefined(('CORRECT=' + HShell.content.preAssessObj.correctAnswers), dataPrefix.correctPre) + '|' +
                    addIfNotUndefined(getPreAssessmentAnswers(), dataPrefix.preAnswers) + '|' +
                    addIfNotUndefined(getPostAssessmentAnswers(), dataPrefix.postAnswers) + '|' +

                    'ATTEMPTS=' + HShell.content.postAssessObj.attempts + '|' +
                    'MB=' + (runOnDesktop ? 0 : 1) + '|' +
                    'DT=' + (runOnDesktop ? 1 : 0) +

                    '$';		// in OBI, the $ is used as delimiter between the reporting and the rest of the suspend data.

        return prefix;
    },

    parseSuspendDataPrefix: function(str){
        var tempArr = str.split('|'),
            dataPrefix = SCORM.clientSpecific.suspendData.prefixes;

        dataPrefix.pathTaken = tempArr[0];
        dataPrefix.language = tempArr[1];
        dataPrefix.preTime = tempArr[2];
        dataPrefix.postTime = tempArr[3];
        dataPrefix.postTime = Number(dataPrefix.postTime.slice(5, dataPrefix.postTime.length));
        dataPrefix.totalTime = tempArr[4];
        dataPrefix.correctPre = tempArr[5];
        dataPrefix.preAnswers = tempArr[6];
        dataPrefix.postAnswers = tempArr[7];
    }
};

// --- We need this, because after the course is resumed from suspended state, some of the values are stored only inside the suspendData prefix, since they are not tracked by any other means.
// --- Checks if there is any value in the restored object, and if now, then uses the currently tracked value (even if the value is an empty string)
function addIfNotUndefined(str, value) {
    if (String(value) != 'undefined' && String(value) != '') {
        return value;
    } else { return str; }
}


// --- Generates a string for the suspendData, that represents that answers on the assessment.
// Do not hate me, hate OBI for the next lines of code
function getPreAssessmentAnswers() {
    var answersArray = HShell.content.preAssessObj.answersArray;
    if (answersArray.length == 0) return '';						// This must be confirmed with OBI if we have to have 2 delimiters one after another.

    var str = getPrePostAssessmentAnswersCommon(answersArray, preXML_oldStructure, '_pre_');

    return str;
}

function getPostAssessmentAnswers() {
    var answersArray = HShell.content.postAssessObj.answersArray;
    if (String(answersArray) == 'undefined') return '';
    if (answersArray.length == 0) return '';						// This must be confirmed with OBI if we have to have 2 delimiters one after another.

    var str = getPrePostAssessmentAnswersCommon(answersArray, postXML_oldStructure, '_post_');

    if (SCORM.clientSpecific.suspendData.prefixes.postAnswers == '') {
        SCORM.clientSpecific.suspendData.prefixes.postAnswers = str;
    }
    return str;
}

function getPrePostAssessmentAnswersCommon(answersArray, xml, quizType) {
    var str = "";
    var oldQuestionElements = $(xml).filterNode('ns1:question');
    var oldQuestionsElementsIdsArray = new Array();

    oldQuestionElements.each(function (k, itemK) {
        oldQuestionsElementsIdsArray.push({
            id: $(itemK).attr('id'),
            roleCode: $(itemK).attr('role')
        });
    });

    $(answersArray).each(function (i, item) {
        var inQGroupId = item.questionGroupId;		// --- the ID inside the question group
        var modId = item.assessmentModuleId;
        var oldStructureModuleGroupId = 0;						// --- Default values
        var oldStructureModuleId = 0;
        var correctAnswer = item.correctState;					// --- Indicates if the question is answered correct

        try {
            $(SL.modulesGroupArray).each(function (i2, item2) {
                oldStructureModuleId = 0;							// --- Restarts the count to 0 every time we enter new group, since this indicates the module id inside the group.
                $(item2.modulesArray).each(function (i3, item3) {
                    oldStructureModuleId++;

                    if (item3.mod_id == modId) {
                        oldStructureModuleGroupId = i2 + 1;			// --- The IDs in the old structure start form 1, not form 0.
                        throw 'Loop requirements met';				// --- breaks the loop
                    }
                });
            });
        } catch (e) {
            if (e != 'Loop requirements met'){
                HShell.utils.trace(e.data, 'getPreAssessmentAnswers');
            }
        }

        // --- |rework| if someone can find better performance approach it will be great. I at leas can not think of any.
        var indexOfElement = 0;
        var idOfItemToCompare = 'Mod_' + oldStructureModuleGroupId + '_' + oldStructureModuleId + quizType + inQGroupId;
        $(oldQuestionsElementsIdsArray).each(function (k, itemK) {
            if (itemK.id == idOfItemToCompare && itemK.roleCode == HShell.userData.selected_role) {
                indexOfElement = k + 1;			// --- the index of the elements in the XML is not 0 based but starts from 1
                return false;
            }
        });

        str += indexOfElement + '=' + Number(correctAnswer) + ';';
    });

    str = str.slice(0, (str.length - 1));		// --- removes the last ';' from the string

    return str;
}

// ________________________________________________________

// --- Called from 8_2.SCORM_1.2.js
function saveOneIneraction(item) {
    var i = SCORM.interactionsSaved[0];
    var SCORM2004_INTERACTION_TYPE_FILL_IN = "fill-in";
    var SCORM2004_INTERACTION_TYPE_LONG_FILL_IN = "long-fill-in";
    //if (i == 0) {
    //    i = HShell.content.preAssessObj.finishedModules.length + HShell.autoSetup.postAssessFinishedModules.length;
    //}

    if (item.attempt == 0) item.attempt = 1;
    
    var saveValue = item.quizArrayId + 1;   // since we store this value decreased by 1 (5. -> showInfoPopUp) we need to increment it in order to be the same as xmls
    var groupId = '' + saveValue < 10 ? saveValue + '0' : saveValue;
    var questionId = '' + item.questionArrId < 10 ? '0' + item.questionArrId : item.questionArrId;
    var groupIdAndQuestionId = groupId + questionId;
    var newId = 'Mod_' + item.modGId + '_' + item.modId + '_' + item.sections + '_' + groupIdAndQuestionId;
    var objectives1Id = HShell.utils.capitaliseFirstLetter(item.sections);

    var scormVersion = pipwerks && pipwerks.SCORM ? pipwerks.SCORM.version || '2004' : '2004';

    var result = item.result;
    if (result) {
        result = 'correct';
    } else {
        result = scormVersion === "2004" ? 'incorrect' : 'wrong';
    }

    if (isFinalSurvey == true || localStorage.getItem('isFinalSurvey') === "true") {
        result = 'correct';    // in final survey question answer is always correct
        newId = 'Mod_00_00_post_' + groupIdAndQuestionId;    // id should be Mod_00_00_Post_0 - BT want it like this
    }

    if (item.sections == 'survey') {
        result = 'correct';    // in survey question answer is always correct
        newId = 'Mod_0_0_Post_0';    // id should be Mod_0_0_Post_0 - BT want it like this
        objectives1Id = 'Post';    // initially it is 'survey' - has to be 'Post' since BT want it this way
    }

    var type = item.description.length > 250 ? SCORM2004_INTERACTION_TYPE_LONG_FILL_IN : SCORM2004_INTERACTION_TYPE_FILL_IN;
    var correctAnswerText = item.correctAnswerText || '';
    if (scormVersion === "2004") {
        correctAnswerText = correctAnswerText.replace(/[\^\-()+.:=@;$_!*вЂ™%]/g, "_");
    } else if (scormVersion === "1.2") {
        correctAnswerText = replaceNumbersWithLetters(correctAnswerText);
    }
    SCORM.SCORMSetOneItem('cmi.interactions.' + i + '.id', newId);
    SCORM.SCORMSetOneItem('cmi.interactions.' + i + '.type', type);
    SCORM.SCORMSetOneItem('cmi.interactions.' + i + '.result', result);
    SCORM.SCORMSetOneItem('cmi.interactions.' + i + '.description', item.questionText); // (item.questionText || '').substring(0,20));
    SCORM.SCORMSetOneItem('cmi.interactions.' + i + '.objectives.0.id', 'Mod_' + item.modGId + '_' + item.modId); // ---- For OBI, but not sure if they need it, we just make all the same as the Flash shell, because nobody have any documentation, not us nor the client
    SCORM.SCORMSetOneItem('cmi.interactions.' + i + '.objectives.1.id', objectives1Id + '_assessment');
    SCORM.SCORMSetOneItem('cmi.interactions.' + i + '.weighting', item.weighting);
    SCORM.SCORMSetOneItem('cmi.interactions.' + i + '.latency', item.latency);
    SCORM.SCORMSetOneItem('cmi.interactions.' + i + '.correct_response.0.pattern', correctAnswerText);
    SCORM.SCORMSetOneItem('cmi.interactions.' + i + '.correct_responses.0.pattern', correctAnswerText);
    if (scormVersion === "2004") {
        var userResponse = item.description.replace(/[\^\-()+.:=@;$_!*вЂ™%]/g, "_");
        SCORM.SCORMSetOneItem('cmi.interactions.' + i + '.timestamp', item.timeStamp);
        SCORM.SCORMSetOneItem('cmi.interactions.' + i + '.learner_response', userResponse);
    } else if (scormVersion === "1.2") {
        SCORM.SCORMSetOneItem('cmi.interactions.' + i + '.time', item.timeStamp);
        SCORM.SCORMSetOneItem('cmi.interactions.' + i + '.student_response', replaceNumbersWithLetters(item.learnerResponse));
    }

    SCORM.SCORMGetOneItem(SCORM.interactionsSaved);

    function replaceNumbersWithLetters(item) {
        var newItem = String(item);
        var replaceArr = ['_', 'a', 'b', 'c', 'd', 'e'];
        $(replaceArr).each(function (i, item) {
            newItem = newItem.replaceAll(String(i), item);
        });

        return newItem;
    }
}

// ________________________________________________________

function clientSpecificExitButton() {
    if (window.location.href.indexOf("jlms") > -1) {
        $('#pAllOkFinExitBtnReskin > div, #pAllOkFinExitBtnReskin > button').text("I\'m Done");
        $('#pAllOkFinExitBtnReskin > button').attr('name', "I\'m Done");

        $('#pAllOkFinExitBtnReskin').uniClick(function () {
            top.code.closeSCOContent();
        });
    }
}

function clientSpecific_showEndOfModuleScreen() {       // ex courseSpecific -> courseSpecificModPlayerFinished()
    if (typeof window.courseSpecific_showEndOfModuleScreen == 'function') {
        window.courseSpecific_showEndOfModuleScreen.call(this);
        return;
    }

    var endText = $('.vidPopModEndText');

    if (!endText.hasClass('visible')) {
        endText.addClass('visible');
        $('.vidPopVideoContainer').hide();

        if (selectVideoPlayerMethod() == 0) {
            $('#hiddenAudioElement')[0].audio_play();
            if (HShell.userData.volume_level == 0) {
                $('#hiddenAudioElement')[0].audio_mute();
            }
        } else {
            if (typeof HShell.courseSpecific.content.moduleEndAudio != 'undefined') {
                if (HShell.userData.volume_level != 0) {
                    HShell.courseSpecific.content.moduleEndAudio.play();
                } else {
                    HShell.courseSpecific.content.moduleEndAudio.muted = true;
                }
            }

            if (HShell.autoSetup.runOn.deviceType == 'mobile') {
                $('.vidPopModTitle').attr('tabindex', '0').focus().blur(function () {
                    $(this).attr('tabindex', '-1');
                });
            }
        }

        if (!$('.vidPopFooterContainer').hasClass('courseSpecificEvents')) {
            $('.vidPopFooterContainer').addClass('courseSpecificEvents');
            $('.vidPopBackBtn, .vidPopPlayBtn, .vidPopStopBtn').click(function () {
                if (endText.hasClass('visible')) {
                    setTimeout(function () {
                        endText.hide().removeClass('visible');
                        $('.vidPopVideoContainer').show();
                    }, 301);			// --- this is the "subtitlesRefreshRate" form 7.VideoPlayer.js. For now the video end is checked form the subtitles function, so this is the reason why we have to wait for that in order to be sure that we make the cheks after the video position is checked.
                }
            });
            $('.vidPopMuteBtn').uniClick(function () {
                if (HShell.userData.volume_level == 0) {
                    if (selectVideoPlayerMethod() == 0) {
                        $('#hiddenAudioElement')[0].audio_mute();
                    } else {
                        if(typeof HShell.courseSpecific.content.moduleEndAudio != 'undefined') {
                            HShell.courseSpecific.content.moduleEndAudio.muted = true;
                        }
                    }
                } else {
                    if (selectVideoPlayerMethod() == 0) {
                        $('#hiddenAudioElement')[0].audio_unMute();
                    } else {
                        if(typeof HShell.courseSpecific.content.moduleEndAudio != 'undefined') {
                            HShell.courseSpecific.content.moduleEndAudio.muted = false;
                        }
                    }
                }
            });
        }
    }
}


function clientSpecific_modPlayerStart() { // ex course -> courseSpecificModPlayerStart
    var html = HShell.core.getComponent('EndOfModule__BT').init();

    $(html).insertAfter('.vidPopVideoContainer');
    HShell.core.renderComponents('#moduleVideoContainer');
}

function clientSpecific_addTextToPreAssessmentScreen() {
    if (HShell.userData.selected_role.indexOf('ee') === 0 || HShell.userData.selected_role.indexOf('pl') === 0) {
        $('#preAssessStartScreenTitle').text(SL.UI.label_importantInformation);
        $('<p class="elSubContentContainer purple">' + SL.UI.pre_assessment_additional_text + '</p>').insertAfter('#preAssessStartScreenTitle');
    }
}
