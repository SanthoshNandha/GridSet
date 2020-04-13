function isSubSetPresent(id, target){
	for(var i = 0 ; i < target.length; i++){
		if(target[i].id == id){
			return true;
		}
	}
	return false;
}

function pushToSubGroups(subGroup){
	var subGroupId= subGroup.id;
	var subGroupSize= subGroup.setSize;
	var subGroupName = subGroup.elementName;
	var subGroupLink  = {};
	subGroupLink["subGroups"] = [];
	
	if(subGroup.length == 0){
		subGroupLink["id"] = subGroupId;
		subGroupLink["size"] = subGroupSize;
		subGroupLink["subGroupName"] = subGroupName;
		subGroupLink["subGroups"].push(subGroup);
		subGroupsLinks.push(subGroupLink);
	}
	else{
		var flag = false;
		for(var i=0; i < subGroupsLinks.length; i++){
			if(subGroupsLinks[i].id == subGroupId){
				subGroupsLinks[i].subGroups.push(subGroup);
				flag = true;
				break;
			}
		}
		if(!flag){
			subGroupLink["id"] = subGroupId;
			subGroupLink["size"] = subGroupSize;
			subGroupLink["subGroupName"] = subGroupName;
			subGroupLink["subGroups"].push(subGroup);
			subGroupsLinks.push(subGroupLink);
		}
	}
}

function processSubGroupLinks(subGroupsLinks){
	
	var processedSubGroupLinks = [];
	for(var i=0; i < subGroupsLinks.length; i++ ){
		var subGroupId = subGroupsLinks[i].id;
		var size = subGroupsLinks[i].size;
		var name = subGroupsLinks[i].subGroupName
		var subGroups = subGroupsLinks[i].subGroups;
		
		if(subGroups.length > 1){
			for(var j=1; j < subGroups.length; j++){
				var subGroupLink = {};
				subGroupLink["id"] = subGroupId;
				subGroupLink["index"] = j-1;
				subGroupLink["size"] = size;
				subGroupLink["name"] = name;
				subGroupLink["source"] = subGroups[j-1].setId;
				subGroupLink["target"] = subGroups[j].setId;
				subGroupLink["subGroups"] = [subGroups[j-1],subGroups[j]];
				processedSubGroupLinks.push(subGroupLink);
			}
		}
	}
	
	return processedSubGroupLinks;
}

function processSubGroupGroups(subGroupGroup){
	var processedSubGroupLinks = [];
	var subGroupId = subGroupGroup.id;
	var size = subGroupGroup.size;
	var name = subGroupGroup.subGroupName
	var subGroups = subGroupGroup.subGroups;
	
	for(var j=1; j < subGroups.length; j++){
		var subGroupLink = {};
		subGroupLink["id"] = subGroupId;
		subGroupLink["size"] = size;
		subGroupLink["name"] = name;
		subGroupLink["subGroups"] = [subGroups[j-1],subGroups[j]];
		processedSubGroupLinks.push(subGroupLink);
	}
	return processedSubGroupLinks;
}

function createSingleSankeyLinks(sets){

	edges  = [];
	edges2  = [];
	sets.sort(setsXAxisSort);
	for(var i=0; i<sets.length ; i++){
		var linkedSubsets = [];
		var sourceSet = sets[i];
		var sourceSubSets = sourceSet.subSets;
		for(var j=i+1; j<sets.length; j++){
			var link ={};
			var links=[];
			var direction = "";
			var targetSet = sets[j];
			
			link["sourceSet"] = sourceSet;
			link["targetSet"] = targetSet;
			
			 if(line_intersects(sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y,
					  targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y,
					  sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y1,
					  sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y2)){
				      direction = "east";
			  }
			  else if(line_intersects(sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y,
					  targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y,
					  sourceSet.viewBoxBoundaries.x1,sourceSet.viewBoxBoundaries.y2,
					  sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y2)){
				      direction = "south";
						
			  }
			  else if(line_intersects(sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y,
					  targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y,
					  sourceSet.viewBoxBoundaries.x1,sourceSet.viewBoxBoundaries.y1,
					  sourceSet.viewBoxBoundaries.x1,sourceSet.viewBoxBoundaries.y2)){
				      direction = "west";
				  	  
			  }
			  else if(line_intersects(sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y,
					  targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y,
					  sourceSet.viewBoxBoundaries.x1,sourceSet.viewBoxBoundaries.y1,
					  sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y1)){
				      direction = "north";
			  }
			 
			 var targetSubSets = targetSet.subSets;
			 
			 sourceSubSets.forEach(function(subSet){
				 var id = subSet.id;
				 var subSetsize = subSet.setSize;
				 if(isSubSetPresent(id,targetSubSets) && linkedSubsets.indexOf(id) == -1 && subSet.coOrdinates ){
					 links.push({"id":id, "setSize":subSetsize, "array": [subSet.viewBoxMid],"boarder":[subSet.viewBoxBoarder],"sourceSetId" : sourceSet.id, "direction":direction});
					 linkedSubsets.push(id);
				 }
			 });
			 targetSubSets.forEach(function(subSet){
				 var id = subSet.id;
					 for (var index = 0; index < links.length; index++) {
						if(links[index].id == id){
							links[index].array.push(subSet.viewBoxMid);
							links[index].boarder.push(subSet.viewBoxBoarder);
							links[index]["targetSetId"] = targetSet.id;
							linkedSubsets.push(id);
							break;
						}
					}
			 });
			 
			 link["links"] = links;
			 for(var k=0; k < links.length; k++ ){
				 if(links[k].array.length == 2){
					 edges2.push(links[k]);
				 }
			 }
			 edges.push(link);
		}
	}
}

