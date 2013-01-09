function loadTWIT(twit) {
    var $container = $('#container');
    
    $('#mini-container').masonry({
      columnWidth: 50
    });
    
    var loadingItem = twit;
        
    var ajaxError = function(){
      loadingItem.text('Could not load examples :');
    };
    var url = 'https://api.twitter.com/1/statuses/user_timeline.json?screen_name='+twit.attr("id")+'&count=5&callback=?';
    
   // alert('log'+url);
    // dynamically load content from twitter
    // Assign handlers immediately after making the request,
// and remember the jqxhr object for this request
    var jqxhr = $.getJSON(url, function() {
 //       alert("success");
    }).success(function() { //alert("second success"); 
    })
    .error(function() { alert("error"); })
    .complete(function( data ){   
    	alert('jsondata'+data);
    	   // proceed only if we have data
        if ( !data || !data.length ) {
          ajaxError();
          return;
        }
        var items = [],
            item, datum;
        
        for ( var i=0, len = data.length; i < len; i++ ) {
          datum = data[i];
          item = '<div class="box col2" ><a href="' + datum.user.url + '">'
            + '<img style="width:50px;height:65px" src="' + datum.user.profile_image_url.replace('/l.', '/m.') + '" />'
            + '<b>' + datum.text + '</b>'
            + '</a></div>';
          items.push( item );
        }
        
        var $items = $( items.join('') );
        $items.imagesLoaded(function(){
          //$container.masonry( 'remove', loadingItem );
          twit.remove();
          $container.masonry().append( $items ).masonry( 'appended', $items, true );
            
        });
      });
// perform other work here ...
// Set another completion function for the request above
    jqxhr.complete();
}

function updateIS2() {
	$(".csi").each(
			function(index) {
			    var c = $(this);
			    var u = c.attr("src");
			    c.load(u);
			   // $container.masonry().append( c ).masonry( 'appended', c, true );
	});

}

function loadCSS() {
	$('<link rel="stylesheet" type="text/css" href="'+"dynamicContent.css"+'" >').appendTo("head");
};


function clientSideInclude() {
    updateIS2();
};
