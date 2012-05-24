var searchForm;
window.addEvent("domready", function() {
	//    var txtSearch = $("txtSearch");
	//    if (txtSearch != null && txtSearch.value == ""){
	//        txtSearch.value = townpostcodeattraction
	//    }

    if ($("ddlNights") != null) {
        $("ddlNights").addEvent("change", SetFormCookie);
		if ($("ddlDate") != null)
            $("ddlDate").addEvent("change", SetFormCookie);
        $("ddlRoomType").addEvent("change", SetFormCookie);
        createDateDropdown();
    }

	if (Cookie.read("LateroomsProfile")
		&& JSON.decode(Cookie.read("LateroomsProfile")).languagecode == 'EN'
		&& JSON.decode(Cookie.read("LateroomsProfile")).countrycode == "AU") {
		townpostcodeattraction = defaultAuSearchText;
	}

    searchForm = document.forms["searchbox"] || document.forms["main"];
    $(searchForm).addEvent("submit", FormSubmit);

    if ($("search") != null) {
        $("search").addEvent("click", ShowSearchErrorMessage);
        $("search").addEvent("click", SearchButtonClicked);
    }

	$('txtSearch').addEvents({
		'focus': function() {
			if (this.get('value') == townpostcodeattraction) {
				this.set('value', '');
			}
		},
		'blur': SP2.replaceText
	});

	SP2.replaceText();
	 if ($('ysf1')) {
		 highlightDates({target:$$('.nights-dd')[0]});
		 checkAndHideSecondRows();
		 RefreshDefaultMinStayWarnings();
		 displayYouSaveMessages({target:$$('.nights-dd')[0]});
		 displayDateLevelAllocation();
		 displayRoomLevelAllocation()
	 }
});

var SP2 = function() {
	return {
		replaceText: function() {
			if (!$('txtSearch') )
				return;
			if ($('txtSearch').get('value') == '') {
				$('txtSearch').set('value', townpostcodeattraction);
			}
		}
	};
} ();


function createDateDropdown() {
    $$("select[name=d]").each(function(select, i) {
        var date = new Date(serverDate);
        //Add the "-- Arrival Date --" first element before the dates
        var day = date.getDate();
        day = day.toString();
        if (parseInt(day) < 10) day = "0" + day;
        var month = date.getMonth() + 1;
        month = month.toString();
        if (parseInt(month) < 10) month = "0" + month;
        month = month.toString();
        var year = date.getFullYear();
        year = year.toString();
        if (typeof (arrivalDate) != "undefined") {
            var firstOption = new Option(arrivalDate, year + month + day);
            select.options[0] = firstOption;
        }
        for (var d = 0; d < iDayWindow; d++) {
            day = date.getDate();
            day = day.toString();
            if (parseInt(day) < 10) day = "0" + day;
            var month = date.getMonth() + 1;
            month = month.toString();
            if (parseInt(month) < 10) month = "0" + month;
            year = date.getFullYear();
            year = year.toString();
            var option;
            // SAL 18/03/08 #3659. structure the drop down depending on the selected language
            switch (siteLang) {
                case "es":
                case "it":
                    option = new Option(shortDayName[date.getDay()] + ", " + date.getDate() + " " + shortMonthName[date.getMonth()] + " " + date.getFullYear(), year + month + day);
                    break;
                case "de":
                    option = new Option(shortDayName[date.getDay()] + " " + date.getDate() + ". " + shortMonthName[date.getMonth()] + " " + date.getFullYear(), year + month + day);
                    break;
                case "fr":
                    option = new Option(shortDayName[date.getDay()] + " " + date.getDate() + " " + shortMonthName[date.getMonth()] + " " + date.getFullYear(), year + month + day);
                    break;
                default:
                    option = new Option(shortDayName[date.getDay()] + " " + date.getDate() + " " + shortMonthName[date.getMonth()] + " " + date.getFullYear(), year + month + day);
                    break;
            }
            select.options[select.length] = option;
            if (date.valueOf() == searchDate.valueOf()) option.selected = true;
            date.setDate(date.getDate() + 1);
        }
    });
}

function FormSubmit() {
    var action = searchForm.action.replace(/\?.*/,"");
    if (action.indexOf("hotel-reservations") != -1)
        return;
    
    if(action.indexOf("Hotels.aspx") != -1) {
        action += GetParam("k");
        action += GetParam("d") + GetParam("n") + GetParam("rt");
    }
    else if (action.indexOf("Hotels.aspx") == -1) {
        if( $("ddlDate") && $("ddlDate")[0].value != $("ddlDate").value) {
        action += GetParam("d") + GetParam("n") + GetParam("rt");
    }
    }
    if (searchForm["cso"] != null) {
        action += GetParam("cso");
    }
    searchForm.action = action.replace(/&/, "?");
}
function GetParam(name) {
    return "&" + name + "=" + searchForm[name].value;
}

function ShowSearchErrorMessage(e) {
    e = new Event(e);
    var regionPage = window.location.href.match(/r[0-9A-Za-z_-]+\.aspx.*$/);
    var hotelPage = IsHotelDetailsPage();
    var txtSearch = $("txtSearch");
    if (txtSearch.value == "" || txtSearch.value == townpostcodeattraction && (!regionPage || hotelPage) || txtSearch.value == "Hotel, attraction, postcode")
    {
        alert(ErrNoSearchText);
        e.stop();
    }
}

function IsHotelDetailsPage() {
    return (
                window.location.href.indexOf(/hotel-reservations/) > 0 ||
                window.location.href.indexOf(/hotel-directions/) > 0 ||
                window.location.href.indexOf(/hotel-facilities/) > 0 ||
                window.location.href.indexOf(/hotel-pictures/) > 0 ||
                window.location.href.indexOf(/hotel-videos/) > 0 ||
                window.location.href.indexOf(/guidebook/) > 0 ||
                window.location.href.indexOf(/hotel-special-offers/) > 0 ||
                window.location.href.indexOf(/hotel-reviews/) > 0 
            )
 }


function SetFormCookie(e)
{
	if($("ddlNights")) { document.cookie = "n=" + $("ddlNights").value + ";path=/;";}
	if($("ddlDate")) { document.cookie = "date=" + $("ddlDate").value + ";path=/";}
	if($("ddlRoomType")) { document.cookie = "rt=" + $("ddlRoomType").value + ";path=/";}
}

function SearchButtonClicked()
{
    if (searchForm["hidfl"]!=null) searchForm["hidfl"].value="";
   
}