/* 
	* Author: Santhosh Nandhakumar
	* eMail ID: nsanthosh2409@gmail.com
 */

function buildAttrSets(){
	setsAttribute = attributes.filter(function (d) {
        return (d.name != "Sets" && d.name != "Set Count")
	});
	
	/* var summaryStatisticVis=[];
	 setsAttribute.filter(function(d){
         return (d.type=="integer" || d.type=="float")
     }).forEach(function(attribute,i){
    	 summaryStatisticVis.push({
                 attribute: attribute.name,
             })
     })
*/	
	var selectLength = $('#shapeSize').children('option').length;
	
	if(selectLength == 0 ){
		$.each(setsAttribute, function(key, value) {
			var attributeScale = d3.scaleLinear()
		    	    .range([3, side + 2]);
			
			if(value.type == "integer" || value.type == "float" ){
				attributeScale.domain([value.min,value.max]);
			}
			pixelSizeScales[value.name] = attributeScale;
			if(value.name != "Name" && value.name != "SetNames" && (value.type == "integer" || value.type == "float")){
				
				var attributeQueryPanel =  d3.select("#legend-div")
											.append("div")
											.attr("class","attributeQueryPanel attributeQueryPanel_"+key);
					
				var attributeQueryLabel = attributeQueryPanel	
											.append("label")
											.text(value.name);
				
											attributeQueryPanel.append("br");
				
				var attributeSlidMinLabel = attributeQueryPanel
											.append("span")
											.attr("class","attributeSlidMinLabel pull-left attributeSlidMinLabel_"+key)
											.style("width","25%")
											.append("label")
											.text(value.min);
				
				var attributeQueryInput = 	attributeQueryPanel
											.append("span")
											.attr("class","attributeQueryInputConatiner pull-left attributeQueryInputConatiner_"+key)
											.style("width","50%")
											.append("input")
											.attr("type","text")
											.attr("id",function(){
												return "attrSlide" + key; 
											})
											.attr("data-slider-attrName",value.name);
				
				var attributeSlidMaxLabel = attributeQueryPanel
												.append("span")
												.attr("class","attributeSlidMaxLabel pull-left attributeSlidMaxLabel_"+key)
												.style("width","25%")
												.append("label")
												.text(value.max);
				
				attrSliders[value.name] = ($("#attrSlide" + key).bootstrapSlider({
					name:value.name,  
					min:value.min,
					max:value.max,
					handle:"custom",
					value:[value.min,value.max],
					tooltip:'hide',
					formatter: function(value) {
						return 'Current value: ' + value;
					}
				}));
				
				$("#attrSlide" + key).on("slide", function(slideEvt) {
					$("#attributeQueryMinBox_"+key).val((slideEvt.value)[0]);
					$("#attributeQueryMaxBox_"+key).val((slideEvt.value)[1]);
				});
				
				d3.select("#attributeQueryMinBox_"+key).on("change",function(){
					
					var minDeg = $("#attributeQueryMinBox_"+key).val();
					var maxDeg = $("#attributeQueryMaxBox_"+key).val();
					
					attrSliders[value.name].bootstrapSlider('setValue', [Number(minDeg),Number(maxDeg)]);
				})
				
				d3.select("#attributeQueryMaxBox_"+key).on("change",function(){
					
					var minDeg = $("#attributeQueryMinBox_"+key).val();
					var maxDeg = $("#attributeQueryMaxBox_"+key).val();
					
					attrSliders[value.name].bootstrapSlider('setValue', [Number(minDeg),Number(maxDeg)]);
					// console.log(degreeSlider.bootstrapSlider('getValue'));
				})
				
				$('#size-select')
		         .append($("<option></option>")
		                    .attr("value",value.name)
		                    .text(value.name));
				
				$('#shapeSize')
		         .append($("<option></option>")
		                    .attr("value",value.name)
		                    .text(value.name));                 
	                        
	            $('#shapeColor')
		         .append($("<option></option>")
		                    .attr("value",value.name)
		                    .text(value.name));
	            
	            $('#shapeOrder')
		         .append($("<option></option>")
		                    .attr("value",value.name)
		                    .text(value.name));
	            
	            $('#meanColour')
			    .append($("<option></option>")
			    		 .attr("value",value.name)
		                 .text(value.name));
	            
	            $('#distributionColor')
			    .append($("<option></option>")
			    		 .attr("value",value.name)
		                 .text(value.name));
	            
	            $('#subColor')
			    .append($("<option></option>")
			    		 .attr("value",value.name)
		                 .text(value.name + "_Mean"));
			}
			if(value.name != "Name" && value.name != "SetNames" && (value.type == "text")){
				var card = d3.select("#category-attribute-accordion")
							.append("div")
							.attr("class","card card_"+key);
				
				var card_header = card.append("div")
									.attr("class","card-header card-header_"+key)
									
				var card_name  = card_header.append("div")
									.attr("class","card-name pull-left card-name_"+key)		
									.attr("data-toggle","collapse")
									.attr("data-target","#CategoryList_"+value.name)
									.text(value.name);
				
				
				var card_check = card_header.append("div")
									.attr("class","pull-right card-check card-check_"+key)
									.append("input")
									.attr("type","checkbox")
									.attr("id","category-attr-"+value.name)
									.attr("name","category-attr-"+value.name);
				
				var categoryListDiv = card.append("div")
										.attr("class","card-block pull-left")
										.attr("id","CategoryList_"+value.name)
										.attr("aria-expanded","false");
				
				for(var ij=0; ij<value.categories.length; ij++){
					var option = categoryListDiv
									.append("div");
					
					var categoryLabel = option.append("div")
										.attr("class","category pull-left")
										.text(value.categories[ij])
										
					var optionCheck = option.append("div")
					 				.attr("class","pull-right")
									.append("input")
									.attr("type","checkbox")
									.attr("id","category-"+value.categories[ij])
									.attr("name","category-"+value.categories[ij]);
					
					option.append("br");
				}
				
				drawCategoryLegends(value.categories);
										
			}
		});
		
		$('#size-select')
	    .append($("<option></option>")
	            .attr("value","None")
	            .text("None")); 
		
		$('#meanColour')
		    .append($("<option></option>")
		            .attr("value","None")
		            .text("None"))
		            .val("None");
		
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
	    
	    $('#distributionColor')
	    .append($("<option></option>")
	            .attr("value","None")
	            .text("None"))
	            .val("None");
	    
	    $('#subColor')
	    .append($("<option></option>")
	            .attr("value","None")
	            .text("None"))
	            .val("None");
	}
}
