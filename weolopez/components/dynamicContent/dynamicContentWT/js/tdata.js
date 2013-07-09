/**
 * Created with JetBrains RubyMine.
 * User: jhughes, ml5174
 * 
 
 HTML API 
 data-tdata=”<inventorySpaceID>” 	: defines the inventory space container and ID.
 data-tdata-replace="<functionName>" 	: Will replace contents of tag and execute the functionName with oldContent with newContent as attributes.
 function (oldSpace, newSpace, offer): called after validation and creation of new content.
 oldSpace: jQuery object referencing div surrounding content to be replaced
 newSpace: jQuery object referencing div surrounding content to be shown
 offer: JSON reference to current offer.
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
 pageID = 'pageID' in args ? args.pageID : '1', 
 onErrorFunction(data) = function to call in case of error from server
 function: called after content has been added to the DOM.
 invSpaceSizing(<InventorySpaceContainer>) : resizes dynamic content
 
 
 *  */
// Animates the removal and addition of spaces
function tdataFade(oldSpace, newSpace) {
	oldSpace.fadeOut(function() {
		newSpace.addClass('adOn').hide().css('visibility', 'visible').fadeIn();
	});
}
// Assumes space is not visible and fades in new
function defaultTransition(oldSpace, newSpace) {
	oldSpace.remove();
	newSpace.addClass('adOn').hide().css('visibility', 'visible').fadeIn();
}