function createLinks(sets){
	edges  = [];
	sets.sort(setsXAxisSort);
	for(var i=0; i<sets.length ; i++){
		var linkedSubsets = [];
		var sourceSet = sets[i];
		var sourceSubSets = sourceSet.subSets;
		for(var j=i+1; j<sets.length; j++){
			var link ={};
			var links=[];
			var targetSet = sets[j];
			var intersectionSize = 0;
			var intersectionPts1;
			var intersectionPts2;
			var distance;
			var refpt1 ={};
			var refpt2 = {};			
			
			link["sourceSet"] = sourceSet;
			link["targetSet"] = targetSet;
			link["referneceLine"] = {};
			
			 if(line_intersects(sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y,
					  targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y,
					  sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y1,
					  sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y2)){
				 	  link["linePlace"] = "east";
				 	  link.referneceLine["direction"] = "east";
				 	   intersectionPts1 = math.intersect([sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y], 
				 			  								[targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y], 
				 			  								[sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y1], 
				 			  								[sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y2]);
				 	  
				 	   intersectionPts2 = math.intersect([sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y], 
			 									[targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y], 
				  								[targetSet.viewBoxBoundaries.x1,targetSet.viewBoxBoundaries.y1], 
				  								[targetSet.viewBoxBoundaries.x1,targetSet.viewBoxBoundaries.y2]);
				 	   
				 	distance = computeDistance(intersectionPts1[0],intersectionPts1[1],intersectionPts2[0],intersectionPts2[1]);
				 	
				 	var  midX = (intersectionPts1[0] + intersectionPts2[0])/2;
				 	var  midY = (intersectionPts1[1] + intersectionPts2[1])/2;
				 	
				 	refpt1["x"] = midX - (distance/referenceParts);
				 	refpt1["y"] = midY;
				 	refpt2["x"] = midX + (distance/referenceParts);
				 	refpt2["y"] = midY;
			  }
			  else if(line_intersects(sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y,
					  targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y,
					  sourceSet.viewBoxBoundaries.x1,sourceSet.viewBoxBoundaries.y2,
					  sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y2)){
				      link["linePlace"] = "south";
				      link.referneceLine["direction"] = "south";
				       intersectionPts1 = math.intersect([sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y], 
 								[targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y], 
 								[sourceSet.viewBoxBoundaries.x1,sourceSet.viewBoxBoundaries.y2], 
 								[sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y2]);

						 intersectionPts2 = math.intersect([sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y], 
											[targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y], 
											[targetSet.viewBoxBoundaries.x1,targetSet.viewBoxBoundaries.y1], 
											[targetSet.viewBoxBoundaries.x2,targetSet.viewBoxBoundaries.y1]);
						 
						 distance = computeDistance(intersectionPts1[0],intersectionPts1[1],intersectionPts2[0],intersectionPts2[1]);
						 	var  midX = (intersectionPts1[0] + intersectionPts2[0])/2;
						 	var  midY = (intersectionPts1[1] + intersectionPts2[1])/2;
						 	
						 	refpt1["x"] = midX;
						 	refpt1["y"] = midY - (distance/referenceParts);
						 	refpt2["x"] = midX;
						 	refpt2["y"] = midY + (distance/referenceParts);
						
			  }
			  else if(line_intersects(sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y,
					  targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y,
					  sourceSet.viewBoxBoundaries.x1,sourceSet.viewBoxBoundaries.y1,
					  sourceSet.viewBoxBoundaries.x1,sourceSet.viewBoxBoundaries.y2)){
				  	  link["linePlace"] = "west";
				  	link.referneceLine["direction"] = "west";
				  	  intersectionPts1 = math.intersect([sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y], 
								[targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y], 
								[sourceSet.viewBoxBoundaries.x1,sourceSet.viewBoxBoundaries.y1], 
								[sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y2]);

					 intersectionPts2 = math.intersect([sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y], 
											[targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y], 
											[targetSet.viewBoxBoundaries.x2,targetSet.viewBoxBoundaries.y1], 
											[targetSet.viewBoxBoundaries.x2,targetSet.viewBoxBoundaries.y2]);
					 
					 distance = computeDistance(intersectionPts1[0],intersectionPts1[1],intersectionPts2[0],intersectionPts2[1]);
					 	var  midX = (intersectionPts1[0] + intersectionPts2[0])/2;
					 	var  midY = (intersectionPts1[1] + intersectionPts2[1])/2;
					 	refpt2["x"] = midX - (distance/10);
					 	refpt2["y"] = midY;
					 	refpt1["x"] = midX + (distance/10);
					 	refpt1["y"] = midY;
				  	  
			  }
			  else if(line_intersects(sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y,
					  targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y,
					  sourceSet.viewBoxBoundaries.x1,sourceSet.viewBoxBoundaries.y1,
					  sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y1)){
				  	  link["linePlace"] = "north";
				  	  link.referneceLine["direction"] = "north";
				  	  intersectionPts1 = math.intersect([sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y], 
								[targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y], 
								[sourceSet.viewBoxBoundaries.x1,sourceSet.viewBoxBoundaries.y1], 
								[sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y1]);

					 intersectionPts2 = math.intersect([sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y], 
											[targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y], 
											[targetSet.viewBoxBoundaries.x1,targetSet.viewBoxBoundaries.y2], 
											[targetSet.viewBoxBoundaries.x2,targetSet.viewBoxBoundaries.y2]);
					 
					 distance = computeDistance(intersectionPts1[0],intersectionPts1[1],intersectionPts2[0],intersectionPts2[1]);
					 	var  midX = (intersectionPts1[0] + intersectionPts2[0])/2;
					 	var  midY = (intersectionPts1[1] + intersectionPts2[1])/2;
					 	refpt2["x"] = midX;
					 	refpt2["y"] = midY - (distance/10);
					 	refpt1["x"] = midX;
					 	refpt1["y"] = midY + (distance/10);
			  }
			 
			 var targetSubSets = targetSet.subSets;
			 
			 sourceSubSets.forEach(function(subSet){
				 var id = subSet.id;
				 var subSetsize = subSet.setSize;
				 if(isSubSetPresent(id,targetSubSets) && linkedSubsets.indexOf(id) == -1 && subSet.coOrdinates ){
					 links.push({"id":id, "setSize":subSetsize, "array": [subSet.viewBoxMid],"hullPoints":[subSet.ViewBoxhullPoints],"referenceLines" :link.referneceLine, "position": intersectionSize * linkThicknessFactor,"sourceSetId" : sourceSet.id });
					 intersectionSize = intersectionSize + subSetsize;
					 linkedSubsets.push(id);
				 }
			 });
			 targetSubSets.forEach(function(subSet){
				 var id = subSet.id;
					 for (var index = 0; index < links.length; index++) {
						if(links[index].id == id){
							links[index].array.push(subSet.viewBoxMid);
							links[index].hullPoints.push(subSet.ViewBoxhullPoints);
							links[index]["targetSetId"] = targetSet.id;
							linkedSubsets.push(id);
							break;
						}
					}
			 });
			 
			 link["links"] = links;
			 intersectionSize = intersectionSize * linkThicknessFactor;
			 link["intersectionSize"] = intersectionSize;
			 
			 if(link["linePlace"] == "east" || link["linePlace"] == "west"){
				 link.referneceLine["x1"] = refpt1.x;
				 link.referneceLine["y1"] = refpt1.y - (intersectionSize/2);
				 link.referneceLine["x2"] = refpt1.x;
				 link.referneceLine["y2"] = refpt1.y + (intersectionSize/2);
				 link.referneceLine["x3"] = refpt2.x;
				 link.referneceLine["y3"] = refpt2.y - (intersectionSize/2);
				 link.referneceLine["x4"] = refpt2.x;
				 link.referneceLine["y4"] = refpt2.y + (intersectionSize/2);
			 }
			 if(link["linePlace"] == "south" || link["linePlace"] == "north"){
				 link.referneceLine["x1"] = refpt1.x - (intersectionSize/2);
				 link.referneceLine["y1"] = refpt1.y;
				 link.referneceLine["x2"] = refpt1.x + (intersectionSize/2);
				 link.referneceLine["y2"] = refpt1.y ;
				 link.referneceLine["x3"] = refpt2.x - (intersectionSize/2);
				 link.referneceLine["y3"] = refpt2.y;
				 link.referneceLine["x4"] = refpt2.x  + (intersectionSize/2);
				 link.referneceLine["y4"] = refpt2.y;
			 }
			 edges.push(link);
		}
	}
}

