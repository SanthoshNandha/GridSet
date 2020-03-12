function computeBoundaries(coOrdinates){
	  var x1 = d3.min(coOrdinates, function(d) { return (side + padding) * d.x; });
	  var x2 = d3.max(coOrdinates, function(d) { return (side + padding) * d.x; });
	  var y1 = d3.min(coOrdinates, function(d) { return (side + padding) * d.y; });
	  var y2 = d3.max(coOrdinates, function(d) { return (side + padding) * d.y; });
	  
	  var boundaries = {};
	  boundaries["x1"] = x1;
	  boundaries["x2"] = x2 + side;
	  boundaries["y1"] = y1;
	  boundaries["y2"] = y2 + side;
	  
	  return boundaries;
	  
  }
 
 function computeRowCol(coOrdinates){
	  var x1 = d3.min(coOrdinates, function(d) { return  d.x; });
	  var x2 = d3.max(coOrdinates, function(d) { return  d.x; });
	  var y1 = d3.min(coOrdinates, function(d) { return  d.y; });
	  var y2 = d3.max(coOrdinates, function(d) { return  d.y; });
	  
	  var boundaries = {};
	  boundaries["x1"] = x1;
	  boundaries["x2"] = x2 + 1;
	  boundaries["y1"] = y1;
	  boundaries["y2"] = y2 + 1;
	  
	  return boundaries;
	  
 }
 
 function computeDistance(x1,y1,x2,y2){
	 return  Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
 }
 
 function computeSetBoundaries(groupBoundaries){
	  
	  var x1 = d3.min(groupBoundaries, function(d) { return d.x1; });
	  var x2 = d3.max(groupBoundaries, function(d) { return d.x2; });
	  var y1 = d3.min(groupBoundaries, function(d) { return d.y1; });
	  var y2 = d3.max(groupBoundaries, function(d) { return d.y2; });
	  
	  var boundaries = {};
	  boundaries["x1"] = x1 - (setBoarderSize * (side + padding));
	  boundaries["x2"] = x2 + (setBoarderSize * (side + padding));
	  boundaries["y1"] = y1 - (setBoarderSize * (side + padding));
	  boundaries["y2"] = y2 + (setBoarderSize * (side + padding));
	  
	  return boundaries;
}
 
 function line_intersects(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {

    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;
    s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;
    s2_y = p3_y - p2_y;

    var s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        // Collision detected
        return true;
    }

    return false; // No collision
}
 
 function computePointOnLine(x1,y1,x2,y2,Ptdistance){
	  
	  var distance = Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
	  
	  var rt = Ptdistance / distance;
	  
	  var ptx = ((1 - rt)*x1) + (rt * x2);
	  var pty = ((1 - rt)*y1) + (rt * y2);
	  
	  var point  = {};
	  
	  point["x"] = ptx;
	  point["y"] = pty;
	  
	  return point;
	  
 } 
 function exists(obj, objs)
 {
     var objStr = JSON.stringify(obj);

     for(var i=0;i<objs.length; i++)
     {
         if(JSON.stringify(objs[i]) == objStr)
         {
             return true;
         }
     }

     return false;
 }
 
 function points2path(points) {
		  var svgpath = "", i;
		  for(i = 0; i < points.length; i++) {
		      if (i == 0) svgpath += "M";
		      else svgpath += "L";
		      svgpath += ((points[i][0]) * (side + padding)- boarderPadding)  + ", " + ((points[i][1]) * (side + padding) - boarderPadding);
		  }
		  svgpath += "Z";
		  if (svgpath=="") svgpath = "M0,0";
		  return svgpath;
}
 
 function processSubGroupBoarderPoints(points){
	 var lastPoint = null;
	 var processBoarderPoints = [];
	 var x,y;
	 var point1, point2;
	 var interPoint;
	 for(i = 0; i < points.length; i++) {
	      if(points[i].position == LEFTMAX){
	    	  x = (points[i].x) * (side + padding) + (side + boarderPadding);
	    	  y = (points[i].y) * (side + padding) - (boarderPadding);
	    	  point1 = point(x,y);
	    	  point1["position"] = LEFTMAX;
	    	  point1["pointType"] = ENDPOINT;
	    	  y = (points[i].y) * (side + padding) + (side + boarderPadding);
	    	  point2 = point(x,y);
	    	  point2["position"] = LEFTMAX;
	    	  point2["pointType"] = ENDPOINT;
	    	  if(lastPoint != null){
	    		  if(!checkIfOnLine(lastPoint,point1)){
		    		  if(point1.x > lastPoint.x){
		    			  interPoint = point(lastPoint.x,point1.y) 
		    		  }
		    		  else{
		    			  interPoint = point(point1.x,lastPoint.y) 
		    		  }
		    		  interPoint["position"] = LEFTMAX;
		    		  interPoint["pointType"] = INTERPOINT;
		    		  processBoarderPoints.push(interPoint);
		    	  }
		      }
		  }
	      if(points[i].position == RIGHTMIN){
	    	  x = (points[i].x) * (side + padding)- (boarderPadding);
	    	  y = (points[i].y) * (side + padding) + (side + boarderPadding);
	    	  point1 = point(x,y);
	    	  point1["position"] = RIGHTMIN;
	    	  point1["pointType"] = ENDPOINT;
	    	  y = (points[i].y) * (side + padding) - (boarderPadding);
	    	  point2 = point(x,y);
	    	  point2["position"] = RIGHTMIN;
	    	  point2["pointType"] = ENDPOINT;
	    	  
	    	  if(lastPoint != null){
		    	  if(!checkIfOnLine(lastPoint,point1)){
		    		  if(point1.x < lastPoint.x ){
		    			  interPoint = point( lastPoint.x,point1.y); 
		    		  }
		    		  if(point1.x > lastPoint.x ){
		    			  interPoint = point( point1.x,lastPoint.y); 
		    		  }
		    		  interPoint["position"] = RIGHTMIN;
		    		  interPoint["pointType"] = INTERPOINT;
		    		 processBoarderPoints.push(interPoint);
		    	  }
		      }
	      }
	      processBoarderPoints.push(point1);
	      processBoarderPoints.push(point2);
	      lastPoint = point2;
	  }
	 return processBoarderPoints;
 }
 
 function checkIfOnLine(lastPoint, currentPoint){
	 if(lastPoint.x == currentPoint.x || lastPoint.y == currentPoint.y ){
		 return true
	 }
	 return false;
 }
 
 function processedBoarderPoints2path(points){
	 var svgpath = "", i;
	  for(i = 0; i < points.length; i++) {
	      if (i == 0) svgpath += "M";
	      else svgpath += "L";
	      svgpath += (points[i].x  + ", " + points[i].y);
	      
	  }
	  
	  svgpath += "Z";
	  if (svgpath=="") svgpath = "M0,0";
	  return svgpath;
 }
 
 function processedBoarderPoints2path2(points){
	 var svgpath = "", i;
	  for(i = 0; i < points.length; i++) {
	      if (i == 0) svgpath += "M ";
	      else svgpath += " L ";
	      svgpath +=  points[i].x  + " " + points[i].y;
	      
	  }
	  svgpath += " Z";
	  if (svgpath=="") svgpath = "M 0 0";
	  return svgpath;
 }
 
 function boarderPoints2path(points) {
	  var svgpath = "", i;
	  for(i = 0; i < points.length; i++) {
	      if (i == 0) svgpath += "M";
	      else svgpath += "L";
	      if(points[i].position == LEFTMAX){
			  svgpath += ((points[i].x) * (side + padding) + (side + boarderPadding))  + ", " + ((points[i].y) * (side + padding) - (boarderPadding) );
			  svgpath += "L";
			  svgpath += ((points[i].x) * (side + padding) + (side + boarderPadding))  + ", " + ((points[i].y) * (side + padding) + (side + boarderPadding));
		  }
	      if(points[i].position == RIGHTMIN){
	    	  svgpath += ((points[i].x) * (side + padding)- (boarderPadding))   + ", " + ((points[i].y) * (side + padding) + (side + boarderPadding));
	    	   svgpath += "L";
	    	  svgpath += ((points[i].x) * (side + padding)- (boarderPadding))  + ", " + ((points[i].y) * (side + padding) - (boarderPadding));
	    	  
	      }
		
	     /* if(points[i].position == TOPLEFT){
	    	  svgpath += ((points[i].x) * (side + padding)- (boarderPadding*2))  + ", " + ((points[i].y) * (side + padding) - (boarderPadding));
	      }
	      if(points[i].position == BOTTOMLEFT){
	    	  svgpath += ((points[i].x) * (side + padding)- (boarderPadding*2))  + ", " + ((points[i].y) * (side + padding) - (boarderPadding*2));
	      }
	      if(points[i].position == BOTTOMRIGHT){
	    	  svgpath += ((points[i].x) * (side + padding)- (boarderPadding))  + ", " + ((points[i].y) * (side + padding) - (boarderPadding*2));
	      }
	      if(points[i].position == TOPRIGHT){
	    	  svgpath += ((points[i].x) * (side + padding)- (boarderPadding))  + ", " + ((points[i].y) * (side + padding) - (boarderPadding));
	      }
	      if(points[i].position == RIGHTMIN){
	    	  svgpath += ((points[i].x) * (side + padding)- (boarderPadding))  + ", " + ((points[i].y) * (side + padding) - (boarderPadding));
	      }
		  if(points[i].position == LEFTMAX){
			  svgpath += ((points[i].x) * (side + padding)- (boarderPadding*2))  + ", " + ((points[i].y) * (side + padding) - (boarderPadding));
		  }*/
	     // svgpath += ((points[i].x) * (side + padding)- boarderPadding)  + ", " + ((points[i].y) * (side + padding) - boarderPadding);
	  }
	  svgpath += "Z";
	  if (svgpath=="") svgpath = "M0,0";
	  return svgpath;
}
 
 function Clippaths2string (paths, scale) {
	  var svgpath = "", i, j;
	  if (!scale) scale = 1;
	  for(i = 0; i < paths.length; i++) {
	    for(j = 0; j < paths[i].length; j++){
	      if (!j) svgpath += "M";
	      else svgpath += "L";
	      svgpath += (paths[i][j].X / scale) + ", " + (paths[i][j].Y / scale);
	    }
	    svgpath += "Z";
	  }
	  if (svgpath=="") svgpath = "M0,0";
	  return svgpath;
	}
 
 function setsXAxisSort(a,b){
	 if (a.viewBoxBoundaries.x1 > b.viewBoxBoundaries.x1) {
		    return 1;
		  }
		  if (a.viewBoxBoundaries.x1 < b.viewBoxBoundaries.x1) {
		    return -1;
		  }
		  // a must be equal to b
		  return 0;
 }
 function sortSideAsc(a,b){
	 if (a.minSide > b.minSide) {
		    return 1;
		  }
		  if (a.minSide < b.minSide) {
		    return -1;
		  }
		  // a must be equal to b
		  return 0;
 }
 
 function sortsizeDesc(a,b){
	 if (a.size > b.size) {
		    return -1;
		  }
		  if (a.size < b.size) {
		    return 1;
		  }
		  // a must be equal to b
		  return 0;
 }
 
 function sortsizeDesc(a,b){
	 if (a.size > b.size) {
		    return -1;
		  }
		  if (a.size < b.size) {
		    return 1;
		  }
		  // a must be equal to b
		  return 0;
 }
 
 function sortsizeDesc(a,b){
	 if (a.size > b.size) {
		    return -1;
		  }
		  if (a.size < b.size) {
		    return 1;
		  }
		  // a must be equal to b
		  return 0;
 }
 function sortCombinedId(a,b){
	 if (a.combinedRank > b.combinedRank) {
		    return 1;
		  }
		  if (a.combinedRank < b.combinedRank) {
		    return -1;
		  }
		  // a must be equal to b
		  return 0; 
 }
 
 function sortCoOrdinate(a,b){
	 if (a.y > b.y) {
		    return 1;
	 }
	 if (a.y < b.y) {
	    return -1;
	  }
	 // a must be equal to b
	 return 0; 
 }
 function sortCoOrdinateCols(a,b){
	 if (a.x > b.x) {
		    return 1;
	 }
	 if (a.x < b.x) {
	    return -1;
	  }
	 // a must be equal to b
	 return 0; 
 }
 
 function sortDegreeCoOrdinate(a,b){
	 if (a.degreeY > b.degreeY) {
		    return 1;
	 }
	 if (a.degreeY < b.degreeY) {
	    return -1;
	  }
	 // a must be equal to b
	 return 0; 
 }
 
 function sortDegreeCoOrdinateCols(a,b){
	 if (a.degreeX > b.degreeX) {
		    return 1;
	 }
	 if (a.degreeX < b.degreeX) {
	    return -1;
	  }
	 // a must be equal to b
	 return 0; 
 }
 
 function sortSubGroupsLinksOnX(a,b){
	 if (a.viewBoxMid.x > b.viewBoxMid.x) {
		    return 1;
	 }
	 if (a.viewBoxMid.x < b.viewBoxMid.x) {
	    return -1;
	  }
	 // a must be equal to b
	 return 0; 
 }
 
 function paths2string (paths, scale) {
	  var svgpath = "", i, j;
	  if (!scale) scale = 1;
	  for(i = 0; i < paths.length; i++) {
	    for(j = 0; j < paths[i].length; j++){
	      if (!j) svgpath += "M";
	      else svgpath += "L";
	      svgpath += (paths[i][j].X / scale) + ", " + (paths[i][j].Y / scale);
	    }
	    svgpath += "Z";
	  }
	  if (svgpath=="") svgpath = "M0,0";
	  return svgpath;
	}

