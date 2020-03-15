function isArray(arr) {
		    return arr && arr.constructor === Array; 
		}
function processSet(sets,layout){
	console.log("sets", sets);
	console.log("layout", layout);

	function filterZeroSets(subSet){
		return subSet.setSize != 0;
	}
	var data;
	var rowsCols
	var processedSet = [];
	for(var i=0; i < sets.length ; i++){
		var set = sets[i];
		var subSets = set.subSets.slice(0);
		subSets = subSets.filter(filterZeroSets);
		if(layout){
			sortSubSetGroups(subSets);
		} 
		else{
			sortSubSetGroups1(subSets);
		}
		
		/*for(var j=0; j < subSets.length; j++ ){
			console.log("Combined Set -- " + subSets[j].combinedSets);
		}
		console.log("/n");*/
		//console.log("subSets -- " + JSON.stringify(subSets));
		sets[i]["subSetTreeSet"] = generateTree(subSets,0,i);
		
		console.log("sets[i][\"subSetTreeSet\"] --->" );
		console.log(sets[i]["subSetTreeSet"]);
		
		console.log(subSets);
		sets[i]["subSetTree"] = generateSizeTree(subSets);
		console.log(sets[i]["subSetTree"]);
		sets[i]["degreeTree"] = generateDegreeTree(subSets);
		//console.log(sets[i]["degreeTree"]);
		//console.log("subSetTree -- " + i + " -- " + JSON.stringify(sets[i]["subSetTree"]));
//		console.log(sets[i]["subSetTree"]);
		rowsCols = gridTreeMap.generate(sets[i]["subSetTree"],"subsetTree"); 
		console.log("subSetTreeSet");
		
		sets[i]["rows"] = rowsCols[0];
		sets[i]["cols"] = rowsCols[1];
		gridTreeMap.generate(sets[i]["degreeTree"],"degreeTree"); 
//		console.log(sets[i]);
		processedSet.push(sets[i]);
		//console.log("set -- " + i + " -- " + JSON.stringify(sets[i]));
	}	
	
	return processedSet;
}
function sortSubSetGroups(subSetData){
	function sortListMonotonically(a,b){
		for (var index=0; index < a.combinedSets.length; index++){
			if(a["combinedSets"][index] < b["combinedSets"][index] ){	
				return -1;
			}
			else if(a["combinedSets"][index] > b["combinedSets"][index]){	
				return 1;
			}
		}
	};
	subSetData.sort(sortListMonotonically);
}
function sortSubSetGroups1(subSetData){
	function sortListMonotonically(a,b){
		for (var index=0; index < a.combinedSets.length; index++){
			if(a["combinedSets"][index] < b["combinedSets"][index] ){	
				return 1;
			}
			else if(a["combinedSets"][index] > b["combinedSets"][index]){	
				return -1;
			}
		}
	};
	subSetData.sort(sortListMonotonically);
}
function generateTree(parentSet, CombinedSetIndex, subSetIndex){
	
	console.log(parentSet);
	console.log(CombinedSetIndex);
	console.log(subSetIndex);
	
	if(CombinedSetIndex == subSetIndex){
		parentSet = generateTree(parentSet, CombinedSetIndex+1,subSetIndex);
		return parentSet;
	}
	else{
		if(parentSet.length == 1){		
			return parentSet;
		}	
		
		else if(parentSet.length == 2){
			var subSets = parentSet.slice(0);
			parentSet = [];
			var child;
			
			child = [];
			if(subSets[0].setSize != 0){
				child.push(subSets[0]);
				parentSet.push(child);
				child = [];
			}
			if(subSets[1].setSize != 0){
				child.push(subSets[1]);
				parentSet.push(child);
				child = [];
			}
			
			return parentSet;
		}
		else{
			var subSets = parentSet.slice(0);
			parentSet = [];
			var child;
			
			child = [];
			if(subSets[0].setSize != 0){
				child.push(subSets[0]);
			}
			for(var i=0; i < subSets.length - 1; i++){
				if(subSets[i]["combinedSets"][CombinedSetIndex] === subSets[i + 1]["combinedSets"][CombinedSetIndex]){
					if(subSets[i + 1].setSize != 0){
						child.push(subSets[i + 1]);
					}				
				}
				else{
					parentSet.push(child);
					child = [];
					if(subSets[i + 1].setSize != 0){
						child.push(subSets[i + 1]);
					}
				}
			}
			if(child.length !=0 ){
				if(child.length == subSets.length ){
					//console.log(subSets);
					//console.log(child);
					for(var j = 0; j < child.length; j++){
						parentSet.push(child[j])
					}
					parentSet = subSets.slice(0);
					
				}
				else{
					parentSet.push(child);
				}
				
			}		
			//console.log(parentSet);
			if(isArray(parentSet[0])){
				for(var i=0; i < parentSet.length; i++){
					if(isArray(parentSet[0]))
					if(parentSet[i].length != 0){
						parentSet[i] = generateTree(parentSet[i], CombinedSetIndex+1,subSetIndex);
					}
				}
			}
			else{
				parentSet = generateTree(parentSet, CombinedSetIndex+1,subSetIndex);
			}
			
			return parentSet;
		}
	}		
}

