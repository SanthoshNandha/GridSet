function processData(data){
	
	//console.log(data);
	
	data.forEach(function(set){
		
		set["groupBoundaries"] = [];
		set["xTransalate"] = 0;
		set["yTransalate"] = 0;
		
		if(setLocationInfo.length != 0){
			if(setLocationInfo[set.SetName] != undefined){
				set["fx"] = setLocationInfo[set.SetName].x;
				set["fy"] = setLocationInfo[set.SetName].y;
			}
		}
		
		var setRows = set.rows;
		var setCols = set.cols;
		
		var setBoarderPoints = [];
		var topLeft = point(-(setBoarderSize),-(setBoarderSize+topBoarderExtent));
		topLeft["position"] = RIGHTMIN;
		setBoarderPoints.push(topLeft);

		var topRight = point((setCols-1) + (setBoarderSize),-(setBoarderSize+topBoarderExtent));
		topRight["position"] = LEFTMAX;
		setBoarderPoints.push(topRight);
		
		var bottomLeft2 = point((setCols-1) + (setBoarderSize),(setRows-2)+(setBoarderSize + topBoarderExtent));
		bottomLeft2["position"] = LEFTMAX;
		setBoarderPoints.push(bottomLeft2);
		
		if(LAYOUT_TYPE == GEO_LAYOUT){
			 var lat = set.latitude;
		 	 var lng = set.longitude;	
		 		var pixels = projection([lng,lat]);
		 		set["xValue"] = pixels[0];
		 		set["yValue"] = pixels[1];
		}
        if(LAYOUT_TYPE == TIME_LAYOUT){
            var time = set.time;
        }

		var lastRowCoOrdinates = [];
		
		var subGroups = set.subSets;
		 subGroups.forEach(function(subSet){
			  if(subSet.coOrdinates){
				  var subSetPoints = [];
				  
				  var subSetDegree = subSet.nrCombinedSets;
				  
				  subSet["xTransalate"] = set.xTransalate ;
				  subSet["yTransalate"] = set.yTransalate ;
				  
				  subSet["setId"] = set.id;
				  var coOrdinates = subSet.coOrdinates;		
				  
				  if(set.degreeGroups[subSetDegree] != undefined){
					  set.degreeGroups[subSetDegree].coOrdinates = set.degreeGroups[subSetDegree].coOrdinates.concat(coOrdinates); 
				  }
				  
				  coOrdinates.sort(sortCoOrdinate);
				  
				  var length = coOrdinates.length;
				  var minY =  coOrdinates[0].y;
				  var maxY = coOrdinates[length -1].y;
				  
				  var index = 0;
				  var rows = [];
				  var boarderPoints = [];
				  
				  for(var j=0;j<length; j++){
					  if(coOrdinates[j].y == (setRows-1)){
						  lastRowCoOrdinates.push(coOrdinates[j]);
					  }
				  }
				  
				  for(var i=minY; i <= maxY; i++){
					  rows[index] = [];
					  for(var j=0;j<length; j++){
						  if(coOrdinates[j].y == i){
							  rows[index].push(coOrdinates[j]);
						  }
					  }
					  rows[index].sort(sortCoOrdinateCols);
					  var maxPoint = rows[index][rows[index].length-1]
					  var currentpoint = point((maxPoint.x)  ,(maxPoint.y));
					  currentpoint["position"] = LEFTMAX;
					  boarderPoints.push(currentpoint);
					  index++;
				  }
				  
				  for(var i=rows.length-1; i > -1; i-- ){
					  var minPoint = rows[i][0];
					  var currentpoint = point((minPoint.x)  ,(minPoint.y));
					  currentpoint["position"] = RIGHTMIN;
					  boarderPoints.push(currentpoint);
				  }
				  
				  subSet.coOrdinates.forEach(function(coOrdinate,index){
					  coOrdinate["id"] = subSet.items[index];
					  coOrdinate["item"] = subSet.items[index];
					  //coOrdinate["setSpecificBool"] = set.setSpecificBool[subSet.items[index]];
					  coOrdinate["degree"] = subSetDegree;
					  coOrdinate["subSetId"] = subSet.id;
					  coOrdinate["subGroupName"] = subSet.elementName;
					  coOrdinate["degreeX"] = subSet.degreeCoOrdinates[index].x;
					  coOrdinate["degreeY"] = subSet.degreeCoOrdinates[index].y;
					  for(var a=0; a < attributes.length; a++){
						  if(attributes[a].type == "date"){
							  coOrdinate["moment_"+attributes[a].name] = moment(attributes[a].values[subSet.items[index]],"YYYY-MM-DD");
						  }
						  if(attributes[a].type == "link"){
							  coOrdinate["eleLink"] = attributes[a].values[subSet.items[index]];
						  }
						  coOrdinate[attributes[a].name] = attributes[a].values[subSet.items[index]];
						  if(attributes[a].type == "float"){
							  coOrdinate[attributes[a].name] = Number(attributes[a].values[subSet.items[index]]).toFixed(2);
						  }
					  }
					  if(pictureInfo.length > 0){
						  coOrdinate["picture"] = pictureInfo[coOrdinate["item"]];
					  }
					  if(setSpecificAttributes.length == 1){
						  coOrdinate[setSpecificAttributes[0]["name"]] = set.setSpecificAttrs[subSet.items[index]];
			          }
			          else{
			            	//for mutiple set specific values
			          }
					  var x = coOrdinate.x;
					  var y = coOrdinate.y;
			  	   });
				  
				  var processedBoarderPoints = processSubGroupBoarderPoints(boarderPoints);
				  
				  subSet["processedBoarderPoints"] = processedBoarderPoints;
				  subSet["viewBoxBoarder"] = [];
				  
				  var boundaries = computeBoundaries(subSet.coOrdinates);				  
				  subSet["boundaries"] = boundaries;
				  set["groupBoundaries"].push(boundaries);
				  
				  var midPoint = {};
				  midPoint["x"] = (boundaries.x1 + boundaries.x2) /2;
				  midPoint["y"] = (boundaries.y1 + boundaries.y2) /2;
				  subSet["midPoint"] = midPoint;
				  
				  var viewBoxMidPoint = {};
				  viewBoxMidPoint["x"] = midPoint.x + subSet.xTransalate;
				  viewBoxMidPoint["y"] = midPoint.y + subSet.yTransalate;
				  subSet["viewBoxMid"] = viewBoxMidPoint;	
				  
				  var subGroupWidth = boundaries.x2 - boundaries.x1;
				  var subGroupHeight = boundaries.y2 - boundaries.y1;
				  
				  var subGroupSize = {};
				  subGroupSize["size"] = subSet.items.length;
				  subGroupSize["minSide"] = Math.min(subGroupWidth,subGroupHeight);
				  subGroupsInfo.push(subGroupSize); 
			  }
			  
			  pushToSubGroups(subSet);
		 });
		 
		 var degreeGroups = set.degreeGroups;
		 
		 degreeGroups.forEach(function(degreeGroup){
			 if(degreeGroup.coOrdinates.length > 0){
				 
				 degreeGroup["setName"] = set.id;
				 var coOrdinates = degreeGroup.coOrdinates;
				 coOrdinates.sort(sortDegreeCoOrdinate);
				 var length = coOrdinates.length;
				  var minY =  coOrdinates[0].degreeY;
				  var maxY = coOrdinates[length -1].degreeY;
				  
				  var index = 0;
				  var rows = [];
				  var boarderPoints = [];
				  
				  for(var i=minY; i <= maxY; i++){
					  rows[index] = [];
					  for(var j=0;j<length; j++){
						  if(coOrdinates[j].degreeY == i){
							  rows[index].push(coOrdinates[j]);
						  }
					  }
					  rows[index].sort(sortDegreeCoOrdinateCols);
					  var maxPoint = rows[index][rows[index].length-1]
					  var currentpoint = point((maxPoint.degreeX)  ,(maxPoint.degreeY));
					  currentpoint["position"] = LEFTMAX;
					  boarderPoints.push(currentpoint);
					  index++;
				  }
				  
				  for(var i=rows.length-1; i > -1; i-- ){
					  var minPoint = rows[i][0];
					  var currentpoint = point((minPoint.degreeX)  ,(minPoint.degreeY));
					  currentpoint["position"] = RIGHTMIN;
					  boarderPoints.push(currentpoint);
				  }
				  var processedBoarderPoints = processSubGroupBoarderPoints(boarderPoints);
				  degreeGroup["processedBoarderPoints"] = processedBoarderPoints;
			 }
			 else{
				 degreeGroup["processedBoarderPoints"] = [];
			 }
		 });
		 for(var i=0; i < subGroups.length; i++){
			 var processedBoundary = subGroups[i].processedBoarderPoints;
			 for(var j=0; j < processedBoundary.length; j++){
				 if(processedBoundary[j].pointType == INTERPOINT){
					 for(var k=0; k<subGroups.length; k++){
						 if(k!= i){
							 var nextBoundary = subGroups[k].processedBoarderPoints;
							 for(var l=0; l < nextBoundary.length; l++){
								 if(nextBoundary[l].pointType == ENDPOINT){
									 if(nextBoundary[l].x == processedBoundary[j].x && nextBoundary[l].y == processedBoundary[j].y){
										 
										 var interPoint = processedBoundary[j];
										 var previousPoint = processedBoundary[j-1];
										 var nextPoint = processedBoundary[j+1];
										 
										 if((previousPoint.x < nextPoint.x) && (previousPoint.y < nextPoint.y)){
											 subGroups[i].processedBoarderPoints[j-1]["y"] =  subGroups[i].processedBoarderPoints[j-1].y - (boarderPadding/2);
											 subGroups[i].processedBoarderPoints[j]["x"] = subGroups[i].processedBoarderPoints[j].x + (boarderPadding*1.5);
										 }
										 if((previousPoint.x > nextPoint.x) && (previousPoint.y > nextPoint.y)){
											 subGroups[i].processedBoarderPoints[j-1]["y"] =  subGroups[i].processedBoarderPoints[j-1].y + (boarderPadding/2);
											 subGroups[i].processedBoarderPoints[j]["x"] = subGroups[i].processedBoarderPoints[j].x - (boarderPadding*1.5);
										 }
										 if((previousPoint.x > nextPoint.x) && (previousPoint.y < nextPoint.y)){
											 subGroups[i].processedBoarderPoints[j+1]["y"] =  subGroups[i].processedBoarderPoints[j+1].y + (boarderPadding/2);
											 subGroups[i].processedBoarderPoints[j]["x"] = subGroups[i].processedBoarderPoints[j].x + (boarderPadding*1.5);
										 }
										 if((previousPoint.x < nextPoint.x) && (previousPoint.y > nextPoint.y)){
											 subGroups[i].processedBoarderPoints[j+1]["y"] =  subGroups[i].processedBoarderPoints[j+1].y - (boarderPadding/2);
											 subGroups[i].processedBoarderPoints[j]["x"] = subGroups[i].processedBoarderPoints[j].x - (boarderPadding*1.5);
										 }
									 }
								 }
							 }
						 }
					 }
				 }
			 }
			 subGroups[i]["boarderPath"] = processedBoarderPoints2path(subGroups[i].processedBoarderPoints);
		 }
		 for(var i=0; i < degreeGroups.length; i++){
			 if(degreeGroups[i].processedBoarderPoints){
				 var processedBoundary = degreeGroups[i].processedBoarderPoints;
				 for(var j=0; j < processedBoundary.length; j++){
					 if(processedBoundary[j].pointType == INTERPOINT){
						 for(var k=0; k<degreeGroups.length; k++){
							 if(k!= i){
								 var nextBoundary = degreeGroups[k].processedBoarderPoints;
								 for(var l=0; l < nextBoundary.length; l++){
									 if(nextBoundary[l].pointType == ENDPOINT){
										 if(nextBoundary[l].x == processedBoundary[j].x && nextBoundary[l].y == processedBoundary[j].y){
											 
											 var interPoint = processedBoundary[j];
											 var previousPoint = processedBoundary[j-1];
											 var nextPoint = processedBoundary[j+1];
											 
											 if((previousPoint.x < nextPoint.x) && (previousPoint.y < nextPoint.y)){
												 degreeGroups[i].processedBoarderPoints[j-1]["y"] =  degreeGroups[i].processedBoarderPoints[j-1].y - (boarderPadding/2);
												 degreeGroups[i].processedBoarderPoints[j]["x"] = degreeGroups[i].processedBoarderPoints[j].x + (boarderPadding*1.5);
											 }
											 if((previousPoint.x > nextPoint.x) && (previousPoint.y > nextPoint.y)){
												 degreeGroups[i].processedBoarderPoints[j-1]["y"] =  degreeGroups[i].processedBoarderPoints[j-1].y + (boarderPadding/2);
												 degreeGroups[i].processedBoarderPoints[j]["x"] = degreeGroups[i].processedBoarderPoints[j].x - (boarderPadding*1.5);
											 }
											 if((previousPoint.x > nextPoint.x) && (previousPoint.y < nextPoint.y)){
												 degreeGroups[i].processedBoarderPoints[j+1]["y"] =  degreeGroups[i].processedBoarderPoints[j+1].y + (boarderPadding/2);
												 degreeGroups[i].processedBoarderPoints[j]["x"] = degreeGroups[i].processedBoarderPoints[j].x + (boarderPadding*1.5);
											 }
											 if((previousPoint.x < nextPoint.x) && (previousPoint.y > nextPoint.y)){
												 degreeGroups[i].processedBoarderPoints[j+1]["y"] =  degreeGroups[i].processedBoarderPoints[j+1].y - (boarderPadding/2);
												 degreeGroups[i].processedBoarderPoints[j]["x"] = degreeGroups[i].processedBoarderPoints[j].x - (boarderPadding*1.5);
											 }
										 }
									 }
								 }
							 }
						 }
					 }
				 }
				 degreeGroups[i]["boarderPath"] = processedBoarderPoints2path(degreeGroups[i].processedBoarderPoints); 
			 }			 
		 }
		 
		 lastRowCoOrdinates.sort(sortCoOrdinateCols);
		 
		 var bottomRight = point((( lastRowCoOrdinates[lastRowCoOrdinates.length - 1].x) + (setBoarderSize)) ,((lastRowCoOrdinates[lastRowCoOrdinates.length - 1].y) + setBoarderSize));
		 bottomRight["position"] = LEFTMAX;
	     setBoarderPoints.push(bottomRight);
		 
	     var bottomLeft = point(((lastRowCoOrdinates[0].x)-(setBoarderSize)),((lastRowCoOrdinates[0].y) + (setBoarderSize)));
		 bottomLeft["position"] = RIGHTMIN;
		 setBoarderPoints.push(bottomLeft);
		 
		 var bottomRight2 = point((-(setBoarderSize)),((setRows-2)+(setBoarderSize)));
		 bottomRight2["position"] = RIGHTMIN;
		 setBoarderPoints.push(bottomRight2);
		 
		 var setBoarder = processSubGroupBoarderPoints(setBoarderPoints);
		 
		 var squareBoarderPath = processedBoarderPoints2path(setBoarder);
		 
		 var pathForRoundedBoarder = processedBoarderPoints2path2(setBoarder);
		 
		 var roundedEdgeBoarderPath = roundPathCorners(pathForRoundedBoarder, 5, false)
		 
		 set["boarderPath"] =  roundedEdgeBoarderPath;
		 
		 var outerBoundaries = computeSetBoundaries(set.groupBoundaries);
		 set["boundaries"] = outerBoundaries;
		 
		 var width = outerBoundaries.x2 - outerBoundaries.x1;
		 var height = outerBoundaries.y2 - outerBoundaries.y1;
		 set["width"] = width;
		 set["height"] = height;
		 
		 if((width/2) <= minSetSide){
			 minSetSide = (width/1.5);
		 }
		 if((height/2) <= minSetSide){
			 minSetSide = (height/1.5);
		 }
		 
		 var setCenter = {};
		 setCenter["x"] = (outerBoundaries.x1  + outerBoundaries.x2) /2;
		 setCenter["y"] = (outerBoundaries.y1 + outerBoundaries.y2) /2;
		 set["setCenter"] = setCenter;
		 
		 var viewBoxBoundaries = {};
		  viewBoxBoundaries["x1"] = outerBoundaries.x1 + set.xTransalate;
		  viewBoxBoundaries["x2"] = outerBoundaries.x2 + set.xTransalate;
		  viewBoxBoundaries["y1"] = outerBoundaries.y1 + set.yTransalate;
		  viewBoxBoundaries["y2"] = outerBoundaries.y2 + set.yTransalate;
		  set["viewBoxBoundaries"] = viewBoxBoundaries;
		  
		  var viewBoxCenter = {};
		  viewBoxCenter["x"] = (viewBoxBoundaries.x1 + viewBoxBoundaries.x2)/2;
		  viewBoxCenter["y"] = (viewBoxBoundaries.y1 + viewBoxBoundaries.y2)/2;
		  set["viewBoxCenter"] = viewBoxCenter;
		  
	 });
	
	similarityLinkScale.range([0, minSetSide]);
	similarityLinkLength.range([SVG_HEIGHT, 1]);
	
	var rank;
	subGroupsInfo.sort(sortSideAsc);
	subGroupsInfo.forEach(function(d,i){
		if(i==0){
			subGroupsInfo[i]["sideRank"] = 1;
			rank = 1;
		}
		else{
			if(subGroupsInfo[i].minSide == subGroupsInfo[i-1].minSide){
				subGroupsInfo[i]["sideRank"] = rank;
			}
			else{
				subGroupsInfo[i]["sideRank"] = rank + 1;
				rank++;
			}
		}
	});
	
	subGroupsInfo.sort(sortsizeDesc);
	subGroupsInfo.forEach(function(d,i){
		if(i==0){
			subGroupsInfo[i]["sizeRank"] = 1;
			rank = 1;
		}
		else{
			if(subGroupsInfo[i].size == subGroupsInfo[i-1].size){
				subGroupsInfo[i]["sizeRank"] = rank;
			}
			else{
				subGroupsInfo[i]["sizeRank"] = rank + 1;
				rank++;
			}
		}
		subGroupsInfo[i]["combinedRank"] = (subGroupsInfo[i].sideRank * subGroupsInfo[i].sizeRank);
		
	});
	subGroupsInfo.sort(sortCombinedId);
	
	if(subGroupsInfo[0]){
		linkThicknessFactor = ((subGroupsInfo[0].minSide/subGroupsInfo[0].size));
	}
	fixThicknessFactor(0.99);
}

