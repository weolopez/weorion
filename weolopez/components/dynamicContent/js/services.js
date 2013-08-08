'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var m = angular.module('myApp.services', ['ngResource']).
        factory('Entity', function($resource) {
    return {
        offers: $resource('serviceEMU/server.json'),
        pages: $resource('serviceEMU/pages.json'),
        sizes: $resource('serviceEMU/sizes.json'),
        inventorySpace: $resource('serviceEMU/inventorySpace.json'),
        catalog: $resource('serviceEMU/catalog.json'),
        selectedSize: "",
        selectedTemplate: "",
        selectedPage: "",
        selectedInventorySpace: "",
        selectedOffer: ""
    }
}).
        factory('tdataRecommendation', function($resource) {

    var lastsel2;
    var pageOffers;
    function handleSmallSpace(oldSpace, newSpace, offer) {
        newSpace.find('img').data('height', '40');
        newSpace.find('img').data('width', '40');
        newSpace.find('img').width(40);
        newSpace.find('img').height(40);
        var hig = newSpace.find('img').data('height');
        var tdataArrayObject = newSpace.parent();

        $().invSpaceSizing(tdataArrayObject);
        newSpace.find('h1').find('a').text(newSpace.find('h1').find('a').text().substring(0, 13));
        newSpace.find('p').text(newSpace.find('p').text().substring(0, 13));
        newSpace.removeClass('wide-layout-small');
        oldSpace.remove();
        newSpace.addClass('adOn').hide().css('visibility', 'visible').fadeIn();
    }

    //Delayed fading of content
    function tdataAnimate(oldSpace, newSpace) {
        oldSpace.delay(1000).fadeOut(function() {
            newSpace.addClass('adOn').hide().css('visibility', 'visible').fadeIn();
        });
    }

    $(document).ready(function() {
        function testWH() {
            var tdataArrayObject = $('#TDIS');
            var TDISW = $('#TDISW');
            var TDISH = $('#TDISH');
            TDISW.text('Width: ' + tdataArrayObject.width());
            TDISH.text('Height: ' + tdataArrayObject.height());
            $().invSpaceSizing(tdataArrayObject);
        }

        $().getRecommendations({
            consumptionEngine: 'ATTNET',
            pageID: '1',
            url: 'serviceEMU/server.json'
        }, function(offers) {
            pageOffers = offers;
            $("#bedata").click(function() {
                var gr = jQuery("#editgrid").jqGrid('getGridParam', 'selrow');
                if (gr != null)
                    jQuery("#editgrid").jqGrid('editGridRow', gr, {height: 280, reloadAfterSubmit: false});
                else
                    alert("Please Select Row");
            });

            testWH();

            /*      $('#resizable').resizable().on('resize', function(event, ui) {
             //            console.log('resize');
             testWH();
             });
             */
            function testWH() {
                var tdataArrayObject = $('#TDIS');
                var TDISW = $('#TDISW');
                var TDISH = $('#TDISH');
                TDISW.text('Width: ' + tdataArrayObject.width());
                TDISH.text('Height: ' + tdataArrayObject.height());
                $().invSpaceSizing(tdataArrayObject, tdataArrayObject.find('.invSpace'));
            }
        });
    });

    //Delayed fading of content
    function tdataAnimate(oldSpace, newSpace) {
        oldSpace.delay(1000).fadeOut(function() {
            newSpace.addClass('adOn').hide().css('visibility', 'visible').fadeIn();
        });
    }

    function attcom(oldSpace, newSpace, offer) {

        var attcomDesign = '<div style="width:290px;height:163px;visibility:visible;border: 1px solid #0094D7;"><div style="position: relative;border: 1px solid #0094D7;padding: 0.5em 0.75em;-moz-box-sizing: border-box; box-sizing: border-box;width:290px;height:163px;line-height: 1;font-family: verdana, sans-serif;"><h1 data-tdata-name style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;color: #ff7200;margin: 0px;padding: 0px;font: bold 1em sans-serif;">Messaging Unlimited</h1><p data-tdata-description style="margin: 0em 0;font-size: 0.75em;line-height: 1.25;color: #333;width: 65%;">Unlimited messaging for everone in your family - only $30/month!</p><img data-tdata-image src="http://www.att.com/catalog/en/skus/images/samsung-galaxy%20s%204%2016gb-black%20mist-160x160.jpg" style="position: absolute;right: 0;bottom: 0;width: 100px;height:100px;z-index: -1;"/><a data-tdata-link href="#" style="position: absolute;bottom: 0.5em;">Learn More</a></div></div>';

        var tdataObject = oldSpace.parent();
        oldSpace.remove();
        newSpace.remove();
        var replaceSpace = tdataObject.append(attcomDesign).find('.invSpace');
        $().replaceContent(offer, tdataObject, tdataAnimate);

    }
}).
        value('version', '0.5');
  