/* 
	* Author: Santhosh Nandhakumar
	* eMail ID: nsanthosh2409@gmail.com
 */

// Options for configuring jQuery UI Layout Plug-in
var layoutOptions = {
		east:{
			applyDefaultStyles: true,
			size: 300,
			closable: true,
			resizable:	true,
			spacing_open:	3,
			spacing_closed:	3,
			onresize :function(){
				$(".barDivContainer").width($(".setViewPanelRow").width() - ($(".setLabelDivConatiner").width() + 30))
			}
		},
		west:{
			applyDefaultStyles:	true,
			size:	200,
			closable:	true,
			resizable:	false,
			spacing_open:	3,
			spacing_closed:	3,
		}
}

// Steps when the document gets loaded in the browser
$(document).ready(function(){

	// jQuery UI Layout getting initialized
	myLayout = $(".lower-band").layout(layoutOptions);
	myLayout.panes.west.css({ 	padding: '0px',
	    						border: '0px',
							});
	myLayout.panes.east.css({ 	padding: '0px',
								overflow: 'hidden',
							});
	
	// Initializing bootstrap tooltip							
    $('[data-toggle="tooltip"]').tooltip();
		
	// Resizing the main SVG container whenever the browser is resized
	$(window).resize(function(){
        $(".main-svg").attr("width",($(".lower-band").width()));
        $(".main-svg").attr("height",($(".lower-band").height()));
    });
    
	// Initially hide the lower part of the application
	$(".lower-band").hide();

});

// Function to add new SVG container
function reAddSVGContainer(){
	$("#svgDiv").empty();
	$("#svgDiv").remove();
	$("#chart").append("<div id=\"svgDiv\"></div>");
}

// Steps performed when dataset is loaded
$( "#load").click(function() {
	
	// Initialize the usedSets in dataStructure
	usedSets.length=0;
	sets.length=0;

	// Indicate that the dataloaded for the first time
	isFirstLoad = true;

	// Attach a new SVG container
	reAddSVGContainer();

	// Load the data from the JSON file
    var fileLink =  $( "#fileLink" ).val();
	initData(fileLink);
	
	// Show the lower part of the application once the data is loaded
	$(".lower-band").show();
	
});

// Steps performed when the set visualization is re-rendered each time
function reRenderVis(){
	reAddSVGContainer();
	subGroupsLinks = [];
	run();
}