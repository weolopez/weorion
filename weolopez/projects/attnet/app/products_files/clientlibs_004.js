(function($) {
$(document).ready(function(){
    $('#sNav li:first-child a').css('font-weight','bold');
    
    $('#sNav a').click(function(){
        $('#sNav a').css('font-weight','normal');
        $(this).css('font-weight','bold');
        //$('#term').focus();
        
        setSearchType();
                    
        switch($(this).prop('id')){
                case 'sWeb':
                    $('.sWhere').css('display','none');
                    $('.sInputs .sTxt').width(422);
                    $('.sLogo').css('background-position','100px');
                    $('.sBtn').val('Search Web');
                    $('.sBtn').attr('data-ct','att|masthead|search|'+$(this).prop('title')+' Web');
                break;
                
                case 'sYP':
                    $('.sWhere').css('display','inline');
                    $('.sInputs .sTxt').width(194);
                    $('.sLogo').css('background-position','right top');
                    $('.sBtn').val('Search Local');
                    $('.sBtn').attr('data-ct','att|masthead|search|'+$(this).prop('title'));
                break;
                
                case 'sPpl':
                    $('.sWhere').css('display','inline');
                    $('.sInputs .sTxt').width(194);
                    $('.sLogo').css('background-position','right -20px');
                    $('.sBtn').val('Search People');
                    $('.sBtn').attr('data-ct','att|masthead|search|'+$(this).prop('title'));
                break;
                
                case 'sImg':
                    $('.sWhere').css('display','none');
                    $('.sInputs .sTxt').width(422);
                    $('.sLogo').css('background-position','100px');
                    $('.sBtn').val('Search Images');
                    $('.sBtn').attr('data-ct','att|masthead|search|'+$(this).prop('title'));
                break;
                
                case 'sVid':
                    $('.sWhere').css('display','none');
                    $('.sInputs .sTxt').width(422);
                    $('.sLogo').css('background-position','100px');
                    $('.sBtn').val('Search Video');
                    $('.sBtn').attr('data-ct','att|masthead|search|'+$(this).prop('title'));
                break;
                
                case 'sMore':
                    $('.sWhere').css('display','none');
                    $('.sInputs .sTxt').width(422);
                    $('#sNav li:first-child a').css('font-weight','bold');
                    $(this).css('font-weight','normal');
                    $('.sLogo').css('background-position','100px');
                    resetSearchTxt('sMore');
                    $('.sBtn').val('Search Web');
                    return true;
                break;
        }
        
        return false;   
    }); 
    
    // Clear out inputs
    $('.sTxt').focus(function(){
        clearSearchTxt($(this).prop('id')); 
    }).blur(function(){
        clearSearchTxt($(this).prop('id'));         
    }); 
    
    // Submit Form
    $('#sf').submit(function(){
        $('#sNav li a').each(function(){
            if ($(this).css('font-weight') == '700' || $(this).css('font-weight') == 'bold'){
                type = $(this).prop('id');  
            }
        });
        //alert(type);
        submitSearch(type); 
        return false;
    });
            
})


function resetSearchTxt(type){
    if (type == 'sWeb' || type == 'sImg' || type == 'sVid' || type == 'sMore' ){
        if ($('#term').val()=='Business or Category' || $('#term').val()=='Last Name'){
            $('#term').val('');
        }
        if ($('#where').val()=='City, State or Zip Code'){
            $('#where').val('');
        }
        
        
    } else if (type == 'sYP'){
        if ($('#term').val()=='' || $('#term').val()=='Last Name'){
            $('#term').val('Business or Category');
        }
        if ($('#where').val()==''){
            $('#where').val('City, State or Zip Code');
        }
        
        
    } else if (type == 'sPpl'){
        if ($('#term').val()=='' || $('#term').val()=='Business or Category'){
            $('#term').val('Last Name');
        }
        if ($('#where').val()==''){
            $('#where').val('City, State or Zip Code');
        } 
    }
}

function setSearchType(){
    var type;
    $('#sNav li a').each(function(){
        if ($(this).css('font-weight') == '700' || $(this).css('font-weight') == 'bold'){
            type = $(this).prop('id');  
        }
    });
    resetSearchTxt(type);
}
    

function clearSearchTxt(id){
    switch(id){
        case 'term':
            if ($('#term').val()=='Business or Category' || $('#term').val()=='Last Name'){
                $('#term').val('');
            }   else if ($('#term').val()==''){
                if ($('#sYP').css('font-weight')=='700' || $('#sYP').css('font-weight')=='bold'){
                    $('#term').val('Business or Category');
                } else if ($('#sPpl').css('font-weight')=='700' || $('#sPpl').css('font-weight')=='bold'){
                    $('#term').val('Last Name');
                }
            }       
        break;
        
        case 'where':
        if ($('#where').val()=='City, State or Zip Code'){
            $('#where').val('');
        } else if ($('#where').val()==''){
            $('#where').val('City, State or Zip Code');
        }
        break;
    }
}

function submitSearch(type){
    var sTerm = escape($('#term').val());
    var sWhere = escape($('#where').val());
    if(type == "sWeb" ) {   
        document.location.href="http://us.yhs4.search.yahoo.com/yhs/search?hspart=att&hsimp=yhs-att_001&p="+sTerm;
    }
    else if (type == "sImg") {
        document.location.href="http://images.search.yahoo.com/search/images?p="+sTerm+"&ei=UTF-8&fr=att_image&type=imgagesearch&.partner=sbc";
    }   
    else if(type == "sVid") {
        document.location.href="http://video.search.yahoo.com/search/video?p="+sTerm+"&ei=UTF-8&fr=att_video&type=videosearch&.partner=sbc";
    } 
    else if(type == "sYP") {
        document.location.href="http://www.att.net/s/s.dll?string="+sTerm+"&where="+sWhere+"&spage=search%2Fypresults.htm&searchtype=yp&source=APYHPYPS&ch=search";
    } 
    else if(type == "sPpl") {
        document.location.href="http://www.att.net/s/s.dll?string="+sTerm+"&where="+sWhere+"&spage=search%2Fpplresults.htm&searchtype=ppl&source=APYHPYPS&ch=search";
    } 
    return false;
}
})($CQ || $);
