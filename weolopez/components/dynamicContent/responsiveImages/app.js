var monitor = $('.monitor');

$(document).ready(function(){
    var monitorString='';
    
    $.each($('.tile').find('img'), function(){
        var imgH = $(this).height(),
            tile = $(this).closest('.tile'),
            imgW = $(this).width(),
            tileW = tile.width(),
            whiteSpaceW = tileW-imgW,
            isPortrait = (whiteSpaceW > '170');

		monitorString += '\nTile Width: '+tileW+'Width: '+imgW+' Height: '+imgH+' is Portrait: '+isPortrait+' WhiteSpace: '+whiteSpaceW;
       

        if (isPortrait){
            tile.addClass('portrait');
        } 
    })
    monitor.text(monitorString);
 console.log(monitorString);
})

window.onresize = function(event) {
    var monitorString='';
    $.each($('.tile').find('img'), function(){
        var imgH = $(this).height(),
            contentH = $(this).find('conent').height(),
            tile = $(this).closest('.tile'),
            imgW = $(this).width(),
            tileW = tile.width(),
            whiteSpaceW = tileW-imgW,
            imageSpaceH = imgH-contentH,
            isPortrait = (whiteSpaceW > '170'),
            isNotEnoughImage = (imageSpaceH < '200');

		monitorString += '\nTile Width: '+tileW+' Width: '+imgW+' Height: '+imgH+' is Portrait: '+isPortrait+' WhiteSpace: '+whiteSpaceW;

        if (isPortrait){
            tile.addClass('portrait');
        } else tile.removeClass('portrait');

		if (isNotEnoughImage) {
			$(this).find('p').hide();
		}
    })
        monitor.text(monitorString);
                console.log(monitorString);
}