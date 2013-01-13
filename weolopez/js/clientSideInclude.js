<<<<<<< HEAD
<<<<<<< HEAD
function loadMasonry(component) {
	
    var $container = $('#container');
    var internallURL = component.attr("src");
        var jqxhr = $.ajax({
                url: internallURL,
                dataType: "html",
                complete: function( jqXHR, status ) {
			if ( callback ) {
				self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
			}
                }
            }).done(function( responseText ) {
                var tempHTML = $('<div class="box col1">').html(responseText);
//alert('adding plan'+tempHTML);
			    component.parent().remove();
                $container.masonry().append( tempHTML ).masonry( 'appended', tempHTML, true );
            }).fail(function() {
                alert("error");
            }).always(function() {
    //            alert("complete");
            });

// perform other work here ...

// Set another completion function for the request above
        jqxhr.always(function() {
         //   alert("second complete");
        });
}


=======
>>>>>>> synch changes
=======
>>>>>>> fiddle2
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
    
<<<<<<< HEAD
<<<<<<< HEAD
   // alert('log'+url);
=======
 //   alert('log'+url);
>>>>>>> synch changes
=======
 //   alert('log'+url);
>>>>>>> fiddle2
    // dynamically load content from twitter
    // Assign handlers immediately after making the request,
// and remember the jqxhr object for this request
    var jqxhr = $.getJSON(url, function( data ){   
    //	alert('jsondata'+data);
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
      }).success(function() { //alert("second success"); 
    })
    .error(function() { alert("error"); })
    .complete(function() { //alert("second success"); 
    })
// perform other work here ...
// Set another completion function for the request above
    jqxhr.complete(function() { //alert("second success"); 
    });
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> fiddle2
}

function loadMasonry(component) {
	
    var $container = $('#container');
    window.internallURL = component.attr("src");
//    alert('URL'+internallURL);
    var jqxhr = $.ajax({
                url: internallURL,
                dataType: "html",
                complete: function( jqXHR, status ) {
				if ( callback ) {
					self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
				}
                }
            }).done(function( responseText ) {
//alert('adding plan'+responseText);
                var tempHTML = $('<div class="csi box col1" src="'+this.url+'">').html(responseText);
			    component.remove();
                $container.masonry().append( tempHTML ).masonry( 'appended', tempHTML, true );
            }).fail(function() {
                alert("error");
            }).always(function() {
    //            alert("complete");
            });

// perform other work here ...

// Set another completion function for the request above
        jqxhr.always(function() {
         //   alert("second complete");
        });
<<<<<<< HEAD
>>>>>>> synch changes
=======
>>>>>>> fiddle2
}

function updateIS2() {
	$(".csi").each(function(index) {
			    var c = $(this);
<<<<<<< HEAD
<<<<<<< HEAD
			    var u = c.attr("src");
			    c.load(u);
			   // $container.masonry().append( c ).masonry( 'appended', c, true );
	});

=======
				var u = c.attr("src");
			//	c.load(u);
			    loadMasonry(c);
	});
>>>>>>> synch changes
=======
				var u = c.attr("src");
			//	c.load(u);
			    loadMasonry(c);
	});
>>>>>>> fiddle2
}

function loadCSS() {
	//$('<link rel="stylesheet" type="text/css" href="'+"dynamicContent.css"+'" >').appendTo("head");
};


function clientSideInclude() {
    updateIS2();
    $('.csi').draggable();
};
<<<<<<< HEAD
=======



<<<<<<< HEAD
>>>>>>> synch changes
=======

>>>>>>> fiddle2