function createOprSet(set1Element, set2Element, opr_sym){
	
	var set1ElementName = set1Element.SetName;
	var set2ElementName = set2Element.SetName;
	
	var newSetName = generateOprSetName(set1Element, set2Element, opr_sym);
	var set;
	
	var setNamesIndex = setNames.indexOf(newSetName);
	if(setNamesIndex == -1 ){
		setLocationInfo[newSetName] = {};
		setLocationInfo[newSetName]["x"] = set2Element.x;
		setLocationInfo[newSetName]["y"] = set2Element.y;
		
		var set1Index = getRawSetIndex(set1ElementName);
		var set2Index = getRawSetIndex(set2ElementName);
		
		var Set1RawSet = rawSets[set1Index];
		var Set2RawSet = rawSets[set2Index];
		
		var oprRawSet = getOprRawSet(Set1RawSet,Set2RawSet,opr_sym);
		
		if(oprRawSet.indexOf(1) == -1){
			alert("Result is Empty");
			return;
		}
		
		rawSets.push(oprRawSet);
		setNames.push(newSetName);
		
		var combinedSets = Array.apply(null, new Array(rawSets.length)).map(Number.prototype.valueOf, 0);
		combinedSets[combinedSets.length - 1] = 1;
		
		set = new Set(setPrefix + (combinedSets.length - 1), setNames[setNames.length - 1], combinedSets, rawSets[rawSets.length - 1], true, set1Element, set2Element,opr_sym);
		
		for(var i=0; i < sets.length; i++){
			sets[i].combinedSets.push(0);
		}
		
		sets.push(set);
		set.isSelected = true;
		
		var setsAttribute = {
		        name: 'Sets',
		        type: 'sets',
		        values: [],
		        sort: 1
		    };

		    for (var d = 0; d < depth; ++d) {
		        var setList = [];
		        for (var s = 0; s < rawSets.length; s++) {
		            if (rawSets[s][d] === 1) {
		                setList.push(sets[s].id)
		            }
		        }
		        setsAttribute.values[d] = setList;
		    }
		    
		    for(var i=0; i < attributes.length; i++){
		    	if(attributes[i].type == "sets"){
		    		attributes.splice(i, 1);
		    		break;
		    	}
		    }
		    attributes.push(setsAttribute);
	}
	else{
		set = sets[setNamesIndex];
	}
	
	usedSets.push(set);
	removedFromUsedSets(set1ElementName);
	removedFromUsedSets(set2ElementName);
	
	reRenderVis();
}

