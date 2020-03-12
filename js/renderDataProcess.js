function processRenderData(data){	
	visibleElements = [];
	var disPropMin=0, disPropMax=0;
	maxDegree=1;
	for(var i=0; i<data.length; i++){
		var setGrid = data[i];
		for(var j=0; j<setGrid.subSets.length; j++){
			disPropMin = Math.min(disPropMin,setGrid.subSets[j].disproportionality);
			disPropMax = Math.max(disPropMax,setGrid.subSets[j].disproportionality);
			maxDegree = Math.max(maxDegree,setGrid.subSets[j].nrCombinedSets);
			if(setGrid.subSets[j].coOrdinates){
				 for(var k=0; k < setGrid.subSets[j].coOrdinates.length; k++){
					 visibleElements.push(setGrid.subSets[j].coOrdinates[k]);
				 }
				 var coOrdinates = setGrid.subSets[j].coOrdinates;
				 setGrid.subSets[j]["attrMeans"] = {};
				 numericAttributes.forEach(function(attr,i){
			    var attrName = attr.name;
			    var attrValues = coOrdinates.map(function(coOrdinate){
				   return coOrdinate[attrName];
			    })
			    setGrid.subSets[j]["attrMeans"][attrName] = d3.mean(attrValues);
			    if(numericAttrMeanDomains[attrName].min == null){
			    	numericAttrMeanDomains[attrName].min = d3.mean(attrValues);
			    	numericAttrMeanDomains[attrName].max = d3.mean(attrValues);
			    }
			    else{
			    	if(d3.mean(attrValues) < numericAttrMeanDomains[attrName].min){
			    		numericAttrMeanDomains[attrName].min = d3.mean(attrValues);
			    	}
			    	else if(d3.mean(attrValues) > numericAttrMeanDomains[attrName].max){
			    		numericAttrMeanDomains[attrName].max = d3.mean(attrValues);
			    	}
			    }
			  });
			 }
		}
	}
	if(disPropMin > 0){
		disPropMin = -1;
	}
	if(disPropMax < 0){
		disPropMax = 1;
	}
	disproportionalityScale.domain([disPropMin, 0, disPropMax]);
	updateDegreeSlider();
	
	if(visibleElements.length > 0){
		for(var attrName in numericAttrDomins){
			numericAttrDomins[attrName].min = attrMinValue(visibleElements, attrName);
			numericAttrDomins[attrName].max = attrMaxValue(visibleElements, attrName);
		}
		for(var dateAttr in dateAttrDomins){
			dateAttrDomins[dateAttr].min = dateMinValue(visibleElements, dateAttr);
			dateAttrDomins[dateAttr].max = dateMaxValue(visibleElements, dateAttr);
		}
		
	}
	if(visibleElements.length == 0){
		for(var attrName in numericAttrDomins){
			numericAttrDomins[attrName].min = 0;
			numericAttrDomins[attrName].max = 0;
		}
		for(var dateAttr in dateAttrDomins){
			dateAttrDomins[dateAttr].min = moment();
			dateAttrDomins[dateAttr].max = moment();
		}
	}
}

function updateDegreeSlider(){
	if(!(degreeSliderChanges.isFromChanged) && !(degreeSliderChanges.isToChanged)){
		degreeSlider.update({
			 min:1,
			 from:1,
			 max: maxDegree,
			 to:maxDegree,
		});
	}
	else{
		if((degreeSliderChanges.isFromChanged) && !(degreeSliderChanges.isToChanged)){
			degreeSlider.update({
				 min:1,
				 from:(degreeSliderChanges.changedFrom) >= (maxDegree)? (maxDegree) : (degreeSliderChanges.changedFrom),
				 max: maxDegree,
				 to:maxDegree,
			});
		}
		else if(!(degreeSliderChanges.isFromChanged) && (degreeSliderChanges.isToChanged)){
			degreeSlider.update({
				 min:1,
				 max: maxDegree,
				 from:1,
				 to:(degreeSliderChanges.changedTo) <= (maxDegree)? (degreeSliderChanges.changedTo) : (maxDegree),
			});
		}
		else if((degreeSliderChanges.isFromChanged) && (degreeSliderChanges.isToChanged)){
			degreeSlider.update({
				 min:1,
				 max: maxDegree,
				 from:(degreeSliderChanges.changedFrom) >= (maxDegree)? (maxDegree) : (degreeSliderChanges.changedFrom),
				 to:(degreeSliderChanges.changedTo) <= (maxDegree)? (degreeSliderChanges.changedTo) : (maxDegree),
			});
		}
	}
}
function updateDegreeSliderData(data){
	if(data.min != data.from){
		degreeSliderChanges["isFromChanged"] = true;
		degreeSliderChanges["changedFrom"] = data.from;
	}
	else{
		degreeSliderChanges["isFromChanged"] = false;
	}
	if(data.max != data.to){
		degreeSliderChanges["isToChanged"] = true;
		degreeSliderChanges["changedTo"] = data.to;
	}
	else{
		degreeSliderChanges["isToChanged"] = false;
	}
}