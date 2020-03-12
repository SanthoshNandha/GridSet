function drawCategoryLegends(categoryAttribute){	
	var categories = categoryAttribute[0].categories;
	var optionCount=0;
	var categoryDiv = d3.selectAll(".elementShape-svg")
						.attr("attrName",categoryAttribute[0].name)
						.selectAll(".categoryDiv")
						.data(categories)
						.enter()
						.append("div")
						.attr("class",function(d){
							return "pull-left categoryDiv categoryDiv_"+d;
						})
						.attr("categoryName",function(d){
							return d;
						})
						
	var categorySvgDiv = categoryDiv.append("div")
							.attr("class",function(d){
								return "pull-left categorySvgDiv categorySvgDiv_"+d;
							})
							.append("svg")
							.attr("width", "20px")
						    .attr("height","20px")
						    .append("g")
						    .attr("class","shapeLegG")
						    .append("path")
						    .attr("d",function(d,i){
						    	var shape = d3.symbol()			
											.size((side * side))
											.type(function(){
												return elementSymbols[i][0];
											})
								return shape();
						    })
						    .attr("transform",function(d,i){
						    	return "translate(10,10) rotate(" + elementSymbols[i][1] + ")";
						    })
	
	var categorySelectSVG = categoryDiv.append("div")
								.attr("class",function(d){
									return "pull-left categorySelectSVG categorySelectSVG"+d;
								})
								.append("select")
								.attr("class","categorySelect")
								.attr("selectIndex",function(d,i){
									return i;
								})
								.on("mouseover",function(){
									shapeLegendPre = d3.select(this).property("value");
								})
								.on("change",function(d,i){
									var newOrder = [];
									var currentSelect = d;
									var newValue = $(this).val();
									d3.selectAll(".categorySelect")
									.each(function(d,i){
											if(d !== currentSelect){
												if($(this).val() == newValue){
													$(this).val(shapeLegendPre);
												}
											}
									 })
									
									d3.selectAll(".categorySelect")
										.each(function(){
											newOrder.push($(this).val());
										})
										
										var newSym = d3.symbol();
										var selectedSizeAttr = $("#shapeSize").val();
										
										 d3.selectAll(".element")
										 	.attr("d",function(element){
										 		   var categoryValue = element["MaxHostLev"];
									               var attrValue = element[selectedSizeAttr];
									               newSym.type(elementSymbols[newOrder.indexOf(categoryValue)][0])
									               return newSym();
										 	})
									})
								
	var categoryOptions = categorySelectSVG.selectAll("option")
								.data(categories)
								.enter()
								.append("option")
								.attr("value",function(d,i){
									return d;
								})
								.attr("selected",function(d,i,j){
									var parentIndex;
									if(i==(d3.select(this.parentNode).attr("selectIndex"))){
										return "true";
									}
								})
								.text(function(d,i){
									return d;
								});
}