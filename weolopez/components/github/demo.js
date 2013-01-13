var openBOX = 'false';	

$('body').click(function(){
	if (openBOX=='true') {
    		$(".pop").flip({
					content: $(".csi"),
					speed: 750,
					color: 'silver',
					bgColor: 'silver',
					direction:'lr'
				});
	}
});
	
$(".csi").live({
        click:
           function() {
				if (openBOX=='false') {
          		$(".csi").flip({
                content: $(".pop"),
                speed: 750,
                color: 'silver',
                bgColor: 'silver',
                direction:'lr'
              });
	                openBOX='true';
	            }
	          }
	   });