function removeOprSet(oprSet, set1Element, set2Element){
	
	var set1ElementName = set1Element;
	var set2ElementName = set2Element;
	
	removedFromUsedSets(oprSet);
	addToUsedSets(set1Element.SetName, set2Element.SetName);
	
	reRenderVis();
}

function seperateGubGroup(subGroup,sourceSet){
	
	var combinedSets = subGroup.combinedSets;
	var subGroupItems = subGroup.items;
	
	var newRawSet;
	var usedSetNames = [];
	
	var link = {};
	
	for(var i=0; i<combinedSets.length; i++){
		if(combinedSets[i] == 1){
			var elementName = usedSets[i].elementName;
			usedSetNames.push(elementName);
		}
	}
	var setIndex = getRawSetIndex(sourceSet);
	newRawSet = rawSets[setIndex];
	
	var setsInvolved = [];
	setsInvolved = subGroup.elementName.replace(" &#8745; ","&#8745;").replace(" &#8746; ","&#8746;").replace(" &#8722; ","&#8722;").trim().split(" ");
	var newSetName = setsInvolved.join(" &#8745; ");
	
		for(var k=0; k<subGroupItems.length; k++){
			newRawSet[subGroupItems[k]] = 0;
		}
		rawSets.push(newRawSet);
		setNames.push("[" + sourceSet + "]");
		setLocationInfo["[" + sourceSet + "]"] = setLocationInfo[sourceSet];
		var newCombinedSets = Array.apply(null, new Array(rawSets.length)).map(Number.prototype.valueOf, 0);
		newCombinedSets[newCombinedSets.length - 1] = 1;
		var set = new Set(setPrefix + (newCombinedSets.length - 1), setNames[setNames.length - 1], newCombinedSets, rawSets[rawSets.length - 1],true);
		for(var i=0; i < sets.length; i++){
			sets[i].combinedSets.push(0);
		}
		sets.push(set);
		set.isSelected = true;
		usedSets.push(set);
	
	var newSetRawSet = Array.apply(null, new Array(rawSets[0].length)).map(Number.prototype.valueOf, 0);
	for(var i=0; i<subGroupItems.length; i++){
		newSetRawSet[subGroupItems[i]] = 1;
	}
	
	rawSets.push(newSetRawSet);
	setNames.push(newSetName);
	
	var combinedSets = Array.apply(null, new Array(rawSets.length)).map(Number.prototype.valueOf, 0);
	combinedSets[combinedSets.length - 1] = 1;
	
	var set = new Set(setPrefix + (combinedSets.length - 1), setNames[setNames.length - 1], combinedSets, rawSets[rawSets.length - 1],true);
	
	for(var i=0; i < sets.length; i++){
		sets[i].combinedSets.push(0);
	}
	
	sets.push(set);
	
	set.isSelected = true;
	usedSets.push(set);
	
	var setsAttribute = {
	        name: 'Sets',
	        type: 'sets',
	        values: [],
	        sort: 1
	    };

	    for (var d = 0; d < depth; ++d) {
	        var setList = [];
	        for (var s = 0; s < rawSets.length; s++) {
	            if (rawSets[s][d] === 1) {
	                setList.push(sets[s].id)
	            }
	        }
	        setsAttribute.values[d] = setList;
	    } 
	    
	    for(var i=0; i < attributes.length; i++){
	    	if(attributes[i].type == "sets"){0
	    		attributes.splice(i, 1);
	    		break;
	    	}
	    }
	    attributes.push(setsAttribute);
	    
	    	removedFromUsedSets(sourceSet);
	    
	    link["source"] = ((usedSets.length) - 2);
	    link["target"] = ((usedSets.length) - 1);
	    
	    seperateGroupLinks.push(link);
	    
	    reRenderVis();
}

