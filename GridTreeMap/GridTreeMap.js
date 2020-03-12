var gridTreeMap = {};
(function() {
	 "use strict";
	 gridTreeMap.generate = function(){
		 
		 var RIGHT = true;
		 var LEFT = false;
		
		 var DOWN = true;
		 var UP = false;
		 
		 var SPLIT = true;
		 var SLICE = false;
		 
		 var layout = SPLIT;
		 
		 /*var splitDirection = RIGHT;
		 var sliceDirection = DOWN;*/
		 
		 var numRows;
		 var numCols;
		 var idGrid =[];
		 var nextList;
		 var idList = [];
		 var treeName;
		 
		 function point(x,y){
			 var pt = {};
			 pt["x"] = x;
			 pt["y"] = y;			 
			 return pt;
		 }
		 
		 function draw(data,tree){
			 
			 treeName = tree;
			 var area = sumMultidimensionalArray(data);
			 numRows  = Math.ceil(Math.sqrt(area));
			 
			/* //To manintain the number of rows always a odd number
			 if(numRows%2 != 1){
				 numRows = numRows - 1;
			 }*/
			 numCols  = Math.ceil(area / numRows);
			 
			 data["rows"] = numRows;
			 data["cols"] = numCols;

			 for (var i=0; i<numRows; i++) {
				 idGrid[i] = [];
				 for (var j=0; j<numCols; j++) {
					 idGrid[i][j] = { "parent" : "0"};
				 }
			 }		
			 
			 gridTreeMapMultiDimensional("0", data, layout);
			 return [numRows,numCols];
		 }
		 
		 function gridTreeMapMultiDimensional(parent, data, fillLayout){	
			 var layout = fillLayout;
			 var mergeddata = [];
			 if(isArray(data[0])) { // if we've got more dimensions of depth
				for(var i=0; i<data.length; i++) {
				    mergeddata[i] = sumMultidimensionalArray(data[i]);
				}
			 	
              gridTreeSingleDimensional(parent,mergeddata,layout,false);
              
               layout = !layout
              
			 for(var i=0; i<data.length;i++){
				   gridTreeMapMultiDimensional(parent+""+i,data[i],layout);
			   } 
			 }
			 else{
				 gridTreeSingleDimensional(parent,data,layout,true);
			 }
			 return idList;
		 }
		 
		 function gridTreeSingleDimensional(parent,data, layout,isLeaf) {
			 var pts = [];
			 var startpt = {};
			 var i;	
			 
			 for(i=0; i<data.length; i++) {
				startpt = findStartingPoint(parent,layout);
				if(isLeaf){
					pts = fill(startpt, parent, i, Number(data[i].setSize),layout);	
				}
				else{
					pts = fill(startpt, parent, i, data[i],layout);	
				}
			    if(isLeaf){
			    	if(treeName == "subsetTree"){
			    		data[i]["coOrdinates"] = pts;
			    	}
			    	if(treeName == "degreeTree"){
			    		data[i]["degreeCoOrdinates"] = pts;
			    	}
			    	if(treeName == "setTree"){
			    		data[i]["setcoOrdinates"] = pts;
			    	}
			    	idList.push(pts);
			    }
			 }
		 }
		
		function findStartingPoint(parent,layout){
			var direction = true;
			var startPt = {};
			var row, col;
			if(layout == SLICE){	
				endloop:
					for(col=0;col<numCols;col++){
						if(direction == DOWN){
							for(row=0;row<numRows;row++){							
								if(idGrid[row][col]["parent"] == parent){
									startPt = point(col,row);
									startPt["direction"] = direction
									break endloop;
								}
							}
						}
						else{
							for(row=numRows-1;row>-1;row--){					
								if(idGrid[row][col]["parent"] == parent){
									startPt = point(col,row);
									startPt["direction"] = direction
									break endloop;
								}
							}
						}
						direction = !direction;
					}
				}
			else{	
				endloop:
					for(row=0;row<numRows;row++){
						if(direction == RIGHT){
							for(col=0;col<numCols;col++){							
								if(idGrid[row][col]["parent"] == parent){
									startPt = point(col,row);
									startPt["direction"] = direction
									break endloop;
								}
							}
						}
						else{
							for(col=numCols-1;col>-1;col--){					
								if(idGrid[row][col]["parent"] == parent){
									startPt = point(col,row);
									startPt["direction"] = direction
									break endloop;
								}
							}
						}
						direction = !direction;
					}
			}
			return startPt;			
		}
		function fill(startpt, parent, id, size,layout) {
			var row, col;
			var pt = {};
			var pts = [];
			var direction = startpt.direction

			if(layout == SLICE){				
				endloop:
					for(col=startpt.x;col<numCols;col++){
						if(direction == DOWN){
							for(row=startpt.y;row<numRows;row++){							
								if(idGrid[row][col]["parent"] == parent){
									idGrid[row][col]["parent"] = parent + "" + id;
									size--;
							    	pts[size] = point(col,row);	
							    	if(size == 0){
										break endloop;
							    	}
								}
							}
							startpt["y"] = numRows-1;
						}
						else{
							for(row=startpt.y;row>-1;row--){					
								if(idGrid[row][col]["parent"] == parent){
									idGrid[row][col]["parent"] = parent + "" + id;
									size--;
							    	pts[size] = point(col,row);
							    	if(size == 0){
										break endloop;
							    	}
							    								    	
								}
							}
							startpt["y"] = 0;
						}
						direction = !direction;
					}
				}
			else{				
				endloop:
				for(row=startpt.y;row<numRows;row++){
					if(direction == RIGHT){
						for(col=startpt.x;col<numCols;col++){							
							if(idGrid[row][col]["parent"] == parent){
								idGrid[row][col]["parent"] = parent + "" + id;
								size--;
						    	pts[size] = point(col,row);	
						    	if(size == 0){
									break endloop;
						    	}
							}
						}
						startpt["x"] = numCols -1;
					}
					else{
						for(col=startpt.x;col>-1;col--){					
							if(idGrid[row][col]["parent"] == parent){
								idGrid[row][col]["parent"] = parent + "" + id;
								size--;
						    	pts[size] = point(col,row);
						    	if(size == 0){
									break endloop;
						    	}							    								    	
							}
						}
						startpt["x"] = 0;
					}
					direction = !direction;
				}
			}
			return pts;
		}

		// isArray - checks if arr is an array
		function isArray(arr) {
		    return arr && arr.constructor === Array; 
		}
		
		// sumArray - sums a single dimensional array 
		function sumArray(arr) {
		    var sum = 0;
		    var i;
		
		    for (i = 0; i < arr.length; i++) {
		        sum += arr[i].setSize;
		    }
		    return sum;
		}
		
		// sumMultidimensionalArray - sums the values in a nested array (aka [[0,1],[[2,3]]])
		function sumMultidimensionalArray(arr) {
		    var i, total = 0;
		
		    if(isArray(arr[0])) {
		        for(i=0; i<arr.length; i++) {
		            total += sumMultidimensionalArray(arr[i]);
		        }
		    } else {
		        total = sumArray(arr);
		    }
		    return total;
		}
		return draw; 
	 }();
})();