function drawsubGroupLink(subGroup){
	
	subGroup.subGroups.sort(sortSubGroupsLinksOnX);
	
	var returnValue = "";
	
	var curvature = .5;
	var x0,x1,xi,xj,xk,x2,x3,y0,y1,y2,y3;	
						  
	/*x0 = subGroup.subGroups[0].viewBoxMid.x;
	y0 = subGroup.subGroups[0].viewBoxMid.y;
						
	u0 = subGroup.subGroups[1].viewBoxMid.x;
	v0 = subGroup.subGroups[1].viewBoxMid.y;
	
	//if(element.direction == "east" || element.direction == "west"){
		xi = d3.interpolateNumber(x0, u0);
		xj = xi(curvature);
		xk = xi(1 - curvature);
		
		returnValue =  "M" + x0 + "," + y0
        + "C" + xj + "," + y0
        + " " + xk + "," + v0
        + " " + u0 + "," + v0;	
		
	//}
*/		
	for(var i=1; i < subGroup.subGroups.length; i ++){
		
		x0 = subGroup.subGroups[i-1].viewBoxMid.x;
		y0 = subGroup.subGroups[i-1].viewBoxMid.y;
							
		u0 = subGroup.subGroups[i].viewBoxMid.x;
		v0 = subGroup.subGroups[i].viewBoxMid.y;
		
			xi = d3.interpolateNumber(x0, u0);
			xj = xi(curvature);
			xk = xi(1 - curvature);
			
			returnValue =  returnValue + "M" + x0 + "," + y0
	        + "C" + xj + "," + y0
	        + " " + xk + "," + v0
	        + " " + u0 + "," + v0;	
		
	}
						
/*	if(element.direction == "south" || element.direction == "north"){
		xi = d3.interpolateNumber(y0, v0),
		xj = xi(curvature),
		xk = xi(1 - curvature);

		returnValue =  "M" + x0 + "," + y0
           + "C" + x0 + "," + xj
           + " " + u0 + "," + xk
           + " " + u0 + "," + v0;	
	}*/

/*	var dx = (map.latLngToLayerPoint(lanlogArray[0]).x - map.latLngToLayerPoint(lanlogArray[1]).x),
		dy = (map.latLngToLayerPoint(lanlogArray[0]).y - map.latLngToLayerPoint(lanlogArray[1]).y),
		dr = Math.sqrt(dx * dx + dy * dy);
	
	returnValue = "M" + map.latLngToLayerPoint(lanlogArray[0]).x + "," + map.latLngToLayerPoint(lanlogArray[0]).y + 
					"A" + dr + "," + dr + " 0 0,1 " + 
					map.latLngToLayerPoint(lanlogArray[1]).x + "," + map.latLngToLayerPoint(lanlogArray[1]).y;
	
	for(var i=2; i<lanlogArray.length; i++){
		var dx = (map.latLngToLayerPoint(lanlogArray[i-1]).x - map.latLngToLayerPoint(lanlogArray[i]).x),
			dy = (map.latLngToLayerPoint(lanlogArray[i-1]).y - map.latLngToLayerPoint(lanlogArray[i]).y),
			dr = Math.sqrt(dx * dx + dy * dy);
		
		var originCoordinates = "M" + map.latLngToLayerPoint(lanlogArray[i-1]).x + "," + map.latLngToLayerPoint(lanlogArray[i-1]).y;
		var newPath = "A" + dr + "," + dr + " 0 0,1 " +
		map.latLngToLayerPoint(lanlogArray[i]).x + "," + map.latLngToLayerPoint(lanlogArray[i]).y;
		returnValue = returnValue + newPath;
	}*/
		
		//console.log(returnValue);
	return returnValue;
}


