function renderNumericFilter(numericAttributes,categoryAttribute,dateAttributes){
	
	$('#shapeSize')
    .append($("<option></option>")
            .attr("value","None")
            .text("None")); 
	
    $('#shapeColor')
    .append($("<option></option>")
            .attr("value","None")
            .text("None")); 
    
    $('#shapeOrder')
    .append($("<option></option>")
            .attr("value","None")
            .text("None")); 
    
    $('#subColor')
    .append($("<option></option>")
            .attr("value","None")
            .text("None")); 
    
    $('#shapeBar')
    .append($("<option></option>")
            .attr("value","None")
            .text("None")); http://localhost:8888
    
    /*$('#subColor')
    .append($("<option></option>")
            .attr("value","Deviation")
            .text("Deviation")); */
    
    if(categoryAttribute.length > 0){
    	for(var c=0; c < categoryAttribute.length; c++){
    		$('#shapeColor')
    	    .append($("<option></option>")
    	            .attr("value",categoryAttribute[c].name)
    	            .attr("isCateg",true)
    	            .text(categoryAttribute[c].name));
    		
    		$('#shapeOrder')
    	    .append($("<option></option>")
    	            .attr("value",categoryAttribute[c].name)
    	            .attr("isCateg",true)
    	            .text(categoryAttribute[c].name));
    	}
    }
    
    var dateAttrDiv = d3.select("#attributeQueryView")
						.selectAll(".dateAttrDiv")
						.data(dateAttributes)
						.enter()
						.append("div")
						.attr("class",function(d,i){
							return "dateAttrDiv dateAttrDiv_" + d.name;
						})
		
	var dateAttrNameDiv = dateAttrDiv
							.append("div")
							.attr("class", function(d,i){
								return "mini-header-tab attrNameDiv attrNameDiv_"+ d.name;
							})
							.html(function(d,i){
								return "by " + d.name;
							})
							
	var dateSliderdiv = dateAttrDiv
							.append("div")
							.attr("class", function(d,i){
								return "sliderDiv sliderDiv"+ d.name;
							});
	
	var dateSliderInput = dateSliderdiv
							.append("input")
							.attr("isDate",true)
							.attr("type","text")
							.attr("class",function(d,i){
								return "dateSlide dateSlide_" + d.name; 
							})
							.attr("id",function(d,i){
								return "dateSlide_" + d.name; 
							});
	
	dateSliderInput					
	.each(function(d,i){
		$('#shapeSize')
        .append($("<option></option>")
                   .attr("value",d.name)
                   .attr("isDate",true)
                   .text(d.name));

		$('#shapeColor')
        .append($("<option></option>")
                   .attr("value",d.name)
                   .attr("isDate",true)
                   .text(d.name));
       
       $('#shapeOrder')
        .append($("<option></option>")
                   .attr("value",d.name)
                   .attr("isDate",true)
                   .text(d.name));
       
		dateAttrDomins[d.name] = {
				"min":0,
				"max":0
			};
		
		dateAttrMeanDomains[d.name] = {
				"min":null,
				"max":null
			};

		dateAttrSliders[d.name] = $("#dateSlide_" + d.name).ionRangeSlider({
		    type: "double",
		    name:d.name,
		    grid:false,
		    min: 0,
		    max: 0,
		    from: 0,
		    to: 0,
		    force_edges: true,
		    onChange : function (data) {
		    	//console.log(data);
		    	updateDateAttr(d.name,data);
		        queryElementByAttribute();
		    },
		});
	});
	
	
	var numericAttrDiv = d3.select("#attributeQueryView")
							.selectAll(".numericAttrDiv")
							.data(numericAttributes)
							.enter()
							.append("div")
							.attr("class",function(d,i){
								return "numericAttrDiv numericAttrDiv_" + d.name;
							})
							
	var attrNameDiv = numericAttrDiv
						.append("div")
						.attr("class", function(d,i){
							return "mini-header-tab attrNameDiv attrNameDiv_"+ d.name;
						})
						.html(function(d,i){
							return "By " + d.name;
						})
	var sliderdiv = numericAttrDiv
						.append("div")
						.attr("class", function(d,i){
							return "sliderDiv sliderDiv"+ d.name;
						})
						
	var sliderInput = sliderdiv
						.append("input")
						.attr("type","text")
						.attr("class",function(d,i){
							return "attrSlide attrSlide_" + d.name; 
						})
						.attr("id",function(d,i){
							return "attrSlide_" + d.name; 
						})
	
	
						
	sliderInput
	.each(function(d,i){
		$('#shapeSize')
        .append($("<option></option>")
                   .attr("value",d.name)
                   .text(d.name));

		$('#shapeColor')
        .append($("<option></option>")
                   .attr("value",d.name)
                   .attr("isCateg",false)
                   .text(d.name));
       
       $('#shapeOrder')
        .append($("<option></option>")
                   .attr("value",d.name)
                   .text(d.name));
       
       $('#subColor')
	    .append($("<option></option>")
	    		 .attr("value",d.name)
                 .text("Mean of " + d.name));
       
       $('#shapeBar')
       .append($("<option></option>")
                  .attr("value",d.name)
                  .text(d.name));
       
		
		/*numericAttrScales[d.name] = d3.scaleLinear()
										.range([(side/2),(side)]);*/
		
		numericAttrDomins[d.name] = {
										"min":0,
										"max":0
									};
		numericAttrMeanDomains[d.name] = {
										"min":null,
										"max":null
									};
		
		attrSliders[d.name] = $("#attrSlide_" + d.name).ionRangeSlider({
								    type: "double",
								    name:d.name,
								    grid:false,
								    min: 0,
								    max: 0,
								    from: 0,
								    to: 0,
								    from_percent:0,
								    to_percent:100,
								    force_edges: true,
								    onChange : function (data) {
								        updateNumericAttrs(d.name,data);
								        queryElementByAttribute();
								    },
								});
	})
}

