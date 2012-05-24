$(window).addEvent("domready", load);

var actb;
var timerId;
var isBusy;
// Client side cache to avoid repeat lookups
var cache = new Object();
var mouseOverItem;
var selectedItem;
var postUrl;
var autoCompleteActive = false;

function getSearchBoxForm() {
    return document.forms["searchbox"] || document.forms["main"]
}

function load() {

    actb = new AutoCompleteTextBox("txtSearch", "suggest", "suggestout");
    //    if ($("txtSearch").value == '') {
    //        $("txtSearch").value = townpostcodeattraction;
    //    }

    postUrl = getSearchBoxForm().action;
    $(getSearchBoxForm()).addEvent("submit", function(e) {
        actb.HideSuggestions();
        window.clearTimeout(timerId);
        return true;
    });

    $("txtSearch").addEvent("click", function(e) {
        ClearDefaultSearchText();
    });
}

function AutoCompleteTextBox(TextBoxId, DivId, DivIdOut, DivClass) {
	// initialize member variables
	var oThis = this;
	var oText = $(TextBoxId);
	var oDiv = $(DivId);
	var oDivOut = $(DivIdOut);
	this.TextBox = oText;
	this.Div = oDiv;
	if(typeof(formSubmitpath) != 'undefined')
    {
        this.DefaultFormAction = getSearchBoxForm().action;
    }
	if($('txtSearch').name!='hotels')
    {
	this.DefaultFormAction = "Hotels.aspx";
    }

    if($(oDivOut)){
    // Set left and top coords
    oDivOut.style.left = oText.getCoordinates().left + "px";
    oDivOut.style.top = (oText.getCoordinates().bottom -1) + "px";
    }
    
    if($('switch'))
    {
        oDivOut.style.top = (oText.getCoordinates().bottom + 34) + "px";
    }

	// attach handlers to the TextBox
	oText.AutoCompleteTextBox = this;
	
	// Use onkeypress for autorepeat up/down -Use onkeydown NOT onkeypress as ie does not prcoess tab button in onkeypress
	oText.onkeyup = AutoCompleteTextBox.prototype.OnKeyUp;
	oText.onkeydown = AutoCompleteTextBox.prototype.OnKeyDown;

	if (TextBoxId=="txtSearch")
	{
	    oText.onblur=CustomOnBlur;
	}
	else
	{
	    oText.onblur = AutoCompleteTextBox.prototype.OnBlur;
	}
	oText.onfocus = AutoCompleteTextBox.prototype.OnFocus;
}

function CustomOnBlur()
{
    ResetDefaultSearchText();
    this.AutoCompleteTextBox.HideSuggestions();
    autoCompleteActive = false;
}

AutoCompleteTextBox.prototype.OnBlur = function() {
    this.AutoCompleteTextBox.HideSuggestions();
    autoCompleteActive = false;
};

AutoCompleteTextBox.prototype.OnFocus = function() {
    autoCompleteActive = true;
    if (this.AutoCompleteTextBox.Div.childNodes.length > 0) {
        this.AutoCompleteTextBox.Div.style.display = 'block';
        if (Browser.Engine.trident4)
            this.AutoCompleteTextBox.DropdownStyles("none");
    }
    ClearDefaultSearchText();
};

AutoCompleteTextBox.prototype.OnKeyDown = function(oEvent) {

    if (!oEvent) {
        oEvent = window.event;
    }
    var iKeyCode = oEvent.keyCode;
    if (iKeyCode == 13) {
        if (actb.Div.style.display == "block") {
            if (selectedItem != null) {
                SetAutoCompleteClickedCookie('true');
            }
            return false;
        } else {
            $("search").click();
            this.cancelBubble = true;
            return false;
        }
    }

    SetAutoCompleteClickedCookie('false');

    if (iKeyCode == 9) {
        if (selectedItem != null) {
            AutoCompleteTextBox.prototype.MouseDown(selectedItem);
        }
        actb.HideSuggestions();
        autoCompleteActive = false;
    }
};

AutoCompleteTextBox.prototype.OnKeyUp = function(oEvent) {

    getSearchBoxForm().action = actb.DefaultFormAction + getSpecialOfferParams();
    if (!oEvent) {
        oEvent = window.event;
    }

    var iKeyCode = oEvent.keyCode;
    if (iKeyCode == 13 && selectedItem != null)
        AutoCompleteTextBox.prototype.MouseDown(selectedItem);
    if (iKeyCode == 13 || iKeyCode == 27) {
        // Enter or Esc Pressed
        actb.HideSuggestions();
        return false;
    }
    if (iKeyCode == 8 || iKeyCode == 46) {
    }
    else if (iKeyCode == 40) { // Down
        divs = actb.Div.getElementsByTagName("div");
        index = mouseOverItem.index + 1;
        if (index == divs.length)
            index = 0;
        divs[index].onmousemove();
        return;
    } else if (iKeyCode == 38) { // Up
        divs = actb.Div.getElementsByTagName("div");
        index = mouseOverItem.index - 1;
        if (index < 0)
            index = divs.length - 1;
        divs[index].onmousemove();
        return;
    } else if (iKeyCode < 32 || (iKeyCode >= 33 && iKeyCode <= 46)) {
        return;
    }
    actb.HideSuggestions();

    var txt = actb.TextBox.value;

    if (txt.length > 0 && txt != oldValue) {
        if (!cache[actb.TextBox.value.toLowerCase()]) {
            // clear any previous timer to avoid doing multiple lookups for fast typists
            window.clearTimeout(timerId);
            timerId = window.setTimeout("DoCallBack();", 300);
        } else {
            actb.CreateList(cache[actb.TextBox.value.toLowerCase()]);
        }
    } else {
        actb.HideSuggestions();
    }
};

