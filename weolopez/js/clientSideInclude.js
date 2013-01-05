function load(twit) {
	$(function(){
    
    var $container = $('#container');
    
    $('#mini-container').masonry({
      columnWidth: 50
    });
    
 /*   $container.masonry({
      itemSelector: '.box',
      columnWidth: 240,
      isAnimated: !Modernizr.csstransitions
    });
   */ 
    // Sites using Masonry markup
    var $sites = $('#sites'),
        $loadingItem = $container.find('#loading');
        
    var ajaxError = function(){
      $loadingItem.text('Could not load examples :(');
    };
    
    // dynamically load content from twitter
    $.getJSON('https://api.twitter.com/1/statuses/user_timeline.json?screen_name='+twit+'&count=5&callback=?')
      .error( ajaxError )
      .success(function( data ){
        
        // proceed only if we have data
        if ( !data || !data.length ) {
          ajaxError();
          return;
        }
        var items = [],
            item, datum;
        
        for ( var i=0, len = data.length; i < len; i++ ) {
          datum = data[i];
          item = '<div class="box col1" ><a href="' + datum.user.url + '">'
            + '<img style="width:50px;height:65px" src="' + datum.user.profile_image_url.replace('/l.', '/m.') + '" />'
            + '<b>' + datum.text + '</b>'
            + '</a></div>';
          items.push( item );
        }
        
        var $items = $( items.join('') );
        $items.imagesLoaded(function(){
          //$container.masonry( 'remove', $loadingItem );
          $('#loading').remove();
          $container.masonry().append( $items ).masonry( 'appended', $items, true );
            
        });
        
      });
    
  });
}

function updateIS2() {
	
		$(".csi").each(
			function(index) {
			    var c = $(this);
			    var u = c.attr("src");
	   // 		alert(index + ': ' + u);
	   			
			    $(this).load(u);
			    /*, function(){
			    	c.append($(this).html());
			    });*/
			});
};


function loadCSS() {
	$('<link rel="stylesheet" type="text/css" href="'+"dynamicContent.css"+'" >').appendTo("head");
};


function clientSideInclude() {
    updateIS2();
};


function dynamicLoad(twit, loadingDivID) {

    var $container = $('#container');
    
    $('#mini-container').masonry({
      columnWidth: 50
    });
    
 /*   $container.masonry({
      itemSelector: '.box',
      columnWidth: 240,
      isAnimated: !Modernizr.csstransitions
    });
   */ 
    // Sites using Masonry markup
    var $sites = $('#sites')
    var $loadingItem = $container.find(loadingDivID);
        
    var ajaxError = function(){$loadingItem.text('Could not load examples :(');};
    
    // dynamically load content from twitter
    $.getJSON('https://api.twitter.com/1/statuses/user_timeline.json?screen_name='+twit+'&count=5&callback=?')
      .error( ajaxError )
      .success(function( data ){
        // proceed only if we have data
        if ( !data || !data.length ) {
          ajaxError();
          return;
        }
        var items = [],
            item, datum;
        for ( var i=0, len = data.length; i < len; i++ ) {
          datum = data[i];
          item = '<div class="box col1" ><a href="' + datum.user.url + '">'
            + '<img style="width:50px;height:65px" src="' + datum.user.profile_image_url.replace('/l.', '/m.') + '" />'
            + '<b>' + datum.text + '</b>'
            + '</a></div>';
          items.push( item );
        }
        var $items = $( items.join('') );
        $items.imagesLoaded(function(){
         // $container.masonry( 'remove', $('.githubloading' );
          $('#githubloading').remove();
          $container.masonry().append( $items ).masonry( 'appended', $items, true );
        });
      });
}

dynamicLoad('orionhub','.githubloading');

//dynamicLoad('twitter','.twitter');
