function demo(component,u) {
    var componentName = component.attr("id");
    var $container = $('#container'); //TODO get from component

    if (u == undefined) {
        var internallURL = "components/" + componentName + "/" + componentName + ".html";
        var jqxhr = $.ajax({
            url: internallURL,
            dataType: "html",
            complete: function(jqXHR, status) {
                if (callback) {
                    self.each(callback, response || [jqXHR.responseText, status, jqXHR]);
                }
            }
        }).done(function(responseText) {
         //   alert('adding plan' + tempHTML);
            var tempHTML = $('<div id="' + componentName + '" class="flippy box col1">').html(responseText);
		//	    component.parent().remove();
            $container.masonry().append(tempHTML).masonry('appended', tempHTML, true);
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
    } else {
        var internallURL = u;
        var jqxhr = $.ajax({
            url: internallURL,
            dataType: "html",
            complete: function(jqXHR, status) {
                if (callback) {
                    self.each(callback, response || [jqXHR.responseText, status, jqXHR]);
                }
            }
        }).done(function(responseText) {
            var tempHTML = $('<div class="box col1">').html(responseText);
            //alert('adding plan'+tempHTML);
            component.parent().remove();
            $container.masonry().append(tempHTML).masonry('appended', tempHTML, true);
        }).fail(function(data) {
            alert("error"+data);
        }).always(function() {
            // alert("complete");
        });

        // perform other work here ...

        // Set another completion function for the request above
        jqxhr.always(function() {
            // alert("second complete");
        });
    }
}

function masonryCSI() {
    $(".csi").each(
            function(index) {
                var c = $(this);
                var u = c.attr("src");
                demo(c,u);
                // $container.masonry().append( c ).masonry( 'appended', c, true );
            });
}