function point(x,y){
	var pt = {};
	pt["x"] = x;
	pt["y"] = y;
	return  pt;
}

function bigPoint(x,y){
	var pt = {};
	pt["X"] = x;
	pt["Y"] = y;
	return  pt;
}

function isSubgroupActiveByID(subgroup){
	return ((activeSubGroups.indexOf(subgroup.id)) > -1 && (subgroup.subGroups.length > 1));
}

function isSubgroupActiveByName(subgroup){
	return ((activeSubGroups.indexOf(subgroup.subGroupName)) > -1 && (subgroup.subGroups.length > 1));
}

function isDegreeSubgroupActive(subgroup){
	return ((degreeActiveSubGroups.indexOf(subgroup.id)) > -1 && (subgroup.subGroups.length > 1));
}

function returnSubGroupByID(id){
	for(var i =0; i <subGroupsLinks.length; i++){
		if(subGroupsLinks[i].id == id)
			return subGroupsLinks[i];
	}
}

function returnSubGroupByName(name){
	for(var i =0; i <subGroupsLinks.length; i++){
		if(subGroupsLinks[i].subGroupName == name)
			return subGroupsLinks[i];
	}
}

function getRawSetIndex(elementName){
	for(var i=0; i<setNames.length; i++){
		if(elementName == setNames[i]){
			return i;
		}
	}
}