(function($) {

	$('head').append('<link rel="stylesheet" href="css/tdata.css"/>');
	$.fn.getRecommendations = function(args, callBackfunction) {

		var domain = 'domain' in args ? args.domain : 'tdice-recommendation.att.com',
			versionMajor = 'versionMajor' in args ? args.versionMajor : '2',
			versionMinor = 'versionMinor' in args ? args.versionMinor : '0',
			consumptionEngine = 'consumptionEngine' in args ? args.consumptionEngine : 'ATTNET',
			userID = 'userID' in args ? args.userID : 'qayop_19207_1@att.net',
			deviceType = 'deviceType' in args ? args.deviceType : '1',
			pageID = 'pageID' in args ? args.pageID : '1',
			serviceURL = 'url' in args ? args.url : 'http://' + domain + '/nt/Recommendations/' + versionMajor + '/' + versionMinor + '/recommendationsjson/http/' + consumptionEngine + '/' + pageID + '?userId=' + userID + '&deviceType=' + deviceType, // + '&callback=?',
			onErrorFunction = 'onErrorFunction' in args ? args.onErrorFunction : function() {
			$().getRecommendations({
				url: 'js/server.json',
				onErrorFunction: function(data) {
					executeDataTdata($.parseJSON(data.responseText), callBackfunction);
				}
			}, callBackfunction);
		};

		$.ajax({
			url: serviceURL,
			dataType: 'jsonp',
			contentType: "application/json",
			type: 'GET',
			timeout: 1000,
			success: function(data) {
				console.log("success");
				return executeDataTdata(data, callBackfunction);
			},
			error: function(data) {
				console.log("error");
				onErrorFunction(data);
			}
		}).done(function(data) {
			console.log("done");
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
				if (offer.inventorySpaceId === inventorySpaceID)
					$().replaceContent(offer, tdataObject, replaceSpace);
			}
		}
		if (typeof callBackfunction === 'function') {
			callBackfunction($.parseJSON(offers));
		}
		invSpaceActions();
		return $.parseJSON(offers);
	}

	$.fn.replaceContent = function(offer, tdataArrayObject, callbackFunction) {
		var oldSpace = tdataArrayObject.children().wrapAll('<div />').parent();
		var newSpace;
		if (offer.statusCode === '100') {

			newSpace = swapContent(offer, oldSpace);
			if (newSpace === '') {
				var htmlTemplate = getHTML(offer, tdataArrayObject.height());
				newSpace = tdataArrayObject.append(htmlTemplate).find('.invSpace');
				$().invSpaceSizing(tdataArrayObject);
			}
		} else {
			var tmp = oldSpace.clone(true, true);
			oldSpace.parent().append(newSpace);
			newSpace = oldSpace;
			oldSpace = tmp;
		}

		var fn = window[callbackFunction];
		if (typeof fn === 'function') {
			fn(oldSpace, newSpace, offer);
		} else {
			defaultTransition(oldSpace, newSpace);
		}
	};

	function getHTML(offer, iSHeight) {
		//COULD THIS BE SERVER SIDE?
		if (Math.abs(iSHeight - offer.imageHeight) > Math.abs(iSHeight - offer.largeImageHeight)) {
			var newImgUrl = offer.largeImageUrl;
			var newWidth = offer.largeImageWidth;
			var newHeight = offer.largeImageHeight;
		} else {
			var newImgUrl = offer.imageUrl;
			var newWidth = offer.imageWidth;
			var newHeight = offer.imageHeight;
		}
		return	'<div class="invSpace"><a href="' + offer.url + '" class="imgWrap"><img src="' + newImgUrl + '" alt="image alt" data-width="' + newWidth + '" data-height="' + newHeight + '"/></a><div class="content"><h1 style="margin: 0; font-size: 2em; line-height: 1.25;"><a href="' + offer.url + '" data-tdata-original-name="' + offer.name + '">' + offer.name + '</a><a href="#" class="tdata-expand">+</a></h1><p data-tdata-text="' + offer.displayDescription + '">' + offer.displayDescription + '</p><div style="visibility: hidden;"></div> <a href="' + offer.url + '"><span>Learn More</span></a></div></div>';
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
			if (offer.displayDescription.length > 90)
				$(this).text(offer.displayDescription.substring(0, 88) + '...');
			else
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

//Current design only requires this method to be called once after DOM update
//  Responsive design would have this method called on window resize event
//  TODO manage font and margin for scaleing. 
	$.fn.invSpaceSizing = function(tdataArrayObject) {
		var invSpaceObj = tdataArrayObject.find('.invSpace'),
			imageObj = invSpaceObj.find('img'),
			contentObj = invSpaceObj.find('.content'),
			invSpaceWidth = tdataArrayObject.width(),
			invSpaceHeight = tdataArrayObject.height(),
			resizeRatio = tdataArrayObject.height() / imageObj.data('height');

		if (resizeRatio > 1) {
			resizeRatio = 1;
			imageObj.closest('.imgWrap').css('margin-top', '10px');
		}

		var imgW = imageObj.data('width') * resizeRatio,
			imgH = imageObj.data('height') * resizeRatio;

//set Image size to resizedHeight
		imageObj.height(imgH);

//Center image horizontally
		if (imgW > invSpaceWidth) {
			var imgDiff = imgW - invSpaceWidth;
			imageObj.css('margin-left', -(imgDiff / 2));
		}
		/* Set image height to 100% and set imgWrap to same width */
		imageObj.closest('.imgWrap').width(imgW);

//White space management
		var whiteSpace = (invSpaceWidth - imgW) / invSpaceWidth,
			isWideLayout = (whiteSpace * invSpaceHeight > 75);
		if (isWideLayout) {
			/* Remove Class then add class */
			invSpaceObj.removeClass('narrow-layout').addClass('wide-layout');
			invSpaceObj.removeClass('wide-layout-small');

			// Format Content to fit whitespace
			contentObj.outerWidth((whiteSpace * 100) - 4 + '%');

			//imgH = contentObj.data('height') * resizeRatio;
			var pObj = contentObj.find('p');
			var pText = pObj.data('tdata-text');
			contentObj.find('p').text(pText);

			var aObj = contentObj.find('a[data-tdata-original-name]');
			var aText = aObj.data('tdata-original-name');
			contentObj.find('a[data-tdata-original-name]').text(aText);

			if (resizeContent(contentObj, invSpaceHeight) < 10) {
				invSpaceObj.addClass('wide-layout-small');
				//alert('SMALL');
			} else {
				invSpaceObj.removeClass('wide-layout-small');
			}
			
			 var elips = pObj.text().substring(0, pObj.text().substring(0,pObj.text().length-10).lastIndexOf(' ')) + '...';
			 if (pText !== pObj.text()) {
				 //alert('text:'+pObj.text().length);
			 pObj.text(elips);
			 }
			 elips = aObj.text().substring(0, aObj.text().substring(0,aObj.text().length-5).lastIndexOf(' ')) + '...';
			 if (aText !== aObj.text()) {
			 aObj.text(elips);
			 }

		} else {
			imageObj.closest('.imgWrap').width('100%');
			contentObj.outerWidth('100%');
//			contentObj.find('p').css('bottom', contentObj.find('h1').outerHeight(true));
			invSpaceObj.removeClass('wide-layout').addClass('narrow-layout');
		}
	};

	function getLineCount(textObject) {
		var divHeight = textObject.height();
		var lineHeight = parseInt(textObject.css('line-height'));
		var lineCount = Math.ceil(divHeight / lineHeight);
		//alert("HI");
		//console.log('\ndivHeight:' + divHeight);
//		console.log('lineHeight:' + lineHeight);
//		console.log('lineCount:' + lineCount);
		return lineCount;
	}
	function resizeContent(contentObj, invSpaceHeight) {
//		console.log('lineCount:' + lineCount);
//		console.log('lineCount:' + lineCount);
		
		var textTag = contentObj.find('a[data-tdata-original-name]');
		//textTag.width(contentObj.width());
		setBodyScale(contentObj.outerWidth()*invSpaceHeight, textTag.parent(), 100, 250);
		setBodyScale(contentObj.outerWidth()*invSpaceHeight, contentObj.find('p'), 70, 150);
		if (contentObj.outerHeight(true) + 10 > invSpaceHeight) {

			while (getLineCount(textTag) > 2) {
				decrimentString(textTag);
			}

			while ((contentObj.outerHeight(true) + 10) > invSpaceHeight)
				if (decrimentString(contentObj.find('p'))< 10) break;
		}
		return contentObj.find('p').text().length;
	}
	function decrimentString(stgObj) {
		return stgObj.text(stgObj.text().substring(0, stgObj.text().length - 1)).text().length;
	}

	//TODO scale font based on whitespace
	function setBodyScale(scaleSource, textTag, minScale, maxScale) {
//		console.log('\scaleSource:'+scaleSource);
		//console.log('textTag:'+textTag);
		var scaleFactor = 0.0015;

		var fontSize = scaleSource * scaleFactor; //Multiply the width of the body by the scaling factor:
//		console.log('fontSize:' + fontSize);

		if (fontSize > maxScale) {
			fontSize = maxScale;
		}
		if (fontSize < minScale) {
			fontSize = minScale; //Enforce the minimum and maximums
		}

		textTag.css('font-size', fontSize + '%');
		//textTag.css('line-height', fontSize+20 + '%');
	}

// Narrow Layout Expand Action
// TODO: use other symbols than + -
	function invSpaceActions() {

		$('html').on('click', '.tdata-expand', function(e) {
			e.preventDefault();
			if ($(this).text() === '+') {
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
}(jQuery));
