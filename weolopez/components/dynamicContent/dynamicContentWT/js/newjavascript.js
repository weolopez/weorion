/**
 * Created with JetBrains RubyMine.
 * User: jhughes
 * Date: 6/6/13
 * Time: 10:15 AM
 * To change this template use File | Settings | File Templates.
 */

/* Global Variables */
/* this url will have to be updated before prod push */
var serviceURL = 'js/response.json',
	invSpaceActionsRan = false,
	response = '';

var count = 0;
var invcount = 0;

$(document).ready(function() {
	getRecommendations();
})

function getRecommendations() {
	$.getJSON(serviceURL, function(data) {
		var offers = data.recommendations.offers;
		var wtArr = $('[data-wt]');

		//console.log(recommendations.offers[0].name);
		for (i = 0; i < offers.length; i++) {
			for (j = 0; j < wtArr.length; j++) {
				if (wtArr.length < 0 || wtArr.length === null)
					continue;
				var inventorySpaceObject = $(wtArr[j]),
					replaceValue = inventorySpaceObject.data('wt-replace'),
					datawtId = inventorySpaceObject.attr('data-wt');

				if (datawtId !== offers[i].inventorySpaceID)
					continue;
				if (replaceValue == true) {
					replaceContent(offers[i], inventorySpaceObject);

					//

					continue;
				}
				var image = $(wtArr[j]).find('img');

				if (image.data('wt-image') === 'large') {
					image.attr('src', offers[i].imageURL);
					image.attr('alt', offers[i].name);
				}
				;
			}
		}
	});
}


function replaceContent(offer, inventorySpaceObject) {
	var htmlTemplate = '<div class="invSpace"><a href="' + offer.url + '" class="imgWrap"><img src="' + offer.largeImageURL + '" alt="image alt" data-width="450" data-height="350"/></a><div class="content"><h1><a href="' + offer.url + '">' + offer.name + '</a><a href="#" class="expand">+</a></h1><p>' + offer.displayDescription + '</p><a href="' + offer.url + '"><button>Learn More</button></a></div></div>';
	adInjection(offer.inventorySpaceID, htmlTemplate, inventorySpaceObject);
}

function adInjection(id, html, inventorySpaceObject) {
	var wtArr = $('[data-wt]'),
		htmlTemplate = html;

	if (wtArr.length < 0 || wtArr.length == null) {
		return;
	}

	/* Append wt CSS */
	$('html').append('<link rel="stylesheet" href="css/wt.css"/>');

	//$.each(wtArr, function(i, val) {
	var adHeight = $(this).height(),
		invSpaceId = $(this).data('wt');
	inventorySpaceObject.height(adHeight);

	if (inventorySpaceObject.data('wt') == id) {

		inventorySpaceObject.children().delay(3000).fadeOut(function() {
			$(this).parent().append(htmlTemplate).find('.invSpace').height(adHeight).addClass('adOn').fadeIn(function() {
				invSpaceSizing();
				count = count + 1;
				//	console.log("COUNT:" + count + " INVCT:" + invcount);
				invSpaceActions();
			});
		});
	}
	//});
}

function invSpaceSizing() {
	$.each($('.invSpace').find('img'), function() {
		var invSpaceObj = $(this).closest('.invSpace'),
			contentObj = invSpaceObj.find('.content'),
			imgW = $(this).data('width'),
			imgH = $(this).data('height'),
			invSpaceWidth = $(this).closest('.invSpace').width();

		if (imgH > invSpaceObj.height()) {
			$(this).height('100%').fadeIn();
		}

		var whiteSpace = (invSpaceWidth - $(this).width()) / invSpaceWidth,
			isWideLayout = (whiteSpace > 0.4);

		if (isWideLayout) {
			/* Set image height to 100% and set imgWrap to same width */
			$(this).closest('.imgWrap').width($(this).width());

			/* Remove Class then add class */
			invSpaceObj.addClass('wide-layout');
			contentObj.outerWidth((whiteSpace * 100) - 2 + '%');
		} else {
			invSpaceObj.removeClass('wide-layout').addClass('narrow-layout');
		}
	})
}

function invSpaceActions() {
	invcount = $('.invSpace').find('.expand').length;
	//console.log($('.invSpace').find('.expand').length);
	/*  if (invSpaceActionsRan) { 
	 return;
	 }
	 invSpaceActionsRan = true;
	 alert("create click");*/
	$('.invSpace').on('click', '.expand', function(e) {
		console.log('clicked');
		e.preventDefault();
		if ($(this).text() == '+') {
			$(this).text('-');
		} else {
			$(this).text('+');
		}
		;
		$(this).closest('.invSpace').find('p').slideToggle();
		if ($(window).width() < 321) {
			$(this).closest('.invSpace').find('img').toggle();
		}
	});
}
