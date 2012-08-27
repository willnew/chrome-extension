PlancastSettings = function(){

  var plancastHost = "http://plancast.com/";
  var serviceHost = "http://service.plancast.com/PlancastTest/";
  var noConnection_facebook = "<br />Your Facebook account is not connected with your Plancast account yet";
  var noConnection_twitter = "<br />Your Twitter account is not connected with your Plancast account yet";
  var noConnection_linkedin = "<br />Your Linkedin account is not connected with your Plancast account yet";
  var guessLocationFailed = "too hard to guess, please fill in correct location";
  var guessDateFailed = "too hard to guess, please choose correct date";
  var plancastUserSetting = "<br />Connect them now to share your plan with friends.";
  var userSettingUrl = "http://www.plancast.com/user/settings/external-services";

  return{
    plancastHost: plancastHost,
    serviceHost: serviceHost,
    noConnection_facebook: noConnection_facebook,
    noConnection_twitter: noConnection_twitter,
    noConnection_linkedin: noConnection_linkedin,
    guessLocationFailed: guessLocationFailed,
    guessDateFailed: guessDateFailed,
    plancastUserSetting: plancastUserSetting,
    userSettingUrl :userSettingUrl
  }
}();