function updateNumericAttrs(name,data){
	
	if(data.min != data.from){
		numericAttrDomins[name]["isFromChanged"] = true;
		numericAttrDomins[name]["changedFrom"] = data.from;
	}
	else{
		numericAttrDomins[name]["isFromChanged"] = false;
	}
	if(data.max != data.to){
		numericAttrDomins[name]["isToChanged"] = true;
		numericAttrDomins[name]["changedTo"] = data.to;
	}
	else{
		numericAttrDomins[name]["isToChanged"] = false;
	}
}

function updateDateAttr(name,data){
	if(data.min != data.from){
		dateAttrDomins[name]["isFromChanged"] = true;
		dateAttrDomins[name]["changedFrom"] = data.from;
	}
	else{
		dateAttrDomins[name]["isFromChanged"] = false;
	}
	if(data.max != data.to){
		dateAttrDomins[name]["isToChanged"] = true;
		dateAttrDomins[name]["changedTo"] = data.to;
	}
	else{
		dateAttrDomins[name]["isToChanged"] = false;
	}
}

function updateNumericFilter(numericAttrDomins){
	
	for(var attrName in numericAttrDomins){
		if(!(numericAttrDomins[attrName].isFromChanged) && !(numericAttrDomins[attrName].isToChanged)){
			attrSliders[attrName].data("ionRangeSlider").update({
				min:numericAttrDomins[attrName].min,
				max:numericAttrDomins[attrName].max,
				from:numericAttrDomins[attrName].min,
				to:numericAttrDomins[attrName].max,
				to_percent:100
			});
		}
		else{
			if((numericAttrDomins[attrName].isFromChanged) && !(numericAttrDomins[attrName].isToChanged)){
				attrSliders[attrName].data("ionRangeSlider").update({
					min:numericAttrDomins[attrName].min,
					max:numericAttrDomins[attrName].max,
					from:(numericAttrDomins[attrName].changedFrom) >= (numericAttrDomins[attrName].min)? (numericAttrDomins[attrName].changedFrom) : (numericAttrDomins[attrName].min),
					to:numericAttrDomins[attrName].max,
				});
			}
			else if(!(numericAttrDomins[attrName].isFromChanged) && (numericAttrDomins[attrName].isToChanged)){
				attrSliders[attrName].data("ionRangeSlider").update({
					min:numericAttrDomins[attrName].min,
					max:numericAttrDomins[attrName].max,
					from:numericAttrDomins[attrName].min,
					to:(numericAttrDomins[attrName].changedTo) <= (numericAttrDomins[attrName].max)? (numericAttrDomins[attrName].changedTo) : (numericAttrDomins[attrName].max),
				});
			}
			else if((numericAttrDomins[attrName].isFromChanged) && (numericAttrDomins[attrName].isToChanged)){
				attrSliders[attrName].data("ionRangeSlider").update({
					min:numericAttrDomins[attrName].min,
					max:numericAttrDomins[attrName].max,
					from:(numericAttrDomins[attrName].changedFrom) >= (numericAttrDomins[attrName].min)? (numericAttrDomins[attrName].changedFrom) : (numericAttrDomins[attrName].min),
					to:(numericAttrDomins[attrName].changedTo) <= (numericAttrDomins[attrName].max)? (numericAttrDomins[attrName].changedTo) : (numericAttrDomins[attrName].max),
				});
			}
		}
	}
}

