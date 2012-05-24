$(window).addEvent("domready", bindAddthisEvents);
function CTIsPlayback() {
    try { return parent && parent.WebPlayer; }
    catch (e) { return false; }
}

if (!CTIsPlayback())
    if (top != self)
        top.location = location;
//if (window!= top) top.location.href=location.href;
// written by Dean Edwards, 2005
// http://dean.edwards.name/
function BasePath()
{
    // Returns domain + application path
    var re = new RegExp("/en/|/fr/|/es/|/de/|/it/|/au/");    
    url = document.getElementsByTagName("base")[0].href.split(re)[0];
   if(url.lastIndexOf('/') < (url.length - 1))
   { url += '/'; } 
   return url; 
}

function BaseImagePath()
{
    src = window.location.protocol == 'https:' ? 'https://www.laterooms.com/secureimages/' : 'http://images.laterooms.com/';
   return src; 
}

function BaseStaticPath()
{
   src = 'http://static.laterooms.com/';
   return src; 
}

function IsWhiteLabel()
{
    url = document.getElementsByTagName("base")[0].href;
    if(url.indexOf('/wl/') != -1){
        return true;
    }
    return false;
}

function bindAddthisEvents(){
    if (!$('addThisScript') && $('addThisLink'))
    {
        var location = window.location.href;
        //strip off the partner code from the url
        var locp = location.indexOf('/p');
        if (locp != -1) {
            if (!isNaN(location.charAt(locp + 2))) {
                var subs = location.substring(locp + 1, location.length);
                location = (location.substring(0, locp) + subs.substring(subs.indexOf('/'),subs.length));
            }
        }
        var locpv = location.indexOf('/pv');
        if (locpv != -1) {
            if (!isNaN(location.charAt(locpv + 3))) {
                var subspv = location.substring(locpv + 2, location.length);
                location = (location.substring(0, locpv) + subspv.substring(subspv.indexOf('/'), subspv.length));
            }
        }

        var locgclid = location.indexOf('gclid');
        if (locgclid != -1) {
            location = (location.substring(0, locgclid));
        if(location.charAt(locgclid-1) == "?" )
            location = (location.substring(0, locgclid-1));
        }
        
        var addLink = [$('addThisLink')];
        
        if($('addthis-au-home')) {
            addLink = $$('#addThisLink, #addthis-au-home');
        }
        
        addLink.each(function(link, i) {
            link.addEvents({
                'click': function() {
                if(!$('addThisScript')) {
                    new Asset.javascript(BasePath() + 'Script/scripts2/thirdparty/addthiswidget.js', {
                        id:'addThisScript',
                        onload: function() {
                                addthis_open(link, '', location, document.title);
                        }
                    });
                }
                    else { addthis_open(link, '', location, document.title); }
            },
                'mouseout': function() { if($('addThisScript')) { addthis_close(); } }
        });
        });
    }
}

function setLang(url) {
    $$('#flags a').each(function(theLink, i) {
        theLink.erase('href');
    });
    
	window.location = url;
}

function getCookie(c_name)
{
    if (document.cookie.length>0)
    {
        c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
        {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        } 
    }
    return "";
}

function setCookie(c_name,value,expiredays)
{
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) +
    ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

function ShowModalPopup(top, left, component, onCompleteFunction)
{
    if (typeof(Browser.Engine.trident) != "undefined")
    {
        $$("#content select").each(function(ddl, i)
            {ddl.style.display = "none";});
    }
    var modalPopup
    if(!$("modalpopup"))
    {
        modalPopup = document.createElement("div");
        modalPopup.id = "modalpopup";
        modalPopup.className = "overlay";
        modalPopup.style.position = "absolute";
        $$("body")[0].appendChild(modalPopup);
    }
    else
    {
        modalPopup = $("modalpopup");
        $("modalpopup").style.display = "";
        modalPopup.innerHTML="";
    }
    modalPopup.style.top = top + "px";
    modalPopup.style.left = left + "px";
    modalPopup.style.zIndex = "9999";
    $("modalpopup").setOpacity(0);
    if(!$("modaloverlay"))
    {
        overlayPanel = document.createElement("div");
        overlayPanel.id = "modaloverlay";
        overlayPanel.style.position = "absolute";
        overlayPanel.style.height = window.getScrollHeight() + "px";
        overlayPanel.style.width = window.getScrollWidth() + "px";
        overlayPanel.style.backgroundColor = "#333";
        overlayPanel.style.top = "0";
        overlayPanel.style.left = "0";
        overlayPanel.style.zIndex = "6000";
        $$("body")[0].appendChild(overlayPanel);
    }
    else
    {
        $("modaloverlay").style.display = "";
    }
    $("modaloverlay").setOpacity(0.6);
    var url = "RenderComponent.aspx?control=" + component;

    new Request
    ({
            url: url,
            method: "get",
            
            onSuccess: function(html){
                $("modalpopup").innerHTML = html;
                var posx = left - $("modalpopup").getSize().x;
                if(posx < 10){posx=10;}
                $("modalpopup").style.left = posx + "px";
                $("modalpopup").setOpacity(1);
                onCompleteFunction();
            }
    }).send();
}

