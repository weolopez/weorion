/**
 
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

//Delayed fading of content
function tdataAnimate(oldSpace, newSpace) {
    oldSpace.delay(1000).fadeOut(function() {
        newSpace.addClass('adOn').hide().css('visibility', 'visible').fadeIn();
    });
}

//inserts content into slider and slider tooltip
// Custom code to integrate with JQuery Jumbotron plugin
function sliderInsert(oldSpace, newSpace, offer) {
// resize IS height to avoid tooltop overlap
    //$().invSpaceSizing( newSpace.parent().height( 270 ) );

// Insert Tooltip into the Jumbotron
    var tipString = offer.name;
    if (tipString.length > 35) {
        tipString = tipString.substr(0, 30) + '...';
    }
    var img = '<img data-tdata="' + offer.inventorySpaceId + '" src="' + offer.largeImageUrl + '" style="width:auto;" />' + tipString;
    var thumb = '<span class="thumb">' + img + '</span>';

    if (offer.statusCode === '100')
        newSpace.append(thumb);
    oldSpace.fadeOut(function() {
        newSpace.addClass('adOn').hide().css('visibility', 'visible').fadeIn();
        $(this).remove();

        var arrData = $('.bxslider li').not('.bx-clone').find('.thumb');
        var arrTip = $('.tip');

        $.each(arrTip, function(iTip, elTip) {
            var tooltip = $(this).parent(),
                    newTip = $(arrData[iTip]);
            tooltip.poshytip('update', newTip.html());
        });
    });
}
	