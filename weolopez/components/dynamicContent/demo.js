	var recommendationURL="https://raw.github.com/weolopez/weorion/master/weolopez/recommendationResponse.json";
	var recommendationURL="http://home.orionhub.org:8080/weolopez/recommendationResponse.json";
    $.getJSON(recommendationURL, {
    	dataType:'jsonp'
		  },  function(data) {
		  	 $(".tdata").each(function(){
		  	 	var ispace = $(this).attr('id');
		  	 	var myspace='';
		  	         $.each(data.CE.IUs, function(i, v) {
		  	         	if (v.name==ispace) {
		  	         		myspace=v;
		  	         		return;
		  	         	}
		  	         });	
		  
				if (myspace=='') {
					//remove loading css
					return;
				}
		  	    var clone = $(this).clone();      
		  	 	var tdi = clone.find('.TDataImage');
		  	 	tdi.attr("src", myspace.url);
		        var tmp = $(('.TDataTitle'),clone);
		        tmp.html(myspace.title);
		        var tmp = $(('.TDataText'), clone);
		        tmp.html(myspace.text);
		        
		        $(this).flip({
                content: clone,
                speed: 750,
                color: 'black',
                bgColor: 'silver',
                direction:'tb'
              });
		        
		  	 });
		    }
	 );
