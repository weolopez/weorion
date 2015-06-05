
(function($) {
    $.fn.getRecommendations = function(args, callBackfunction) {
        var domain = 'domain' in args ? args.domain : 'tdata-recommendationsdev.stage.att.net',
                gatewayService = 'gatewayService' in args ? args.gatewayService : 'trustedserviceheader',
                versionMajor = 'versionMajor' in args ? args.versionMajor : '1',
                versionMinor = 'versionMinor' in args ? args.versionMinor : '8',
                consumptionEngine = 'consumptionEngine' in args ? args.consumptionEngine : 'ATTNET',
                userID = 'userID' in args ? args.userID : 'qayop_19221_1@att.net',
                deviceType = 'deviceType' in args ? args.deviceType : '1',
                pageID = 'pageID' in args ? args.pageID : '1',
                serviceURL = 'serviceURL' in args ? args.serviceURL : 'https://' + domain + '/nt/' + gatewayService + '/' + versionMajor + '/' + versionMinor + '/recommendations/http/' + consumptionEngine + '/' + pageID + '?userId=' + userID + '&deviceType=' + deviceType,
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
            timeout: 5000,
            success: function(data) {
                console.log("success");
               alert(data);
                executeDataTdata(data, callBackfunction);
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
        if ((data === null) || (data.offerRecord[0].statusCode === undefined)) {
            if (typeof callBackfunction === 'function') {
                callBackfunction(offers);
            }
            return offers;
        }

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
                newDiv.parent().attr('data-tdata-replace', 'defaultTransition');
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
        return offers;
    }

    $.fn.replaceContent = function(offer, tdataArrayObject, callbackFunction) {
        var oldSpace = tdataArrayObject.children().wrapAll('<div />').parent();
        var newSpace, templateString;
        if (offer.statusCode === '100') {
            templateString = handleBars(offer, offer.template);
            newSpace = tdataArrayObject.append(templateString).find('.invSpace');
            if (newSpace.html() === undefined)
                newSpace = tdataArrayObject.children().wrapAll('<div />').parent();
            else
                invSpaceSizing(tdataArrayObject);

        } else {
            var tmp = oldSpace.clone(true, true);
            oldSpace.parent().append(newSpace);
            newSpace = oldSpace;
            oldSpace = tmp;
            callbackFunction = "";
        }

        var fn = window[callbackFunction];
        if (typeof fn === 'function') {
            fn(oldSpace, newSpace, offer);
        } else {
            defaultTransition(oldSpace, newSpace);
        }
    };

    function handleBars(offer, template) {
        $.each(offer, function(key, value) {
            var re = new RegExp('{{' + key + '}}', 'g');
            template = template.replace(re, value);
        });
        return template;
    }
}(jQuery));
