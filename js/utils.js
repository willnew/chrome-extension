  function datePicker(e) {
    if ($(this).parent().parent().hasClass("error")) {
        $(this).parent().parent().removeClass("error");
        $(this).removeClass("input-xlarge").addClass("popup-input-medium").val("");
        $("#eventTime").show();
    }  
    $(this).datepicker();
  }

  function timePicker(e) {
    $(this).timePicker();
  }

  function removeClass(e) {
    if ($(this).parent().parent().hasClass("error")) {
        $(this).parent().parent().removeClass("error");
        $(this).val("");
    }
  }

  function closeAlert(e) {
    $(this).parent().fadeOut('slow', function() {
      $("#popupHeader").fadeIn('slow');
    });
  }

  function userInfoValid(username, password) {
    var flag = true;
    if (!username) {
      $("#username").parent().parent().addClass("error");
      falg = false;
    }
    if (!password) {
      $("#password").parent().parent().addClass("error");
      flag = false;
    }
    //need more?
    return flag;
  }

  function checkUserSigninStatus() {
    $.post(PlancastSettings.plancastHost + 'plugin/isSignin', {},
      function(data) {
        if (data.msg == 'success') {
          $("#userInfo").text($("#userInfo").text() + data.session_user_name);
          $("#userInfoContainer").show();
        }
      }, 
    'json');
  }

  function refreshPage() {
    window.location.reload(true);
  }

  function formatPlanForm(what, where, when, timezone) {
    var flag = true;
    if (!what || !where || !when || !timezone) {
      flag = false;
    } else if ($("#eventAddress").parent().parent().hasClass("error") || 
        $("#eventDate").parent().parent().hasClass("error")) {
        flag = false;
    } else if (what.length > 250 || where.length > 250 || when.length > 250) {
        flag = false;
    }
    return flag;
  }

  function showMessageAtTop(element) {
    $("#popupHeader").fadeOut('slow', function() {
      element.fadeIn('slow');
    });
  }

  function checkBindedItems() {
    var syndicate = [];
    if ($("#facebookLink:checked").length > 0 && $("#facebookBinded").val()) {
      syndicate.push("facebook");
    }
    if ($("#twitterLink:checked").length > 0 && $("#twitterBinded").val()) {
      syndicate.push("twitter");
    }
    if ($("#linkedinLink:checked").length > 0 && $("#linkedinBinded").val()) {
      syndicate.push("linkedin");
    }
    return syndicate;
  }

  function connectionFailedMessageAppend() {
    var connectFailed = false;
    if ($("#facebookLink:checked").length > 0 && !$("#facebookBinded").val()) {
      $("#addPlanSuccess").append(PlancastSettings.noConnection_facebook);
      connectFailed = true;
    }
    if ($("#twitterLink:checked").length > 0 && !$("#twitterBinded").val()) {
      $("#addPlanSuccess").append(PlancastSettings.noConnection_twitter);
      connectFailed = true;
    }
    if ($("#linkedinLink:checked").length > 0 && !$("#linkedinBinded").val()) {
      $("#addPlanSuccess").append(PlancastSettings.noConnection_linkedin);
      connectFailed = true;
    }
    if (connectFailed) {
      $("#addPlanSuccess").append(PlancastSettings.plancastUserSetting);
      $("#addPlanSuccess").append("[ <a href='" + PlancastSettings.userSettingUrl + "' target='_blank'>" + PlancastSettings.userSettingUrl + "</a> ]");
    }
  }