function createMinusFromSubGroup(subGroup){
	
	var combinedSets = subGroup.combinedSets;
	var subGroupItems = subGroup.items;
	var newRawSets = [];
	var usedSetNames = [];
	
	for(var i=0; i<combinedSets.length; i++){
		if(combinedSets[i] == 1){
			var elementName = usedSets[i].elementName;
			usedSetNames.push(elementName);
			var setIndex = getRawSetIndex(elementName);
			var rawSet = rawSets[setIndex];
			newRawSets.push(rawSet.slice(0));
		}
	}
	
	var setsInvolved = [];
	setsInvolved = subGroup.elementName.replace(" &#8745; ","&#8745;").replace(" &#8746; ","&#8746;").replace(" &#8722; ","&#8722;").trim().split(" ");
	var newSetName = setsInvolved.join(" &#8745; ");
	
	for(var j=0; j<newRawSets.length; j++){
		for(var k=0; k<subGroupItems.length; k++){
			newRawSets[j][subGroupItems[k]] = 0;
		}
		rawSets.push(newRawSets[j]);
		setNames.push(usedSetNames[j] + " &#8722; " + newSetName);
		var newCombinedSets = Array.apply(null, new Array(rawSets.length)).map(Number.prototype.valueOf, 0);
		newCombinedSets[newCombinedSets.length - 1] = 1;
		var set = new Set(setPrefix + (newCombinedSets.length - 1), setNames[setNames.length - 1], newCombinedSets, rawSets[rawSets.length - 1],true);
		for(var i=0; i < sets.length; i++){
			sets[i].combinedSets.push(0);
		}
		sets.push(set);
		set.isSelected = true;
		usedSets.push(set);
	}
	
	var newSetRawSet = Array.apply(null, new Array(rawSets[0].length)).map(Number.prototype.valueOf, 0);
	for(var i=0; i<subGroupItems.length; i++){
		newSetRawSet[subGroupItems[i]] = 1;
	}
	
	
	
	rawSets.push(newSetRawSet);
	setNames.push(newSetName);
	
	var combinedSets = Array.apply(null, new Array(rawSets.length)).map(Number.prototype.valueOf, 0);
	combinedSets[combinedSets.length - 1] = 1;
	
	var set = new Set(setPrefix + (combinedSets.length - 1), setNames[setNames.length - 1], combinedSets, rawSets[rawSets.length - 1],true);
	
	for(var i=0; i < sets.length; i++){
		sets[i].combinedSets.push(0);
	}
	
	sets.push(set);
	
	set.isSelected = true;
	usedSets.push(set);
	
	var setsAttribute = {
	        name: 'Sets',
	        type: 'sets',
	        values: [],
	        sort: 1
	    };

	    for (var d = 0; d < depth; ++d) {
	        var setList = [];
	        for (var s = 0; s < rawSets.length; s++) {
	            if (rawSets[s][d] === 1) {
	                setList.push(sets[s].id)
	            }
	        }
	        setsAttribute.values[d] = setList;
	    } 
	    
	    for(var i=0; i < attributes.length; i++){
	    	if(attributes[i].type == "sets"){0
	    		attributes.splice(i, 1);
	    		break;
	    	}
	    }
	    attributes.push(setsAttribute);
	    
	    for(var l=0; l < usedSetNames.length; l++){
	    	removedFromUsedSets(usedSetNames[l]);
	    }
	    
	
	    reRenderVis();
}

