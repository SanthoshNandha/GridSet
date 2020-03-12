function renderSetView(data){
	//data.sort(function(a, b){return b.items.length - a.items.length});
	
	d3.select(".set-counter").text(data.length);
	
	$("#setView").empty();
	$("#setView").remove();
	$(".set-list-section").append( "<div id=\"setView\" class=\"disable-select\"></div>" );
	
	var divHeight = parseInt(d3.select('#setView').style('height'), 10);
	var divWidth = parseInt(d3.select('#setView').style('width'), 10);
	var labelDivWidth = (divWidth/3);
	var sizeTextWidth = 20;
	var barDivWidth = (divWidth - (labelDivWidth + sizeTextWidth));
	
	var max = d3.max(data, function(d) { return d.items.length; });
	
	var scale  = d3.scaleLinear() 
	    .domain([0, max])
	    .range([0, 100]);
	 
	 function divScale(value){
		 return ((value/(max)) * 100);
	 }
	 
	 var filterDiv = d3.select("#setView")
	 					.append("div")
	 					.attr("class","setViweFilter");
	 
	 var setSearch = filterDiv
		.append("input")
		.attr("class","search pull-left")
		.attr("placeholder","Search");
	 
	 var sortButton1 = filterDiv
		.append("button")
		.attr("class","btn btn-default sort setNameSort pull-left")
		.attr("data-sort","setName")
		.append("i")
		.attr("class", "fa fa-sort-alpha-asc");
	 
	 var sortButton2 = filterDiv
		.append("button")
		.attr("class","btn btn-default sort setSizeSort pull-left")
		.attr("data-sort","setSize")
		.append("i")
	 	.attr("class", "fa fa-sort-amount-asc");
	 
	 /*var totalSet = filterDiv
	 		.append("div")
	 		.attr("class","totalSets-div pull-left")
	 		.text("Total : " + data.length);*/
	 
	 d3.select(".setNameSort").on("click",function(d){
		 if(d3.select(this).select("i").classed("fa-sort-alpha-asc")){
			 d3.select(this).select("i").classed("fa-sort-alpha-asc",false);
			 d3.select(this).select("i").classed("fa-sort-alpha-desc",true);
		 }
		 else if(d3.select(this).select("i").classed("fa-sort-alpha-desc")){
			 d3.select(this).select("i").classed("fa-sort-alpha-desc",false);
			 d3.select(this).select("i").classed("fa-sort-alpha-asc",true);
		 }
	 })
	 
	  d3.select(".setSizeSort").on("click",function(d){
		 if(d3.select(this).select("i").classed("fa-sort-amount-asc")){
			 d3.select(this).select("i").classed("fa-sort-amount-asc",false);
			 d3.select(this).select("i").classed("fa-sort-amount-desc",true);
		 }
		 else if(d3.select(this).select("i").classed("fa-sort-amount-desc")){
			 d3.select(this).select("i").classed("fa-sort-amount-desc",false);
			 d3.select(this).select("i").classed("fa-sort-amount-asc",true);
		 }
	 })
	 
	 var listDiv = d3.select("#setView")
						.append("div")
						.attr("class","setViweList");
	 
	 var divList = listDiv
						.append("ul")
						.attr("class","list");
	 
	 var setListLi = divList.selectAll("li")
			.data(data)
			.enter()
			.append("li")
			.attr("class",function(d,i){
				if(i%2 == 0){
					return "setViewLI setViewLIeven";
				}
				else{
					return "setViewLI setViewLIodd";
				}
			});
	 
	var setListDiv = setListLi
						.append('div')
						.attr("class",function(d,i){
							if(i%2 == 0){
								return "setViewRow setViewPanelRow evenPanel";
							}
							else{
								return "setViewRow setViewPanelRow oddPanel";
							}
						});
	 
	 var setListSize = setListLi
		.append("span")
		.attr("class","setSize hidden")
		.html(function(d){
			return d.setSize;
		});
	 
	 var setListName = setListLi
		.append("span")
		.attr("class","setName hidden")
		.html(function(d){
			return d.elementName;
		});
	 
	 var labelCol = d3.selectAll(".setViewPanelRow")
	 					.append("div")
	 					.attr("class","col-3 pull-left setLabelDivConatiner")
	 					.append("div")
	 					.attr("class",function(d,i){
	 						return "setLabelDiv setLabelDiv_" + d.elementName.replace(/[^A-Z0-9]/ig, "");
	 					})//setLabelDiv
	 					.text(function (d) { return d.elementName;});
	 
	 var sizeLabel = d3.selectAll(".setViewPanelRow")
	 					.append("div")
	 					.attr("class","pull-left setSizeLabelDiv")
	 					.text(function(d){
	 						return d.setSize;
	 					});
	 
	 var barCol = d3.selectAll(".setViewPanelRow")
					.append("div")
					.attr("class","pull-left barDivContainer")
					.append("div")
					.attr("class","barDiv")
					.append("div")
					.attr("class","histoBar")
					.style("width",function(d){
						return (Math.ceil(scale(d.items.length)))+"%";
						//return parseInt(scale(d.items.length), 10) +"%";
					});
	 
	 $( ".setLabelDiv" ).draggable({ opacity: 0.7, helper: "clone", 
		 	start  : function(event, ui){
		 				$(ui.helper).addClass("ui-helper-setLabelDiv");
		 			},
	 	helper: function (event,ui) {
	 		return $(this).clone().appendTo('body').css('zIndex',5).show();
	 	}
	 });	
		$( "#chart" ).droppable({
		      drop: function( event, ui ) { 
		    	  if($(ui.draggable).hasClass( "setLabelDiv" )){
		    		  var set = $(ui.draggable).prop("__data__").elementName;
						var flag = true;
				         for(var i=0; i < usedSets.length; i++){
							 if(usedSets[i].elementName == set){
								 flag = false;
							 }
						 }
						if(flag){
							for(var i=0; i < sets.length; i++){
								if(sets[i].elementName == set){
									
									var location={};
									var svgTransform = d3.zoomTransform(d3.select(".main-svg").node());
									//var newTransform = svgTransform.invert([ui.position.left,ui.position.top]);
									var newTransform;
									if(!myLayout.state.west.isClosed){
										newTransform = svgTransform.invert([(event.pageX - myLayout.state.west.outerWidth),(event.pageY - 20)]);
									}
									else{
										newTransform = svgTransform.invert([(event.pageX),(event.pageY - 20)]);
									}
									var translateX = newTransform[0];
									var translateY = newTransform[1];
									
									location["x"] = translateX;
									location["y"] = translateY;
									setLocationInfo[sets[i].elementName] = location;
									usedSets.push(sets[i]);
									break;
								}
							}
							reRenderVis(); 
						}
		    	  	}
		       	}
		    });
		
	 var options = {
			 valueNames: [ 'setSize','setName']
	 };

			var hackerList = new List('setView', options);
			isFirstLoad = false;
			
			$("#dataViewDiv").height((($("#setView").height())-18)+ "px");
			$("#selectedDataViewDiv").height((($("#setView").height())-18)+ "px");
			$("#listDataViewDiv").height((($("#setView").height())-18)+ "px");
}

function updateSetLabel(data){
	$(".setLabelDiv")
		.draggable({
			disabled: false,
		})
		.removeClass("usedSetLabelDiv");
		for(var i=0; i<data.length; i++){
			if(!data[i].isOpr){
				$(".setLabelDiv_"+data[i].SetName.replace(/[^A-Z0-9]/ig, ""))
				.draggable({
					disabled: true,
				})
				.addClass("usedSetLabelDiv");
			}
		}
}