function flippyWEO(box,to,from) {	
var openBOX=true;	
	box.live({
		click:function() {
      if (openBOX) {     		
          		box.flip({
                content: to,
                speed: 750,
                color: 'silver',
                bgColor: 'silver',
                direction:'lr'
              });
	            openBOX=false;
      } else {
          		box.flip({
                content: from,
                speed: 750,
                color: 'silver',
                bgColor: 'silver',
                direction:'lr'
              });
	            openBOX=true;      
      }
		}
	});
}
