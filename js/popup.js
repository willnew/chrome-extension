document.addEventListener('DOMContentLoaded', function () {
  var what = $("#eventTitle");
  var where = $("#eventAddress");
  var when_Time = $("#eventTime");
  var when_Date = $("#eventDate");
  var banner_url = $("#eventIcon");
  var timezone = $("#eventTimezone");
  var link = $("#eventLink");
  var imgBtn = $('#imgBtn');
  var eventAddressList = [];
  var eventDateList = [];
  var srcList = [];

  bindEvent();
  checkUserSigninStatus();
  
  function planSubmit(e) {
    $.post(PlancastSettings.plancastHost + 'plugin/isSignin', {},
    function(data) {
      if (data.msg == 'success') {
        if (data.session_facebook_user_id) {
          $("#facebookBinded").val(true);
        } if (data.session_twitter_user_id) {
          $("#twitterBinded").val(true);
        } if (data.session_linkedin_user_id) {
          $("#linkedinBinded").val(true);
        }
        validateBeforeSubmit();
      } else {
        $("#popupForm").fadeOut("slow", function() {
          $("#userLoginForm").fadeIn("slow");
          $("#notLogin").show();
        });        
      }
    }, 'json');
  }

  function validateBeforeSubmit(e) {
    var plan = {
      what_string: what.val(),
      where_string: where.val(),
      when_string: when_Date.val() + " " + when_Time.val(),
      when_start: '',
      when_stop: '',
      banner_url: $("#includeBanner:checked").length>0 ? banner_url.attr("src") : '',
      external_url: link.val(),
      timezone: timezone.val(),
      organize_type: 2,
    };
    doSubmit(plan); 
  }

  function doSubmit(plan) {
    if (formatPlanForm(plan.what_string, plan.where_string, plan.when_string, plan.timezone)) {
      $.get(PlancastSettings.plancastHost + 'plan/pluginWhenStringValidate', {
          plan: plan
        }, function(data) {
          if (data.error) {
            showMessageAtTop($("#addPlanFailed"));
          } else {
            if (data.when_string_original.split(" ").length == 2 && data.when_string.split(",").length != 4) {
              showMessageAtTop($("#addPlanFailed"));
            } else {
              plan.when_start = data.when_start;
              plan.when_stop = data.when_stop;
              $("#popupForm").fadeOut('slow',function() {
                $("#loading").show();
                submitPlanInfo(plan);
              });
            }
          }
        },
      'json');
    } else {
      showMessageAtTop($("#addPlanFailed"));
    }
  }

  function submitPlanInfo(plan) {
    var syndicate = checkBindedItems();
    $.post(PlancastSettings.plancastHost + 'plan/pluginadd',{
      plan: plan,
      syndicate: syndicate
    }, function(data) {
      $("#loading").hide();
      if (data.msg == 'success') {
        var plancastEvent = "<a href='" + data.url + "' target='_blank'>" + data.url + "</a>";
        $("#addPlanSuccess").append("<br />Click this link to go to your plan detail page: " + plancastEvent);
        connectionFailedMessageAppend();
        $("#addPlanSuccess").show();
      } else {
        $("#popupForm").show();
        showMessageAtTop($("#addPlanFailed"));
      }
    }, 
  'json');    
  }

  function keyActionListener(e) {
    if (e.keyCode == 13) {
      userLogin();
    }
  }

  function userLogin(e) {
    var username = $("#username").val();
    var password = $("#password").val();
    if (userInfoValid(username, password)) {
      $("#loginError").hide();
      $("#notLogin").hide();
      $.post(PlancastSettings.plancastHost + 'plugin/signin', {
        username: username,
        password: password
      }, function(data) {
          if (data.msg == 'success') {
            $("#userInfo").text($("#userInfo").text() + data.session_user_name);
            $("#userInfoContainer").show();
            $("#userLoginForm").fadeOut("slow", function() {
              $("#popupForm").fadeIn("slow", function() {
                planSubmit();
              });
            });
          } else {
            $("#loginError").fadeIn("slow");
          }
      }, 'json');
    }
  }

  function addressChooser(e) {
    var next = 0;
    for (var i=0; i<eventAddressList.length; i++) {
      if (eventAddressList[i] == where.val()) {
        if (i != eventAddressList.length - 1) {
          next = i + 1;
        }
      }
    }
    where.val(eventAddressList[next]);
  }

  function dateChooser(e) {
    var next = 0;
    for (var i=0; i<eventDateList.length; i++) {
      if (eventDateList[i] == (when_Date.val() + " " + when_Time.val())) {
        if (i != eventDateList.length - 1) {
          next = i + 1;
        }
      }
    }
    when_Date.val(eventDateList[next].split(" ")[0]);
    when_Time.val(eventDateList[next].split(" ")[1]);
  }

  function imageChooser(e) {
    var next = 0;
    for (var i=0; i<srcList.length; i++) {
      if (srcList[i] == banner_url.attr("src")) {
        if (i != srcList.length - 1) {
          next = i + 1;
        }
      }
    }
    banner_url.attr("src", srcList[next]);    
  }

  function bindEvent() {
    document.querySelector("#eventAddressContainer a").addEventListener('click', addressChooser);
    document.querySelector("#eventDateContainer a").addEventListener('click', dateChooser);
    document.querySelector("#eventImageAction a").addEventListener('click', imageChooser);
    document.querySelector("#eventAddress").addEventListener('focus', removeClass);
    document.querySelector("#eventDate").addEventListener('focus', datePicker);
    document.querySelector("#eventTime").addEventListener('focus', timePicker);
    document.querySelector("#popupSubmit").addEventListener('click', planSubmit);
    document.querySelector("#loginSubmit").addEventListener('click', userLogin);  
    document.querySelector("#notLoginClose").addEventListener('click', closeAlert);
    document.querySelector("#loginErrorClose").addEventListener('click', closeAlert);
    document.querySelector("#addPlanSuccessClose").addEventListener('click', closeAlert);
    document.querySelector("#addPlanFailedClose").addEventListener('click', closeAlert);
    document.querySelector("#validatePlanFailedClose").addEventListener('click', closeAlert);
    document.querySelector("#username").addEventListener('keydown', keyActionListener);
    document.querySelector("#password").addEventListener('keydown', keyActionListener);
    document.querySelector("#username").addEventListener('focus', removeClass);
    document.querySelector("#password").addEventListener('focus', removeClass);
  }

/*************************************************
To load Date and Address by connecting our service
**************************************************/
  setTimeout(function() {
    chrome.tabs.getSelected(null,function(tab) {
      chrome.tabs.sendRequest(tab.id, {action: tab.url}, function(response) {
          console.log(response);
          srcList = response.imgsrc;
          var eventDate = response.eventDate;
          var eventTitle = response.eventTitle;
          var eventAddress = response.eventAddress;

          if (!eventTitle) {
              eventTitle = tab.title;
          }

          /***************************************
          Load event address by connecting Yahoo Placeholder through our service
          ****************************************/
          var addressInfo = ServiceConnection.addressFormater(eventAddress, tab.url, eventAddressList);
          eventAddress = addressInfo.eventAddress;
          eventAddressList = addressInfo.eventAddressList;

          /***************************************
          Load event date by connecting our Natty service
          ****************************************/
          var dateInfo = ServiceConnection.dateFormater(eventDate, response.data, eventDateList);          
          eventDate = dateInfo.eventDate;
          eventDateList = dateInfo.eventDateList;

          /****************************************
          initial form datas
          *****************************************/
          if (srcList && srcList.length > 0) {
            if (srcList.length > 1) {
              $("#eventImageAction a").show();
            }
            $("#eventIcon").attr("src", srcList[0]);
          } else {
            $("#eventImageAction").hide();
            $("#includeBanner").attr("checked", false);
            $("#eventIcon").hide();
            $("#warningMessage").show();
          }
          what.val(eventTitle);
          where.val(eventAddress);
          link.val(tab.url);
          $("#loading").hide();
          $("#popupForm").show();
          if (eventAddressList && eventAddressList.length > 1) {
            where.removeClass("input-xlarge").addClass("popup-input-medium");
            $("#eventAddressContainer a").show();
          }
          if (eventDateList.length > 0) {
            when_Date.val(eventDate.split(" ")[0]);
            when_Time.val(eventDate.split(" ")[1]);
            when_Time.show();
            when_Date.removeClass("input-xlarge").addClass("popup-input-medium");
            if (eventDateList.length > 1) {
              $("#eventDateContainer a").show();         
            }
          }

          if (!when_Date.val()) {
              when_Date.val(PlancastSettings.guessDateFailed);
              when_Date.parent().parent().addClass("error");            
          }
          
          when_Date.datepicker().on('changeDate', function() {
            when_Date.datepicker('hide');
          });
      });
    });    
  } , 3000);

});