function ShowModalAlternatives(top, left, component, param)
{
    ShowModal('mdoverlay','modalpopupaltsloading');    
    hideItem("mdoverlay");
//    if (typeof(Browser.Engine.trident) != "undefined")
//    {
//    toggleDdl(false);
////        $$("#content select").each(function(ddl, i)
////            {
////            ddl.style.display = "none";
////            });
//    }
    var modalPopupalts;
    if(!$("modalpopupalts"))
    {        
        modalPopupalts = document.createElement("div");
        modalPopupalts.id = "modalpopupalts";
        modalPopupalts.className = "overlay";
        modalPopupalts.style.position = "absolute";        
    }
    else
    {    
        modalPopupalts = $("modalpopupalts");
        $("modalpopupalts").style.display = "";
        modalPopupalts.innerHTML="";
    }
    
    modalPopupalts.style.top = top + "px";
    modalPopupalts.style.right = "10px";
    modalPopupalts.style.zIndex = "9999";
    $("modalpopupalts").setOpacity(0);
    if(!$("modaloverlay"))
    {
        overlayPanel = document.createElement("div");
        overlayPanel.id = "modaloverlay";
        overlayPanel.style.position = "absolute";
        overlayPanel.style.height = window.getScrollHeight() + "px";
        overlayPanel.style.width = window.getScrollWidth() + "px";
        overlayPanel.style.backgroundColor = "#333";
        overlayPanel.style.top = "0";
        overlayPanel.style.left = "0";
        overlayPanel.style.zIndex = "6000";
        $$("body")[0].appendChild(overlayPanel);
        $$("body")[0].appendChild(modalPopupalts);
    }
    else
    {
        $("modaloverlay").style.display = "";
    }
    $("modaloverlay").setOpacity(0.6);
    var url = "RenderComponent/" + param + ".aspx?control=" + component;

    new Request
    ({
        url: url,
        method: "get",

        update: $("modalpopupalts"),
        onComplete: function(html) {
            $("modalpopupalts").innerHTML = html;
            HideModalPopup('mdoverlay', 'modalpopupaltsloading');
            var i = $("modalpopupalts").getSize();
            var posx = left - i.x;
            if (posx < 10) { posx = 10; }
            $("modalpopupalts").style.left = posx + "px";
            $("modalpopupalts").setOpacity(1);
        }
    }).send();
    if (typeof(Browser.Engine.trident) != "undefined")
    {
    toggleDdl(false);
    }
}


function ShowControl(e, thePage)
{
    if(e==null && window.event)
    {        
        e=window.event;
    }
    
    var winh=window.getHeight() / 2;
    var divh=566/2;
    
    var top = window.getScrollTop() + winh - divh;
    var left = ((window.getWidth() / 2) +  552 / 2);

    ShowModalPopup(top, left, thePage, function()
        {$("helpclose").addEvent("click", function(e) {
                TidyAfterModalPopup();
            });
        $$("#modalpopup a")[0].addEvent("click", function(e) {
                TidyAfterModalPopup();
            });
        });
}


function ShowHelp(e, thePage)
{
    if(e==null && window.event)
    {        
        e=window.event;
    }
    
    var posx = 0;
    var posy = 0;
    if (e.pageX || e.pageY)
    {
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY)
    {
        posx = e.clientX + document.body.scrollLeft
          + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop
          + document.documentElement.scrollTop;
    }
    ShowModalPopup(posy, posx, thePage, function()
        {$("helpclose").addEvent("click", function(e) {
                TidyAfterModalPopup();
            });
        $$("#modalpopup a")[0].addEvent("click", function(e) {
                TidyAfterModalPopup();
            });
        });
}
function TidyAfterModalPopup()
{
    $("modalpopup").style.display = "none";
    $("modaloverlay").style.display = "none";
    toggleDdl(true);
}

