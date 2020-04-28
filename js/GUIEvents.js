function initializeGUIEvents(){
	
	d3.select("#shapeShape").on("change",function(){
		// console.log("changed !!! ");
		renderShapeSize();
		renderSizeLegend();
		renderOrderPixel();
		renderCategoryLegendShape();
	});
	d3.select("#shapeSize").on("change",function(){
		renderShapeSize();
		renderSizeLegend();
	});

	d3.select("#shapeColor").on("change",function(){
		renderShapeColor();
		renderAddPixelColorLegend();
	});
	
	d3.select("#shapeOrder").on("change",function(){
		renderShapeOrder();
		renderOrderPixel();
	});
	
	d3.select("#subColor").on("change",function(){
		renderSubGroupColor();
		updateSubGroupLinks();
		updateSubGroupBorders();
		renderSBColorLegend();
	});
	
	d3.select("#shapePicture").on("change",function(){
		renderPicture();
	});
	
	d3.select("#shapeBar").on("change",function(){
		// console.log("changed !!! ");
		renderElementCharts();
	});
	
	d3.selectAll("input[name='optradio']").on("change", function() {
		// console.log("changed");
		GROUPED_BY = d3.selectAll("input[name='optradio']:checked").attr("value");
		
		if(GROUPED_BY == GROUP_BY_SET){
			d3.selectAll(".groupBoarder")
				.style("display","inline");
			
			d3.selectAll(".degreeGroupsBoarder")
				.style("display","none");
			
		   if(PIC_PIXEL){
				d3.selectAll(".element")
					.attr("x",function(d,i){
							return  (side + padding)*d.x;				
					})
					.attr("y",function(d,i){
						return  (side + padding)*d.y;
					})
			}
			else{
				d3.selectAll(".element")
				 .attr('transform',function(d,i){ return "translate("+(((side + padding)*d.x) + (side/2) )+","+(((side + padding)*d.y) + (side/2))+")"; });
			}
		   
		   d3.selectAll(".groupBoarder")
			.style("stroke",function(d,i){
					return "black";
			})
			.style("stroke-opacity",function(d,i){
					return "1";
			})
			.style("stroke-width",function(d,i){
					return "1px";
			})
			.style("fill",function(d,i){	
					return "white";
			});
			
			
		}
		
		if(GROUPED_BY == GROUP_BY_DEGREE){				
			d3.selectAll(".groupBoarder")
				.style("display","none");
		
			d3.selectAll(".degreeGroupsBoarder")
				.style("display","inline");	
			
			if(PIC_PIXEL){
				d3.selectAll(".element")
				.attr("x",function(d,i){
						return  (side + padding)*d.degreeX;				
				})
				.attr("y",function(d,i){
					return  (side + padding)*d.degreeY;
				})
			}
			else{
				d3.selectAll(".element")
					.attr('transform',function(d,i){ return "translate("+(((side + padding)*d.degreeX) + (side/2) )+","+(((side + padding)*d.degreeY) + (side/2))+")"; })
			}				
		}	
		updateSubGroupLinks();
});


d3.select("#attrQuery").on("click",function(){
    d3.selectAll(".element")
    	.style("stroke",function(d){
    		var flag = true;
    		for (var key in attrSliders) {
    			if(d[key] >= (attrSliders[key].bootstrapSlider('getValue'))[0] && d[key] <= (attrSliders[key].bootstrapSlider('getValue'))[1]){
    				flag = true;
    			}
    			else{
    				flag= false;
    				break;
    			}
    		}
    		if(flag){
    			return "red";
    		}
    		else{
    			return "black";
    		}
    })
})

d3.select("#attributeQueryClear").on("click",function(d){
	 d3.selectAll(".element")
    	.style("stroke",function(d){
    			return "black";
    	})
})



d3.selectAll(".setQueryRadio").on("change",function(){
	
	// console.log("clicked !!");
	
	/*activeSubGroupNames=[];
	activeSubGroups = [];
	
	var degreeRange = degreeSlider.bootstrapSlider('getValue');
	var setVals =  [];
	var minValue;
	var maxValue;
	
	d3.selectAll(".setQueryRadio")
	.each(function(d){
		if(d3.select(this).node().checked){
			setVals[d3.select(this).attr("name")] = d3.select(this).attr("value");
		}
	})
	
	if(degreeRange != null && degreeRange != undefined && degreeRange.length == 2){
		minValue = degreeRange[0];
		maxValue = degreeRange[1];
	}	
		d3.selectAll(".groupBoarder")
		.each(function(d,i){
			var flag = true;
			var degree = d.nrCombinedSets;
			var combinedSets = d.combinedSets;
			
			if(degree >= minValue && degree <= maxValue ){
				for(var i=0; i <combinedSets.length; i++){
					if(parseInt(setVals[i]) == 0 || parseInt(setVals[i]) == 1){
						if(combinedSets[i] != parseInt(setVals[i])){
							flag = false;
							break;
						}
					}	
				}
				if(flag){
					var nameIndex = activeSubGroupNames.indexOf(d.elementName);
					if(nameIndex < 0){
						activeSubGroupNames.push(d.elementName);
						activeSubGroups.push(d.id);
					}
				}
			}
		});
	
	d3.selectAll(".groupBoarder")
	.style("stroke",function(d,i){
			return "black";
	})
	.style("stroke-opacity",function(d,i){
			return "1";
	})
	.style("stroke-width",function(d,i){
			return "1px";
	})
	.style("fill",function(d,i){	
			return "white";
	});
	
	updateSubGroupLinks();*/	
});

d3.select("#setQueryClear").on("click",function(){
	activeSubGroups.length = 0;
	updateSubGroupBorders();
	updateSubGroupLinks();	
	
	$(".setQueryRadio").each(function(i,e){
		if(($(this).val()) == 2){
			$(this).prop("checked", true);
		}
		else{
			$(this).prop("checked", false);
		}
	})
});


d3.select("#degreeQuery").on("click",function(){
	var degreeRange = degreeSlider.bootstrapSlider('getValue');
	
	if(degreeRange != null && degreeRange != undefined && degreeRange.length == 2){
		var minValue = degreeRange[0];
		var maxValue = degreeRange[1];
		
		d3.selectAll(".groupBoarder")
		.each(function(d,i){
			var degree = d.nrCombinedSets;
			if(degree >= minValue && degree <= maxValue ){
				var nameIndex = activeSubGroupNames.indexOf(d.elementName);
				if(nameIndex < 0){
					activeSubGroupNames.push(d.elementName);
					activeSubGroups.push(d.id);
				}
			}
		});
			
		d3.selectAll(".groupBoarder")
			.style("stroke",function(d,i){
					return "black";
			})
			.style("stroke-opacity",function(d,i){
					return "1";
			})
			.style("stroke-width",function(d,i){
					return "1px";
			})
			.style("fill",function(d,i){	
					return "white";
			});
		updateSubGroupLinks();
	}
})

d3.selectAll("#showSimilarity").on("change", function() {		
	  var display = this.checked ? "inline" : "none";
	  d3.selectAll(".similarityLink")
	    .attr("display", function(){
	    	return display;
	    });
});

}

