/**
 * Created with JetBrains RubyMine.
 * User: jhughes
 * Date: 6/6/13
 * Time: 10:15 AM
 * To change this template use File | Settings | File Templates.
 * 
 * ml5174: need to update to support jumbotron (callback). Animations need to be refactored. Other notes in comments TODO
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
		var offers = data.recommendations.offers,
			tdataArr = $('[data-tdata]');

//LOOP through offers and data-tdata attributes
		for (i = 0; i < offers.length; i++) {
			var offer = offers[i];
			if (tdataArr.length < 0 || tdataArr.length === null)
				continue;
			for (j = 0; j < tdataArr.length; j++) {
				var tdataObject = $(tdataArr[j]),
					isReplace = tdataObject.data('tdata-replace'),
					inventorySpaceID = tdataObject.data('tdata');

				//For every offer and every data-tdata match the Inventory Space ID.
				if (inventorySpaceID != offer.inventorySpaceID)
					continue;

				//Check to see if the inventory space should be replaced entirely
				//console.log("Inventory Space ID:" + inventorySpaceID + " IsReplace:" + isReplace);
				if (isReplace == true) {
					replaceContent(offer, tdataObject);
					continue;
				} else {
					swapContent(offer, tdataObject);
				}
			}
		}
		return tdataArr;
	});
}

// Swaps the image and text in the tdataObject from the offer
function swapContent(offer, tdataObject) {

	tdataObject.find('[data-tdata-image]').each(function() {

		var imageValue = $(this).data('tdata-image');
			imageW = $(this).width(),
			imageH = $(this).height();
		$(this).width(imageW);
		$(this).height(imageH);
		if (imageValue === 'large') {
			$(this).attr('src', offer.largeImageURL);
			$(this).attr('alt', offer.name);
		}
		if (imageValue === 'medium') {
			$(this).attr('src', offer.mediumImageURL);
			$(this).attr('alt', offer.name);
		}
		if (imageValue === 'small') {
			$(this).attr('src', offer.imageURL);
			$(this).attr('alt', offer.name);
		}

	})
// NOTE: Need to wrap text in a span or standalone tag.  These function will replace all of the contents of the tag.
	tdataObject.find('[data-tdata-name]').each(function() {
		$(this).text(offer.name);
	})
	tdataObject.find('[data-tdata-description]').each(function() {
		$(this).text( offer.displayDescription );
	})
	tdataObject.find('[data-tdata-link]').each(function() {
		$(this).attr("href", offer.url);
	})

}

function replaceContent(offer, tdataArrayObject) {
	var htmlTemplate = '<div class="invSpace"><a href="' + offer.url + '" class="imgWrap"><img src="' + offer.largeImageURL + '" alt="image alt" data-width="' + offer.imagewidth + '" data-height="' + offer.imageheight + '"/></a><div class="content"><h1><a href="' + offer.url + '">' + offer.name + '</a><a href="#" class="expand">+</a></h1><p>' + offer.displayDescription + '</p><a href="' + offer.url + '"><button>Learn More</button></a></div></div>';

	var adHeight = tdataArrayObject.height(),
		inventorySpaceObj = tdataArrayObject.append(htmlTemplate).find('.invSpace');

	tdataArrayObject.children().delay(3000).fadeOut();
	inventorySpaceObj.addClass('adOn');
		inventorySpaceObj.height(adHeight).fadeIn(function() {
			invSpaceSizing();
			count = count + 1;
			//console.log("COUNT:" + count + " INVCT:" + invcount);
			if (count == 1) {
				$('head').append('<link rel="stylesheet" href="css/tdata.css"/>');
				invSpaceActions();
			}
		});
}

//Current design only requires this method to be called once after DOM update
//  Responsive design would have this method called on window resize event
//  TODO manage font and margin for scaleing. 
function invSpaceSizing() {
	$.each($('.invSpace').find('img'), function() {
		var invSpaceObj = $(this).closest('.invSpace'),
			contentObj = invSpaceObj.find('.content'),
			imgW = $(this).data('width'),
			imgH = $(this).data('height'),
			invSpaceWidth = $(this).closest('.invSpace').width();

//Only resize if the image is larger than the inventory space.
		if (imgH > invSpaceObj.height()) {
			$(this).height('100%').fadeIn();
		}

//White space mangement
		var whiteSpace = (invSpaceWidth - $(this).width()) / invSpaceWidth,
			isWideLayout = (whiteSpace > 0.4);

		if (isWideLayout) {
			/* Set image height to 100% and set imgWrap to same width */
			$(this).closest('.imgWrap').width($(this).width());

			/* Remove Class then add class */
			invSpaceObj.addClass('wide-layout');
			contentObj.outerWidth((whiteSpace * 100) - 3 + '%');

// Manage wide layout for small white space
			var whiteSpacePix = invSpaceWidth-(invSpaceWidth*whiteSpace);
			if (whiteSpacePix<250) 
			      invSpaceObj.addClass('wide-layout-small');

		} else {
			invSpaceObj.removeClass('wide-layout').addClass('narrow-layout');
		}
	})
}

// Narrow Layout Expand Action
// TODO: use other symbols than + -
function invSpaceActions() {
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