function createSetFromSubGroup(subGroup){
	
	var newSetRawSet = Array.apply(null, new Array(rawSets[0].length)).map(Number.prototype.valueOf, 0);
	var subGroupItems = subGroup.items;
	for(var i=0; i<subGroupItems.length; i++){
		newSetRawSet[subGroupItems[i]] = 1;
	}
	
	var setsInvolved = [];
	setsInvolved = subGroup.elementName.replace(" &#8745; ","&#8745;").replace(" &#8746; ","&#8746;").replace(" &#8722; ","&#8722;").trim().split(" ");
	var newSetName = setsInvolved.join(" &#8745; ");
	
	rawSets.push(newSetRawSet);
	setNames.push(newSetName);
	
	var combinedSets = Array.apply(null, new Array(rawSets.length)).map(Number.prototype.valueOf, 0);
	combinedSets[combinedSets.length - 1] = 1;
	
	var set = new Set(setPrefix + (combinedSets.length - 1), setNames[setNames.length - 1], combinedSets, rawSets[rawSets.length - 1],true);
	
	for(var i=0; i < sets.length; i++){
		sets[i].combinedSets.push(0);
	}
	
	sets.push(set);
	
	set.isSelected = true;
	usedSets.push(set);
	
	var setsAttribute = {
	        name: 'Sets',
	        type: 'sets',
	        values: [],
	        sort: 1
	    };

	    for (var d = 0; d < depth; ++d) {
	        var setList = [];
	        for (var s = 0; s < rawSets.length; s++) {
	            if (rawSets[s][d] === 1) {
	                setList.push(sets[s].id)
	            }
	        }
	        setsAttribute.values[d] = setList;
	    }
	    
	    for(var i=0; i < attributes.length; i++){
	    	if(attributes[i].type == "sets"){
	    		attributes.splice(i, 1);
	    		break;
	    	}
	    }
	    attributes.push(setsAttribute);
	
	    reRenderVis();
}

