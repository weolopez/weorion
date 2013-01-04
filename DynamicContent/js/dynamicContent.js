

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
	
	var recommendationURL="http://dynamiccontent-site.orionhub.org:8080/DynamicContent/recommendationResponse.json";
    $.getJSON(recommendationURL, function(data) {

        $.each(data.CE.IUs, function(i, v) {
            var tmp1 = $("#" + v.name).find('.TDataImage');
            tmp1.attr("src", v.url);
            var tmp = $(('.TDataTitle'), $("#" + v.name));
            tmp.html(v.title);
            var tmp = $(('.TDataText'), $("#" + v.name));
            tmp.html(v.text);
        });
        
    });

	/*
		$(".FlipFrom").each(
			function(index) {
				var ff = $(this).parent();
				var dv = ff.find(".FlipTo");
			//	dv.show();
				$(this).flippy({
					color_target:"green",
					content: $(dv),
					direction:"TOP",
					duration:"750",
					onMidway:function(){
						dv.show();
					}
				}); 
			}
		);
		*/
};


function loadCSS() {
	$('<link rel="stylesheet" type="text/css" href="'+"dynamicContent.css"+'" >').appendTo("head");
};



function end() {
    updateIS2();
};

