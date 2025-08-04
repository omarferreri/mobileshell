(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var _CopyRight = require("./CopyRight.template");

var HShell = window.HShell || {};

function CopyRight() {}

CopyRight.prototype.render = function () {
  return _CopyRight.templates.main();
};

HShell.core.registerComponent(CopyRight, 'CopyRight');

},{"./CopyRight.template":2}],2:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var templates = {
  main: function main() {
    return "<span class=\"copyRight\">\n                <a href=\"mailto:\">\n                    &copy;\n            </span>";
  }
};
exports.templates = templates;

},{}],3:[function(require,module,exports){
var _CourseInfo = require("./CourseInfo.template");

var HShell = window.HShell || {};

function CourseInfo() {
  this.SL = HShell.content.selected_languageObj;
}

CourseInfo.prototype.render = function (_ref) {
  var hasLogo = _ref.hasLogo,
      hasTitle = _ref.hasTitle,
      hasDescription = _ref.hasDescription,
      hasSubtitle = _ref.hasSubtitle;
  var UI = this.SL.UI;
  return _CourseInfo.templates.main({
    hasLogo: hasLogo,
    hasTitle: hasTitle,
    hasDescription: hasDescription,
    hasSubtitle: hasSubtitle,
    UI: UI
  });
};

HShell.core.registerComponent(CourseInfo, 'CourseInfo');

},{"./CourseInfo.template":4}],4:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var templates = {
  main: main
};
exports.templates = templates;

function main(_ref) {
  var UI = _ref.UI,
      hasDescription = _ref.hasDescription,
      hasSubtitle = _ref.hasSubtitle;
  var description = !hasDescription ? '' : "<p id=\"homeInfoDescription\" class=\"rel langItem\" data-languageItem=\"course_description\">\n            ".concat(UI.course_description, "\n        </p>");
  var subTitle = !hasSubtitle ? '' : "<h2 id=\"homeInfoSubTitle\" class=\"rel langItem\" data-languageItem=\"home\">\n            ".concat(UI.home, "\n        </h2>");
  return "\n            <div id=\"homeInfoContainer\" class=\"CourseInfo__Container rel\">\n                <div class=\"CourseInfo__TitleContainer rel\">\n                    <h1 class=\"CourseInfo__Title rel langItem\" data-languageItem=\"course_title\" role=\"heading\" aria-level=\"1\">".concat(UI.course_title, "</h1>\n                    <div id=\"homeInfoCompanyLogo\" class=\"CourseInfo__Logo\" aria-label=\"Company logo image.\"></div>\n                </div>\n\n                ").concat(subTitle, "\n                ").concat(description, "\n            </div>\n        ");
}

},{}],5:[function(require,module,exports){
var _EndOfModule__BT = require("./EndOfModule__BT.template");

var HShell = window.HShell || {};

function EndOfModule__BT() {
  this.SL = HShell.content.selected_languageObj;
}

EndOfModule__BT.prototype.prepareAudio = function () {
  if (window.selectVideoPlayerMethod() != HShell.consts.videoPlayerMethod.flash && typeof HShell.courseSpecific.content.moduleEndAudio != 'undefined') {
    var audio = HShell.courseSpecific.content.moduleEndAudio;
    audio.src = '' + audio.src;

    audio.oncanplaythrough = function () {
      audio.pause();
    };
  }
};

EndOfModule__BT.prototype.onComponentRender = function () {
  this.prepareAudio();
};

EndOfModule__BT.prototype.render = function () {
  return _EndOfModule__BT.templates.main({
    HShell: HShell,
    SL: this.SL
  });
};

HShell.core.registerComponent(EndOfModule__BT, 'EndOfModule__BT');

},{"./EndOfModule__BT.template":6}],6:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var templates = {
  main: main
};
exports.templates = templates;

function main(_ref) {
  var HShell = _ref.HShell,
      SL = _ref.SL;
  return "\n        <div class=\"vidPopModEndText rel\">\n            <div class=\"vidPopModTextContainer\">\n                <div class=\"vidPopModTitle\">".concat(SL.UI.title_endOfMod, "</div>\n                <div class=\"vidPopModDescription\">").concat(SL.UI.text_endOfMod, "</div>\n            </div>\n            <div class=\"vidPopModLogoContainer\" aria-hidden=\"true\">\n                <span class=\"vAlignHelper\"></span>\n                <img\n                    class=\"vidPopModEndLogo\"\n                    src=\"css/branding/brand_").concat(HShell.config.brandName, "/images/videoModuleEnd/modPass.png\">\n                </img>\n            </div>\n        </div>\n    ");
}

},{}],7:[function(require,module,exports){
var _AccessibilityTab = require("./AccessibilityTab.template");

var HShell = window.HShell || {};

function AccessibilityTab() {}

AccessibilityTab.prototype.render = function () {
  var SL = HShell.content.selected_languageObj,
      icons = HShell.consts.iconsObj,
      UI = SL.UI;

  var templ = _AccessibilityTab.templates.main({
    UI: UI,
    icons: icons
  });

  return templ;
};

HShell.core.registerComponent(AccessibilityTab, 'HeaderAccessibilityTab');

},{"./AccessibilityTab.template":8}],8:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var burger_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><style>.cls-1{fill:none;}</style></defs><path d="M36,23H12a1,1,0,0,0,0,2H36A1,1,0,0,0,36,23Z"/><path d="M12,17H36a1,1,0,0,0,0-2H12A1,1,0,0,0,12,17Z"/><path d="M36,31H12a1,1,0,0,0,0,2H36A1,1,0,0,0,36,31Z"/><rect class="cls-1" width="48" height="48"/></svg>';
var templates = {
  main: function main(_ref) {
    var UI = _ref.UI,
        icons = _ref.icons;
    return "\n            <div id=\"hPageHAccessibilityContainer\" class=\"hPageHContainer\">\n                <h1 class=\"hPageHTitleContainer langItem rel noSelect\"\n                    data-languageItem=\"accessibilityTitle\"\n                >\n                    ".concat(UI.accessibilityTitle, "\n                </h1>\n                <div id=\"hPageHItemContainer\" class=\"rel\">\n                    <div class=\"accessabilityGeneralNav rel\">\n                        <h2 class=\"accessSubTitle langItem\"\n                            data-languageItem=\"accessibilityGeneralNavigation\"\n                        >\n                            ").concat(UI.accessibilityGeneralNavigation, "\n                        </h2>\n                        <div class=\"accessSubTitleExtraText langItem\"\n                            data-languageItem=\"accessibilityGNExtraText\"\n                        >\n                            ").concat(UI.accessibilityGNExtraText, "\n                        </div>\n                        <div class=\"offScreen\"></div>\n                    </div>\n                    <div class=\"accessabilityMainMenu rel\">\n                        <h2 class=\"accessSubTitle subTitlePadding langItem\"\n                            data-languageItem=\"accessibilityMainMenu\"\n                        >\n                            ").concat(UI.accessibilityMainMenu, "\n                        </h2>\n                        <ul class=\"accessButtonsContainer\">\n                            <li class=\"accessButtonsOneItem rel\" aria-hidden=\"true\">\n                                <div class=\"keyBoardShortcut\" aria-hidden=\"true\">ctrl+ alt+</div>\n                            </li>\n\n                            <li class=\"accessButtonsOneItem rel\">\n                                ").concat(accessibilityHintsCommonLong(UI, 'h', 'alt_homeAccessibilityButton'), "\n                                <span class=\"icon-button_outline iconHolder\" aria-hidden=\"true\">").concat(icons.icon_button_outline, "</span>\n                                <span class=\"icon-character\" aria-hidden=\"true\">H</span>\n                                <span class=\"icon-home iconHolder menu-icon\" aria-hidden=\"true\">").concat(icons.icon_home, "</span>\n                                <div class=\"icon-border\" aria-hidden=\"true\"></div>\n                            </li>\n                            ", "\n                            <li class=\"accessButtonsOneItem rel\">\n                                ").concat(accessibilityHintsCommonLong(UI, 'A', 'alt_accessibilityButton'), "\n                                <span class=\"icon-button_outline iconHolder\" aria-hidden=\"true\">").concat(icons.icon_button_outline, "</span>\n                                <span class=\"icon-character\" aria-hidden=\"true\">A</span>\n                                <span class=\"icon-accessibility iconHolder menu-icon\" aria-hidden=\"true\">").concat(icons.icon_accessibility, "</span>\n                                <div class=\"icon-border\" aria-hidden=\"true\"></div>\n                            </li>\n                            ").concat(!HShell.contentSetup.module_layouts_home_button ? "<li class=\"accessButtonsOneItem rel\">\n                                    ".concat(accessibilityHintsCommonLong(UI, 'P', 'alt_menuAccessibilityButton'), "\n                                    <span class=\"icon-button_outline iconHolder\" aria-hidden=\"true\">").concat(icons.icon_button_outline, "</span>\n                                    <span class=\"icon-character p\" aria-hidden=\"true\">P</span>\n                                    <span class=\"icon-accessibility iconHolder menu-icon n\" aria-hidden=\"true\">").concat(burger_icon, "</span>\n                                </li>") : '', "\n                        </ul>\n                    </div>\n\n                    <div class=\"accessabilityPlayerControles rel\">\n                        <h2 class=\"accessSubTitle subTitlePadding langItem\" data-languageItem=\"accessibilityPlayerControles\">").concat(UI.accessibilityPlayerControles, "</h2>\n                        <ul  class=\"accessButtonsContainer\">\n                            <li class=\"accessButtonsOneItem rel\" aria-hidden=\"true\">\n                                <div class=\"keyBoardShortcut\" aria-hidden=\"true\">ctrl+ alt+</div>\n                            </li>    \n                            <li class=\"accessButtonsOneItem rel\">\n                                ").concat(accessibilityHintsCommonShort(UI, 'I', 'alt_videoRewind'), "\n                                <span class=\"icon-button_outline iconHolder\" aria-hidden=\"true\">").concat(icons.icon_button_outline, "</span>\n                                <span class=\"icon-character i\" aria-hidden=\"true\">I</span>\n                                <span class=\"icon-Rewind iconHolder menu-icon\" aria-hidden=\"true\">").concat(icons.icon_Rewind, "</span>\n                                <div class=\"icon-border\" aria-hidden=\"true\"></div>\n                            </li>\n\n                            <li class=\"accessButtonsOneItem rel\">\n                                ").concat(accessibilityHintsCommonShort(UI, 'K', 'alt_videPlayPause'), "\n                                <span class=\"icon-button_outline iconHolder\" aria-hidden=\"true\">").concat(icons.icon_button_outline, "</span>\n                                <span class=\"icon-character\" aria-hidden=\"true\">K</span>\n                                <span class=\"icon-Play iconHolder menu-icon\" aria-hidden=\"true\">").concat(icons.icon_Play, "</span>\n                                <div class=\"icon-border\" aria-hidden=\"true\"></div>\n                            </li>\n\n                            <li class=\"accessButtonsOneItem rel\">\n                                ").concat(accessibilityHintsCommonShort(UI, 'S', 'alt_videoStop'), "\n                                <span class=\"icon-button_outline iconHolder\" aria-hidden=\"true\">").concat(icons.icon_button_outline, "</span>\n                                <span class=\"icon-character\" aria-hidden=\"true\">S</span>\n                                <span class=\"icon-Stop iconHolder menu-icon\" aria-hidden=\"true\">").concat(icons.icon_Stop, "</span>\n                                <div class=\"icon-border\" aria-hidden=\"true\"></div>\n                            </li>\n\n                            <li class=\"accessButtonsOneItem rel\">\n                                ").concat(accessibilityHintsCommonShort(UI, 'M', 'alt_VideoMute'), "\n                                <span class=\"icon-button_outline iconHolder\" aria-hidden=\"true\">").concat(icons.icon_button_outline, "</span>\n                                <span class=\"icon-character m\" aria-hidden=\"true\">M</span>\n                                <span class=\"icon-Sound_volume_2 iconHolder menu-icon\" aria-hidden=\"true\">").concat(icons.icon_Sound_volume_2, "</span>\n                            </li>\n                        </ul>\n                    </div>\n                </div>\n            </div>\n            ");
  }
};
exports.templates = templates;

function accessibilityHintsCommonLong(UI, key, text) {
  return "<span class=\"keyCombo offScreen\">".concat(UI.alt_pressCombination_p1).concat(key, " ").concat(UI.alt_pressCombination_p2, " ").concat(UI[text], ".</span>"); // `<span
  //     class="langItem langAlt keyCombo offScreen"
  //     data-languageItem="${key.toLowerCase()}"
  //     data-languageItemP1="alt_pressCombination_p1"
  //     data-languageItemp2="alt_pressCombination_p2"
  //     data-languageItemp3="${text}"`
}

function accessibilityHintsCommonShort(UI, key, text) {
  return "<span class=\"keyCombo offScreen\">".concat(UI.alt_pressCombination_p1).concat(key, " ").concat(UI.alt_pressCombination_p2, " ").concat(UI[text], ".</span>");
}

},{}],9:[function(require,module,exports){
var _Header = require("./Header.template");

var HShell = window.HShell || {};

function MainHeader() {}

MainHeader.prototype.onComponentRender = function () {
  window.reskinAllContent($('#homePageHeaderButtonsContainer'));
  handlePostAssessmentButton();
  bindEvents();
  this.$on('locationChange', this.onLocationChange.bind(this));
  this.$on('Module__CompleationStatus--change', this.onModuleCompleationStatusChange.bind(this));
};
/**
 * Needs to be removed from inside the component, and have the same logic inside a page component.
 */


MainHeader.prototype.onLocationChange = function (payload) {
  var locations = HShell.consts.locations;

  switch (payload.newLocation) {
    case locations.moduleSelect:
    case locations.slides:
      $(this._wrapper.querySelector('.MainHeader'))[this.isVisible ? 'removeClass' : 'addClass']('MainHeader--hidden');
      break;

    case locations.survey:
    case locations.post_eval:
    case locations.post_assessment:
      if (!+HShell.content.configXMLObject.config.mainSettings.postAssessment.header) {
        $(this._wrapper.querySelector('.MainHeader')).addClass('MainHeader--hidden');
      }

      break;

    default:
      $(this._wrapper.querySelector('.MainHeader')).removeClass('MainHeader--hidden');
  }
};

MainHeader.prototype.render = function (_ref) {
  var isVisible = _ref.isVisible;
  var headerOptions = HShell.content.configXMLObject.config.mainSettings.header,
      SL = HShell.content.selected_languageObj,
      UI = SL.UI,
      isCourseFinished = HShell.savedData.completion_status === 'completed',
      runsOnIos = HShell.autoSetup.runOn.OS === 'iOS',
      newToCompany = HShell.content.selected_roleObj.code == 'newToCompany' || HShell.contentSetup.have_pre_a === false || HShell.content.roleNoPreAssessment === true;
  var settings = {
    UI: UI,
    HShell: HShell,
    icons: HShell.consts.iconsObj,
    isCourseFinished: isCourseFinished,
    newToCompany: newToCompany,
    hasTutorial: HShell.contentSetup.have_tutorial && !!+headerOptions.tutorial,
    hasA11y: !runsOnIos && !!+headerOptions.a11y,
    hasMyProgress: !!+headerOptions.progress,
    accessLanguageText: "".concat(UI.access_languageSelect, " ").concat(UI.access_menu),
    accessTutorialText: "".concat(UI.access_replay, " ").concat(UI.tutorial),
    accessAccessText: "".concat(UI.access_accessibility, " ").concat(UI.access_menu),
    accessHomeText: UI.access_backHome,
    accessStatusText: "".concat(UI.myProgres, " ").concat(UI.access_menu),
    assessmentButtonText: isCourseFinished ? UI.postAssessmentDone : UI.startPostAssessment,
    assessmentButtonLangItem: isCourseFinished ? 'postAssessmentDone' : 'startPostAssessment',
    postAssessmentToolTip: newToCompany ? SL.UI.courseComplete_TextNew : SL.UI.courseComplete_Text,
    postAssessmentToolTipLanguageItem: newToCompany ? 'courseComplete_TextNew' : 'courseComplete_Text',
    isVisible: isVisible
  };
  this.isVisible = isVisible;
  return _Header.templates.main(settings);
};

MainHeader.prototype.onStatusClicked = function (e, originalTarget) {
  var thisItem = $(originalTarget);

  switch (HShell.savedData.last_location) {
    case 'mod_select':
    case 'post_a':
    case 'post_evalPage':
    case 'survey':
    case 'final_survey':
      toggleDropDownHeaderMenu(thisItem, function () {
        HShell.utils.lockFocusToContainer('#hPageHMenusContainer', '#hPageHStatusButton > button', '#mainContentContainer');
        $('#eLearningGenericContainer').attr('aria-hidden', true);
      }, e);

      if (HShell.savedData.last_location != 'mod_select') {
        $('.oneProgressItemInnner').attr('tabindex', '-1');
      } else {
        $('.oneProgressItemInnner').attr('tabindex', '0');
      }

      break;
  }
};

MainHeader.prototype.closeActiveDropDown = function () {
  var buttonElement = $(this._wrapper).find('.hPageHBtn.active[data-uniclick]'),
      funcToExecute = buttonElement.attr('data-uniclick');

  if (funcToExecute) {
    this[funcToExecute]({}, buttonElement);
  }
};

MainHeader.prototype.onTutorialClicked = function () {
  switch (HShell.savedData.last_location) {
    case 'mod_select':
    case 'post_a':
    case 'post_evalPage':
    case 'survey':
    case 'final_survey':
      $('.hPageHBtn.active').click();
      var originalLocation = HShell.savedData.last_location;
      window.changeLastLocation('tutorial_popUp');
      window.gotoTutorial(false, originalLocation);
      break;
  }
};

MainHeader.prototype.onHomeButtonClicked = function (e, originalTarget) {
  var $OriginalTarget = $(originalTarget);

  if ($OriginalTarget.attr('clickedTimeout') != 'true') {
    // ---- Prevents the user form very fast clicking the button several times
    $OriginalTarget.attr('clickedTimeout', 'true');

    switch (HShell.savedData.last_location) {
      case 'mod_select':
      case 'module_slides':
      case 'module_layouts':
      case 'langSelect':
      case 'newToCompany':
      case 'brandSelect':
      case 'roleSelect':
      case 'warningScreen':
      case 'newsScreen':
      case 'audioAvailable':
      case 'intro':
      case 'tutorial':
      case 'peopleManager':
      case 'pre_a':
        break;

      case 'post_a':
      case 'post_evalPage':
      case 'survey':
      case 'final_survey':
        $('.hPageHBtn.active').click();

        if ($OriginalTarget.hasClass('directGoToHome')) {
          $('#mainContentContainer').show();
          $('.oneModuleQuizButtonContainer.active').click();
          window.removePostAssessmentScreen();
        } else {
          window.closePostAssessment();
          $OriginalTarget.find('button').attr('tabindex', '0');
        }

        break;

      case 'module_video':
      case 'module_iframe':
        $('.vidPopClose').click(); // --- |rework| I do not like the feeling of clicking the buttons like this. We must have a function in the activeVideo object for this.

        break;

      default:
        $('#eLearningGenericContainer').remove();
        $('#mainContentContainer').show();
        $('#postAssessmentLaunchButton').addClass('finished').unbind('click').removeAttr('tabindex').removeAttr('role');
        $('#postAssessmentLaunchButtonContainer, #postAssessmentLaunchButton').show();
        $('#postAssessmentLaunchButtonText').text(window.SL.UI.postAssessmentDone).attr('data-languageitem', 'postAssessmentDone');
        HShell.savedData.completion_status = 'completed';
    }
  }

  setTimeout(function () {
    // ---- Prevents the user form very fast clicking the button several times
    $OriginalTarget.attr('clickedTimeout', 'false');
  }, 500);
};

MainHeader.prototype.onA11yButtonClicked = function (e, originalTarget) {
  // switch (HShell.savedData.last_location) {
  //     case 'mod_select':
  //     case 'post_a':
  //     case 'post_evalPage':
  //     case 'survey':
  toggleDropDownHeaderMenu($(originalTarget), function () {
    HShell.utils.lockFocusToContainer('#hPageHMenusContainer', '#hPageHAccessibilityButton', '#mainContentContainer');
  }, e); //         break;
  // }
};

MainHeader.prototype.onModuleCompleationStatusChange = function () {
  window.restoreProgressFromArray();
};

function handlePostAssessmentButton() {
  if (HShell.contentSetup.postAssessmentMode == 'paralel') {
    if (!HShell.contentSetup.have_post_a) {
      $('#postAssessmentLaunchButton').remove();
    }
  }
}

function toggleDropDownHeaderMenu(thisButton, afterSlideDownFun) {
  $('.closeMenuButtonContainer').stop().fadeIn();

  if (!thisButton.hasClass('active') && !thisButton.hasClass('home') && !thisButton.hasClass('tutorial')) {
    $('.hPageHBtn').removeClass('active');
    thisButton.addClass('active');
    $('.hPageHContainer').stop().slideUp();
    $('#hPageHeaderGrayBG').stop().fadeIn();
    $('#homePageHeaderButtonsContainer').addClass('expanded');
    $('#' + thisButton.attr('targetDiv')).stop().slideDown(function () {
      $(thisButton.attr('readItem')).focus();
      $('.accessibilityBtn').each(function () {
        if (!$(this).hasClass('active')) {
          $(this).attr('aria-hidden', 'true');
        } else {
          $(this).find('.showHideIndicator').text('');
          $('.closeMenuButtonArrow').attr('aria-label', $(this).find('.showHideIndicator').parent().text());
        }
      }); //|rework| lock and unlock should be reworked, lock the wrapper

      HShell.utils.unlockFocusFromContainer();

      if (thisButton.attr('id') == 'hPageHStatusButton') {
        var myProgressText = $('#hPageHProgTitleLabel').text();
        var myProgressPercentage = $('#hPageHProgTitleProcentage').text();
        HShell.a11y.speak(myProgressText + ' is ' + myProgressPercentage + '.');
      }

      afterSlideDownFun();
    });
    $('#SCORM_Container').css('overflow', 'hidden');
  } else {
    $('.accessibilityBtn.active').find('.showHideIndicator').text('');

    if (HShell.autoSetup.lastUserInteraction == 'keyboard') {
      $('.accessibilityBtn.active > button').focus();
    }

    $('.closeMenuButtonArrow').attr('aria-label', $(this).find('.showHideIndicator').parent().text());
    $('.hPageHBtn').removeClass('active');
    $('#' + thisButton.attr('targetDiv')).stop().slideUp();
    $('.accessibilityBtn').removeAttr('aria-hidden');
    $('.closeMenuButtonContainer').stop().fadeOut();
    $('#homePageHeaderButtonsContainer').removeClass('expanded');
    $('#hPageHeaderGrayBG').stop().fadeOut(function () {
      HShell.utils.unlockFocusFromContainer('#mainContentContainer');
      $('#eLearningGenericContainer').attr('aria-hidden', false);
    });
    $('#SCORM_Container').css('overflow', 'auto');
  }

  var isExpanded = $('#hPageHAccessibilityButton').hasClass('active');
  $('#hPageHAccessibilityButton').attr('aria-expanded', isExpanded);
}

function bindEvents() {
  $('.hPageHBtn > button').focus(function () {
    $('.hPageHBtn').removeClass('Focus');
    $(this).parent().addClass('Focus');
  });
  $('.hPageHBtn > button').blur(function () {
    $('.hPageHBtn').removeClass('Focus');
  });
}

HShell.core.registerComponent(MainHeader, 'MainHeader'); //$('#hPageHLanguageButton').click(function (e) {
//    switch (HShell.savedData.last_location) {
//        case 'mod_select':
//            toggleDropDownHeaderMenu($(this), function () {
//                lockFocusToContainer('#hPageHMenusContainer', '#hPageHLanguageButton > button', '#mainContentContainer');
//            }, e);
//            if ($(this).hasClass('active')) {
//                //$('.oneHeaderLanguageContainer.autoFocus .oneFlagContainer').focus();
//            }
//            HShell.a11y.speak($('#hPageHLanguageContaienr .hPageHTitleContainer').text());
//            break;
//    }
//});

},{"./Header.template":10}],10:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var templates = {
  main: function main(settings) {
    var courseFinClass = settings.isCourseFinished ? 'finished' : '',
        assessmentStile = settings.isCourseFinished ? 'style="display:block !important"' : '',
        class_newToCompany = settings.newToCompany ? '.short' : '',
        class_hidden = !settings.isVisible ? 'MainHeader--hidden' : '';
    var postAssessmentTooltipSettings = {
      targetId: 'postAssessmentLaunchButton',
      selector: '#postAssessmentLaunchButtonTooltipContainer' + class_newToCompany,
      text: settings.postAssessmentToolTip,
      languageItem: settings.postAssessmentToolTipLanguageIte
    };
    return "\n                <div id=\"homePageHeaderContainer\" class=\"MainHeader ".concat(class_hidden, "\" style=\"zoom:1\">\n                    <div id=\"homePageHeaderButtonsContainer\" class=\"noSelect\">\n                       ").concat(settings.hasMyProgress ? myProgres(settings) : '', "\n\n                        ").concat(settings.hasTutorial ? hasTutorial(settings) : '', "\n                        ").concat(settings.hasA11y ? a11yBUtton(settings) : '', "\n\n                        <div\n                            id=\"hPageHHomeButton\"\n                            class=\"hPageHBtn accessibilityBtn home\"\n                            accessibilityBtnTitle=\"").concat(settings.accessHomeText, "\"\n                            data-uniclick=\"onHomeButtonClicked\"\n                        >\n                            <div class=\"iconHolder\" aria-hidden=\"true\">").concat(settings.icons.icon_home, "</div>\n                            <div class=\"borderR\" aria-hidden=\"true\"></div>\n                            ").concat(settings.HShell.core.getComponent('Tooltip').init({
      targetId: 'hPageHHomeButton',
      text: settings.UI.home,
      languageItem: 'home'
    }), "\n                        </div>\n\n                        ", "\n                    </div>\n\n                    <div id=\"hPageHeaderGrayBG\" data-click=\"closeActiveDropDown\"></div>\n\n                    ").concat(settings.HShell.core.getComponent('HeaderProgressTab').init(), "\n                    ").concat(settings.HShell.core.getComponent('HeaderAccessibilityTab').init(), "\n\n                    <div id=\"hPageHLanguageContaienr\" class=\"hPageHContainer\">\n                        <div class=\"hPageHTitleContainer langItem rel noSelect\" data-languageItem=\"label_language_select\">").concat(settings.UI.label_language_select, "</div>\n                        <ul id=\"hPageHLanguageInnerContainer\" class=\"rel\" role=\"listbox\"></ul>\n                    </div>\n\n                    ", "\n                </div>\n            ");
  }
};
exports.templates = templates;

function hasTutorial(settings) {
  return "\n            <div\n                id=\"hPageHTutorialButton\"\n                class=\"hPageHBtn accessibilityBtn tutorial\"\n                accessibilityBtnTitle=\"".concat(settings.accessTutorialText, "\"\n                data-uniclick=\"onTutorialClicked\"\n            >\n                <div class=\"iconHolder\" aria-hidden=\"true\">").concat(settings.icons.icon_header_TutorialIcon, "</div>\n                <div class=\"borderR\" aria-hidden=\"true\"></div>\n                ").concat(settings.HShell.core.getComponent('Tooltip').init({
    targetId: 'hPageHTutorialButton',
    text: settings.UI.rePlayTutorial,
    languageItem: 'rePlayTutorial'
  }), "\n            </div>\n        ");
}

function a11yBUtton(settings) {
  return "\n            <div\n                id=\"hPageHAccessibilityButton\"\n                class=\"hPageHBtn accessibilityBtn\"\n                buttonStateToggle=\"true\"\n                accessibilityBtnTitle=\"".concat(settings.accessAccessText, "\"\n                targetDiv=\"hPageHAccessibilityContainer\"\n                readItem=\"#hPageHAccessibilityContainer .hPageHTitleContainer\"\n                data-uniclick=\"onA11yButtonClicked\"\n                aria-expanded=\"false\"\n                role=\"button\"\n                aria-label=\"").concat(settings.accessAccessText, "\"\n                tabindex=\"0\"\n            >\n                <div class=\"iconHolder a11yIcon\" aria-hidden=\"true\">").concat(settings.icons.icon_accessibility, "</div>\n                <div class=\"iconHolder closeIcon\" aria-hidden=\"true\">").concat(settings.icons.icon_exit, "</div>\n                <div class=\"borderR\" aria-hidden=\"true\"></div>\n                ").concat(settings.HShell.core.getComponent('Tooltip').init({
    targetId: 'hPageHAccessibilityButton',
    text: settings.UI.accessibilityControls,
    languageItem: 'accessibilityControls'
  }), "\n            </div>\n        ");
}

function myProgres(_ref) {
  var HShell = _ref.HShell,
      accessStatusText = _ref.accessStatusText,
      icons = _ref.icons,
      UI = _ref.UI;
  return "\n            <div\n                id=\"hPageHStatusButton\"\n                class=\"hPageHBtn accessibilityBtn\"\n                buttonStateToggle=\"true\"\n                accessibilityBtnTitle=\"".concat(accessStatusText, "\"\n                targetDiv=\"hPageHProgressContainer\"\n                data-uniclick=\"onStatusClicked\"\n            >\n                <div class=\"iconHolder\" aria-hidden=\"true\">").concat(icons.icon_status, "</div>\n                <div class=\"borderR\" aria-hidden=\"true\"></div>\n                ").concat(HShell.core.getComponent('Tooltip').init({
    targetId: 'hPageHStatusButton',
    text: UI.myProgres,
    languageItem: 'myProgres'
  }), "\n            </div>\n        ");
}

function buildCloseButton(settings) {
  return "\n            <div class=\"closeMenuButtonContainer noSelect\">\n                <div\n                    class=\"closeMenuButtonArrow abs iconHolder\"\n                    role=\"button\"\n                    tabindex=\"0\"\n                    aria-label=\"close menu\"\n                    data-uniclick=\"closeActiveDropDown\"\n                >\n                    <span class=\"offScreen\">' + settings.UI.close + '</span>\n                    <span>".concat(settings.icons.icon_arrow_up, "</span>\n                </div>\n                <div class=\"closeMenuButtonCircle abs iconHolder\" aria-hidden=\"true\">").concat(settings.icons.icon_circle, "</div>\n                <div class=\"closeMenuButtonOuterCircle abs iconHolder\" aria-hidden=\"true\">").concat(settings.icons.icon_circle, "</div>\n            </div>\n        ");
}

},{}],11:[function(require,module,exports){
var _ProgressTab__Item = require("./ProgressTab__Item.template");

var HShell = window.HShell || {};

function ProgressTab__Item() {
  this.SL = HShell.content.selected_languageObj;
}

ProgressTab__Item.prototype.render = function (_ref) {
  var mod_id = _ref.mod_id,
      visualizedNumber = _ref.visualizedNumber;
  var module = HShell.content.getModuleById(mod_id);
  return _ProgressTab__Item.templates.main({
    mod_id: mod_id,
    visualizedNumber: visualizedNumber,
    SL: this.SL,
    icons: HShell.consts.iconsObj,
    module: module
  });
};

HShell.core.registerComponent(ProgressTab__Item, 'ProgressTab__Item');

},{"./ProgressTab__Item.template":12}],12:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var templates = {
  main: main
};
exports.templates = templates;

function main(_ref) {
  var mod_id = _ref.mod_id,
      visualizedNumber = _ref.visualizedNumber,
      SL = _ref.SL,
      icons = _ref.icons,
      module = _ref.module;
  $('#oneModuleItemContainer' + mod_id).find('.oneModuleTitle').text();
  return "\n        <li class=\"oneProgressItem rel\" modId=\"".concat(mod_id, "\">\n            <div role=\"button\" class=\"oneProgressItemInnner\" data-target=\"#oneModuleItemContainer").concat(mod_id, "\" tabindex=\"0\">\n                <div class=\"oneProgressItemNumber noSelect\">\n                    <span class=\"offScreen\">\n                        <span>\n                            <span>").concat(SL.UI.lable_module, " ").concat(visualizedNumber, ", ").concat(module.title, "</span>\n                            <b class=\"myProgStatus\"></b>\n                        </span>\n                    </span>\n\n                    <span  aria-hidden=\"true\">").concat(visualizedNumber, "</span>\n                </div>\n\n                <div class=\"iconHolder\" aria-hidden=\"true\">").concat(icons.icon_circle, "</div>\n\n                <div class=\"iconHolder focus\" aria-hidden=\"true\">").concat(icons.icon_ring_role, "</div>\n            </div>\n        </li>\n        ");
}

},{}],13:[function(require,module,exports){
var _ProgressTab = require("./ProgressTab.template");

var HShell = window.HShell || {};

function ProgressTab() {}

ProgressTab.prototype.onComponentRender = function () {
  this.$on('onModuleStatusChanged', this.updatePercentage.bind(this));
};

ProgressTab.prototype.updatePercentage = function () {
  var allModules = HShell.content.getAllModules(),
      totalNumber = allModules.length,
      passed = allModules.filter(function (module) {
    return module.completion_status === HShell.consts.completionStatus.completed;
  }),
      percentage = Math.round(passed.length / totalNumber * 100);
  this.percentage = percentage;
  this._wrapper.querySelector('#hPageHProgTitleProcentage').innerText = "".concat(this.percentage, "%");
};

ProgressTab.prototype.render = function () {
  this.percentage = this.percentage || 0;
  var SL = HShell.content.selected_languageObj,
      imgUrl = HShell.content.selected_roleObj.imgUrl,
      alt = imgUrl ? HShell.content.selected_roleObj.label_text[HShell.userData.selected_language] : '',
      imgUrlMassive = imgUrl ? HShell.content.selected_roleObj.imgUrlMassive : '',
      user_name = HShell.savedData.user_name,
      UI = SL.UI;
  return _ProgressTab.templates.main({
    UI: UI,
    user_name: user_name,
    imgUrl: imgUrl,
    alt: alt,
    imgUrlMassive: imgUrlMassive,
    percentage: this.percentage
  });
};

HShell.core.registerComponent(ProgressTab, 'HeaderProgressTab');

},{"./ProgressTab.template":14}],14:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var templates = {
  main: function main(_ref) {
    var UI = _ref.UI,
        user_name = _ref.user_name,
        imgUrl = _ref.imgUrl,
        alt = _ref.alt,
        imgUrlMassive = _ref.imgUrlMassive,
        percentage = _ref.percentage;
    var roleHtml;

    if (imgUrl) {
      roleHtml = "<img alt=\"".concat(alt, "\" src=\"content/").concat(imgUrlMassive, "\" />");
    } else {
      roleHtml = '<img src="content/0.roles/mobi_noRole.png" />';
    }

    return "\n                <div id=\"hPageHMenusContainer\">\n                    <div id=\"hPageHProgressContainer\" class=\"hPageHContainer\">\n                        <div class=\"hPageHTitleContainer rel noSelect\">\n                            <div id=\"hPageHProgTitleLabel\" class=\"rel langItem\" data-languageItem=\"myProgres\">".concat(UI.myProgres, "</div>\n                            <div id=\"hPageHProgTitleProcentage\" class=\"rel\">").concat(percentage, "%</div>\n                            <div id=\"hPageHProgTitleUserName\">\n                                ").concat(roleHtml, "\n                                <div>").concat(user_name, "</div>\n                            </div>\n                        </div>\n                    <ul id=\"hPageHProgContainerInner\" class=\"rel\"></ul>\n                </div>\n            ");
  }
};
exports.templates = templates;

},{}],15:[function(require,module,exports){
var _Module_Header = require("./Module_Header.template");

var HShell = window.HShell || {};

function Module_Header() {
  this.isFullScreen = false;
  this.boundOnExitFullScreen = this.exitFullScreen.bind(this);
  this.boundOnExitFullScreenKeyup = this.onExitFullScreenKeyup.bind(this);
}

Module_Header.prototype.onHomeClicked = function () {
  this.$emit('onHomeButtonPressed');
};

Module_Header.prototype.toggleFullScreen = function () {
  this.isFullScreen = !this.isFullScreen;

  this._wrapper.querySelector('.vidPopHeaderContainer').classList[this.isFullScreen ? 'add' : 'remove']('fullscreen');

  HShell.core.$emit('toggleModuleFullScreen', this.isFullScreen);
  document[this.isFullScreen ? 'addEventListener' : 'removeEventListener']('click', this.boundOnExitFullScreen);
  document[this.isFullScreen ? 'addEventListener' : 'removeEventListener']('keyup', this.boundOnExitFullScreenKeyup);
};

Module_Header.prototype.exitFullScreen = function () {
  this.isFullScreen = false;

  this._wrapper.querySelector('.vidPopHeaderContainer').classList.remove('fullscreen');

  HShell.core.$emit('toggleModuleFullScreen', false);
  document.removeEventListener('click', this.boundOnExitFullScreen);
};

Module_Header.prototype.onExitFullScreenKeyup = function (e) {
  if (e.keyCode === HShell.consts.keyCodes.escape) {
    this.exitFullScreen();
    document.removeEventListener('keyup', this.boundOnExitFullScreenKeyup);
  }
};

Module_Header.prototype.render = function (_ref) {
  var leftText = _ref.leftText,
      rightText = _ref.rightText,
      haveFullScreen = _ref.haveFullScreen,
      theme = _ref.theme;
  var HShell = window.HShell || {},
      templateToCall = 'main',
      bigHomeButton = HShell.consts.iframeTemplates.bigHomeButton;
  templateToCall = theme === bigHomeButton ? bigHomeButton : templateToCall;
  return _Module_Header.templates[templateToCall]({
    HShell: HShell,
    leftText: leftText,
    rightText: rightText,
    haveFullScreen: haveFullScreen,
    theme: theme,
    onHomeClick: this.onHomeClicked.bind(this)
  });
};

Module_Header.prototype.onDestroy = function () {
  document.removeEventListener('click', this.boundOnExitFullScreen);
  document.removeEventListener('keyup', this.boundOnExitFullScreenKeyup);
};

HShell.core.registerComponent(Module_Header, 'Module_Header');

},{"./Module_Header.template":16}],16:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var templates = {
  main: main,
  bigHomeButton: bigHomeButton
};
exports.templates = templates;

function main(_ref) {
  var HShell = _ref.HShell,
      leftText = _ref.leftText,
      rightText = _ref.rightText,
      haveFullScreen = _ref.haveFullScreen;
  return "\n        <div role=\"heading\" class=\"vidPopHeaderContainer rel\">\n            <h1 class=\"vidPopCourseTitle rel\">".concat(leftText, "</h1>\n            <h2 class=\"vidPopCourseTutorialLabel\">").concat(rightText, "</h2>\n            ").concat(fullScreenButton({
    HShell: HShell,
    haveFullScreen: haveFullScreen
  }), "\n        </div>\n    ");
}

function bigHomeButton(_ref2) {
  var HShell = _ref2.HShell,
      onHomeClick = _ref2.onHomeClick;
  return HShell.core.getComponent('HomeButton').init({
    onClick: onHomeClick
  });
}

function fullScreenButton(_ref3) {
  var HShell = _ref3.HShell,
      haveFullScreen = _ref3.haveFullScreen;
  var btnHtml = "\n        <div\n            class=\"vidPopCourseFullScreenButton iconHolder\"\n            aria-hidden=\"true\"\n            tabindex=\"-1\"\n            data-uniclick=\"toggleFullScreen\"\n        >\n            ".concat(HShell.consts.iconsObj.icon_full_screen, "\n        </div>\n    ");
  return !$('body').hasClass('iOS') && haveFullScreen ? btnHtml : '';
}

},{}],17:[function(require,module,exports){
var _Module_Navigation = require("./Module_Navigation.template");

var _common = require("../../Misc/Modules/ModulesList_Item/common/common.js");

var HShell = window.HShell || {};
var SHOW_HIDE_ANIMATION_OPTIONS = {
  effect: 'blind',
  easing: "linear",
  duration: 200
};

function Module_Navigation() {
  this.SL = HShell.content.selected_languageObj || {};
  this.UI = HShell.content.selected_languageObj.UI || {};
  _showClosePopupBound = _showClosePopup.bind(this);
  _closeModuleBound = _closeModule.bind(this);
  this.navigationData = null;
  _openModuleBound = _openModule.bind(this);
  this.onA11yKeyPressedBound = _onA11yKeyPressed.bind(this);
  this.$on('Module__CompleationStatus--change', this.onModuleCompletionStatusChange);
  this.$on('onModuleStatusChanged', this.onModuleCompletionStatusChange);
}

Module_Navigation.prototype.onModuleCompletionStatusChange = function () {
  this.rerender();
};

Module_Navigation.prototype.rerender = function () {
  this._wrapper.innerHTML = this.render({
    module: this.module,
    onNavigation: this.onNavigation
  });
};

Module_Navigation.prototype.onComponentRender = function () {
  var _this = this;

  _this.addA11yShortcuts(window.document);

  var $iframeEl = $(this._wrapper).closest('#oneIframePopUpContainer').find('.oneIframeConentInner iframe');

  if ($iframeEl.length) {
    $iframeEl.get(0).addEventListener('load', function () {
      _this.addA11yShortcuts(this.contentDocument.body);
    });
  }
};

Module_Navigation.prototype.onDestroy = function () {
  document.removeEventListener('keyup', this.onA11yKeyPressedBound);
};

Module_Navigation.prototype.render = function (_ref) {
  var module = _ref.module,
      onNavigation = _ref.onNavigation;
  this.module = module;
  this.onNavigation = onNavigation;
  return _Module_Navigation.templates.main({
    module: module,
    UI: this.UI
  });
};

Module_Navigation.prototype.onNavigationBtnClicked = function () {
  if (HShell.contentSetup.module_layouts_home_button) {
    this.onHomeButtonClicked();
    return;
  }

  var $navigationMenuContainer = $(this._wrapper).find('.ModuleLayouts__Navigation');
  $navigationMenuContainer.show(SHOW_HIDE_ANIMATION_OPTIONS);
  var $currentModuleContentContainer = $navigationMenuContainer.closest('.ModuleLayouts').find('.ModuleLayouts__Content');
  HShell.utils.lockFocusToContainer($navigationMenuContainer, '', $currentModuleContentContainer);
  $(this._wrapper).find('.navigationCloseBtn').focus();
};

Module_Navigation.prototype.onNavigationCloseBtnClicked = function () {
  var $navigationMenuContainer = $(this._wrapper).find('.ModuleLayouts__Navigation');
  $navigationMenuContainer.hide(SHOW_HIDE_ANIMATION_OPTIONS);
  var $currentModuleContentContainer = $navigationMenuContainer.closest('.ModuleLayouts').find('.ModuleLayouts__Content');
  HShell.utils.unlockFocusFromContainer($currentModuleContentContainer);
};

Module_Navigation.prototype.onHomeButtonClicked = function () {
  var completion = this.module.content_completion_status;

  if (completion === HShell.consts.completionStatus.completed) {
    // _closeModuleBound();
    this.onDialogYesButtonClicked();
  } else {
    _showClosePopupBound();
  }

  HShell.core.$emit('onModuleStatusChanged', module.mod_id);
};

Module_Navigation.prototype.onModuleNavigationClicked = function (ev, target) {
  var moduleId = $(target).data('moduleid'),
      modulesGroupArrayId = $(target).data('modulesgrouparrayid'),
      modulesArrayId = $(target).data('modulesarrayid'),
      module = HShell.content.getModuleById(moduleId);

  if (moduleId == this.module.mod_id) {
    // don't do anything if the same module is clicked
    this.onNavigationCloseBtnClicked();
    return;
  }

  var completion = this.module.content_completion_status;
  this.navigationData = {
    module: module,
    modulesArrayId: modulesArrayId,
    modulesGroupArrayId: modulesGroupArrayId
  };

  if (completion === HShell.consts.completionStatus.completed) {
    // _closeModuleBound();
    this.onDialogYesButtonClicked();
  } else {
    _showClosePopupBound();
  }

  HShell.core.$emit('onModuleStatusChanged', module.mod_id);
};

Module_Navigation.prototype.onDialogNoButtonClicked = function () {
  this.navigationData = null;
  $('.Component_PopUp').remove();
};

Module_Navigation.prototype.onDialogYesButtonClicked = function () {
  $('.Component_PopUp').remove();

  _closeModuleBound();

  if (this.navigationData) {
    var _this = this;

    setTimeout(function () {
      _openModuleBound(_this.navigationData.modulesGroupArrayId, _this.navigationData.modulesArrayId, _this.navigationData.module);
    }, 0);
  }
};

Module_Navigation.prototype.addA11yShortcuts = function (target) {
  $(target).keyup(this.onA11yKeyPressedBound);
};

function _onA11yKeyPressed(e) {
  if (e.ctrlKey && e.altKey) {
    switch (e.keyCode) {
      case 80:
        // P key
        var isNavigationMenuHidden = $(this._wrapper).find('.ModuleLayouts__Navigation').is(":hidden");

        if (isNavigationMenuHidden) {
          this.onNavigationBtnClicked();
        } else {
          this.onNavigationCloseBtnClicked();
        }

        break;

      case 72:
        // H key
        HShell.utils.unlockFocusFromContainer();
        this.onHomeButtonClicked();
        break;
    }
  }
}

;

function _showClosePopup() {
  var title = this.UI.confirmation,
      content = this.UI.confirmText,
      footer = _Module_Navigation.templates.popUpButtons(this.UI);

  $('#SCORM_Container').appendPopUp({
    title: title,
    content: content,
    footer: footer,
    initiatorComponent: this
  });
}

function _closeModule() {
  this.destroy();
  var skipPostAssessmentCheck = !!(this.navigationData && this.navigationData.module); // if user navigates to another module, dont disturb them with post assessment flow yet

  if (typeof this.onNavigation == 'function') {
    this.onNavigation(skipPostAssessmentCheck);
  }

  if (!skipPostAssessmentCheck) {
    HShell.checkForPostAssessment();
  }
}

function _openModule(modulesGroupArrayId, modulesArrayId, module) {
  var isExpternal = module.contentURLSource == 'external',
      duration = _common.common.getDuration(module),
      moduleGroup = this.SL.modulesGroupArray[modulesGroupArrayId];

  HShell.modules.openModule({
    moduleType: String(module.type).toLowerCase(),
    modObj: module,
    moduleId: module.mod_id,
    contentUrl: isExpternal ? '' : 'content/' + HShell.userData.selected_language + '/',
    contentURLAlt: escape(module.contentURLAlt),
    xmlDuration: duration ? "Length: ".concat(duration) : '',
    interactionPoints: moduleGroup.modulesArray[modulesArrayId].interactionPoints,
    parentObj: $('.ModList__Item[moduleid=' + module.mod_id + ']')
  });
}

HShell.core.registerComponent(Module_Navigation, 'Module_Navigation');

},{"../../Misc/Modules/ModulesList_Item/common/common.js":23,"./Module_Navigation.template":18}],18:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var burger_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><style>.cls-1{fill:none;}</style></defs><path d="M36,23H12a1,1,0,0,0,0,2H36A1,1,0,0,0,36,23Z"/><path d="M12,17H36a1,1,0,0,0,0-2H12A1,1,0,0,0,12,17Z"/><path d="M36,31H12a1,1,0,0,0,0,2H36A1,1,0,0,0,36,31Z"/><rect class="cls-1" width="48" height="48"/></svg>';
var navigation_close_icon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" id="Cross" x="0px" y="0px" viewBox="0 0 52 52" enable-background="new 0 0 52 52" xml:space="preserve"><path d="M27.4,26l10.3-10.3c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0L26,24.6L15.7,14.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4L24.6,26  L14.3,36.3c-0.4,0.4-0.4,1,0,1.4c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3L26,27.4l10.3,10.3c0.2,0.2,0.5,0.3,0.7,0.3  s0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0-1.4L27.4,26z"/><path d="M26,4c12.1,0,22,9.9,22,22s-9.9,22-22,22S4,38.1,4,26S13.9,4,26,4 M26,2C12.7,2,2,12.7,2,26s10.7,24,24,24s24-10.7,24-24  S39.3,2,26,2L26,2z"/></svg>';
var navigation_arrow_icon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" id="Arrow_Right" x="0px" y="0px" viewBox="0 0 52 52" enable-background="new 0 0 52 52" xml:space="preserve"><path d="M40.9,26.4c0.1-0.2,0.1-0.5,0-0.8c-0.1-0.1-0.1-0.2-0.2-0.3l-8-8c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l6.3,6.3H12  c-0.6,0-1,0.4-1,1s0.4,1,1,1h25.6l-6.3,6.3c-0.4,0.4-0.4,1,0,1.4c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l8-8  C40.8,26.6,40.9,26.5,40.9,26.4z"/><path d="M26,4c12.1,0,22,9.9,22,22s-9.9,22-22,22S4,38.1,4,26S13.9,4,26,4 M26,2C12.7,2,2,12.7,2,26s10.7,24,24,24s24-10.7,24-24  S39.3,2,26,2L26,2z"/></svg>';
var navigation_lock_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" enable-background="new 0 0 52 52"><path id="svg_2" d="m26,4c12.1,0 22,9.9 22,22s-9.9,22 -22,22s-22,-9.9 -22,-22s9.9,-22 22,-22m0,-2c-13.3,0 -24,10.7 -24,24s10.7,24 24,24s24,-10.7 24,-24s-10.7,-24 -24,-24l0,0z"/><path stroke="null" id="svg_7" d="m35.11189,24.86382l-0.88619,0l0,-4.43094a7.97569,7.97569 0 0 0 -15.95139,0l0,4.43094l-0.88619,0a0.88619,0.88619 0 0 0 -0.88619,0.88619l0,12.40664a0.88619,0.88619 0 0 0 0.88619,0.88619l17.72377,0a0.88619,0.88619 0 0 0 0.88619,-0.88619l0,-12.40664a0.88619,0.88619 0 0 0 -0.88619,-0.88619zm-15.0652,-4.43094a6.20332,6.20332 0 0 1 12.40664,0l0,4.43094l-12.40664,0l0,-4.43094zm14.17901,16.83758l-15.95139,0l0,-10.63426l15.95139,0l0,10.63426z"/></svg>';
var tick_icon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><path d="M781.785 320.985c-7.877-7.877-19.692-7.877-27.569 0l-380.062 380.062-124.062-124.062c-7.877-7.877-19.692-7.877-27.569 0s-7.877 19.692 0 27.569l137.846 137.846c3.938 3.938 9.846 5.908 13.785 5.908s9.846-1.969 13.785-5.908l393.846-393.846c7.877-7.877 7.877-19.692 0-27.569zM512 78.769c238.277 0 433.231 194.954 433.231 433.231s-194.954 433.231-433.231 433.231-433.231-194.954-433.231-433.231 194.954-433.231 433.231-433.231zM512 39.385c-261.908 0-472.615 210.708-472.615 472.615s210.708 472.615 472.615 472.615 472.615-210.708 472.615-472.615-210.708-472.615-472.615-472.615v0z"></path></svg>';
var in_progress_icon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><path d="M512 78.8c238.3 0 433.2 195 433.2 433.2s-194.9 433.2-433.2 433.2-433.2-194.9-433.2-433.2 194.9-433.2 433.2-433.2v0zM512 39.4c-261.9 0-472.6 210.7-472.6 472.6s210.7 472.6 472.6 472.6 472.6-210.7 472.6-472.6-210.7-472.6-472.6-472.6v0 0zM492.9 236.8v-19.7c0-11.8 7.9-19.7 19.7-19.7s19.7 7.9 19.7 19.7v19.7c0 11.8-7.9 19.7-19.7 19.7s-19.7-7.9-19.7-19.7zM532.3 788.2v19.7c0 11.8-7.9 19.7-19.7 19.7s-19.7-7.9-19.7-19.7v-19.7c0-11.8 7.9-19.7 19.7-19.7s19.7 7.8 19.7 19.7zM827.7 512.5c0 11.8-7.9 19.7-19.7 19.7h-19.7c-11.8 0-19.7-7.9-19.7-19.7s7.9-19.7 19.7-19.7h19.7c11.8 0 19.7 7.8 19.7 19.7zM256.6 512.5c0 11.8-7.9 19.7-19.7 19.7h-19.7c-11.8 0-19.7-7.9-19.7-19.7s7.9-19.7 19.7-19.7h19.7c11.8 0 19.7 7.8 19.7 19.7zM554.2 512.5c0 22.975-18.625 41.6-41.6 41.6s-41.6-18.625-41.6-41.6c0-22.975 18.625-41.6 41.6-41.6s41.6 18.625 41.6 41.6zM504.9 506.4v0c-12.5 5.4-27.1-0.5-32.5-13l-51.6-120.2c-5.4-12.5 0.5-27.1 13-32.5v0c12.5-5.4 27.1 0.5 32.5 13l51.6 120.2c5.4 12.5-0.5 27.1-13 32.5zM728.3 661.2v0c-7.4 11.4-22.8 14.7-34.2 7.3l-178.8-116.1c-11.4-7.4-14.7-22.8-7.3-34.2v0c7.4-11.4 22.8-14.7 34.2-7.3l178.8 116.1c11.4 7.4 14.7 22.8 7.3 34.2z"></path></svg>';
var home_icon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><path d="M608 217.6c0 0 0 32.563 0 63.578-35.302-41.549-71.603-84.301-71.603-84.301-6.067-7.155-15.002-11.277-24.397-11.277s-18.304 4.122-24.384 11.277l-211.648 249.152c0.563-0.653 1.152-1.306 1.779-1.907-18.15 18.099-28.147 42.227-28.147 67.878v230.4c0 52.954 43.059 96 96 96h332.8c52.954 0 96-43.046 96-96v-230.4c0-25.651-9.971-49.779-28.122-67.891-12.506-12.493-32.781-12.493-45.248 0.026-12.506 12.506-12.48 32.768 0.026 45.248 6.016 6.042 9.344 14.067 9.344 22.618v230.4c0 17.651-14.349 32-32 32h-332.8c-17.651 0-32-14.349-32-32v-230.4c0-8.55 3.328-16.576 9.357-22.618 0.614-0.614 1.203-1.267 1.766-1.907 0 0 149.082-175.501 187.264-220.454 31.974 37.619 103.629 121.971 103.629 121.971 8.678 10.227 22.822 13.939 35.43 9.318 12.57-4.621 20.954-16.614 20.954-30.042v-150.669c0-17.677-14.323-32-32-32s-32 14.323-32 32v0z"></path></svg>';
var templates = {
  main: main,
  popUpButtons: popUpButtons
};
exports.templates = templates;

function main(_ref) {
  var module = _ref.module,
      UI = _ref.UI;
  return getNavigationComponent(module, UI);
}

function popUpButtons(UI) {
  return "\n            <div class=\"buttonsContainer\" aria-live=\"off\">\n                <span data-uniclick=\"onDialogNoButtonClicked\">\n                    ".concat(HShell.core.getComponent('Button').init({
    id: 'videoContinueReskin',
    text: UI.label_No
  }), "\n                </span>\n\n                <span data-uniclick=\"onDialogYesButtonClicked\">\n                    ").concat(HShell.core.getComponent('Button').init({
    id: 'videoCloseReskin',
    text: UI.label_Yes
  }), "\n                </span>\n            </div>\n        ");
}

function getNavigationComponent(module, UI) {
  var courseTitle = UI.course_title;
  var shouldBeHomeButton = HShell.contentSetup.module_layouts_home_button;
  var ariaLabelText = shouldBeHomeButton ? 'Go to the home page. Press Control + Alt + H for instant access' : 'Open navigation menu. Press Control + Alt + P for instant access';
  return "\n        <div class=\"ModuleLayouts__NavigationBtn\">\n            <div class=\"courseTitle\">".concat(courseTitle, "</div>\n            <div class=\"svgContainer ").concat(shouldBeHomeButton ? 'homeBtn' : '', "\" data-uniclick=\"onNavigationBtnClicked\" tabindex=\"0\" ").concat(shouldBeHomeButton ? '' : 'aria-expanded="false"', " role=\"button\" aria-label=\"").concat(ariaLabelText, "\">\n                ").concat(shouldBeHomeButton ? home_icon : burger_icon, "\n            </div>\n        </div>\n        ").concat(shouldBeHomeButton ? '' : "<div class=\"ModuleLayouts__Navigation\">".concat(_getNavigationTemplate(module, UI), "</div>"), "\n    ");
}

function _getNavigationTemplate(module, UI) {
  module = module || {};
  UI = UI || {};
  var SL = HShell.content.selected_languageObj || {};
  var modulesGroups = SL.modulesGroupArray || [];
  var courseTitle = UI.course_title;
  return "\n        <div class=\"navigationContent\">\n                <div class=\"navigationCourseTitle\">\n                    <div class=\"courseTitle\">".concat(courseTitle, "</div>\n                    <div class=\"courseTitleMobile\">").concat(UI.access_menu, "</div>\n                </div>\n            <div class=\"navigationCloseBtn\" data-uniclick=\"onNavigationCloseBtnClicked\" role=\"button\" aria-expanded=\"true\" tabindex=\"0\" aria-label=\"Close the navigation menu\">\n                ").concat(navigation_close_icon, "\n            </div>\n            <div class=\"navigationModulesList\">\n                ").concat(_buildChapterGroup(false, 'home', undefined, UI), "\n                ").concat(modulesGroups.map(function (moduleGroup, index) {
    return _buildChapterGroup(index + 1, moduleGroup.groupTitle, moduleGroup.modulesArray);
  }).join(''), "\n            </div>\n        </div>\n    ");
}

function _buildChapterGroup(chapterIndex, chapterTitle, modulesArr, UI) {
  UI = UI || {};
  modulesArr = modulesArr || [];
  chapterTitle = chapterTitle || '';
  var isHomeChapter = chapterTitle === 'home';
  return "\n        <div class=\"chapterGroup\">\n            <div class=\"chapterTitle ".concat(isHomeChapter ? 'home' : '', "\" ").concat(isHomeChapter ? 'data-uniclick="onHomeButtonClicked" tabindex="0" role="button" aria-label="Home page"' : '', ">\n                <span class=\"chapterTitleText\">").concat(chapterIndex ? "".concat(chapterIndex < 10 ? '0' + chapterIndex : chapterIndex, ".") : '', " ").concat(isHomeChapter ? UI.home : chapterTitle, "</span>\n                ").concat(isHomeChapter ? "<div class=\"chapterIcon chapterIconArrow\">".concat(navigation_arrow_icon, "</div>") : '', "\n            </div>\n            ").concat(modulesArr.length > 0 ? "<div class=\"chapterModules\">\n                    ".concat(modulesArr.map(function (module, modulesArrIndex) {
    var moduleInProgress = module.completion_status === HShell.consts.completionStatus.inProgress || module.mod_id == HShell.content.activeModule.id && module.completion_status !== HShell.consts.completionStatus.completed;
    var moduleCompleted = module.completion_status === HShell.consts.completionStatus.completed;
    return "\n                            <div class=\"moduleTile\" data-uniclick=\"onModuleNavigationClicked\" data-moduleid=\"".concat(module.mod_id, "\"\n                                data-modulesgrouparrayid=\"").concat(chapterIndex - 1, "\" data-modulesarrayid=\"").concat(modulesArrIndex, "\" tabindex=\"0\" role=\"button\"\n                                aria-label=\"Chapter ").concat(chapterIndex, ", module ").concat(modulesArrIndex + 1, " out of ").concat(modulesArr.length, ": ").concat(module.title, "\">\n                                    ").concat(moduleInProgress || moduleCompleted ? "<div class=\"moduleCompletionIcon ".concat(moduleInProgress ? 'inprogress' : moduleCompleted ? 'completed' : '', "\">\n                                            ").concat(moduleInProgress ? in_progress_icon : moduleCompleted ? tick_icon : '', "\n                                        </div>") : '', "\n                                    <div class=\"moduleTitle\"><span class=\"moduleTitleText\">").concat(module.title, "</span></div>\n                                    <div class=\"moduleTileIcon moduleTileIconArrow\">").concat(navigation_arrow_icon, "</div>\n                                    <div class=\"moduleTileIcon moduleTileIconLock\">").concat(navigation_lock_icon, "</div>\n                            </div>\n                        ");
  }).join(''), "\n                </div>") : '', "\n        </div>\n    ");
}

},{}],19:[function(require,module,exports){
var _ModulesList_Item_Grid = require("./ModulesList_Item_Grid.template");

var _common = require("../common/common");

var HShell = window.HShell || {};

function ModulesList_Item_Grid() {
  this.SL = HShell.content.selected_languageObj;
  this.$on('Start__Module', _common.common.onModuleStartEvent.bind(this));
}

ModulesList_Item_Grid.prototype.onComponentRender = function () {
  this.domNode_gridItem = this._wrapper.querySelector('.ModList__Item'); // --- Adds the hover effect on the grid element

  $(this._wrapper).hover(this.onHover.bind(this));
  this.addHShellEvents();
};

ModulesList_Item_Grid.prototype.addHShellEvents = function () {
  var _this = this;

  this.mouseOverEvent = this.$on('ModList__Item--mouseOver', function () {
    $(_this.domNode_gridItem).addClass('faded');
  });
  this.mouseOutEvent = this.$on('ModList__Item--mouseOut', function () {
    $(_this.domNode_gridItem).removeClass('faded');
  });
  this.compleationStatusEvent = this.$on('Module__CompleationStatus--change', function (payload) {
    if (+payload.mod_id === +_this.module.mod_id) {
      _this.rerender();

      _this.domNode_gridItem = _this._wrapper.querySelector('.ModList__Item');

      _this.addHShellEvents();
    }
  });
};

ModulesList_Item_Grid.prototype.onHover = function () {
  var isMouseOver = !$(this.domNode_gridItem).hasClass('hovered'),
      eventName = 'ModList__Item';
  $(this.domNode_gridItem).toggleClass('hovered');

  if (isMouseOver) {
    HShell.core.$emit("".concat(eventName, "--mouseOver"));
  } else {
    HShell.core.$emit("".concat(eventName, "--mouseOut"));
  }
};

ModulesList_Item_Grid.prototype.toggleInfo = function () {
  var _this2 = this;

  var className = 'ModList__Item--opened';

  var $wrapper = $(this._wrapper.querySelector('.ModList__Item')),
      domNode_content = this._wrapper.querySelector('.InfoWrapper__Content');

  $wrapper.toggleClass(className);

  if ($wrapper.hasClass(className)) {
    if (this.listenForOtherOpenedItems) {
      HShell.core.$off(this.listenForOtherOpenedItems);
    }

    HShell.core.$emit(className);
    this.listenForOtherOpenedItems = HShell.core.$on(className, function () {
      $wrapper.removeClass(className);
      HShell.core.$off(_this2.listenForOtherOpenedItems);
      _this2.listenForOtherOpenedItems = null;
    });

    this._wrapper.querySelector('.InfoWrapper__Button').setAttribute('aria-label', 'Hide "more information"');

    HShell.a11y.speak("".concat(this.module.title, ". </br> ").concat(this.module.info, "."));
  } else {
    this._wrapper.querySelector('.InfoWrapper__Button').setAttribute('aria-label', 'Show more information');
  }

  if (!this.isScrollBuild) {
    $(domNode_content).customScrollbar();
    this.isScrollBuild = true;
  }
};

ModulesList_Item_Grid.prototype.onModuleOpen = function () {
  var isExpternal = this.module.contentURLSource == 'external',
      duration = _common.common.getDuration(this.module),
      moduleGroup = this.SL.modulesGroupArray[this.groupKey];

  HShell.modules.openModule({
    moduleType: String(this.module.type).toLowerCase(),
    modObj: this.module,
    moduleId: this.module.mod_id,
    contentUrl: isExpternal ? '' : 'content/' + HShell.userData.selected_language + '/',
    contentURLAlt: escape(this.module.contentURLAlt),
    xmlDuration: duration ? "Length: ".concat(duration) : '',
    interactionPoints: moduleGroup.modulesArray[this.moduleKey].interactionPoints,
    parentObj: $(this._wrapper).find('.ModList__Item')
  });
};

ModulesList_Item_Grid.prototype.rerender = function () {
  this._wrapper.innerHTML = this.render({
    module: this.module,
    groupKey: this.groupKey,
    moduleKey: this.moduleKey
  });
  HShell.core.renderComponents(this._wrapper, this);
};

ModulesList_Item_Grid.prototype.render = function (_ref) {
  var module = _ref.module,
      groupKey = _ref.groupKey,
      moduleKey = _ref.moduleKey;
  var icons = HShell.consts.iconsObj,
      languageFolder = this.SL.UI.folder,
      moduleGroup = HShell.content.getModuleGroupById(groupKey),
      groupColor = $(moduleGroup.XmlObject).attr('color'),
      moduleColor = $(module.XmlObject).attr('color'),
      colorOverride = moduleColor ? moduleColor : groupColor;
  this.module = module;
  this.groupKey = groupKey;
  this.moduleKey = moduleKey;
  return _ModulesList_Item_Grid.templates.main({
    module: module,
    icons: icons,
    languageFolder: languageFolder,
    colorOverride: colorOverride
  });
};

ModulesList_Item_Grid.prototype.onDestroy = function () {
  if (this.listenForOtherOpenedItems) {
    HShell.core.$off(this.listenForOtherOpenedItems);
  }
};

HShell.core.registerComponent(ModulesList_Item_Grid, 'ModulesList_Item_Grid');

},{"../common/common":23,"./ModulesList_Item_Grid.template":20}],20:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var HShell = window.HShell || {};
var templates = {
  main: main
};
exports.templates = templates;

function main(_ref) {
  var module = _ref.module,
      icons = _ref.icons,
      languageFolder = _ref.languageFolder,
      colorOverride = _ref.colorOverride;
  var title = module.title,
      duration = module.duration,
      info = module.info,
      mod_id = module.mod_id,
      mandatory = module.mandatory,
      type = module.type,
      thumbnailURL = module.thumbnailURL,
      completion_status = module.completion_status;
  var classModMandatory = mandatory ? 'mandatory' : '',
      backgroundStyle = thumbnailURL ? "style=\"background-image:url('content/".concat(languageFolder, "/").concat(thumbnailURL, "')\"") : '',
      customColorStyle = colorOverride ? "style=\"background-color:".concat(colorOverride, "\"") : '',
      statuses = HShell.consts.completionStatus;
  var class_status = '';

  switch (completion_status) {
    case statuses.notStarted:
    case statuses.unknown:
      class_status = 'notStarted';
      break;

    case statuses.inProgress:
      class_status = 'started';
      break;

    case statuses.completed:
      class_status = 'finished';
      break;
  }

  return "\n            <li\n                class=\"ModList__Item ModList__Item--grid ".concat(classModMandatory, " ").concat(class_status, " \"\n                id=\"oneModuleItemContainer").concat(mod_id, "\"\n                data-uniclick=\"onModuleOpen\"\n                tabindex=\"0\"\n                moduleId=\"").concat(mod_id, "\"\n            >\n                ").concat(info ? getInfoTemplate({
    icons: icons,
    title: title,
    info: info,
    customColorStyle: customColorStyle
  }) : '', "\n\n                <div\n                    class=\"ModList__ItemClickArea\"\n                    role=\"button\"\n                    aria-label=\"Module ").concat(mod_id, ". ").concat(title, " ").concat(type, "\"\n                >\n                </div>\n                <div class=\"ModList__ItemBG\" ").concat(backgroundStyle, "></div>\n\n                <div class=\"TitleWrapper\" data-uniclick=\"onModuleOpen\">\n                    <div class=\"TitleWrapper__Title\">").concat(title, "</div>\n\n                    <div class=\"TitleWrapper__StatusWrapper\">\n                        <div class=\"TitleWrapper__Status\"></div>\n                        ").concat(duration ? getDurationTemplate(duration) : '', "\n                    </div>\n                    <div class=\"TitleWrapper__BG\" ").concat(customColorStyle, "></div>\n                </div>\n            </li>\n        ");
}

function getInfoTemplate(_ref2) {
  var icons = _ref2.icons,
      title = _ref2.title,
      info = _ref2.info,
      customColorStyle = _ref2.customColorStyle;
  return "\n        <div class=\"InfoWrapper\">\n            <div\n                class=\"InfoWrapper__Button iconHolder\"\n                data-click=\"toggleInfo\"\n                tabindex=\"0\"\n                role=\"button\"\n                aria-label=\"Show more information\"\n            >\n                <span class=\"InfoWrapper__ButtonIcon--info\">".concat(icons.icon_header_TutorialIcon, "</span>\n                <span class=\"InfoWrapper__ButtonIcon--close\">").concat(icons.icon_exit, "</span>\n            </div>\n            <div class=\"InfoWrapper__Title\">").concat(title, "</div>\n            <div class=\"InfoWrapper__Content default-skin\">").concat(info, "</div>\n            <div class=\"InfoWrapper__BG\" ").concat(customColorStyle, "></div>\n        </div>\n        ");
}

function getDurationTemplate(duration) {
  return "\n        <div class=\"TitleWrapper__Duration\">".concat(HShell.utils.convertSecondsToTime(duration, 'MS'), "</div>\n    ");
}

},{}],21:[function(require,module,exports){
var _ModulesList_Item_Rows = require("./ModulesList_Item_Rows.template");

var _common = require("../common/common");

var HShell = window.HShell || {};

function ModulesList_Item_Rows() {
  this.SL = HShell.content.selected_languageObj;
  this.$on('Module__CompleationStatus--change', this.onCopleateionChange);
  this.$on('Start__Module', _common.common.onModuleStartEvent.bind(this));
}

ModulesList_Item_Rows.prototype.onCopleateionChange = function (_ref) {
  var mod_id = _ref.mod_id;

  if (this.module.mod_id === mod_id) {}
};

ModulesList_Item_Rows.prototype.onComponentRender = function () {
  addFocusEvents.call(this);
};

ModulesList_Item_Rows.prototype.render = function (_ref2) {
  var module = _ref2.module,
      modulesGroupArrayId = _ref2.modulesGroupArrayId,
      modulesArrayId = _ref2.modulesArrayId;
  this.module = module;
  this.modulesGroupArrayId = modulesGroupArrayId;
  this.modulesArrayId = modulesArrayId;
  var moduleTypeLanguageItem = window.getFileTypeLanguageItem(module),
      extentionToDisplay = this.SL.UI[moduleTypeLanguageItem] !== undefined ? this.SL.UI[moduleTypeLanguageItem] : this.SL.UI.document;
  return _ModulesList_Item_Rows.templates.main({
    HShell: HShell,
    module: module,
    modulesGroupArrayId: modulesGroupArrayId,
    modulesArrayId: modulesArrayId,
    moduleTypeLanguageItem: moduleTypeLanguageItem,
    extentionToDisplay: extentionToDisplay,
    buttonsCount: getButtonsCount(module),
    allModMandatory: getAreAllMandatory(this.SL.allModules),
    duration: _common.common.getDuration(module),
    selected_language: HShell.userData.selected_language,
    showQaNumber: HShell.globalSetup.devMode || HShell.globalSetup.qaMode,
    UI: this.SL.UI
  });
};

ModulesList_Item_Rows.prototype.onInfoClicked = function (e, originalTarget) {
  var wrapper = this._wrapper,
      infoObj = $(wrapper).find('.oneModuleInfoContainer'),
      quizElements = $(wrapper).find('.oneModuleQuizButtonContainer'),
      notificationElements = $(wrapper).find('.oneModuleNotificationButtonContainer.active');

  if ($(originalTarget).hasClass('active')) {
    var INFO_TEXT = HShell.content.selected_languageObj.UI.info;
    $(originalTarget).removeClass('active');
    $(originalTarget).find('.oneModuleInfoButtonTitle ').text(INFO_TEXT);
    $(originalTarget).attr('aria-label', 'Show more information');
    infoObj.slideUp();
  } else {
    var CLOSE_TEXT = HShell.content.selected_languageObj.UI.close;
    $('.oneModuleInfoButtonContainer').each(function () {
      if ($(this).hasClass('active')) {
        $(this).click();
      }
    });
    $(originalTarget).addClass('active');
    $(originalTarget).find('.oneModuleInfoButtonTitle').text(CLOSE_TEXT);
    $(originalTarget).attr('aria-label', 'Hide "more information"');
    HShell.a11y.speak(infoObj.find('.oneModuleInfoText').text());
    quizElements.click();
    notificationElements.click();
    infoObj.slideDown();
  }
};

ModulesList_Item_Rows.prototype.onModuleOpen = function () {
  var isExpternal = this.module.contentURLSource == 'external',
      duration = _common.common.getDuration(this.module),
      moduleGroup = this.SL.modulesGroupArray[this.modulesGroupArrayId];

  HShell.modules.openModule({
    moduleType: String(this.module.type).toLowerCase(),
    modObj: this.module,
    moduleId: this.module.mod_id,
    contentUrl: isExpternal ? '' : 'content/' + HShell.userData.selected_language + '/',
    contentURLAlt: escape(this.module.contentURLAlt),
    xmlDuration: duration ? "Length: ".concat(duration) : '',
    interactionPoints: moduleGroup.modulesArray[this.modulesArrayId].interactionPoints,
    parentObj: $(this._wrapper).find('.ModList__Item')
  });
};

function getButtonsCount(module) {
  return 0 + +(module.info.length > 0) + +module.quiz.length + +(typeof module.notification !== 'undefined');
}

function getAreAllMandatory(allModules) {
  var allModMandatory = false;

  for (var i = 0, mandModsNumber = 0; i < allModules.length; i++) {
    if (allModules[i].mandatory === true) {
      mandModsNumber++;
    }

    if (mandModsNumber == allModules.length) {
      allModMandatory = true;
    }
  }

  return allModMandatory;
}

function addFocusEvents() {
  var wrapper = this._wrapper;
  $(wrapper).find('.oneModuleDescriptionContainer').on('focus', function () {
    if (HShell.autoSetup.lastUserInteraction === 'keyboard') {
      $(wrapper).find('.oneModuleInnerContaienr').addClass('focused');
    }
  });
  $(wrapper).find('.oneModuleDescriptionContainer').on('blur', function () {
    $(wrapper).find('.oneModuleInnerContaienr').removeClass('focused');
  });
}

HShell.core.registerComponent(ModulesList_Item_Rows, 'ModulesList_Item_Rows');

},{"../common/common":23,"./ModulesList_Item_Rows.template":22}],22:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var icon_arrow = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><path d="M512 78.769c238.277 0 433.231 194.954 433.231 433.231s-194.954 433.231-433.231 433.231-433.231-194.954-433.231-433.231 194.954-433.231 433.231-433.231zM512 39.385c-261.908 0-472.615 210.708-472.615 472.615s210.708 472.615 472.615 472.615 472.615-210.708 472.615-472.615-210.708-472.615-472.615-472.615v0z"></path><path d="M805.415 519.877c1.969-3.938 1.969-9.846 0-15.754-1.969-1.969-1.969-3.938-3.938-5.908l-157.538-157.538c-7.877-7.877-19.692-7.877-27.569 0s-7.877 19.692 0 27.569l124.062 124.062h-504.123c-11.815 0-19.692 7.877-19.692 19.692s7.877 19.692 19.692 19.692h504.123l-124.062 124.062c-7.877 7.877-7.877 19.692 0 27.569 3.938 3.938 9.846 5.908 13.785 5.908s9.846-1.969 13.785-5.908l157.538-157.538c1.969-1.969 3.938-3.938 3.938-5.908z"></path></svg>';
var templates = {
  main: main
};
exports.templates = templates;

function main(_ref) {
  var HShell = _ref.HShell,
      module = _ref.module,
      UI = _ref.UI,
      allModMandatory = _ref.allModMandatory,
      modulesGroupArrayId = _ref.modulesGroupArrayId,
      modulesArrayId = _ref.modulesArrayId,
      buttonsCount = _ref.buttonsCount,
      selected_language = _ref.selected_language,
      showQaNumber = _ref.showQaNumber,
      extentionToDisplay = _ref.extentionToDisplay,
      duration = _ref.duration,
      moduleTypeLanguageItem = _ref.moduleTypeLanguageItem;
  var isMandatory = module.mandatory,
      class_ModMandatory = isMandatory ? 'mandatory' : '',
      class_isDurationFirsrt = !extentionToDisplay ? 'oneModuleDuration--firstItem' : '',
      buttonsCountClass = "buttons".concat(buttonsCount),
      timeClassMod = duration == '00:00' ? 'noTime' : '',
      icons = HShell.consts.iconsObj,
      moduleTarget = module.moduleTarget,
      mod_id = module.mod_id,
      thumbnailURL = module.thumbnailURL,
      thumbnailAlt = module.thumbnailAlt,
      moduleGroupId = module.moduleGroupId,
      moduleInGroupId = module.moduleInGroupId,
      contentURLSource = module.contentURLSource,
      contentURLPageTitle = module.contentURLPageTitle,
      contentURLAlt = module.contentURLAlt,
      contentTranscriptURL = module.contentTranscriptURL,
      moduleTitle = module.title,
      moduleType = module.type;
  return "\n            <li\n                class=\"ModList__Item oneModuleItemContainer notStarted rel ".concat(class_ModMandatory, "\"\n                id=\"oneModuleItemContainer").concat(mod_id, "\"\n                contentType=\"").concat(String(moduleType).toLowerCase(), "\"\n                contentUrlAlt=\"").concat(escape(contentURLAlt), "\"\n                transcriptURL=\"").concat(escape(contentTranscriptURL), "\"\n                moduleId=\"").concat(mod_id, "\"\n                pageTitle=\"").concat(contentURLPageTitle, "\"\n                data-modulesGroupArrayId=\"").concat(modulesGroupArrayId, "\"\n                data-modulesArrayId=\"").concat(modulesArrayId, "\"\n                data-source=\"").concat(contentURLSource, "\"\n                data-moduleTarget=\"").concat(moduleTarget, "\"\n            >\n                <div class=\"oneModuleInnerContaienr\" data-uniclick=\"onModuleOpen\">\n                    <img class=\"oneModuleImage rel\" src=\"content/").concat(selected_language, "/").concat(thumbnailURL, "\" alt=\"").concat(thumbnailAlt ? thumbnailAlt || '' : '', "\" />\n                    <div\n                        role=\"button\"\n                        aria-label=\"").concat(moduleTitle, ". ").concat(extentionToDisplay, ". ").concat(module && module.notification ? "".concat(module.notification.title || '', "! ").concat(module.notification.message || '', ".") : '', "\"\n                        class=\"oneModuleDescriptionContainer ").concat(buttonsCountClass, " rel noSelect\"\n                        tabindex=\"0\"\n                    >\n                        ").concat(showQaNumber ? "<div class=\"QaModuleNumber\">".concat(mod_id, "</div>") : '', "\n                        ").concat(isMandatory && !allModMandatory ? "<div class=\"oneModulePriority rel langItem\" data-languageItem=\"mandatory\">".concat(UI.mandatory, "</div>") : '', "\n\n                        ").concat(extentionToDisplay ? "\n                                <div class=\"oneModuleType rel langItem ".concat(timeClassMod, "\" data-languageItem=\"").concat(moduleTypeLanguageItem, "\">\n                                    ").concat(extentionToDisplay, "\n                                </div>\n                            ") : '', "\n\n                        ").concat(duration ? "\n                            <div class=\"oneModuleDuration rel ".concat(class_isDurationFirsrt, "\">\n                                <div class=\"offScreen\">Length: </div>\n                                ").concat(duration, "\n                            </div>") : '', "\n\n                        <div\n                            class=\"oneModuleTitle rel langItem moduleItem\"\n                            data-languageItem=\"title\"\n                            data-moduleGArrayId=\"").concat(moduleGroupId, "\"\n                            data-moduleInGroupId=\"").concat(moduleInGroupId, "\"\n                            data-moduleId=\"").concat(mod_id, "\"\n                        >\n                            ").concat(moduleTitle, "\n                        </div>\n\n                        ").concat(getInfo({
    module: module,
    selected_language: selected_language,
    mod_id: mod_id
  }), "\n                    </div>\n\n                    ", "\n", "\n                    ", "\n\n                    <div class=\"oneModuleButtonsContainer\" aria-hidden=\"true\">\n                        <div class=\"oneModulePassButtonContainer\">\n                            <div class=\"oneModulePassButtonImg iconHolder rel\">").concat(icon_arrow, "</div>\n                        </div>\n                        <div class=\"reviewText\">").concat(UI.review, "</div>\n\n                        ", "\n                        ", "\n                        ").concat(getQuizButton({
    module: module,
    UI: UI
  }), "\n                    </div>\n\n                    ").concat(duration ? "<div class=\"offScreen\">Length: ".concat(duration, "</div>") : '', "\n                    ").concat(window.buildInModuleQuiz(module, modulesGroupArrayId, modulesArrayId), "\n                    ").concat(getNotification({
    module: module
  }), "\n                    <div class=\"completionMobile\"></div>\n                </div>\n            </li>\n        ");
}

function getNotificationButton(_ref2) {
  var module = _ref2.module,
      icons = _ref2.icons,
      UI = _ref2.UI,
      HShell = _ref2.HShell;
  var html = '';

  if (typeof module.notification !== 'undefined') {
    html = "\n                <div class=\"oneModuleNotificationButtonContainer\">\n                    <div class=\"oneModuleNotificationButtonImg iconHolder rel\">\n                        <div class=\"oneModuleNotificationButtonCloseCircle\">\n                            ".concat(icons.icon_circle, "\n                            <div class=\"oneModuleNotificationButtonCloseCircleMark\">!</div>\n                        </div>\n\n                        <div class=\"oneModuleNotificationButtonImgShow\">").concat(icons.icon_header_TutorialIcon, "</div>\n                        <div class=\"oneModuleNotificationButtonShowTitle rel langItem\" data-languageItem=\"notificationShow\">").concat(UI.info, "</div>\n                        <div class=\"oneModuleNotificationButtonImgClose\">\n                            ").concat(HShell.consts.iconsObj.icon_exit, ";\n                        </div>\n                        <div class=\"oneModuleNotificationButtonCloseTitle rel langItem\" data-languageItem=\"notificationClose\">").concat(UI.close, "</div>\n                    </div>\n                </div>\n\n            ");
  }

  return html;
}

function getNotification(_ref3) {
  var module = _ref3.module;
  var html = '';

  if (typeof module.notification !== 'undefined') {
    html = "\n                <div class=\"oneModuleNotificationContainer\">\n                    <div class=\"text\"><b>".concat(module.notification.title, "</b> ").concat(module.notification.message, "</div>\n                </div>\n            ");
  }

  return html;
}

function getInfoButton(_ref4) {
  var module = _ref4.module,
      icons = _ref4.icons,
      UI = _ref4.UI;
  var html = '';

  if (module.info.length > 0) {
    html = "\n                <div\n                    class=\"oneModuleInfoButtonContainer\"\n                    data-uniclick=\"onInfoClicked\"\n                    tabindex=\"0\"\n                    role=\"button\"\n                    aria-label=\"Show more information\"\n                >\n                    <div class=\"oneModuleInfoButtonImg iconHolder rel\">\n                        <div class=\"oneModuleInfoButtonImgInfo\">".concat(icons.icon_header_TutorialIcon, "</div>\n                        <div class=\"oneModuleInfoButtonImgClose\">").concat(icons.icon_exit, "</div>\n                    </div>\n                    <div class=\"oneModuleInfoButtonTitle rel langItem\" data-languageItem=\"info\" aria-hidden=\"true\">").concat(UI.info, "</div>\n                </div>\n            ");
  }

  return html;
}

function getInfo(_ref5) {
  var module = _ref5.module,
      selected_language = _ref5.selected_language,
      mod_id = _ref5.mod_id;
  var html = '',
      hasInfo = module.info.length > 0,
      infoImgUrl = module.infoImgUrl,
      classMod = hasInfo ? '' : 'long',
      infoImgHtml = '',
      infoText = module.infoText;

  if (hasInfo) {
    if (infoImgUrl !== '') {
      infoImgHtml = "<div class=\"oneModuleInfoImage\">\n                    <img src=\"content/".concat(selected_language, "/modules/module_").concat(mod_id, "/").concat(infoImgUrl, "\"/>\n                </div>");
    }

    html = "\n                <div class=\"oneModuleInfoContainer\">\n                    ".concat(infoImgHtml, "\n                    <div class=\"oneModuleInfoText ").concat(classMod, "\">").concat(infoText, "</div>\n                </div>\n            ");
  }

  return html;
}

function getQuizButton(_ref6) {
  var module = _ref6.module,
      UI = _ref6.UI;
  var html = '';

  if (module.quiz.length) {
    html = "\n                <div class=\"oneModuleQuizButtonContainer noSelect\" tabindex=\"0\">\n                    <div class=\"oneModuleQuizButtonImg iconHolder rel\"></div>\n                    <div class=\"oneModuleQuizButtonTitle rel langItem\" data-languageItem=\"reflect\">".concat(UI.reflect, "</div>\n                    <div class=\"oneModuleQuizButtonTitleClose langItem rel\" data-languageItem=\"close\">").concat(UI.close, "</div>\n                </div>\n            ");
  }

  return html;
}

},{}],23:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.common = void 0;
var HShell = window.HShell || {};
var common = {
  getDuration: getDuration,
  onModuleStartEvent: onModuleStartEvent
};
exports.common = common;

function getDuration(module) {
  var duration = HShell.utils.convertSecondsToTime(module.duration, 'MS');
  duration = duration == '00:00' ? '' : duration;
  return duration;
}

function onModuleStartEvent(mod_id) {
  if (mod_id === this.module.mod_id) {
    this.onModuleOpen();
  }
}

},{}],24:[function(require,module,exports){
var _Modules_filters = require("./Modules_filters.template");

var HShell = window.HShell || {};

function Modules_filters() {
  this.UI = HShell.content.selected_languageObj.UI;
  this.SL = HShell.content.selected_languageObj;
  this.activeFilter = 'all';
  this.filtersArr = ['all', 'toDo', 'finished'];
  this.$on('onModuleStatusChanged', this.refreshFiltersLabels.bind(this));
}

Modules_filters.prototype.refreshFiltersLabels = function () {
  this.rerender();
};

Modules_filters.prototype.onKeyUp = function (e) {
  var keyCodes = HShell.consts.keyCodes;

  if (HShell.consts.keyCodes[e.keyCode]) {
    var newIndex;

    if (keyCodes.downArrow === e.keyCode || keyCodes.rightArrow === e.keyCode) {
      newIndex = this.filtersArr.indexOf(this.activeFilter) + 1;
    } else {
      newIndex = this.filtersArr.indexOf(this.activeFilter) - 1;
    }

    if (this.filtersArr[newIndex]) {
      this.rerender();
      this.onFilterChange(undefined, this.filtersArr[newIndex]);

      this._wrapper.querySelector(".modulesFilters__Button[data-filter=\"".concat(this.activeFilter, "\"]")).focus();
    }
  }
};

Modules_filters.prototype.onFilterChange = function (event, param) {
  var filterName = param.dataset && param.dataset.filter || param;

  if (this.activeFilter !== filterName) {
    this.activeFilter = filterName;
    HShell.core.$emit('onModulesFilterChange', this.activeFilter);
    this.rerender();
  }
};

Modules_filters.prototype.getModulesCountByStatus = function (status) {
  return this.allModules.filter(function (module) {
    return module.completion_status === status;
  }).length;
};

Modules_filters.prototype.onComponentRender = function () {
  this.refreshFiltersLabels();
};

Modules_filters.prototype.rerender = function () {
  this._wrapper.innerHTML = this.render();
};

Modules_filters.prototype.render = function () {
  var selectedLanguageId = HShell.userData.selected_language;
  this.allModules = HShell.content.getLanguageById(selectedLanguageId).allModules;
  var completedNumber = +this.getModulesCountByStatus(HShell.consts.completionStatus.completed),
      toDoNumber = this.allModules.length - completedNumber;
  return _Modules_filters.templates.main({
    UI: this.UI,
    allNumber: this.allModules.length,
    toDoNumber: toDoNumber,
    completedNumber: completedNumber,
    activeFilter: this.activeFilter
  });
};

Modules_filters.prototype.onDestroy = function () {};

HShell.core.registerComponent(Modules_filters, 'Modules_filters');

},{"./Modules_filters.template":25}],25:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var templates = {
  main: main
};
exports.templates = templates;

function main(_ref) {
  var UI = _ref.UI,
      allNumber = _ref.allNumber,
      toDoNumber = _ref.toDoNumber,
      completedNumber = _ref.completedNumber,
      activeFilter = _ref.activeFilter;
  var isAllActive = activeFilter === 'all',
      isToDoActive = activeFilter === 'toDo',
      isFinishedActive = activeFilter === 'finished';
  return "\n            <div role=\"tablist\" id=\"modulesFiltersContainer\" class=\"rel\">\n                <button\n                    id=\"filterAllModules\"\n                    data-filter=\"all\"\n                    class=\"modulesFilters__Button ".concat(isAllActive ? 'active' : '', "\"\n                    role=\"tab\"\n                    data-uniclick=\"onFilterChange\"\n                    aria-label=\"All modules (").concat(allNumber, "). \"\n                    ").concat(!isAllActive ? 'tabindex="-1"' : '', "\n                    data-keyup=\"onKeyUp\"\n                >\n                    <span class=\"modulesFiltersLable langItem modulesFilterAllModulesLabel noSelect\" data-languageItem=\"allModules\" aria-hidden=\"true\">").concat(UI.allModules, "</span>\n                    <span class=\"modulesFilterNunberContainer modulesFilterAllNumberContainer\" aria-hidden=\"true\">\n                        <span>&nbsp;(</span>\n                        <span class=\"modulesFilterNunber\">").concat(allNumber, "</span>\n                        <span>)</span>\n                    </span>\n                </button>\n\n                <button\n                    id=\"filterInProgress\"\n                    data-filter=\"toDo\"\n                    class=\"modulesFilters__Button langItem ").concat(isToDoActive ? 'active' : '', "\"\n                    role=\"tab\"\n                    data-uniclick=\"onFilterChange\"\n                    aria-label=\"To-do (").concat(toDoNumber, "). \"\n                    ").concat(!isToDoActive ? 'tabindex="-1"' : '', "\n                    data-keyup=\"onKeyUp\"\n                >\n                    <span class=\"modulesFiltersLable langItem noSelect\" data-languageItem=\"toDo\" aria-hidden=\"true\">").concat(UI.toDo, "</span>\n                    <span class=\"modulesFilterNunberContainer modulesFilterInProgressNumberContainer\" aria-hidden=\"true\">\n                        <span>&nbsp;(</span>\n                        <span class=\"modulesFilterNunber\">").concat(toDoNumber, "</span>\n                        <span>)</span>\n                    </span>\n                </button>\n\n                <button\n                    id=\"filterCompleted\"\n                    data-filter=\"finished\"\n                    class=\"modulesFilters__Button langItem ").concat(isFinishedActive ? 'active' : '', "\"\n                    role=\"tab\"\n                    data-uniclick=\"onFilterChange\"\n                    aria-label=\"Completed (").concat(completedNumber, "). \"\n                    ").concat(!isFinishedActive ? 'tabindex="-1"' : '', "\n                    data-keyup=\"onKeyUp\"\n                >\n                    <span class=\"modulesFiltersLable langItem noSelect\" data-languageItem=\"compleated\" aria-hidden=\"true\">").concat(UI.compleated, "</span>\n                    <span class=\"modulesFilterNunberContainer modulesFilterCompletedNumberContainer\" aria-hidden=\"true\">\n                        <span>&nbsp;(</span>\n                        <span class=\"modulesFilterNunber\">").concat(completedNumber, "</span>\n                        <span>)</span>\n                    </span>\n                </button>\n            </div>\n        ");
}

},{}],26:[function(require,module,exports){
var _PopUp = require("./PopUp.template");

var HShell = window.HShell || {};

function PopUp() {}

PopUp.prototype.onComponentRender = function () {
  this.customFunction && this.customFunction();
  enableA11Y();
};

PopUp.prototype.onUniclick = function (e, originalTarget, functionName) {
  this.initiatorComponent && this.initiatorComponent[functionName](e, originalTarget);
};

PopUp.prototype.onDestroy = function () {
  disableA11Y();
};

PopUp.prototype.render = function (_ref) {
  var title = _ref.title,
      content = _ref.content,
      footer = _ref.footer,
      iconSymbol = _ref.iconSymbol,
      customFunction = _ref.customFunction,
      initiatorComponent = _ref.initiatorComponent;
  this.customFunction = customFunction;
  this.initiatorComponent = initiatorComponent;
  return _PopUp.templates.main({
    title: title,
    content: content,
    footer: footer,
    iconSymbol: iconSymbol
  });
};

function enableA11Y() {
  HShell.utils.lockFocusToContainer('#popUpDarkBG', '#popUpDarkBG button', '#mainContentContainer');
  $('#forced_speech_container, #eLearningGenericContainer, #moduleVideoContainer, #homePageHeaderContainer').attr('aria-hidden', true); // --- (Accessibility)
  // Not focusing leave module popup "No" button without timeout

  setTimeout(function () {
    $('#popUpDarkBG :focusable').first().focus();
    HShell.a11y.speak($('#popUpDescription').text());
  }, 1);
}

function disableA11Y() {
  HShell.utils.unlockFocusFromContainer('#mainContentContainer');
  $('#forced_speech_container, #eLearningGenericContainer, #moduleVideoContainer, #homePageHeaderContainer').attr('aria-hidden', false);
}

HShell.core.registerComponent(PopUp, 'PopUp');

},{"./PopUp.template":27}],27:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var templates = {
  main: main
};
/**
 * @todo The way the short/medium/long classes are generated, must never relay on the number of </br> tags
 */

exports.templates = templates;

function main(_ref) {
  var title = _ref.title,
      content = _ref.content,
      footer = _ref.footer,
      iconSymbol = _ref.iconSymbol;
  var class_noInteraction = footer ? '' : 'noInteraction';
  var class_contentContainer = '',
      // eslint-disable-next-line no-useless-escape
  contentBreaks = content.match(/\<\/br\>/g);

  if (contentBreaks) {
    switch (contentBreaks) {
      case null:
        class_contentContainer = 'short';
        break;

      case 1:
        class_contentContainer = 'medium';
        break;

      case 2:
        class_contentContainer = 'long';
    }
  }

  return "\n        <div\n            id=\"popUpDarkBG\"\n            class=\"".concat(class_noInteraction, "\"\n            role=\"dialog\"\n            aria-labelledby=\"popUpTitle\"\n            aria-describedby=\"popUpDescription\"\n        >\n            <div class=\"popUpContainerOuter rel\">\n                <div class=\"popUpContainerInner\">\n                    <div class=\"popHeaderContainer rel\">\n                        <div id=\"popUpTitle\" class=\"popHTitle rel noSelect\">").concat(title, "</div>\n                    </div>\n\n                    <div class=\"popBodyContainer rel\">\n\n                        ").concat(getIcon(iconSymbol), "\n\n                        <div id=\"popUpDescription\" class=\"popBContentContainer rel ").concat(class_contentContainer, "\">\n                            ").concat(content, "\n                        </div>\n                        ").concat(footer ? "<div class=\"popBFooterContainer\">".concat(footer, "</div>") : '', "\n                    </div>\n                </div>\n            </div>\n        </div>\n        ");
}

function getIcon(iconSymbol) {
  var html = '';

  if (String(iconSymbol) != 'undefined') {
    html = "<div class=\"popBIconContainer iconHolder alert rel\"> ".concat(iconSymbol, "</div>");
  }

  return html;
}

},{}],28:[function(require,module,exports){
var _Tooltip = require("./Tooltip.template");

var HShell = window.HShell || {};

function Tooltip() {
  this.SL = HShell.content.selected_languageObj;
  this.boundOnTargetHovered = this.onTargetHovered.bind(this);
  this.boundOnTargetMouseout = this.onTargetMouseout.bind(this);
  this.hoverBound = false;
}

Tooltip.prototype.getClassFromSelector = function (selector) {
  var className = '';

  if (selector && selector.indexOf('.') != -1) {
    className = selector.slice(selector.indexOf('.') + 1, selector.length);

    if (className.indexOf('#') != -1) {
      var endPoint = className.indexOf('#');
      className = className.slice(0, endPoint);
    }
  }

  return className;
};

Tooltip.prototype.getIdFromSelector = function (selector) {
  var id = '';

  if (selector && selector.indexOf('#') != -1) {
    id = selector.slice(selector.indexOf('#') + 1, selector.length);

    if (id.indexOf('.') != -1) {
      var endPoint = id.indexOf('.');
      id = id.slice(0, endPoint);
    }
  }

  return id;
};

Tooltip.prototype.onTargetHovered = function () {
  var _this = this;

  clearTimeout(this.hoverTimeout);
  this.hoverTimeout = setTimeout(function () {
    _this._wrapper.querySelector('.toolTipContainer').classList.add('hovered');
  }, HShell.consts.toolTipHoverDelay);
  document.getElementById(this.targetId).addEventListener('mouseout', this.boundOnTargetMouseout);
};

Tooltip.prototype.onTargetMouseout = function () {
  clearTimeout(this.hoverTimeout);

  this._wrapper.querySelector('.toolTipContainer').classList.remove('hovered');

  document.getElementById(this.targetId).removeEventListener('mouseout', this.boundOnTargetMouseout);
};

Tooltip.prototype.bindEvents = function () {
  // "this.hoverBound" - Prevents multiple bindings if this component gets rerendered
  if (!this.hoverBound && this.targetId) {
    this.hoverBound = true;
    document.getElementById(this.targetId).addEventListener('mouseover', this.boundOnTargetHovered);
  }
};

Tooltip.prototype.render = function (_ref) {
  var targetId = _ref.targetId,
      selector = _ref.selector,
      text = _ref.text,
      languageItem = _ref.languageItem;
  this.targetId = targetId;
  this.bindEvents();
  return _Tooltip.templates.main({
    idName: this.getIdFromSelector(selector),
    className: this.getClassFromSelector(selector),
    text: text,
    languageItem: languageItem
  });
};

Tooltip.prototype.onDestroy = function () {
  document.removeEventListener('mouseover', this.boundOnTargetHovered);
  document.removeEventListener('mouseout', this.boundOnTargetMouseout);
};

HShell.core.registerComponent(Tooltip, 'Tooltip');

},{"./Tooltip.template":29}],29:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var templates = {
  main: main
};
exports.templates = templates;

function main(_ref) {
  var idName = _ref.idName,
      className = _ref.className,
      text = _ref.text,
      languageItem = _ref.languageItem;
  var data_languageItem = languageItem ? "data-languageItem=\" ".concat(languageItem, "\"") : '',
      class_language = languageItem ? 'langItem' : '';
  return "\n        <div class=\"toolTipContainer ".concat(className, "\" id=\"").concat(idName, "\">\n            <div class=\"toolTipInnerContainer ").concat(class_language, "\" ").concat(data_languageItem, ">\n                ").concat(text, "\n            </div>\n            <div class=\"toolTipArrow\"></div>\n        </div>\n    ");
}

},{}],30:[function(require,module,exports){
var _Video_Footer = require("./Video_Footer.template");

var HShell = window.HShell || {};

function Video_Footer() {
  this.SL = HShell.content.selected_languageObj;
  this.isFullscreen = false;
  this.videoFooterId = Math.round(Math.random() * 5000000);
  this.$on('toggleModuleFullScreen', this.onFullScreenChange);
  this.$on('videoIsPaused', this.setToPause);
  this.$on('moduleVideoSyncronization', this.updateTime);
  this.$on('moduleVideoFinished', this.onVideoFinished);
}

Video_Footer.prototype.onVideoFinished = function () {
  var icons = HShell.consts.iconsObj;
  this._wrapper.querySelector('.vidPopClose__wrapper').innerHTML = _Video_Footer.templates.getHomeButton({
    SL: this.SL,
    icons: icons,
    noHome: this.noHome,
    isActive: true
  });
};

Video_Footer.prototype.setToPause = function () {
  var $playPauseBtn = $(this._wrapper).find('.vidPopPlayBtn').addClass('paused');
  var currentNameAttr = $playPauseBtn.attr('name');
  var newNameAttr = currentNameAttr.replace(this.SL.UI['label_pause'], this.SL.UI['label_play']);
  $playPauseBtn.attr('name', newNameAttr);
};

Video_Footer.prototype.updateTime = function (_ref) {
  var currentTime = _ref.currentTime,
      totalTime = _ref.totalTime;

  if (currentTime !== this.currentTime) {
    this.currentTime = currentTime;
    this.totalTime = totalTime ? totalTime : this.totalTime;
    this._wrapper.querySelector('.vidPopTimerContainer__wrapper').innerHTML = _Video_Footer.templates.getTimeTemplate({
      HShell: HShell,
      SL: this.SL,
      totalTime: this.totalTime,
      currentTime: this.currentTime
    });
  }
};

Video_Footer.prototype.onHomeClicked = function () {
  this.$emit('onHomeButtonPressed');
};

Video_Footer.prototype.onFullScreenChange = function (isFullscreen) {
  this.isFullscreen = isFullscreen;

  this._wrapper.querySelector('.vidPopFooterContainer').classList[this.isFullscreen ? 'add' : 'remove']('fullscreen');
};

Video_Footer.prototype.render = function (_ref2) {
  var transcriptUrl = _ref2.transcriptUrl,
      subtitles = _ref2.subtitles,
      rightButtonLable = _ref2.rightButtonLable,
      noHome = _ref2.noHome,
      homeEnabled = _ref2.homeEnabled;
  var icons = HShell.consts.iconsObj;
  this.totalTime = 0, this.currentTime = 0;
  this.noHome = noHome;
  this.homeEnabled = homeEnabled;
  return _Video_Footer.templates.main({
    HShell: HShell,
    SL: this.SL,
    icons: icons,
    volume_level: HShell.userData.volume_level,
    transcriptUrl: transcriptUrl,
    subtitles: subtitles,
    rightButtonLable: rightButtonLable,
    noHome: noHome,
    footerId: this.videoFooterId,
    totalTime: this.totalTime,
    currentTime: this.currentTime,
    homeEnabled: homeEnabled
  });
};

HShell.core.registerComponent(Video_Footer, 'Video_Footer');

},{"./Video_Footer.template":31}],31:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var templates = {
  main: main,
  getTimeTemplate: getTimeTemplate,
  getHomeButton: getHomeButton,
  getPlayPouseTemplate: getPlayPouseTemplate
};
exports.templates = templates;

function main(_ref) {
  var HShell = _ref.HShell,
      SL = _ref.SL,
      icons = _ref.icons,
      footerId = _ref.footerId,
      volume_level = _ref.volume_level,
      transcriptUrl = _ref.transcriptUrl,
      subtitles = _ref.subtitles,
      rightButtonLable = _ref.rightButtonLable,
      noHome = _ref.noHome,
      totalTime = _ref.totalTime,
      currentTime = _ref.currentTime,
      homeEnabled = _ref.homeEnabled;
  var commonOptions = {
    HShell: HShell,
    SL: SL,
    icons: icons,
    footerId: footerId
  };
  return "\n        <div class=\"vidPopFooterContainer buttonsContainer WPWidthMod\" role=\"footer\" aria-live=\"off\" style=\"max-width:".concat(HShell.autoSetup.fullFrameHeight, "vw\">\n                ").concat(HShell.autoSetup.runOn.OS !== 'iOS' ? // rewind not working on iOS devices on Saba so disable it as requested.
  getRewindTemplate(commonOptions) : '', "\n                <span class=\"vidPopPlayBtn__wrapper\">\n                    ").concat(getPlayPouseTemplate(commonOptions), "\n                </span>\n                ").concat(getStopTemplate(commonOptions), "\n\n                ").concat(getVolumeTemplate(_objectSpread(_objectSpread({}, commonOptions), {}, {
    volume_level: volume_level
  })), "\n\n                <span class=\"vidPopTimerContainer__wrapper\">\n                    ").concat(getTimeTemplate({
    HShell: HShell,
    SL: SL,
    totalTime: totalTime,
    currentTime: currentTime
  }), "\n                </span>\n\n                <div class=\"footerRightButtonsContainer\">\n                    <span class=\"vidPopPlaybackSpeedContainer__wrapper\">\n                        ").concat(getPlaybackSpeedTemplate(), "\n                    </span>\n                    ").concat(getTranscriptTemplate(_objectSpread(_objectSpread({}, commonOptions), {}, {
    transcriptUrl: transcriptUrl
  })), "\n                    ").concat(getSubtitlesTemplate(_objectSpread(_objectSpread({}, commonOptions), {}, {
    subtitles: subtitles
  })), "\n                    ").concat(getRightButtons({
    HShell: HShell,
    rightButtonLable: rightButtonLable
  }), "\n\n                    <span class=\"vidPopClose__wrapper\">\n                        ").concat(getHomeButton({
    SL: SL,
    icons: icons,
    noHome: noHome,
    isActive: homeEnabled
  }), "\n                    </span>\n                </div>\n            </div>\n        </div>\n    ");
}

function getRewindTemplate(_ref2) {
  var HShell = _ref2.HShell,
      SL = _ref2.SL,
      icons = _ref2.icons,
      footerId = _ref2.footerId;
  var buttonId = "videoBackBtn_".concat(footerId);
  return "\n        <div id=\"".concat(buttonId, "\" class=\"vidPopBackBtn vidControlsBtn rel\" tabindex=\"0\" role=\"button\" name=\"").concat(SL.UI.label_rewind, ": control + alt + I\" aria-label=\"").concat(SL.UI.label_rewind, ": control + alt + I\">\n            <div class=\"iconHolder\" aria-hidden=\"true\">").concat(icons.icon_Rewind, "</div>\n            ").concat(HShell.core.getComponent('Tooltip').init({
    targetId: buttonId,
    text: SL.UI.label_rewind,
    languageItem: 'label_rewind'
  }), "\n        </div>\n    ");
}

function getPlayPouseTemplate(_ref3) {
  var HShell = _ref3.HShell,
      SL = _ref3.SL,
      icons = _ref3.icons,
      footerId = _ref3.footerId;
  var buttonId = "videoPlayBtn_".concat(footerId);
  return "\n        <div\n            id=\"".concat(buttonId, "\"\n            class=\"vidPopPlayBtn vidControlsBtn rel\"\n            tabindex=\"0\"\n            role=\"button\"\n            name=\"").concat(SL.UI.label_play, ": control + alt + K\"\n            aria-label=\"").concat(SL.UI.label_play, ": control + alt + K\"\n        >\n            <div class=\"iconHolder pauseIcon\" aria-hidden=\"true\">").concat(icons.icon_Pause, "</div>\n            <div class=\"iconHolder playIcon\" aria-hidden=\"true\">").concat(icons.icon_Play, "</div>\n            ").concat(HShell.core.getComponent('Tooltip').init({
    targetId: buttonId,
    text: SL.UI.label_pause,
    languageItem: 'label_play'
  }), "\n        </div>\n    ");
}

function getStopTemplate(_ref4) {
  var HShell = _ref4.HShell,
      SL = _ref4.SL,
      icons = _ref4.icons,
      footerId = _ref4.footerId;
  var buttonId = "videoStopBtn_".concat(footerId);
  return "\n        <div id=\"".concat(buttonId, "\" class=\"vidPopStopBtn vidControlsBtn rel\" tabindex=\"0\" role=\"button\" name=\"").concat(SL.UI.label_stop, ": control + alt + S\" aria-label=\"").concat(SL.UI.label_stop, ": control + alt + S\">\n            <div class=\"iconHolder\" aria-hidden=\"true\">").concat(icons.icon_Stop, "</div>\n            ").concat(HShell.core.getComponent('Tooltip').init({
    targetId: buttonId,
    selector: '.vidPopBtnToolTip',
    text: SL.UI.label_stop,
    languageItem: 'label_stop'
  }), "\n        </div>\n    ");
}

function getVolumeTemplate(_ref5) {
  var HShell = _ref5.HShell,
      volume_level = _ref5.volume_level,
      icons = _ref5.icons,
      SL = _ref5.SL,
      footerId = _ref5.footerId;
  var isMuted = volume_level !== 10,
      labelText = isMuted ? SL.UI.label_unMute : SL.UI.label_mute,
      labelLanguageItem = isMuted ? 'label_unMute' : 'label_mute',
      class_Muted = isMuted ? 'muted' : '',
      buttonId = "videoMuteBtn_".concat(footerId);
  return "\n        <div id=\"".concat(buttonId, "\" class=\"vidPopMuteBtn vidControlsBtn rel ").concat(class_Muted, "\" tabindex=\"0\" role=\"button\" name=\"").concat(labelText, ": control + alt + M\" aria-label=\"").concat(labelText, ": control + alt + M\">\n            <div class=\"iconHolder muteIcon\" aria-hidden=\"true\">").concat(icons.icon_Sound_mute, "</div>\n            <div class=\"iconHolder unmuteicon\" aria-hidden=\"true\">").concat(icons.icon_Sound_volume_2, "</div>\n            ").concat(HShell.core.getComponent('Tooltip').init({
    targetId: buttonId,
    selector: '.vidPopBtnToolTip',
    text: labelText,
    languageItem: labelLanguageItem
  }), "\n        </div>\n    ");
}

function getTranscriptTemplate(_ref6) {
  var HShell = _ref6.HShell,
      SL = _ref6.SL,
      transcriptUrl = _ref6.transcriptUrl,
      icons = _ref6.icons,
      footerId = _ref6.footerId;
  var template = '',
      buttonId = "videoDownloadTranscriptBtn_".concat(footerId);

  if (typeof transcriptUrl === 'string' && transcriptUrl.length > 11) {
    template = "\n            <a id=\"".concat(buttonId, "\" class=\"vidPopTranscriptBtn\" tabindex=\"0\" name=\"").concat(SL.UI.label_downloadTranscript, "\" aria-label=\"").concat(SL.UI.label_downloadTranscript, "\" href=\"").concat(transcriptUrl, "\" download=\"\" target=\"_blank\">\n                <span class=\"separator\"></span>\n                <div class=\"iconHolder\" aria-hidden=\"true\">").concat(icons.icon_transcript, "'</div>\n                ").concat(HShell.core.getComponent('Tooltip').init({
      targetId: buttonId,
      selector: '.vidPopBtnToolTip',
      text: SL.UI.label_downloadTranscript,
      languageItem: 'label_downloadTranscript'
    }), "\n            </a>\n        ");
  }

  return template;
}

function getTimeTemplate(_ref7) {
  var HShell = _ref7.HShell,
      SL = _ref7.SL,
      totalTime = _ref7.totalTime,
      currentTime = _ref7.currentTime;
  var total = HShell.utils.convertSecondsToTime(Math.round(totalTime), 'MS'),
      current = HShell.utils.convertSecondsToTime(Math.round(currentTime), 'MS'),
      currentMinutes = Math.floor(currentTime / 60),
      currentSeconds = Math.floor(currentTime % 60),
      totalMinutes = Math.floor(totalTime / 60),
      totalSeconds = Math.floor(totalTime % 60),
      class_visible = totalTime ? 'visible' : '';
  return "\n        <div class=\"vidPopTimerContainer noSelect ".concat(class_visible, "\">\n            <div class=\"vidPopCurrentTime rel\" aria-hidden=\"true\">").concat(current, "</div>\n            <div class=\"vidPopTimeSlash rel\" aria-hidden=\"true\">-</div>\n            <div class=\"vidPopAllTime rel\" aria-hidden=\"true\">").concat(total, "</div>\n\n            <p id=\"vidPopScreenReaderTime\" class=\"offScreen\" role=\"timer\" aria-live=\"off\">\n                ").concat(currentMinutes, " ").concat(SL.UI.minutes, " ").concat(currentSeconds, " ").concat(SL.UI.seconds, "\n                out of\n                ").concat(totalMinutes, " ").concat(SL.UI.minutes, " ").concat(totalSeconds, " ").concat(SL.UI.seconds, "\n            </p>\n        </div>\n    ");
}

function getSubtitlesTemplate(_ref8) {
  var HShell = _ref8.HShell,
      SL = _ref8.SL,
      icons = _ref8.icons,
      subtitles = _ref8.subtitles,
      footerId = _ref8.footerId;
  var template = '',
      buttonId = "videoSubtitlesBtn_".concat(footerId),
      isActive = false,
      // HShell.userData.prefer_subtitles,
  class_isActive = isActive ? 'active' : '',
      labelText = isActive ? SL.UI.lable_subtitles_disable : SL.UI.lable_subtitles_enable,
      labelLanguageItem = isActive ? 'lable_subtitles_disable' : 'lable_subtitles_enable';

  if (subtitles) {
    template = "\n            <div id=\"".concat(buttonId, "\" class=\"vidPopSubtitles ").concat(class_isActive, "\" tabindex=\"0\" role=\"button\" name=\"").concat(labelText, "\" aria-label=\"").concat(labelText, "\">\n                <span class=\"separator\"></span>    \n                <div class=\"iconHolder\" aria-hidden=\"true\">").concat(icons.icon_subtitles, "</div>\n                ").concat(HShell.core.getComponent('Tooltip').init({
      targetId: buttonId,
      selector: '.vidPopBtnToolTip',
      text: labelText,
      languageItem: labelLanguageItem
    }), "\n            </div>\n        ");
  }

  return template;
}

function getRightButtons(_ref9) {
  var HShell = _ref9.HShell,
      rightButtonLable = _ref9.rightButtonLable;
  var template = '';

  if (String(rightButtonLable) != 'undefined' && rightButtonLable !== null && rightButtonLable !== '') {
    template = HShell.core.getComponent('Button').init({
      id: 'vidPopSkipBTN',
      text: rightButtonLable,
      icon: 'icon_arrow_forward'
    });
  }

  return template;
}

function getHomeButton(_ref10) {
  var SL = _ref10.SL,
      icons = _ref10.icons,
      noHome = _ref10.noHome,
      isActive = _ref10.isActive;
  var SHORTCUT = 'control + alt + h';
  var template = '';

  if (noHome !== true) {
    var class_inactive = isActive ? '' : 'inactive';
    template = "\n            <div\n                class=\"vidPopClose rel ".concat(class_inactive, "\"\n                tabindex=\"0\"\n                role=\"button\"\n                aria-label=\"").concat(SL.UI.home, ": ").concat(SHORTCUT, "\"\n                name=\"").concat(SL.UI.home, ": ").concat(SHORTCUT, "\"\n                aria-label=\"").concat(SL.UI.home, ": ").concat(SHORTCUT, "\"\n                data-uniclick=\"onHomeClicked\"\n            >\n                <span>").concat(SL.UI.home, "</span>\n                <span class=\"close iconHolder\" aria-hidden=\"true\">").concat(icons.icon_arrow_forward, "</span>\n            </div>\n        ");
  }

  return template;
}

var listboxIndex = 0;

function getPlaybackSpeedTemplate() {
  var template = '';
  currentListboxIndex = listboxIndex++;
  template = "\n        <div class=\"vidSpeedControlContainerMobile\" data-nextspeed=\"1.2\">\n            <b role=\"button\" aria-hidden=\"true\" class=\"vidSpeedControlMobile active\" style=\"border-left:0px;padding-left:5px\">1.0</b>\n        </div>\n    \n        <div class=\"vidSpeedControlContainer\">\n            <div class=\"vidSpeedLabel\" aria-hidden=\"true\">speed:</div>\n            <div class=\"vidSpeedControlExpandButton\" role=\"combobox\" aria-expanded=\"false\" aria-controls=\"listbox-".concat(currentListboxIndex, "\" data-listboxid=\"", "listbox-".concat(currentListboxIndex), "\" aria-haspopup=\"listbox\" tabindex=\"0\" aria-activedescendant=\"option-").concat(currentListboxIndex, "-1\" aria-label=\"Select video playback speed\">\n                1.0\n            </div>\n            <ul role=\"listbox\" class=\"vidSpeedControlDropdownList\" id=\"listbox-").concat(currentListboxIndex, "\" tabindex=\"-1\">\n                <li role=\"option\" class=\"vidSpeedControl\" aria-selected=\"false\" data-speed=\"2.0\" aria-label=\"Set playback speed to 2.0\" tabindex=\"0\" id=\"option-").concat(currentListboxIndex, "-4\">2.0</li>\n                <li role=\"option\" class=\"vidSpeedControl\" aria-selected=\"false\" data-speed=\"1.5\" aria-label=\"Set playback speed to 1.5\" tabindex=\"0\" id=\"option-").concat(currentListboxIndex, "-3\">1.5</li>\n                <li role=\"option\" class=\"vidSpeedControl\" aria-selected=\"false\" data-speed=\"1.2\" aria-label=\"Set playback speed to 1.2\" tabindex=\"0\" id=\"option-").concat(currentListboxIndex, "-2\">1.2</li>\n                <li role=\"option\" class=\"vidSpeedControl active\" aria-selected=\"true\" data-speed=\"1.0\" aria-label=\"Set playback speed to Normal\" style=\"border-left:0px\" tabindex=\"0\" id=\"option-").concat(currentListboxIndex, "-1\">1.0</li>\n            </ul>\n        </div>\n    "); // <img src="css/images_coreUI/speedIcon.png" width="45" alt="Speed" style="vertical-align: middle;margin-top:0px">
  // <img src="css/images_coreUI/speedIcon_S.png" width="30" alt="Speed" style="vertical-align: middle;margin-top:-6px">

  return template;
}

},{}],32:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.common = void 0;

var _common = require("./common.template");

var common = {
  loadEndOfModuleAudio: loadEndOfModuleAudio
};
exports.common = common;
var HShell = window.HShell || {};

function loadEndOfModuleAudio() {
  if (typeof window.courseSpesific_loadEndOfModuleAudio == 'function') {
    window.courseSpesific_loadEndOfModuleAudio();
  }

  var audioUrl = "content/".concat(this.UI.code, "/modules/moduleEnd.mp3");
  $('#hiddenAudioElement').remove();

  if (window.selectVideoPlayerMethod() == 0) {
    var preventUrlCash = HShell.globalSetup.devMode ? "?".concat(String(Math.random() * 100000)) : '';
    $('body').append(_common.templates.endOfModuleFlashAudio({
      preventUrlCash: preventUrlCash,
      audioUrl: audioUrl
    }));
  } else {
    if (typeof HShell.courseSpecific.content.moduleEndAudio != 'undefined') {
      HShell.courseSpecific.content.moduleEndAudio.pause();
    } // HShell.courseSpecific.content.moduleEndAudio = new Audio(audioUrl);

  }
}

},{"./common.template":33}],33:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var templates = {
  endOfModuleFlashAudio: endOfModuleFlashAudio
};
exports.templates = templates;

function endOfModuleFlashAudio(_ref) {
  var preventUrlCash = _ref.preventUrlCash,
      audioUrl = _ref.audioUrl;
  // --- The classId attribute is there for IE 9/8 and 7 support. It dose not work without it
  return "\n            <object \n                data=\"js/uniPlayAudio.swf".concat(preventUrlCash, "\"\n                id=\"hiddenAudioElement\"\n                tabindex=\"-1\"\n                width=\"100\"\n                height=\"100\"\n                class=\"offScreen\"\n                classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\"\n                type=\"application/x-shockwave-flash\"\n            >\n                <param name=\"movie\" value=\"js/uniPlayAudio.swf").concat(preventUrlCash, "\" />\n                <param name=\"FlashVars\" VALUE=\"audioURL=").concat(audioUrl, "\" />\n                <param name=\"bgcolor\" value=\"#008800\" />\n            </object>\n        ");
}

},{}],34:[function(require,module,exports){
var _ModuleSelect_Grid = require("./ModuleSelect_Grid.template");

var _common = require("../Common/common");

var HShell = window.HShell || {};

function ModuleSelect_Grid() {
  this.SL = HShell.content.selected_languageObj;
  this.UI = HShell.content.selected_languageObj.UI;
}

ModuleSelect_Grid.prototype.onComponentRender = function () {
  _common.common.loadEndOfModuleAudio.call(this);

  window.populateProgressMenu();
  this.$on('locationChange', this.onLocationChange.bind(this));
};

ModuleSelect_Grid.prototype.onLocationChange = function (payload) {
  var $mainContainer = $(this._wrapper.querySelector('.ModuleSelect'));

  switch (payload.newLocation) {
    case 'mod_select':
      $mainContainer.removeClass('ModuleSelect--hidden');
      break;

    default:
      $mainContainer.addClass('ModuleSelect--hidden');
  }
};

ModuleSelect_Grid.prototype.render = function (_ref) {
  var configXmlOptions = _ref.configXmlOptions;
  var bgUrl = configXmlOptions.type ? configXmlOptions.type._background : '',
      isFullHeight = !+configXmlOptions.header,
      hasHeader = +HShell.content.configXMLObject.config.mainSettings.moduleSelect.header;
  return _ModuleSelect_Grid.templates.main({
    modulesGroupArray: this.SL.modulesGroupArray,
    bgUrl: bgUrl,
    isFullHeight: isFullHeight,
    hasHeader: hasHeader
  });
};

HShell.core.registerComponent(ModuleSelect_Grid, 'ModuleSelect_Grid');

},{"../Common/common":32,"./ModuleSelect_Grid.template":35}],35:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var HShell = window.HShell;
var templates = {
  main: main
};
exports.templates = templates;

function main(_ref) {
  var modulesGroupArray = _ref.modulesGroupArray,
      bgUrl = _ref.bgUrl,
      isFullHeight = _ref.isFullHeight,
      hasHeader = _ref.hasHeader;
  var iOS = HShell.autoSetup.runOn.OS === 'iOS',
      windowsPhone = HShell.autoSetup.runOn.OS === 'windowsPhone',
      style_bg = bgUrl ? "background-image:url('content/".concat(bgUrl, "')") : '',
      style_WPheight = iOS || windowsPhone ? "min-height:calc(".concat(iOS ? 100 : HShell.autoSetup.fullFrameHeight, "vh - 260px) !important") : '',
      class_fullHeight = isFullHeight ? 'ModuleSelect--fullHeight' : '',
      class_noHeader = hasHeader ? '' : 'ModuleSelect--hoHeader';
  return "\n            <div id=\"mainContentContainer\" class=\"ModuleSelect ModuleSelect--grid ".concat(class_fullHeight, " ").concat(class_noHeader, "\">\n                <div id=\"homePageContainer\" class=\"ModuleSelect__Container rel\">\n                    ").concat(HShell.core.getComponent('CourseInfo').init({
    hasLogo: true,
    hasTitle: true
  }), "\n\n                    <div id=\"modulesListContainerOuter\" class=\"ModuleSelect__ListOuterContainer rel\">\n                        <div role=\"main\">\n                            <ol id=\"modulesListContainer\" class=\"ModuleSelect__ListContainer rel\" style=\"").concat(style_bg, ";").concat(style_WPheight, "\">\n                                ").concat(getAllModulesItems({
    modulesGroupArray: modulesGroupArray
  }), "\n                            </ol>\n\n                            ").concat(bgUrl ? "<img class=\"ModuleSelect__BGImage\" src=\"content/".concat(bgUrl, "\"/>") : '', "\n                        </div>\n                    </div>\n                </div>\n            </div>\n        ") //     <div id="mainFooterContainer">
  //         ${HShell.core.getComponent('CopyRight').init()}
  //     </div>
  ;
}

function getAllModulesItems(_ref2) {
  var modulesGroupArray = _ref2.modulesGroupArray;
  var html = '';
  modulesGroupArray.forEach(function (group, groupKey) {
    group.modulesArray.forEach(function (module, moduleKey) {
      html += HShell.core.getComponent('ModulesList_Item_Grid').init({
        module: module,
        groupKey: groupKey,
        moduleKey: moduleKey
      });
    });
  });
  return html;
}

},{}],36:[function(require,module,exports){
var _ModuleSelect_Rows = require("./ModuleSelect_Rows.template");

var _common = require("../Common/common");

var HShell = window.HShell || {};

function ModuleSelect_Rows() {
  this.SL = HShell.content.selected_languageObj;
  this.UI = HShell.content.selected_languageObj.UI;
  HShell.core.$on('onModulesFilterChange', this.onModulesFilterChange);
  this.$on('onModuleStatusChanged', this.onModuleStatusChange);
}

ModuleSelect_Rows.prototype.onModulesFilterChange = function (activeFilter) {
  /**
   * @todo - the way that the list is done (saving the data in the html) is very poor if we want to rerender any component.
   * @todo - we have to remove the data from the html template, and keep it as state inside the component
  */
  switch (activeFilter) {
    case 'all':
      $('.oneModuleItemContainer').show().removeClass('notVisible');
      $('.modulesGroupContainer ').show();
      $('#compleatedPlaceholder, #toDoPlaceholder').hide();
      $('#modulesFiltersFieldset').find('#filterAllModules').prop('checked', true);
      break;

    case 'finished':
      $('.oneModuleItemContainer').hide().addClass('notVisible');
      $('.oneModuleItemContainer.' + activeFilter).show().removeClass('notVisible');
      $('.modulesGroupContainer').each(function () {
        if ($(this).find('.notVisible').length == $(this).find('.oneModuleItemContainer').length) {
          $(this).hide();
        } else {
          $(this).show();
        }
      });
      if ($('.oneModuleItemContainer.finished').length == 0) $('#compleatedPlaceholder').show();
      $('#toDoPlaceholder').hide();
      $('#modulesFiltersFieldset').find('#filterCompleted').prop('checked', true);
      break;

    case 'toDo':
      $('.oneModuleItemContainer').hide().addClass('notVisible');
      $('.oneModuleItemContainer.notStarted.mandatory, .oneModuleItemContainer.started.mandatory').show().removeClass('notVisible');
      $('.modulesGroupContainer').each(function () {
        if ($(this).find('.notVisible').length == $(this).find('.oneModuleItemContainer').length) {
          $(this).hide();
        } else {
          $(this).show();
        }
      });
      if ($('.oneModuleItemContainer.started.mandatory, .oneModuleItemContainer.notStarted.mandatory').length == 0) $('#toDoPlaceholder').show();
      $('#compleatedPlaceholder').hide();
      $('#modulesFiltersFieldset').find('#filterInProgress').prop('checked', true);
      break;
  }
};

ModuleSelect_Rows.prototype.onModuleStatusChange = function () {
  window.restoreProgressFromArray();
};

ModuleSelect_Rows.prototype.onComponentRender = function () {
  _common.common.loadEndOfModuleAudio.call(this);

  createMainContentModules.call(this);
  this.$on('locationChange', this.onLocationChange.bind(this));
};

ModuleSelect_Rows.prototype.render = function () {
  var haveSocial = window.have_socialContent;
  return _ModuleSelect_Rows.templates.main({
    haveSocial: haveSocial,
    HShell: HShell
  });
};

ModuleSelect_Rows.prototype.onLocationChange = function (payload) {
  var $mainContainer = $(this._wrapper.querySelector('.ModuleSelect'));

  switch (payload.newLocation) {
    case 'mod_select':
      $mainContainer.removeClass('ModuleSelect--hidden');
      break;

    default:
      $mainContainer.addClass('ModuleSelect--hidden');
  }
};

function createMainContentModules() {
  $('#SCORM_Container, #mainContentContainer').scrollTop(0);

  if (HShell.autoSetup.modulesFirstLoad) {
    $('#modulesListContainer').append(_ModuleSelect_Rows.templates.modulesGroup({
      HShell: HShell,
      modulesGroupArray: this.SL.modulesGroupArray,
      toDoPlaceholder: this.UI.toDoPlaceholder,
      compleatedPlaceholder: this.UI.compleatedPlaceholder
    }));
    HShell.core.renderComponents('#homePageContainer', this);

    if (HShell.globalSetup.devMode || HShell.globalSetup.qaMode) {
      $('.QaModuleNumber').show();
    }

    reskinAllContent($('.modulesGroupContainer'));
    /************************************************************************** */

    enableModulesQuizFuncs();
    enableModuleNotificationFunc();
    populateProgressMenu(); // Adds the number of the modules on the top menu
    // for (var i = 0; i < HShell.content.preAssessObj.finishedModules.length; i++) {
    //     var currentFinishedModule = $('.ModList__Item[moduleId="' + HShell.content.preAssessObj.finishedModules[i] + '"]');
    //     var currentFinishedModuleInAllModules = HShell.content.selected_languageObj.allModules.find(function (el) {
    //         return el.mod_id == HShell.content.preAssessObj.finishedModules[i];
    //     });
    //     if (currentFinishedModuleInAllModules.completion_status === 'completed') {
    //         currentFinishedModule
    //             .removeClass('notStarted')
    //             .addClass('finished quizPassed contentPassed')
    //             .find('.oneModulePassButtonImg.iconHolder')
    //             .html(HShell.consts.iconsObj.icon_check);
    //         if (currentFinishedModuleInAllModules.finishedInPreA) {
    //             currentFinishedModule.addClass('finishedInPreA');
    //         }
    //         currentFinishedModule.find('.oneModuleQuizButtonContainer').addClass('completed');
    //         $('.oneProgressItem[modId="' + HShell.content.preAssessObj.finishedModules[i] + '"]').removeClass('inProgress').addClass('finished');
    //     }
    // }

    $('#SCORM_Container, #mainContentContainer').scrollTop(0);

    if (HShell.content.obejectivesCount <= 1 || !HShell.contentSetup.enableDataSavings) {
      // in case this is the first time you reach the modules section
      createInitialModuleData();
    }

    HShell.autoSetup.modulesFirstLoad = false;
    restoreProgressFromArray();
    expandNotifications();
  }
}

HShell.core.registerComponent(ModuleSelect_Rows, 'ModuleSelect_Rows');

},{"../Common/common":32,"./ModuleSelect_Rows.template":37}],37:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var templates = {
  main: main,
  modulesGroup: modulesGroup
};
exports.templates = templates;

function main(_ref) {
  var haveSocial = _ref.haveSocial,
      HShell = _ref.HShell;
  var moduleSelect = HShell.content.configXMLObject.config.mainSettings.moduleSelect || {};
  var modulesListContainerClassMod = haveSocial ? 'big' : '',
      class_fullHeight = +moduleSelect.header ? '' : 'ModuleSelect--fullHeight',
      hasSubtitle = false,
      // disable subtitle for the new design
  isCourseFinished = HShell.savedData.completion_status === 'completed',
      assessmentButtonText = isCourseFinished ? window.SL.UI.goToConfirmation : window.SL.UI.startPostAssessment,
      courseFinClass = isCourseFinished ? 'finished' : '',
      assessmentStyle = isCourseFinished ? 'style="display:block !important"' : '';
  return "\n            <div id=\"mainContentContainer\" class=\"ModuleSelect ModuleSelect--row ".concat(class_fullHeight, "\">\n                <div id=\"homePageContainer\" class=\"ModuleSelect__Container rel\">\n                    ").concat(HShell.core.getComponent('CourseInfo').init({
    hasLogo: true,
    hasTitle: true,
    hasDescription: true,
    hasSubtitle: hasSubtitle
  }), "\n\n                    <div id=\"postAssessmentLaunchButtonContainer\">\n                        <div id=\"goToConfirmationDescription\" class=\"").concat(isCourseFinished ? 'shown' : '', "\">\n                            <div class=\"title\">").concat(window.SL.UI.wellDone, "</div>\n                            <div class=\"subtitle\">").concat(window.SL.UI.confirmationDescription, "</div>\n                        </div>\n                        <div id=\"postAssessmentLaunchButton\" class=\"noSelect ").concat(courseFinClass, "\" tabindex=\"0\" role=\"button\" ").concat(assessmentStyle, " aria-label=\"").concat(assessmentButtonText, "\">\n                            <div id=\"postAssessmentLaunchButtonText\" data-languageItem=\"' + assessmentButtonLangItem + '\" class=\"langItem rel\">").concat(assessmentButtonText, "</div>\n                        </div>\n                    </div>\n\n                    <div id=\"modulesListContainerOuter\" class=\"ModuleSelect__ListOuterContainer rel\">\n                        ", "\n\n                        <div role=\"main\">\n                            <ol id=\"modulesListContainer\" class=\"ModuleSelect__ListContainer rel ").concat(modulesListContainerClassMod, "\"></ol>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        ") // disable for the new design
  // <div id="mainFooterContainer">
  //     ${HShell.core.getComponent('CopyRight').init()}
  // </div>
  ;
}

function modulesGroup(_ref2) {
  var modulesGroupArray = _ref2.modulesGroupArray,
      toDoPlaceholder = _ref2.toDoPlaceholder,
      compleatedPlaceholder = _ref2.compleatedPlaceholder,
      HShell = _ref2.HShell;
  var html = '';

  function getHeader(key, item) {
    var headerHtml = '';
    var moduleGroupUIIndex = key + 1;

    if (modulesGroupArray.length > 1) {
      headerHtml = "<h3 class=\"modulesGroupTitle rel langItem moduleItem\" data-languageItem=\"groupTitle\" data-moduleGArrayId=\"".concat(key, "\">\n                    ").concat(moduleGroupUIIndex < 10 ? '0' + moduleGroupUIIndex : moduleGroupUIIndex, ". ").concat(item.groupTitle, "\n                </h3>");
    }

    return headerHtml;
  }

  function getModulesList(groupKey, group) {
    var modulesHtml = '';
    group.modulesArray.forEach(function (module, key) {
      modulesHtml += HShell.core.getComponent('ModulesList_Item_Rows').init({
        module: module,
        modulesGroupArrayId: groupKey,
        modulesArrayId: key
      }); // modulesHtml += buildOneModuleItem(item, groupKey, key);
    });
    return modulesHtml;
  }

  modulesGroupArray.forEach(function (item, key) {
    html += "\n                <li class=\"modulesGroupContainer rel\" data-moduleGArrayId=\"".concat(key, "\">\n                    ").concat(getHeader(key, item), "\n                    <ol class=\"modulesGroupContentContaienr rel\">\n                        ").concat(getModulesList(key, item), "\n                    </ol>\n                </li>\n            ");
  });
  html += "\n            <div class=\"filterPlaceholder rel langItem\" id=\"toDoPlaceholder\" data-languageItem=\"toDoPlaceholder\">".concat(toDoPlaceholder, "</div>\n            <div class=\"filterPlaceholder rel langItem\" id=\"compleatedPlaceholder\" data-languageItem=\"compleatedPlaceholder\">").concat(compleatedPlaceholder, "</div>\n        ");
  return html;
}

},{}],38:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.a11y = void 0;
var HShell = window.HShell || {};
var a11y = {
  quiz_images: quiz_images,
  quiz_images_readQuestion: quiz_images_readQuestion,
  quiz_images_readFeedback: quiz_images_readFeedback,
  vertical_tabs: vertical_tabs,
  horizontal_tabs: horizontal_tabs,
  horizontal_tabs_readTabContnt: horizontal_tabs_readTabContnt,
  sequence: sequence,
  sequence_readTabContent: sequence_readTabContent,
  icons_discover: icons_discover,
  icons_discover_readTabContent: icons_discover_readTabContent,
  hidden_items: hidden_items,
  hidden_items_readDescription: hidden_items_readDescription,
  fullscreen_video: fullscreen_video,
  small_video: small_video,
  video_interactionPoint_discover_readDescription: video_interactionPoint_discover_readDescription,
  video_interactionPoint_mandatoryQuestion_readQuestionText: video_interactionPoint_mandatoryQuestion_readQuestionText,
  video_interactionPoint_mandatoryQuestion_readFeedback: video_interactionPoint_mandatoryQuestion_readFeedback,
  two_columns_text: two_columns_text,
  text_and_image: text_and_image,
  fullscreen_text_and_image: fullscreen_text_and_image,
  title: title,
  object_viewer: object_viewer,
  footer: footer
};
exports.a11y = a11y;

function two_columns_text($currentTemplate) {
  var commonText = _getCommonSectionA11yText($currentTemplate);

  var text = $currentTemplate.find('.leftColumnContainer .text').text() + '. ' + $currentTemplate.find('.rightColumnContainer .text').text();

  _speak(commonText + text, $currentTemplate);
}

function horizontal_tabs_readTabContnt($tab, onlyReturnTabContent) {
  var totalTabs = $tab.closest('.layoutTemplateContentContainer').find('.tabContent').length;
  var currentTab = Number($tab.data('tabindex')) + 1;
  var text = $tab.find('.textContainer').text();
  var textToRead = 'Tab ' + currentTab + ' out of ' + totalTabs + '. ' + text;

  if (onlyReturnTabContent) {
    return textToRead;
  }

  _speak(textToRead, null, true);
}

function vertical_tabs($currentTemplate) {
  // if the first tab contains video, focus the play btn
  $currentTemplate.find('.tabContent.active .playBtnContainer').first().focus();

  var commonText = _getCommonSectionA11yText($currentTemplate);

  var text = horizontal_tabs_readTabContnt($currentTemplate.find('.tabContent.active'), true);

  _speak(commonText + ' ' + text, $currentTemplate);
}

function horizontal_tabs($currentTemplate) {
  // if the first tab contains video, focus the play btn
  $currentTemplate.find('.tabContent.active .playBtnContainer').first().focus();

  var commonText = _getCommonSectionA11yText($currentTemplate);

  var text = horizontal_tabs_readTabContnt($currentTemplate.find('.tabContent.active'), true);

  _speak(commonText + ' ' + text, $currentTemplate);
}

function icons_discover_readTabContent($tab, onlyReturnTabContent) {
  var totalTabs = $tab.closest('.layoutTemplateContentContainer').find('.tabContent').length;
  var currentTab = Number($tab.data('tabindex')) + 1;
  var text = $tab.find('.textContainer').text();
  var textToSpeak = 'Item ' + currentTab + ' out of ' + totalTabs + '. ' + text;

  if (onlyReturnTabContent) {
    return textToSpeak;
  }

  _speak(textToSpeak, null, true);
}

function icons_discover($currentTemplate) {
  var commonText = _getCommonSectionA11yText($currentTemplate);

  var tabText = icons_discover_readTabContent($currentTemplate.find('.tabContent.active'), true);

  _speak(commonText + ' ' + tabText, $currentTemplate);
}

function quiz_images_readFeedback($feedbackContainer) {
  var title = $feedbackContainer.find('.title').text();
  title = title + '. ' || '';
  var text = $feedbackContainer.find('.text').text();
  text = text || '';

  _speak(title + text, null, true);
}

function quiz_images_readQuestion($question, onlyReturnContent) {
  var text = $question.find('.questionText').text();

  if (onlyReturnContent) {
    return text;
  }

  _speak(text, null, true);
}

function quiz_images($currentTemplate) {
  var commonText = _getCommonSectionA11yText($currentTemplate);

  var text = quiz_images_readQuestion($currentTemplate.find('.question[data-questionindex="0"]'), true);

  _speak(commonText + ' ' + text, $currentTemplate);
}

function sequence_readTabContent($tab, onlyReturnTabContent) {
  var $textEl = $tab.find('.textContainer');
  var $videoEl = $tab.find('.vidPopVideoContainer');
  var $quetsionEl = $tab.find('.questionTextContainer');
  var textToRead = '';

  if ($textEl.length > 0) {
    textToRead = $textEl.text();
  } else if ($videoEl.length > 0) {
    textToRead = _commonVideoA11yText();
  } else if ($quetsionEl.length > 0) {
    textToRead = $quetsionEl.text();
  }

  if (onlyReturnTabContent) {
    return textToRead;
  }

  _speak(textToRead, null, true);
}

function sequence($currentTemplate) {
  $currentTemplate.find('.tabContent.active .playBtnContainer').first().focus();

  var commonText = _getCommonSectionA11yText($currentTemplate);

  var tabText = sequence_readTabContent($currentTemplate.find('.tabContent.active'), true);

  _speak(commonText + ' ' + tabText, $currentTemplate);
}

function hidden_items($currentTemplate) {
  var commonText = _getCommonSectionA11yText($currentTemplate);

  _speak(commonText, $currentTemplate);
}

function hidden_items_readDescription($descriptionContainer) {
  var title = $descriptionContainer.find('.itemDescriptionTitle').text();
  title = title + '. ' || '';
  var text = $descriptionContainer.find('.itemDescriptionText').text();
  text = text || '';

  _speak(title + text, null, true);
}

function text_and_image($currentTemplate) {
  var commonText = _getCommonSectionA11yText($currentTemplate);

  var text = ''; // REVERT - Read all the content. ## Mantis #580 - Only read title and subtitle. Users can navigate with up/down arrows for the other sections.

  $currentTemplate.find('.rowContent .mobileContentContainer').each(function (i, content) {
    text += $(content).find('.text').html().replace('<h1>', '').replace('</h1>', '. ').replace('<h2>', '').replace('</h2>', '. ').replace('<h3>', '').replace('</h3>', '. ');
  });

  _speak(commonText + text, $currentTemplate);
}

function title($currentTemplate) {
  var commonText = _getCommonSectionA11yText($currentTemplate);

  _speak(commonText, $currentTemplate);
}

function object_viewer($currentTemplate) {
  var commonText = _getCommonSectionA11yText($currentTemplate);

  _speak(commonText, $currentTemplate);
}

function video_interactionPoint_discover_readDescription($descriptionContainer) {
  var title = $descriptionContainer.find('.description .title').text();
  title = title + '. ' || '';
  var text = $descriptionContainer.find('.description .text').text();
  text = text || '';

  _speak(title + text, null, true);
}

function video_interactionPoint_mandatoryQuestion_readQuestionText($questionTextContainer) {
  var title = 'Question: ';
  var text = ($questionTextContainer.text() || '').trim();

  _speak(title + text, null, true);
}

function video_interactionPoint_mandatoryQuestion_readFeedback($feedbackContainer) {
  var title = ($feedbackContainer.find('.title').text() || '').trim();
  var text = ($feedbackContainer.find('.text').text() || '').trim();

  _speak(title + '! ' + text, null, true);
}

function fullscreen_text_and_image($currentTemplate) {
  var commonText = _getCommonSectionA11yText($currentTemplate);

  var title = $currentTemplate.find('.contentContainer .title').text();
  var text = $currentTemplate.find('.contentContainer .text').text();

  _speak(commonText + title + '. ' + text, $currentTemplate);
}

function small_video($currentTemplate) {
  var commonText = _getCommonSectionA11yText($currentTemplate);

  var text = _commonVideoA11yText();

  _speak(commonText + text, $currentTemplate);
}

function fullscreen_video($currentTemplate) {
  var commonText = _getCommonSectionA11yText($currentTemplate);

  var text = _commonVideoA11yText();

  _speak(commonText + text, $currentTemplate);
}

function footer($footerElement) {
  var title = $footerElement.find('.footerContent .title').text();
  var text = $footerElement.find('.footerContent .description').text();

  _speak(title + '. ' + text + '. You can use Ctrl + Alt + P to open the Menu.', null, true);
}

function _commonVideoA11yText() {
  return 'Video section. Press the "Play" button to play the video.';
}

function _getCommonSectionA11yText($currentTemplate) {
  var title = $currentTemplate.find('.layoutTitleContainer .layoutTitleMainTitle').text();
  var subtitle = $currentTemplate.find('.layoutTitleContainer .layoutTitleSubTitle').text();

  if (title && subtitle) {
    return title + '. ' + subtitle + ' ';
  }

  return '';
}

function _speak(textToSpeak, $currentTemplate, skipSectionCount) {
  var sectionCount = '';

  if (!skipSectionCount) {
    var totalSections = $('.layoutTemplateContainer').length;
    var currentSectionIndex = Number($currentTemplate.data('layoutid')) + 1;
    var sectionCount = 'Section ' + currentSectionIndex + ' out of ' + totalSections + '. ';
  }

  setTimeout(function () {
    // console.log(sectionCount + textToSpeak);
    HShell.a11y.speak(sectionCount + textToSpeak);
  });
}

},{}],39:[function(require,module,exports){
var _Module_layouts = require("./Module_layouts.template");

var _Module_layoutsTemplate = require("./Module_layouts.template.functionality");

var _Module_layouts2 = require("./Module_layouts.a11y");

var HShell = window.HShell || {};

function Module_layouts() {
  this.SL = HShell.content.selected_languageObj || {};
  this.UI = HShell.content.selected_languageObj.UI || {};
  renderAllLayoutsBound = renderAllLayouts.bind(this);
  _showLayoutsUntilNextLockedBound = _showLayoutsUntilNextLocked.bind(this);
  _attachEventsBound = _attachEvents.bind(this);
  _dettachEventsBound = _dettachEvents.bind(this);

  _Module_layoutsTemplate.customFunctionalities.disableScrolling();

  this.$on('PostAssessment_Started', this.destroy);
}

Module_layouts.prototype.onComponentRender = function () {
  HShell.content.setModuleContent_AsInProgress(this.module.mod_id);
  renderAllLayoutsBound();
  $(this._wrapper).find('.contentContainer .title, .layoutTitleMainTitle').first().attr('aria-level', '1');
  $(this._wrapper).find(':focusable').first().focus();
  $(this._wrapper).find('.ModuleLayouts__Content').scrollTop(0);
};

function _attachEvents() {// $(this._wrapper).find('.layoutBlockingSectionContainer > .button').on('click', _blockingSection_onContinueClick);
}

function _dettachEvents() {// $(this._wrapper).find('.layoutBlockingSectionContainer > .button').off('click', _blockingSection_onContinueClick);
}

Module_layouts.prototype.blockingSection_onContinueClick = function (ev, currentTarget) {
  var $currentTemplate = $(currentTarget).closest('.layoutTemplateContainer');
  var layoutId = $currentTemplate.data('layoutid');
  var moduleData = HShell.storage.loadModuleCustomData(this.module.mod_id) || {};
  moduleData.layoutContinueEnabled = moduleData.layoutContinueEnabled || {};

  if (!(moduleData.layoutContinueEnabled && moduleData.layoutContinueEnabled[layoutId])) {
    return;
  }

  _Module_layoutsTemplate.customFunctionalities.unlockLayout(this.module.mod_id, layoutId);

  _showLayoutsUntilNextLockedBound();

  var $nextLayoutContainer = $(ev.target).closest('.layoutTemplateContainer').next('.layoutTemplateContainer');

  if ($nextLayoutContainer.length > 0) {
    var nextLayoutId = $nextLayoutContainer.data('layoutid');

    _scrollToLayoutById(nextLayoutId);

    var layoutType = $nextLayoutContainer.data('layouttype').replace('_template', '');

    _Module_layouts2.a11y[layoutType]($nextLayoutContainer);

    if (HShell.utils.panoramaViewers) {
      var currentPanoramaViewer = HShell.utils.panoramaViewers[nextLayoutId];

      if (currentPanoramaViewer && currentPanoramaViewer.resize) {
        currentPanoramaViewer.resize();
      }
    }
  } else {
    var $moduleFooter = $(ev.target).closest('.ModuleLayouts').find('.ModuleLayouts__Footer');
    $moduleFooter.show();

    _Module_layoutsTemplate.customFunctionalities.scrollToElement($moduleFooter);

    _Module_layouts2.a11y.footer($moduleFooter);
  }

  _Module_layoutsTemplate.customFunctionalities.closeAllFeedbacks($(this._wrapper));

  _Module_layoutsTemplate.customFunctionalities.pauseAllVideos($(this._wrapper));
};

function _scrollToLayoutById(layoutId) {
  if (!layoutId) {
    return;
  }

  _Module_layoutsTemplate.customFunctionalities.scrollToElement('.layoutTemplateContainer[data-layoutid="' + layoutId + '"]');
}

function _showLayoutsUntilNextLocked() {
  var _this = this;

  var moduleData = HShell.storage.loadModuleCustomData(this.module.mod_id) || {};
  var lockedLayouts = moduleData.lockedLayouts;
  var lockedLayoutsKeys = Object.keys(lockedLayouts);
  $(this._wrapper).find('.layoutTemplateContainer').each(function (index, element) {
    _showLayout($(element));

    var layoutId = $(element).data('layoutid');
    var shouldBeLocked = _this.layouts[layoutId].blockingSection == 'true' || _this.layouts[layoutId].blockingSection == 'false';

    if (!shouldBeLocked) {
      return true;
    } else {
      var isLocked = lockedLayouts[layoutId];

      if (isLocked) {
        var forceUnlock = _this.layouts[layoutId].blockingSection == 'false';

        if (forceUnlock) {
          var $currentTemplate = $(_this._wrapper).find(".layoutTemplateContainer[data-layoutid=\"".concat(layoutId, "\"]"));

          _Module_layoutsTemplate.customFunctionalities.enableContinueButton(_this.module.mod_id, layoutId, $currentTemplate, true);
        }

        return false;
      } else {
        // var nextLockedLayoutIndex = lockedLayoutsKeys.indexOf(layoutId) + 1;
        // var nextLockedLayoutId = typeof nextLockedLayoutIndex !== 'undefined' && lockedLayoutsKeys[nextLockedLayoutIndex];
        // var isLastUnlocked = typeof nextLockedLayoutId !== 'undefined' && lockedLayouts[nextLockedLayoutId];
        // if(isLastUnlocked) {
        //     customFunctionalities.enableContinueButton($(element));
        // } else {
        //     customFunctionalities.hideContinueButton($(element));
        // }
        _Module_layoutsTemplate.customFunctionalities.hideContinueButton($(element));

        return true;
      }
    }
  });
  var lastKeyValue = lockedLayoutsKeys[lockedLayoutsKeys.length - 1];
  var isLastLockedLayoutUnlocked = lockedLayouts[lastKeyValue] === false;

  if (isLastLockedLayoutUnlocked) {
    $(this._wrapper).find('.ModuleLayouts__Footer').show();
  }
}

function _showLayout($layoutTemplateContainer) {
  $layoutTemplateContainer.show().children().show();
}

function _hideLayout($layoutTemplateContainer) {
  $layoutTemplateContainer.hide().children().hide();
}

function renderAllLayouts() {
  var _this2 = this;

  var $layoutsContainer = $(this._wrapper).find('.ModuleLayouts__Content'),
      $layoutsBuilderWrapper = $('<span/>'),
      moduleCustomData = HShell.storage.loadModuleCustomData(this.module.mod_id) || {};
  moduleCustomData.lockedLayouts = moduleCustomData.lockedLayouts || {};
  this.layouts.forEach(function (layout, index) {
    var hasBlockingSection = layout.blockingSection == 'true' || layout.blockingSection == 'false'; // true = actually lock the progress until content is passed, false = show continue button, don't require content to be passed

    if (hasBlockingSection && typeof moduleCustomData.lockedLayouts[index] == 'undefined') {
      moduleCustomData.lockedLayouts[index] = true;
    }

    $layoutsBuilderWrapper.append(_Module_layouts.templates[layout.type + '_template'](layout, _this2.module, index));
  });
  HShell.storage.saveModuleCusomData(this.module.mod_id, moduleCustomData);
  $layoutsContainer.prepend($layoutsBuilderWrapper.html());
  HShell.core.renderComponents($(this._wrapper).find('.videoFooterContainer')); // to render video_footer component

  _attachEventsBound();

  this.layouts.forEach(function (layout, index) {
    if (typeof _Module_layoutsTemplate.customFunctionalities[layout.type] === 'function') {
      _Module_layoutsTemplate.customFunctionalities[layout.type](index, layout, _this2.module, _this2);
    }
  });

  _Module_layoutsTemplate.customFunctionalities.enableScrolling();

  var $allLayoutTemplates = $(this._wrapper).find('.layoutTemplateContainer');

  _hideLayout($allLayoutTemplates); // hide all layouts


  _showLayoutsUntilNextLockedBound();

  var $firstLayoutContainer = $(this._wrapper).find('.layoutTemplateContainer').first();
  var layoutType = $firstLayoutContainer.data('layouttype').replace('_template', '');

  _Module_layouts2.a11y[layoutType]($firstLayoutContainer);
}

Module_layouts.prototype.render = function (_ref) {
  var module = _ref.module;
  this.layouts = module.xmlObj.layouts.layout;

  if (this.layouts && !Array.isArray(this.layouts)) {
    this.layouts = [this.layouts];
  }

  this.module = module;
  this.currentLayoutId = 0;
  return _Module_layouts.templates.main({
    module: module,
    UI: this.UI,
    onNavigation: this.destroy.bind(this)
  });
};

Module_layouts.prototype.onDestroy = function () {
  HShell.userData.setVolumeLevel(10); // reset volume level

  window.changeLastLocation(HShell.consts.locations.moduleSelect);
  HShell.a11y.clearSpeakEl();

  if (HShell.utils.panoramaViewers) {
    Object.keys(HShell.utils.panoramaViewers).forEach(function (layoutId) {
      if (!HShell.utils.panoramaViewers[layoutId]) return true;
      var currentPanoramaViewer = HShell.utils.panoramaViewers[layoutId];
      currentPanoramaViewer.off();
      currentPanoramaViewer.destroy();
      delete HShell.utils.panoramaViewers[layoutId];
    });
  }

  _dettachEventsBound();
};

HShell.core.registerComponent(Module_layouts, 'Module_layouts');

},{"./Module_layouts.a11y":38,"./Module_layouts.template":41,"./Module_layouts.template.functionality":40}],40:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.customFunctionalities = void 0;

var _Module_layouts = require("./Module_layouts.a11y");

var _Module_layouts2 = require("./Module_layouts.template");

var HShell = window.HShell || {};
var isScrollingEnabled = false;
var customFunctionalities = {
  title: title,
  quiz_images: quiz_images,
  horizontal_tabs: horizontal_tabs,
  vertical_tabs: vertical_tabs,
  sequence: sequence,
  icons_discover: icons_discover,
  hidden_items: hidden_items,
  fullscreen_video: fullscreen_video,
  small_video: small_video,
  two_columns_text: two_columns_text,
  text_and_image: text_and_image,
  fullscreen_text_and_image: fullscreen_text_and_image,
  object_viewer: object_viewer,
  enableContinueButton: enableContinueButton,
  hideContinueButton: hideContinueButton,
  unlockLayout: unlockLayout,
  enableScrolling: enableScrolling,
  disableScrolling: disableScrolling,
  scrollToElement: scrollToElement,
  pauseAllVideos: pauseAllVideos,
  closeAllFeedbacks: closeAllFeedbacks
};
exports.customFunctionalities = customFunctionalities;
var SHOW_HIDE_ANIMATION_OPTIONS = {
  effect: 'fade',
  easing: "linear",
  duration: 100
}; // var SHOW_HIDE_ANIMATION_OPTIONS = undefined;

var DROP_ANIMATION_OPTIONS = {
  effect: 'drop',
  direction: 'left',
  duration: 200
};
var DROP_ANIMATION_OPTIONS_MOBILE = {
  duration: 0
};

function title(layoutId, layout, module) {
  var $currentTemplate = $(".title_template[data-layoutid=\"".concat(layoutId, "\"]"));
  enableContinueButton(module.mod_id, layoutId, $currentTemplate);
}

function two_columns_text(layoutId, layout, module) {
  var $currentTemplate = $(".two_columns_text_template[data-layoutid=\"".concat(layoutId, "\"]"));
  enableContinueButton(module.mod_id, layoutId, $currentTemplate);
}

function text_and_image(layoutId, layout, module) {
  var $currentTemplate = $(".text_and_image_template[data-layoutid=\"".concat(layoutId, "\"]"));
  enableContinueButton(module.mod_id, layoutId, $currentTemplate);
}

function fullscreen_text_and_image(layoutId, layout, module) {
  var $currentTemplate = $(".fullscreen_text_and_image_template[data-layoutid=\"".concat(layoutId, "\"]"));
  enableContinueButton(module.mod_id, layoutId, $currentTemplate);
}

function fullscreen_video(layoutId, layout, module) {
  var $currentTemplate = $(".fullscreen_video_template[data-layoutid=\"".concat(layoutId, "\"]"));

  _video_buildVideoPlayer($currentTemplate, layout.videoUrl, layout.subtitlesUrl, module.mod_id);

  _video_attachEvents($currentTemplate, layout, module, layoutId, false, false);
}

function small_video(layoutId, layout, module) {
  var $currentTemplate = $(".small_video_template[data-layoutid=\"".concat(layoutId, "\"]"));

  _video_buildVideoPlayer($currentTemplate, layout.videoUrl, layout.subtitlesUrl, module.mod_id);

  _video_attachEvents($currentTemplate, layout, module, layoutId, false, false);
}

function _video_handleInteractionPoints($videoEl, $currentTemplate, layout, currentlyShowing) {
  var interactions = layout && layout.interactions && layout.interactions.interaction;

  if (interactions && !Array.isArray(interactions)) {
    interactions = [interactions];
  }

  if (!(interactions && interactions.length > 0)) {
    return;
  }

  $videoEl.on('timeupdate', function (ev) {
    interactions.forEach(function (interaction, index) {
      if (!interaction.timeStarts) {
        return true;
      }

      var timeStarts = parseInt(interaction.timeStarts);
      var timeEnds = parseInt(interaction.timeEnds) || timeStarts + 1;

      if (!currentlyShowing[index] && ev.currentTarget.currentTime > timeStarts && ev.currentTarget.currentTime < timeEnds) {
        _video_showInteractionPoint($currentTemplate, interaction.type, index, currentlyShowing);
      } else {
        if (currentlyShowing[index] && ev.currentTarget.currentTime > timeEnds) {
          _video_hideInteractionPoint($currentTemplate, interaction.type, index, currentlyShowing);
        }
      }
    });
  });
}

function _video_showInteractionPoint($currentTemplate, type, index, currentlyShowing) {
  if (type == 'discover') {
    _video_interactionPoint_discovery_showIcon($currentTemplate, index, currentlyShowing);
  } else if (type == 'question' || type == 'mandatoryQuestion') {
    var hideBgContent = type == 'mandatoryQuestion';
    var a11yReadQuestionText = type == 'mandatoryQuestion';

    _video_interactionPoint_question_show($currentTemplate, index, currentlyShowing, hideBgContent, a11yReadQuestionText);
  }
}

function _video_hideInteractionPoint($currentTemplate, type, index, currentlyShowing) {
  if (type == 'discover') {
    _video_interactionPoint_discovery_hideIcon($currentTemplate, index, currentlyShowing);
  }
}

function _video_attachEvents($currentTemplate, layout, module, layoutId, excludeCompletion, excludeInteractionPoints) {
  var $currentVideoEl = $currentTemplate.find('.vidPopVideoInnerContainer video.uniPlayHtml');
  var currentlyShowing = {};
  var playBtnBgImage = '';
  $currentVideoEl.uniClick(function (ev) {
    $currentVideoEl[0].pause();
  });

  if (!excludeCompletion) {
    $currentVideoEl.on('ended', function (ev) {
      enableContinueButton(module.mod_id, layoutId, $currentTemplate); // reset the play btn screen bg img

      $currentVideoEl.get(0).pause();

      if (playBtnBgImage) {
        $currentTemplate.find('.playBtnContainer').css('background-image', playBtnBgImage);
      }

      setTimeout(function () {
        $currentTemplate.find('.layoutBlockingSectionContainer > .button').focus();
      }, 1);
    });
  }

  $currentVideoEl.on('pause', function (ev) {
    $currentTemplate.find('.playBtnContainer').show(SHOW_HIDE_ANIMATION_OPTIONS);
  });
  $currentVideoEl.on('play', function (ev) {
    $currentTemplate.closest('.ModuleLayouts__Content').find('video').not($(ev.currentTarget)).each(function (index, el) {
      $(el).get(0).pause();
    });
    $playBtnContainer = $currentTemplate.find('.playBtnContainer');

    if (!playBtnBgImage) {
      playBtnBgImage = $playBtnContainer.css('background-image');
    }

    $playBtnContainer.css('background-image', '').hide(SHOW_HIDE_ANIMATION_OPTIONS);

    if ($(ev.currentTarget).closest('.layoutTemplateContentContainer').hasClass('fullWidthVideo')) {
      scrollToElement($(ev.currentTarget).closest('.layoutTemplateContentContainer'));
    }
  });
  $currentVideoEl.on('timeupdate', function (ev) {
    var activeVideo = ev.target,
        currentTime = Math.round(activeVideo.currentTime),
        totalTime = Math.round(activeVideo.duration);
    var currentVideoFooterComponentId = $(activeVideo).closest('.vidPopVideoContainer').find('.Component_Video_Footer').data('id');
    var currentVideoFooterComponent = HShell.core.getAllActiveComponents()[currentVideoFooterComponentId];

    if (currentVideoFooterComponent) {
      currentVideoFooterComponent.$emit('moduleVideoSyncronization', {
        currentTime: currentTime,
        totalTime: totalTime
      }, true);
    }
  });
  $currentTemplate.find('.playBtnContainer').uniClick(function (ev) {
    $currentVideoEl[0].play();
  });

  if (!excludeInteractionPoints) {
    _video_attachInteractionPointsEvents_discovery($currentTemplate, currentlyShowing);

    _video_attachInteractionPointsEvents_question($currentTemplate, currentlyShowing);

    _video_attachInteractionPointsEvents_mandatoryQuestion($currentTemplate, layout, currentlyShowing);

    _video_handleInteractionPoints($currentVideoEl, $currentTemplate, layout, currentlyShowing);
  }
}

function _video_attachInteractionPointsEvents_discovery($currentTemplate, currentlyShowing) {
  var $interactionPointEl = $currentTemplate.find('.interactionPoint.discover');
  var $descriptionContainer = $interactionPointEl.find('.descriptionContainer');
  var $videoEl = $currentTemplate.find('.vidPopVideoInnerContainer video.uniPlayHtml');
  $interactionPointEl.find('.iconContainer').uniClick(function (ev) {
    $videoEl.get(0).pause();

    _video_attachInteractionPointsEvents_discovery_showDescription($currentTemplate);
  });
  $descriptionContainer.find('.description .closeBtn').uniClick(function (ev) {
    _video_attachInteractionPointsEvents_discovery_hideDescription($currentTemplate);

    $videoEl.get(0).play();
  });
}

function _video_attachInteractionPointsEvents_discovery_hideDescription($currentTemplate) {
  var $interactionPointEl = $currentTemplate.find('.interactionPoint.discover');
  var $descriptionContainer = $interactionPointEl.find('.descriptionContainer');
  showNavigationButton();
  $descriptionContainer.hide(); //(SHOW_HIDE_ANIMATION_OPTIONS);

  setTimeout(function () {
    HShell.utils.unlockFocusFromContainer();
  }, 1);
}

function _video_attachInteractionPointsEvents_discovery_showDescription($currentTemplate) {
  var $interactionPointEl = $currentTemplate.find('.interactionPoint.discover');
  var $descriptionContainer = $interactionPointEl.find('.descriptionContainer');
  hideNavigationButton();
  $descriptionContainer.show(); //(SHOW_HIDE_ANIMATION_OPTIONS);

  HShell.utils.lockFocusToContainer($descriptionContainer, $descriptionContainer.find('.closeBtn'));

  _Module_layouts.a11y.video_interactionPoint_discover_readDescription($descriptionContainer);
}

function _video_interactionPoint_discovery_showIcon($currentTemplate, interactionPointId, currentlyShowing) {
  currentlyShowing[interactionPointId] = true;
  $currentTemplate.find('.interactionPointsContainer').show() //(SHOW_HIDE_ANIMATION_OPTIONS)
  .find(".interactionPoint.discover[data-interactionid=\"".concat(interactionPointId, "\"]")).show() //(SHOW_HIDE_ANIMATION_OPTIONS)
  .find('.iconContainer').show(window.innerWidth < 1024 && HShell.autoSetup.runOn.deviceType === 'desktop' ? DROP_ANIMATION_OPTIONS_MOBILE : DROP_ANIMATION_OPTIONS).focus().attr('tabindex', '0');
}

function _video_interactionPoint_discovery_hideIcon($currentTemplate, interactionPointId, currentlyShowing) {
  setTimeout(function () {
    currentlyShowing[interactionPointId] = false;
  }, 1500); // mark IP as unused after 1500 ms so it doesn't show multiple times

  $currentTemplate.find('.interactionPoint.discover .iconContainer').attr('tabindex', '-1').hide(Object.assign({}, window.innerWidth < 1024 && HShell.autoSetup.runOn.deviceType === 'desktop' ? DROP_ANIMATION_OPTIONS_MOBILE : DROP_ANIMATION_OPTIONS, {
    complete: function complete() {
      $currentTemplate.find('.interactionPointsContainer').hide() //(SHOW_HIDE_ANIMATION_OPTIONS)
      .find('.interactionPoint.discover').hide(); //(SHOW_HIDE_ANIMATION_OPTIONS);
    }
  }));
}

function _video_attachInteractionPointsEvents_question($currentTemplate, currentlyShowing) {
  var $currentVideoEl = $currentTemplate.find('.vidPopVideoInnerContainer video.uniPlayHtml');
  $currentTemplate.find('.interactionPoint.question .optionsContainer .option').uniClick(function (ev) {
    var interactionId = $(ev.currentTarget).closest('.interactionPoint.question').data('interactionid');

    _video_interactionPoint_question_hide($currentTemplate, interactionId, currentlyShowing);

    $currentVideoEl.get(0).play();
  });
}

function _video_interactionPoint_question_show($currentTemplate, interactionPointId, currentlyShowing, shouldHideBgContent, a11yReadContent) {
  currentlyShowing[interactionPointId] = true;
  var $currentVideoEl = $currentTemplate.find('.vidPopVideoInnerContainer video.uniPlayHtml');
  var $interactionPointEl = $currentTemplate.find(".interactionPoint[data-interactionid=\"".concat(interactionPointId, "\"]"));
  $interactionPointEl.show(); //(SHOW_HIDE_ANIMATION_OPTIONS);

  $currentTemplate.find('.interactionPointsContainer').show(); //(SHOW_HIDE_ANIMATION_OPTIONS);

  if (shouldHideBgContent) {
    hideNavigationButton();
    hideAllVideoContainers();
  }

  if (a11yReadContent) {
    _Module_layouts.a11y.video_interactionPoint_mandatoryQuestion_readQuestionText($interactionPointEl.find('.questionText'));
  }

  HShell.utils.lockFocusToContainer($interactionPointEl);
  $currentVideoEl.get(0).pause();
  setTimeout(function () {
    $interactionPointEl.find('.optionsContainer .option').first().focus();
  }, 1);
}

function _video_interactionPoint_question_hide($currentTemplate, interactionId, currentlyShowing) {
  setTimeout(function () {
    currentlyShowing[interactionId] = false;
  }, 1500); // mark IP as unused after 1500 ms so it doesn't show multiple times

  setTimeout(function () {
    HShell.utils.unlockFocusFromContainer();
  }, 1);
  var $interactionPointEl = $currentTemplate.find(".interactionPoint[data-interactionid=\"".concat(interactionId, "\"]"));
  $interactionPointEl.hide(); //(SHOW_HIDE_ANIMATION_OPTIONS);

  showNavigationButton();
  reshowAllVideoContainers();
  $currentTemplate.find('.interactionPointsContainer').hide(); //(SHOW_HIDE_ANIMATION_OPTIONS);
}

function _video_attachInteractionPointsEvents_mandatoryQuestion($currentTemplate, layout, currentlyShowing) {
  var $currentVideoEl = $currentTemplate.find('.vidPopVideoInnerContainer video.uniPlayHtml');
  var interactions = layout && layout.interactions && layout.interactions.interaction;

  if (!interactions) {
    return;
  } else if (!Array.isArray(interactions)) {
    interactions = [interactions];
  }

  $currentTemplate.find('.interactionPoint.mandatoryQuestion .footerContainer .submitBtn').uniClick(function (ev) {
    if ($(ev.currentTarget).hasClass('disabled')) {
      return;
    }

    var $currentInteractionPointEl = $(ev.currentTarget).closest('.interactionPoint.mandatoryQuestion');
    var interactionId = $currentInteractionPointEl.data('interactionid');
    var currentInteractionObj = interactions[interactionId];
    var options = currentInteractionObj.options && currentInteractionObj.options.option;

    if (options && !Array.isArray(options)) {
      options = [options];
    }

    var numberOfCorrectAnswers = 0;
    options.forEach(function (option) {
      if (option['_correct'] == 'true') {
        numberOfCorrectAnswers++;
      }
    });
    var $selectedOptionsEl = $currentInteractionPointEl.find('.optionsContainer .option.selected');
    var selectedAnswerIds = [];
    $selectedOptionsEl.each(function (index, answer) {
      selectedAnswerIds.push($(answer).data('answerid'));
    });
    var isQuestionCorrect = true;

    if (numberOfCorrectAnswers != selectedAnswerIds.length) {
      isQuestionCorrect = false;
    } else {
      selectedAnswerIds.forEach(function (answerId) {
        var isCurrentAnswerCorrect = options[answerId]['_correct'] == 'true';

        if (!isCurrentAnswerCorrect) {
          isQuestionCorrect = false;
        }
      });
    }

    _video_attachInteractionPointsEvents_mandatoryQuestion_showFeedback($currentTemplate, interactionId, isQuestionCorrect, selectedAnswerIds);
  });
  $currentTemplate.find('.interactionPoint.mandatoryQuestion .optionsContainer .option').uniClick(function (ev) {
    var $currentInteractionPointEl = $(ev.currentTarget).closest('.interactionPoint.mandatoryQuestion');
    var interactionId = $currentInteractionPointEl.closest('.interactionPoint.mandatoryQuestion').data('interactionid');
    var currentInteractionObj = interactions[interactionId];
    var options = currentInteractionObj.options && currentInteractionObj.options.option;

    if (options && !Array.isArray(options)) {
      options = [options];
    }

    var numberOfCorrectAnswers = 0;
    options.forEach(function (option) {
      if (option['_correct'] == 'true') {
        numberOfCorrectAnswers++;
      }
    });
    var multipleAnswersType = numberOfCorrectAnswers > 1;

    if (multipleAnswersType) {
      $(ev.currentTarget).toggleClass('selected');
      var $submitBtn = $currentInteractionPointEl.find('.footerContainer .submitBtn');
      var numberOfSelectedAnswers = $currentInteractionPointEl.find('.optionsContainer .option.selected').length;

      if (numberOfSelectedAnswers > 1) {
        $submitBtn.removeClass('disabled').attr('aria-disabled', 'false').attr('disabled', false);
      } else {
        $submitBtn.addClass('disabled').attr('aria-disabled', 'true').attr('disabled', true);
      }

      return;
    }

    var answerId = $(ev.currentTarget).data('answerid');
    var showCorrect = false;

    if (options[answerId]['_correct'] == 'true') {
      showCorrect = true;
    }

    _video_attachInteractionPointsEvents_mandatoryQuestion_showFeedback($currentTemplate, interactionId, showCorrect, [answerId]);
  });
  $currentTemplate.find('.interactionPoint.mandatoryQuestion .feedback .feedbackBtn.continue').uniClick(function (ev) {
    var interactionId = $(ev.currentTarget).closest('.interactionPoint.mandatoryQuestion').data('interactionid');

    _video_attachInteractionPointsEvents_mandatoryQuestion_hideFeedback($currentTemplate, interactionId);

    _video_interactionPoint_question_hide($currentTemplate, interactionId, currentlyShowing);

    $currentVideoEl.get(0).play();
  });
  $currentTemplate.find('.interactionPoint.mandatoryQuestion .feedback .feedbackBtn.tryAgain').uniClick(function (ev) {
    var interactionId = $(ev.currentTarget).closest('.interactionPoint.mandatoryQuestion').data('interactionid');

    _video_attachInteractionPointsEvents_mandatoryQuestion_hideFeedback($currentTemplate, interactionId);

    var $interactionPointEl = $currentTemplate.find(".interactionPoint[data-interactionid=\"".concat(interactionId, "\"]"));

    _Module_layouts.a11y.video_interactionPoint_mandatoryQuestion_readQuestionText($interactionPointEl.find('.questionText'));

    HShell.utils.lockFocusToContainer($interactionPointEl);
    setTimeout(function () {
      $interactionPointEl.find('.optionsContainer .option').first().focus();
    }, 1);
  });
}

function _video_attachInteractionPointsEvents_mandatoryQuestion_showFeedback($currentTemplate, interactionId, showCorrect, selectedAnswerIds) {
  var $interactionPointEl = $currentTemplate.find(".interactionPoint[data-interactionid=\"".concat(interactionId, "\"]"));
  var $feedbacksContainer = $interactionPointEl.find('.feedbacksContainer');
  $feedbacksContainer.find('.feedback').hide();
  var selectedAnswersIdsKey = selectedAnswerIds && selectedAnswerIds.length ? selectedAnswerIds.map(function (id) {
    return +id + 1;
  }).join(',') : '';
  var $currentFeedback = $feedbacksContainer.find(".feedback[data-for=\"".concat(showCorrect ? 'correct' : 'wrong', "\"][data-foranswerid=\"").concat(selectedAnswersIdsKey, "\"]"));

  if (!$currentFeedback.length) {
    $currentFeedback = $feedbacksContainer.find(".feedback[data-for=\"".concat(showCorrect ? 'correct' : 'wrong', "\"]:not([data-foranswerid])"));
  }

  if (!$currentFeedback.length) {
    console.error("No generic ".concat(showCorrect ? 'Correct' : 'Wrong', " feedback provided in content.xml and no specific feedback matched."));
  }

  $currentFeedback.show();
  hideNavigationButton();
  $feedbacksContainer.show();
  HShell.utils.lockFocusToContainer($currentFeedback);

  _Module_layouts.a11y.video_interactionPoint_mandatoryQuestion_readFeedback($currentFeedback);

  setTimeout(function () {
    $currentFeedback.find('.feedbackBtn').focus();
  }, 50);
}

function _video_attachInteractionPointsEvents_mandatoryQuestion_hideFeedback($currentTemplate, interactionId) {
  var $interactionPointEl = $currentTemplate.find(".interactionPoint[data-interactionid=\"".concat(interactionId, "\"]"));
  var $feedbacksContainer = $interactionPointEl.find('.feedbacksContainer');
  $feedbacksContainer.find('.feedback').hide();
  $feedbacksContainer.hide();
}

function _video_buildVideoPlayer($currentTemplate, videoUrl, subtitlesUrl, moduleId) {
  var videoContainer = $currentTemplate.find('.vidPopVideoContainer .vidPopVideoInnerContainer');
  var subtitlesContainer = $currentTemplate.find('.vidPopVideoContainer .vidPopSubtitlesContainer');
  var controlsContainer = $currentTemplate.find('.vidPopFooterContainer');
  window.buildVideoPlayer(videoUrl, subtitlesUrl, moduleId, undefined, undefined, videoContainer, subtitlesContainer, controlsContainer, false, true, false, true);
}

function _getCompletionDataForLayoutId(moduleId, layoutId) {
  var moduleCustomData = HShell.storage.loadModuleCustomData(moduleId) || {};
  return moduleCustomData.completionData && moduleCustomData.completionData[layoutId] || {};
}

function _putCompletionDataForLayoutId(moduleId, layoutId, propertyName, data) {
  var moduleCustomData = HShell.storage.loadModuleCustomData(moduleId) || {};
  moduleCustomData.completionData = moduleCustomData.completionData || {};
  moduleCustomData.completionData[layoutId] = moduleCustomData.completionData[layoutId] || {};
  moduleCustomData.completionData[layoutId][propertyName] = data || {};
  HShell.storage.saveModuleCusomData(moduleId, moduleCustomData);
}

function hidden_items_init360Image(layoutId, layout, module) {
  if (!window.pannellum) {
    console.log("Pannellum library not found. Module section with id ".concat(layoutId, " couldn't initialize properly."));
    return;
  }

  var items = layout.items.item;

  if (items && !Array.isArray(items)) {
    items = [items];
  }

  var selected_language = HShell && HShell.userData ? HShell.userData.selected_language || 'en' : 'en';
  var hotSpots = items.map(function (item, index) {
    var itemPositions = (item.itemPosition || '0,0').split(',');
    return {
      pitch: Number(itemPositions[0]) - 0.2,
      yaw: Number(itemPositions[1]) - 0.07,
      cssClass: "item item_".concat(index),
      id: "item_".concat(index)
    };
  });
  var currentPanoramaViewer = pannellum.viewer("panorama_image_".concat(layoutId), {
    type: 'equirectangular',
    panorama: "content/".concat(selected_language, "/").concat(layout.image360Url),
    showControls: false,
    mouseZoom: false,
    autoLoad: true,
    hotSpotDebug: HShell.globalSetup.devMode,
    hotSpots: hotSpots
  });
  currentPanoramaViewer.on('load', function () {
    $("#panorama_image_".concat(layoutId)).find('.item').each(function (index, item) {
      $(item).attr('title', layout.image360Url ? layout.image360Url['_alt'] || '' : '');
      var classList = $(item).attr('class').split(/\s+/);
      var itemClass = classList && classList.length ? classList.filter(function (classItem) {
        return classItem.startsWith('item_');
      })[0] : undefined;
      var itemIndex = itemClass ? itemClass.replace('item_', '') : '';

      if (itemIndex) {
        $(item).attr({
          'data-itemid': "".concat(itemIndex),
          'tabindex': 0,
          'role': 'button',
          'aria-label': "Item ".concat(Number(itemIndex) + 1, ".")
        }).html(_Module_layouts2.helpers.hidden_items_iconContent(layout));
      }
    });
  });
  HShell.utils.panoramaViewers = HShell.utils.panoramaViewers || {};
  HShell.utils.panoramaViewers[layoutId] = currentPanoramaViewer;
  return currentPanoramaViewer;
}

function hidden_items_init360Video(layoutId, layout, module) {
  if (!window.pannellum) {
    console.log("Pannellum library not found. Module section with id ".concat(layoutId, " couldn't initialize properly."));
    return;
  }

  var items = layout.items && layout.items.item;

  if (items && !Array.isArray(items)) {
    items = [items];
  } else if (!items) {
    items = [];
  }

  var videoElement = $("#panorama_video_".concat(layoutId, " video")).get(0);
  var viewerContainer = $("#panorama_video_".concat(layoutId, " .vidPopVideoContainer")).get(0);
  var hotSpots = items.map(function (item, index) {
    var itemPositions = (item.itemPosition || '0,0').split(',');
    return {
      pitch: Number(itemPositions[0]) - 0.2,
      yaw: Number(itemPositions[1]) - 0.07,
      cssClass: "item item_".concat(index),
      id: "item_".concat(index)
    };
  });
  var currentPanoramaViewer = pannellum.viewer(viewerContainer, {
    type: 'equirectangular',
    dynamic: true,
    panorama: videoElement,
    showControls: false,
    mouseZoom: false,
    autoLoad: true,
    hotSpotDebug: HShell.globalSetup.devMode,
    hotSpots: hotSpots
  });
  $(videoElement).hide();
  $("#panorama_video_".concat(layoutId, " .pnlm-ui")).css('top', 0);
  $("#panorama_video_".concat(layoutId, " .pnlm-render-container")).css('top', 0);
  $(videoElement).on('play', function () {
    if (videoElement.readyState > 1) currentPanoramaViewer.setUpdate(true);
  });
  $(videoElement).on('canplay', function () {
    if (!videoElement.paused) currentPanoramaViewer.setUpdate(true);
  });
  $(videoElement).on('pause', function () {
    currentPanoramaViewer.setUpdate(false);
  });
  $(videoElement).on('seeking', function () {
    if (videoElement && videoElement.paused) currentPanoramaViewer.setUpdate(true);
  });
  $(videoElement).on('seeked', function () {
    if (videoElement && videoElement.paused) currentPanoramaViewer.setUpdate(false);
  });
  currentPanoramaViewer.on('load', function () {
    $("#panorama_video_".concat(layoutId)).find('.item').each(function (index, item) {
      // $(item).attr('title', layout.image360Url ? layout.image360Url['_alt'] || '' : '');
      var classList = $(item).attr('class').split(/\s+/);
      var itemClass = classList && classList.length ? classList.filter(function (classItem) {
        return classItem.startsWith('item_');
      })[0] : undefined;
      var itemIndex = itemClass ? itemClass.replace('item_', '') : '';

      if (itemIndex) {
        $(item).attr({
          'data-itemid': "".concat(itemIndex),
          'tabindex': 0,
          'role': 'button',
          'aria-label': "Item ".concat(Number(itemIndex) + 1, ".")
        }).html(_Module_layouts2.helpers.hidden_items_iconContent(layout));
      }
    });
  });
  HShell.utils.panoramaViewers = HShell.utils.panoramaViewers || {};
  HShell.utils.panoramaViewers[layoutId] = currentPanoramaViewer;
  return currentPanoramaViewer;
}

function hidden_items(layoutId, layout, module) {
  var $currentTemplate = $(".hidden_items_template[data-layoutid=\"".concat(layoutId, "\"]"));
  var items = layout.items && layout.items.item;

  if (items && !Array.isArray(items)) {
    items = [items];
  } else if (!items) {
    items = [];
  }

  if (layout.image360Url) {
    var panoramaViewer = hidden_items_init360Image(layoutId, layout, module);

    if (!panoramaViewer) {
      return;
    } else {
      panoramaViewer.on('load', function () {
        _hidden_items_initItemsData($currentTemplate, module, layoutId, items);

        _hidden_items_initEvents($currentTemplate, module, layoutId, items);
      });
    }
  } else if (layout.video360Url) {
    _video_buildVideoPlayer($currentTemplate, layout.video360Url, layout.video360SubtitlesUrl, module.mod_id);

    _video_attachEvents($currentTemplate, layout, module, layoutId, false, true);

    var panoramaViewer = hidden_items_init360Video(layoutId, layout, module);

    if (!panoramaViewer) {
      return;
    } else {
      panoramaViewer.on('load', function () {
        _hidden_items_initItemsData($currentTemplate, module, layoutId, items);

        _hidden_items_initEvents($currentTemplate, module, layoutId, items);
      });
    }
  } else {
    _hidden_items_initItemsData($currentTemplate, module, layoutId, items);

    _hidden_items_initEvents($currentTemplate, module, layoutId, items);
  }

  $currentTemplate.find('.startButton').uniClick(function (ev) {
    $currentTemplate.find('.panoramaCoverContainer').hide();
    scrollToElement($currentTemplate.find('.imageContainer.panorama'));
  });
  $currentTemplate.find('.startVideoButton').uniClick(function (ev) {
    $currentTemplate.find('.panoramaCoverContainer').hide();
    scrollToElement($currentTemplate.find('.imageContainer.panorama_video'));
    $currentTemplate.find('video').get(0).play();
  });
}

function _hidden_items_initItemsData($currentTemplate, module, layoutId, items) {
  var visitedItems = _getCompletionDataForLayoutId(module.mod_id, layoutId).visitedItems || {};
  Object.keys(visitedItems).forEach(function (item) {
    _hidden_items_markItemCompleted($currentTemplate, item);
  });

  if (items && Array.isArray(items) && items.length) {
    items.forEach(function (item, index) {
      if (item.itemVideoUrl) {
        var $currentItemTemplate = $currentTemplate.find(".itemDescription[data-itemid=\"".concat(index, "\"] .videoContainer"));

        _video_buildVideoPlayer($currentItemTemplate, item.itemVideoUrl, item.subtitlesUrl, module.mod_id);

        _video_attachEvents($currentItemTemplate, item, module, layoutId, true, true);
      } else if (item.questions) {
        quiz_images(layoutId, item, module, null, $currentTemplate.find(".itemDescription[data-itemid=\"".concat(index, "\"] .quizContainer")), true);
      }
    });
  }
}

function _hidden_items_initEvents($currentTemplate, module, layoutId, items) {
  $currentTemplate.find('.imageContainer .item, .modelViewerElement .item').uniClick(function (ev) {
    var itemId = $(ev.currentTarget).data('itemid');

    _hidden_items_openDescription($currentTemplate, itemId, layoutId);

    var visitedItems = _getCompletionDataForLayoutId(module.mod_id, layoutId).visitedItems || {};
    visitedItems[itemId] = true;

    _putCompletionDataForLayoutId(module.mod_id, layoutId, 'visitedItems', visitedItems);

    var areAllItemsVisited = Object.keys(visitedItems).length == items.length;

    if (areAllItemsVisited) {
      enableContinueButton(module.mod_id, layoutId, $currentTemplate); // unlockLayout(module.mod_id, layoutId, $currentTemplate);
    }
  });
  $currentTemplate.find('.itemDescription > .closeBtn').uniClick(function (ev) {
    _hidden_items_closeDescriptions($currentTemplate, layoutId);
  });
}

function _hidden_items_openDescription($currentTemplate, itemId, layoutId) {
  _hidden_items_markItemCompleted($currentTemplate, itemId);

  var videoElement = $("#panorama_video_".concat(layoutId, " video")).get(0);
  if (videoElement) videoElement.pause();
  hideNavigationButton();
  $currentTemplate.find('.descriptionsContainer').show(SHOW_HIDE_ANIMATION_OPTIONS);
  $currentTemplate.find(".descriptionsContainer .itemDescription[data-itemid=\"".concat(itemId, "\"]")).addClass('active');
  var $activeDescriptionContainer = $currentTemplate.find('.descriptionsContainer .itemDescription.active');
  HShell.utils.lockFocusToContainer($activeDescriptionContainer, $activeDescriptionContainer.find('.closeBtn'));

  _Module_layouts.a11y.hidden_items_readDescription($activeDescriptionContainer);
}

function _hidden_items_markItemCompleted($currentTemplate, itemId) {
  var itemColor = $currentTemplate.find('.layoutTemplateContentContainer').data('itemcolor');
  $currentTemplate.find(".layoutTemplateContentContainer .item[data-itemid=\"".concat(itemId, "\"]")).addClass('visited').find('.icon').attr('style', "border-color: ".concat(itemColor || '', "; background-color: ").concat(itemColor || '', ";"));
}

function _hidden_items_closeDescriptions($currentTemplate, layoutId) {
  showNavigationButton();

  if (layoutId) {
    var videoElement = $("#panorama_video_".concat(layoutId, " video")).get(0);

    if (videoElement) {
      videoElement.play();
    }
  }

  var activeItemId = $currentTemplate.find('.descriptionsContainer .itemDescription.active').data('itemid');
  var activeItemBtn = $currentTemplate.find(".imageContainer .item[data-itemid=\"".concat(activeItemId, "\"]"));
  $currentTemplate.find('.descriptionsContainer').hide(SHOW_HIDE_ANIMATION_OPTIONS);
  $currentTemplate.find('.descriptionsContainer .itemDescription').removeClass('active');
  setTimeout(function () {
    HShell.utils.unlockFocusFromContainer(null, activeItemBtn);
  }, 1);
}

function icons_discover(layoutId, layout, module) {
  var $currentTemplate = $(".icons_discover_template[data-layoutid=\"".concat(layoutId, "\"]"));
  var icons = layout.icons.icon;

  if (icons && !Array.isArray(icons)) {
    icons = [icons];
  }

  var activeTabId = 0;
  $currentTemplate.find('.tabsNavigation .tabNavElement, .tabNavElementMobile').uniClick(function (ev) {
    var tabId = $(ev.currentTarget).data('tabindex');
    activeTabId = tabId;

    _icons_discover_moveToTab($currentTemplate, activeTabId, module, layoutId);

    var visitedTabs = _getCompletionDataForLayoutId(module.mod_id, layoutId).visitedTabs || {};
    var areAllTabsVisited = Object.keys(visitedTabs).length == icons.length;

    if (areAllTabsVisited) {
      enableContinueButton(module.mod_id, layoutId, $currentTemplate); // unlockLayout(module.mod_id, layoutId, $currentTemplate);
    }
  });

  _icons_discover_moveToTab($currentTemplate, 0, module, layoutId);
}

function _icons_discover_moveToTab($currentTemplate, tabId, module, layoutId) {
  var visitedTabs = _getCompletionDataForLayoutId(module.mod_id, layoutId).visitedTabs || {};
  visitedTabs[tabId] = true;

  _putCompletionDataForLayoutId(module.mod_id, layoutId, 'visitedTabs', visitedTabs);

  var selectedBgColor = $currentTemplate.find('.tabsNavigation').data('selectedbgcolor');
  var bgColor = $currentTemplate.find('.tabsNavigation').data('bgcolor');
  $currentTemplate.find('.tabsNavigation .tabNavElement, .tabNavElementMobile').attr('aria-pressed', false).removeClass('active').attr('style', "background-color: ".concat(bgColor, " !important;"));
  var $currentTab = $currentTemplate.find(".tabsNavigation .tabNavElement[data-tabindex=\"".concat(tabId, "\"], .tabNavElementMobile[data-tabindex=\"").concat(tabId, "\"]"));
  $currentTab.attr('aria-pressed', true).addClass('active').addClass('visited').attr('style', "border-color: ".concat(selectedBgColor, " !important; background-color: ").concat(selectedBgColor, " !important;"));
  $currentTab.each(function (index, el) {
    var currentAriaLabel = $(el).attr('aria-label');

    if (currentAriaLabel) {
      if (currentAriaLabel.toLowerCase().indexOf('visited') > -1) {
        return true;
      } else {
        $(el).attr('aria-label', currentAriaLabel + ' Visited.');
      }
    }
  });
  $currentTemplate.find('.tabContent').removeClass('active');
  var $currentTabContent = $currentTemplate.find(".tabContent[data-tabindex=\"".concat(tabId, "\"]"));
  $currentTabContent.addClass('active');

  _Module_layouts.a11y.icons_discover_readTabContent($currentTabContent);
}

function sequence(layoutId, layout, module) {
  var $currentTemplate = $(".sequence_template[data-layoutid=\"".concat(layoutId, "\"]"));
  var tabs = layout.tabs.tab;

  if (tabs && !Array.isArray(tabs)) {
    tabs = [tabs];
  }

  var tabsVideos = {};
  tabs.forEach(function (tab, index) {
    if (tab.videoUrl) {
      var $currentTabTemplate = $currentTemplate.find('.tabContent[data-tabindex="' + index + '"]');

      _video_buildVideoPlayer($currentTabTemplate, tab.videoUrl, tab.subtitlesUrl, module.mod_id);

      _video_attachEvents($currentTabTemplate, tab, module, layoutId, true, false);

      var $currentVideoEl = $currentTemplate.find(".tabContent[data-tabindex=\"".concat(index, "\"] .vidPopVideoInnerContainer video.uniPlayHtml"));
      $currentVideoEl.on('ended', function (ev) {
        _sequence_completeTab($currentTemplate, module, layout, layoutId, index);

        $currentTemplate.find(".dotsContainer .dot[data-tabindex=\"".concat(index, "\"]")).first().focus();
      });
      tabsVideos[index] = $currentTabTemplate.find('video');
    }
  });
  var answers = _getCompletionDataForLayoutId(module.mod_id, layoutId).answers || {};
  var activeTabId = 0;
  var visitedTabs = _getCompletionDataForLayoutId(module.mod_id, layoutId).visitedTabs || {};
  var visitedTabsKeys = Object.keys(visitedTabs);

  if (visitedTabsKeys.length) {
    visitedTabsKeys.forEach(function (tabId) {
      tabId = Number(tabId);

      if (!visitedTabsKeys[tabId]) {
        return;
      }

      activeTabId = tabId;

      _sequence_moveToTab($currentTemplate, activeTabId, module, layoutId, layout, tabsVideos, false, true);

      if (tabs[activeTabId].videoUrl) {
        _sequence_completeTab($currentTemplate, module, layout, layoutId, activeTabId);
      } else {
        var selectedAnswerId = answers[activeTabId];

        if (typeof selectedAnswerId !== 'undefined' && selectedAnswerId !== null) {
          if (Array.isArray(selectedAnswerId) && selectedAnswerId.length) {
            selectedAnswerId.forEach(function (answerId) {
              _sequence_selectAnswer($currentTemplate, activeTabId, answerId, module, layoutId, layout, tabsVideos, false, true);
            });

            _sequence_answerQuestion($currentTemplate, tabId, selectedAnswerId, module, layoutId, layout, tabsVideos, false, true);
          } else {
            _sequence_selectAnswer($currentTemplate, activeTabId, selectedAnswerId, module, layoutId, layout, tabsVideos, false, true);
          }
        }
      }
    });
  } else {
    _sequence_moveToTab($currentTemplate, activeTabId, module, layoutId, layout, tabsVideos);
  }

  $currentTemplate.find('.dot, .dotMobile').uniClick(function (ev) {
    var tabId = $(ev.currentTarget).data('tabindex');
    var visitedTabs = _getCompletionDataForLayoutId(module.mod_id, layoutId).visitedTabs || {};
    var isPreviousTabVisited = visitedTabs[tabId - 1];

    if (tabId != 0 && !isPreviousTabVisited) {
      return;
    } else {
      activeTabId = tabId;
      var isMobile = $(ev.currentTarget).hasClass('dotMobile');

      _sequence_moveToTab($currentTemplate, activeTabId, module, layoutId, layout, tabsVideos, isMobile);
    }
  });
  $currentTemplate.find('.answersContainer .answer').uniClick(function (ev) {
    var tabId = $(ev.currentTarget).closest('.tabContent').data('tabindex');
    var answers = _getCompletionDataForLayoutId(module.mod_id, layoutId).answers || {};
    var isCurrentTabAnswered = typeof answers[tabId] !== 'undefined';

    if (isCurrentTabAnswered) {
      return;
    }

    var selectedAnswerId = $(ev.currentTarget).data('answerid');
    var isMobile = $currentTemplate.find('.dotMobile[data-tabindex=' + tabId + ']').css('display') !== 'none';

    _sequence_selectAnswer($currentTemplate, tabId, selectedAnswerId, module, layoutId, layout, tabsVideos, isMobile);
  });
  $currentTemplate.find('.questionContainer .continueBtn').uniClick(function (ev) {
    var tabId = $(ev.currentTarget).closest('.tabContent').data('tabindex');
    var $currentTab = $currentTemplate.find(".tabContent[data-tabindex=\"".concat(tabId, "\"]"));
    var $selectedAnswers = $currentTab.find('.answersContainer .answer.selected');

    if ($selectedAnswers.length <= 0) {
      return;
    }

    var selectedAnswersIds = [];
    $selectedAnswers.each(function (i, el) {
      selectedAnswersIds.push($(el).data('answerid'));
    });
    var isMobile = $currentTemplate.find('.dotMobile[data-tabindex=' + tabId + ']').css('display') !== 'none';

    _sequence_answerQuestion($currentTemplate, tabId, selectedAnswersIds, module, layoutId, layout, tabsVideos, isMobile);
  });
}

function _sequence_selectAnswer($currentTemplate, tabId, selectedAnswerId, module, layoutId, layout, tabsVideos, isMobile, skipA11ySpeak) {
  var $currentTab = $currentTemplate.find(".tabContent[data-tabindex=\"".concat(tabId, "\"]"));
  var tabs = layout.tabs.tab;

  if (tabs && !Array.isArray(tabs)) {
    tabs = [tabs];
  }

  var currentTab = tabs[tabId]; // if (!currentTab.questionShort) {

  if (!currentTab.questionMultiple) {
    $currentTab.find('.answersContainer .answer').removeClass('selected');
    $currentTab.find(".answersContainer .answer[data-answerid=\"".concat(selectedAnswerId, "\"]")).addClass('selected');
  } else {
    $currentTab.find(".answersContainer .answer[data-answerid=\"".concat(selectedAnswerId, "\"]")).toggleClass('selected');
  }

  if ($currentTab.find('.answersContainer .answer.selected').length > 0) {
    $currentTab.find('.continueBtn').removeClass('disabled').attr('aria-disabled', 'false').attr('disabled', false);
  } else {
    $currentTab.find('.continueBtn').addClass('disabled').attr('aria-disabled', 'true').attr('disabled', true);
  }

  if (currentTab.questionShort) {
    _sequence_setNextTabTextForAnswers($currentTemplate, tabId, selectedAnswerId, module, layoutId, layout, tabsVideos, isMobile, skipA11ySpeak);
  } // } else {
  //     $currentTab.find('.answersContainer .answer').removeClass('selected');
  //     $currentTab.find(`.answersContainer .answer[data-answerid="${selectedAnswerId}"]`).addClass('selected');
  //     _sequence_setNextTabTextForAnswers($currentTemplate, tabId, selectedAnswerId, module, layoutId, layout, tabsVideos, isMobile, skipA11ySpeak);
  //     // _sequence_answerQuestion($currentTemplate, tabId, selectedAnswerId, module, layoutId, layout, tabsVideos, isMobile, skipA11ySpeak);
  // }

}

function _sequence_setNextTabTextForAnswers($currentTemplate, tabId, selectedAnswerId, module, layoutId, layout, tabsVideos, isMobile, skipA11ySpeak) {
  var $currentTab = $currentTemplate.find(".tabContent[data-tabindex=\"".concat(tabId, "\"]"));
  var tabs = layout.tabs.tab;

  if (tabs && !Array.isArray(tabs)) {
    tabs = [tabs];
  }

  var currentTab = tabs[tabId];

  if (currentTab.questionMultiple && selectedAnswerId) {
    if (!Array.isArray(selectedAnswerId)) {
      selectedAnswerIds = [selectedAnswerId];
    } else {
      selectedAnswerIds = selectedAnswerId;
    }

    var answers = currentTab.questionMultiple.answer;

    if (answers && !Array.isArray(answers)) {
      answers = [answers];
    }

    var numberOfCorrectAnswers = 0;
    answers.forEach(function (answer) {
      if (answer['_correct'] == 'true') {
        numberOfCorrectAnswers++;
      }
    });
    var isQuestionCorrect = true;

    if (numberOfCorrectAnswers != selectedAnswerId.length) {
      isQuestionCorrect = false;
    } else {
      selectedAnswerId.forEach(function (answerId) {
        var isCurrentAnswerCorrect = answers[answerId]['_correct'] == 'true';

        if (!isCurrentAnswerCorrect) {
          isQuestionCorrect = false;
        }
      });
    }

    var $nextTab = $currentTemplate.find(".tabContent[data-tabindex=\"".concat(tabId + 1, "\"]"));

    if ($nextTab.length > 0) {
      var nextTab = tabs[tabId + 1];
      var nextTabTexts = nextTab.text;

      if (nextTabTexts && !Array.isArray(nextTabTexts)) {
        nextTabTexts = [nextTabTexts];
      }

      var answerCorrectWrongLabel = isQuestionCorrect ? 'correct' : 'wrong';
      var textToPut = nextTabTexts && nextTabTexts.filter(function (text) {
        return text['_for'] == answerCorrectWrongLabel;
      })[0];

      if (textToPut) {
        $nextTab.find('.textContainer').html(textToPut.toString());
      }
    }
  } else {
    var tabQuestion = currentTab.question || currentTab.questionShort;
    var answers = tabQuestion && tabQuestion.answer;

    if (answers && !Array.isArray(answers)) {
      answers = [answers];
    }

    var selectedAnswerLabel = answers[selectedAnswerId]['_id'];
    var $nextTab = $currentTemplate.find(".tabContent[data-tabindex=\"".concat(tabId + 1, "\"]"));

    if ($nextTab.length > 0) {
      var nextTab = tabs[tabId + 1];
      var nextTabTexts = nextTab.text;

      if (nextTabTexts && !Array.isArray(nextTabTexts)) {
        nextTabTexts = [nextTabTexts];
      }

      var textToPut = nextTabTexts && nextTabTexts.filter(function (text) {
        return text['_for'] == selectedAnswerLabel;
      })[0];

      if (textToPut) {
        $nextTab.find('.textContainer').html(textToPut.toString());
      }
    }
  }
}

function _sequence_answerQuestion($currentTemplate, tabId, selectedAnswerIds, module, layoutId, layout, tabsVideos, isMobile, skipA11ySpeak) {
  var tabs = layout.tabs.tab;

  if (tabs && !Array.isArray(tabs)) {
    tabs = [tabs];
  }

  var currentTab = tabs[tabId];
  var answers = _getCompletionDataForLayoutId(module.mod_id, layoutId).answers || {};
  answers[tabId] = selectedAnswerIds;

  _putCompletionDataForLayoutId(module.mod_id, layoutId, 'answers', answers);

  _sequence_completeTab($currentTemplate, module, layout, layoutId, tabId);

  var isLastTab = tabId >= tabs.length - 1;

  if (!isLastTab) {
    _sequence_setNextTabTextForAnswers($currentTemplate, tabId, selectedAnswerIds, module, layoutId, layout, tabsVideos, isMobile, skipA11ySpeak);

    _sequence_moveToTab($currentTemplate, tabId + 1, module, layoutId, layout, tabsVideos, isMobile, skipA11ySpeak);
  }
}

function _sequence_completeTab($currentTemplate, module, layout, layoutId, tabId) {
  var tabs = layout.tabs.tab;

  if (tabs && !Array.isArray(tabs)) {
    tabs = [tabs];
  }

  var visitedTabs = _getCompletionDataForLayoutId(module.mod_id, layoutId).visitedTabs || {};
  visitedTabs[tabId] = true;

  _putCompletionDataForLayoutId(module.mod_id, layoutId, 'visitedTabs', visitedTabs);

  var isLastTab = Object.keys(visitedTabs).length == tabs.length;

  if (isLastTab) {
    enableContinueButton(module.mod_id, layoutId, $currentTemplate);
  } else {
    var nextTabId = tabId + 1;
    $currentTemplate.find(".dotsContainer .dot[data-tabindex=\"".concat(nextTabId, "\"], .dotMobile[data-tabindex=\"").concat(nextTabId, "\"]")).attr('disabled', false).attr('aria-disabled', false);
  }
}

function _sequence_moveToTab($currentTemplate, tabId, module, layoutId, layout, tabsVideos, isMobile, skipA11ySpeak) {
  //pause all tabs videos
  var tabsVideosKeys = Object.keys(tabsVideos);
  tabsVideosKeys.forEach(function (key) {
    tabsVideos[key].get(0).pause();
  });
  var tabs = layout.tabs.tab;

  if (tabs && !Array.isArray(tabs)) {
    tabs = [tabs];
  }

  if (tabId > 0) {
    var visitedTabs = _getCompletionDataForLayoutId(module.mod_id, layoutId).visitedTabs || {};
    var previousTabId = tabId - 1;

    if (!visitedTabs[previousTabId]) {
      return;
    }
  }

  var dotSelectedColor = $currentTemplate.find('.dotsContainer').data('dotselectedcolor');
  $currentTemplate.find('.dotsContainer .dot, .dotMobile').removeClass('active').css('background-color', '');
  $currentTemplate.find(".dotsContainer .dot[data-tabindex=\"".concat(tabId, "\"], .dotMobile[data-tabindex=\"").concat(tabId, "\"]")).addClass('active visited').css('background-color', dotSelectedColor);
  $currentTemplate.find('.tabContent').removeClass('active');
  $currentTemplate.find(".tabContent[data-tabindex=\"".concat(tabId, "\"]")).addClass('active');

  if (!skipA11ySpeak) {
    setTimeout(function () {
      _Module_layouts.a11y.sequence_readTabContent($currentTemplate.find('.tabContent.active'));
    }, 1);
  }

  if (isMobile) {
    scrollToElement($currentTemplate.find('.dotMobile.active'));
  }

  if (tabs[tabId].text) {
    // complete the tab if it's only text
    _sequence_completeTab($currentTemplate, module, layout, layoutId, tabId);

    $currentTemplate.find(".dotsContainer .dot[data-tabindex=".concat(tabId, "]")).focus();
  } else if ((tabs[tabId].question || tabs[tabId].questionShort || tabs[tabId].questionMultiple) && !skipA11ySpeak) {
    $currentTemplate.find('.tabContent.active .questionContainer .answersContainer .answer').first().focus();
  } else if (tabs[tabId].videoUrl && !skipA11ySpeak) {
    $currentTemplate.find('.tabContent.active .playBtnContainer').first().focus();
  }
}

function vertical_tabs(layoutId, layout, module) {
  var $currentTemplate = $(".vertical_tabs_template[data-layoutid=\"".concat(layoutId, "\"]"));
  var tabs = layout.tabs.tab;

  if (tabs && !Array.isArray(tabs)) {
    tabs = [tabs];
  }

  horizontal_tabs_setActiveTab($currentTemplate, 0, module, layoutId, true);
  $currentTemplate.find('.tabsContainer .tabsNavigation .tabNavElement, .tabNavElementMobile').uniClick(function (ev) {
    if ($(ev.currentTarget).hasClass('active')) {
      return;
    }

    if ($(ev.currentTarget).hasClass('tabNavElementMobile')) {
      setTimeout(function () {
        scrollToElement($(ev.currentTarget));
      }, 250);
    }

    var tabId = $(ev.currentTarget).data('tabindex');
    horizontal_tabs_setActiveTab($currentTemplate, tabId, module, layoutId);
    var visitedTabs = _getCompletionDataForLayoutId(module.mod_id, layoutId).visitedTabs || {};

    if (Object.keys(visitedTabs).length >= tabs.length) {
      enableContinueButton(module.mod_id, layoutId, $currentTemplate, true); // unlockLayout(module.mod_id, layoutId, $currentTemplate);
    }
  });
}

function horizontal_tabs(layoutId, layout, module) {
  var $currentTemplate = $(".horizontal_tabs_template[data-layoutid=\"".concat(layoutId, "\"]"));
  var tabs = layout.tabs.tab;
  var tabsVideos = {};

  if (tabs && !Array.isArray(tabs)) {
    tabs = [tabs];
  }

  horizontal_tabs_showHideButtons($currentTemplate);
  horizontal_tabs_setActiveTab($currentTemplate, 0, module, layoutId, true);
  tabs.forEach(function (tab, index) {
    if (tab.videoUrl) {
      var $currentTabTemplate = $currentTemplate.find('.tabContent[data-tabindex="' + index + '"]');

      _video_buildVideoPlayer($currentTabTemplate, tab.videoUrl, tab.subtitlesUrl, module.mod_id);

      _video_attachEvents($currentTabTemplate, tab, module, layoutId, true, false);

      var $currentVideoEl = $currentTabTemplate.find('.vidPopVideoInnerContainer video.uniPlayHtml');
      $currentVideoEl.on('ended', function (ev) {
        $currentTemplate.find(".tabsNavigation .tabsContainer .tabNavElement[data-tabindex=\"".concat(index, "\"]")).first().focus();
      });
      tabsVideos[index] = $currentTabTemplate.find('video');
    }
  });
  var $tabsContainer = $currentTemplate.find('.tabsContainer.multipleTabs');
  var currentlyScrolling = false;
  $currentTemplate.find('.tabsNavigation .tabsNavButtons .forward').uniClick(function (ev) {
    if (!$(ev.currentTarget).hasClass('active') || currentlyScrolling) {
      return;
    }

    var scrollValue = $tabsContainer.find('.tabNavElement').width(); // disable for the new design
    // if($currentTemplate.find('.tabsNavigation .tabsNavButtons .back.active').length === 0) {
    //     scrollValue -= parseInt($tabsContainer.find('.tabNavElement').css('margin-right'));
    // } else {

    scrollValue += parseInt($tabsContainer.find('.tabNavElement').css('margin-right')); // }

    var currentScroll = $tabsContainer.scrollLeft();
    currentlyScrolling = true;
    $tabsContainer.animate({
      scrollLeft: currentScroll + scrollValue
    }, 200, function () {
      currentlyScrolling = false;
      horizontal_tabs_showHideButtons($currentTemplate);
    });
  });
  $currentTemplate.find('.tabsNavigation .tabsNavButtons .back').uniClick(function (ev) {
    if (!$(ev.currentTarget).hasClass('active') || currentlyScrolling) {
      return;
    }

    var scrollValue = $tabsContainer.find('.tabNavElement').width(); // disable for the new design
    // if($currentTemplate.find('.tabsNavigation .tabsNavButtons .forward.active').length === 0) {
    //     scrollValue -= parseInt($tabsContainer.find('.tabNavElement').css('margin-right'));
    // } else {

    scrollValue += parseInt($tabsContainer.find('.tabNavElement').css('margin-right')); // }

    var currentScroll = $tabsContainer.scrollLeft();
    currentlyScrolling = true;
    $tabsContainer.animate({
      scrollLeft: currentScroll - scrollValue
    }, 200, function () {
      currentlyScrolling = false;
      horizontal_tabs_showHideButtons($currentTemplate);
    });
  });
  $currentTemplate.find('.tabsNavigation .tabsContainer .tabNavElement, .tabNavElementMobile').uniClick(function (ev) {
    if ($(ev.currentTarget).hasClass('active')) {
      return;
    }

    if ($(ev.currentTarget).hasClass('tabNavElementMobile')) {
      setTimeout(function () {
        scrollToElement($(ev.currentTarget));
      }, 250);
    }

    var tabId = $(ev.currentTarget).data('tabindex');
    horizontal_tabs_setActiveTab($currentTemplate, tabId, module, layoutId); //pause all tabs videos

    var tabsVideosKeys = Object.keys(tabsVideos);
    tabsVideosKeys.forEach(function (key) {
      tabsVideos[key].get(0).pause();
    });
    var visitedTabs = _getCompletionDataForLayoutId(module.mod_id, layoutId).visitedTabs || {};

    if (Object.keys(visitedTabs).length >= tabs.length) {
      enableContinueButton(module.mod_id, layoutId, $currentTemplate, true); // unlockLayout(module.mod_id, layoutId, $currentTemplate);
    }
  });
}

function horizontal_tabs_setActiveTab($currentTemplate, tabId, module, layoutId, skipA11ySpeak) {
  var selectedBgColor = $currentTemplate.find('.tabsNavigation').data('selectedbgcolor');
  var selectedTextColor = $currentTemplate.find('.tabsNavigation').data('selectedtextcolor');
  var textColor = $currentTemplate.find('.tabsNavigation').data('textcolor');
  $currentTemplate.find('.tabsContainer .tabNavElement.active, .tabNavElementMobile.active').attr('aria-pressed', false).removeClass('active').attr('style', "color: ".concat(textColor || '', "; border-color: ").concat(selectedBgColor, ";"));
  var $currentTab = $currentTemplate.find(".tabsContainer .tabNavElement[data-tabindex=".concat(tabId, "], .tabNavElementMobile[data-tabindex=").concat(tabId, "]"));
  $currentTab.attr('aria-pressed', true).addClass('active').addClass('passed').attr('style', "color: ".concat(selectedTextColor, "; background-color: ").concat(selectedBgColor, "; border-color: ").concat(selectedBgColor, ";"));
  $currentTab.each(function (index, el) {
    var currentAriaLabel = $(el).attr('aria-label');

    if (currentAriaLabel) {
      if (currentAriaLabel.toLowerCase().indexOf('visited') > -1) {
        return true;
      } else {
        $(el).attr('aria-label', currentAriaLabel + '. Visited.');
      }
    }
  });
  $currentTemplate.find('.tabContent').removeClass('active');
  $currentTemplate.find(".tabContent[data-tabindex=".concat(tabId, "]")).addClass('active');
  var visitedTabs = _getCompletionDataForLayoutId(module.mod_id, layoutId).visitedTabs || {};
  visitedTabs[tabId] = true;

  _putCompletionDataForLayoutId(module.mod_id, layoutId, 'visitedTabs', visitedTabs);

  if (!skipA11ySpeak) {
    var $activeTab = $currentTemplate.find('.tabContent.active');
    $activeTab.find('.vidPopVideoInnerContainer .playBtnContainer').first().focus();
    setTimeout(function () {
      _Module_layouts.a11y.horizontal_tabs_readTabContnt($activeTab);
    }, 1);
  }
}

function horizontal_tabs_showHideButtons($currentTemplate) {
  var $tabsContainer = $currentTemplate.find('.tabsContainer.multipleTabs');
  if ($tabsContainer.length == 0) return;
  var delta = 15; // possibly padding + value rounding difference

  var hasOverflowingContentForward = $tabsContainer.scrollLeft() + $tabsContainer.width() + delta < $tabsContainer[0].scrollWidth;
  var hasOverflowingContentBackward = $tabsContainer.scrollLeft() - delta > 0;

  if (hasOverflowingContentForward) {
    horizontal_tabs_activateForwardButton($currentTemplate);
  } else {
    horizontal_tabs_deactivateForwardButton($currentTemplate);
  }

  if (hasOverflowingContentBackward) {
    horizontal_tabs_activateBackButton($currentTemplate);
  } else {
    horizontal_tabs_deactivateBackButton($currentTemplate);
  }
}

function horizontal_tabs_activateBackButton($currentTemplate) {
  var $backBtn = $currentTemplate.find('.tabsNavButtons .back');

  if ($backBtn.hasClass('active')) {
    return;
  }

  var selectedBgColor = $currentTemplate.find('.tabsNavigation').data('selectedbgcolor');
  $backBtn.addClass('active').attr('style', "".concat(selectedBgColor ? "background-color: ".concat(selectedBgColor || '') : '')); // $currentTemplate.find('.tabsContainer.multipleTabs').addClass('backActive');  // disable for the new design
}

function horizontal_tabs_deactivateBackButton($currentTemplate) {
  var $backBtn = $currentTemplate.find('.tabsNavButtons .back');

  if (!$backBtn.hasClass('active')) {
    return;
  }

  $backBtn.removeClass('active').attr('style', ''); // var $tabsContainer = $currentTemplate.find('.tabsContainer.multipleTabs');
  // $tabsContainer.removeClass('backActive');  // disable for the new design
  // $tabsContainer.scrollLeft(0);
}

function horizontal_tabs_activateForwardButton($currentTemplate) {
  var $forwardBtn = $currentTemplate.find('.tabsNavButtons .forward');

  if ($forwardBtn.hasClass('active')) {
    return;
  }

  var selectedBgColor = $currentTemplate.find('.tabsNavigation').data('selectedbgcolor');
  $forwardBtn.addClass('active').attr('style', "".concat(selectedBgColor ? "background-color: ".concat(selectedBgColor || '') : '')); // var $tabsContainer = $currentTemplate.find('.tabsContainer.multipleTabs');
  // $tabsContainer.addClass('forwardActive');  // disable for the new design
  // $tabsContainer.scrollLeft($tabsContainer.scrollLeft() - ($forwardBtn.width() + 10)); // +10 for the margin between elements 
}

function horizontal_tabs_deactivateForwardButton($currentTemplate) {
  var $forwardBtn = $currentTemplate.find('.tabsNavButtons .forward');

  if (!$forwardBtn.hasClass('active')) {
    return;
  }

  $forwardBtn.removeClass('active').attr('style', '');
  var $tabsContainer = $currentTemplate.find('.tabsContainer.multipleTabs'); // $tabsContainer.removeClass('forwardActive'); // disable for the new design
  // $tabsContainer.scrollLeft($tabsContainer[0].scrollWidth); // scroll til the end of the container
}

function quiz_images(layoutId, layout, module, layoutComponent, $template, ignoreProgress) {
  var SL = HShell.content.selected_languageObj || {};
  var UI = SL.UI || {};
  var $currentTemplate = $template || $(".quiz_images_template[data-layoutid=\"".concat(layoutId, "\"]"));
  var questions = layout.questions.question;

  if (questions && !Array.isArray(questions)) {
    questions = [questions];
  }

  var tabsVideos = {};
  questions.forEach(function (question, index) {
    var videos = question && question.content && question.content.video ? question.content.video : [];

    if (videos && !Array.isArray(videos)) {
      videos = [videos];
    }

    if (videos && videos.length > 0) {
      videos.forEach(function (video) {
        var videoUrl = video.videoUrl;
        var subtitlesUrl = video.subtitlesUrl;
        var $currentQuestionContainer = $currentTemplate.find('.question[data-questionindex="' + index + '"]');

        _video_buildVideoPlayer($currentQuestionContainer, videoUrl, subtitlesUrl, module.mod_id);

        _video_attachEvents($currentQuestionContainer, false, module, layoutId, true, false);

        tabsVideos[index] = $currentQuestionContainer.find('video');
      });
    }
  });
  var activeQuestionId = 0;

  if (!ignoreProgress) {
    var answeredQuestions = _getCompletionDataForLayoutId(module.mod_id, layoutId).answeredQuestions || {};
    var answeredQuestionsKeys = Object.keys(answeredQuestions);

    if (answeredQuestionsKeys.length) {
      answeredQuestionsKeys.forEach(function (item) {
        activeQuestionId = item;
        var answersIds = answeredQuestions[item];
        answersIds.forEach(function (index, answerId) {
          var $selectedAnswer = $currentTemplate.find(".question[data-questionindex=\"".concat(activeQuestionId, "\"] .questionOptions .questionAnswer[data-answerid=\"").concat(answerId, "\"]"));
          var selectedBgColor = $currentTemplate.find('.questionOptions').data('selectedbgcolor');
          $selectedAnswer.addClass('selected').attr('style', "background-color: ".concat(selectedBgColor, "; border-color: ").concat(selectedBgColor, " !important;"));
        });

        _quiz_images_answerQuestion($currentTemplate, answersIds, activeQuestionId, layout, module, layoutId, true, tabsVideos);
      });

      if (questions.length > answeredQuestionsKeys.length) {
        activeQuestionId = parseInt(answeredQuestionsKeys[answeredQuestionsKeys.length - 1]) + 1;
      }
    }
  }

  _quiz_images_moveToQuestion($currentTemplate, activeQuestionId, module, layoutId, layout, true, tabsVideos);

  $currentTemplate.find('.questionOptions .questionAnswer').uniClick(function (ev) {
    var answeredQuestions = _getCompletionDataForLayoutId(module.mod_id, layoutId).answeredQuestions || {};
    var isCurrentQuestionAnswered = typeof answeredQuestions[activeQuestionId] !== 'undefined';

    if (isCurrentQuestionAnswered) {
      return;
    } // $($currentTemplate).find('.question[data-questionindex="' + activeQuestionId + '"] .questionAnswer').removeClass('selected');


    $(ev.currentTarget).toggleClass('selected');
    var currentCheckedState = $(ev.currentTarget).attr('aria-checked');
    $(ev.currentTarget).attr('aria-checked', !(currentCheckedState == 'true'));
    var currentAnswer = $currentTemplate.find(".question[data-questionindex=\"".concat(activeQuestionId, "\"] .questionAnswer.selected"));
    var selectedBgColor = $currentTemplate.find('.questionOptions').data('selectedbgcolor');
    var textColor = $currentTemplate.find('.questionOptions').data('textcolor');
    $currentTemplate.find(".question[data-questionindex=\"".concat(activeQuestionId, "\"] .questionAnswer")).attr('style', "border-color: ".concat(textColor, ";"));
    currentAnswer.attr('style', "background-color: ".concat(selectedBgColor, "; border-color: ").concat(selectedBgColor, " !important;"));
    var hasAnswerSelected = currentAnswer.length > 0;

    if (hasAnswerSelected) {
      $currentTemplate.find('.quizFooter .nextBtn').removeClass('disabled').attr('aria-disabled', 'false');
    } else {
      $currentTemplate.find('.quizFooter .nextBtn').addClass('disabled').attr('aria-disabled', 'true');
    }
  });
  $currentTemplate.find('.nextBtn').uniClick(function (ev) {
    if ($(ev.currentTarget).hasClass('disabled')) {
      return;
    }

    var answeredQuestions = _getCompletionDataForLayoutId(module.mod_id, layoutId).answeredQuestions || {};
    var isCurentQuestionAnswered = typeof answeredQuestions[activeQuestionId] !== 'undefined';

    if (!isCurentQuestionAnswered) {
      var $selectedAnswers = $($currentTemplate).find('.question[data-questionindex="' + activeQuestionId + '"] .questionAnswer.selected');

      if ($selectedAnswers.length == 0) {
        return;
      } else {
        var selectedAnswersIds = [];
        $selectedAnswers.each(function (index, selectedAnswer) {
          selectedAnswersIds.push($(selectedAnswer).data('answerid'));
        });
        $currentTemplate.find('.nextBtn').html(UI.next);

        _quiz_images_answerQuestion($currentTemplate, selectedAnswersIds, activeQuestionId, layout, module, layoutId, false, tabsVideos);
      }
    } else {
      var isLastQuestion = activeQuestionId == questions.length - 1;

      if (!isLastQuestion) {
        ++activeQuestionId;

        _quiz_images_moveToQuestion($currentTemplate, activeQuestionId, module, layoutId, layout, false, tabsVideos);
      }
    }
  });
  $currentTemplate.find('.prevBtn').uniClick(function (ev) {
    if ($(ev.currentTarget).hasClass('disabled')) {
      return;
    }

    var isFirstQuestion = activeQuestionId == 0;

    if (!isFirstQuestion) {
      --activeQuestionId;

      _quiz_images_moveToQuestion($currentTemplate, activeQuestionId, module, layoutId, layout, false, tabsVideos);
    }
  });
  $currentTemplate.find('.dot').uniClick(function (ev) {
    var questionId = $(ev.currentTarget).data('questionindex');
    var answeredQuestions = _getCompletionDataForLayoutId(module.mod_id, layoutId).answeredQuestions || {};
    var isPreviousQuestionAnswered = typeof answeredQuestions[questionId - 1] !== 'undefined';

    if (questionId != 0 && !isPreviousQuestionAnswered) {
      return;
    } else {
      activeQuestionId = questionId;

      _quiz_images_moveToQuestion($currentTemplate, activeQuestionId, module, layoutId, layout, false, tabsVideos);
    }
  });
  $currentTemplate.find('.imageContainer .item').uniClick(function (ev) {
    var itemId = $(ev.currentTarget).data('itemid');
    var itemColor = $currentTemplate.find('.imageContainer').data('itemcolor');
    $currentTemplate.find(".imageContainer .item[data-itemid=\"".concat(itemId, "\"]")).addClass('visited').find('.icon').attr('style', "border-color: ".concat(itemColor || '', "; background-color: ").concat(itemColor || '', ";"));

    _quiz_images_openDescription($currentTemplate, itemId);
  });
  $currentTemplate.find('.itemDescription .closeBtn').uniClick(function (ev) {
    _quiz_images_closeDescriptions($currentTemplate);
  });
  $currentTemplate.find('.feedbackContainer .feedbackCloseBtn').uniClick(function (ev) {
    _quiz_images_hideFeedback($currentTemplate);
  });
  $currentTemplate.find('.quizFooter .readAgain').uniClick(function (ev) {
    _quiz_images_showFeedback($currentTemplate, activeQuestionId);
  });
}

function _quiz_images_openDescription($currentTemplate, itemId) {
  hideNavigationButton();
  $currentTemplate.find('.itemsDescriptionsContainer').show(SHOW_HIDE_ANIMATION_OPTIONS);
  $currentTemplate.find(".itemsDescriptionsContainer .itemDescription[data-itemid=\"".concat(itemId, "\"]")).addClass('active');
  var $activeDescriptionContainer = $currentTemplate.find('.itemsDescriptionsContainer .itemDescription.active');
  HShell.utils.lockFocusToContainer($activeDescriptionContainer, $activeDescriptionContainer.find('.closeBtn'));

  _Module_layouts.a11y.hidden_items_readDescription($activeDescriptionContainer);
}

function _quiz_images_closeDescriptions($currentTemplate) {
  showNavigationButton();
  var activeItemId = $currentTemplate.find('.itemsDescriptionsContainer .itemDescription.active').data('itemid');
  var activeItemBtn = $currentTemplate.find(".imageContainer .item[data-itemid=\"".concat(activeItemId, "\"]"));
  $currentTemplate.find('.itemsDescriptionsContainer').hide(SHOW_HIDE_ANIMATION_OPTIONS);
  $currentTemplate.find('.itemsDescriptionsContainer .itemDescription').removeClass('active');
  setTimeout(function () {
    HShell.utils.unlockFocusFromContainer(null, activeItemBtn);
  }, 1);
}

function _quiz_images_hideFeedback($currentTemplate, dontMoveFocus) {
  var hasActiveHiddenItemsDescription = $currentTemplate.closest('.hidden_items_template').find('.itemDescription.active').length > 0;

  if (!hasActiveHiddenItemsDescription) {
    showNavigationButton();
  }

  $currentTemplate.find('.feedbackContainer .feedback').hide().parent().hide(); // hide feedback .hide(SHOW_HIDE_ANIMATION_OPTIONS).parent().hide()

  setTimeout(function () {
    HShell.utils.unlockFocusFromContainer();

    if (!dontMoveFocus) {
      $currentTemplate.find('.quizFooter .nextBtn').focus();
    }
  }, 1);
}

function _quiz_images_showFeedback($currentTemplate, questionId) {
  hideNavigationButton();
  $currentTemplate.find(".feedbackContainer .feedback[data-questionIndex=".concat(questionId, "]")).show().parent().show(); // show feedback .show().parent().show(SHOW_HIDE_ANIMATION_OPTIONS)

  var $activeDescriptionContainer = $currentTemplate.find(".feedbackContainer .feedback[data-questionIndex=".concat(questionId, "]"));
  HShell.utils.lockFocusToContainer($activeDescriptionContainer, $activeDescriptionContainer.find('.closeBtn'));

  _Module_layouts.a11y.quiz_images_readFeedback($activeDescriptionContainer);
}

function _quiz_images_enableButtons($currentTemplate, questionId) {
  $currentTemplate.find('.quizFooter .readAgain').show();
  $currentTemplate.find('.quizFooter .nextBtn').removeClass('disabled').attr('aria-disabled', 'false');
}

function _quiz_images_disableButtons($currentTemplate, questionId) {
  $currentTemplate.find('.quizFooter .readAgain').hide();
  var hasAnswerSelected = $currentTemplate.find(".question[data-questionindex=\"".concat(questionId, "\"] .questionAnswer.selected")).length > 0;

  if (hasAnswerSelected) {
    $currentTemplate.find('.quizFooter .nextBtn').removeClass('disabled').attr('aria-disabled', 'false');
  } else {
    $currentTemplate.find('.quizFooter .nextBtn').addClass('disabled').attr('aria-disabled', 'true');
  }
}

function _quiz_images_hideNextBtn($currentTemplate) {
  $currentTemplate.find('.nextBtn').hide();
}

function _quiz_images_showNextBtn($currentTemplate) {
  $currentTemplate.find('.nextBtn').css('display', '');
}

function _quiz_images_moveToQuestion($currentTemplate, questionId, module, layoutId, layout, skipA11ySpeak, tabsVideos) {
  var SL = HShell.content.selected_languageObj || {};
  var UI = SL.UI || {};

  if (tabsVideos) {
    var tabsVideosKeys = Object.keys(tabsVideos);
    tabsVideosKeys.forEach(function (key) {
      tabsVideos[key].get(0).pause();
    });
  }

  var questions = layout.questions.question;

  if (questions && !Array.isArray(questions)) {
    questions = [questions];
  }

  _quiz_images_showNextBtn($currentTemplate);

  _quiz_images_hideFeedback($currentTemplate, true);

  if (questionId > 0) {
    $currentTemplate.find('.prevBtn').removeClass('disabled');
  } else {
    $currentTemplate.find('.prevBtn').addClass('disabled');
  }

  var answeredQuestions = _getCompletionDataForLayoutId(module.mod_id, layoutId).answeredQuestions || {};
  var isCurrentQuestionAnswered = typeof answeredQuestions[questionId] !== 'undefined';

  if (!isCurrentQuestionAnswered) {
    $currentTemplate.find('.nextBtn').html(UI.label_Submit);

    _quiz_images_disableButtons($currentTemplate, questionId);
  } else {
    $currentTemplate.find('.nextBtn').html(UI.next);

    _quiz_images_enableButtons($currentTemplate, questionId);

    if (questionId < questions.length - 1) {
      $currentTemplate.find('.nextBtn').removeClass('disabled').attr('aria-disabled', 'false');
    } else if (questionId >= questions.length - 1) {
      _quiz_images_hideNextBtn($currentTemplate);
    } else {
      $currentTemplate.find('.nextBtn').addClass('disabled').attr('aria-disabled', 'true');
    }
  }

  var dotSelectedColor = $currentTemplate.find('.quizFooter .dotsContainer').data('dotselectedcolor');
  $currentTemplate.find('.quizFooter .dotsContainer .dot').removeClass('active').css('background-color', '');
  $currentTemplate.find(".quizFooter .dotsContainer .dot[data-questionindex=\"".concat(questionId, "\"]")).addClass('active visited').css('background-color', dotSelectedColor);
  ;
  $currentTemplate.find('.question').hide();
  $currentTemplate.find(".question[data-questionindex=\"".concat(questionId, "\"]")).show();

  if (!skipA11ySpeak) {
    $currentTemplate.find(".question[data-questionindex=\"".concat(questionId, "\"] .questionOptions .questionAnswer")).first().focus();
    setTimeout(function () {
      _Module_layouts.a11y.quiz_images_readQuestion($currentTemplate.find(".question[data-questionindex=\"".concat(questionId, "\"]")));
    }, 1);
  }
}

function _quiz_images_answerQuestion($currentTemplate, selectedAnswersIds, questionId, layout, module, layoutId, dontShowFeedback, tabsVideos) {
  if (tabsVideos) {
    var tabsVideosKeys = Object.keys(tabsVideos);
    tabsVideosKeys.forEach(function (key) {
      tabsVideos[key].get(0).pause();
    });
  }

  var questions = layout.questions.question;

  if (questions && !Array.isArray(questions)) {
    questions = [questions];
  }

  var answers = questions[questionId].answers.answer;

  if (answers && !Array.isArray(answers)) {
    answers = [answers];
  }

  var answeredQuestions = _getCompletionDataForLayoutId(module.mod_id, layoutId).answeredQuestions || {};
  answeredQuestions[questionId] = selectedAnswersIds;

  _putCompletionDataForLayoutId(module.mod_id, layoutId, 'answeredQuestions', answeredQuestions);

  _quiz_images_enableButtons($currentTemplate, questionId);

  var numberOfCorrectAnswers = 0;
  answers.forEach(function (answer) {
    if (answer['_correct'] == 'true') {
      numberOfCorrectAnswers++;
    }
  });
  var isQuestionCorrect = true;

  if (numberOfCorrectAnswers != selectedAnswersIds.length) {
    isQuestionCorrect = false;
  } else {
    selectedAnswersIds.forEach(function (answerId) {
      var isCurrentAnswerCorrect = answers[answerId]['_correct'] == 'true';

      if (!isCurrentAnswerCorrect) {
        isQuestionCorrect = false;
      }
    });
  }

  var SL = HShell.content.selected_languageObj || {};
  var UI = SL.UI || {};
  var title = '';
  var color = '';

  if (isQuestionCorrect) {
    title = UI.correct;
    color = '#048A17';
  } else {
    title = UI.incorrect;
    color = '#be001b';
  }

  $currentTemplate.find(".feedbackContainer .feedback[data-questionIndex=".concat(questionId, "] .title")).html(title).css('color', color);
  $currentTemplate.find(".quizFooter .dotsContainer .dot[data-questionindex=\"".concat(questionId + 1, "\"]")).attr('aria-disabled', false).attr('disabled', false);

  if (!dontShowFeedback) {
    _quiz_images_showFeedback($currentTemplate, questionId);
  }

  if (questions.length === Object.keys(answeredQuestions).length) {
    _quiz_images_hideNextBtn($currentTemplate);

    enableContinueButton(module.mod_id, layoutId, $currentTemplate);
  }
}

function object_viewer(layoutId, layout, module) {
  var $currentTemplate = $(".object_viewer_template[data-layoutid=\"".concat(layoutId, "\"]"));
  var modelViewer = $currentTemplate.find('.modelViewerElement').get(0);
  var items = layout.items && layout.items.item;

  if (items && !Array.isArray(items)) {
    items = [items];
  } else if (!items) {
    items = [];
  }

  _hidden_items_initItemsData($currentTemplate, module, layoutId, items);

  _hidden_items_initEvents($currentTemplate, module, layoutId, items);

  modelViewer.addEventListener('load', function () {
    var center = modelViewer.getBoundingBoxCenter();
    var size = modelViewer.getDimensions();
    items.forEach(function (item, index) {
      var itemPosition = item.itemPosition || '1,1,1';
      var itemCoordinates = itemPosition.split(',');
      var x2offset = Number(itemCoordinates[0] || 1);
      var y2offset = Number(itemCoordinates[1] || 1);
      var z2offset = Number(itemCoordinates[2] || 1);
      var x2 = size.x / 2 * x2offset;
      var y2 = size.y / 2 * y2offset;
      var z2 = size.z / 2 * z2offset;
      modelViewer.updateHotspot({
        name: "hotspot-dot-".concat(index),
        position: "".concat(center.x + x2, " ").concat(center.y + y2, " ").concat(center.z + z2)
      });
    });
  });
  $currentTemplate.find('.startButton').uniClick(function (ev) {
    $currentTemplate.find('.initialCoverContainer').hide();
    scrollToElement($currentTemplate.find('.modelViewerElement'));
  });
  enableContinueButton(module.mod_id, layoutId, $currentTemplate);
}

function scrollToElement($element) {
  if (typeof $element == 'string') {
    $element = $($element);
  }

  if (!$element || $element.length === 0) {
    return;
  }

  $('#SCORM_Container .ModuleLayouts__Content').animate({
    scrollTop: $('#SCORM_Container .ModuleLayouts__Content').scrollTop() + $element.offset().top - $('#SCORM_Container .ModuleLayouts__NavigationBtn').height() // ModuleLayouts__NavigationBtn is 80px on mobile so we need to remove its height

  }, 400);
} // Shows the layout content for the specified layoutId. Should be called on Continue btn press (if present)


function unlockLayout(moduleId, layoutId, $currentTemplate) {
  var moduleData = HShell.storage.loadModuleCustomData(moduleId) || {};
  moduleData.lockedLayouts = moduleData.lockedLayouts || {};

  if (moduleData.lockedLayouts && Object.keys(moduleData.lockedLayouts).length && typeof moduleData.lockedLayouts[layoutId] !== 'undefined' && moduleData.lockedLayouts[layoutId]) {
    moduleData.lockedLayouts[layoutId] = false;
    HShell.storage.saveModuleCusomData(moduleId, moduleData);
    var lockedLayoutsKey = Object.keys(moduleData.lockedLayouts);
    var lastKeyValue = lockedLayoutsKey[lockedLayoutsKey.length - 1];

    if (moduleData.lockedLayouts[lastKeyValue] === false) {
      // if the last locked layout is unlocked, mark the module as completed
      HShell.content.setModuleContent_AsCompleted(moduleId);
      HShell.checkForPostAssessment();
    }
  }
}

function enableContinueButton(moduleId, layoutId, $currentTemplate, skipScrolling) {
  var moduleData = HShell.storage.loadModuleCustomData(moduleId) || {};
  moduleData.layoutContinueEnabled = moduleData.layoutContinueEnabled || {};
  moduleData.layoutContinueEnabled[layoutId] = true;
  HShell.storage.saveModuleCusomData(moduleId, moduleData);
  var SL = HShell.content.selected_languageObj || {};
  var UI = SL.UI || {};
  var $currentLayoutBlockingSection = $currentTemplate.find('.layoutBlockingSectionContainer');
  $currentLayoutBlockingSection.addClass('unlocked');
  $currentLayoutBlockingSection.find('.button').attr('aria-disabled', 'false').attr('disabled', false).attr('aria-label', 'Continue to the next section').attr('tabindex', 0);
  $currentLayoutBlockingSection.find('.text').html(UI.completedContinue); // var nextLayoutId = layoutId + 1;
  // nextLayoutId = nextLayoutId > Object.keys(moduleData.layoutContinueEnabled).length - 1 ? 
  // var nextLayoutContinueEnabled = moduleData.layoutContinueEnabled[]

  if (isScrollingEnabled && !skipScrolling) {
    scrollToElement($currentLayoutBlockingSection);
  }
}

function hideContinueButton($currentTemplate) {
  var $currentLayoutBlockingSection = $currentTemplate.find('.layoutBlockingSectionContainer');
  $currentLayoutBlockingSection.hide();
}

function hideAllVideoContainers() {
  $('.Component_Module_layouts .vidPopVideoContainer').addClass('invisible');
}

function reshowAllVideoContainers() {
  $('.Component_Module_layouts .vidPopVideoContainer').removeClass('invisible');
}

function showNavigationButton() {
  // it's hidden only for mobile version (width < 1024px). Controlled from the CSS
  $('.ModuleLayouts__NavigationBtn').removeClass('hidden');
  $('.ModuleLayouts__Content').removeClass('fullscreen');
}

function hideNavigationButton() {
  // it's hidden only for mobile version (width < 1024px). Controlled from the CSS
  $('.ModuleLayouts__NavigationBtn').addClass('hidden');
  $('.ModuleLayouts__Content').addClass('fullscreen');
}

function enableScrolling() {
  isScrollingEnabled = true;
}

function disableScrolling() {
  isScrollingEnabled = false;
}

function pauseAllVideos(wrapperComponent) {
  $(wrapperComponent).find('video').each(function (index, videoEl) {
    $(videoEl).get(0).pause();
  });
}

function closeAllFeedbacks(wrapperComponent) {
  var $wrapperComponent = $(wrapperComponent);

  _hidden_items_closeDescriptions($wrapperComponent);

  _quiz_images_hideFeedback($wrapperComponent);

  _video_attachInteractionPointsEvents_discovery_hideDescription($wrapperComponent);
}

},{"./Module_layouts.a11y":38,"./Module_layouts.template":41}],41:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.helpers = exports.templates = void 0;
var close_icon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><path d="M511.728 1023.457c-281.94 0-511.728-229.789-511.728-511.728s229.789-511.728 511.728-511.728 511.728 229.789 511.728 511.728-229.789 511.728-511.728 511.728zM511.728 81.485c-237.394 0-430.243 192.849-430.243 430.243s192.849 430.243 430.243 430.243 430.243-192.849 430.243-430.243-192.849-430.243-430.243-430.243z"></path><path d="M568.205 518.4l181.21-181.21c17.293-17.293 17.293-45.325 0-62.605-17.306-17.293-45.312-17.293-62.605 0l-181.21 181.21-181.21-181.21c-17.293-17.293-45.312-17.293-62.605 0s-17.293 45.325 0 62.605l181.222 181.21-181.222 181.21c-17.293 17.306-17.293 45.325 0 62.605 17.293 17.293 45.325 17.293 62.605 0l181.21-181.21 181.21 181.21c17.293 17.293 45.299 17.293 62.605 0 17.293-17.28 17.293-45.299 0-62.605l-181.21-181.21z"></path></svg>';
var down_arrow_icon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" id="Simple_arrow_down" x="0px" y="0px" viewBox="0 0 52 52" enable-background="new 0 0 52 52" xml:space="preserve"><path d="M26,35c-0.3,0-0.5-0.1-0.7-0.3l-14-14c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0L26,32.6l13.3-13.3c0.4-0.4,1-0.4,1.4,0    s0.4,1,0,1.4l-14,14C26.5,34.9,26.3,35,26,35z"/><path d="M26,4c12.1,0,22,9.9,22,22s-9.9,22-22,22S4,38.1,4,26S13.9,4,26,4 M26,2C12.7,2,2,12.7,2,26s10.7,24,24,24s24-10.7,24-24  S39.3,2,26,2L26,2z"/></svg>';
var navigation_lock_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" enable-background="new 0 0 52 52"><path id="svg_2" d="m26,4c12.1,0 22,9.9 22,22s-9.9,22 -22,22s-22,-9.9 -22,-22s9.9,-22 22,-22m0,-2c-13.3,0 -24,10.7 -24,24s10.7,24 24,24s24,-10.7 24,-24s-10.7,-24 -24,-24l0,0z"/><path stroke="null" id="svg_7" d="m35.11189,24.86382l-0.88619,0l0,-4.43094a7.97569,7.97569 0 0 0 -15.95139,0l0,4.43094l-0.88619,0a0.88619,0.88619 0 0 0 -0.88619,0.88619l0,12.40664a0.88619,0.88619 0 0 0 0.88619,0.88619l17.72377,0a0.88619,0.88619 0 0 0 0.88619,-0.88619l0,-12.40664a0.88619,0.88619 0 0 0 -0.88619,-0.88619zm-15.0652,-4.43094a6.20332,6.20332 0 0 1 12.40664,0l0,4.43094l-12.40664,0l0,-4.43094zm14.17901,16.83758l-15.95139,0l0,-10.63426l15.95139,0l0,10.63426z"/></svg>';
var arrow_right_icon = '<svg id="Simple_arrow_right" data-name="Simple arrow right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><style>.cls-1{fill:none;}</style></defs><title>Simple_arrow_right_POS</title><path d="M18,39a1,1,0,0,1-.71-1.71L30.59,24,17.29,10.71a1,1,0,0,1,1.41-1.41l14,14a1,1,0,0,1,0,1.41l-14,14A1,1,0,0,1,18,39Z"/><rect class="cls-1" width="48" height="48"/></svg>';
var tick_icon = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 490 490" xml:space="preserve"><polygon points="452.253,28.326 197.831,394.674 29.044,256.875 0,292.469 207.253,461.674 490,54.528 "/></svg>';
var plus_icon = '<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" xml:space="preserve"><rect id="svg_3" height="50" width="4" y="0" x="23" stroke-width="0" fill="#000000"></rect><rect id="svg_5" height="4" width="50" y="22.875" x="0" stroke-width="0" fill="#000000"></rect></svg>';
var playBtn_with_border = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><path d="M512 42.666c258.134 0 469.334 211.2 469.334 469.334s-211.2 469.334-469.334 469.334-469.334-211.2-469.334-469.334 211.2-469.334 469.334-469.334zM512 0c-283.734 0-512 228.267-512 512s228.267 512 512 512 512-228.267 512-512-228.267-512-512-512v0z"></path><path d="M304 812.444c-12.764 0-23.111-10.347-23.111-23.111v0-554.667c0-0.018 0-0.041 0-0.063 0-12.764 10.347-23.111 23.111-23.111 4.068 0 7.891 1.051 11.211 2.897l-0.118-0.061 508.444 277.334c7.28 3.987 12.134 11.596 12.134 20.337s-4.854 16.351-12.014 20.278l-0.12 0.061-508.444 277.334c-3.174 1.746-6.956 2.773-10.977 2.773-0.041 0-0.081 0-0.122 0h0.007zM327.111 273.493v477.014l437.031-238.507z"></path></svg>';
var panorama_cover_icon = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 91.95 91.95\"><defs><style>.cls-3{fill:#fff;}.cls-2{opacity:0.3;}</style></defs><path class=\"cls-3\" d=\"M315.23,429a46,46,0,1,1,46-46A46,46,0,0,1,315.23,429Zm0-88.94a43,43,0,1,0,43,43A43,43,0,0,0,315.23,340.05Z\" transform=\"translate(-269.26 -337.05)\"/><path class=\"cls-3\" d=\"M315.23,393.22c-22.1,0-45-3.81-45-10.2s22.87-10.21,45-10.21,45,3.82,45,10.21S337.34,393.22,315.23,393.22Zm0-19.41c-26.3,0-44,4.76-44,9.21s17.67,9.2,44,9.2,44-4.76,44-9.2S341.54,373.81,315.23,373.81Z\" transform=\"translate(-269.26 -337.05)\"/><path class=\"cls-3\"\n    d=\"M295.68,419.28c-5,0-9.22-1.44-12.25-4.46-4.69-4.7-5.75-12.43-3-21.78s8.91-19,17.37-27.45c17.53-17.53,39.61-24,49.23-14.37h0c9.6,9.61,3.16,31.69-14.38,49.23C320.64,412.47,306.49,419.28,295.68,419.28Zm39.07-71.56c-10.5,0-24.4,6.74-36.24,18.58-8.34,8.34-14.42,17.94-17.11,27s-1.68,16.37,2.74,20.79c9.22,9.22,30.67,2.78,47.82-14.37s23.59-38.59,14.37-47.81C343.48,349.07,339.45,347.72,334.75,347.72Z\" transform=\"translate(-269.26 -337.05)\"/><path class=\"cls-3\" d=\"M344.5,415.7c-7,0-22.93-11.92-36.48-25.47-8.43-8.42-15.63-17.06-20.3-24.32-3.38-5.28-6.87-12.11-4.29-14.69,4.52-4.52,23.39,8.95,39,24.58s29.1,34.5,24.59,39A3.48,3.48,0,0,1,344.5,415.7ZM286,351.33a2.46,2.46,0,0,0-1.83.6c-3.14,3.14,6,19,24.59,37.6s34.46,27.72,37.6,24.58-6-19-24.59-37.6c-8.37-8.37-16.95-15.53-24.16-20.16C292.48,353.08,288.38,351.33,286,351.33Z\" transform=\"translate(-269.26 -337.05)\"/><g class=\"cls-2\"><circle cx=\"45.97\" cy=\"45.97\" r=\"44.47\"/><path class=\"cls-3\" d=\"M315.23,429a46,46,0,1,1,46-46A46,46,0,0,1,315.23,429Zm0-88.94a43,43,0,1,0,43,43A43,43,0,0,0,315.23,340.05Z\"\n    transform=\"translate(-269.26 -337.05)\"/></g><path class=\"cls-3\" d=\"M307.33,396.85h-.11c-18.33-1.24-20.31-5.37-20.31-7.09,0-6.16,20.12-7.15,24.16-7.29a1.48,1.48,0,0,1,1.55,1.45,1.5,1.5,0,0,1-1.45,1.55c-14,.47-20.84,3.1-21.26,4.33.36,1,5.86,3.27,17.51,4.05a1.5,1.5,0,0,1-.09,3Z\" transform=\"translate(-269.26 -337.05)\"/><path class=\"cls-3\" d=\"M323.67,396.81a1.5,1.5,0,0,1-.1-3c12-.87,16.68-3.18,17-4.11-.42-1.15-7.3-3.78-21.32-4.24a1.51,1.51,0,0,1-1.45-1.55,1.54,1.54,0,0,1,1.55-1.45c4.05.14,24.21,1.12,24.21,7.29,0,4.89-12.38,6.52-19.77,7.05Z\" transform=\"translate(-269.26 -337.05)\"/><polygon class=\"cls-3\" points=\"57.81 65.49 49.74 58.49 57.75 51.35 57.81 65.49\"/><path class=\"cls-3\" d=\"M327.07,403a.49.49,0,0,1-.32-.12l-8.08-7a.52.52,0,0,1-.17-.37.49.49,0,0,1,.17-.38l8-7.14a.49.49,0,0,1,.53-.08.51.51,0,0,1,.3.46l.06,14.13a.48.48,0,0,1-.29.46A.49.49,0,0,1,327.07,403Zm-7.31-7.5,6.81,5.9-.06-11.92Z\" transform=\"translate(-269.26 -337.05)\"/><polygon class=\"cls-3\" points=\"36.19 51.35 44.26 58.35 36.25 65.49 36.19 51.35\"/><path class=\"cls-3\" d=\"M305.52,403a.52.52,0,0,1-.21,0,.49.49,0,0,1-.29-.45L305,388.4a.5.5,0,0,1,.83-.38l8.07,7a.5.5,0,0,1,.17.38.51.51,0,0,1-.16.37l-8,7.14A.5.5,0,0,1,305.52,403ZM306,389.5l.05,11.92,6.76-6Z\" transform=\"translate(-269.26 -337.05)\"/><path class=\"cls-3\" d=\"M301.39,378.47v-2.28a4.63,4.63,0,0,0,2.79.87,2.59,2.59,0,0,0,1.57-.43,1.45,1.45,0,0,0,.56-1.21,1.38,1.38,0,0,0-.7-1.23,3.57,3.57,0,0,0-1.9-.43h-1.07v-2h1c1.55,0,2.33-.51,2.33-1.54s-.6-1.45-1.79-1.45a4,4,0,0,0-2.32.77v-2.14a6.41,6.41,0,0,1,2.92-.63,4.37,4.37,0,0,1,2.84.82,2.61,2.61,0,0,1,1,2.13,2.77,2.77,0,0,1-2.37,2.92v0a3.23,3.23,0,0,1,2,.92,2.62,2.62,0,0,1,.73,1.86,3.18,3.18,0,0,1-1.22,2.64,5.28,5.28,0,0,1-3.37,1A6.51,6.51,0,0,1,301.39,378.47Z\" transform=\"translate(-269.26 -337.05)\"/><path class=\"cls-3\" d=\"M318.32,367.08v2.19a4,4,0,0,0-2-.51,2.6,2.6,0,0,0-2.13,1,4.36,4.36,0,0,0-.84,2.71h.05a2.83,2.83,0,0,1,2.5-1.27,3,3,0,0,1,2.37,1,4,4,0,0,1,.87,2.68,4.07,4.07,0,0,1-1.16,3,4,4,0,0,1-2.95,1.18,3.74,3.74,0,0,1-3.14-1.45,6.5,6.5,0,0,1-1.13-4.07,7.76,7.76,0,0,1,1.45-4.94,4.74,4.74,0,0,1,3.94-1.84A5.63,5.63,0,0,1,318.32,367.08ZM315,373.15a1.46,1.46,0,0,0-1.15.5,1.92,1.92,0,0,0-.43,1.3,2.52,2.52,0,0,0,.44,1.49,1.35,1.35,0,0,0,1.16.62,1.33,1.33,0,0,0,1.12-.56,2.23,2.23,0,0,0,.43-1.44C316.6,373.79,316.08,373.15,315,373.15Z\"\n    transform=\"translate(-269.26 -337.05)\"/><path class=\"cls-3\" d=\"M324.56,379.06c-2.83,0-4.25-2-4.25-6a8.08,8.08,0,0,1,1.15-4.72,3.83,3.83,0,0,1,3.33-1.62q4.15,0,4.15,6.06a8.07,8.07,0,0,1-1.13,4.64A3.74,3.74,0,0,1,324.56,379.06Zm.11-10.3c-1.13,0-1.7,1.42-1.7,4.27,0,2.68.56,4,1.67,4s1.63-1.39,1.63-4.15S325.74,368.76,324.67,368.76Z\" transform=\"translate(-269.26 -337.05)\"/></svg>";
var ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
var HShell = window.HShell || {};
var DEFAULT_FOOTER_OPTIONS = {
  subtitles: true,
  rightButtonLable: null,
  noHome: true,
  homeEnabled: false
};
var templates = {
  main: main,
  fullscreen_video_template: fullscreen_video_template,
  small_video_template: small_video_template,
  two_columns_text_template: two_columns_text_template,
  text_and_image_template: text_and_image_template,
  fullscreen_text_and_image_template: fullscreen_text_and_image_template,
  horizontal_tabs_template: horizontal_tabs_template,
  vertical_tabs_template: vertical_tabs_template,
  sequence_template: sequence_template,
  icons_discover_template: icons_discover_template,
  hidden_items_template: hidden_items_template,
  quiz_images_template: quiz_images_template,
  title_template: title_template,
  object_viewer_template: object_viewer_template
};
exports.templates = templates;
var helpers = {
  hidden_items_iconContent: hidden_items_iconContent
};
exports.helpers = helpers;
var videoInteractions = {
  _video_getInteractionTemplate_discover: _video_getInteractionTemplate_discover,
  _video_getInteractionTemplate_question: _video_getInteractionTemplate_question,
  _video_getInteractionTemplate_mandatoryQuestion: _video_getInteractionTemplate_mandatoryQuestion
};

function main(_ref) {
  var module = _ref.module,
      UI = _ref.UI,
      onNavigation = _ref.onNavigation;
  UI = UI || {};
  return "\n        <div class=\"ModuleLayouts\">\n            ".concat(HShell.core.getComponent('Module_Navigation').init({
    module: module,
    onNavigation: onNavigation
  }), "\n            <div class=\"ModuleLayouts__Content\">\n                <span class=\"ModuleLayouts__Footer\">").concat(_getFooterTemplate(UI), "</span>\n            </div>\n        </div>\n    ");
}

function _getFooterTemplate(UI) {
  UI = UI || {};
  return "\n        <div class=\"footerContent\">\n            <div class=\"title\">".concat(UI.title_endOfMod, "</div>\n            <div class=\"description\">").concat(UI.text_endOfMod, "</div>\n        </div>\n    ");
}

function title_template(layout, module, layoutIndex) {
  layout = layout || {};
  module = module || {};
  var $commonTemplate = $(_getCommonTemplate(layout, layoutIndex, 'title_template'));
  return $commonTemplate[0].outerHTML;
}

function object_viewer_template(layout, module, layoutIndex) {
  var SL = HShell.content.selected_languageObj || {};
  var UI = SL.UI || {};
  layout = layout || {};
  module = module || {};
  var items = layout.items && layout.items.item;

  if (items && !Array.isArray(items)) {
    items = [items];
  } else if (!items) {
    items = [];
  }

  var $commonTemplate = $(_getCommonTemplate(layout, layoutIndex, 'object_viewer_template'));
  var mobileArEnabled = layout.mobileArEnabled == 'true' || layout.mobileArEnabled == true;
  var disableZoom = layout.disableZoom == 'true' || layout.disableZoom == true;
  var autoRotate = layout.autoRotate == 'true' || layout.autoRotate == true;
  var disablePan = layout.disablePan == 'true' || layout.disablePan == true;
  var disableInteractionPrompt = layout.disableInteractionPrompt == 'true' || layout.disableInteractionPrompt == true;
  var currentTemplate = "\n    <div class=\"layoutTemplateContentContainer\" data-moduleId=\"".concat(module.mod_id, "\" data-itemcolor=\"").concat(layout.itemColor || '', "\">\n        <div class=\"initialCoverContainer\">\n            <div class=\"initialCover\">\n                <div class=\"icon\">").concat(panorama_cover_icon, "</div>\n                <div class=\"title\">").concat(layout.initialCoverText, "</div>\n                <div class=\"startButton\" tabindex=\"0\" role=\"button\">").concat(UI.image360StartBtn, "</div>\n            </div>\n        </div>\n        <model-viewer\n            class=\"modelViewerElement\"\n            style=\"").concat(layout.backgroundImageUrl ? "background-image: url('".concat(layout.backgroundImageUrl, "');") : "background-color: ".concat(layout.backgroundColor || 'black', ";"), "\"\n            alt=\"").concat(layout.objectAltText, "\"\n            src=\"").concat(layout.objectUrl, "\"\n            ").concat(mobileArEnabled ? 'ar ar-modes="scene-viewer quick-look webxr"' : '', "\n            ").concat(layout.objectPosterImgUrl ? "poster=\"".concat(layout.objectPosterImgUrl, "\"") : '', "\n            ").concat(layout.objectEnvImgUrl ? "skybox-image=\"".concat(layout.objectEnvImgUrl, "\"") : '', "\n            ").concat(disableZoom ? 'disable-zoom' : '', "\n            ").concat(autoRotate ? 'auto-rotate rotation-per-second="250%"' : '', "\n            ").concat(disablePan ? 'disable-pan' : '', "\n            ").concat(disableInteractionPrompt ? 'interaction-prompt="none"' : '', "\n            shadow-intensity=\"1\" camera-controls=\"\" touch-action=\"pan-y\" data-js-focus-visible=\"\" ar-status=\"not-presenting\"\n            >\n                ").concat(items && items.length > 0 ? items.map(function (item, index) {
    var itemPositions = (item.itemPosition || '1,1,1').replaceAll(',', ' ');
    var itemNormalVector = item.itemNormalVector && typeof item.itemNormalVector == 'string' ? item.itemNormalVector.replaceAll(',', ' ') : itemPositions;
    return "\n                    <span class=\"item\" data-itemid=\"".concat(index, "\" slot=\"hotspot-dot-").concat(index, "\" data-position=\"").concat(itemPositions, "\" data-normal=\"").concat(itemNormalVector, "\" data-visibility-attribute=\"visible\" tabindex=\"0\" role=\"button\" aria-label=\"Item ").concat(index + 1, ".\">\n                        ").concat(hidden_items_iconContent(layout), "\n                    </span>\n                    ");
  }).join('') : '', "\n        </model-viewer>\n        ").concat(_build_hidden_items_descriptions(items, layout), "\n    </div>");
  $commonTemplate.find('.layoutContentContainer').html(currentTemplate);
  return $commonTemplate[0].outerHTML;
}

function _build_hidden_items_descriptions(items, layout) {
  var SL = HShell.content.selected_languageObj || {};
  var UI = SL.UI || {};
  var selected_language = HShell && HShell.userData ? HShell.userData.selected_language || 'en' : 'en';
  return "\n        <div class=\"descriptionsContainer\">\n            ".concat(items.map(function (item, index) {
    var itemQuestions = item && item.questions && item.questions.question ? item.questions.question : [];

    if (itemQuestions && !Array.isArray(itemQuestions)) {
      itemQuestions = [itemQuestions];
    }

    var imageUrlOverride = item && item.itemImageUrl && item.itemImageUrl['_mobileOverride'];
    return "\n                <div class=\"itemDescription\" data-itemid=\"".concat(index, "\" style=\"").concat(layout.textColor ? "color: ".concat(layout.textColor, ";") : '', " ").concat(layout.bgColor ? "background-color: ".concat(layout.bgColor, ";") : '', " ").concat(layout.borderColor ? "border-color: ".concat(layout.borderColor, ";") : '', "\">\n                    <div class=\"itemDescriptionTitle\">").concat(item.itemTitle, "</div>\n                    <div class=\"closeBtn\" tabindex=\"0\" role=\"button\" aria-label=\"Close the description.\">").concat(close_icon, "</div>\n                    <div class=\"itemDescriptionText\">").concat(item.itemText, "</div>\n                    ").concat(item.itemImageUrl ? "<div class=\"imageContainer\">\n                        <img class=\"".concat(imageUrlOverride && imageUrlOverride != '' ? 'overridden' : '', "\" src=\"").concat(item.itemImageUrl, "\" alt=\"").concat(item.itemImageUrl ? item.itemImageUrl['_alt'] || '' : '', "\" />\n                        ").concat(imageUrlOverride && imageUrlOverride != '' ? "<img class=\"mobile\" src=\"".concat(imageUrlOverride, "\" alt=\"").concat(item.itemImageUrl['_alt'] || '', "\"/>") : '', "\n                    </div>") : '', "\n                    ").concat(item.itemVideoUrl ? "<div class=\"videoContainer\">\n                        <div class=\"vidPopVideoContainer\">\n                            ".concat("\n                            <div class=\"vidPopVideoInnerContainer\">\n                                <div class=\"playBtnContainer\" ", item.videoThumbUrl ? "style=\"background-image: url('".concat(item.videoThumbUrl, "')\"") : '', " tabindex=\"0\" role=\"button\" aria-label=\"Play the video.\" title=\"").concat(item.videoThumbUrl ? item.videoThumbUrl['_alt'] || '' : '', "\">\n                                    ").concat(playBtn_with_border, "\n                                </div>\n                            </div>\n                            <div class=\"videoFooterContainer\">\n                                <div class=\"vidPopSubtitlesContainer\"></div>\n                                ").concat(HShell.core.getComponent('Video_Footer').init(Object.assign({}, DEFAULT_FOOTER_OPTIONS, {
      transcriptUrl: item.transcriptUrl ? item.transcriptUrl : false
    })), "\n                            </div>\n                        </div>\n                    </div>") : '', "\n                    ").concat(itemQuestions && itemQuestions.length > 0 ? "<div class=\"quizContainer\">\n                        ".concat(itemQuestions.map(function (question, questionIndex) {
      var images = question && question.content && question.content.image ? question.content.image : [];

      if (images && !Array.isArray(images)) {
        images = [images];
      }

      var answers = question.answers.answer;

      if (answers && !Array.isArray(answers)) {
        answers = [answers];
      }

      return "\n                            <div class=\"question\" data-questionIndex=\"".concat(questionIndex, "\">\n                                <div class=\"questionText\">").concat(question.text, "</div>\n                                <div class=\"questionContent\" aria-hidden=\"true\">\n                                    ").concat(images ? images.map(function (image, imageIndex) {
        var imageUrlOverride = image.imageUrl['_mobileOverride'];
        return "\n                                            <div class=\"imageContainer\" data-itemcolor=\"".concat(items && items.itemColor || '', "\">\n                                                <img class=\"").concat(imageUrlOverride && imageUrlOverride != '' ? 'overridden' : '', "\" src=\"content/").concat(selected_language, "/").concat(image.imageUrl, "\" data-imageid=\"").concat(imageIndex, "\" alt=\"").concat(image.imageUrl['_alt'] || '', "\"/>\n                                                ").concat(imageUrlOverride && imageUrlOverride != '' ? "<img class=\"mobile\" src=\"content/".concat(selected_language, "/").concat(imageUrlOverride, "\" data-imageid=\"").concat(imageIndex, "\" alt=\"").concat(image.imageUrl['_alt'] || '', "\"/>") : '', "\n                                            </div>\n                                        ");
      }).join('') : '', "\n                                </div>\n                                <div class=\"questionOptions\" data-selectedbgcolor=\"").concat(item.selectedBgColor ? "".concat(item.selectedBgColor) : '', "\" data-textcolor=\"").concat(item.contentTextColor || '#FFFFFF', "\">\n                                    ").concat(answers.map(function (answer, answerIndex) {
        return "<div class=\"questionAnswer\" style=\"border-color: ".concat(item.contentTextColor || '#FFFFFF', ";\" data-answerid=\"").concat(answerIndex, "\" role=\"checkbox\" aria-checked=\"false\" tabindex=\"0\" aria-label=\"Option ").concat(answerIndex + 1, ". ").concat(answer, "\">\n                                            <span class=\"text\">").concat(answer, "</span>\n                                        </div>");
      }).join(''), "\n                                </div>\n                            </div>");
    }).join(''), "\n                        <div class=\"quizFooter\" data-activeQuestionIndex=\"0\">\n                            <div class=\"button nextBtn disabled desktopButton\" role=\"button\" aria-disabled=\"true\" tabindex=\"0\">").concat(UI.label_Submit, "</div>\n                            <div class=\"readAgain\" role=\"button\" tabindex=\"0\" aria-label=\"Read the feedback again.\">").concat(UI.label_readFeedbackAgain, "</div>\n                            <div class=\"dotsContainer\" data-dotselectedcolor=\"").concat(item.dotSelectedColor || '', "\">\n                                ").concat(itemQuestions.map(function (question, questionIndex) {
      return "\n                                        <span class=\"dot ".concat(questionIndex == 0 ? 'active' : '', "\" style=\"color: ").concat(item.contentTextColor || '#FFFFFF', ";\" data-questionIndex=\"").concat(questionIndex, "\" tabindex=\"0\" role=\"button\" aria-label=\"Question number ").concat(questionIndex + 1, ".\" ").concat(questionIndex == 0 ? '' : 'aria-disabled="true" disabled="true"', ">\n                                            <span class=\"number\">").concat(questionIndex + 1, "</span>\n                                        </span>\n                                    ");
    }).join(''), "\n                            </div>\n                            <div class=\"mobileButtonsContainer\">\n                                <div class=\"button prevBtn disabled\">").concat(UI.previous, "</div>\n                                <div class=\"button nextBtn disabled\">").concat(UI.label_Submit, "</div>\n                            </div>\n                        </div>\n                        <div class=\"feedbackContainer\">\n                            ").concat(itemQuestions.map(function (question, questionIndex) {
      return "\n                                    <div class=\"feedback\" data-questionIndex=\"".concat(questionIndex, "\">\n                                        <div class=\"title\" role=\"heading\" aria-level=\"4\"></div>\n                                        <div class=\"feedbackCloseBtn\" tabindex=\"0\" role=\"button\" aria-label=\"Close the feedback\">").concat(close_icon, "</div>\n                                        <span class=\"text\">").concat(question.feedbackText, "</span>\n                                    </div>\n                                ");
    }).join(''), "\n                        </div>\n                    </div>") : '', "   \n                </div>\n                ");
  }).join(''), "\n        </div>\n    ");
}

function fullscreen_video_template(layout, module, layoutIndex) {
  layout = layout || {};
  module = module || {};
  var $commonTemplate = $(_getCommonTemplate(layout, layoutIndex, 'fullscreen_video_template'));

  var currentTemplate = _getVideoPlayerTemplate(layout, module.mod_id, true, {
    transcriptUrl: layout.transcriptUrl ? layout.transcriptUrl : false
  });

  $commonTemplate.find('.layoutContentContainer').html(currentTemplate);
  return $commonTemplate[0].outerHTML;
}

function small_video_template(layout, module, layoutIndex) {
  layout = layout || {};
  module = module || {};
  var $commonTemplate = $(_getCommonTemplate(layout, layoutIndex, 'small_video_template'));

  var currentTemplate = _getVideoPlayerTemplate(layout, module.mod_id, false, {
    transcriptUrl: layout.transcriptUrl ? layout.transcriptUrl : false
  });

  $commonTemplate.find('.layoutContentContainer').css('background-color', layout.contentBackgroundColor || '#000000').html(currentTemplate);
  return $commonTemplate[0].outerHTML;
}

function two_columns_text_template(layout, module, layoutIndex) {
  layout = layout || {};
  module = module || {};
  var $commonTemplate = $(_getCommonTemplate(layout, layoutIndex, 'two_columns_text_template'));
  var leftColumnBgColor = layout.leftColumnBackgroundColor || '#FFF';
  var leftColumnTextColor = layout.leftColumnTextColor || '#000';
  var rightColumnBgColor = layout.rightColumnBackgroundColor || '#000';
  var rightColumnTextColor = layout.rightColumnTextColor || '#FFF';
  var currentTemplate = "\n    <div class=\"layoutTemplateContentContainer\" data-moduleId=\"".concat(module.mod_id, "\">\n        <div class=\"leftColumnContainer columnContainer\" style=\"background-color: ").concat(leftColumnBgColor, ";\">\n            <span class=\"text\" style=\"color: ").concat(leftColumnTextColor, ";\">").concat(layout.leftColumnContent, "</span>\n        </div>\n        <div class=\"rightColumnContainer columnContainer\" style=\"background-color: ").concat(rightColumnBgColor, ";\">\n            <span class=\"text\" style=\"color: ").concat(rightColumnTextColor, ";\">").concat(layout.rightColumnContent, "</span>\n        </div>\n    </div>\n    ");
  $commonTemplate.find('.layoutContentContainer').html(currentTemplate);
  return $commonTemplate[0].outerHTML;
}

function text_and_image_template(layout, module, layoutIndex) {
  layout = layout || {};
  module = module || {};
  var selected_language = HShell && HShell.userData ? HShell.userData.selected_language || 'en' : 'en';
  var $commonTemplate = $(_getCommonTemplate(layout, layoutIndex, 'text_and_image_template'));
  var rows = layout.rows.row;

  if (rows && !Array.isArray(rows)) {
    rows = [rows];
  }

  var currentTemplate = "\n    <div class=\"layoutTemplateContentContainer\" data-moduleId=\"".concat(module.mod_id, "\">\n        ").concat(rows.map(function (row) {
    var backgroundColor = row.backgroundColor || '#FFF';
    var textColor = row.textColor || '#000';
    return "\n            <div class=\"row\" style=\"background-color: ".concat(backgroundColor, ";\">\n                <div class=\"rowContent\">\n                    <div class=\"leftColumnContainer ").concat(row.imageOnTheLeft == 'true' ? 'image' : 'text', "\">\n                        ").concat(row.imageOnTheLeft == 'true' ? "<span class=\"imageContainer\" aria-hidden=\"true\"><img src=\"content/".concat(selected_language, "/").concat(row.imageUrl, "\" alt=\"").concat(row.imageUrl['_alt'] || '', "\" /></span>") : "<span class=\"text\" style=\"color: ".concat(textColor, ";\">").concat(row.text, "</span>"), "\n                    </div>\n                    <div class=\"rightColumnContainer ").concat(row.imageOnTheLeft == 'true' ? 'text' : 'image', "\">\n                        ").concat(row.imageOnTheLeft == 'true' ? "<span class=\"text\" style=\"color: ".concat(textColor, "\">").concat(row.text, "</span>") : "<span class=\"imageContainer\" aria-hidden=\"true\"><img src=\"content/".concat(selected_language, "/").concat(row.imageUrl, "\" alt=\"").concat(row.imageUrl['_alt'] || '', "\" /></span>"), "\n                    </div>\n                    <div class=\"mobileContentContainer\" aria-hidden=\"true\">\n                        <span class=\"text\" style=\"color: ").concat(textColor, "\">").concat(row.text, "</span>\n                        <span class=\"imageContainer\"><img src=\"content/").concat(selected_language, "/").concat(row.imageUrl, "\" alt=\"").concat(row.imageUrl['_alt'] || '', "\"/></span>\n                    </div>\n                </div>\n            </div>    \n            ");
  }).join(''), "\n    </div>\n    ");
  $commonTemplate.find('.layoutContentContainer').html(currentTemplate);
  return $commonTemplate[0].outerHTML;
}

function fullscreen_text_and_image_template(layout, module, layoutIndex) {
  layout = layout || {};
  module = module || {};
  var selected_language = HShell && HShell.userData ? HShell.userData.selected_language || 'en' : 'en';
  var $commonTemplate = $(_getCommonTemplate(layout, layoutIndex, 'fullscreen_text_and_image_template', true));
  var backgroundImageUrl = layout.backgroundImageUrl || '';
  var title = layout.titleMain || '';
  var titleColor = layout.titleTextColor || '#FFFFFF';
  var text = layout.text || '';
  var textColor = layout.textColor || '#FFFFFF';
  var currentTemplate = "\n    <div class=\"layoutTemplateContentContainer\" data-moduleId=\"".concat(module.mod_id, "\">\n        <div class=\"contentContainer\" title=\"").concat(backgroundImageUrl ? backgroundImageUrl['_alt'] || '' : '', "\" ").concat(backgroundImageUrl ? "style=\"background-image: url('content/".concat(selected_language, "/").concat(backgroundImageUrl, "')\"") : '', ">\n            <div class=\"title\" style=\"color: ").concat(titleColor, ";\" role=\"heading\" aria-level=\"2\">").concat(title, "</div>\n            <div class=\"text\" style=\"color: ").concat(textColor, ";\">").concat(text, "</div>\n        </div>\n    </div>\n    ");
  $commonTemplate.find('.layoutContentContainer').html(currentTemplate);
  return $commonTemplate[0].outerHTML;
}

function quiz_images_template(layout, module, layoutIndex) {
  layout = layout || {};
  module = module || {};
  var SL = HShell.content.selected_languageObj || {};
  var UI = SL.UI || {};
  var selected_language = HShell && HShell.userData ? HShell.userData.selected_language || 'en' : 'en';
  var $commonTemplate = $(_getCommonTemplate(layout, layoutIndex, 'quiz_images_template'));
  var questions = layout.questions.question;

  if (questions && !Array.isArray(questions)) {
    questions = [questions];
  }

  var currentTemplate = "\n    <div class=\"layoutTemplateContentContainer\" style=\"color: ".concat(layout.contentTextColor || '#FFFFFF', ";\" data-moduleId=\"").concat(module.mod_id, "\">\n        ").concat(questions.map(function (question, questionIndex) {
    var videos = question.content.video;

    if (videos && !Array.isArray(videos)) {
      videos = [videos];
    }

    var images = question.content.image;

    if (images && !Array.isArray(images)) {
      images = [images];
    }

    var answers = question.answers.answer;

    if (answers && !Array.isArray(answers)) {
      answers = [answers];
    }

    return "\n            <div class=\"question\" data-questionIndex=\"".concat(questionIndex, "\">\n                <div class=\"questionText\">").concat(question.text, "</div>\n                <div class=\"questionContent\" aria-hidden=\"true\">\n                    ").concat(images ? images.map(function (image, imageIndex) {
      var items = image.items && image.items.item || [];

      if (items && !Array.isArray(items)) {
        items = [items];
      }

      var imageUrlOverride = image.imageUrl['_mobileOverride'];
      return "\n                            <div class=\"imageContainer\" data-itemcolor=\"".concat(items && items.itemColor || '', "\">\n                                <img class=\"").concat(imageUrlOverride && imageUrlOverride != '' ? 'overridden' : '', "\" src=\"content/").concat(selected_language, "/").concat(image.imageUrl, "\" data-imageid=\"").concat(imageIndex, "\" alt=\"").concat(image.imageUrl['_alt'] || '', "\"/>\n                                ").concat(imageUrlOverride && imageUrlOverride != '' ? "<img class=\"mobile\" src=\"content/".concat(selected_language, "/").concat(imageUrlOverride, "\" data-imageid=\"").concat(imageIndex, "\" alt=\"").concat(image.imageUrl['_alt'] || '', "\"/>") : '', "\n                                ").concat(items && items.map(function (item, index) {
        var itemPositions = (item.itemPosition.toString() || '0,0').split(',');
        var itemPositionsOverride = item.itemPosition['_mobileOverride'];
        itemPositionsOverride = itemPositionsOverride != '' ? itemPositionsOverride.split(',') : '';
        return "\n                                        ".concat(quiz_images_template_buildPointOfInterest(index, questionIndex, imageIndex, itemPositions, image.items.itemColor, itemPositionsOverride && itemPositionsOverride != '' ? 'overridden' : ''), "\n                                        ").concat(itemPositionsOverride ? quiz_images_template_buildPointOfInterest(index, questionIndex, imageIndex, itemPositionsOverride, image.items.itemColor, 'mobile') : '', "\n                                    ");
      }).join(''), "\n                            </div>\n                        ");
    }).join('') : '', "\n                    ").concat(videos ? videos.map(function (video, imageIndex) {
      if (!video) return ''; // var interactions = video.interactions && video.interactions.interaction;
      // if (interactions && !Array.isArray(interactions)) {
      //     interactions = [interactions];
      // }

      return "<div class=\"vidPopVideoContainer\">\n                                    ".concat("\n                                    <div class=\"vidPopVideoInnerContainer\">\n                                        <div class=\"playBtnContainer\" tabindex=\"0\" role=\"button\" aria-label=\"Play the video.\">\n                                            ", playBtn_with_border, "\n                                        </div>\n                                    </div>\n                                    <div class=\"videoFooterContainer\">\n                                        <div class=\"vidPopSubtitlesContainer\"></div>\n                                        ").concat(HShell.core.getComponent('Video_Footer').init(Object.assign({}, DEFAULT_FOOTER_OPTIONS, {
        transcriptUrl: video.transcriptUrl ? video.transcriptUrl : false
      })), "\n                                    </div>\n                                </div>");
    }).join('') : '', "\n                </div>\n                <div class=\"questionOptions\" data-selectedbgcolor=\"").concat(layout.selectedBgColor ? "".concat(layout.selectedBgColor) : '', "\" data-textcolor=\"").concat(layout.contentTextColor || '#FFFFFF', "\">\n                    ").concat(answers.map(function (answer, answerIndex) {
      return "<div class=\"questionAnswer\" style=\"border-color: ".concat(layout.contentTextColor || '#FFFFFF', ";\" data-answerid=\"").concat(answerIndex, "\" role=\"checkbox\" aria-checked=\"false\" tabindex=\"0\" aria-label=\"Option ").concat(answerIndex + 1, ". ").concat(answer, "\">\n                            <span class=\"text\">").concat(answer, "</span>\n                        </div>");
    }).join(''), "\n                </div>\n            </div>\n            ");
  }).join(''), "\n        <div class=\"itemsDescriptionsContainer\">\n            ").concat(questions.map(function (question, questionIndex) {
    var images = question.content.image;

    if (images && !Array.isArray(images)) {
      images = [images];
    }

    return "\n                    ".concat(images ? images.map(function (image, imageIndex) {
      var items = image.items && image.items.item || [];

      if (items && !Array.isArray(items)) {
        items = [items];
      }

      return items && items.length > 0 ? items.map(function (item, index) {
        return "\n                                <div class=\"itemDescription\" data-itemid=\"".concat(questionIndex, "-").concat(imageIndex, "-").concat(index, "\" style=\"").concat(image.items.textColor ? "color: ".concat(image.items.textColor, ";") : '', " ").concat(image.items.bgColor ? "background-color: ".concat(image.items.bgColor, ";") : '', " ").concat(image.items.borderColor ? "border-color: ".concat(image.items.borderColor, ";") : '', "\">\n                                    <div class=\"itemDescriptionTitle\">").concat(item.itemTitle, "</div>\n                                    <div class=\"closeBtn\" tabindex=\"0\" role=\"button\" aria-label=\"Close the description.\">").concat(close_icon, "</div>\n                                    <div class=\"itemDescriptionText\">").concat(item.itemText, "</div>\n                                </div>\n                                ");
      }).join('') : '';
    }).join('') : '', "\n                ");
  }).join(''), "\n        </div>\n        <div class=\"quizFooter\" data-activeQuestionIndex=\"0\">\n            <div class=\"button nextBtn disabled desktopButton\" role=\"button\" aria-disabled=\"true\" tabindex=\"0\">").concat(UI.label_Submit, "</div>\n            <div class=\"readAgain\" role=\"button\" tabindex=\"0\" aria-label=\"Read the feedback again.\">").concat(UI.label_readFeedbackAgain, "</div>\n            <div class=\"dotsContainer\" data-dotselectedcolor=\"").concat(layout.dotSelectedColor || '', "\">\n                ").concat(questions && questions.length > 1 ? questions.map(function (question, questionIndex) {
    return "\n                        <span class=\"dot ".concat(questionIndex == 0 ? 'active' : '', "\" style=\"color: ").concat(layout.contentTextColor || '#FFFFFF', ";\" data-questionIndex=\"").concat(questionIndex, "\" tabindex=\"0\" role=\"button\" aria-label=\"Question number ").concat(questionIndex + 1, ".\" ").concat(questionIndex == 0 ? '' : 'aria-disabled="true" disabled="true"', ">\n                            <span class=\"number\">").concat(questionIndex + 1, "</span>\n                        </span>\n                    ");
  }).join('') : '', "\n            </div>\n            <div class=\"mobileButtonsContainer\">\n                <div class=\"button prevBtn disabled\">").concat(UI.previous, "</div>\n                <div class=\"button nextBtn disabled\">").concat(UI.label_Submit, "</div>\n            </div>\n        </div>\n        <div class=\"feedbackContainer\">\n            ").concat(questions.map(function (question, questionIndex) {
    return "\n                    <div class=\"feedback\" data-questionIndex=\"".concat(questionIndex, "\">\n                        <div class=\"title\" role=\"heading\" aria-level=\"4\"></div>\n                        <div class=\"feedbackCloseBtn\" tabindex=\"0\" role=\"button\" aria-label=\"Close the feedback\">").concat(close_icon, "</div>\n                        <span class=\"text\">").concat(question.feedbackText, "</span>\n                    </div>\n                ");
  }).join(''), "\n        </div>\n    </div>\n    ");
  $commonTemplate.find('.layoutContentContainer').css('background-color', layout.contentBackgroundColor || '#000000').html(currentTemplate);
  return $commonTemplate[0].outerHTML;
}

function quiz_images_template_buildPointOfInterest(itemId, questionIndex, imageId, itemPositions, itemColor, additionalClasses) {
  return "\n        <span class=\"item ".concat(additionalClasses, "\" style=\"top: ").concat(itemPositions[0], "%; left: ").concat(itemPositions[1], "%;\" data-itemid=\"").concat(questionIndex, "-").concat(imageId, "-").concat(itemId, "\" tabindex=\"0\" role=\"button\" aria-label=\"Item ").concat(itemId + 1, " of Image ").concat(imageId + 1, ".\">\n            <span class=\"icon\" aria-hidden=\"true\">\n                <span class=\"tick\">").concat(tick_icon, "</span>\n                <span class=\"plus\">").concat(plus_icon, "</span>\n            </span>\n            <span class=\"border\" aria-hidden=\"true\" style=\"").concat(itemColor ? "border-color: ".concat(itemColor, ";") : '', "\"></span>\n        </span>\n    ");
}

function horizontal_tabs_template(layout, module, layoutIndex) {
  layout = layout || {};
  module = module || {};
  var $commonTemplate = $(_getCommonTemplate(layout, layoutIndex, 'horizontal_tabs_template', false, '#FFF'));
  var tabs = layout.tabs.tab;

  if (tabs && !Array.isArray(tabs)) {
    tabs = [tabs];
  }

  var selected_language = HShell && HShell.userData ? HShell.userData.selected_language || 'en' : 'en';
  var currentTemplate = "\n    <div class=\"layoutTemplateContentContainer\" data-moduleId=\"".concat(module.mod_id, "\">\n        <div class=\"tabsNavigation\" data-selectedbgcolor=\"").concat(layout.selectedBgColor ? "".concat(layout.selectedBgColor) : '', "\" data-selectedtextcolor=\"").concat(layout.selectedTextColor ? "".concat(layout.selectedTextColor) : '', "\" data-textcolor=\"").concat(layout.tabTextColor ? "".concat(layout.tabTextColor) : '', "\">\n            ").concat(tabs.length > 3 ? "<div class=\"tabsNavButtons\">\n                    <div class=\"back\" tabindex=\"-1\" aria-hidden=\"true\"><span class=\"iconContainer\">".concat(arrow_right_icon, "</span></div>\n                    <div class=\"forward\" tabindex=\"-1\" aria-hidden=\"true\"><span class=\"iconContainer\">").concat(arrow_right_icon, "</span></div>\n                </div>") : '', "\n            <div class=\"tabsContainer ").concat(tabs.length > 3 ? 'multipleTabs' : '', "\">\n                ").concat(tabs.map(function (tab, index) {
    return "\n                    <div class=\"tabNavElement ".concat(index === 0 ? 'active' : '', "\" style=\"").concat(layout.tabTextColor ? "color: ".concat(layout.tabTextColor, ";") : '', "\" data-tabindex=\"").concat(index, "\" tabindex=\"0\" role=\"button\" aria-pressed=\"false\" aria-label=\"Tab ").concat(index + 1, " out of ").concat(tabs.length, ". ").concat(tab.tabTitle, "\">").concat(tab.tabTitle, "</div>\n                    ");
  }).join(''), "\n            </div>\n        </div>\n        ").concat(tabs.map(function (tab, index) {
    var interactions = tab.interactions && tab.interactions.interaction;

    if (interactions && !Array.isArray(interactions)) {
      interactions = [interactions];
    }

    return "\n            <span class=\"tabNavElementMobile ".concat(index === 0 ? 'active' : '', "\" style=\"").concat(layout.tabTextColor ? "color: ".concat(layout.tabTextColor, ";") : '', " ").concat(layout.selectedBgColor ? "border-color: ".concat(layout.selectedBgColor, ";") : '', "\" data-tabindex=\"").concat(index, "\" tabindex=\"0\" role=\"button\" aria-pressed=\"false\" aria-label=\"Tab ").concat(index + 1, " out of ").concat(tabs.length, ". ").concat(tab.tabTitle, "\">").concat(tab.tabTitle, "</span>\n            <div class=\"tabContent\" data-tabindex=\"").concat(index, "\">\n                <div class=\"textContainer\">").concat(tab.tabText, "</div>\n                <div class=\"additionalContentContainer\">\n                    ").concat(tab.imageUrl ? "<span class=\"imageContainer\"><img src=\"content/".concat(selected_language, "/").concat(tab.imageUrl, "\" alt=\"").concat(tab.imageUrl['_alt'] || '', "\" /></span>") : '', "\n                    ").concat(tab.videoUrl ? "<div class=\"vidPopVideoContainer\">\n                            ".concat(_video_buildInteractions(interactions), "\n                            <div class=\"vidPopVideoInnerContainer\">\n                            <div class=\"playBtnContainer\" ").concat(tab.videoThumbUrl ? "style=\"background-image: url('".concat(tab.videoThumbUrl, "')\"") : '', " tabindex=\"0\" role=\"button\" aria-label=\"Play the video.\" title=\"").concat(tab.videoThumbUrl ? tab.videoThumbUrl['_alt'] || '' : '', "\">\n                                ").concat(playBtn_with_border, "\n                            </div>\n                            </div>\n                            <div class=\"videoFooterContainer\">\n                                <div class=\"vidPopSubtitlesContainer\"></div>\n                                ").concat(HShell.core.getComponent('Video_Footer').init(Object.assign({}, DEFAULT_FOOTER_OPTIONS, {
      transcriptUrl: tab.transcriptUrl ? tab.transcriptUrl : false
    })), "\n                            </div>\n                        </div>") : '', "\n                </div>\n            </div>    \n            ");
  }).join(''), "\n    </div>\n    ");
  $commonTemplate.find('.layoutContentContainer').html(currentTemplate);
  return $commonTemplate[0].outerHTML;
}

function vertical_tabs_template(layout, module, layoutIndex) {
  layout = layout || {};
  module = module || {};
  var $commonTemplate = $(_getCommonTemplate(layout, layoutIndex, 'vertical_tabs_template', true));
  var tabs = layout.tabs.tab;

  if (tabs && !Array.isArray(tabs)) {
    tabs = [tabs];
  }

  var selected_language = HShell && HShell.userData ? HShell.userData.selected_language || 'en' : 'en';
  var currentTemplate = "\n    <div class=\"layoutTemplateContentContainer\" data-moduleId=\"".concat(module.mod_id, "\"\n        title=\"").concat(layout.backgroundImageUrl ? layout.backgroundImageUrl['_alt'] || '' : '', "\"\n        style=\"").concat(layout.backgroundImageUrl ? "background-image: url('content/".concat(selected_language, "/").concat(layout.backgroundImageUrl, "');") : '', " ").concat(layout.contentBackgroundColor ? "background-color: ".concat(layout.contentBackgroundColor, ";") : '', "\">\n        ").concat(layout.titleMain || layout.titleSub ? _layoutTitle_template(layout.titleMain, layout.titleSub, layout.titleTextColor, layout.titleBackgroundColor || 'none') : '', "\n        <div class=\"tabsContainer\">\n            <div class=\"tabsNavigation\" data-selectedbgcolor=\"").concat(layout.selectedBgColor ? "".concat(layout.selectedBgColor) : '', "\" data-selectedtextcolor=\"").concat(layout.selectedTextColor ? "".concat(layout.selectedTextColor) : '', "\">    \n                ").concat(tabs.map(function (tab, tabIndex) {
    return "\n                    <div class=\"tabNavElement\" data-tabIndex=\"".concat(tabIndex, "\" tabindex=\"0\" role=\"button\" aria-pressed=\"false\" aria-label=\"Tab ").concat(tabIndex + 1, " out of ").concat(tabs.length, ". ").concat(tab.tabTitle, "\">").concat(tab.tabTitle, "</div>\n                    ");
  }).join(''), "\n            </div>\n            ").concat(tabs.map(function (tab, tabIndex) {
    return "\n                <span class=\"tabNavElementMobile\" style=\"".concat(layout.tabTextColor ? "color: ".concat(layout.tabTextColor, ";") : '', " ").concat(layout.selectedBgColor ? "border-color: ".concat(layout.selectedBgColor, ";") : '', "\" data-tabIndex=\"").concat(tabIndex, "\" tabindex=\"0\" role=\"button\" aria-pressed=\"false\" aria-label=\"Tab ").concat(tabIndex + 1, " out of ").concat(tabs.length, ". ").concat(tab.tabTitle, "\">").concat(tab.tabTitle, "</span>\n                <div class=\"tabContent\" data-tabindex=\"").concat(tabIndex, "\">\n                    <div class=\"textContainer\">").concat(tab.tabText, "</div>\n                </div>    \n                ");
  }).join(''), "\n        </div>\n    </div>\n    ");
  $commonTemplate.find('.layoutContentContainer').html(currentTemplate);
  return $commonTemplate[0].outerHTML;
}

function sequence_template(layout, module, layoutIndex) {
  layout = layout || {};
  module = module || {};
  var SL = HShell.content.selected_languageObj || {};
  var UI = SL.UI || {};
  var $commonTemplate = $(_getCommonTemplate(layout, layoutIndex, 'sequence_template'));
  var tabs = layout.tabs.tab;

  if (tabs && !Array.isArray(tabs)) {
    tabs = [tabs];
  }

  var selected_language = HShell && HShell.userData ? HShell.userData.selected_language || 'en' : 'en';
  var currentTemplate = "\n    <div class=\"layoutTemplateContentContainer\" data-moduleId=\"".concat(module.mod_id, "\">\n        ").concat(tabs.map(function (tab, tabIndex) {
    var tabQuestion = tab.question || tab.questionShort || tab.questionMultiple;
    var answers = tabQuestion && tabQuestion.answer;

    if (answers && !Array.isArray(answers)) {
      answers = [answers];
    }

    var interactions = tab.interactions && tab.interactions.interaction;

    if (interactions && !Array.isArray(interactions)) {
      interactions = [interactions];
    }

    return "\n            <span class=\"dotMobile\" data-tabindex=\"".concat(tabIndex, "\">\n                <span>").concat(tabIndex + 1, "</span>\n                ").concat(tab.mobileText ? "<span class=\"mobileText\" style=\"color: ".concat(tab.mobileText['_color'] || 'white', "\">").concat(tab.mobileText, "</span>") : '', "\n            </span>\n            <div class=\"tabContent\" data-tabindex=\"").concat(tabIndex, "\">\n                ").concat(tab.imageUrl ? "<div class=\"imageContainer\"><img src=\"content/".concat(selected_language, "/").concat(tab.imageUrl, "\" alt=\"").concat(tab.imageUrl ? tab.imageUrl['_alt'] || '' : '', "\" /></div>") : '', "    \n                ").concat(tab.text ? "<div class=\"textContainer\">".concat(tab.text, "</div>") : '', "\n                ").concat(tabQuestion && answers && answers.length > 0 ? "\n                    <div class=\"questionContainer ".concat(tab.questionShort ? 'short' : '', " ").concat(tab.questionMultiple ? 'multiple' : '', "\">\n                        <div class=\"questionTextContainer\" style=\"").concat(tabQuestion.bgColor ? "background-color: ".concat(tabQuestion.bgColor, ";") : '', " ").concat(tabQuestion.textColor ? "color: ".concat(tabQuestion.textColor, ";") : '', "\">").concat(tabQuestion.text, "</div>\n                        <div class=\"answersContainer\">\n                            ").concat(answers.map(function (answer, answerId) {
      return "<div class=\"answer\" data-answerid=\"".concat(answerId, "\" tabindex=\"0\" aria-label=\"Option ").concat(answerId + 1, ". ").concat(answer, "\">").concat(answer, "</div>");
    }).join(''), "\n                        </div>\n                        <div style=\"").concat(tabQuestion.btnBgColor ? "background-color: ".concat(tabQuestion.btnBgColor, ";") : '', " ").concat(tabQuestion.btnTextColor ? "color: ".concat(tabQuestion.btnTextColor, ";") : '', "\" class=\"continueBtn disabled\" disabled=\"true\" aria-disabled=\"true\" tabindex=\"0\" role=\"button\">").concat(UI.confirm, "</div>\n                    </div>\n                    ") : '', "\n                ").concat(tab.videoUrl ? "<div class=\"vidPopVideoContainer\">\n                        ".concat(_video_buildInteractions(interactions), "\n                        <div class=\"vidPopVideoInnerContainer\">\n                            <div class=\"playBtnContainer\" ").concat(tab.videoThumbUrl ? "style=\"background-image: url('".concat(tab.videoThumbUrl, "')\"") : '', " tabindex=\"0\" role=\"button\" aria-label=\"Play the video.\" title=\"").concat(tab.videoThumbUrl ? tab.videoThumbUrl['_alt'] || '' : '', "\">\n                                ").concat(playBtn_with_border, "\n                            </div>\n                        </div>\n                        <div class=\"videoFooterContainer\">\n                            <div class=\"vidPopSubtitlesContainer\"></div>\n                            ").concat(HShell.core.getComponent('Video_Footer').init(Object.assign({}, DEFAULT_FOOTER_OPTIONS, {
      transcriptUrl: tab.transcriptUrl ? tab.transcriptUrl : false
    })), "\n                        </div>\n                    </div>") : '', "\n            </div>    \n            ");
  }).join(''), "\n        <div class=\"dotsContainer\" data-dotselectedcolor=\"").concat(layout.dotSelectedColor || '', "\">    \n            ").concat(tabs.map(function (tab, tabIndex) {
    return "\n                <div class=\"dot\" data-tabindex=\"".concat(tabIndex, "\" tabindex=\"0\" role=\"button\" ").concat(tabIndex > 0 ? 'disabled="true" aria-disabled="true"' : '', " aria-label=\"Tab ").concat(tabIndex + 1, ".\"><span class=\"number\" aria-hidden=\"true\">").concat(tabIndex + 1, "</span></div>\n                ");
  }).join(''), "\n        </div>\n    </div>\n    ");
  $commonTemplate.find('.layoutContentContainer').css('background-color', layout.contentBackgroundColor || '#000000').html(currentTemplate);
  return $commonTemplate[0].outerHTML;
}

function icons_discover_template(layout, module, layoutIndex) {
  layout = layout || {};
  module = module || {};
  var $commonTemplate = $(_getCommonTemplate(layout, layoutIndex, 'icons_discover_template'));
  var icons = layout.icons.icon;

  if (icons && !Array.isArray(icons)) {
    icons = [icons];
  }

  var selected_language = HShell && HShell.userData ? HShell.userData.selected_language || 'en' : 'en';
  var currentTemplate = "\n    <div class=\"layoutTemplateContentContainer\" data-moduleId=\"".concat(module.mod_id, "\">\n        ").concat(icons.map(function (icon, iconIndex) {
    return "\n            <span class=\"tabNavElementMobile\" style=\"background-color: ".concat(layout.contentBackgroundColor || '', "\" data-tabindex=\"").concat(iconIndex, "\" tabindex=\"0\" role=\"button\" aria-pressed=\"false\" aria-label=\"Item ").concat(iconIndex + 1, " out of ").concat(icons.length, ".\">\n                <img src=\"content/").concat(selected_language, "/").concat(icon.imageUrl, "\" alt=\"").concat(icon.imageUrl ? icon.imageUrl['_alt'] || '' : '', "\" />\n            </span>\n            <div class=\"tabContent\" data-tabindex=\"").concat(iconIndex, "\">\n                <div class=\"textContainer\">").concat(icon.text, "</div>\n            </div>    \n            ");
  }).join(''), "\n        <div class=\"tabsNavigation\" data-selectedbgcolor=\"").concat(layout.selectedBgColor ? "".concat(layout.selectedBgColor) : '', "\" data-bgcolor=\"").concat(layout.contentBackgroundColor || '', "\">    \n            ").concat(icons.map(function (icon, iconIndex) {
    return "\n                <div class=\"tabNavElement\" style=\"background-color: ".concat(layout.contentBackgroundColor || '', "\" data-tabindex=\"").concat(iconIndex, "\" tabindex=\"0\" role=\"button\" aria-pressed=\"false\" aria-label=\"Item ").concat(iconIndex + 1, " out of ").concat(icons.length, ".\">\n                    <img src=\"content/").concat(selected_language, "/").concat(icon.imageUrl, "\" alt=\"").concat(icon.imageUrl ? icon.imageUrl['_alt'] || '' : '', "\" aria-hidden=\"true\" />\n                </div>\n                ");
  }).join(''), "\n        </div>\n    </div>\n    ");
  $commonTemplate.find('.layoutContentContainer').css('background-color', layout.contentBackgroundColor || '').html(currentTemplate);
  return $commonTemplate[0].outerHTML;
}

function hidden_items_template(layout, module, layoutIndex) {
  layout = layout || {};
  module = module || {};
  var $commonTemplate = $(_getCommonTemplate(layout, layoutIndex, 'hidden_items_template'));
  var items = layout.items && layout.items.item;

  if (items && !Array.isArray(items)) {
    items = [items];
  } else if (!items) {
    items = [];
  }

  var SL = HShell.content.selected_languageObj || {};
  var UI = SL.UI || {};
  var selected_language = HShell && HShell.userData ? HShell.userData.selected_language || 'en' : 'en';
  var currentTemplate = "\n    <div class=\"layoutTemplateContentContainer\" data-moduleId=\"".concat(module.mod_id, "\" data-itemcolor=\"").concat(layout.itemColor || '', "\">\n        <div class=\"imageContainer ").concat(layout.image360Url ? 'panorama' : '', " ").concat(layout.video360Url ? 'panorama_video' : '', "\">\n            ").concat(layout.imageUrl ? "\n                <img src=\"content/".concat(selected_language, "/").concat(layout.imageUrl, "\" alt=\"").concat(layout.imageUrl['_alt'] || '', "\" />\n                ").concat(items && items.map(function (item, index) {
    var itemPositions = (item.itemPosition || '0,0').split(',');
    return "\n                    <span class=\"item\" style=\"top: ".concat(itemPositions[0], "%; left: ").concat(itemPositions[1], "%;\" data-itemid=\"").concat(index, "\" tabindex=\"0\" role=\"button\" aria-label=\"Item ").concat(index + 1, ".\">\n                        ").concat(hidden_items_iconContent(layout), "\n                    </span>\n                    ");
  }).join('')) : '', "\n            ").concat(layout.image360Url ? "\n                <div class=\"panoramaCoverContainer\">\n                    <div class=\"panoramaCover\">\n                        <div class=\"icon\">".concat(panorama_cover_icon, "</div>\n                        <div class=\"title\">").concat(layout.image360CoverText, "</div>\n                        <div class=\"startButton\" tabindex=\"0\" role=\"button\">").concat(UI.image360StartBtn, "</div>\n                    </div>\n                </div>\n                <div id=\"panorama_image_").concat(layoutIndex, "\" class=\"panoramaImage\"></div>\n                ") : '', "\n            ").concat(layout.video360Url ? "\n                <div class=\"panoramaCoverContainer\" ".concat(layout.video360ThumbUrl ? "style=\"background: none\"" : '', ">\n                    <div class=\"panoramaCover\">\n                        <div class=\"icon\">").concat(panorama_cover_icon, "</div>\n                        <div class=\"title\">").concat(layout.video360CoverText, "</div>\n                        <div class=\"startVideoButton\" tabindex=\"0\" role=\"button\">").concat(UI.image360StartBtn, "</div>\n                    </div>\n                </div>\n                <div id=\"panorama_video_").concat(layoutIndex, "\" class=\"panoramaVideo\">\n                    <div class=\"vidPopVideoContainer\">\n                        <div class=\"vidPopVideoInnerContainer\">\n                            <div class=\"playBtnContainer\" ").concat(layout.video360ThumbUrl ? "style=\"background-image: url('".concat(layout.video360ThumbUrl, "')\"") : '', " tabindex=\"0\" role=\"button\" aria-label=\"Play the video.\" title=\"").concat(layout.video360ThumbUrl ? layout.video360ThumbUrl['_alt'] || '' : '', "\">\n                                ", "\n                            </div>\n                        </div>\n                        <div class=\"videoFooterContainer\">\n                            <div class=\"vidPopSubtitlesContainer\"></div>\n                            ").concat(HShell.core.getComponent('Video_Footer').init(Object.assign({}, DEFAULT_FOOTER_OPTIONS, {
    transcriptUrl: layout.transcriptUrl ? layout.transcriptUrl : false
  })), "\n                        </div>\n                    </div>\n                </div>\n                ") : '', "\n        </div>\n        ").concat(_build_hidden_items_descriptions(items, layout), "\n    </div>\n    ");
  $commonTemplate.find('.layoutContentContainer').css('background-color', layout.contentBackgroundColor || '#000000').html(currentTemplate);

  if (layout.image360Url) {
    $commonTemplate.addClass('image_360');
  }

  if (layout.video360Url) {
    $commonTemplate.addClass('video_360');
  }

  return $commonTemplate[0].outerHTML;
}

function hidden_items_iconContent(layout) {
  return "\n    <span class=\"icon\" aria-hidden=\"true\">\n        <span class=\"tick\">".concat(tick_icon, "</span>\n        <span class=\"plus\">").concat(plus_icon, "</span>\n    </span>\n    <span class=\"border\" aria-hidden=\"true\" style=\"").concat(layout.itemColor ? "border-color: ".concat(layout.itemColor, ";") : '', "\"></span>\n    ");
}

function _getVideoPlayerTemplate(layout, moduleId, isFullWidth, footerOptions) {
  var footerOptions = Object.assign({}, DEFAULT_FOOTER_OPTIONS, footerOptions);
  var interactions = layout.interactions && layout.interactions.interaction;

  if (interactions && !Array.isArray(interactions)) {
    interactions = [interactions];
  }

  return "\n    <div class=\"videoPopUp ".concat(isFullWidth ? 'fullWidthVideo' : '', " layoutTemplateContentContainer layoutTemplateVideoContainer\" data-moduleid=\"").concat(moduleId, "\">\n        <div class=\"vidPopVideoContainer\">\n            ").concat(_video_buildInteractions(interactions), "\n            <div class=\"vidPopVideoInnerContainer\">\n                <div class=\"playBtnContainer\" ").concat(layout.videoThumbUrl ? "style=\"background-image: url('".concat(layout.videoThumbUrl, "')\"") : '', "  tabindex=\"0\" role=\"button\" aria-label=\"Play the video.\">\n                    ").concat(playBtn_with_border, "\n                </div>\n            </div>\n            <div class=\"videoFooterContainer\">\n                <div class=\"vidPopSubtitlesContainer\"></div>\n                ").concat(HShell.core.getComponent('Video_Footer').init(footerOptions), "\n            </div>\n        </div>\n\n    </div>\n    ");
}

function _video_buildInteractions(interactions) {
  return "".concat(interactions && interactions.length > 0 ? "\n        <div class=\"interactionPointsContainer\">\n            ".concat(interactions.map(function (interaction, index) {
    return "<div class=\"interactionPoint ".concat(interaction.type, "\" data-interactionid=\"").concat(index, "\">\n                        ").concat(videoInteractions["_video_getInteractionTemplate_".concat(interaction.type)](interaction), "\n                    </div>");
  }).join(''), "\n        </div>") : '');
}

function _video_getInteractionTemplate_discover(interaction) {
  return "\n        <span class=\"iconContainer\" role=\"button\" tabindex=\"-1\" aria-label=\"".concat(interaction.interactionText, "\">\n            <span class=\"icon\" aria-hidden=\"true\">\n                <span class=\"plus\" aria-hidden=\"true\">").concat(plus_icon, "</span>\n                <span class=\"border\" aria-hidden=\"true\" style=\"").concat(interaction.borderColor ? "border-color: ".concat(interaction.borderColor, ";") : '', "\"></span>\n            </span>\n            <div class=\"interactionText\" aria-hidden=\"true\">").concat(interaction.interactionText, "</div>\n        </span>\n        <div class=\"descriptionContainer\">\n            <div class=\"description\" style=\"").concat(interaction.bgColor ? "background-color: ".concat(interaction.bgColor, ";") : '', " ").concat(interaction.borderColor ? "border-color: ".concat(interaction.borderColor, ";") : '', " ").concat(interaction.textColor ? "color: ".concat(interaction.textColor, ";") : '', "\">\n                <div class=\"title\" role=\"heading\" aria-level=\"3\">").concat(interaction.descriptionTitle, "</div>\n                <div class=\"text\">").concat(interaction.descriptionText, "</div>\n                <div class=\"closeBtn\" tabindex=\"0\" role=\"button\" aria-label=\"Close the feedback\">").concat(close_icon, "</div>\n            </div>\n        </div>\n    ");
}

function _video_getInteractionTemplate_question(interaction) {
  var options = interaction.options && interaction.options.option;

  if (options && !Array.isArray(options)) {
    options = [options];
  }

  return "\n        <div class=\"optionsContainer\">\n            ".concat(options && options.length && options.map(function (option, optionIndex) {
    return "\n                    <div class=\"option\" data-optionindex=\"".concat(optionIndex, "\" role=\"button\" aria-role=\"button\" tabindex=\"0\" style=\"").concat(interaction.bgColor ? "background-color: ".concat(interaction.bgColor, ";") : '', " ").concat(interaction.textColor ? "color: ".concat(interaction.textColor, ";") : '', "\">\n                        <div class=\"text\">").concat(option, "</div>\n                    </div>\n                ");
  }).join(''), "\n        </div>\n    ");
}

function _video_getInteractionTemplate_mandatoryQuestion(interaction) {
  var SL = HShell.content.selected_languageObj || {};
  var UI = SL.UI || {};
  if (interaction) console.log('interaction not provided = ' + interaction);

  if (!interaction.feedbacks || !interaction.feedbacks.correct || !interaction.feedbacks.wrong) {
    console.log("Error in interaction point of type mandatoryQuestion: feedbacks > correct or feedbacks > wrong not present in content.xml => ".concat(interaction.feedbacks.correct, ", ").concat(interaction.feedbacks.wrong));
  }

  var feedbacks = {
    correct: Array.isArray(interaction.feedbacks.correct) ? interaction.feedbacks.correct : [interaction.feedbacks.correct],
    wrong: Array.isArray(interaction.feedbacks.wrong) ? interaction.feedbacks.wrong : [interaction.feedbacks.wrong]
  };
  var options = interaction.options && interaction.options.option;

  if (options && !Array.isArray(options)) {
    options = [options];
  }

  var numberOfCorrectAnswers = 0;
  return "\n        <div class=\"questionText\" style=\"background-color: ".concat(interaction.bgColor || '', "; color: ").concat(interaction.textColor || '', ";\">\n            ").concat(interaction.text, "\n        </div>\n        <div class=\"optionsContainer\">\n            ").concat(options && options.length ? options.map(function (answer, answerIndex) {
    if (answer['_correct'] == 'true') {
      numberOfCorrectAnswers++;
    }

    return "<div class=\"option\" data-answerid=\"".concat(answerIndex, "\" role=\"checkbox\" aria-checked=\"false\" tabindex=\"0\" aria-label=\"Option ").concat(answerIndex + 1, ". ").concat(answer, "\">\n                    <span class=\"label\">").concat(ALPHABET.charAt(answerIndex).toUpperCase(), ".</span>\n                    <span class=\"text\">").concat(answer, "</span>\n                </div>");
  }).join('') : '', "\n        </div>\n        ").concat(numberOfCorrectAnswers > 1 ? "\n            <div class=\"footerContainer\">\n                <div class=\"submitBtn disabled\" style=\"background-color: ".concat(interaction.bgColor || '', "; border-color: ").concat(interaction.bgColor || '', "; color: ").concat(interaction.textColor || '', ";\"  tabindex=\"0\" role=\"button\" disabled=\"true\" aria-disabled=\"true\" aria-label=\"").concat(UI.label_Submit, "\">\n                    ").concat(UI.label_Submit, "\n                </div>\n            </div>\n        ") : '', "\n        <div class=\"feedbacksContainer\">\n            ").concat(feedbacks && Object.keys(feedbacks).length ? Object.keys(feedbacks).map(function (feedbackKey) {
    var feedbackText = feedbacks[feedbackKey];
    return feedbackText.map(function (fb) {
      var forAnswerId = fb['_for'];
      return "\n                    <div class=\"feedback\" data-for=\"".concat(feedbackKey, "\" ").concat(forAnswerId ? "data-foranswerid=".concat(forAnswerId) : '', ">\n                        <div class=\"title\" role=\"heading\" aria-level=\"4\">\n                        ").concat(feedbackKey == 'wrong' ? "Incorrect" : "Correct", "\n                        </div>\n                        <span class=\"text\">").concat(fb, "</span>\n                        ").concat(feedbackKey == 'wrong' ? "<div class=\"feedbackBtn tryAgain\" tabindex=\"0\" role=\"button\" aria-label=\"Try again\">Try again</div>" : "<div class=\"feedbackBtn continue\" tabindex=\"0\" role=\"button\" aria-label=\"Continue\">Continue</div>", "\n                    </div>\n                ");
    });
  }).join('') : '', "\n        </div>\n    ");
}

function _getCommonTemplate(layout, layoutId, layoutTypeClassName, excludeTitle, backgroundColor) {
  backgroundColor = backgroundColor || 'none';
  return "\n        <div class=\"layoutTemplateContainer ".concat(layoutTypeClassName, "\" data-layouttype=\"").concat(layoutTypeClassName, "\" data-layoutid=\"").concat(layoutId, "\">\n            ").concat(!excludeTitle && (layout.titleMain || layout.titleSub) ? _layoutTitle_template(layout.titleMain, layout.titleSub, layout.titleTextColor, layout.titleBackgroundColor) : '', "\n\n            <div class=\"layoutContentContainer\" style=\"background-color: ").concat(backgroundColor, ";\"></div>\n\n            ").concat(layout.blockingSection && layout.blockingSection != 'empty' ? _layoutBlockingSection_template(layout.blockingSectionColor, layout.blockingSectionTextColor) : '', "\n        </div>\n        ");
}

function _layoutTitle_template(mainTitleText, subtitleText, textColor, backgroundColor) {
  mainTitleText = mainTitleText || '';
  subtitleText = subtitleText || '';
  textColor = textColor || '#FFF';
  backgroundColor = backgroundColor || '#000';
  return "\n        <div class=\"layoutTitleContainer\" style=\"background-color: ".concat(backgroundColor, "\">\n            <div class=\"layoutTitleMainTitle\" style=\"color: ").concat(textColor, "; ").concat(!mainTitleText ? 'display: none;' : '', "\" role=\"heading\" aria-level=\"2\">").concat(mainTitleText, "</div>\n            <div class=\"layoutTitleSubTitle\" style=\"color: ").concat(textColor, "; ").concat(!subtitleText ? 'display: none;' : '', "\">").concat(subtitleText, "</div>\n        </div>\n    ");
}

function _layoutBlockingSection_template(backgroundColor, textColor) {
  backgroundColor = backgroundColor || '#000';
  textColor = textColor || '#FFF';
  var SL = HShell.content.selected_languageObj || {};
  var UI = SL.UI || {};
  return "\n        <div class=\"layoutBlockingSectionContainer\" style=\"background-color: ".concat(backgroundColor, ";\">\n            <div class=\"text\" style=\"color: ").concat(textColor, ";\">").concat(UI.completeBeforeContinue, "</div>\n            <div class=\"button\" style=\"border-color: ").concat(textColor, ";\" data-uniclick=\"blockingSection_onContinueClick\" tabindex=\"0\" role=\"button\" disabled=\"true\" aria-disabled=\"true\" aria-label=\"Continue to next section. Disabled. Complete the content above before moving on.\">\n                <span class=\"icon iconLock\" style=\"fill: ").concat(textColor, ";\" aria-hidden=\"true\">").concat(navigation_lock_icon, "</span>\n                <span class=\"icon iconArrow\" style=\"fill: ").concat(textColor, ";\" aria-hidden=\"true\">").concat(down_arrow_icon, "</span>\n            </div>\n        </div>\n        ");
}

},{}],42:[function(require,module,exports){
var _Module_slides = require("./Module_slides.template");

var HShell = window.HShell || {};
var ANIMATION_SPEED = 1000;
var VIDEO_HOVER_ANIMATION_SPEED = 100;
var keyShortcuts_Common = {
  ctrlKey: true,
  altKey: true
};
var keyShortcut_NextSlide = {
  keyCode: 70,
  key: 'F'
};
var keyShortcut_PrevSlide = {
  keyCode: 66,
  key: 'B'
};
var keyShortcut_BackToWrapper = {
  keyCode: 72,
  key: 'H'
};

function Module_slides() {
  this.UI = HShell.content.selected_languageObj.UI;
}

Module_slides.prototype.onHomeButtonClicked = function () {
  var compleation = this.module.content_completion_status;

  if (compleation === HShell.consts.completionStatus.completed) {
    this.destroy();
    HShell.checkForPostAssessment();
  } else {
    var title = this.UI.confirmation,
        content = this.UI.confirmText,
        footer = _Module_slides.templates.popUpButtons(this.UI);

    $('#SCORM_Container').appendPopUp({
      title: title,
      content: content,
      footer: footer,
      initiatorComponent: this
    });
  }

  HShell.core.$emit('onModuleStatusChanged', module.mod_id);
};

Module_slides.prototype.onDialogNoButtonClicked = function () {
  $('.Component_PopUp').remove();
};

Module_slides.prototype.onDialogYesButtonClicked = function () {
  $('.Component_PopUp').remove();
  this.destroy();
  HShell.checkForPostAssessment();
};

Module_slides.prototype.onNextButtonClicked = function (e, originalTarget) {
  var class_inactive = 'Content__Button--inactive',
      currentSlide = this.slides[this.currentSlideId],
      canBeSkiped = !+currentSlide.mandatory || currentSlide.compleated;

  if (!$(originalTarget).hasClass(class_inactive) && !this.animationInAction && canBeSkiped) {
    var backButton = $(this._wrapper).find('.Content__Button--back');
    this.currentSlideId++;

    if (this.currentSlideId === this.slides.length - 1) {
      $(originalTarget).addClass(class_inactive);
    }

    showSlide.call(this, {
      slide_id: this.currentSlideId,
      animation: true,
      direction: 'down'
    });
    backButton.removeClass(class_inactive);
    backButton.attr('aria-disabled', false);
    hideNextButtonIfNeeded.call(this);
  }
};

Module_slides.prototype.onBackButtonClicked = function (e, originalTarget) {
  var class_inactive = 'Content__Button--inactive';

  if (!$(originalTarget).hasClass(class_inactive) && !this.animationInAction) {
    var nextButton = $(this._wrapper).find('.Content__Button--next');
    this.currentSlideId--;

    if (this.currentSlideId === 0) {
      $(originalTarget).addClass(class_inactive);
      $(originalTarget).attr('aria-disabled', true);
    }

    showSlide.call(this, {
      slide_id: this.currentSlideId,
      animation: true,
      direction: 'up'
    });
    nextButton.removeClass(class_inactive);
    nextButton.attr('aria-disabled', false);
  }
};

function showSlide(_ref) {
  var slide_id = _ref.slide_id,
      animation = _ref.animation,
      direction = _ref.direction;
  var newSlideHtml,
      slide = this.slides[slide_id],
      $slideWrapper = $(this._wrapper).find('.ModuleSlides__Content'),
      $newSlide = $($.parseHTML(_Module_slides.templates.oneSlide(slide_id))),
      wrapperH = $slideWrapper.height(),
      $currentSlideIndicator = $(this._wrapper).find('.SlideIndicator__Current');
  $currentSlideIndicator.text(slide_id + 1);

  switch (slide.type) {
    case 'iframe':
      newSlideHtml = showIframeSlide.call(this, {
        slide: slide,
        slide_id: slide_id
      });
      $newSlide.html(newSlideHtml);
      this.addA11yShortcutsToIframe($newSlide);
      break;

    case 'video':
      $newSlide.html(showVideoSlide.call(this, {
        slide: slide
      }));
      break;
  }

  if (animation && this.$activeSlide) {
    var onAnimationEnd = function onAnimationEnd() {
      this.$activeSlide.remove();
      this.$activeSlide = $newSlide;
      this.activeSlide = this.slides[slide_id];
      this.animationInAction = false;

      if (slide_id === this.slides.length - 1) {
        if (!+this.activeSlide.mandatory) {
          HShell.content.setModuleContent_AsCompleted(this.module.mod_id);
        }
      }
    };

    saveCurrentProgress.call(this, slide_id);
    this.animationInAction = true;

    if (direction === 'up') {
      $slideWrapper.prepend($newSlide);

      if (slide.type === 'video') {
        _renderVideoPlayer.call(this, {
          slide: slide,
          $newSlide: $newSlide,
          $slideWrapper: $slideWrapper
        });
      }

      $newSlide.css('marginTop', "-".concat(wrapperH, "px"));
      $newSlide.animate({
        marginTop: 0
      }, ANIMATION_SPEED, onAnimationEnd.bind(this));
    } else {
      $slideWrapper.append($newSlide);

      if (slide.type === 'video') {
        _renderVideoPlayer.call(this, {
          slide: slide,
          $newSlide: $newSlide,
          $slideWrapper: $slideWrapper
        });
      }

      this.$activeSlide.animate({
        marginTop: "-".concat(wrapperH, "px")
      }, ANIMATION_SPEED, onAnimationEnd.bind(this));
    }
  } else {
    $slideWrapper.append($newSlide);
    this.$activeSlide = $newSlide;
    this.activeSlide = this.slides[slide_id];

    if (slide.type === 'video') {
      _renderVideoPlayer.call(this, {
        slide: slide,
        $newSlide: $newSlide,
        $slideWrapper: $slideWrapper,
        autoplay: true
      });
    }
  }
}

function _renderVideoPlayer(_ref2) {
  var _this = this;

  var slide = _ref2.slide,
      $newSlide = _ref2.$newSlide,
      $slideWrapper = _ref2.$slideWrapper,
      autoplay = _ref2.autoplay;
  setTimeout(function () {
    HShell.core.renderComponents($newSlide);
    videoContainer = $slideWrapper.find('.vidPopVideoContainer .vidPopVideoInnerContainer');
    subtitlesContainer = $slideWrapper.find('.vidPopVideoContainer .vidPopSubtitlesContainer');
    controlesContainer = $slideWrapper.find('.vidPopFooterContainer');
    window.buildVideoPlayer(slide.url, slide.subtitlesUrl, _this.module.mod_id, undefined, undefined, videoContainer, subtitlesContainer, controlesContainer, autoplay, true, true);
    $slideWrapper.closest('.ModuleSlides').on('mouseenter', function () {
      return _onMouseEnter($slideWrapper, VIDEO_HOVER_ANIMATION_SPEED);
    }).on('mouseleave', function () {
      return _onMouseLeave($slideWrapper, VIDEO_HOVER_ANIMATION_SPEED);
    }).children().on('focusin', function () {
      return _onMouseEnter($slideWrapper, 0);
    }).on('focusout', function () {
      return _onMouseLeave($slideWrapper, 0);
    });
  }, ANIMATION_SPEED);
}

function _onMouseEnter($slideWrapper, animationTime) {
  var $videoFooter = $slideWrapper.find('.Component_Video_Footer');
  var $subsContainer = $slideWrapper.find('.vidPopSubtitlesContainer');
  $videoFooter.animate({
    bottom: '0px'
  }, animationTime);
  $subsContainer.animate({
    bottom: "".concat($videoFooter.height(), "px")
  }, animationTime);
}

function _onMouseLeave($slideWrapper, animationTime) {
  var $videoFooter = $slideWrapper.find('.Component_Video_Footer');
  var $subsContainer = $slideWrapper.find('.vidPopSubtitlesContainer');
  $videoFooter.animate({
    bottom: "-".concat($videoFooter.height(), "px")
  }, animationTime);
  $subsContainer.animate({
    bottom: '0px'
  }, animationTime);
}

function _videoFinishedCb() {
  HShell.dispatchEvent('Slide_CompleationStatus_change', this.currentSlideId);
}

function saveCurrentProgress(slideId) {
  var data = HShell.storage.loadModuleCustomData(this.module.mod_id) || {},
      oldSlideId = data.slideId || 0;

  if (oldSlideId < slideId) {
    HShell.storage.saveModuleCusomData(this.module.mod_id, {
      slideId: slideId
    });
  }
}

function loadProgress() {
  var data = HShell.storage.loadModuleCustomData(this.module.mod_id) || {},
      slideId = data.slideId || 0,
      isLastSlide = slideId === this.slides.length - 1;

  for (var i = 0; i < slideId; i++) {
    this.slides[i].compleated = true;
  }

  this.currentSlideId = isLastSlide ? 0 : slideId;
}

function showVideoSlide(_ref3) {
  var slide = _ref3.slide;
  return HShell.core.getComponent('Module_Video').init({
    modId: this.module.mod_id,
    transcriptUrl: slide.transcriptUrl,
    dontShowEndOfModuleScreen: true,
    onVideoFinishedCb: _videoFinishedCb
  });
}

function showIframeSlide(_ref4) {
  var slide = _ref4.slide,
      slide_id = _ref4.slide_id;
  var URL = getSlideUrl.call(this, slide);
  var appliedZoom = HShell.autoSetup.bodyZoomRatio,
      pixelRatio = window.devicePixelRatio,
      width = 1 / pixelRatio * 100,
      height = 1 / appliedZoom * (1 / pixelRatio) * 100;
  return _Module_slides.templates.iframeSlide({
    URL: URL,
    slide_id: slide_id,
    width: width,
    height: height
  });
}

function getSlideUrl(slide) {
  var slideUrl = slide.url,
      URL,
      fullURL;

  if (typeof slideUrl === 'string') {
    URL = slideUrl;
  } else {
    var runsOn = HShell.autoSetup.runOn,
        generalUrl = '',
        browserSpecificUrl = '';
    slideUrl.forEach(function (url) {
      if (typeof url === 'string') {
        generalUrl = url;
      }

      if ("".concat(url._browser).concat(url._version) === "".concat(runsOn.browserName).concat(runsOn.version)) {
        browserSpecificUrl = url.__text;
      }
    });
    URL = browserSpecificUrl || generalUrl;
  }

  fullURL = "content/".concat(this.UI.code, "/").concat(URL);
  return fullURL;
}

function addHShellEvents() {
  var _this2 = this;

  this.SlideCompleationEvent = HShell.core.$on('Slide_CompleationStatus_change', function (slide_id) {
    _this2.slides[slide_id ? slide_id : _this2.currentSlideId].compleated = true;

    if (_this2.currentSlideId !== _this2.slides.length - 1) {
      var nextButton = $(_this2._wrapper).find('.Content__Button--next');

      if (nextButton.hasClass('Content__Button--inactive')) {
        animateButton(nextButton.find('.Content__ButtonAnimation'));
      }

      nextButton.removeClass('Content__Button--inactive');
      nextButton.attr('aria-disabled', false);
    } else {
      HShell.content.setModuleContent_AsCompleted(_this2.module.mod_id);
    }
  });
}

function animateButton(target) {
  var numberOfRotations = 0;
  var TOTAL_ROTATIONS = 180;
  var ANIMATION_INTERVAL = 13;
  var $target = $(target);
  var animationInterval = setInterval(function () {
    if (TOTAL_ROTATIONS === numberOfRotations + 22) {
      $target.fadeOut();
    }

    if (TOTAL_ROTATIONS === numberOfRotations) {
      clearInterval(animationInterval);
    }

    numberOfRotations++;
    $target.css('transform', "rotate(".concat(10 * numberOfRotations, "deg)"));
  }, ANIMATION_INTERVAL);
  $target.fadeIn();
}

function hideNextButtonIfNeeded() {
  var class_inactive = 'Content__Button--inactive';
  var newSlide = this.slides[this.currentSlideId],
      newSlideCanBeSkiped = !+newSlide.mandatory || newSlide.compleated,
      isLastSlide = this.currentSlideId === this.slides.length - 1;

  if (!newSlideCanBeSkiped || isLastSlide) {
    var nextButton = $(this._wrapper).find('.Content__Button--next');
    nextButton.addClass(class_inactive);
    nextButton.attr('aria-disabled', true);
  }
}

Module_slides.prototype.addA11yShortcutsToIframe = function (slide) {
  var Module_slidesComponent = this;
  var iframe = slide[0].querySelector('iframe');
  iframe.addEventListener('load', function () {
    Module_slidesComponent.addA11yShortcuts(this.contentDocument.body);
  });
};

Module_slides.prototype.addA11yShortcuts = function (target) {
  target.addEventListener('keyup', this.onA11yKeyPressedBound);
};

Module_slides.prototype.onA11yKeyPressed = function (e) {
  var Module_slidesComponent = this;

  var nextButton = this._wrapper.querySelector('.Content__Button--next');

  var prevButton = this._wrapper.querySelector('.Content__Button--back');

  var homeButton = this._wrapper.querySelector('.Component_HomeButton [role="button"]');

  if (keyShortcuts_Common.ctrlKey === e.ctrlKey && keyShortcuts_Common.altKey === e.altKey) {
    switch (e.keyCode) {
      case keyShortcut_NextSlide.keyCode:
        Module_slidesComponent.onNextButtonClicked(e, nextButton);
        break;

      case keyShortcut_PrevSlide.keyCode:
        Module_slidesComponent.onBackButtonClicked(e, prevButton);
        break;

      case keyShortcut_BackToWrapper.keyCode:
        homeButton.click();
        break;
    }
  }
};

Module_slides.prototype.onComponentRender = function () {
  HShell.content.setModuleContent_AsInProgress(this.module.mod_id);
  showSlide.call(this, {
    slide_id: this.currentSlideId
  });
  hideNextButtonIfNeeded.call(this);
  addHShellEvents.call(this);
  this.addA11yShortcuts(document.body);
  HShell.a11y.speak("\n        For Next slide, press (Ctr + Alt + ".concat(keyShortcut_NextSlide.key, ").\n        For Previous slide press (Ctr + Alt + ").concat(keyShortcut_PrevSlide.key, ").\n        For HomeButton press (Ctr + Alt + ").concat(keyShortcut_BackToWrapper.key, ")"), false);
};

Module_slides.prototype.render = function (_ref5) {
  var module = _ref5.module;
  var backButtonInactive = true;
  this.slides = module.xmlObj.slides.slide;
  this.module = module;
  this.currentSlideId = 0;
  this.onA11yKeyPressedBound = this.onA11yKeyPressed.bind(this);
  loadProgress.call(this);
  backButtonInactive = this.currentSlideId === 0;
  return _Module_slides.templates.main({
    backButtonInactive: backButtonInactive,
    totalSlidesNumber: this.slides.length,
    onHomeButtonClicked: this.onHomeButtonClicked.bind(this)
  });
};

Module_slides.prototype.onDestroy = function () {
  window.changeLastLocation(HShell.consts.locations.moduleSelect);
  HShell.core.$off(this.SlideCompleationEvent);
  document.body.removeEventListener('keyup', this.onA11yKeyPressedBound);
};

HShell.core.registerComponent(Module_slides, 'Module_slides');

},{"./Module_slides.template":43}],43:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var HShell = window.HShell || {};
var templates = {
  main: main,
  popUpButtons: popUpButtons,
  iframeSlide: iframeSlide,
  oneSlide: oneSlide
};
exports.templates = templates;

function main(_ref) {
  var totalSlidesNumber = _ref.totalSlidesNumber,
      backButtonInactive = _ref.backButtonInactive,
      onHomeButtonClicked = _ref.onHomeButtonClicked;
  var class_backButtonInactive = backButtonInactive ? 'Content__Button--inactive' : '';
  return "\n            <div class=\"ModuleSlides\">\n                <div class=\"ModuleSlides__Content\"></div>\n\n                <div class=\"ModuleSlides__Navigation\">\n                    <div\n                        class=\"Content__Button Content__Button--next\"\n                        data-uniclick=\"onNextButtonClicked\"\n                        tabindex=\"0\"\n                        role=\"button\"\n                        aria-label=\"Next slide (Ctrl + alt + F)\"\n                    >\n                        <div class=\"Content__ButtonAnimation\"></div>\n                    </div>\n\n                    <div class=\"Content__SlideIndicator\">\n                        <span class=\"SlideIndicator__Current\"></span>\n                        <span class=\"SlideIndicator__Separator\">/</span>\n                        <span class=\"SlideIndicator__Total\">".concat(totalSlidesNumber, "</span>\n                    </div>\n\n                     <div\n                        class=\"Content__Button Content__Button--back ").concat(class_backButtonInactive, "\"\n                        data-uniclick=\"onBackButtonClicked\"\n                        tabindex=\"0\"\n                        role=\"button\"\n                        aria-label=\"Previous slide (Ctrl + alt + B)\"\n                        aria-disabled=\"true\"\n                    >\n                        <div class=\"Content__ButtonAnimation\"></div>\n                    </div>\n                </div>\n\n                <div class=\"ModuleSlides__Header\">\n                    ").concat(HShell.core.getComponent('HomeButton').init({
    onClick: onHomeButtonClicked,
    ariaLabel: '(Ctrl + alt + H)'
  }), "\n                </div>\n            </div>\n        ");
}

function oneSlide(slide_id) {
  return "<div class=\"ModuleSlides__Slide\" data-id=\"".concat(slide_id, "\"></div>");
}

function iframeSlide(_ref2) {
  var URL = _ref2.URL,
      slide_id = _ref2.slide_id;
  return "\n            <iframe class=\"WPHeightMod\" src=\"".concat(URL, "\" onload=\"this.contentWindow.slide_id = ").concat(slide_id, "\"></iframe>\n        ");
}

function popUpButtons(UI) {
  return "\n            <div class=\"buttonsContainer\" aria-live=\"off\">\n                <span data-uniclick=\"onDialogNoButtonClicked\">\n                    ".concat(HShell.core.getComponent('Button').init({
    id: 'videoContinueReskin',
    text: UI.label_No
  }), "\n                </spn>\n\n                <span data-uniclick=\"onDialogYesButtonClicked\">\n                    ").concat(HShell.core.getComponent('Button').init({
    id: 'videoCloseReskin',
    text: UI.label_Yes
  }), "\n                </spn>\n            </div>\n        ");
}

},{}],44:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.confirmModal = void 0;

var _Module_Video = require("./Module_Video.template");

var confirmModal = {
  showModal: showModal,
  onConfirmation: onConfirmation,
  onConfirmationClose: onConfirmationClose,
  closeVideoPlayer: closeVideoPlayer,
  focusLastPlayedModule: focusLastPlayedModule
};
exports.confirmModal = confirmModal;
var HShell = window.HShell || {};

function showModal(_ref) {
  var nextModuleId = _ref.nextModuleId;
  var SL = HShell.content.selected_languageObj;
  handleIOS('hide');
  handleInteractionPointsAudio('pause');
  addPopUp.call(this, {
    HShell: HShell,
    SL: SL,
    module: this.module,
    nextModuleId: nextModuleId
  });
}

function handleIOS(func) {
  // --- Hide the video, since it is ontop of all the content on iOS devices
  if (HShell.autoSetup.runOn.OS == 'iOS' && HShell.autoSetup.runOn.formFactor == 'phone') {
    $('.uniPlayHtml')[func]();
  }
}

function handleInteractionPointsAudio(state) {
  if ($('#ipAudio').length > 0) {
    if (window.selectVideoPlayerMethod() === HShell.consts.videoPlayerMethod.flash) {
      $('#ipAudio')[0]["audio_".concat(state)]();
    } else {
      if ($('#ipAudio')[0].currentTime !== $('#ipAudio')[0].duration) {
        $('#ipAudio')[0][state]();
      }
    }
  }
}

function addPopUp(_ref2) {
  var HShell = _ref2.HShell,
      SL = _ref2.SL,
      nextModuleId = _ref2.nextModuleId;
  $('#SCORM_Container').appendPopUp({
    title: SL.UI.confirmation,
    content: SL.UI.confirmText,
    footer: _Module_Video.templates.closeModuleDialog.call(this, {
      HShell: HShell,
      SL: SL,
      nextModuleId: nextModuleId
    }),
    func: function func() {}
  });
}

function onConfirmation(nextModuleId) {
  var allModsArr = HShell.content.getModuleArrForAllLanguages(this.module.mod_id);
  closeVideoPlayer();
  $('.Component_PopUp').remove();

  if (HShell.autoSetup.runOn.OS === 'iOS') {
    $('#forced_speech_container').attr('aria-hidden', true);
  }

  allModsArr.forEach(function (module) {
    module.content_completion_status = 'incomplete';
  });
  HShell.storage.commitData('high');
  window.restoreProgressFromArray();
  focusLastPlayedModule(this.module.mod_id);

  if (nextModuleId) {
    HShell.core.$emit('Start__Module', nextModuleId);
  }
}

function onConfirmationClose() {
  var activeVideo = $(HShell.autoSetup.activeVideo.videoContainer).parents('.videoPopUp');
  handleInteractionPointsAudio('play');
  handleIOS('show');
  $('.Component_PopUp').remove();
  setTimeout(function () {
    activeVideo.find('.vidPopPlayBtn').click();
  }, 1); //iphone video goes to full screen with controls when focused
  //activeVideo.find('.vidPopClose').focus();

  $('#forced_speech_container').attr('aria-hidden', true);
}

function closeVideoPlayer(isClickedFromTimeline) {
  var activeVideo = HShell.autoSetup.activeVideo,
      htmlVideo = activeVideo.htmlVideo;
  HShell.core.$emit('onModuleStatusChanged');
  window.changeLastLocation('mod_select');
  $('body.iOS div.vidPopPlayBtn').each(function () {
    if (!$(this).hasClass('paused')) {
      $(this).click();
    }
  });

  if (htmlVideo) {
    $(htmlVideo).find('source').addBack('source').attr('src', '');
    htmlVideo.load();
  } //HShell.autoSetup.activeVideo.forRemoval = true;


  activeVideo = new Object();
  $('.Component_Module_Video').remove();
  $('#mainContentContainer, #homePageHeaderContainer').show().attr('aria-hidden', false);

  if (window.selectVideoPlayerMethod() == HShell.consts.videoPlayerMethod.flash) {
    if ($('#hiddenAudioElement').length > 0 && typeof $('#hiddenAudioElement')[0].audio_stop === 'function') {
      $('#hiddenAudioElement')[0].audio_stop();
    }
  } else {
    if (typeof HShell.courseSpecific.content.moduleEndAudio != 'undefined') {
      var endAudio = HShell.courseSpecific.content.moduleEndAudio;

      if (!isNaN(endAudio.duration)) {
        endAudio.pause();
        endAudio.currentTime = 0;
      }
    }
  }

  HShell.core.$emit('VideoModuleClosed');

  if (!isClickedFromTimeline) {
    HShell.checkForPostAssessment();
  }
}

function focusLastPlayedModule(modId) {
  if (modId) {
    $('#oneModuleItemContainer' + modId + ' .oneModuleDescriptionContainer').focus();
  } else {
    //not focusing without timeout, because the modules aren't ready, most probably restoreProgressFromArray() isn't finished at that point
    //or maybe the visual updates (hiding) on the DOM aren't ready
    setTimeout(function () {
      $('.oneModuleDescriptionContainer:visible:first').focus();
    }, 10);
    HShell.utils.scrollTopMainContainer();
  }
}

},{"./Module_Video.template":46}],45:[function(require,module,exports){
var _Module_Video = require("./Module_Video.template");

var _Close_Module_Video_PopUp = require("./Close_Module_Video_PopUp");

var HShell = window.HShell || {},
    endOfVideoReached = false,
    lastVideoPosition = 0;

function Module_Video() {
  this.SL = HShell.content.selected_languageObj;
  this.isFullscreen = false;
  this.listenerFullScreen = HShell.core.$on('toggleModuleFullScreen', this.onFullScreenChange.bind(this));
  this.$on('onHomeButtonPressed', this.onHomeButtonPressed);
}

Module_Video.prototype.enableTimer = function () {
  var _this = this;

  this.videoSynchronizationInterval = setInterval(function () {
    var activeVideo = HShell.autoSetup.activeVideo,
        currentTime = Math.round(activeVideo.videoCurrentPosition),
        totalTime = Math.round(activeVideo.videoLenght);

    if (lastVideoPosition !== currentTime) {
      lastVideoPosition = currentTime;

      _this.$emit('moduleVideoSyncronization', {
        currentTime: currentTime,
        totalTime: totalTime
      });

      if (currentTime > 0 && !activeVideo.isFeedbackVideo) {
        if (HShell.autoSetup.runOn.OS == 'iOS' && HShell.autoSetup.runOn.formFactor == 'phone') {
          $('.uniPlayHtml')[0].webkitExitFullScreen();
        }

        if (currentTime >= totalTime) {
          _this.onVideoFinished(activeVideo);
        } else {
          if (HShell.autoSetup.activeVideoState != 'finished') {
            HShell.autoSetup.activeVideoState = 'unfinished';
          }
        }
      }
    }
  }, HShell.consts.videoCheckFreq);
};

Module_Video.prototype.onVideoFinished = function (activeVideo) {
  HShell.autoSetup.activeVideoState = 'finished';
  $('.vidPopVideoContainer').click();
  /**@todo we need to see why we need this, and remove it if it is not usefull */

  if (!endOfVideoReached) {
    endOfVideoReached = true;
    this.$emit('moduleVideoFinished');
  }

  if (typeof this.onVideoFinishedCb === 'function') {
    this.onVideoFinishedCb();
  }

  HShell.autoSetup.activeVideoArray[activeVideo.idInActiveVideoArray].pause();
  clearInterval(this.videoSynchronizationInterval);

  if (!this.dontShowEndOfModuleScreen && !$('.vidPopModEndText').hasClass('visible')) {
    window.showEndOfModuleScreen();
  }
};

Module_Video.prototype.onHomeButtonPressed = function (payload) {
  var isVideoFinished = HShell.autoSetup.activeVideoState == 'finished',
      isContentFinished = this.module.content_completion_status === HShell.consts.completionStatus.completed,
      isModuleFinished = this.module.completion_status === HShell.consts.completionStatus.completed,
      nextModuleId = payload && payload.nextModuleId;

  if (isVideoFinished || isContentFinished || isModuleFinished) {
    HShell.content.setModuleContent_AsCompleted(this.module.mod_id);

    if (this.module.quiz.length > 0 && this.module.quiz_completion_status == 'completed' || this.module.quiz.length == 0) {
      HShell.content.selectModuleAsFinished(this.module.mod_id);
    }

    if (HShell.contentSetup.have_timeline && nextModuleId) {
      _Close_Module_Video_PopUp.confirmModal.closeVideoPlayer(true);
    } else {
      _Close_Module_Video_PopUp.confirmModal.closeVideoPlayer();
    }

    window.restoreProgressFromArray();

    if ($('#filterInProgressReskin.active').length !== 0) {
      _Close_Module_Video_PopUp.confirmModal.focusLastPlayedModule();
    } else {
      _Close_Module_Video_PopUp.confirmModal.focusLastPlayedModule(this.module.mod_id);
    }

    HShell.core.$emit('onModuleStatusChanged');

    if (nextModuleId) {
      HShell.core.$emit('Start__Module', nextModuleId);
    }
  } else {
    HShell.autoSetup.activeVideo.pause();
    this.$emit('videoIsPaused');
    this.showConfirmationScreen({
      nextModuleId: nextModuleId
    });
  }
};

Module_Video.prototype.showConfirmationScreen = _Close_Module_Video_PopUp.confirmModal.showModal;
Module_Video.prototype.onConfirmation = _Close_Module_Video_PopUp.confirmModal.onConfirmation;
Module_Video.prototype.onConfirmationClose = _Close_Module_Video_PopUp.confirmModal.onConfirmationClose;

Module_Video.prototype.onFullScreenChange = function (isFullscreen) {
  this.isFullscreen = isFullscreen;

  this._wrapper.querySelector('.vidPopVideoContainer').classList[this.isFullscreen ? 'add' : 'remove']('fullscreen');
};

Module_Video.prototype.getHeaderOptions = function () {
  var options = {
    leftText: this.SL.UI.course_title,
    rightText: this.module.title,
    haveFullScreen: true,
    theme: this.module.theme
  };
  return options;
};

Module_Video.prototype.getFooterOptions = function () {
  var options = {
    transcriptUrl: this.transcriptUrl,
    subtitles: true,
    rightButtonLable: null,
    noHome: false,
    homeEnabled: this.module.content_completion_status === HShell.consts.completionStatus.completed
  };

  if (this.theme === 'bigHomeButton') {
    options.noHome = true;
  }

  return options;
};

Module_Video.prototype.onComponentRender = function () {
  this.enableTimer();
};

Module_Video.prototype.render = function (_ref) {
  var modId = _ref.modId,
      transcriptUrl = _ref.transcriptUrl,
      dontShowEndOfModuleScreen = _ref.dontShowEndOfModuleScreen,
      onVideoFinishedCb = _ref.onVideoFinishedCb;
  this.modId = modId;
  this.transcriptUrl = transcriptUrl;
  this.module = HShell.content.getModuleById(modId);
  this.theme = this.module.theme;
  this.dontShowEndOfModuleScreen = dontShowEndOfModuleScreen;
  this.onVideoFinishedCb = onVideoFinishedCb;
  return _Module_Video.templates.main({
    HShell: HShell,
    modId: modId,
    headerOptions: this.getHeaderOptions(),
    hasSubtitles: HShell.userData.prefer_subtitles,
    isFullscreen: this.isFullscreen,
    theme: this.theme,
    footerOptions: this.getFooterOptions()
  });
};

Module_Video.prototype.onDestroy = function () {
  HShell.core.$off(this.listenerFullScreen);
  clearInterval(this.videoSynchronizationInterval);
};

HShell.core.registerComponent(Module_Video, 'Module_Video');

},{"./Close_Module_Video_PopUp":44,"./Module_Video.template":46}],46:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var templates = {
  main: main,
  closeModuleDialog: closeModuleDialog
};
exports.templates = templates;

function main(_ref) {
  var HShell = _ref.HShell,
      modId = _ref.modId,
      headerOptions = _ref.headerOptions,
      hasSubtitles = _ref.hasSubtitles,
      isFullscreen = _ref.isFullscreen,
      theme = _ref.theme,
      footerOptions = _ref.footerOptions;
  var class_Subtitles = hasSubtitles ? '' : 'noSubtitles',
      class_FullScreen = isFullscreen ? 'fullscreen' : '',
      class_Theme = theme ? "ModuleVideo--".concat(theme) : '';
  return "\n        <div\n            id=\"moduleVideoContainer\"\n            class=\"abs videoPopUp ".concat(class_Theme, "\"\n            data-moduleID=\"").concat(modId, "\"\n            data-moduleTheme=\"").concat(theme, "\"\n        >\n            ").concat(HShell.core.getComponent('Module_Header').init(headerOptions), "\n\n            <div class=\"vidPopVideoContainer loading rel ").concat(class_FullScreen, "\" tabindex=\"-1\">\n                <div class=\"vidPopVideoInnerContainer rel\">\n                    <span class=\"vAlignHelper\"></span>\n                </div>\n                <div class=\"vidPopSubtitlesContainer ").concat(class_Subtitles, " noSelect\" aria-hidden=\"true\"></div>\n            </div>\n\n            ").concat(HShell.contentSetup.have_timeline ? HShell.core.getComponent('Timeline_Bar').init({
    modId: modId
  }) : '', "\n\n            ").concat(HShell.core.getComponent('Video_Footer').init(footerOptions), "\n        </div>\n    ");
}

function closeModuleDialog(_ref2) {
  var HShell = _ref2.HShell,
      SL = _ref2.SL,
      nextModuleId = _ref2.nextModuleId;
  return "\n        <div class=\"buttonsContainer\" aria-live=\"off\">\n            ".concat(HShell.core.getComponent('Button').init({
    id: 'videoContinueReskin',
    text: SL.UI.label_No,
    onClick: this.onConfirmationClose.bind(this)
  }), "\n            ").concat(HShell.core.getComponent('Button').init({
    id: 'videoCloseReskin',
    text: SL.UI.label_Yes,
    onClick: this.onConfirmation.bind(this),
    payload: nextModuleId
  }), "\n        </div>\n    ");
}

},{}],47:[function(require,module,exports){
var _Timeline_Bar = require("./Timeline_Bar.template");

var HShell = window.HShell || {};
/**
 * Timeline bar is visible only for desktop
 */

function Timeline_Bar() {
  this.SL = HShell.content.selected_languageObj;
}

Timeline_Bar.prototype.onTimlelineItemSelected = function (e, target) {
  var id = target.dataset.id;

  if (id !== this.activeModuleId) {
    this.$emit('onHomeButtonPressed', {
      nextModuleId: target.dataset.id
    });
  }
};

Timeline_Bar.prototype.render = function (_ref) {
  var modId = _ref.modId;
  var tileWidth;
  this.allVideoModules = HShell.content.getAllModulesByType('Video');
  this.activeModuleId = modId; //container width - active tile width divided by other tiles and minus 5 because of border and margin right
  //258 is active tile width from css

  /** @toDo - this must be done in a better way, not getting the dom elements dimentions */

  tileWidth = ($('#SCORM_Container').width() - 258) / (this.allVideoModules.length - 1) - 5;
  return _Timeline_Bar.templates.main({
    modId: modId,
    allVideoModules: this.allVideoModules,
    tileWidth: tileWidth,
    hasSubtitles: HShell.userData.prefer_subtitles
  });
};

HShell.core.registerComponent(Timeline_Bar, 'Timeline_Bar');

},{"./Timeline_Bar.template":48}],48:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var templates = {
  main: main
};
exports.templates = templates;

function main(_ref) {
  var modId = _ref.modId,
      allVideoModules = _ref.allVideoModules,
      hasSubtitles = _ref.hasSubtitles,
      tileWidth = _ref.tileWidth;
  var class_Subtitles = hasSubtitles === true ? 'subs' : '';
  return "\n        <div class=\"timelineContainer ".concat(class_Subtitles, "\">\n            <div class=\"timelineTopLine\"></div>\n\n            ").concat(getAllModulesTemplate(allVideoModules, modId, tileWidth), "\n        </div>\n    ");
}

function getAllModulesTemplate(allVideoModules, modId, tileWidth) {
  var allModulesHtml = '',
      allModulesCount = allVideoModules.length;
  allVideoModules.forEach(function (module, index) {
    allModulesHtml += getOneModuleItemTemplate({
      index: index,
      module: module,
      activeModuleId: modId,
      allModulesCount: allModulesCount,
      tileWidth: tileWidth
    });
  });
  return allModulesHtml;
}

function getOneModuleItemTemplate(_ref2) {
  var index = _ref2.index,
      module = _ref2.module,
      activeModuleId = _ref2.activeModuleId,
      allModulesCount = _ref2.allModulesCount,
      tileWidth = _ref2.tileWidth;
  var class_lastItem = index === allModulesCount - 1 ? ' last' : '',
      class_activeItem = module.mod_id === activeModuleId ? ' active' : '';
  return "\n        <div\n            id=\"Timeline_module_".concat(module.mod_id, "\"\n            data-id=\"").concat(module.mod_id, "\"\n            role=\"button\"\n            tabindex=\"0\"\n            class=\"timelineTile ").concat(class_activeItem, " ").concat(class_lastItem, "\"\n            style=\"width:").concat(tileWidth, "px\"\n            data-uniclick=\"onTimlelineItemSelected\"\n        >\n            <div class=\"centerContentHelper\"></div>\n            <div class=\"timelineIndex\">").concat(index + 1, "</div>\n            <div class=\"timelineText\">").concat(module.title, "</div>\n        </div>\n    ");
}

},{}],49:[function(require,module,exports){
var _Module_WebPage = require("./Module_WebPage.template");

var HShell = window.HShell || {};

function Module_WebPage() {
  this.UI = HShell.content.selected_languageObj.UI;
  HShell.core.$on('activeModuleHasFinished', this.onActiveModuleHasFinished.bind(this)); // this.$on('onHomeButtonPressed', this.onIframeCloseClicked.bind(this));

  this.$on('PostAssessment_Started', this.destroy);
}

function getRootDomElementId(template) {
  var id = '',
      isValidTemplate = false;
  isValidTemplate = Boolean(HShell.consts.iframeTypes[template]);

  if (isValidTemplate) {
    switch (template) {
      case 'iframe':
        id = 'oneIframePopUpContainer';
        break;

      case 'ted':
      case 'youtube':
        id = 'oneYoutubePlayerContainer';
        break;
    }
  } else {
    id = '#oneIframePopUpContainer';
  }

  return id;
}

function addA11yToIframe(_ref) {
  var iframeBody = _ref.iframeBody,
      iframeDomNode = _ref.iframeDomNode;
  var iframeTitle = iframeBody.find('.RRTitle');
  iframeTitle.attr('tabindex', '-1').focus();
  HShell.a11y.speak(iframeTitle.text());
  $(iframeDomNode).contents().keyup(function (e) {
    HShell.a11y.accessbilityShortcutsEventHandlerFunc(e);
  });
}

function setModuleCompletionStatus() {
  var isSelfCompleating = HShell.content.activeModule.isSelfCompleating,
      currentModule = HShell.content.getModuleById(this.mod_id),
      hasQuiz = currentModule.quiz.length > 0,
      isQuizCompleated = currentModule.quiz_completion_status == 'completed';

  if (!isSelfCompleating) {
    if (hasQuiz && isQuizCompleated || !hasQuiz) {
      HShell.content.selectModuleAsFinished(this.mod_id);
    } else {
      var allModules = HShell.content.getModuleArrForAllLanguages(this.mod_id);
      allModules.forEach(function (item) {
        item.content_completion_status = 'completed';
      });
      $(".ModList__Item[moduleId=\"".concat(this.mod_id, "\"]")).addClass('contentPassed started');
    }
  }
}

function getIsSelfCompleating(moduleType) {
  return HShell.consts.selfCompleatingModulesTypes[moduleType];
}

Module_WebPage.prototype.onActiveModuleHasFinished = function () {
  var closeButton = this._wrapper.querySelector('.vidPopClose');

  if (closeButton) {
    closeButton.classList.remove('inactive');
  }
};

Module_WebPage.prototype.iframeLoaded = function (event) {
  var iframeDomNode = event.target,
      iframeBody = $(iframeDomNode).contents().find('body');
  this.addStylesInIframe({
    iframeBody: iframeBody,
    iframeDomNode: iframeDomNode
  });
  addA11yToIframe({
    iframeBody: iframeBody,
    iframeDomNode: iframeDomNode
  });
  var isCompleted = this.module.content_completion_status === HShell.consts.completionStatus.completed;

  if (HShell.content.activeModule.isSelfCompleating && isCompleted || !HShell.content.activeModule.isSelfCompleating) {
    setModuleCompletionStatus.call(this);
    setTimeout(function () {
      HShell.checkForPostAssessment();
    }, 5000);
  }
};

Module_WebPage.prototype.addStylesInIframe = function (_ref2) {
  var iframeBody = _ref2.iframeBody,
      iframeDomNode = _ref2.iframeDomNode;
  var iframeDocument = iframeDomNode.contentDocument;

  try {
    var isSaba = document.body.classList.contains('SABA');
    iframeBody.addClass(HShell.autoSetup.runOn.deviceName).addClass(HShell.autoSetup.runOn.OS).addClass(HShell.autoSetup.runOn.browserName).addClass(HShell.autoSetup.runOn.deviceType).addClass(this.theme).addClass(isSaba ? 'SABA' : '');
    this.AddWPStyles({
      iframeDomNode: iframeDomNode,
      iframeBody: iframeBody,
      isSaba: isSaba
    });

    if (HShell.autoSetup.runOn.deviceName == 'iphone') {
      if (this.moduleType !== 'adobe animate') {
        $(iframeDocument).find('body').css('zoom', HShell.autoSetup.bodyZoomRatio);
      } else {
        if (HShell.autoSetup.runOn.OS === 'windowsPhone') {
          if (this.theme === HShell.consts.iframeTemplates.bigHomeButton) {
            $(iframeDomNode).attr('style', 'height:' + HShell.autoSetup.fullFrameHeight + 'vh !important');
          } else {
            $(iframeDomNode).attr('style', 'height: calc(' + HShell.autoSetup.fullFrameHeight + 'vh - 100px)!important');
          }
        }
      }
    } //$(thisItem).css('height',document.getElementsByTagName('iframe')[0].contentWindow.document.body.scrollHeight + 120);		// --- The constant 120 is compensating for the footer;


    if (HShell.autoSetup.runOn.OS !== 'windowsPhone'
    /*|| HShell.autoSetup.runOn.formFactor !== 'desktop'*/
    ) {
        $(iframeDocument).find('body > .wrapper').css('height', HShell.autoSetup.fullFrameHeight + 'vh'); // calc - 40px
      } // if (HShell.autoSetup.runOn.OS == 'windows') {
    //     $(thisItem.contentDocument).find('body > .wrapper').css('overflow', 'hidden');
    // }

  } catch (e) {
    HShell.utils.trace('Error while adding device type inside iframe: ', 'iframeLoaded');
    HShell.utils.trace(e);
  }
};

Module_WebPage.prototype.AddWPStyles = function (_ref3) {
  var iframeDomNode = _ref3.iframeDomNode,
      iframeBody = _ref3.iframeBody,
      isSaba = _ref3.isSaba;

  if (this.moduleType !== 'adobe animate') {
    if (isSaba && HShell.autoSetup.runOn.OS === 'windowsPhone') {
      var appliedZoom = HShell.autoSetup.bodyZoomRatio,
          pixelRatio = window.devicePixelRatio,
          width = 1 / pixelRatio * 100,
          height = 1 / appliedZoom * (1 / pixelRatio) * 100;
      iframeBody.attr('style', "width:".concat(width, "vw; height: ").concat(height, "vh"));
      iframeDomNode.style.zoom = pixelRatio;
    }
  }
};

Module_WebPage.prototype.onIframeCloseClicked = function () {
  var isCompleted = this.module.content_completion_status === HShell.consts.completionStatus.completed;

  if (HShell.content.activeModule.isSelfCompleating && isCompleted || !HShell.content.activeModule.isSelfCompleating) {
    setModuleCompletionStatus.call(this);
    this.closeIframe();
  } else {
    var title = this.UI.confirmation,
        content = this.UI.confirmText,
        footer = _Module_WebPage.templates.popUpButtons(HShell, this.UI);

    $('#SCORM_Container').appendPopUp({
      title: title,
      content: content,
      footer: footer,
      initiatorComponent: this
    });
  }
};

Module_WebPage.prototype.closeIframe = function (skipPostAssessmentCheck) {
  HShell.utils.unlockFocusFromContainer();
  this.onClose(skipPostAssessmentCheck);
  this.destroy();
};

Module_WebPage.prototype.onDialogNoButtonClicked = function () {
  $('.Component_PopUp').remove();
};

Module_WebPage.prototype.onDialogYesButtonClicked = function () {
  this.closeIframe();
  $('.Component_PopUp').remove();
};

Module_WebPage.prototype.onComponentRender = function () {
  HShell.utils.lockFocusToContainer("#".concat(this.rootDomElementId));
  $('.oneIframeConentInner iframe').focus();
};

Module_WebPage.prototype.getParams = function () {
  return {
    runOn: HShell.autoSetup.runOn,
    brandName: HShell.config.brandName,
    theme: this.theme
  };
};

Module_WebPage.prototype.render = function (_ref4) {
  var title = _ref4.title,
      url = _ref4.url,
      moduleType = _ref4.moduleType,
      template = _ref4.template,
      mod_id = _ref4.mod_id,
      onClose = _ref4.onClose;
  var SL = window.SL || {},
      HShell = window.HShell || {},
      isModuleCompleted;
  this.mod_id = mod_id;
  this.module = HShell.content.getModuleById(this.mod_id);
  this.moduleType = moduleType;
  this.isSelfCompleating = getIsSelfCompleating(this.moduleType);

  this.onClose = onClose || function () {};

  this.templateString = HShell.consts.iframeTypes[template] || HShell.consts.iframeTypes.iframe;
  this.rootDomElementId = getRootDomElementId(template);
  isModuleCompleted = this.module.completion_status === HShell.consts.completionStatus.completed;
  this.theme = HShell.consts.iframeTemplates[this.module.theme] ? HShell.consts.iframeTemplates[this.module.theme] : '';
  var headerOptions = {
    leftText: SL.UI.course_title,
    rightText: title,
    haveFullScreen: false,
    theme: this.theme
  };
  return _Module_WebPage.templates[this.templateString]({
    HShell: HShell,
    SL: SL,
    url: url,
    headerOptions: headerOptions,
    theme: this.theme,
    isHomeActive: !this.isSelfCompleating || isModuleCompleted,
    moduleType: this.moduleType,
    module: this.module,
    params: escape(JSON.stringify(this.getParams())),
    onNavigation: this.closeIframe.bind(this)
  });
};

HShell.core.registerComponent(Module_WebPage, 'Module_WebPage');

},{"./Module_WebPage.template":50}],50:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var templates = {
  iframe: iframe,
  youtube: youtube,
  ted: ted,
  popUpButtons: popUpButtons
};
exports.templates = templates;

function iframe(_ref) {
  var HShell = _ref.HShell,
      url = _ref.url,
      SL = _ref.SL,
      headerOptions = _ref.headerOptions,
      theme = _ref.theme,
      isHomeActive = _ref.isHomeActive,
      params = _ref.params,
      moduleType = _ref.moduleType,
      module = _ref.module,
      onNavigation = _ref.onNavigation;
  url = HShell.globalSetup.devMode ? "".concat(url, "?").concat(Math.random() * 100000) : url;
  UI = SL && SL.UI || {};
  return "\n        <div\n            id=\"oneIframePopUpContainer\"\n            class=\"abs ModuleWebPage\"\n            style=\"min-height: ".concat(HShell.autoSetup.fullFrameHeight, "vh\"\n            data-moduleType=\"").concat(moduleType, "\"\n            data-moduleTheme=\"").concat(theme, "\"\n        >\n            ", "\n            ").concat(HShell.core.getComponent('Module_Navigation').init({
    module: module,
    onNavigation: onNavigation
  }), "\n            <div class=\"oneIframeConentInner\" style=\" ").concat(window.miHCalc('- 130px'), " \">\n                <iframe\n                    src=\"").concat(url, "\"\n                    frameborder=\"0\"\n                    params=\"").concat(params, "\"\n                    data-moduleType=\"").concat(moduleType, "\"\n                    class=\"ModuleWebPage__Iframe WPHeightMod\"\n                    data-onload=\"iframeLoaded\"\n                ></iframe>\n            </div>\n            ", "\n        </div>';\n    ");
}

function youtube(_ref2) {
  var HShell = _ref2.HShell,
      url = _ref2.url,
      SL = _ref2.SL,
      headerOptions = _ref2.headerOptions,
      theme = _ref2.theme;
  var sourceUrl = url.slice(url.indexOf('youtube.com/watch?v=') + 20, url.length);
  return "\n        <div id=\"oneYoutubePlayerContainer\" class=\"abs\">\n            ".concat(HShell.core.getComponent('Module_Header').init(headerOptions), "\n            <div class=\"oneYoutubePlayerContainerInner\">\n                <iframe\n                    src=\"https://www.youtube.com/embed/").concat(sourceUrl, "\"\n                    frameborder=\"0\"\n                    allowfullscreen\n                ></iframe>\n            </div>\n            ").concat(footer_ThemeMain({
    SL: SL,
    HShell: HShell,
    theme: theme
  }), "\n        </div>\n    ");
}

function ted(_ref3) {
  var HShell = _ref3.HShell,
      url = _ref3.url,
      SL = _ref3.SL,
      headerOptions = _ref3.headerOptions,
      theme = _ref3.theme;
  var sourceURL = url.replace('www.ted.com', 'embed.ted.com');
  return "\n        <div id=\"oneYoutubePlayerContainer\" class=\"abs\">\n            ".concat(HShell.core.getComponent('Module_Header').init(headerOptions), "\n            <div class=\"oneYoutubePlayerContainerInner\">\n                <iframe\n                    src=\"").concat(sourceURL, "\"\n                    frameborder=\"0\"\n                    scrolling=\"no\"\n                    webkitAllowFullScreen\n                    mozallowfullscreen\n                    allowFullScreen\n                ></iframe>\n            </div>\n            ").concat(footer_ThemeMain({
    SL: SL,
    HShell: HShell,
    theme: theme
  }), "\n        </div>\n    ");
}

function footer_ThemeMain(_ref4) {
  var SL = _ref4.SL,
      HShell = _ref4.HShell,
      theme = _ref4.theme,
      isHomeActive = _ref4.isHomeActive;

  if (theme === HShell.consts.iframeTemplates.bigHomeButton) {
    return '';
  }

  return "\n        <div class=\"vidPopFooterContainer WPWidthMod iframePage buttonsContainer\" aria-live=\"off\">\n            <div\n                class=\"vidPopClose iconHolder iframePopClose rel ".concat(isHomeActive ? '' : 'inactive', "\"\n                role=\"button\"\n                tabindex=\"0\"\n                aria-label=\"").concat(SL.UI.home, ": control + alt + h\"\n                name=\"").concat(SL.UI.home, ": control + alt + h\"\n                data-uniclick=\"onIframeCloseClicked\"\n            >\n                <span>").concat(SL.UI.home, "</span>\n                <span\n                    class=\"close iconHolder\"\n                    aria-hidden=\"true\"\n                >\n                    ").concat(HShell.consts.iconsObj.icon_arrow_forward, "\n                </span>\n            </div>\n        </div>\n    ");
}

function popUpButtons(HShell, UI) {
  return "\n            <div class=\"buttonsContainer\" aria-live=\"off\">\n                <span data-uniclick=\"onDialogNoButtonClicked\">\n                    ".concat(HShell.core.getComponent('Button').init({
    id: 'videoContinueReskin',
    text: UI.label_No
  }), "\n                </spn>\n\n                <span data-uniclick=\"onDialogYesButtonClicked\">\n                    ").concat(HShell.core.getComponent('Button').init({
    id: 'videoCloseReskin',
    text: UI.label_Yes
  }), "\n                </spn>\n            </div>\n        ");
}

},{}],51:[function(require,module,exports){
var _NewToCompany = require("./NewToCompany.template");

var HShell = window.HShell || {};

function NewToCompany() {
  this.SL = HShell.content.selected_languageObj;
  this.fullCourseSelected = true;
}

function buttonsCommon() {
  $('#SCORM_Container, body').scrollTop(0);
  window.gotoController('next');
}

NewToCompany.prototype.onFullCourseClicked = function (a, ev) {
  if (!$(ev.target).closest('.uiButton').hasClass('active')) {
    $(this._wrapper).find('#roleFirstBTNContainer .uiButton').removeClass('active').attr('aria-checked', 'false');
    $(ev.target).closest('.uiButton').attr('aria-checked', 'true').addClass('active');
    $('#btn_roleNewToCompanyNext').removeClass('inactive').attr('disabled', false).attr('aria-disabled', 'false');
    this.fullCourseSelected = true;
    setTimeout(function () {
      HShell.a11y.speak($(ev.target).text() + ' activated');
    }, 500);
  }
};

NewToCompany.prototype.onPreAssessmentClicked = function (a, ev) {
  if (!$(ev.target).closest('.uiButton').hasClass('active')) {
    $(this._wrapper).find('#roleFirstBTNContainer .uiButton').removeClass('active').attr('aria-checked', 'false');
    $(ev.target).closest('.uiButton').attr('aria-checked', 'true').addClass('active');
    $('#btn_roleNewToCompanyNext').removeClass('inactive').attr('disabled', false).attr('aria-disabled', 'false');
    this.fullCourseSelected = false;
  }
};

NewToCompany.prototype.onNextClicked = function () {
  if ($('#btn_roleNewToCompanyNext').hasClass('inactive')) {
    return;
  }

  $('#eLHeaderDescriptionContainer').addClass('mobileHidden');

  if (this.fullCourseSelected) {
    HShell.contentSetup.isFullCourse = true;
    HShell.contentSetup.skip_pre_a = true;
    HShell.content.roleNoPreAssessment = true;
  } else {
    HShell.contentSetup.isFullCourse = false;
    HShell.contentSetup.skip_pre_a = false;
    HShell.content.roleNoPreAssessment = false;
  }

  buttonsCommon();
};

NewToCompany.prototype.onComponentRender = function () {
  HShell.utils.trace('4. - gotoNewToCompany() executed'); // $(this._wrapper).find('#btn_roleNewToCompanyYes .langItem').addClass('active');

  if (typeof HShell.contentSetup.isFullCourse !== 'undefined') {
    if (HShell.contentSetup.isFullCourse) {
      $(this._wrapper).find('.uiButton#btn_roleNewToCompanyYes').click();
    } else {
      $(this._wrapper).find('.uiButton#btn_roleNewToCompanyNo').click();
    }
  } else {
    $(this._wrapper).find('.uiButton').first().focus();
  } //timeout in order to be read after the title.


  setTimeout(function () {
    HShell.a11y.speak($('#roleNewToCompanyTitleContainer, #roleNewToCompanyContentContainer').text());
  }, HShell.consts.pageLoadDelayA11YRead);
  HShell.storage.commitData('low');
};

NewToCompany.prototype.render = function () {
  if (!HShell.contentSetup.language_select) {
    $('#eLHeaderDescriptionContainer').removeClass('mobileHidden');
  }

  return _NewToCompany.templates.main({
    HShell: HShell,
    SL: this.SL,
    onFullCourse: this.onFullCourseClicked.bind(this),
    onPreAssessment: this.onPreAssessmentClicked.bind(this),
    onNextClick: this.onNextClicked.bind(this)
  });
};

HShell.core.registerComponent(NewToCompany, 'NewToCompany');

},{"./NewToCompany.template":52}],52:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var templates = {
  main: main
};
exports.templates = templates;

function main(_ref) {
  var HShell = _ref.HShell,
      SL = _ref.SL,
      onFullCourse = _ref.onFullCourse,
      onPreAssessment = _ref.onPreAssessment,
      onNextClick = _ref.onNextClick;
  var subHeaderText = SL.UI.roleNewToCompanyContentITPurple;
  return "\n        <div id=\"newToCompanyContainer\" aria-live=\"polite\">\n            <h2 id=\"roleNewToCompanyTitleContainer\" class=\"elSubTitleContainer\" >".concat(SL.UI.roleNewToCompanyTitleIT, "</h2>\n            <div id=\"roleNewToCompanyContentContainer\">\n                ").concat(subHeaderText ? "<p class=\"elSubContentContainer purple\">".concat(subHeaderText, "</p>") : '', "\n                <p class=\"elSubContentContainer\">").concat(SL.UI.roleNewToCompanyContentIT, "</p>\n                <p class=\"elSubContentContainer\">").concat(SL.UI.roleNewToCompanyContentITMore, "</p>\n            </div>\n\n            <div class=\"buttonsContainer\" id=\"roleFirstBTNContainer\" aria-live=\"off\">\n                ").concat(HShell.core.getComponent('Button').init({
    id: 'btn_roleNewToCompanyYes',
    text: 'label_fullCourse',
    onClick: onFullCourse,
    ariaRole: 'radio',
    attributesString: 'aria-checked="false"'
  }), "\n                ").concat(HShell.core.getComponent('Button').init({
    id: 'btn_roleNewToCompanyNo',
    text: 'preTitle',
    onClick: onPreAssessment,
    ariaRole: 'radio',
    attributesString: 'aria-checked="false"'
  }), "\n            </div>\n        </div>\n        <div class=\"nextBtnContainer\" id=\"roleNextBTNContainer\" aria-live=\"off\">\n            ").concat(HShell.contentSetup.language_select ? HShell.core.getComponent('Button').init({
    id: 'btn_previousScreen',
    text: 'previous'
  }) : '', "\n            ").concat(HShell.core.getComponent('Button').init({
    id: 'btn_roleNewToCompanyNext',
    text: 'next',
    onClick: onNextClick,
    classes: 'inactive',
    attributesString: 'disabled="true" aria-disabled="true"'
  }), "\n        </div>\n    ");
}

},{}],53:[function(require,module,exports){
var _Button = require("./Button.template");

var HShell = window.HShell || {};

function Button(_ref) {
  var HShell = _ref.HShell;
  this.HShell = HShell;
  this.SL = HShell.content.selected_languageObj;
}

Button.prototype.onButtonPress = function (ev) {
  if (this.onClick) {
    this.onClick(this.payload, ev);
  }
};

Button.prototype.render = function (_ref2) {
  var _ref2$id = _ref2.id,
      id = _ref2$id === void 0 ? '' : _ref2$id,
      _ref2$text = _ref2.text,
      text = _ref2$text === void 0 ? '' : _ref2$text,
      _ref2$icon = _ref2.icon,
      icon = _ref2$icon === void 0 ? undefined : _ref2$icon,
      _ref2$classes = _ref2.classes,
      classes = _ref2$classes === void 0 ? '' : _ref2$classes,
      onClick = _ref2.onClick,
      payload = _ref2.payload,
      attributesString = _ref2.attributesString,
      ariaRole = _ref2.ariaRole;
  var textString = this.SL.UI[text] || text,
      // --- In case that the parameter is not part of the SL.UI object, but a custom string
  iconElement = this.HShell.consts.iconsObj[icon]; // text = textString ? textString : text;

  this.onClick = onClick;
  this.payload = payload;
  return _Button.templates.main({
    id: id,
    textLangItem: text,
    textString: textString,
    iconElement: iconElement,
    classes: classes,
    onClick: onClick,
    payload: payload,
    attributesString: attributesString,
    ariaRole: ariaRole
  });
};

Button.prototype.onDestroy = function () {};

HShell.core.registerComponent(Button, 'Button');

},{"./Button.template":54}],54:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var templates = {
  main: function main(_ref) {
    var id = _ref.id,
        textLangItem = _ref.textLangItem,
        textString = _ref.textString,
        iconElement = _ref.iconElement,
        classes = _ref.classes,
        onClick = _ref.onClick,
        attributesString = _ref.attributesString,
        ariaRole = _ref.ariaRole;
    var iconHtml = iconElement ? "<div class=\"iconHolder\" aria-hidden=\"true\">".concat(iconElement, "</div>") : '',
        attr_onClick = onClick ? 'data-uniclick="onButtonPress"' : '';
    return "\n            <div class=\"uiButton inlineBlock noSelect ".concat(classes, "\" role=\"").concat(ariaRole || 'button', "\" id=\"").concat(id, "\" tabindex=\"0\" ").concat(attr_onClick, " ").concat(attributesString || '', ">\n                <div class=\"buttonText langItem\" data-languageItem=\"").concat(textLangItem, "\">").concat(textString, "</div>\n                ").concat(iconHtml, "\n            </div>\n        ");
  }
};
exports.templates = templates;

},{}],55:[function(require,module,exports){
var _HomeButton = require("./HomeButton.template");

var HShell = window.HShell || {};

function HomeButton() {}

HomeButton.prototype.render = function (_ref) {
  var onClick = _ref.onClick,
      ariaLabel = _ref.ariaLabel;

  this.onHomeButtonClicked = onClick || function () {};

  return _HomeButton.templates.main({
    ariaLabel: ariaLabel
  });
};

HShell.core.registerComponent(HomeButton, 'HomeButton');

},{"./HomeButton.template":56}],56:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var templates = {
  main: main
};
exports.templates = templates;

function main(_ref) {
  var ariaLabel = _ref.ariaLabel;
  return "\n        <div\n            class=\"HomeButton\"\n            data-uniclick=\"onHomeButtonClicked\"\n            tabindex=\"0\"\n            role=\"button\"\n            aria-label=\"Home button ".concat(ariaLabel, "\"\n            aria-label=\"Go back to module selection screen\"\n        ></div>\n    ");
}

},{}],57:[function(require,module,exports){
var _app = require("./app.template");

var HShell = window.HShell || {},
    appPreloadedListener;

function app() {}

app.prototype.onAppPreloaded = function () {
  this._wrapper.querySelector('#SCORM_Container').classList.remove('loading');

  HShell.core.$off(appPreloadedListener);
};

app.prototype.onComponentRender = function () {
  appPreloadedListener = HShell.core.$on('appPreloaded', this.onAppPreloaded.bind(this));
};

app.prototype.render = function () {
  return _app.templates.main();
};

HShell.core.registerComponent(app, 'app');

},{"./app.template":58}],58:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = void 0;
var templates = {
  main: function main() {
    return "\n            <div id=\"SCORM_Container\" class=\"rel fullFrameHeight fullFrameMinHeight loading\">\n                <span class=\"vAlignHelper\"></span>\n                <span>Loading ...</span>\n            </div>\n        ";
  }
};
exports.templates = templates;

},{}]},{},[57,1,3,15,17,26,51,30,28,53,55,5,9,7,24,39,42,45,49,34,36,11,13,19,21,47]);