function querySubGroupsBySets(){

	activeSubGroups = [];
	var setVals = [];
	
	var minDegree = degreeSlider.result.from;
	var maxDegree = degreeSlider.result.to;
	
	d3.selectAll(".setQueryRadio")
	.each(function(d){
		if(d3.select(this).node().checked){
			setVals[d3.select(this).attr("name")] = d3.select(this).attr("value");
		}
	})
	
	d3.selectAll(".subGroupBoarder")
		.each(function(d,i){
			var flag = true;
			var degree = d.nrCombinedSets;
			var combinedSets = d.combinedSets;
			
			if(degree >= minDegree && degree <= maxDegree ){
				for(var i=0; i <combinedSets.length; i++){
					if(parseInt(setVals[i]) == 0 || parseInt(setVals[i]) == 1){
						if(combinedSets[i] != parseInt(setVals[i])){
							flag = false;
							break;
						}
					}	
				}
				if(flag){
					var nameIndex = activeSubGroups.indexOf(d.elementName);
					if(nameIndex < 0){
						activeSubGroups.push(d.elementName);
					}
				}
			}
		});
	
	updateSubGroupBorders();
	updateSubGroupLinks();	
	
}

function querySubGroupsByDegree(data){
	
	var from = data.from;
	var to = data.to;
	
	d3.selectAll(".subGroupBoarder")
		.each(function(d){
			if(d.nrCombinedSets >= from && d.nrCombinedSets <= to){
				var nameIndex = activeSubGroups.indexOf(d.elementName);
				if(nameIndex == -1){
					activeSubGroups.push(d.elementName)
				}
			}
			else{
				var nameIndex = activeSubGroups.indexOf(d.elementName);
				
				if(nameIndex > -1){
					activeSubGroups.splice(nameIndex, 1);
				}
			}
		});
	
	updateSubGroupBorders();
	updateSubGroupLinks();
}

