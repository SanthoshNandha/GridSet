var trueColor = "#fb9d00";
var falseColor = "#000dff";

function addSetSpecificLegend(){	
	if(setSpecificAttributes.length == 1){
		if(setSpecificAttributes[0].type == "boolean"){
			d3.select("#setSpecificBoolean").html(setSpecificAttributes[0].name);
			
			var legendElementHeight = side;
			var legendElementWidth = (side * 2);
			
			var svgDiv = d3.select(".setSpecificBoolean-svg")
				.style("width",(legendElementWidth * 11) + "px")
				.style("height",(legendElementHeight * 4) + "px");
			
			var boolSetSpecificLegendSvg = svgDiv
				.append("svg")
				.attr("width", "100%")
				.attr("height","100%")
				.append("g")
				.attr("class","boolSetSpecificLegG")
				.attr("transform","translate(0,0)");
			
			var legendCells = boolSetSpecificLegendSvg
					.selectAll(".boolSetSpecificLegendElement")
					.data(["1","2"])
					.enter()
					.append("g")
					.attr("class", "boolSetSpecificLegendElement")
					.attr("transform",function(d,i){
						//console.log(i);
						var x = (i * legendElementWidth * 4);
						return "translate(" + x + ",0)";
					});
			
			var legendCell = legendCells
					.append("rect")
					.attr("x", function(d, i) {
					    return legendElementWidth * 3;
					})
					.attr("y", 5)
					.attr("class", "setSpecificCellLegend")
					.attr("width", legendElementWidth)
					.attr("height", legendElementHeight)
					.style("fill", function(d, i) {
						if(d == 1){
							return falseColor;
						}
					    return trueColor;
					})
					.style("stroke","black")
					.style("stroke-width","1px")
					.style("opacity","0.7");
			
			var legendText = legendCells
					.append("text")
					.attr("class", "setSpecificColorLegendText")
					.attr("x",(legendElementWidth * 5) - 3)
					.attr("y", (legendElementHeight + 3))
					.style("font-size","10px")
					.style("text-anchor","middle")
					.text(function(d){
						if(d == 1){
							return "False";
						}
					    return "True";
					});
		}
	}
}