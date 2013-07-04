/**
 * Created with JetBrains RubyMine. Netbeans
 * User: jhughes, mlopez
 * Date: 7/21/13
 * 
 * ml5174: need to update to support jumbotron (callback). Animations need to be refactored. Other notes in comments TODO
 * ml5174: remove product specific variable names
 
 data-wt=”<inventorySpaceID>” 	: defines the inventory space container and ID.
 data-wt-replace="<functionName>" 	: Will replace contents of tag and execute the functionName with oldContent with newContent as attributes.
 data-wt-image=”<imageSize>”	: src value replace in an img tag
 data-wt-name			: text value replace in a tag. This will remove any nested components
 data-wt-description			: text value replace in a tag. This will remove any nested components
 data-wt-link			: hreg value replace in a tag. 
*/

/* Global Variables */
/* this url will have to be updated before prod push */
function wtFade(oldSpace, newSpace) {
	oldSpace.fadeOut(function() {
		newSpace.addClass('adOn').css('display', 'none').css('visibility', 'visible').fadeIn();
	});
}

function wtAnimate(oldSpace, newSpace) {
	oldSpace.delay(1000).fadeOut(function() {
		newSpace.addClass('adOn').css('display', 'none').css('visibility', 'visible').fadeIn();
	});
}



function getRecommendations() {
	var serviceURL = 'http://216.77.161.49:6090/nt/Recommendations/2/0/recommendationsjson/http/ATTNET/1?userId=qayop_19207_1@att.net&deviceType=1&callback=?',
		localURL = 'js/server.json';

	$.ajax({
		url: serviceURL,
		dataType: 'jsonp',
		contentType: "application/json",
		type: 'GET',
		timeout: 4000,
		username: 'CEConnectorSG',
		password: 'password',
		success: function(data) {
			parseJSONObj(data);
		},
		error: function(data) {
			console.log("Entering fallback to local file.");
			$.ajax({
				url: localURL,
				dataType: 'jsonp',
				contentType: "application/json",
				type: 'GET',
				timeout: 4000,
				username: 'CEConnectorSG',
				password: 'password',
				success: function(data) {
					parseJSONObj(data);
				},
				error: function(data) {
					parseJSONObj($.parseJSON(data.responseText));
				}
			}).done(function(data) {
				parseJSONObj(data);
			});
		}
	}).done(function(data) {
		parseJSONObj(data);
	});

	invSpaceActions();
	$('head').append('<link rel="stylesheet" href="css/wt.css"/>');
}

function parseJSONObj(data) {
	var offers = data.offerRecord,
		wtArr = $('[data-wt]');
	//LOOP through offers and data-wt attributes
	for (i = 0; i < offers.length; i++) {
		var offer = offers[i];
		if (wtArr.length < 0 || wtArr.length === null)
			continue;
		for (j = 0; j < wtArr.length; j++) {
			var wtObject = $(wtArr[j]),
				replaceSpace = wtObject.data('wt-replace'),
				inventorySpaceID = wtObject.data('wt');
			//For every offer and every data-wt match the Inventory Space ID.
			if (offer.inventorySpaceId !== inventorySpaceID)
				continue;
			//Check to see if the inventory space should be replaced entirely
			//console.log("Inventory Space ID:" + inventorySpaceID + " IsReplace:" + isReplace);
			if (typeof replaceSpace != 'undefined') {
				replaceContent(offer, wtObject, replaceSpace);
				continue;
			} else {
				swapContent(offer, wtObject);
			}
		}
	}
	return offers;
}
// Swaps the image and text in the wtObject from the offer
function swapContent(offer, wtObject) {
	wtObject.find('[data-wt-image]').each(function() {

		var imageValue = $(this).data('wt-image'),
			imageW = $(this).width(),
			imageH = $(this).height();
		$(this).width(imageW);
		$(this).height(imageH);
		if (imageValue === 'large') {
			$(this).attr('src', offer.largeImageUrl);
			$(this).attr('alt', offer.name);
		}
		if (imageValue === 'medium') {
			$(this).attr('src', offer.mediumImageUrl);
			$(this).attr('alt', offer.name);
		}
		if (imageValue === 'small') {
			$(this).attr('src', offer.imageImageUrl);
			$(this).attr('alt', offer.name);
		}
		if (imageValue === '') {
			$(this).attr('src', offer.imageUrl);
			$(this).attr('alt', offer.name);
		}

	})
	// NOTE: Need to wrap text in a span or standalone tag.  These function will replace all of the contents of the tag.
	wtObject.find('[data-wt-name]').each(function() {
		$(this).text(offer.name);
	})
	wtObject.find('[data-wt-description]').each(function() {
		$(this).text(offer.displayDescription);
	})
	wtObject.find('[data-wt-link]').each(function() {
		$(this).attr("href", offer.url);
	})

}