function queryElementByAttribute(){
	
	filteredElements = [];
	var selectedColorAttr = $('#shapeColor').val();
	var selectedCategoryAttr = {};
	
	var searchAttrValues = {};
	for(var l=0; l < searchAttribute.length; l++){
		//searchAttrValues[searchAttribute[l].name] = $('#searchAttr_'+searchAttribute[l].name).multipleSelect("getSelects", "text");
		searchAttrValues[searchAttribute[l].name] = $('#searchAttr_'+searchAttribute[l].name).val();
	}
	
	d3.selectAll(".card-block")
		.each(function(d){
			var attrName = d.name;
			var attrCategories = d.categories;
			selectedCategoryAttr[attrName] = [];
			for(var c=0; c < attrCategories.length; c++){
				if($("#categoryOption_"+attrCategories[c].replace(/\s/g, '')).prop('checked')){
					selectedCategoryAttr[attrName].push($("#categoryOption_"+attrCategories[c].replace(/\s/g, '')).val());
				}	
			}
		})
		
	d3.selectAll(".element")
	.style("opacity",function(d){
		var flag = true;
		if(Object.keys(attrSliders).length > 0 ){
			//flag = false;			
			for (var key in attrSliders) {
				if(d[key] >= attrSliders[key].data("from") && d[key] <= attrSliders[key].data("to")){
					for(var catKey in selectedCategoryAttr){
						if(selectedCategoryAttr[catKey].indexOf(d[catKey]) != -1){
							flag = true;
						}
						else{
							flag = false;
							break;
						}
					}
				}
				else{
					flag= false;
					break;
				}
			}
		}
		
		if(flag){
			if(Object.keys(dateAttrSliders).length > 0 ){
				//flag = false;
				for(var key in dateAttrSliders){
					var fromDate = dateAttrSliders[key].data("from");
					var toDate = dateAttrSliders[key].data("to");
					if(d["moment_"+key].isSameOrAfter(moment(fromDate)) && d["moment_"+key].isSameOrBefore(moment(toDate))){
						flag = true;
					}
					else{
						flag=false;
						break;
					}
				}
			}			
		}
		if(flag){
			if(Object.keys(searchAttrValues).length > 0 ){
				//flag = false;
				if(searchAttrValues.length > 0){
					for(var key in searchAttrValues){
						if(searchAttrValues[key].length > 0){
							if(searchAttrValues[key].split(", ").indexOf(d[key]) != -1){
								flag = true;
							}
							else{
								flag=false;
								break;
							}
						}
					}
				}
			}
		}
		
		if(flag){
			d["isActive"] = true;
			filteredElements.push(d.item);
//			console.log("active");
			return ACTIVE_ELEMENT_OPACITY;
		}
		else{
			d["isActive"] = false;
			//console.log("In-active");
			return InACTIVE_ELEMENT_OPACITY;
		}
	})
	.style("stroke-width",function(d){
		if(selectedColorAttr != "None" && d.isActive){
			return COLOR_ACTIVE_ELEMENT_STROKE_WIDTH;
		}
		else{
			//return ELEMENT_STROKE_WIDTH;
			return 0.15;
		}
	})
	.style("stroke-opacity",function(d){
		if(selectedColorAttr == "None" && d.isActive){
			return ACTIVE_ELEMENT_STROKE_OPACITY;
		}
		else if(selectedColorAttr != "None" && d.isActive){
			return COLOR_ACTIVE_ELEMENT_STROKE_OPACITY;
		}
		else{
			//return InACTIVE_ELEMENT_STROKE_OPACITY;
			return 0.05;
		}
	})
	.style("fill", function(d){
		// console.log("in fill")
		// console.log(d);
		if(!d.isActive)
			return "gray";
	})
	
	selectedTableData.refresh();
	tableData.refresh();
}

