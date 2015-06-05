function invSpaceSizing(tdataArrayObject) {
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

            var elips = pObj.text().substring(0, pObj.text().substring(0, pObj.text().length - 10).lastIndexOf(' ')) + '...';
            if (pText !== pObj.text()) {
                //alert('text:'+pObj.text().length);
                pObj.text(elips);
            }
            elips = aObj.text().substring(0, aObj.text().substring(0, aObj.text().length - 5).lastIndexOf(' ')) + '...';
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
        var lineHeight;
        if ($.browser.msie) {
            var ieVer = parseInt($.browser.version, 10);
            if (ieVer > 8) {
                lineHeight = parseFloat(textObject.css('line-height'));
            }
            if (ieVer < 9) {
                var fontSize = textObject.css('font-size');
                lineHeight = Math.floor(parseInt(fontSize.replace('px', ''))) * (parseFloat(textObject.css('line-height')));
            }
        } else {
            lineHeight = parseFloat(textObject.css('line-height'));
        }

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

        var contentWhiteSpace = invSpaceHeight - contentObj.outerHeight(true);

        if (contentWhiteSpace < 0)
            contentWhiteSpace = 0;
        //alert(invSpaceHeight+' - '+contentWhiteSpace);

        setBodyScale(contentObj.outerWidth() * contentWhiteSpace * 1.25, textTag.parent(), 125, 200);
        setBodyScale(contentObj.outerWidth() * contentWhiteSpace * 0.25, contentObj.find('p'), 85, 150);
        setBodyScale(contentObj.outerWidth() * contentWhiteSpace * 1.25, contentObj.find('span'), 75, 100);
        if (contentObj.outerHeight(true) + 10 > invSpaceHeight) {

            while (getLineCount(textTag) > 2) {
                decrimentString(textTag);
            }

            while ((contentObj.outerHeight(true) + 10) > invSpaceHeight)
                if (decrimentString(contentObj.find('p')) < 10)
                    break;
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
        var scaleFactor = 0.0075;

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