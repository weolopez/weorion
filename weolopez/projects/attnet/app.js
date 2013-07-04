/**
 * Created with JetBrains RubyMine.
 * User: jhughes
 * Date: 6/6/13
 * Time: 11:01 AM
 * To change this template use File | Settings | File Templates.
 */
function loadTips() {
    $('.bx-pager-item').append('<div class="tip"></div>');

    var arrData = $('.bxslider li').not('.bx-clone').find('.thumb');
    var arrTip = $('.tip');

    $.each(arrTip, function(iTip, elTip) {
        $(this).append($(arrData[iTip]).html());
    });

    $('.bx-pager-item').each(function() {
        $(this).poshytip({
            content: $(this).children('div.tip').html(),
            className: 'tip-white',
            showTimeout: 0.2,
            alignTo: 'target',
            alignX: 'center',
            offsetX: 10,
            allowTipHover: false,
            bgImageFrameSize: 6,
            fade: true,
            slide: false
        });
    });
}

function swapTips() {
    var arrData = $('.bxslider li').not('.bx-clone').find('.thumb');
    var arrTip = $('.tip');

    $.each(arrTip, function(iTip, elTip) {
        $(this).parent().poshytip('update', arrData[iTip].html());
    });
}

$(document).ready(function() {
    $('.bxslider').bxSlider({
        controls: false,
        slideSelector: '.bxslider>li',
        auto: true,
        autoHover: true,
        onSliderLoad: function() {
            loadTips();
        }
    });
    function testWH() {
        var tdataArrayObject = $('#TDIS');
        var TDISW = $('#TDISW');
        var TDISH = $('#TDISH');
        TDISW.text('Width: ' + tdataArrayObject.width());
        TDISH.text('Height: ' + tdataArrayObject.height());
        $().invSpaceSizing(tdataArrayObject);
    }

    $().getRecommendations({
	    consumptionEngine:'ATTNET',
	    pageID:'1'
    },function() {
        testWH();

        $('#resizable').resizable().on('resize', function(event, ui) {
//            console.log('resize');
            testWH();
        });
    });
});