d3.select("#createAttrSet").on("click",function(){
	var attributeLabel = "";
	
	for (var key in attrSliders) {
		var max = numericAttrDomins[key].min;
		var min = numericAttrDomins[key].max;
		var attrName = key;
		var minValue = attrSliders[key].data("from");
		var maxValue = attrSliders[key].data("to");
		
		if(minValue == min && maxValue == max){
			attributeLabel = attributeLabel + "";
		}
		else if(minValue == min && maxValue != max){
			if(attributeLabel == ""){
				attributeLabel = attributeLabel + attrName + " :max=" + maxValue;
			}
			else{
				attributeLabel = attributeLabel + " And " + attrName + " :max=" + maxValue;
			}
			
		}
		else if(minValue != min && maxValue == max){
			if(attributeLabel == ""){
				attributeLabel = attributeLabel + attrName + " :min=" + minValue;
			}
			else{
				attributeLabel = attributeLabel + " And " + attrName + " :min=" + minValue;
			}
			
		}
		else {
			if(attributeLabel == ""){
				attributeLabel = attributeLabel + attrName + " :" + minValue + " to " + maxValue;
			}
			else{
				attributeLabel = attributeLabel + " And " + attrName + " :" + minValue + " to " + maxValue;
			}
		}
	}
	
	var items =  d3.set(filteredElements.map(function( item ) { return item; } )).values();
	 
	 if(attributeLabel == ""){
		 attributeLabel = "ALL";
	 }
	 
	 if(items.length > 0){
		 createAttributeSet(items,attributeLabel);
	 }
})
d3.select("#clearAttrSet").on("click",function(){
	for(var l=0; l < searchAttribute.length; l++){
		$( '#searchAttr_'+searchAttribute[l].name).val("");
	}
	for(var attrName in numericAttrDomins){
		attrSliders[attrName].data("ionRangeSlider").update({
			min:numericAttrDomins[attrName].min,
			max:numericAttrDomins[attrName].max,
			from:numericAttrDomins[attrName].min,
			to:numericAttrDomins[attrName].max,
		});
		numericAttrDomins[attrName]["isFromChanged"] = false;
		numericAttrDomins[attrName]["isToChanged"] = false;
	}
	for(var dateAttr in dateAttrDomins){
		dateAttrSliders[dateAttr].data("ionRangeSlider").update({
			min:+dateAttrDomins[dateAttr].min,
			max:+dateAttrDomins[dateAttr].max,
			from:+dateAttrDomins[dateAttr].min,
			to:+dateAttrDomins[dateAttr].max,
			prettify: function (num) {
		        return moment(num).format("YYYY-MM-DD");
		    }
		});
		dateAttrDomins[dateAttr]["isFromChanged"] = false;
		dateAttrDomins[dateAttr]["isToChanged"] = false;
	}
	
	$(".categoryCheck").prop("indeterminate", false);
	$(".categoryCheck").prop('checked', true);
	$(".optionCheck").prop('checked', true);
	
	queryElementByAttribute();
});