function singleSanKeyCurve(element){
	
	var returnValue = "";
				
	var curvature = .5;
	var x0,x1,xi,xj,xk,x2,x3,y0,y1,y2,y3;	
	var pt;
	var pt2;
						  
	x0 = element.array[0].x;
	y0 = element.array[0].y;
						
	u0 = element.array[1].x;
	v0 = element.array[1].y;
	
	if(element.direction == "east" || element.direction == "west"){
		xi = d3.interpolateNumber(x0, u0);
		xj = xi(curvature);
		xk = xi(1 - curvature);
		
		returnValue =  "M" + x0 + "," + y0
        + "C" + xj + "," + y0
        + " " + xk + "," + v0
        + " " + u0 + "," + v0;	
		
	}
						
	if(element.direction == "south" || element.direction == "north"){
		xi = d3.interpolateNumber(y0, v0),
		xj = xi(curvature),
		xk = xi(1 - curvature);

		returnValue =  "M" + x0 + "," + y0
           + "C" + x0 + "," + xj
           + " " + u0 + "," + xk
           + " " + u0 + "," + v0;	
	}

	return returnValue;
}

function updateSet(set){
	
	var subGroups = set.subSets;
	
	 subGroups.forEach(function(subSet){
		  if(subSet.coOrdinates){
			  
			  subSet["xTransalate"] = set.xTransalate ;
			  subSet["yTransalate"] = set.yTransalate ;
			  subSet.viewBoxBoarder = [];
			  for(var k = 0; k < subSet.processedBoarderPoints.length; k++){
				  var newX = ((subSet.processedBoarderPoints[k].x)) + subSet.xTransalate ;
				  var newY = ((subSet.processedBoarderPoints[k].y)) + subSet.yTransalate;
				  subSet.viewBoxBoarder.push(point(newX,newY));
			  }
			  
			  subSet.viewBoxMid["x"] = subSet.midPoint.x + subSet.xTransalate;
			  subSet.viewBoxMid["y"] = subSet.midPoint.y + subSet.yTransalate;
		  }
	 });
	
	 var outerBoundaries = computeSetBoundaries(set.groupBoundaries);
	 set["boundaries"] = outerBoundaries;
	 
	 
	 var viewBoxBoundaries = {};
	 set.viewBoxBoundaries.x1 = set.boundaries.x1 + set.xTransalate;
	 set.viewBoxBoundaries.x2 = set.boundaries.x2 + set.xTransalate;
	 set.viewBoxBoundaries.y1 = set.boundaries.y1 + set.yTransalate;
	 set.viewBoxBoundaries.y2 = set.boundaries.y2 + set.yTransalate;
	  
	  set.viewBoxCenter.x = (set.viewBoxBoundaries.x1 + set.viewBoxBoundaries.x2)/2;
	  set.viewBoxCenter.y = (set.viewBoxBoundaries.y1 + set.viewBoxBoundaries.y2)/2;
}

