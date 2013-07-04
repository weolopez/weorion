/**
 * Created with JetBrains RubyMine.
 * User: jhughes, ml5174
 * Date: 6/26/13
 * 
 
 HTML API 
 data-tdata=”<inventorySpaceID>” 	: defines the inventory space container and ID.
 data-tdata-replace="<functionName>" 	: Will replace contents of tag and execute the functionName with oldContent with newContent as attributes.
 data-tdata-image=”<imageSize>”	: src value replace in an img tag
 data-tdata-name			: text value replace in a tag. This will remove any nested components
 data-tdata-description			: text value replace in a tag. This will remove any nested components
 data-tdata-link			: hreg value replace in a tag. 
 
 JQuery API
 getRecommendation( args, function)
 args: Array with the following 
 domain = 'domain' in args ? args.domain : '216.77.161.49:6090',
 versionMajor = 'versionMajor' in args ? args.versionMajor : '2',
 versionMinor = 'versionMinor' in args ? args.versionMinor : '0',
 consumptionEngine = 'consumptionEngine' in args ? args.consumptionEngine : 'ATTNET' 
 function: called after  
 
 Mauricio Lopez 
 :  ml5174 
 
 *  */

/* Global Variables */
/* this url will have to be updated before prod push */
function tdataFade(oldSpace, newSpace) {
	oldSpace.fadeOut(function() {
		newSpace.addClass('adOn').hide().css('visibility', 'visible').fadeIn();
	});
}
function defaultTransition(oldSpace, newSpace) {
	oldSpace.remove();
	newSpace.addClass('adOn').hide().css('visibility', 'visible').fadeIn();
}
function tdataAnimate(oldSpace, newSpace) {
	oldSpace.delay(1000).fadeOut(function() {
		newSpace.addClass('adOn').hide().css('visibility', 'visible').fadeIn();
	});
}