function removedFromUsedSets(setName){
	for(var i =0; i <usedSets.length; i++){
		if(usedSets[i].elementName == setName)
			usedSets.splice(i, 1);
	}
}

function addNewSet(oldSetName, NewSet){
	for(var i=(usedSets.length -1 ); i > -1; i--){
		if(usedSets[i].elementName == oldSetName){
			usedSets.splice(i,0,NewSet);
		    return;
		}
	}
}

function addToUsedSets(set1, set2){
	for(var i=0; i < sets.length; i++){
		if(sets[i].elementName == set1 || sets[i].elementName == set2){
			usedSets.push(sets[i]);
		}
	}
}

function addSettoUsedSets(set){
	for(var i=0; i < sets.length; i++){
		if(sets[i].elementName == set){
			usedSets.push(sets[i]);
			return;
		}
	}
}

function sortSubGroupElements(a, b) {
	  if (a.y < b.y) {
	    return -1;
	  }
	  else if (a.y > b.y) {
	    return 1;
	  }
	  else{
		  if(a.x < b.x){
			  return -1;
		  }
		  else if(a.x > b.x){
			  return 1;
		  }
	  }
}

function sortElementByAttr(attr,isCategory) {
    if(isCategory){
    	return function(a, b) {
            return (a[attr].hashCode()) - (b[attr].hashCode());
        }
    }
    else{
    	return function(a, b) {
            return a[attr] - b[attr];
        }
    }
	
}