function TidyAfterModalPopupAlts()
{
    $("modalpopupalts").style.display = "none";
    $("modaloverlay").style.display = "none";
    if (typeof(Browser.Engine.trident) != "undefined")
    {
        $$("#content select").each(function(ddl, i)
            {ddl.style.display = "";});
    }    
}

function ShowDiv(id)
{
    if (id==null)return;
    $(id).style.display='block';
}
function HideDiv(id)
{
    if (id==null)return;
    $(id).style.display='none';
}

function ShowModalRes(overlayDiv,modalDiv)
{
    var overlayPanel = $(overlayDiv);
    if (overlayPanel.style.display == "none") 
    {
        if (typeof(Browser.Engine.trident) != "undefined")
        {
            if (typeof(Browser.Engine.trident) != "undefined") { toggleDdls(false); }
        }
        overlayPanel.style.position = "absolute";
        overlayPanel.style.height = (window.getScrollHeight() + 160) + "px";
        overlayPanel.style.width = window.getScrollWidth() + "px";
        overlayPanel.style.backgroundColor = "#333";
        overlayPanel.style.left = "0px";
        overlayPanel.style.top = "0px";
        overlayPanel.style.zIndex = "6000";
        overlayPanel.style.display = "";
        overlayPanel.setOpacity(0.6);
        overlayPanel.parentNode.removeChild(overlayPanel);
        $$("body")[0].appendChild(overlayPanel);
    }
    else 
    {
        overlayPanel.style.display = "none";
        if (typeof(Browser.Engine.trident) != "undefined"){ toggleDdls(true); }
    }
    
    var modalPopup = $(modalDiv);
    if (modalPopup.style.display == "none")
    {
        modalPopup.style.position = "absolute";
        modalPopup.style.zIndex = "9999";
        modalPopup.style.display = "";
        modalPopup.style.left = ((window.getWidth() / 2) - (modalPopup.getSize()).x / 2) + 'px';
        modalPopup.style.top = window.getScrollTop() + (window.getHeight() / 2) - 160 + 'px';
        modalPopup.parentNode.removeChild(modalPopup);
        $$("form")[0].appendChild(modalPopup);
        //$("ow").style.display='';
    }
    else
    {
        //$("ow").style.display='none';
        modalPopup.style.display = "none";
    }
}

function toggleDdl(toggleOn)
{
    if(toggleOn)
    {
       $$("#content select").each(function(ddl, i) {ddl.style.display = "";});
    }
    else
    {
       $$("#content select").each(function(ddl, i) {ddl.style.display = "none";});
    }
}

function ShowModal(overlayDiv,modalDiv,modalparent)
{
//changed by craig - if broke put back!
    var overlayPanel = $(overlayDiv);
    overlayPanel.style.position = "absolute";
    overlayPanel.style.height = window.getScrollHeight() + "px";
    overlayPanel.style.width = window.getScrollWidth() + "px";
    overlayPanel.style.backgroundColor = "#333";
    overlayPanel.style.left = "0px";
    overlayPanel.style.top = "0px";
    overlayPanel.style.zIndex = "6000";
    overlayPanel.style.display = "";
    overlayPanel.setOpacity(0.6);
    var iWidth=$(modalDiv).style.width;   
    var modalPopup; 
    if (modalparent==null)
    {   
        $("himdl").innerHTML=$(modalDiv).innerHTML;
        $(modalDiv).innerHTML="";
        modalPopup=$("himdl");
    }
    else
    {
        var domdiv= $(modalparent).removeChild($(modalDiv));
        $("hidmodal").appendChild(domdiv);
        modalPopup = $(modalDiv);
    }
    //$("ow").style.display='';
    //var modalPopup = $(modalDiv);//$("hidmodal");
    modalPopup.style.width=iWidth;
    modalPopup.style.position = "absolute";
    modalPopup.style.zIndex = "9999";
    modalPopup.style.display = "";
    modalPopup.style.left = ((window.getWidth() / 2) - (modalPopup.getSize()).x / 2) + 'px';
    var winh=window.getHeight() / 2;var divh=modalPopup.clientHeight/2;
    modalPopup.style.top =window.getScrollTop() + winh - divh + 'px';
    if (typeof(Browser.Engine.trident4) != "undefined")
    {
        $$("#content select").each(function(ddl, i){
            if(ddl.getStyle('display') != 'none')
            {
                ddl.addClass('mP-ddlhide');
            }
        });
    }
   //alert(modalPopup.style.top +" "+winh +" "+ divh+" "+ window.getScrollTop());
}