var oldValue = "";

function DoCallBack() 
{
	if (oldValue != actb.TextBox.value) 
	{
		var url;
	    
	    if(actb.TextBox.name=='hotels')
        {
            url = "AutoComplete/GetHotels.mvc?id=" + encodeURI(actb.TextBox.value.toLowerCase());
        }
        else if (actb.TextBox.name == 't1') 
        {
			url = "AutoComplete/RegionsAndKeywords.mvc?id=" + encodeURI(actb.TextBox.value.toLowerCase());
        }
        else
        {
        	url = "AutoComplete/Index.mvc?id=" + encodeURI(actb.TextBox.value.toLowerCase());
        }
	    
	    new Request.JSON({ url: url, onComplete: XHR_Complete }).send();    
		oldValue = actb.TextBox.value;
	}
}

function XHR_Complete(res) {
	cache[res.SearchTerm.toLowerCase()] = res;
	actb.CreateList(res);
}

AutoCompleteTextBox.prototype.DropdownStyles = function(display) {
    if ($$("#ddlSort select").length > 0) $$("#ddlSort select")[0].setStyle('display', display);
    if ($("ddlDate") != null) $("ddlDate").setStyle('display', display);
    if ($("date") != null) $("date").setStyle('display', display);  // added because the date dropdown ID has been changed
    if ($("ddlNights") != null) $("ddlNights").setStyle('display', display);
    if ($("ddlRoomType") != null) $("ddlRoomType").setStyle('display', display);
    if ($$("#mpanel select") != null) $$("#mpanel select").setStyle('display', display);
}

AutoCompleteTextBox.prototype.CreateList = function(res) {
    $('suggestout').style.top = $('txtSearch').getCoordinates().bottom + "px";
    if (autoCompleteActive == true) {
        if (Browser.Engine.trident4)
            this.DropdownStyles("none");

        while (this.Div.childNodes.length > 0) // Delete all children
            this.Div.removeChild(this.Div.firstChild);

        // get all the matching strings from the server response
        // add each string to the popup-div
        var i;
        var n = parseInt(res.Results.length);

        if (n > 0) {
            for (i = 0; i < n; i++) {
                var oDiv = document.createElement('div');
                oDiv.index = i;
                this.Div.appendChild(oDiv);

                try {
                    if (isSpecialOffersPage() ||actb.TextBox.name=='hotels' ) {
                        oDiv.innerHTML = "<span>" + res.Results[i].Text + "</span>";
                    }
                    else {
                        oDiv.innerHTML = "<b>" + res.Results[i].Count + " " + (res.Results[i].Count != 1 ? autoCompleteHotels : autoCompleteHotel) + "</b><span>" + res.Results[i].Text + "</span>";
                    }
                }
                catch (e) {
                    alert(e);
                    return;
                }

                oDiv.onmousemove = AutoCompleteTextBox.prototype.Div_MouseOver;
                oDiv.onmousedown = AutoCompleteTextBox.prototype.Div_MouseDown;
                oDiv.AutoCompleteTextBox = this;
                oDiv.data = res.Results[i];
                if (i == n - 1) {
                    mouseOverItem = oDiv;
                }
            }
            this.Div.style.display = 'block';
        } else {
            actb.HideSuggestions();
        }
    } else {
        actb.HideSuggestions();
    }
};

AutoCompleteTextBox.prototype.Div_MouseOver = function() {
    AutoCompleteTextBox.prototype.MouseOver(this);
};

AutoCompleteTextBox.prototype.Div_MouseDown = function() {
    AutoCompleteTextBox.prototype.MouseDown(this);
};

function getSpecialOfferParams() {
    if (window.location.href.indexOf("special-offers") != -1) {
        return "?q=10_special-offers";
    }
    else {
        return '';
    }
}

function isSpecialOffersPage() {
    return window.location.href.indexOf("special-offers") != -1;
}

AutoCompleteTextBox.prototype.MouseDown = function(div) {
    div.AutoCompleteTextBox.TextBox.value = div.data.Text;
    SetAutoCompleteClickedCookie('true');
    if(actb.TextBox.name=='hotels')
    {
        $('hotelId').value=(div.data.HotelId);
         getSearchBoxForm().action="HotelAwards/Submit.mvc";
    }
     else
    {
    var actionUrl = div.data.Url + ".aspx" + getSpecialOfferParams();
    if (typeof (formSubmitpath) != 'undefined') {
        actionUrl = formSubmitpath + actionUrl;
    }
    }
    getSearchBoxForm().action = actionUrl;
};

AutoCompleteTextBox.prototype.MouseOver = function(div) {
    mouseOverItem.className = "";
    div.className = "hover";
    mouseOverItem = div;
    selectedItem = div;
};

AutoCompleteTextBox.prototype.HideSuggestions = function() {
    selectedItem = null;
    this.Div.style.display = 'none';
    if (Browser.Engine.trident4)
        this.DropdownStyles("");
};

function ResetDefaultSearchText()
{
    if (actb.TextBox.value=="")
    {
        actb.TextBox.value=townpostcodeattraction;
    }
}

function ClearDefaultSearchText()
{
    if (actb.TextBox.value==townpostcodeattraction)
    {
        actb.TextBox.value="";
    }
}

function SetAutoCompleteClickedCookie(value) {
    document.cookie = "autocomplete=" + value + ";path=/;";
}