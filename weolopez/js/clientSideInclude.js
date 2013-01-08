function updateIS2() {
	$(".csi").each(
			function(index) {
			    var c = $(this);
			    var u = c.attr("src");
			    $(this).load(u);
	});

}

function loadCSS() {
	$('<link rel="stylesheet" type="text/css" href="'+"dynamicContent.css"+'" >').appendTo("head");
};


function clientSideInclude() {
    updateIS2();
};
