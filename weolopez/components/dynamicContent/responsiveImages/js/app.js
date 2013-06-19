$(document).ready(function(){
    invSpaceSizing();

    $('.invSpace').find('.expand').on('click', function(e){
        e.preventDefault();
        if($(this).text()=='+'){
            $(this).text('-');
        } else {
            $(this).text('+');
        };
        $(this).closest('.invSpace').find('p').slideToggle();
        if ($(window).width() < 321){
            $(this).closest('.invSpace').find('img').toggle();
        }
    })


})

$(window).resize(function(){
    invSpaceSizing();
})


function invSpaceSizing(){
    $.each($('.invSpace').find('img'), function(){
        var invSpaceObj = $(this).closest('.invSpace'),
            contentObj = invSpaceObj.find('.content'),

            imgW = $(this).width(),
            imgH = $(this).height(),

        // isPortrait = (imgH > imgW),

            invSpaceWidth = $(this).closest('.invSpace').width();

        // console.log(whiteSpace);

        //console.log('img width: '+ imgW +' img height: '+ imgH)
        if (imgH > invSpaceObj.height()){
            $(this).height('100%');
        }

        var whiteSpace = (invSpaceWidth - $(this).width()) / invSpaceWidth,
            isWideLayout = (whiteSpace > 0.4);

        if (isWideLayout){
            /* Set image height to 100% and set imgWrap to same width */
            //$(this).height('100%').width('auto').closest('.imgWrap').width(imgW);
            $(this).closest('.imgWrap').width($(this).width());
            //invSpaceObj.height($(this).height());

            /* Remove Class then add class */
            invSpaceObj.addClass('wide-layout');

            contentObj.outerWidth((whiteSpace*100)-2+'%');

        } else {
            invSpaceObj.removeClass('wide-layout');

            /*
            if (imgW > invSpaceObj.find('.imgWrap').width()){
                $(this).width('100%').height('auto');
            }
            */
        }


    })
}