/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


/*
 * JS Functions for TDATA Personalized Recommendations
 * Date Created: 28-Apr-2013
 * Authors:  Ananthakrishnan Balakrishnan, Sundar MR
 * Description: This file contains the scripts used in TData Personalized Recommendation
 * This makes service calls to TDATA and fetches the Recommendation.  The Offers received
 * will be processed against the Inventory Spaces in the Page and replace the content with
 * TData offers
 * Pre-requisites: jQuery 1.3.2+
 *
 */
 var userId="";
$(document).ready(function () {
	/* this url will have to be updated before prod push */
    //var serviceURL = "http://tdatastage.att.net/attportal/s/srv.dll?ep=1&page=offers&only=y&nohtmtags=1";
	  var userURL = "http://tdatastage.att.net/attportal/s/s.dll?spage=srv/userid.htm&only=y&nohtmtags=1";
	  
    function callAjax(userId) {	
			//console.log(userId)	
			if(userId==''){
				userId='anonymous';
				//alert(userId);
			}
			$.ajax( {
					url:'http://216.77.161.49:6090/nt/RecommendationsService/1/0/recommendations/http/ATTNET/1?userId=pk502t@portal.att.net&deviceType=1&callback=?',
					//url:'http://216.77.161.49:6090/nt/Recommendations/2/0/recommendationsjson/http/ATTNET/1?userId='+userId+'@portal.att.net&deviceType=1&callback=?',
					dataType : 'jsonp',
					contentType: "application/json",
					type:'GET',
					username:'CEConnectorSG',
					password:'password',
					/*beforeSend : function (xhr) {
										var bytes = Crypto.charenc.Binary.stringToBytes("CEConnectorSG" + ":" + "password");
										var base64 = Crypto.util.bytesToBase64(bytes);
										xhr.setRequestHeader("Authorization", "Basic " + base64);
								},*/
					success:function(data){
								//console.log(data);
								//console.log(navigator.userAgent);
								parseJSONObj(data);
								},
					error:function(error){
								//console.log(error);
							}
			});
    }

    function parseJSONObj(response) {
	//console.log(response);
		var v= response.offerRecord;
		//alert(v.length);
		if(v.length!=undefined && v.length>1){
		$.each(v ,function(i,offerRecord){
			injectRecommendations(offerRecord);	
		});
		}else{
			injectRecommendations(v);	
		}
		
    }
    $.get(userURL, function (data) {
						userId=data;
						callAjax(userId);
	});
	
	
	function injectRecommendations(v){
	
		$("img[data-tdatalargeimage='"+v.inventorySpaceId+"']").each(function() {		
			$(this).attr("src",v.largeImageUrl);
			$(this).attr("title",v.name);
			$(this).attr("alt",v.name);
		});
		$("img[data-tdatasmallimage='"+v.inventorySpaceId+"']").each(function() {	
			//console.log($(this));
			$(this).attr("src",v.imageUrl);
			$(this).attr("title",v.name);
			$(this).attr("alt",v.name);
		});
		$("a[data-tdataurl='"+v.inventorySpaceId+"']").each(function() {		
			$(this).attr("alt",v.name);
			$(this).attr("title",v.name);
			$(this).attr("href",v.url)
		});
		$("span[data-tdatalargetext='"+v.inventorySpaceId+"']").each(function() {	
			//Very bad Hack this need to change
			var content = $(this).html();
			//console.log(content);
			var length = content.length;
			var index = content.indexOf('>');
			content= content.substring(0,index+1);
			//console.log(content);
			$(this).empty();
			if(index==-1){
			//console.log("Content" +content);
			//console.log(" Descrip "+v.displayDescription.substring(0,length));
				$(this).append(v.displayDescription.substring(0,length));	
			}else{
				$(this).append(content+v.name);	
			}
		});
	}
});