function updateEdge(set){
	var setId = set.id;
	edges.forEach(function(edge){
		if(edge.sourceSet.id == setId || edge.targetSet.id == setId ){
			var sourceSet = edge.sourceSet;
			var targetSet = edge.targetSet;
			var refpt1 ={};
			var refpt2 = {};
			 if(line_intersects(sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y,
					  targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y,
					  sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y1,
					  sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y2)){
				 edge["linePlace"] = "east";
				 edge.referneceLine["direction"] = "east";
				 	   intersectionPts1 = math.intersect([sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y], 
				 			  								[targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y], 
				 			  								[sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y1], 
				 			  								[sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y2]);
				 	  
				 	   intersectionPts2 = math.intersect([sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y], 
			 									[targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y], 
				  								[targetSet.viewBoxBoundaries.x1,targetSet.viewBoxBoundaries.y1], 
				  								[targetSet.viewBoxBoundaries.x1,targetSet.viewBoxBoundaries.y2]);
				 	   
				 	distance = computeDistance(intersectionPts1[0],intersectionPts1[1],intersectionPts2[0],intersectionPts2[1]);
				 	var  midX = (intersectionPts1[0] + intersectionPts2[0])/2;
				 	var  midY = (intersectionPts1[1] + intersectionPts2[1])/2;
				 	
				 	refpt1["x"] = midX - (distance/referenceParts);
				 	refpt1["y"] = midY;
				 	refpt2["x"] = midX + (distance/referenceParts);
				 	refpt2["y"] = midY;
			  }
			  else if(line_intersects(sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y,
					  targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y,
					  sourceSet.viewBoxBoundaries.x1,sourceSet.viewBoxBoundaries.y2,
					  sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y2)){
				  	  edge["linePlace"] = "south";
				  	  edge.referneceLine["direction"] = "south";
				       intersectionPts1 = math.intersect([sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y], 
								[targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y], 
								[sourceSet.viewBoxBoundaries.x1,sourceSet.viewBoxBoundaries.y2], 
								[sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y2]);

						 intersectionPts2 = math.intersect([sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y], 
											[targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y], 
											[targetSet.viewBoxBoundaries.x1,targetSet.viewBoxBoundaries.y1], 
											[targetSet.viewBoxBoundaries.x2,targetSet.viewBoxBoundaries.y1]);
						 
						 distance = computeDistance(intersectionPts1[0],intersectionPts1[1],intersectionPts2[0],intersectionPts2[1]);
						 	var  midX = (intersectionPts1[0] + intersectionPts2[0])/2;
						 	var  midY = (intersectionPts1[1] + intersectionPts2[1])/2;
						 	refpt1["x"] = midX;
						 	refpt1["y"] = midY - (distance/referenceParts);
						 	refpt2["x"] = midX;
						 	refpt2["y"] = midY + (distance/referenceParts);
						
			  }
			  else if(line_intersects(sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y,
					  targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y,
					  sourceSet.viewBoxBoundaries.x1,sourceSet.viewBoxBoundaries.y1,
					  sourceSet.viewBoxBoundaries.x1,sourceSet.viewBoxBoundaries.y2)){
				  edge["linePlace"] = "west";
				  edge.referneceLine["direction"] = "west";
				  	  intersectionPts1 = math.intersect([sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y], 
								[targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y], 
								[sourceSet.viewBoxBoundaries.x1,sourceSet.viewBoxBoundaries.y1], 
								[sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y2]);

					 intersectionPts2 = math.intersect([sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y], 
											[targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y], 
											[targetSet.viewBoxBoundaries.x2,targetSet.viewBoxBoundaries.y1], 
											[targetSet.viewBoxBoundaries.x2,targetSet.viewBoxBoundaries.y2]);
					 
					 distance = computeDistance(intersectionPts1[0],intersectionPts1[1],intersectionPts2[0],intersectionPts2[1]);
					 	var  midX = (intersectionPts1[0] + intersectionPts2[0])/2;
					 	var  midY = (intersectionPts1[1] + intersectionPts2[1])/2;
					 	refpt2["x"] = midX - (distance/referenceParts);
					 	refpt2["y"] = midY;
					 	refpt1["x"] = midX + (distance/referenceParts);
					 	refpt1["y"] = midY;
				  	  
			  }
			  else if(line_intersects(sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y,
					  targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y,
					  sourceSet.viewBoxBoundaries.x1,sourceSet.viewBoxBoundaries.y1,
					  sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y1)){
				  edge["linePlace"] = "north";
				  edge.referneceLine["direction"] = "north";
				  	  intersectionPts1 = math.intersect([sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y], 
								[targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y], 
								[sourceSet.viewBoxBoundaries.x1,sourceSet.viewBoxBoundaries.y1], 
								[sourceSet.viewBoxBoundaries.x2,sourceSet.viewBoxBoundaries.y1]);

					 intersectionPts2 = math.intersect([sourceSet.viewBoxCenter.x,sourceSet.viewBoxCenter.y], 
											[targetSet.viewBoxCenter.x,targetSet.viewBoxCenter.y], 
											[targetSet.viewBoxBoundaries.x1,targetSet.viewBoxBoundaries.y2], 
											[targetSet.viewBoxBoundaries.x2,targetSet.viewBoxBoundaries.y2]);
					 
					 distance = computeDistance(intersectionPts1[0],intersectionPts1[1],intersectionPts2[0],intersectionPts2[1]);
					 	var  midX = (intersectionPts1[0] + intersectionPts2[0])/2;
					 	var  midY = (intersectionPts1[1] + intersectionPts2[1])/2;
					 	refpt2["x"] = midX;
					 	refpt2["y"] = midY - (distance/referenceParts);
					 	refpt1["x"] = midX;
					 	refpt1["y"] = midY + (distance/referenceParts);
			  }
			 if(edge["linePlace"] == "east" || edge["linePlace"] == "west"){
				 edge.referneceLine["x1"] = refpt1.x;
				 edge.referneceLine["y1"] = refpt1.y - (edge.intersectionSize/2);
				 edge.referneceLine["x2"] = refpt1.x;
				 edge.referneceLine["y2"] = refpt1.y + (edge.intersectionSize/2);
				 edge.referneceLine["x3"] = refpt2.x;
				 edge.referneceLine["y3"] = refpt2.y - (edge.intersectionSize/2);
				 edge.referneceLine["x4"] = refpt2.x;
				 edge.referneceLine["y4"] = refpt2.y + (edge.intersectionSize/2);
			 }
			 if(edge["linePlace"] == "south" || edge["linePlace"] == "north"){
				 edge.referneceLine["x1"] = refpt1.x - (edge.intersectionSize/2);
				 edge.referneceLine["y1"] = refpt1.y;
				 edge.referneceLine["x2"] = refpt1.x + (edge.intersectionSize/2);
				 edge.referneceLine["y2"] = refpt1.y ;
				 edge.referneceLine["x3"] = refpt2.x - (edge.intersectionSize/2);
				 edge.referneceLine["y3"] = refpt2.y;
				 edge.referneceLine["x4"] = refpt2.x  + (edge.intersectionSize/2);
				 edge.referneceLine["y4"] = refpt2.y;
			 }
		}
	});
}