function replaceContent(offer, wtArrayObject, callbackFunction) {
	var htmlTemplate = '<div class="invSpace"><a href="' + offer.url + '" class="imgWrap"><img src="' + offer.largeImageUrl + '" alt="image alt" data-width="' + offer.largeImageWidth + '" data-height="' + offer.largeImageHeight + '"/></a><div class="content"><h1><a href="' + offer.url + '">' + offer.name + '</a><a href="#" class="wt-expand">+</a></h1><p>' + offer.displayDescription + '</p><a href="' + offer.url + '"><button>Learn More</button></a></div></div>';

	var adHeight = wtArrayObject.height(),
		adWidth = wtArrayObject.width(),
		oldSpace = wtArrayObject.children().wrapAll('<div />').parent(),
		invSpaceObj = wtArrayObject.append(htmlTemplate).find('.invSpace');
		invSpaceObj.height(adHeight)
		invSpaceObj.width(adWidth);

	console.log('adWidth'+adWidth);
	console.log('adHeight'+adHeight);

	invSpaceSizing(invSpaceObj);



	var fn = window[callbackFunction];

	if (typeof fn === 'function') {
		fn(oldSpace, invSpaceObj);
	} else {
		wtFade(oldSpace, invSpaceObj);
	}

}

//Current design only requires this method to be called once after DOM update
//  Responsive design would have this method called on window resize event
//  TODO manage font and margin for scaleing. 
function invSpaceSizing(invSpaceObj) {
	var imageObj = invSpaceObj.find('img'),
		contentObj = invSpaceObj.find('.content'),
		imgW = imageObj.data('width'),
		imgH = imageObj.data('height'),
		invSpaceWidth = invSpaceObj.width(),
		invSpaceHeight = invSpaceObj.height(),
		resizeRatio = invSpaceHeight / imgH,
		imgHResized = imgH * resizeRatio,
		imgWResized = imgW * resizeRatio;
	console.log('imgW:'+imgW)
	console.log('imgH:'+imgH);
	console.log('invSpaceWidth:'+invSpaceWidth);
	console.log('invSpaceHeight:'+invSpaceHeight);
	console.log('resizeRatio:'+resizeRatio);
	console.log('imgHResized:'+imgHResized);
	console.log('imgWResized:'+imgWResized);
	//Only resize if the image is larger than the inventory space.
	if (imgH > invSpaceHeight) {
		imageObj.height(imgHResized);
	}

//White space management
	var whiteSpace = (invSpaceWidth - imgWResized) / invSpaceWidth,
		isWideLayout = (whiteSpace > 0.4);
	console.log("whiteSpace: " + whiteSpace);
	if (isWideLayout) {
		/* Set image height to 100% and set imgWrap to same width */

		imageObj.closest('.imgWrap').width(imgWResized);

		/* Remove Class then add class */
		invSpaceObj.addClass('wide-layout');

		//Set content width to be 
		contentObj.outerWidth((whiteSpace * 100) - 4 + '%');
		// Manage wide layout for small white space
		var whiteSpacePix = invSpaceWidth - (invSpaceWidth * whiteSpace);
		if (whiteSpacePix < 250)
			invSpaceObj.addClass('wide-layout-small');
	} else {
		invSpaceObj.removeClass('wide-layout').addClass('narrow-layout');
	}
}

// Narrow Layout Expand Action
// TODO: use other symbols than + -
function invSpaceActions() {
//console.log($('.wt-expand').length);

	$('html').on('click', '.wt-expand', function(e) {
//console.log('clicked');
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