function HideModalPopup(overlayDiv,modalDiv,modalparent)
{
    var overlayPanel = $(overlayDiv);
    var modalPopup = $(modalDiv);
    
    if (modalparent==null){   
    modalPopup.innerHTML=$("himdl").innerHTML;
    $("himdl").innerHTML="";
    }
    else
    {
        var domdiv= $("hidmodal").removeChild(modalPopup );
        $(modalparent).appendChild(domdiv);
    }    
    
    //$("ow").style.display='none';
    modalPopup.style.display='none';
    overlayPanel.style.display='none';
   if (typeof(Browser.Engine.trident4) != "undefined")
    {
        $$(".mP-ddlhide").each(function(ddl, i){
            ddl.removeClass('mP-ddlhide');
        });
    }
}

//temp version for mylr issue
function ShowModal2(overlayDiv,modalDiv,modalparent)
{
//changed by craig - if broke put back!
    var overlayPanel = $(overlayDiv);
    overlayPanel.style.position = "absolute";
    overlayPanel.style.height = window.getScrollHeight() + "px";
    overlayPanel.style.width = window.getScrollWidth() + "px";
    overlayPanel.style.backgroundColor = "#333";
    overlayPanel.style.left = "0px";
    overlayPanel.style.top = "0px";
    overlayPanel.style.zIndex = "6000";
    overlayPanel.style.display = "";
    overlayPanel.setOpacity(0.6);
    var iWidth=$(modalDiv).style.width;   
    var modalPopup; 
    if (modalparent==null)
    {   
        $("himdl2").innerHTML=$(modalDiv).innerHTML;
        $(modalDiv).innerHTML="";
        modalPopup=$("himdl2");
    }
    else
    {
        var domdiv= $(modalparent).removeChild($(modalDiv));
        $("hidmodal2").appendChild(domdiv);
        modalPopup = $(modalDiv);
    }
    //$("ow").style.display='';
    //var modalPopup = $(modalDiv);//$("hidmodal");
    modalPopup.style.width=iWidth;
    modalPopup.style.position = "absolute";
    modalPopup.style.zIndex = "9999";
    modalPopup.style.display = "";
    modalPopup.style.left = ((window.getWidth() / 2) - (modalPopup.getSize()).x / 2) + 'px';
    var winh=window.getHeight() / 2;var divh=modalPopup.clientHeight/2;
    modalPopup.style.top =window.getScrollTop() + winh - divh + 'px';
    if (typeof(Browser.Engine.trident4) != "undefined")
    {
        $$("#content select").each(function(ddl, i)
            {ddl.style.display = "none";});
    }
   //alert(modalPopup.style.top +" "+winh +" "+ divh+" "+ window.getScrollTop());
}
function HideModalPopup2(overlayDiv,modalDiv,modalparent)
{
    var overlayPanel = $(overlayDiv);
    var modalPopup = $(modalDiv);
    
    if (modalparent==null){   
    modalPopup.innerHTML=$("himdl2").innerHTML;
    $("himdl2").innerHTML="";
    }
    else
    {
        var domdiv= $("hidmodal2").removeChild(modalPopup );
        $(modalparent).appendChild(domdiv);
    }    
    
    //$("ow").style.display='none';
    modalPopup.style.display='none';
    overlayPanel.style.display='none';
   if (typeof(Browser.Engine.trident4) != "undefined")
    {
        $$("#content select").each(function(ddl, i)
            {ddl.style.display = "";});
    }
}
function daysInMonth(monthNum,yearNum) {
var ds = String(monthNum+1)+'/0/'+String(yearNum);
var dd = new Date(ds);
return dd.getDate();

}

function showTimeZones()
{
    url = BasePath() + siteLang + '/TimeZones.aspx';
    window.open(url.replace('https','http'),'Time_Zones','status=1,toolbar=0,location=0,scrollbars=1,resizable=0,width=700px, height=500px');
}

function Trim(s)
{
    if (StrNullEmpty(s))return "";
    return s.replace(/^\s+|\s+$/g, "");
}


function StrNullEmpty(str)
{
    if (str==null)return true;
    if (typeof(str)!="string")return true;
    if (str.length==0) return true;
    return false;
}

function ReplaceAll(text, strA, strB)
{
    return text.replace( new RegExp(strA,"g"), strB );    
}

function GetDotNetItemByID(containerID,origID,ctrlType)
{
    var retObj=null;
    if (ctrlType==null)ctrlType="";
    $$("#" + containerID + " "+ ctrlType + "[id$="+origID+"]").each(function(obj){retObj= obj;});
    return retObj;
}