function computeSingleClipPath(link){
	
	var clip_paths = [];
	var subj_paths = [];
	
	subj_paths.push(getSingleLinkBoxPoints(link.array,link.setSize));
	//console.log(subj_paths);
	
	for(var i=0; i < link.boarder.length; i++){
		clip_paths.push(getSubsetBoarderPoints(link.boarder[i]));
	}
	//console.log(clip_paths);
	var cpr = new ClipperLib.Clipper();

	var scale = 1;
	ClipperLib.JS.ScaleUpPaths(subj_paths, scale);
	ClipperLib.JS.ScaleUpPaths(clip_paths, scale);

	cpr.AddPaths(clip_paths, ClipperLib.PolyType.ptClip, true);
	cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);  // true means closed path

	var solution_paths = new ClipperLib.Paths();
	var succeeded = cpr.Execute(ClipperLib.ClipType.ctDifference, solution_paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
	return Clippaths2string(solution_paths);
}

function computeNewSingleClipPath(link){
	
	var clip_paths = [];
	var subj_paths = [];
	
	subj_paths.push(getSingleLinkBoxPoints(link.subGroups,link.size));
	//console.log(subj_paths);
	
	for(var i = 0; i < link.subGroups.length; i++ ){
			clip_paths.push(getSubsetBoarderPoints(link.subGroups[i].viewBoxBoarder));
	}
	
	/*for(var i=0; i < link.boarder.length; i++){
		clip_paths.push(getSubsetBoarderPoints(link.boarder[i]));
	}*/
	var cpr = new ClipperLib.Clipper();

	var scale = 1;
	ClipperLib.JS.ScaleUpPaths(subj_paths, scale);
	ClipperLib.JS.ScaleUpPaths(clip_paths, scale);

	cpr.AddPaths(clip_paths, ClipperLib.PolyType.ptClip, true);
	cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);  // true means closed path

	var solution_paths = new ClipperLib.Paths();
	var succeeded = cpr.Execute(ClipperLib.ClipType.ctDifference, solution_paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
	return Clippaths2string(solution_paths);
}

