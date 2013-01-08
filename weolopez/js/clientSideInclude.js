function updateIS2() {
	$(".csi").each(
			function(index) {
			    var c = $(this);
			    var u = c.attr("src");
			    var newDiv = '<div></div>'
			    newDiv.load(u);
			    $container.masonry().append( newDiv ).masonry( 'appended', newDiv, true );
	});

}

function loadCSS() {
	$('<link rel="stylesheet" type="text/css" href="'+"dynamicContent.css"+'" >').appendTo("head");
};


function clientSideInclude() {
    updateIS2();
};