function updateDateFilter(dateAttrDomins){
	for(var dateAttr in dateAttrDomins){
		if(!(dateAttrDomins[dateAttr].isFromChanged) && !(dateAttrDomins[dateAttr].isToChanged)){
			dateAttrSliders[dateAttr].data("ionRangeSlider").update({
				min:+dateAttrDomins[dateAttr].min,
				max:+dateAttrDomins[dateAttr].max,
				from:+dateAttrDomins[dateAttr].min,
				to:+dateAttrDomins[dateAttr].max,
				prettify: function (num) {
			        return moment(num).format("YYYY-MM-DD");
			    }
			});
		}
		else{
			if((dateAttrDomins[dateAttr].isFromChanged) && !(dateAttrDomins[dateAttr].isToChanged)){
				dateAttrSliders[dateAttr].data("ionRangeSlider").update({
					min:+dateAttrDomins[dateAttr].min,
					max:+dateAttrDomins[dateAttr].max,
					from:+(dateAttrDomins[dateAttr].changedFrom) >= +(dateAttrDomins[dateAttr].min)? +(dateAttrDomins[dateAttr].changedFrom) : +(dateAttrDomins[dateAttr].min),
					to:+dateAttrDomins[dateAttr].max,
					prettify: function (num) {
				        return moment(num).format("YYYY-MM-DD");
				    }
				});
			}
			else if(!(dateAttrDomins[dateAttr].isFromChanged) && (dateAttrDomins[dateAttr].isToChanged)){
				dateAttrSliders[dateAttr].data("ionRangeSlider").update({
					min:+dateAttrDomins[dateAttr].min,
					max:+dateAttrDomins[dateAttr].max,
					from:+dateAttrDomins[dateAttr].min,
					to:+(dateAttrDomins[dateAttr].changedTo) <= +(dateAttrDomins[dateAttr].max)? +(dateAttrDomins[dateAttr].changedTo) : +(dateAttrDomins[dateAttr].max),
					prettify: function (num) {
				        return moment(num).format("YYYY-MM-DD");
				    }		
				});
			}
			else if((dateAttrDomins[dateAttr].isFromChanged) && (dateAttrDomins[dateAttr].isToChanged)){
				dateAttrSliders[dateAttr].data("ionRangeSlider").update({
					min:+dateAttrDomins[dateAttr].min,
					max:+dateAttrDomins[dateAttr].max,
					from:+(dateAttrDomins[dateAttr].changedFrom) >= +(dateAttrDomins[dateAttr].min)? +(dateAttrDomins[dateAttr].changedFrom) : +(dateAttrDomins[dateAttr].min),
					to:+(dateAttrDomins[dateAttr].changedTo) <= +(dateAttrDomins[dateAttr].max)? +(dateAttrDomins[dateAttr].changedTo) : +(dateAttrDomins[dateAttr].max),
					prettify: function (num) {
				        return moment(num).format("YYYY-MM-DD");
				    }
				});
			}
		}
	}
}