function getSingleLinkBoxPoints(subGroups, setSize){
	var points = [];
	var leftMost, rightMost, topMost, bottomMost;
	var x1 = subGroups[0].viewBoxMid.x - (setSize * linkThicknessFactor);
	var y1 = subGroups[0].viewBoxMid.y - (setSize * linkThicknessFactor);
	var x2 = subGroups[0].viewBoxMid.x + (setSize * linkThicknessFactor);
	var y2 = subGroups[0].viewBoxMid.y + (setSize * linkThicknessFactor);
	var x3 = subGroups[1].viewBoxMid.x - (setSize * linkThicknessFactor);
	var y3 = subGroups[1].viewBoxMid.y - (setSize * linkThicknessFactor);
	var x4 = subGroups[1].viewBoxMid.x + (setSize * linkThicknessFactor);
	var y4 = subGroups[1].viewBoxMid.y + (setSize * linkThicknessFactor);
	
	leftMost = Math.min(x1,x2,x3,x4);
    rightMost = Math.max(x1,x2,x3,x4);    
    topMost = Math.min(y1,y2,y3,y4);
    bottomMost = Math.max(y1,y2,y3,y4);
	    
	
	points.push(bigPoint(leftMost,topMost));
	points.push(bigPoint(rightMost,topMost));
	points.push(bigPoint(rightMost,bottomMost));
	points.push(bigPoint(leftMost,bottomMost));
	return points;
}
	 
