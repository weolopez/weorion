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
