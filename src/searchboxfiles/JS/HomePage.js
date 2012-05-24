var landing = true;

/********** LateRooms 24 *************************************************/

$(window).addEvent("domready", function(e) {
    $$("#lr24 tr").each(function(tr, i) {

        if (i > 0) {
            tr.addEvent("click", function(e) {
                document.cookie = "HomePageComponent=lr24;path=/";
                window.location.href = this.getElementsByTagName("a")[0].href;
            });
            $(tr.getElementsByTagName("a")[0]).addEvent("click", function(e) { e.preventDefault(); });
        }
    });
});

/********** My Booking *************************************************/

function canx()
{
    window.location='ConfirmationResender.mvc';
    return false;
}


/********** Deals by email *************************************************/
$(window).addEvent('domready', function(e) {
    if ($('txtDByEmail')) {
    $('txtDByEmail').addEvent('keypress', function(e) {
        if (e == null) { e = window.event; }
        var keyCode = e ? (e.which ? e.which : e.keyCode) : event.keyCode;
        if (keyCode == 13) {
            this.cancelBubble = true;
            DBYESubscribe();
            if (e.preventDefault) { e.preventDefault(); }
            return false;
        }
    });
    if ($('advertContentEs')) {
            $('advert').set('html', $('advertContentEs').get('html'));
    }
    }
});

function DBYESubscribe(control)
{
    var dbyeTxtBox = $("txtDByEmail");
    if(dbyeTxtBox.value != dbyeTxtBox.defaultValue && dbyeTxtBox.value != "")
    {
        //window.location = language +'/Subscribe.aspx?txtDByEmail=' + dbyeTxtBox.value;
        window.location = $$('base')[0].get('href') + 'Subscribe.aspx?txtDByEmail=' + dbyeTxtBox.value;
        
        return false;  
    }
    else
    {
        alert(ErrDealsByEmail);  
        return false;
    }
}

$(window).addEvent("domready", function(e) {
    if ($('advertContentEs')) {
        $("advert").set('html', $('advertContentEs').get('html'));
    }
});


/********** Google Analytics *************************************************/

document.addEvent("click", function(e) {
    var component;
    var targ;
    if (!e) var e = window.event;

    if (e.target) targ = e.target;
    else if (e.srcElement) targ = e.srcElement;

    if (targ.nodeType == 3) targ = targ.parentNode;

    component = parentName(targ);

    if (component != 'nothing found') {
        document.cookie = "HomePageComponent=" + component + ";path=/";
    }
});

function parentName(ref) {
    ok = 0; // it's just to start the loop, we don't use it to get out.
    while (!ok) {
        ref = ref.parentNode;
        if (!ref) return 'nothing found';
        
        if (ref.nodeType == 1) //check that the node is a tag, not text (type=3)
        {
            if (String(ref.nodeName) == "DIV" && String(ref.id) != "") {
                return ref.id;
            }
            if (String(ref.nodeName) == "BODY") {
                return 'nothing found';
            }
        }
    }
}