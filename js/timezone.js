$(function() {
	var timezoneHTML = '<select class="input-xlarge" id="eventTimezone"><option value="Pacific/Midway">(GMT-11:00) Midway Island</option><option value="Pacific/Pago_Pago">(GMT-11:00) Samoa</option><option value="Pacific/Honolulu">(GMT-10:00) Hawaii</option><option value="America/Juneau">(GMT-09:00) Alaska</option><option value="America/Los_Angeles">(GMT-08:00) Pacific Time (US &amp; Canada)</option><option value="America/Tijuana">(GMT-08:00) Tijuana, Baja California</option><option value="America/Phoenix">(GMT-07:00) Arizona</option><option value="America/Chihuahua">(GMT-07:00) Chihuahua, Mazatlan</option><option value="America/Denver">(GMT-07:00) Mountain Time (US &amp; Canada)</option><option value="America/Guatemala">(GMT-06:00) Central America, Saskatchewan</option><option value="America/Chicago">(GMT-06:00) Central Time (US &amp; Canada)</option><option value="America/Mexico_City">(GMT-06:00) Guadalajara, Mexico city</option><option value="America/Indiana/Indianapolis">(GMT-05:00) Indiana (East)</option><option value="America/Bogota">(GMT-05:00) Bogota, Lima, Quito, Rio Branco</option><option value="America/New_York">(GMT-05:00) Eastern Time (US &amp; Canada)</option><option value="America/Halifax">(GMT-04:00) Atlantic time (Canada)</option><option value="America/Santiago">(GMT-04:00) Santiago, Manaus</option><option value="America/Caracas">(GMT-05:30) Caracas, La Paz</option><option value="America/La_Paz">(GMT-04:00) La Paz</option><option value="America/St_Johns">(GMT-04:30) Newfoundland</option><option value="America/Godthab">(GMT-03:00) Greenland</option><option value="America/Montevideo">(GMT-03:00) Montevideo</option><option value="America/Argentina/Buenos_Aires">(GMT-03:00) Buenos Aires, Georgetown, Brasilia</option><option value="Atlantic/South_Georgia">(GMT-02:00) Mid-Atlantic</option><option value="Atlantic/Azores">(GMT-01:00) Azores</option><option value="Atlantic/Cape_Verde">(GMT-01:00) Cape Verde Is.</option><option value="Africa/Casablanca">(GMT+00:00) Casablanca</option><option value="GMT">(GMT+00:00) Greenwich Mean Time (GMT): Dublin, Edinburgh, Lisbon, London</option><option value="BST">(GMT+00:00) British Standard Time</option><option value="Africa/Monrovia">(GMT+00:00) Monrovia, Reykjavik</option><option value="Europe/Berlin">(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna</option><option value="Europe/Prague">(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague</option><option value="Europe/Paris">(GMT+01:00) Brussels, Copenhagen, Madrid, Paris</option><option value="Europe/Warsaw">(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb</option><option value="Africa/Algiers">(GMT+01:00) West Central Africa</option><option value="Asia/Amman">(GMT+02:00) Amman</option><option value="Europe/Athens">(GMT+02:00) Athens, Bucharest, Istanbul</option><option value="Asia/Beirut">(GMT+02:00) Beirut</option><option value="Africa/Cairo">(GMT+02:00) Cairo</option><option value="Africa/Johannesburg">(GMT+02:00) Harare, Pretoria</option><option value="Europe/Helsinki">(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius</option><option value="Asia/Jerusalem">(GMT+02:00) Jerusalem</option><option value="Europe/Minsk">(GMT+02:00) Minsk</option><option value="Africa/Windhoek">(GMT+02:00) Windhoek</option><option value="Asia/Baghdad">(GMT+03:00) Baghdad</option><option value="Asia/Kuwait">(GMT+03:00) Kuwait, Riyadh</option><option value="Europe/Moscow">(GMT+03:00) Moscow, St. Petersburg, Volgograd</option><option value="Africa/Nairobi">(GMT+03:00) Nairobi</option><option value="Asia/Tbilisi">(GMT+03:00) Tbilisi</option><option value="Asia/Tehran">(GMT+03:30) Tehran</option><option value="Asia/Muscat">(GMT+04:00) Abu Dhadi, Muscat</option><option value="Asia/Baku">(GMT+04:00) Baku</option><option value="Indian/Mauritius">(GMT+04:00) Port Louis</option><option value="Asia/Yerevan">(GMT+04:00) Yerevan</option><option value="Asia/Kabul">(GMT+04:30) Kabul</option><option value="Asia/Yekaterinburg">(GMT+05:00) Ekaterinburg</option><option value="Asia/Karachi">(GMT+05:00) Islamabad, Karachi</option><option value="Asia/Tashkent">(GMT+05:00) Tashkent</option><option value="Asia/Calcutta">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option><option value="IST">(GMT+05:30) Sri Jayawardenepura</option><option value="Asia/Katmandu">(GMT+05:45) Kathmandu</option><option value="Asia/Almaty">(GMT+06:00) Almaty, Novosibirsk</option><option value="Asia/Dhaka">(GMT+06:00) Astana, Dhaka</option><option value="Asia/Rangoon">(GMT+06:30) Yangon (Rangoon)</option><option value="Asia/Bangkok">(GMT+07:00) Bangkok, Hanoi, Jakarta</option><option value="Asia/Krasnoyarsk">(GMT+07:00) Krasnoyarsk</option><option value="Asia/Shanghai">(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi</option><option value="Asia/Irkutsk">(GMT+08:00) Irkutsk, Ulaan Bataar</option><option value="Asia/Kuala_Lumpur">(GMT+08:00) Kuala Lumpur, Singapore</option><option value="Australia/Perth">(GMT+08:00) Perth</option><option value="Asia/Taipei">(GMT+08:00) Taipei</option><option value="Asia/Tokyo">(GMT+09:00) Osaka, Sapporo, Tokyo</option><option value="Asia/Seoul">(GMT+09:00) Seoul</option><option value="Asia/Yakutsk">(GMT+09:00) Yakutsk</option><option value="Australia/Adelaide">(GMT+09:30) Adelaide</option><option value="Australia/Darwin">(GMT+09:30) Darwin</option><option value="Australia/Brisbane">(GMT+10:00) Brisbane</option><option value="Australia/Melbourne">(GMT+10:00) Canberra, Melbourne, Sydney</option><option value="Pacific/Guam">(GMT+10:00) Guam, Port Moresby</option><option value="Australia/Hobart">(GMT+10:00) Hobart</option><option value="Asia/Vladivostok">(GMT+10:00) Vladivostok</option><option value="Asia/Magadan">(GMT+11:00) Magadan, Solomon Is., New Caledonia</option><option value="Pacific/Auckland">(GMT+12:00) Auckland, Wellington</option><option value="Pacific/Fiji">(GMT+12:00) Fiji, Kamchatka, Marshall Is.</option><option value="Pacific/Tongatapu">(GMT+13:00) Nuku&#039;alofa</option></select>';
	$("#eventTimezoneContainer").html(timezoneHTML);
	var currentTimezone = -((new Date).getTimezoneOffset()/60);
	var options = $("#eventTimezone option");
	options.each(function() {
		if ($(this).text().indexOf(currentTimezone) != -1) {
			$(this).attr("selected", "selected");
		}
	});
});