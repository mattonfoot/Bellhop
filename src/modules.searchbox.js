
(function(Global, document, undefined) {

// SetFormCookie
// FormSubmit
// ShowSearchErrorMessage
// SearchButtonClicked

Global.app.register('searchbox', function(sandbox) {

	return {
		domready: function() {

			if ($("ddlNights") != null) {
				$("ddlNights").addEvent("change", SetFormCookie);

				if ($("ddlDate") != null) {
					$("ddlDate").addEvent("change", SetFormCookie);
				}

				$("ddlRoomType").addEvent("change", SetFormCookie);

				createDateDropdown();
			}

			if (Cookie.read("LateroomsProfile")
					&& JSON.decode(Cookie.read("LateroomsProfile")).languagecode == 'EN'
					&& JSON.decode(Cookie.read("LateroomsProfile")).countrycode == "AU") {
				townpostcodeattraction = defaultAuSearchText;
			}

			var searchForm = document.forms["searchbox"] || document.forms["main"];
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
				var nightsDD = $$('.nights-dd')[0];

				 highlightDates({ target: nightsDD });

				 checkAndHideSecondRows();
				 RefreshDefaultMinStayWarnings();
				 displayYouSaveMessages({ target: nightsDD });
				 displayDateLevelAllocation();
				 displayRoomLevelAllocation();
			}

		}
	};
});

})(this, this.document || {});