(function($) {

	$('head').append('<link rel="stylesheet" href="css/tdata.css"/>');



	$.fn.getRecommendations = function(args, callBackfunction) {

		var domain = 'domain' in args ? args.domain : '216.77.161.49:6090',
			versionMajor = 'versionMajor' in args ? args.versionMajor : '2',
			versionMinor = 'versionMinor' in args ? args.versionMinor : '0',
			consumptionEngine = 'consumptionEngine' in args ? args.consumptionEngine : 'ATTNET',
			userID = 'userID' in args ? args.userID : 'qayop_19207_1@att.net',
			deviceType = 'deviceType' in args ? args.deviceType : '1',
			pageID = 'pageID' in args ? args.pageID : '1',
			serviceURL = 'url' in args ? args.url : 'http://' + domain + '/nt/Recommendations/' + versionMajor + '/' + versionMinor + '/recommendationsjson/http/' + consumptionEngine + '/'+pageID+'?userId=' + userID + '&deviceType=' + deviceType + '&callback=?';

		$.ajax({
			url: serviceURL,
			dataType: 'jsonp',
			contentType: "application/json",
			type: 'GET',
			timeout: 8000,
			beforeSend: function(xhr) {
				var bytes = Crypto.charenc.Binary.stringToBytes("CEConnectorSG" + ":" + "password");
				var base64 = Crypto.util.bytesToBase64(bytes);
				xhr.setRequestHeader("Authorization", "Basic " + base64);
			},
			username: 'CEConnectorSG',
			password: 'password',
			success: function(data) {
				console.log("success");
				return executeDataTdata(data, callBackfunction);
			},
			error: function(data) {
				console.log("error");
				$.ajax({
					url: 'js/server.json',
					dataType: 'jsonp',
					contentType: "application/json",
					type: 'GET',
					username: 'CEConnectorSG',
					password: 'password',
					success: function(data) {
						console.log("success");
						executeDataTdata($.parseJSON(data.responseText), callBackfunction);
					},
					error: function(data) {
						console.log("error: using local JSON");
						executeDataTdata($.parseJSON(data.responseText), callBackfunction);
					}
				}).done(function(data) {
					console.log("done");
					//return executeDataTdata(data, callBackfunction);
				});
			}
		}).done(function(data) {
			console.log("done");
			//return executeDataTdata(data, callBackfunction);
		});
	};

	/*
	 * executeDataTdata:  Traversices the Recommendation Response and for each InventorySpace find the corresponding InventorySpace in the DOM and apply the functions according to the data-tdata custom attributes.
	 
	 * @param {type} data
	 * 	data is the raw JSON object.
	 * @param {type} callBackfunction
	 * 	callback function to execute after the DOM has been updated.
	 * @returns {unresolved} */
	function executeDataTdata(data, callBackfunction) {
		var offers = data.offerRecord,
			tdataArr = $('[data-tdata]');
		//LOOP through offers and data-tdata attributes
		for (i = 0; i < offers.length; i++) {
			var offer = offers[i];
			if (tdataArr.length < 0 || tdataArr.length === null)
				continue;
			for (j = 0; j < tdataArr.length; j++) {
				var tdataObject = $(tdataArr[j]),
					replaceSpace = tdataObject.data('tdata-replace'),
					inventorySpaceID = tdataObject.data('tdata');
				//For every offer and every data-tdata match the Inventory Space ID.
				if (offer.inventorySpaceId !== inventorySpaceID)
					continue;
				$().replaceContent(offer, tdataObject, replaceSpace);
			}
		}
		callBackfunction();
		invSpaceActions();
		return $.parseJSON(offers);
	}



	$.fn.replaceContent = function(offer, tdataArrayObject, callbackFunction) {
		var oldSpace = tdataArrayObject.children().wrapAll('<div />').parent();
		var newSpace; 
		if (offer.statusCode === '100') {

			newSpace = swapContent(offer, oldSpace);

			if (newSpace === '') {
				var htmlTemplate = '<div class="invSpace"><a href="' + offer.url + '" class="imgWrap"><img src="' + offer.largeImageUrl + '" alt="image alt" data-width="' + offer.largeImageWidth + '" data-height="' + offer.largeImageHeight + '"/></a><div class="content"><h1><a href="' + offer.url + '">' + offer.name + '</a><a href="#" class="tdata-expand">+</a></h1><p>' + offer.displayDescription + '</p><a href="' + offer.url + '"><span>Learn More</span></a></div></div>';

				newSpace = tdataArrayObject.append(htmlTemplate).find('.invSpace');

				$().invSpaceSizing(tdataArrayObject);
			}
		} else {
			var tmp = oldSpace.clone(true, true); 
			oldSpace.parent().append(newSpace);
			newSpace = oldSpace;
			oldSpace = tmp;
		}

//		console.log(htmlTemplate);
		var fn = window[callbackFunction];
		if (typeof fn === 'function') {
			fn(oldSpace, newSpace, offer);
		} else {
			defaultTransition(oldSpace, newSpace);
		}
	};

//Current design only requires this method to be called once after DOM update
//  Responsive design would have this method called on window resize event
//  TODO manage font and margin for scaleing. 
	$.fn.invSpaceSizing = function(tdataArrayObject) {
		var invSpaceObj = tdataArrayObject.find('.invSpace'),
			imageObj = invSpaceObj.find('img'),
			contentObj = invSpaceObj.find('.content'),
			imgW = imageObj.data('width'),
			imgH = imageObj.data('height'),
			invSpaceWidth = tdataArrayObject.width(),
			invSpaceHeight = tdataArrayObject.height(),
			resizeRatio = invSpaceHeight / imgH,
			imgHResized = imgH * resizeRatio,
			imgWResized = imgW * resizeRatio;
//		console.log("imgW: " + imgW);
//		console.log("imgH: " + imgH);
//		console.log("invSpaceWidth: " + invSpaceWidth);
//		console.log("invSpaceHeight: " + invSpaceHeight);
//		console.log("resizeRatio: " + resizeRatio);
//		console.log("imgHResized: " + imgHResized);
//		console.log("imgWResized: " + imgWResized);
		//Only resize if the image is larger than the inventory space.
		if (imgH > invSpaceHeight) {
			imageObj.height(imgHResized);
		} else {
			imgHResized = imgH;
			imgWResized = imgW;
		}
		if (imgW > invSpaceWidth) {
			var imgDiff = imgW - invSpaceWidth;
			imageObj.css('margin-left', -(imgDiff / 2));
		}

//White space management
		var whiteSpace = (invSpaceWidth - imgWResized) / invSpaceWidth,
			isWideLayout = (whiteSpace > 0.4);
//		console.log("whiteSpace: " + whiteSpace);
		if (isWideLayout) {
			/* Set image height to 100% and set imgWrap to same width */

			imageObj.closest('.imgWrap').width(imgWResized);
			/* Remove Class then add class */
			invSpaceObj.removeClass('narrow-layout').addClass('wide-layout');
			//Set content width to be 
			contentObj.outerWidth((whiteSpace * 100) - 4 + '%');
			// Manage wide layout for small white space
			var whiteSpacePix = invSpaceWidth - (invSpaceWidth * whiteSpace);
			if (whiteSpacePix < 250)
				invSpaceObj.addClass('wide-layout-small');
			else
				invSpaceObj.removeClass('wide-layout-small');
		} else {
			imageObj.closest('.imgWrap').width('100%');
			contentObj.outerWidth('100%');
			contentObj.find('p').css('bottom', contentObj.find('h1').outerHeight(true));
			invSpaceObj.removeClass('wide-layout').addClass('narrow-layout');
		}
	};

// Narrow Layout Expand Action
// TODO: use other symbols than + -
	function invSpaceActions() {
//console.log($('.tdata-expand').length);

		$('html').on('click', '.tdata-expand', function(e) {
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
// Swaps the image and text in the tdataObject from the offer
	function swapContent(offer, oldSpace) {
		var found = '';
		var newSpace = oldSpace.clone(true, true);

		newSpace.find('[data-tdata-image]').each(function() {
			var imageValue = $(this).data('tdata-image'),
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
			found = true;
		});
		// NOTE: Need to wrap text in a span or standalone tag.  These function will replace all of the contents of the tag.
		newSpace.find('[data-tdata-name]').each(function() {
			$(this).text(offer.name);
			found = true;
		});
		newSpace.find('[data-tdata-description]').each(function() {
			$(this).text(offer.displayDescription);
			found = true;
		});
		newSpace.find('[data-tdata-link]').each(function() {
			$(this).attr("href", offer.url);
			found = true;
		});
		if (found === true) {
			oldSpace.parent().append(newSpace);
			return newSpace;
		}
		else
			return found;
	}
	function setBodyScale(whitespaceW, textTag) {
                var scaleSource = whitespaceW,
                    scaleFactor = 0.35,                     
                    maxScale = 600,
                    minScale = 30; //Tweak these values to taste

                var fontSize = scaleSource * scaleFactor; //Multiply the width of the body by the scaling factor:

                if (fontSize > maxScale) fontSize = maxScale;
                if (fontSize < minScale) fontSize = minScale; //Enforce the minimum and maximums

                textTag.css('font-size', fontSize + '%');
            };
}(jQuery));