function generateDegreeTree(subsets){
	
	//console.log(subsets.length);
	
	var parentSet = [];
	var lowerChild = [];
	var upperChild = [];
	var minDegree = usedSets.length;
	var maxDegree = 0;
	
	if(subsets.length == 1){
		return subsets;
	}
	else if(subsets.length == 2){
		lowerChild = [subsets[0]];
		upperChild = [subsets[1]];
		parentSet.push(lowerChild);
		parentSet.push(upperChild);
		return parentSet;
	}
	else{
		
		for(var i=0; i<subsets.length; i++){
			var subSetDegree = subsets[i].nrCombinedSets;
			if(subSetDegree <= minDegree  ){
				minDegree = subSetDegree;
			}
			if(subSetDegree >= maxDegree  ){
				maxDegree = subSetDegree;
			}
		}
		
		if(minDegree == maxDegree){
			return subsets;
		}
		var medianDegree = Math.ceil(((minDegree + maxDegree)/2));
		
		for(var i=0; i<subsets.length; i++){
			if(subsets[i].nrCombinedSets < medianDegree){
				lowerChild.push(subsets[i]);
			}
			else{
				upperChild.push(subsets[i]);
			}
		}
		
		/*console.log(lowerChild.length);
		console.log(upperChild.length);*/
		
		if(lowerChild.length > 0){
			lowerChild = generateDegreeTree(lowerChild);
		}
		if(upperChild.length > 0){
			upperChild = generateDegreeTree(upperChild);
		}
		
		parentSet.push(lowerChild);
		parentSet.push(upperChild);
		return parentSet;
	}
	
	
}

function generateSizeTree(subsets){
//	console.log(subsets);
	var parentSet = [];
	var lowerChild = [];
	var upperChild = [];
	var minSize = Number.MAX_SAFE_INTEGER;
	var maxSize = 1;
	
	if(subsets.length == 1){
		return subsets;
	}
	else if(subsets.length == 2){
		if(subsets[0].setSize < subsets[1].setSize){
			upperChild = [subsets[0]];
			lowerChild = [subsets[1]];
		}
		else{
			upperChild = [subsets[1]];
			lowerChild = [subsets[0]];
		}
		parentSet.push(lowerChild);
		parentSet.push(upperChild);
		return parentSet;
	}
	else if(subsets.length > 2){
		for(var i=0; i<subsets.length; i++){
			var subSetSize = subsets[i].setSize;
			if(subSetSize < minSize  ){
				minSize = subSetSize;
			}
			if(subSetSize > maxSize  ){
				maxSize = subSetSize;
			}
		}
		
		if(minSize == maxSize){
			return subsets;
		}
		
		var medianSize = Math.ceil(((minSize + maxSize)/2));
		
		subsets.sort(sortBySize);
		
		for(var i=0; i<subsets.length; i++){
			if(subsets[i].setSize < medianSize){
				upperChild.push(subsets[i]);
			}
			else{
				lowerChild.push(subsets[i]);
			}
		}
		
		/*if(subsets.length > 3){
			console.log(lowerChild.length);
			console.log(upperChild.length);
		}*/
		
		if(lowerChild.length > 0){
			lowerChild = generateSizeTree(lowerChild);
		}
		if(upperChild.length > 0){
			upperChild = generateSizeTree(upperChild);
		}
		
		parentSet.push(lowerChild);
		parentSet.push(upperChild);
		return parentSet;
	}
}

function sortBySize(a,b){
	if(a.setSize < b.setSize){
		return 1;
	}
	if(a.setSize > b.setSize){
		return -1;
	}
	return 0;
}