/**********************************
Get message which we need from page
***********************************/
chrome.extension.onRequest.addListener(  
  function(request, sender, sendResponse) {  
    var pageUrl = request.action;
    var pageInfo = {};
    var eventDate = "";
    var eventTitle = "";
    var eventAddress = "";
    var srcList = [];
    if (pageUrl.indexOf('http://www.meetup.com/') != -1
        || pageUrl.indexOf('https://www.meetup.com/') != -1) {
      var meetUpTime = "";
      eventTitle = $("#event-title h1").text();
      if ($("[class='event-where-address subtext']").text()) {
        eventAddress = $.trim($("[class='event-where-address subtext']").text());
      } else {
        eventAddress = $("#event-where-display .headline").text();
      }
      var eventTime = "";
      if ($("#event-title h3").text()) {
        var timeArea = $("#event-title h3").text().replace("attended.", "");
        meetUpTime = timeArea.substring(0, timeArea.lastIndexOf("."));
      } else {
        eventTime = $($("time")[0]).find("p");
        for (var i=0; i<eventTime.length; i++) {
          meetUpTime += $(eventTime[i]).text() + " ";
        }      
      }
      eventDate = meetUpTime;
    } else if (pageUrl.indexOf("http://www.active.com/") != -1
        || pageUrl.indexOf("https://www.active.com/") != -1) {
        eventTitle = $.trim($("#ed-head h1").text())? $.trim($("#ed-head h1").text()) :
                        $.trim($("#quickInfo .h1text").text());
        eventDate = $.trim($("#row-date p").text())? $.trim($("#row-date p").text()) :
                        $.trim($("#startDateTimeTitle").text());
        eventAddress = $.trim($("#row-address p").text())?$.trim($("#row-address p").text()).replace(/[\s+\t+]+/ig," ") :
                        $.trim($("#locationLink").text()).replace(/[\s+\t+]+/ig," ");
    } else if (pageUrl.indexOf("http://www.facebook.com/") != -1
        || pageUrl.indexOf("https://www.facebook.com/") != -1) {
        eventTitle = $.trim($("[class='mbs fbEventHeadline fsxl fwb']").text());
        if (!eventTitle) {
          eventTitle = $.trim($("[class='mbs fbEventHeadline fsxl fwb fcb']").text());
        }
        eventAddress = $("[class='fsl fwb fcb']").text();
        addressDetail = $.trim($("[class='uiCollapsedList uiCollapsedListHidden']").text());
        if (addressDetail) {
            eventAddress += " " + addressDetail;
        }
        eventDate = $.trim($("[class='clearfix pvm prm']").text());
        if ($("[class='clearfix pvm']").html()) {
          if ($("[class='clearfix pvm']").html().indexOf("</a>") == -1) {
            eventDate += " " + $("[class='clearfix pvm']").text();
          }          
        }
    } else if (pageUrl.indexOf(".eventbrite.com/") != -1) {
        eventTitle = $.trim($("#event_header .summary").text());
        eventDate = $.trim($("#event_header h2:first").text());
        eventAddress = $.trim($("#event_header #event_network").text());
        if (eventDate == eventAddress) {
          eventDate = "";
        }
    } else if (pageUrl.indexOf("http://event.mosh.cn/") != -1) {
      eventTitle = $.trim($($($(".info_grid")[0]).find(".title")[0]).text());
      eventDate = formateMoshDate($.trim($($($(".info_grid")[0]).find(".tile")[1]).find(".item").text()));
      eventAddress = $.trim($($($(".info_grid")[0]).find(".tile")[2]).find(".item").text());
    } else if (pageUrl.indexOf("http://event.weibo.com") != -1) {
      eventTitle = $.trim($($("h3.ev_title")[0]).text());
      var eventItems = $($("div.ev_detail_cont")[0]).find("p");
      eventItems.each(function() {
        if ($($(this).find("span")[0]).text() == "开始时间：" ||
         $($(this).find("span")[0]).text() == "时　　间：") {
          eventDate = formateWeiboDate($.trim($($(this).find("span")[1]).text()));
        }
        if ($($(this).find("span")[0]).text() == "地　　点：") {
          eventAddress = $.trim($($(this).find("span")[1]).text());
        }
      });
    } else if (pageUrl.indexOf("http://www.douban.com/event/") != -1) {
      eventTitle = $.trim($($($("#event-info .event-info")[0]).find("h1")[0]).text());
      var eventItems = $($("#event-info .event-info")[0]).find(".event-detail");
      eventItems.each(function() {
        if ($.trim($(this).find(".pl").text()) == "时间:") {
          eventDate = formateDoubanDate($.trim($(this).text().replace("时间:", "")));
        }
        if ($.trim($(this).find(".pl").text()) == "地点:") {
          eventAddress = $.trim($(this).text().replace("地点:", ""));
        }
      });
    } else if (pageUrl.indexOf("http://event.t.qq.com/") != -1) {
      eventTitle = $.trim($(".actinfo_top h2").text());
      var eventItems = $("ul.actinfo_list li");
      eventItems.each(function() {
        if ($.trim($(this).find(".font_c9").text()) == "活动时间：") {
          eventDate = formateQQDate($.trim($(this).text().replace("活动时间：", "")));
        }
        if ($.trim($(this).find(".font_c9").text()) == "活动地点：") {
          eventAddress = $.trim($(this).text().replace("活动地点：", ""));
        }
      });
    }

    function formateDoubanDate(dateString) {
      return dateString.replace(new RegExp("月","gm"), "/").replace(new RegExp("日","gm"), " ").replace(/[\s+\t+]+/ig," ");
    }

    function formateQQDate(dateString) {
      return dateString.replace(new RegExp("月","gm"), "/").replace(new RegExp("日","gm"), " ").replace(/[\s+\t+]+/ig," ");
    }

    function formateWeiboDate(dateString) {
      return dateString.replace(new RegExp("月","gm"), "/").replace(new RegExp("日","gm"), " ").replace(/[\s+\t+]+/ig," ");      
    }

    function formateMoshDate(dateString) {
      var dateList = dateString.split(" ");
      var timeString = dateList[1].split("-")[0];
      var dateString = dateList[0];
      var expectDateString = dateString.split("-")[0];
      var splitByYear = expectDateString.split("年");
      var yearString = splitByYear[0];
      var splitByMonth = splitByYear[1].split("月");
      var monthString = splitByMonth[0];
      var dayString = splitByMonth[1].replace("日", "");
      return monthString + "/" + dayString + "/" + yearString + " " + timeString;
    }

    var pageImgs = $("img");
    for (var i=0; i<pageImgs.length; i++) {
      var singleImg = pageImgs[i];
      if (singleImg.width >= 50 && singleImg.height >= 50 && $.inArray(singleImg.src, srcList) == -1) {
        srcList.push(singleImg.src);
      }
    }
    var textBody = window.document.documentElement.innerText.replace(/\ "/g, "").replace(/\s*/g, "");
    sendResponse({  
      eventTitle: eventTitle,
      eventAddress: eventAddress,
      eventDate:  eventDate,
      data: textBody,
      imgsrc: srcList
    });  
}); 