function createAttributeSet(elements, set_name){
	
	var newSetRawSet = Array.apply(null, new Array(rawSets[0].length)).map(Number.prototype.valueOf, 0);
	for(var i=0; i<elements.length; i++){
		newSetRawSet[elements[i]] = 1;
	}
	
	rawSets.push(newSetRawSet);
	setNames.push(set_name);
	
	var combinedSets = Array.apply(null, new Array(rawSets.length)).map(Number.prototype.valueOf, 0);
	combinedSets[combinedSets.length - 1] = 1;
	
	var set = new Set(setPrefix + (combinedSets.length - 1), setNames[setNames.length - 1], combinedSets, rawSets[rawSets.length - 1],true);
	
	for(var i=0; i < sets.length; i++){
		sets[i].combinedSets.push(0);
	}
	
	sets.push(set);
	
	set.isSelected = true;
	usedSets.push(set);
	
	var setsAttribute = {
	        name: 'Sets',
	        type: 'sets',
	        values: [],
	        sort: 1
	    };

	    for (var d = 0; d < depth; ++d) {
	        var setList = [];
	        for (var s = 0; s < rawSets.length; s++) {
	            if (rawSets[s][d] === 1) {
	                setList.push(sets[s].id)
	            }
	        }
	        setsAttribute.values[d] = setList;
	    }
	    
	    for(var i=0; i < attributes.length; i++){
	    	if(attributes[i].type == "sets"){
	    		attributes.splice(i, 1);
	    		break;
	    	}
	    }
	    attributes.push(setsAttribute);
	
	    reRenderVis();
}

function getOprRawSet(Set1RawSet, Set2RawSet, opr_sym){
	var opRawSet = [];
	
	if(opr_sym == UNION_SYM ){
		for(var i=0; i < Set1RawSet.length; i++){
			if(Set1RawSet[i] == 1 || Set2RawSet[i] == 1){
				opRawSet[i] = 1;
			}
			else{
				opRawSet[i] = 0;
			}
		}
	}
	
	else if(opr_sym == INTERSECTION_SYM){
		for(var i=0; i < Set1RawSet.length; i++){
			if(Set1RawSet[i] == 1 && Set2RawSet[i] == 1){
				opRawSet[i] = 1;
			}
			else{
				opRawSet[i] = 0;
			}
		}
	}
	
	else if(opr_sym == MINUS_SYM){
		for(var i=0; i < Set1RawSet.length; i++){
			if(Set1RawSet[i] == 1 && Set2RawSet[i] == 0){
				opRawSet[i] = 1;
			}
			else{
				opRawSet[i] = 0;
			}
		}
	}
	
	return opRawSet;
}

