function addSizeLegend(){
	var legendMultiplier = 3;
	SizeLegendcenterPoint = (side * legendMultiplier)/2;
	
	var svgDiv = d3.select(".elementSize-svg")
					.style("width",(side * (legendMultiplier + 2)) + "px")
					.style("height",(side * legendMultiplier) + "px");

	var sizeLegendSVG = svgDiv
						.append("svg")
						.attr("width", (side * (legendMultiplier + 5)) + "px")
						.attr("height",(side * legendMultiplier) + "px")
						.append("g")
						.attr("class","sizeLegG")
						.attr("transform","translate(5,6)");
	

	var sizeLegendUpperLine = sizeLegendSVG.append("line")
									.attr("x1",function(){
										return (SizeLegendcenterPoint/2);
									})
									.attr("y1",function(){
										return (SizeLegendcenterPoint/2) - (((side+(side/2)))/2);
									})
									.attr("x2",function(){
										return SizeLegendcenterPoint + 10;
									})
									.attr("y2",function(){
										return (SizeLegendcenterPoint/2) - (((side+(side/2)))/2);
									})
									.style("stroke","black")
									.style("stroke-width","0.5px")
									.style("stroke-dasharray","1 2");
	
	
	var sizeLegendlowerLine = sizeLegendSVG.append("line")
									.attr("x1",function(){
										return (SizeLegendcenterPoint/2);
									})
									.attr("y1",function(){
										return (SizeLegendcenterPoint/2) - (((side-(side/2)))/2);
									})
									.attr("x2",function(){
										return SizeLegendcenterPoint + 10;
									})
									.attr("y2",function(){
										return (SizeLegendcenterPoint/2) - (((side-(side/2)))/2);
									})
									.style("stroke","black")
									.style("stroke-width","0.5px")
									.style("stroke-dasharray","1 2");
	
	var upperText = sizeLegendSVG.append("text")
						.attr("class","SizeLegendText upperSizeText")
						.attr("id","upperSizeText")
						.attr("dx",function(){
							return SizeLegendcenterPoint + 15;
						})
						.attr("dy",function(){
							return (SizeLegendcenterPoint/2) - (((side+(side/2)))/2);
						})
						.attr("text-anchor","left")
						.attr("font-size","8px")
						.text("0");
	
	var lowerText = sizeLegendSVG.append("text")
						.attr("class","SizeLegendText lowerSizeText")
						.attr("id","lowerSizeText")
						.attr("dx",function(){
							return SizeLegendcenterPoint + 15;
						})
						.attr("dy",function(){
							return (SizeLegendcenterPoint/2) - (((side-(side/2)))/2) + 3;
						})
						.attr("text-anchor","left")
						.attr("font-size","8px")
						.text("0");
	
	var upperPixel = sizeLegendSVG
						.append("path")
						.attr("class","upperSizeLeg")
						.attr("id","upperSizeLeg")
						.style("stroke",ELEMENT_STROKE_COLOR)
						.style("stroke-width",ELEMENT_STROKE_WIDTH)
						.style("fill","none");
	
	var lowerPixel = sizeLegendSVG
						.append("path")
						.attr("class","lowerSizeLeg")
						.attr("id","lowerSizeLeg")
						.style("stroke",ELEMENT_STROKE_COLOR)
						.style("stroke-width",ELEMENT_STROKE_WIDTH)
						.style("fill","none");
	
}

function renderSizeLegend(){
	
	var selectedShape = $("#shapeShape").val();
	var selectedSizeAttr = $('#shapeSize').val();
	var isDateAttr = $('#shapeSize').find(":selected").attr("isdate");
	var type;
	
	var legendsSym = d3.symbol();
	type = elementSymbols[selectedShape][0];
	legendsSym.type(type);
	
	if(selectedSizeAttr != "None"){
		$(".elementSize-svg").show();
	
	d3.select("#upperSizeLeg")
			.attr("d",function(){
				legendsSym.size((side+(side/2)) * (side+(side/2)));
				return legendsSym();
			})
			.attr('transform',function(d,i){
		    	return "translate("+ (SizeLegendcenterPoint/2) +","+ (SizeLegendcenterPoint/2) +") rotate(" + elementSymbols[selectedShape][1]+ ")";
		    });	
	
	d3.select("#lowerSizeLeg")
		.attr("d",function(){
			legendsSym.size((side-(side/2)) * (side-(side/2)));
			return legendsSym();
		})
		.attr('transform',function(d,i){
	    	return "translate("+ (SizeLegendcenterPoint/2) +","+ (SizeLegendcenterPoint/2) +") rotate(" + elementSymbols[selectedShape][1]+ ")";
	    });	
	
	d3.select("#upperSizeText")
			.text(function(){
				if(selectedSizeAttr != "None"){
					if(isDateAttr == "true"){
						return dateAttrDomins[selectedSizeAttr].max.format("YYYY-MM-DD");
					}
					else{
						return numericAttrDomins[selectedSizeAttr].max;
					}
					
				}
				else{
					return "NA";
				}
			});
	
	d3.select("#lowerSizeText")
			.text(function(){
				if(selectedSizeAttr != "None"){
					if(isDateAttr == "true"){
						return dateAttrDomins[selectedSizeAttr].min.format("YYYY-MM-DD");
					}
					else{
						return numericAttrDomins[selectedSizeAttr].min;
					}
				}
				else{
					return "NA";
				}
			});
	}
	
	else{
		$(".elementSize-svg").hide();
	}
}

function addOrderLegend(){
	
	var divSide = ((side + padding) * 2) + padding;
	
	var svgDiv = d3.select(".elementOrder-svg")
					.style("width",divSide+ "px")
					.style("height",divSide + "px");
					
	var orderLegendSVG = svgDiv
						.append("svg")
						.attr("width", divSide + "px")
						.attr("height",divSide + "px")
						.append("g")
						.attr("class","orderLegG")
						.attr("transform","translate(0,0)");
	
	var orderPixel = orderLegendSVG
						.selectAll(".orderPixel")
						.data(pixelOrderData)
						.enter()
						.append("path")
						.attr("class","orderPixel")
						.style("stroke",ELEMENT_STROKE_COLOR)
						.style("stroke-width",ELEMENT_STROKE_WIDTH)
						.attr("fill",ELEMENT_DEFAULT_FILL);
}

function renderOrderPixel(){
	
	var selectedOrderAttr = $('#shapeOrder').val();
	
	if(selectedOrderAttr != "None"){
		$(".elementOrder-svg").show();
	
	var orderScale =  d3.scaleLinear()
						.range([(side-(side/2)), side])
						.domain([d3.min(pixelOrderData), d3.max(pixelOrderData) ]);
	
	var noCol = Math.ceil(Math.sqrt(pixelOrderData.length));
	var padding = 2;
	
	var selectedShape = $("#shapeShape").val();
	var type;
	var legendsSym = d3.symbol();
	
	type = elementSymbols[selectedShape][0];
	legendsSym.type(type);
	
	d3.selectAll(".orderPixel")
	.attr("d",function(d,i){
		var sideSize = orderScale(d);
		legendsSym.size(sideSize * sideSize);
		return legendsSym();
	})
	.attr('transform',function(d,i){
		var xtransform = (Math.floor(i%noCol));
		var ytransform = (Math.floor(i/noCol));
		return "translate("+(((side + padding)*xtransform) + (side/2) )+","+(((side + padding)*ytransform) + (side/2))+") rotate(" + elementSymbols[selectedShape][1]+ ")";
    });
	}
	else{
		$(".elementOrder-svg").hide();
	}
}