function computeClipPath(link){
	
	var clip_paths = [];
	var subj_paths = [];
	
	subj_paths.push(getLinkBoxPoints(link.array,link.referenceLines,link.setSize));
	
	
	for(var i=0; i < link.hullPoints.length; i++){
		clip_paths.push(getSubSetPoints(link.hullPoints[i]));
	}
	
	var cpr = new ClipperLib.Clipper();

	var scale = 1;
	ClipperLib.JS.ScaleUpPaths(subj_paths, scale);
	ClipperLib.JS.ScaleUpPaths(clip_paths, scale);

	cpr.AddPaths(clip_paths, ClipperLib.PolyType.ptClip, true);
	cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);  // true means closed path

	var solution_paths = new ClipperLib.Paths();
	var succeeded = cpr.Execute(ClipperLib.ClipType.ctDifference, solution_paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
	return Clippaths2string(solution_paths);
}

function getLinkBoxPoints(linkArray, referenceLines, setSize){
	var points = [];
	var leftMost, rightMost, topMost, bottomMost;
	var x1 = linkArray[0].x - (setSize * linkThicknessFactor);
	var y1 = linkArray[0].y - (setSize * linkThicknessFactor);
	var x2 = linkArray[0].x + (setSize * linkThicknessFactor);
	var y2 = linkArray[0].y + (setSize * linkThicknessFactor);
	var x3 = linkArray[1].x - (setSize * linkThicknessFactor);
	var y3 = linkArray[1].y - (setSize * linkThicknessFactor);
	var x4 = linkArray[1].x + (setSize * linkThicknessFactor);
	var y4 = linkArray[1].y + (setSize * linkThicknessFactor);
	var refx1 = referenceLines.x1;
	var refx2 = referenceLines.x2;
	var refx3 = referenceLines.x3;
	var refx4 = referenceLines.x4;
	var refy1 = referenceLines.y1;
	var refy2 = referenceLines.y2;
	var refy3 = referenceLines.y3;
	var refy4 = referenceLines.y4;
	
	
	leftMost = Math.min(x1,x2,x3,x4,refx1,refx2,refx3,refx4);
    rightMost = Math.max(x1,x2,x3,x4,refx1,refx2,refx3,refx4);    
    topMost = Math.min(y1,y2,y3,y4,refy1,refy2,refy3,refy4);
    bottomMost = Math.max(y1,y2,y3,y4,refy1,refy2,refy3,refy4);
	    
	
	points.push(bigPoint(leftMost,topMost));
	points.push(bigPoint(rightMost,topMost));
	points.push(bigPoint(rightMost,bottomMost));
	points.push(bigPoint(leftMost,bottomMost));
	return points;
}

function getSubsetBoarderPoints(boarderPoints){
	var points = [];
	for(var i=0; i<boarderPoints.length; i++){
		//console.log(boarderPoints[i]);
		//console.log(bigPoint(boarderPoints[i].x,boarderPoints[i].y));
		points.push(bigPoint(boarderPoints[i].x,boarderPoints[i].y));
	}
	
	return points;
}

function getSubGroupBoarderPoints(point){
	return bigPoint(boarderPoints[i].x,boarderPoints[i].y)
}

function getSubSetPoints(hullPoints){
	var points = [];
	for(var i=0; i<hullPoints.length-1; i++){
		points.push(bigPoint((hullPoints[i][0] - boarderPadding),hullPoints[i][1] - boarderPadding));
	}
	
	return points;
}

function getSimilarityPath(x1,y1,x2,y2){
	
	var returnValue = "";
	
	var curvature = .5;
	var xi,xj,xk;	
	
	
	xi = d3.interpolateNumber(x1, x2);
	xj = xi(curvature);
	xk = xi(1 - curvature);
	
	returnValue =  "M" + x1 + "," + y1
    + "C" + xj + "," + y1
    + " " + xk + "," + y2
    + " " + x2 + "," + y2;	
	
	return returnValue;
}