function sortElementByDateAttr(attr){
	return function(a,b){
		if(a["moment_"+attr].isSameOrBefore(b["moment_"+attr])){
			return -1
		}
		else{
			return 1;
		}
	}
}

function indexOfSelectedArray(parentArray, Childarray){
	
	for(var i=0; i<parentArray.length; i++){
		if(parentArray[i][0] == Childarray[0]){
			return i;
		}
	}
	return -1;
}

function attrMinValue(array, attribute){
	return array.reduce(function(a,b){
		if(Number(a[attribute])<= Number(b[attribute]))
			return a;
		return b;
	})[attribute];
}

function attrMaxValue(array, attribute){
	return array.reduce(function(a,b){
		if(Number(a[attribute])>=Number(b[attribute]))
			return a;
		return b;
	})[attribute];
}

function dateMinValue(array, attribute){
	return array.reduce(function(a,b){
		if(a["moment_"+attribute].isBefore(b["moment_"+attribute]))
			return a;
		return b;
	})["moment_"+attribute];
}

function dateMaxValue(array, attribute){
	return array.reduce(function(a,b){
		if(a["moment_"+attribute].isAfter(b["moment_"+attribute]))
			return a;
		return b;
	})["moment_"+attribute];
}
/*function colores(n) {
	  var colores_g = ["#FFFF00", "#1CE6FF", "#FF34FF", "#FF4A46", "#008941", "#006FA6", "#A30059",
	                   "#FFDBE5", "#7A4900", "#0000A6", "#63FFAC", "#B79762", "#004D43", "#8FB0FF", "#997D87",
	                   "#5A0007", "#809693", "#FEFFE6", "#1B4400", "#4FC601", "#3B5DFF", "#4A3B53", "#FF2F80",
	                   "#61615A", "#BA0900", "#6B7900", "#00C2A0", "#FFAA92", "#FF90C9", "#B903AA", "#D16100",
	                   "#DDEFFF", "#000035", "#7B4F4B", "#A1C299", "#300018", "#0AA6D8", "#013349", "#00846F",
	                   "#372101", "#FFB500", "#C2FFED", "#A079BF", "#CC0744", "#C0B9B2", "#C2FF99", "#001E09",
	                   "#00489C", "#6F0062", "#0CBD66", "#EEC3FF", "#456D75", "#B77B68", "#7A87A1", "#788D66",
	                   "#885578", "#FAD09F", "#FF8A9A", "#D157A0", "#BEC459", "#456648", "#0086ED", "#886F4C",
	                   "#34362D", "#B4A8BD", "#00A6AA", "#452C2C", "#636375", "#A3C8C9", "#FF913F", "#938A81",
	                   "#575329", "#00FECF", "#B05B6F", "#8CD0FF", "#3B9700", "#04F757", "#C8A1A1", "#1E6E00",
	                   "#7900D7", "#A77500", "#6367A9", "#A05837", "#6B002C", "#772600", "#D790FF", "#9B9700",
	                   "#549E79", "#FFF69F", "#201625", "#72418F", "#BC23FF", "#99ADC0", "#3A2465", "#922329",
	                   "#5B4534", "#FDE8DC", "#404E55", "#0089A3", "#CB7E98", "#A4E804", "#324E72", "#6A3A4C"];
	  return colores_g[n];
	}*/

