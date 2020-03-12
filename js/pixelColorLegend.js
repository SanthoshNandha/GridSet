function addPixelColorLegend(){
	
	var legendElementHeight = side;
	var legendElementWidth = (side * 3);
	
	var svgDiv = d3.select(".elementColor-svg")
					.style("width",(legendElementWidth * 11) + "px")
					.style("height",(legendElementHeight * 4) + "px");
	
	var colorLegendSvg = svgDiv
							.append("svg")
							.attr("width", "100%")
							.attr("height","100%")
							.append("g")
							.attr("class","pixelColorLegG")
							.attr("transform","translate(30,5)");
	var legendCells = colorLegendSvg
						.selectAll(".colorLegendElement")
					   // .data([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9,1])
						.data([0.1,0.3,0.5,0.7,0.9,1])
					    .enter()
					    .append("g")
					    .attr("class", "colorLegendElement");
	
	var legendCell = legendCells
						.append("rect")
					    .attr("x", function(d, i) {
					        return legendElementWidth * i;
					    })
					    .attr("y", 5)
					    .attr("class", "cellLegend")
					    .attr("width", legendElementWidth)
					    .attr("height", legendElementHeight)
					    .style("fill", function(d, i) {
					        return d3.interpolateBlues(d);
					    })
					    .style("stroke","black")
					    .style("stroke-width","1px")
					    .style("opacity","0.7");
	
	var legendText = legendCells
						.append("text")
						.filter(function(d,i) {
							var last = (legendCells.size()) - 1;
							var middle = Math.ceil(last/2);
							if(i == 0 || i == middle || i == last){
								return true;
							}
						})
					    .attr("class", "colorLegendText")
					    .attr("x", function(d, i) {
					    	var last = (legendCells.size()) - 1;
							var middle = Math.ceil(last/2);
							if(i == 1){
								return legendElementWidth * middle;
							}
							else if(i == 2){
								return legendElementWidth * (last + 1);
							}
							else{
								return legendElementWidth * i;
							}
					    })
					    .attr("y", (15 + legendElementHeight))
					    .style("font-size","10px")
					    .style("text-anchor","middle");
    
	var selectedColorAttr = $('#shapeColor').val();
	
	if(selectedColorAttr == "None"){
		$(".elementColor-svg").hide();
	}
}

function renderAddPixelColorLegend(){
	var selectedColorAttr = $('#shapeColor').val();
	
	if(selectedColorAttr != "None"){
		var isCategortAttr = $('#shapeColor').find(":selected").attr("isCateg");
		var isDateAttr = $('#shapeColor').find(":selected").attr("isdate");
		if(isCategortAttr == "true"){
			$(".elementColor-svg").hide();
			$(".elementCategoryColor-svg").show();
			updateCategoryColorLegend(selectedColorAttr);
		}
		else if(isDateAttr == "true"){
			$(".elementCategoryColor-svg").hide();
			$(".elementColor-svg").show();
			pixelDateAttrColorScale.domain([dateAttrDomins[selectedColorAttr].min.toDate(), dateAttrDomins[selectedColorAttr].max.toDate()]);
			d3.selectAll(".colorLegendText")
			.text(function(d){
				return moment(pixelDateAttrColorScale.invert(d)).format("YYYY-MM-DD");
			});
		}
		else{
			$(".elementCategoryColor-svg").hide();
			$(".elementColor-svg").show();
			pixelAttrColorScale.domain([numericAttrDomins[selectedColorAttr].min,numericAttrDomins[selectedColorAttr].max]);
			d3.selectAll(".colorLegendText")
				.text(function(d){
					return Math.floor(pixelAttrColorScale.invert(d));
				});
		}
	}
	else{
		$(".elementColor-svg").hide();
		$(".elementCategoryColor-svg").hide();
	}
}

function addCategoryColorLegend(){
	var svgDiv = d3.select(".elementCategoryColor-svg");	
	var categoryColorLegendSvg = svgDiv
							.append("svg")
							.attr("class","categoryColorSVG")
							.append("g")
							.attr("class","categoryColorLegG")
							.attr("transform","translate(6,5)");
}

