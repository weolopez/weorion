(function($){
$(document).ready(function(){
    $('#productSearchTxt').focus(function(){
        clearProductSearch($(this));
    }).blur(function(){
        clearProductSearch($(this));
    });
});
})($CQ || $);

function clearProductSearch(obj){
    if (obj.val() == 'Search AT&T Products'){
        obj.val('');
    } else if (obj.val() == ''){
        obj.val('Search AT&T Products');
    }
}