function colores(n) {
	  var colores_g = ["#38afea", "orange", "#FF34FF", "#FF4A46", "#008941", "#006FA6", "#A30059",
	                   "#FFDBE5", "#7A4900", "#0000A6", "#63FFAC", "#B79762", "#004D43", "#8FB0FF", "#997D87",
	                   "#5A0007", "#809693", "#FEFFE6", "#1B4400", "#4FC601", "#3B5DFF", "#4A3B53", "#FF2F80",
	                   "#61615A", "#BA0900", "#6B7900", "#00C2A0", "#FFAA92", "#FF90C9", "#B903AA", "#D16100",
	                   "#DDEFFF", "#000035", "#7B4F4B", "#A1C299", "#300018", "#0AA6D8", "#013349", "#00846F",
	                   "#372101", "#FFB500", "#C2FFED", "#A079BF", "#CC0744", "#C0B9B2", "#C2FF99", "#001E09",
	                   "#00489C", "#6F0062", "#0CBD66", "#EEC3FF", "#456D75", "#B77B68", "#7A87A1", "#788D66",
	                   "#885578", "#FAD09F", "#FF8A9A", "#D157A0", "#BEC459", "#456648", "#0086ED", "#886F4C",
	                   "#34362D", "#B4A8BD", "#00A6AA", "#452C2C", "#636375", "#A3C8C9", "#FF913F", "#938A81",
	                   "#575329", "#00FECF", "#B05B6F", "#8CD0FF", "#3B9700", "#04F757", "#C8A1A1", "#1E6E00",
	                   "#7900D7", "#A77500", "#6367A9", "#A05837", "#6B002C", "#772600", "#D790FF", "#9B9700",
	                   "#549E79", "#FFF69F", "#201625", "#72418F", "#BC23FF", "#99ADC0", "#3A2465", "#922329",
	                   "#5B4534", "#FDE8DC", "#404E55", "#0089A3", "#CB7E98", "#A4E804", "#324E72", "#6A3A4C"];
	  return colores_g[n];
	}

function fixThicknessFactor(mutiplier){
	for(var i=0; i<subGroupsInfo.length; i++){
		if((subGroupsInfo[i].size * linkThicknessFactor) > subGroupsInfo[i].minSide){
			linkThicknessFactor = (linkThicknessFactor * mutiplier);
			fixThicknessFactor(mutiplier - 0.05);
			break;
		}
	}
}

function generateOprSetName(set1, set2, oprSym){
	
	var firstPart;
	if(set1.isOpr){
		firstPart = "[ " + set1.SetName + " ]";
	} 
	else{
		firstPart = set1.SetName;
	}
	
	var secondPart;
	if(set2.isOpr){
		secondPart = "[ " + set2.SetName + " ]";
	}
	else{
		secondPart = set2.SetName;
	}
	
	return firstPart + " " + oprSym + " " + secondPart;
}