function updateCategoryColorLegend(category){	
	
	d3.selectAll(".categoryCegendCells").remove();
	
	var categories = [];
	
	for(var i=0; i <categoryAttribute.length; i++){
		if(categoryAttribute[i].name == category){
			categories = categoryAttribute[i].categories;
			break;
		}
	}
	
	var length = categories.length;
	var Max_col = 3;
	
	var legendWidth = (side * 33);
	var elementHeight = side + padding;
	var elementwidth = legendWidth/Max_col;
	
	var total_row = Math.ceil(length/Max_col);
	
	d3.select(".categoryColorSVG")
		.attr("height",(total_row * elementHeight) + elementHeight)
		.attr("width",legendWidth);
	
	var categoryCegendCells = d3.select(".categoryColorLegG")
								.selectAll(".categoryCegendCells")
							    .data(categories)
							    .enter()
							    .append("g")
							    .attr("class", "categoryCegendCells")
								.attr("width",legendWidth/3)
								.attr("height",elementHeight)
								.attr("transform",function(d,i){
									var xtransform = (Math.floor(i%Max_col));
									var ytransform = (Math.floor(i/Max_col));
									return "translate("+(((elementwidth)*xtransform))+","+(((elementHeight)*ytransform))+")";
								});
	
	var shapePath = categoryCegendCells
						.append("path")
						.attr("class","categoryLegendPath")
						.attr("transform",function(d,i){
							return "translate("+side+","+side+")";
						})
						.style("stroke",ELEMENT_STROKE_COLOR)
						.attr("fill",ELEMENT_DEFAULT_FILL)
						.attr("fill",function(d,i){
							return colores(i);
						});
	
	var categoryName = categoryCegendCells
							.append("text")
							.attr("class","categoryLegendText")
							.attr("transform",function(d,i){
								return "translate("+(side + (side))+","+(side + (side/4))+")";
							})
							.style("font-size","10px")
							.text(function(d,i){
								return d;
							});
						
	renderCategoryLegendShape();	
	categoryCegendCells.exit().remove();
}

function renderCategoryLegendShape(){
	var selectedShape = $("#shapeShape").val();
	var type;
	var legendsSym = d3.symbol();
	type = elementSymbols[selectedShape][0];
	legendsSym.type(type);
	
	d3.selectAll(".categoryLegendPath")
	.attr("d",function(){
		legendsSym.size((side) * (side));
		return legendsSym();
	})
	.attr('transform',function(d,i){
    	return "translate("+ side +","+ side +") rotate(" + elementSymbols[selectedShape][1]+ ")";
    });	
}

function addSubGroupColorLegend(){
	var legendElementHeight = side;
	var legendElementWidth = (side * 3);
	
	var svgDiv = d3.select(".subGroupColor-svg")
					.style("width",(legendElementWidth * 11) + "px")
					.style("height",(legendElementHeight * 4) + "px");
	
	var colorLegendSvg = svgDiv
							.append("svg")
							.attr("width", "100%")
							.attr("height","100%")
							.append("g")
							.attr("class","subGroupColorLegG")
							.attr("transform","translate(30,5)");
	
	var legendCells = colorLegendSvg
						.selectAll(".sbColorLegendElement")
					    .data([0.4, 0.5, 0.6, 0.8, 0.9,1])
					    .enter()
					    .append("g")
					    .attr("class", "sbColorLegendElement");
	
	var legendCell = legendCells
						.append("rect")
					    .attr("x", function(d, i) {
					        return legendElementWidth * i;
					    })
					    .attr("y", 5)
					    .attr("class", "sbCellLegend")
					    .attr("width", legendElementWidth)
					    .attr("height", legendElementHeight)
					    .style("fill", function(d, i) {
					    	return d3.interpolateYlOrBr(d);
					    })
					    .style("stroke","black")
					    .style("stroke-width","1px")
					    .style("opacity","0.5");
	
	var legendText = legendCells
						.append("text")
						.filter(function(d,i) {
								var last = (legendCells.size()) - 1;
								var middle = Math.ceil(last/2);
								if(i == 0 || i == middle || i == last){
									return true;
								}
							})
					    .attr("class", "sbColorLegendText")
					    .attr("x", function(d, i) {
					    	var last = (legendCells.size()) - 1;
							var middle = Math.ceil(last/2);
							if(i == 1){
								return legendElementWidth * middle;
							}
							else if(i == 2){
								return legendElementWidth * (last + 1);
							}
							else{
								return legendElementWidth * i;
							}
					        return legendElementWidth * i;
					    })
					    .attr("y", (15 + legendElementHeight))
					    .style("font-size","10px")
					    .style("text-anchor","middle");
	
	var selectedSubGroupAttr = $("#subColor").val();
	
	if(selectedSubGroupAttr == "None"){
		$(".subGroupColor-svg").hide();
	}
}

function renderSBColorLegend(){
	
	var selectedSubGroupAttr = $("#subColor").val();
	
	if(selectedSubGroupAttr != "None"){
			$(".subGroupColor-svg").show();
			subGroupAttrMeanColorScale.domain([numericAttrMeanDomains[selectedSubGroupAttr].min,numericAttrMeanDomains[selectedSubGroupAttr].max]);
			d3.selectAll(".sbColorLegendText")
			.text(function(d){
				return Math.floor(subGroupAttrMeanColorScale.invert(d));
			});
	}
	else{
		$(".subGroupColor-svg").hide();
	}
}