function EndsWith(s,value)
{
    if (s==null)return false;
    if (value==null)return false;
    return (s.match(value + "$") == value);
}

function StartsWith(s, value) {
    if (s == null) return false;
    if (value == null) return false;
    return (s.match("^" + value) == value);
}

function GetDdlSelectedValue(ctrl)
{
    if (ctrl==null)return "";
    if (ctrl.selectedIndex<0) return "";
    return ctrl.options[ctrl.selectedIndex].value;
}

function SetDdlSelectedValue(ctrl,selectedValue)
{
    if (ctrl==null)return "";
    for (i=0;i<ctrl.options.length;i++){
    if(ctrl.options[i].value==selectedValue)
    {ctrl.selectedIndex=i;return;}
    }
}

function CaptchaCheck(CaptchaCallBack)
{
    guid = window.location.href.substring(window.location.href.lastIndexOf('/'));
    
    img = $("captchaImage");
    img = img.src.substring(img.src.lastIndexOf('/'));
    
    url = BasePath() + "/Component.aspx?control=CaptcharHelper&method=checkcode&guid=" + img.replace(".aspx","").replace('/','')+'&code=' + $("captchatxt").value;

    xhr=new Request({url: url, method: "GET", onSuccess: CaptchaCallBack});
    xhr.send();
   
}

function NewCaptchaImage()
{
    url = BasePath() + "/Component.aspx?control=CaptcharHelper&method=cantread&rnd=" + Math.random();

    xhr=new Request({url: url, method: "GET", onSuccess: CaptchaChangeImage});
    xhr.send();
}

function CaptchaChangeImage(imagePath)
{
    img = $("captchaImage");
    path = BasePath() + 'CaptchaImage/' + imagePath.replace("captcha:","") + '.aspx';
    img.src = path.replace("\"","").replace("\".aspx", ".aspx");    
    $("captchatxt").value = "";
}

//the following functions should replace those in reservation
function ShowItem(id,visible)
{   
    if (StrNullEmpty(id))return;
    var ctrl=$(id);if (ctrl==null)return;
    if (visible!=null && !visible){ctrl.style.display='none';return;}
    ctrl.style.display='';
}

function HideItem(id)
{
    if (StrNullEmpty(id))return;
    var ctrl=$(id);if (ctrl==null)return;
    ctrl.style.display='none';
}

//this function can be used to dynamically load in a js or css file
function LoadJsorCSS(jsFileUrl, jsFileId, filetype){
    jsFileId = 'asset_' + jsFileId; 
    if(!$(jsFileId)) {
        if (filetype=="js"){ //if filename is a external JavaScript file
            var jsFile = new Asset.javascript(jsFileUrl, {id:jsFileId})
        }
        else if (filetype=="css"){ //if filename is an external CSS file
            var jsFile = new Asset.css(jsFileUrl, {id:jsFileId})
        }
    }
}

function QueryStringParams(url)
{
    function qsparam(qname,qval) {
        this.qname = qname;
        this.qval = qval;
    }
    
    //split url into url and querystring params
    var queryString = [];
    url.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function($0, $1, $2, $3) { 
            queryString.push(new qsparam($1,$3)); 
            }
    );
    return queryString;
}


function ReadQueryString(url,name) {
    var queryString = QueryStringParams(url);
    var val = ''
    queryString.each(function(item, index){
        if(item.qname == name) val = item.qval; 
    });
    return val;
}

function RemoveQueryString(url, name) {
    var queryString = QueryStringParams(url);
    var newUrl;
    var firstParam = true;
    queryString.each(function(item, index){
        if(index == 0) {
            newUrl = item.qname
        }
        else {
            if (item.qname != name) {
                newUrl = newUrl + (firstParam? '?' : '&') + item.qname + '=' + item.qval;
                firstParam = false;
            }
        }
    });
    
    return newUrl;
}


function AddOrReplaceQueryString(url, param, value) {
    url = url.toString();
    var re = new RegExp("([?|&])" + param + "=.*?(&|$)","i");
    var addnewchar = url.indexOf("?") == -1? '?' : '&';

    if (url.match(re))
        return url.replace(re,'$1' + param + "=" + value + '$2');
    else
        return url + addnewchar  + param + "=" + value;
}


function SetSelectItem(select, val) {
    for (i = 0; i < select.length; i++) {
        if (select.options[i].value == val) {
            select.options[i].selected = true;
            break;
        }
	}		
}

function onlyNumbers(event) {
    var charCode = event.which;

    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46)
        return false;

    if (event.shiftkey) return false;
    return true;
}