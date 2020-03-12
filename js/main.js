var layoutOptions = {
		east:{
			applyDefaultStyles: true,
			size:	300,
			closable:		true,
			resizable:		true,
			spacing_open:    3,
			spacing_closed: 3,
			onresize :function(){
				$(".barDivContainer").width($(".setViewPanelRow").width() - ($(".setLabelDivConatiner").width() + 30))
			}
		},
		west:{
			applyDefaultStyles: true,
			size:	200,
			closable:		true,
			resizable:		false,
			spacing_open:    3,
			spacing_closed: 3,
		}
}

$(document).ready(function(){
	myLayout = $(".lower-band").layout(layoutOptions);
	
	myLayout.panes.west.css({ padding: '0px',
	    						border: '0px',
							});
	
	myLayout.panes.east.css({ padding: '0px',
								overflow: 'hidden',
							});
	
    $('[data-toggle="tooltip"]').tooltip();
    
    $(window).resize(function(){
        $(".main-svg").attr("width",($(".lower-band").width()));
        $(".main-svg").attr("height",($(".lower-band").height()));
    });
    
    $(".lower-band").hide();
    
    $("#btnSave2").click(function() {
    	
    	html2canvas(document.querySelector(".container")).then(canvas => {
    		
    		saveAs(canvas.toDataURL(), 'canvas.png');
    	    //document.body.appendChild(canvas)
    	});
    	
       /* html2canvas($("#container").get(0), {
          onrendered: function(canvas) {
            saveAs(canvas.toDataURL(), 'canvas.png');
          }
        });*/
      });
    
    function saveAs(uri, filename) {
    	console.log("uri --> ");
    	console.log(uri);
    	
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
          link.href = uri;
          link.download = filename;

          //Firefox requires the link to be in the body
          document.body.appendChild(link);

          //simulate click
          link.click();

          //remove the link when done
          document.body.removeChild(link);
        } else {
          window.open(uri);
        }
      }
});

$( "#load").click(function() {
	
	usedSets.length=0;
	sets.length=0;
	isFirstLoad = true;
	$("#svgDiv").empty();
	$("#svgDiv").remove();
	$("#chart").append("<div id=\"svgDiv\"></div>");
    var fileLink =  $( "#fileLink" ).val();
    initData(fileLink);
    $(".lower-band").show();
});

function reRenderVis(){
	$("#svgDiv").empty();
	$("#svgDiv").remove();
	$("#chart").append("<div id=\"svgDiv\"></div>");
	subGroupsLinks = [];
	run();
}