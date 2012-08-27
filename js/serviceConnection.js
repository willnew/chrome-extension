ServiceConnection = function() {

	var addressFormater = function(eventAddress, url, eventAddressList) {
      var AddressUrl = "";
      if (!eventAddress) {
        AddressUrl = PlancastSettings.serviceHost + 'AddressFormat?url="' + url + '"';
      } else {
        AddressUrl = PlancastSettings.serviceHost + 'AddressFormat?content="' + eventAddress + '"';
      }
      var xhr = new XMLHttpRequest();
      xhr.open("POST", AddressUrl, false);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          var matchesItem = JSON.parse(xhr.responseText).query.results.matches;
          if (matchesItem) {
            var addressList = matchesItem.match;
            if (addressList.length > 0) {
              for (var i=0; i<addressList.length; i++) {
                if ($.inArray(addressList[i].place.name, eventAddressList) == -1) {
                  eventAddressList.push(addressList[i].place.name);
                }
                  eventAddress = addressList[0].place.name;
              }
            } else {
              eventAddress = addressList.place.name;
            }

          } else {
            if (!eventAddress) {
                eventAddress = PlancastSettings.guessLocationFailed;
                $("#eventAddress").parent().parent().addClass("error");                
            }              
          }
        }
      }
      xhr.send();
      return {
      	eventAddress: eventAddress,
      	eventAddressList: eventAddressList
      }
	}

	var dateFormater = function(eventDate, text, eventDateList) {
      var dateUrl = "";
      var xhr = new XMLHttpRequest();
      if (!eventDate) {
        dateUrl = PlancastSettings.serviceHost + 'TimeFormat?text="' + text + '"';
      } else {
        dateUrl = PlancastSettings.serviceHost + 'TimeFormat?text="' + eventDate + '"';
      }
      xhr.open("POST", dateUrl, false);
      xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
          var dateList = JSON.parse(xhr.responseText).times;
      if (dateList.length > 0) {
        for (var i=0; i<dateList.length; i++) {
          var time = dateList[i].time;
          var displayDate = (time.month>8? (time.month+1): "0"+(time.month+1)) + "/" + (time.date>9? time.date : "0"+time.date) + "/" + (1900 + time.year);
          var displayTime = (time.hours>9? time.hours: "0"+time.hours) + ":" + (time.minutes>9? time.minutes : "0"+time.minutes);
          var timeStr = displayDate + " " + displayTime;
          if ($.inArray(timeStr, eventDateList) == -1) {
              if (i == 0) {
                eventDate = timeStr;
              }
              eventDateList.push(timeStr);
          }
        }
      } else {
            $("#eventDate").val(PlancastSettings.guessDateFailed);
            $("#eventDate").parent().parent().addClass("error");
          }
        }
      }
      xhr.send();
      return {
      	eventDate: eventDate,
      	eventDateList: eventDateList
      }
	}

	return{
		addressFormater: addressFormater,
		dateFormater: dateFormater
	}
}();