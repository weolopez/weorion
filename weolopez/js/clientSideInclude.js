<<<<<<< HEAD
function load(twit) {
    
    var $container = $('#container');
=======
function buildCSI() {
    
    var $container = $('#container');
    var csiHTMLs = [];
>>>>>>> working on twitter client
    
    $('#mini-container').masonry({
      columnWidth: 50
    });
    
<<<<<<< HEAD
    var loadingItem = twit;
        
    var ajaxError = function(){
      loadingItem.text('Could not load examples :');
    };
    
    // dynamically load content from twitter
    $.getJSON('https://api.twitter.com/1/statuses/user_timeline.json?screen_name='+twit.attr("id")+'&count=5&callback=?')
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
          //$container.masonry( 'remove', loadingItem );
          twit.remove();
          $container.masonry().append( $items ).masonry( 'appended', $items, true );
            
        });
        
      });
}
=======
    $(".csi").each(
	    function(index) {
		    var c = $(this);
			var u = c.attr("src");
			if (u!="twitter") $(this).load(u);
			else {
			u='https://api.twitter.com/1/statuses/user_timeline.json?screen_name=weolopez&count=5&callback=?';
			$.getJSON(
				u, 
				function(data) {
  					alert("function"); 
				})
			.success(function() {
				alert("second success"); 
			})
  			.error(function() { 
  				alert("error"); 
  			})
  			.complete(function(data) { 
  				alert("complete"); 
  				var csiHTML = '<div class="box col1" >'+data+'</div>';
				csiHTMLs.push(csiHTML);
  			});
  			}
	});
	var $items = $( csiHTMLs.join('') );
	$items.imagesLoaded(function(){ 
    	$container.masonry().append( $items ).masonry( 'appended', $items, true ); 
    });
	//var csiComponents = $( csiHTMLs.join('') );
   // csiComponents.imagesLoaded(function(){
          //$container.masonry( 'remove', loadingItem );
          //twit.remove();
  //  });
}	

>>>>>>> working on twitter client

function loadTWIT(twit) {
    
    var $container = $('#container');
    
    $('#mini-container').masonry({
      columnWidth: 50
    });
    
    var loadingItem = twit;
        
    var ajaxError = function(){
      loadingItem.text('Could not load examples :');
    };
    
    // dynamically load content from twitter
    $.getJSON('https://api.twitter.com/1/statuses/user_timeline.json?screen_name='+twit.attr("id")+'&count=5&callback=?')
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
          //$container.masonry( 'remove', loadingItem );
          twit.remove();
          $container.masonry().append( $items ).masonry( 'appended', $items, true );
            
        });
        
      });
}

function updateIS2() {
	$(".csi").each(
			function(index) {
			    var c = $(this);
			    var u = c.attr("src");
			    $(this).load(u);
	});
	$(".twitter").each(
			function(index) {
			    var c = $(this);
			    var t = c.attr("id");
<<<<<<< HEAD
			    load(c);
=======
			    loadTWIT(c);
>>>>>>> working on twitter client
		});
}

function loadCSS() {
	$('<link rel="stylesheet" type="text/css" href="'+"dynamicContent.css"+'" >').appendTo("head");
};


function clientSideInclude() {
    //updateIS2();
    buildCSI();
};



