

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

