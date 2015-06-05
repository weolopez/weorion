
(function($) {
    $.fn.getRecommendations = function(args, callBackfunction) {
        var domain = 'domain' in args ? args.domain : 'tdata-recommendationsdev.stage.att.net',
                versionMajor = 'versionMajor' in args ? args.versionMajor : '1',
                versionMinor = 'versionMinor' in args ? args.versionMinor : '8',
                consumptionEngine = 'consumptionEngine' in args ? args.consumptionEngine : 'ATTNET',
                userID = 'userID' in args ? args.userID : 'qayop_19221_1@att.net',
                deviceType = 'deviceType' in args ? args.deviceType : '1',
                pageID = 'pageID' in args ? args.pageID : '1',
                serviceURL = 'serviceURL' in args ? args.serviceURL : 'https://' + domain + '/nt/trustedserviceheader/' + versionMajor + '/' + versionMinor + '/recommendations/http/' + consumptionEngine + '/' + pageID + '?userId=' + userID + '&deviceType=' + deviceType,
                //serviceURL='http://tdata-recommendationsdev.stage.att.net/nt/trustedserviceheader/1/8/recommendations/http/ATTNET/1?userId=qayop_19221_1@att.net&deviceType=1',
                //serviceURL='js/'+userID+'.json',
                onErrorFunction = 'onErrorFunction' in args ? args.onErrorFunction : function() {
            try {
                $().getRecommendations({
                    serviceURL: 'js/attnet-server.json',
                    onErrorFunction: function(data) {
                        executeDataTdata($.parseJSON(data.responseText), callBackfunction);
                    }
                });
            } catch (err) {
            }
            ;
        };

        $.ajax({
            url: serviceURL,
            dataType: 'jsonp',
            contentType: "application/json",
            type: 'GET',
            timeout: 1000,
            success: function(data) {
                //console.log("success");
                //alert(data);
                if (data === null) {
                    onErrorFunction(data);
                } else {
                    return executeDataTdata(data, callBackfunction);
                }
            },
            error: function(data) {
                //console.log("error");
                onErrorFunction(data);
            }
        }).done(function(data) {
            //console.log("done");
        });
    };

    /*
     * executeDataTdata:  Traversices the Recommendation Response and for each InventorySpace find the corresponding InventorySpace in the DOM and apply the functions according to the data-tdata custom attributes.
     
     * @param {type} data
     * 	data is the raw JSON object.
     * @param {type} callBackfunction
     * 	callback function to execute after the DOM has been updated.
     * @returns {unresolved} */
    $.fn.executeDataTdata = function(data, callBackfunction) {
        var offers = data.offerRecord;


        for (i = 0; i < offers.length; i++) {
            var offer = offers[i];
        }

        //LOOP through offers and data-tdata attributes
        for (i = 0; i < offers.length; i++) {
            var offer = offers[i];

            if (offer.selector !== undefined) {
                var $election = $(offer.selector);
                var newDiv = $election.children().wrapAll('<div />');
                newDiv.parent().attr('data-tdata', offer.inventorySpaceId);
                newDiv.parent().attr('data-tdata-replace','defaultTransition');
                newDiv.parent().height(offer.height);
                newDiv.parent().width(offer.width);
            }
            var tdataArr = $('[data-tdata]');
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
        return;// $.parseJSON(offers);
    }

    $.fn.replaceContent = function(offer, tdataArrayObject, callbackFunction) {
        var oldSpace = tdataArrayObject.children().wrapAll('<div />').parent();
        var newSpace;
        if (offer.statusCode === '100') {
            if (offer.widget !== undefined) {
                newSpace = tdataArrayObject.append(offer.widget).find('.invSpace');
            } else {
                if (offer.template !== undefined) {
                    oldSpace.remove();
                    tdataArrayObject.append(offer.template).find('.invSpace');
                    oldSpace = tdataArrayObject.children().wrapAll('<div />').parent();
                }
                newSpace = swapContent(offer, oldSpace);
                if (newSpace === '') {
                    var htmlTemplate = getHTML(offer, tdataArrayObject.height());
                    newSpace = tdataArrayObject.append(htmlTemplate).find('.invSpace');
                    invSpaceSizing(tdataArrayObject);
                }
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
        if (Math.abs(iSHeight - offer.imageHeight) > Math.abs(iSHeight - offer.largeImageHeight)) {
            var newImgUrl = offer.largeImageUrl;
            var newWidth = offer.largeImageWidth;
            var newHeight = offer.largeImageHeight;
        } else {
            var newImgUrl = offer.imageUrl;
            var newWidth = offer.imageWidth;
            var newHeight = offer.imageHeight;
        }
        return   '<div class="invSpace"><a href="' + offer.url + '" class="imgWrap"><img src="' + newImgUrl + '" alt="image alt" data-width="' + newWidth + '" data-height="' + newHeight + '"/></a><div class="content"><h1 style="margin: 0; font-size: 2em; line-height: 1.25;"><a href="' + offer.url + '" data-tdata-original-name="' + offer.name + '">' + offer.name + '</a><a href="#" class="tdata-expand">+</a></h1><p data-tdata-text="' + offer.displayDescription + '">' + offer.displayDescription + '</p> <a href="' + offer.url + '"><span>Learn More</span></a></div></div>';
    }

// Swaps the image and text in the tdataObject from the offer
    function swapContent(offer, oldSpace) {
        var found = '';
        var newSpace = oldSpace.clone(true, true);
        newSpace.find('[data-tdata-image]').each(function() {
            var imageValue = $(this).data('tdata-image'),
                    imageW = $(this).width(),
                    imageH = $(this).height();
            //$(this).width(imageW);
            //$(this).height(imageH);
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
}(jQuery));
