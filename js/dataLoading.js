function loadDataSets(datalist){
    for(var i=0; i < datalist.length; i++){
        $('#fileLink').append($('<option>').val(datalist[i].link).text(datalist[i].name));
    }
}

function initData(fileLink) {
    dataSetDescriptions = [];
        $.when($.ajax({url: fileLink, dataType: 'json'})).then(
            function (data, textStatus, jqXHR) {
            	processDataSet(data);
            },
            function (data, textStatus, jqXHR) {
                console.error('Error loading "' + this.url + '".');
            });
}

function processDataSet(dataSetDescription) {
    if (dataSetDescription.file) {
        d3.text(dataSetDescription.file, function (data) {
            parseDataSet(data, dataSetDescription);
            setupPanels();
            initializeGUIEvents();
            run();
        });
    } else {
    	console.error('No file path in meta-data file.');
    }
}

function setupPanels(){
	
    // Initialize the degree slider -- ionRangeSlider
    degreeSlider = $("#degreeSlider").ionRangeSlider({
		type: "double",
		grid:false,
	    min: 1,
	    max: 1,
	    from: 1,
	    to:1,
	    step:1,
	    force_edges: true,
	    onChange : function (data) {
	    	querySubGroupsBySets();
	    	updateDegreeSliderData(data);
		},
	   
	}).data("ionRangeSlider");
	
    // Filter and categorize the attributes of the elements
    categoryAttribute = attributes.filter(function (d) {
        return (d.name != "Sets" && d.name != "Set Count" && d.name != "Name" && d.name != "SetNames" && (d.type == "text"));
	});
	
	dateAttributes =  attributes.filter(function (d) {
        return (d.name != "Sets" && d.name != "Set Count" && d.name != "Name" && d.name != "SetNames" && (d.type == "date"));
    });
    
	pictureAttributes = attributes.filter(function (d) {
        return (d.name != "Sets" && d.name != "Set Count" && d.name != "Name" && d.name != "SetNames" && (d.type == "picture"));
	});
	
	numericAttributes = attributes.filter(function (d) {
        return (d.name != "Sets" && d.name != "Set Count" && d.name != "Name" && d.name != "SetNames" && (d.type=="integer" || d.type=="float"));
	});
	
	searchAttribute = attributes.filter(function (d) {
        return (d.name != "Sets" && d.name != "Set Count" && d.name != "Name" && d.name != "SetNames" && (d.type=="search"));
	});
	
	linkAttribute = attributes.filter(function (d) {
        return (d.name != "Sets" && d.name != "Set Count" && d.name != "Name" && d.name != "SetNames" && (d.type=="link"));
	})[0];
    
    renderCategoryFilter(categoryAttribute);
    addCategoryColorLegend();
    addPictureAttributes();
    renderNumericFilter(numericAttributes,categoryAttribute,dateAttributes);
    renderSetView(sets);
    generateDataView();
    renderDetailedListView();
    renderSearchFilter();
    addSizeLegend();
    addPixelColorLegend();
    addSubGroupColorLegend();
    addOrderLegend();
    renderOrderPixel();
    addSetSpecificLegend(); 
}

function run() {
	calculateSimilarity();
	generateLinks();
	setUpSubSets();
	updateState();
	var data =  processSet(SetArrayJSON,true);
	processData(data);
	processRenderData(data);
	updateSearchFilters(data);
	updateNumericFilter(numericAttrDomins);
	updateDateFilter(dateAttrDomins);
	updateDetailedViewByUsedSets(data);
	renderSetQuerySection(data);
	renderSizeLegend();
	renderAddPixelColorLegend();
	renderSBColorLegend();
	updateSetLabel(data);
	renderVis(data);
}

// Parsing the Set datatype using UpSet code
function parseDataSet(data, dataSetDescription) {
    // the raw set arrays
    rawSets = [];
    setNames = [];

    var file;
    if ($.type(data) === 'string') {
        var dsv = d3.dsvFormat(dataSetDescription.separator, 'text/plain');
        file = dsv.parseRows(data);
    } else {
        file = data;
    }

    // the names of the sets are in the columns
    var header = file[dataSetDescription.header];
    // remove header
    file.splice(dataSetDescription.header, 1);
   
    // load set assignments
    var processedSetsCount = 0;
    for (var i = 0; i < dataSetDescription.sets.length; ++i) {
        var setDefinitionBlock = dataSetDescription.sets[i];
        var elementDefinitionBlock = null;
        if(dataSetDescription.elements){
        	elementDefinitionBlock = dataSetDescription.elements[i];
        }
        if (setDefinitionBlock.format === 'binary') {
            var setDefinitionBlockLength = setDefinitionBlock.end - setDefinitionBlock.start + 1;
            var elementDefinitionBlockLength = null;
            if(elementDefinitionBlock != null){
            	elementDefinitionBlockLength = elementDefinitionBlock.end - elementDefinitionBlock.start + 1;
            }
            // initialize the raw set arrays
            for (var setCount = 0; setCount < setDefinitionBlockLength; ++setCount) {
                rawSets.push(new Array());
            }

            var rows = file.map(function (row, rowIndex) {
            	if(elementDefinitionBlockLength != null){
            		if(rowIndex < elementDefinitionBlockLength){
            			return row.map(function (value, columnIndex) {
                            if (columnIndex >= setDefinitionBlock.start && columnIndex <= setDefinitionBlock.end) {
                                var intValue = parseInt(value, 10);
                                if (isNaN(intValue)) {
                                    console.error('Unable to convert "' + value + '" to integer (row ' + rowIndex + ', column ' + columnIndex + ')');
                                }
                                return intValue;
                            }
                            return null;
                        });
            		}
            	} 
            	else{
            		 return row.map(function (value, columnIndex) {
                         if (columnIndex >= setDefinitionBlock.start && columnIndex <= setDefinitionBlock.end) {
                             var intValue = parseInt(value, 10);
                             if (isNaN(intValue)) {
                                 console.error('Unable to convert "' + value + '" to integer (row ' + rowIndex + ', column ' + columnIndex + ')');
                             }
                             return intValue;
                         }
                         return null;
                     });
            	}
            });
            
            if(elementDefinitionBlockLength != null){
            	rows = rows.slice(0, elementDefinitionBlockLength);
            }
            // iterate over columns defined by this set definition block
            for (var r = 0; r < rows.length; r++) {  
                // increment number of items in data set
                // only increment depth when we are processing the first set definition block (we will already iterate overall rows)
                if (i === 0) {
                    allItems.push(depth++);
                }
                for (var s = 0; s < setDefinitionBlockLength; ++s) {
                    rawSets[processedSetsCount + s].push(rows[r][setDefinitionBlock.start + s]);
                    if (r === 1) {
                        setNames.push(header[setDefinitionBlock.start + s]);
                    }
                }
            }
            processedSetsCount += setDefinitionBlockLength;
        }
        else {
            console.error('Set definition format "' + setDefinitionBlock.format + '" not supported');
        }
    }
    
    setAttributes.length = 0;
    
    if(dataSetDescription.setMeta){
    	for(var i=0; i < dataSetDescription.setMeta.length; i++){
        	var setMetaDefinition = dataSetDescription.setMeta[i];
        	
        	var setAttribute = {};
        	setAttribute["name"] = setMetaDefinition.name || file[setMetaDefinition.rowIndex - 1][0];
        	setAttribute["type"] = setMetaDefinition.type;
        	setAttribute["values"] = [];
        	
        	for(var j=1; j < file[setMetaDefinition.rowIndex - 1].length; j++){
        		setAttribute["values"].push(file[setMetaDefinition.rowIndex - 1][j]);
        	}
        	setAttributes.push(setAttribute);
        }
    }
    
    setSpecificAttributes.length = 0;
    if(dataSetDescription.setDependentMeta){
    	for(var i=0; i<dataSetDescription.dependentMetas.length; i++){
    		var setSpecificAttrDefinition = dataSetDescription.dependentMetas[i];
    		
    		var setSpecificAttr = {};
    		setSpecificAttr["name"] = setSpecificAttrDefinition.name;
    		setSpecificAttr["type"] = setSpecificAttrDefinition.type;
    		setSpecificAttr["index"] = setSpecificAttrDefinition.index;
    		
    		setSpecificAttributes.push(setSpecificAttr);
    	}
    }

    // initialize sets and set IDs 
    for (var i = 0; i < rawSets.length; i++) {
        var combinedSets = Array.apply(null, new Array(rawSets.length)).map(Number.prototype.valueOf, 0);
        var setIdToSet = [];
        combinedSets[i] = 1;
        
        var set = new Set(setPrefix + i, setNames[i], combinedSets, rawSets[i]);
        if(setAttributes.length > 0){
        	for(var j=0; j < setAttributes.length; j++){
        		set[setAttributes[j].type] = setAttributes[j].values[i];
        	}
        }
        setIdToSet[setPrefix + i] = set;
        sets.push(set);
    }
    
    // initialize attribute data structure
    attributes.length = 0;
    for (var i = 0; i < dataSetDescription.meta.length; ++i) {
        var metaDefinition = dataSetDescription.meta[i];

       if(metaDefinition.type == "date"){
    	   attributes.push({
               name: metaDefinition.name || header[metaDefinition.index],
               type: metaDefinition.type,
               format:metaDefinition.format,
			   tableDisplay:metaDefinition.tableDisplay,
               values: [],
               sort: 1
           });
       }
       else{
    	   attributes.push({
               name: metaDefinition.name || header[metaDefinition.index],
               type: metaDefinition.type,
               values: [],
			   tableDisplay:metaDefinition.tableDisplay,
               sort: 1
           }); 
       }
    }

    // add implicit attributes
    var setCountAttribute = {
        name: 'Set Count',
        type: 'integer',
        values: [],
		tableDisplay:"true",
        sort: 1,
        min: 0
    };

    for (var d = 0; d < depth; ++d) {
        var setCount = 0;
        for (var s = 0; s < rawSets.length; s++) {
        	if(rawSets[s][d] > 0){
        		//console.log(rawSets[s][d]);
        		//setCount += rawSets[s][d];
        		setCount += 1;
        	}
        }
        setCountAttribute.values[d] = setCount;
    }
    attributes.push(setCountAttribute);

    var setsAttribute = {
        name: 'Sets',
        type: 'sets',
        values: [],
		tableDisplay:"false",
        sort: 1
    };

    for (var d = 0; d < depth; ++d) {
        var setList = [];
        for (var s = 0; s < rawSets.length; s++) {
            if (rawSets[s][d] > 0) {
                setList.push(sets[s].id);
            }
        }
        setsAttribute.values[d] = setList;
    }
    attributes.push(setsAttribute);
    
    var setNamesAttribute = {
            name: 'SetNames',
            type: 'SetNames',
			tableDisplay:"true",
            values: [],
        };

        for (var d = 0; d < depth; ++d) {
            var setList = [];
            for (var s = 0; s < rawSets.length; s++) {
                if (rawSets[s][d] > 0) {
                    setList.push(sets[s].elementName);
                }
            }
            setNamesAttribute.values[d] = setList;
        }
       
        attributes.push(setNamesAttribute);
    
    for (var i = 0; i < dataSetDescription.meta.length; ++i) {
        var metaDefinition = dataSetDescription.meta[i];

        attributes[i].values = file.map(function (row, rowIndex) {
            var value = row[metaDefinition.index];
            switch (metaDefinition.type) {
                case 'integer':
                    var intValue = parseInt(value, 10);
                    if (isNaN(intValue)) {
                        console.error('Unable to convert "' + value + '" to integer.');
                        return NaN;
                    }
                    return intValue;
                case 'float':
                    var floatValue = parseFloat(value, 10);
                    if (isNaN(floatValue)) {
                        console.error('Unable to convert "' + value + '" to float.');
                        return NaN;
                    }
                    return floatValue;
                case 'text':
                    var textValue = value.trim();
                    isElementCategorised = true;
                    return textValue;
                
                case 'date':
                	return moment(value,metaDefinition.format).format("YYYY-MM-DD");
                case 'picture':
                	return value;
                case 'id':
                // fall-through
                case 'string':
                // fall-through
                default:
                    return value;
            }
        });
    }
    var max;

    //add meta data summary statistics
    for (var i = 0; i < attributes.length; ++i) {

        if (attributes[i].type === "float" || attributes[i].type === "integer") {
            // explictly defined attributes might have user-defined ranges
            if (i < dataSetDescription.meta.length) {
                attributes[i].min = dataSetDescription.meta[i].min || Math.min.apply(null, attributes[i].values);
                attributes[i].max = dataSetDescription.meta[i].max || Math.max.apply(null, attributes[i].values);
            }
            // implicitly defined attributes
            else {
                attributes[i].min = attributes[i].min || Math.min.apply(null, attributes[i].values);
                attributes[i].max = attributes[i].max || Math.max.apply(null, attributes[i].values);
            }
        }
        
        if(attributes[i].type === "text"){
        	attributes[i]["categories"] = [];
    		for(var k=0; k<attributes[i].values.length; k++){
    			if(attributes[i]["categories"].indexOf(attributes[i]["values"][k]) == -1){
    				attributes[i]["categories"].push(attributes[i]["values"][k]);
    			}
    		}
    		if(attributes[i]["categories"].length > 60){
    			attributes[i].type = "search";
    		}
    	}
    }
    
    for(var ij=0; ij < attributes.length; ij++ ){
    	if(attributes[ij].name == "Set Count"){
    		 maxCardinality = attributes[ij].max;
    		 minCardinality = attributes[ij].min;
    	}
    }
}

function createSignature(listOfUsedSets, listOfSets) {
    return listOfUsedSets.map(function (d) {
        return (listOfSets.indexOf(d) > -1) ? 1 : 0
    }).join("")
}

function setUpSubSets() {
    combinations = Math.pow(2, usedSets.length) - 1;
    subSets.length = 0;
    var aggregateIntersection = {};
    var listOfUsedSets = usedSets.map(function (d) {
        return d.id;
    })
    var setsAttribute = attributes.filter(function (d) {
        return d.type == "sets";
    })[0];
    var signature = "";
    var itemList;
    
    //HEAVY !!!
   /*console.log("listOfUsedSets --> ");
   console.log(listOfUsedSets);
   console.log("setsAttribute --> ");
   console.log(setsAttribute);*/
   
    setsAttribute.values.forEach(function (listOfSets, index) {
        signature = createSignature(listOfUsedSets, listOfSets)
        itemList = aggregateIntersection[signature];
        if (itemList == null) {
            aggregateIntersection[signature] = [index];
            //console.log(aggregateIntersection[signature]);
        } else {
            itemList.push(index);
        }
    })
    
    /*console.log("aggregateIntersection -- > ");
    console.log(aggregateIntersection);
    console.log("itemList -- > ");
    console.log(itemList);*/
    // used Variables for iterations
    var tempBitMask = 0;
    var usedSetLength = usedSets.length
    var combinedSetsFlat = "";
    var actualBit = -1;
    var names = [];
    if (usedSetLength > 1) { // TODo HACK !!!!
        Object.keys(aggregateIntersection).forEach(function (key,index) {
            var list = aggregateIntersection[key]
            var combinedSets = key.split("");
            names = [];
            var expectedValue = 1;
            var notExpectedValue = 1;
            for(var a=0; a < combinedSets.length; a++){
            	combinedSets[a] = parseInt(combinedSets[a]);
            }
            combinedSets.forEach(function (d, i) {
            		//d = parseInt(d);
                    if (d == 1) { // if set is present
                        names.push(usedSets[i].elementName);
                        expectedValue = expectedValue * usedSets[i].dataRatio;
                    } else {
                        notExpectedValue = notExpectedValue * (1 - usedSets[i].dataRatio);
                    }
                }
            );
            expectedValue *= notExpectedValue;
            var name = "";
            if (names.length > 0) {
                name = names.reverse().join(" ") + " " // not very clever
            }
           // console.log(list);
            var subSet = new SubSet(index, name, combinedSets, list, expectedValue);
            subSets.push(subSet);
        })
    } else {
        for (var bitMask = 0; bitMask <= combinations; bitMask++) {
            tempBitMask = bitMask;//originalSetMask
            var card = 0;
            var combinedSets = Array.apply(null, new Array(usedSetLength)).map(function () {  //combinedSets
                actualBit = tempBitMask % 2;
                tempBitMask = (tempBitMask - actualBit) / 2;
                card += actualBit;
                return +actualBit
            }).reverse() // reverse not necessary.. just to keep order
            combinedSetsFlat = combinedSets.join("");
            names = [];
            var expectedValue = 1;
            var notExpectedValue = 1;
            // go over the sets
            combinedSets.forEach(function (d, i) {
                    if (d == 1) { // if set is present
                        names.push(usedSets[i].elementName);
                        expectedValue = expectedValue * usedSets[i].dataRatio;
                    } else {
                        notExpectedValue = notExpectedValue * (1 - usedSets[i].dataRatio);
                    }
                }
            );
            expectedValue *= notExpectedValue;
            var list = aggregateIntersection[combinedSetsFlat];
            if (list == null) {
                list = [];
            }
            var name = "";
            if (names.length > 0) {
                name = names.reverse().join(" ") + " " // not very clever
            }
           // console.log(list);
            var subSet = new SubSet(bitMask, name, combinedSets, list, expectedValue);
            subSets.push(subSet);
        }
    }
   /* console.log("usedSets -->");
    console.log(usedSets);
    console.log("subSets --> ");
    console.log(subSets);*/
    aggregateIntersection = {};
}

var unwrapGroups = function (groupList) {
    var dataRows = []
    for (var i = 0; i < groupList.length; i++) {
        var group = groupList[i];
        // ignoring an empty empty group
        if (group.id === EMPTY_GROUP_ID && group.setSize === 0 || (group.visibleSets.length === 0)) {
            continue;
        }
        dataRows.push(group);
    }
    return dataRows;
};
var updateState = function (parameter) {
	var t0 = performance.now();
	levelOneGroups = groupBySet(subSets, 1, "");
	var t1 = performance.now();
	// console.log("Time taken to generate levelOneGroups " + (t1 - t0) + " milliseconds.");
	
	levelOneGroups.forEach(function (group) {
        group.nestedGroups = groupByIntersectionSize(group.subSets, 2, group);
    });
	var t0 = performance.now();
	dataRows = unwrapGroups(levelOneGroups);
	var t1 = performance.now();
	// console.log("Time taken to unwrapGroups " + (t1 - t0) + " milliseconds.");
	
	setDetails = [];
	for(var i=0; i<dataRows.length;i++){
		if(dataRows[i].type == "GROUP_TYPE" && dataRows[i].id != "EmptyGroupundefined" && dataRows[i].id !="EmptyGroup"){
			//console.log(dataRows[i]);
			var setDetail = {};
			setDetail["id"] = dataRows[i].id;
			setDetail["setSize"] = dataRows[i].setSize;
			setDetail["subSets"] = dataRows[i].subSets;
			setDetail["SetName"] = dataRows[i].elementName;
			setDetail["combinedSets"] = dataRows[i].combinedSets;
			setDetail["degreeGroups"] = dataRows[i].nestedGroups;
			setDetail["isOpr"] = dataRows[i].isOpr;
			setDetail["oprSet1"] = dataRows[i].oprSet1;
			setDetail["oprSet2"] = dataRows[i].oprSet2;
			setDetail["opr"] = dataRows[i].opr;
			setDetail["setSpecificAttrs"] = dataRows[i].setSpecificAttrs;
			if(dataRows[i].latitude){
				setDetail["latitude"] = dataRows[i].latitude;
				LAYOUT_TYPE = GEO_LAYOUT;
			}
			if(dataRows[i].longitude){
				setDetail["longitude"] = dataRows[i].longitude;
			}
            if(dataRows[i].time){
                setDetail["time"] = new Date(dataRows[i].time);
				LAYOUT_TYPE = TIME_LAYOUT;
            }
			setDetails.push(setDetail);
		}
	}
	
	/*function filterZeroSets(subSet){
		return (!subSet.setSize == "0");
	}*/
	
	for(var i=0; i < setDetails.length; i++){
		var j=setDetails[i].subSets.length-1;
		for(; j >=0; j-- ){
			if(setDetails[i].subSets[j].setSize == 0){
				setDetails[i].subSets.splice(j,1);
			}
		}
	}
	var SetArray = setDetails.slice(0);
	//console.log(SetArray);
	SetArrayJSON = JSON.parse(JSON.stringify(SetArray));
};
var groupBySet = function (subSets, level, parentGroup) {
    var newGroups = [];
    var noSet = new Group(EMPTY_GROUP_ID, 'No Set', level);
    newGroups.push(noSet);
    for (var i = 0; i < usedSets.length; i++) {
        var group = new Group(SET_BASED_GROUPING_PREFIX + (i + 1) + parentGroup, usedSets[i].elementName, level, undefined,  usedSets[i].isOpr, usedSets[i].oprSet1, usedSets[i].oprSet2, usedSets[i].opr);
        group.combinedSets = Array.apply(null, new Array(usedSets.length)).map(Number.prototype.valueOf, 2);
        group.combinedSets[i] = 1;
        
        if(usedSets[i].latitude){
        	group["latitude"] = usedSets[i].latitude;
			LAYOUT_TYPE = GEO_LAYOUT;
		}
		if(usedSets[i].longitude){
			group["longitude"] = usedSets[i].longitude;
		}
        if(usedSets[i].time){
            group["time"] = usedSets[i].time;
            LAYOUT_TYPE = TIME_LAYOUT;
        }
        group["setSpecificAttrs"] = usedSets[i].setSpecificAttrs;
        
        newGroups.push(group);

        subSets.forEach(function (subSet) {
            if (subSet.combinedSets[i] !== 0) {
                group.addSubSet(subSet);
            }
        });
    }
    //console.log(newGroups);
    subSets.forEach(function (subSet) {
        if (subSet.id == 0) {
            noSet.addSubSet(subSet);
            noSet.combinedSets = subSet.combinedSets;
        }
    });
    return newGroups;
};

var groupByIntersectionSize = function (subSets, level, parentGroup) {
    var newGroups = [];
    newGroups.push(new Group(EMPTY_GROUP_ID + parentGroup.id, 'Degree 0 (in no set)', level,0));
    var maxSetSize = Math.min(usedSets.length, maxCardinality);
    
    for (var i = minCardinality; i < maxSetSize; i++) {
        newGroups.push(new Group(SET_SIZE_GROUP_PREFIX + (i + 1) + '_' + parentGroup.id, 'Degree ' + (i + 1) + " (" + (i + 1) + " set intersect.)", level,(i +1)));
    }
    subSets.forEach(function (subSet) {
        var group = newGroups[subSet.nrCombinedSets];
        if (group != null)
            group.addSubSet(subSet);
    })
    return newGroups;
}

//function to calculate the Jaccard index
function calculateSimilarity(){
	var toatlItems;
	if(usedSets[0]){
		toatlItems = usedSets[0].itemList.length;
	}
	for(var i=0; i<usedSets.length; i++){
		usedSets[i].similarityMeasure = [];
		for(var j=0; j<usedSets.length; j++){
			if(i==j){
				usedSets[i].similarityMeasure[j] = 0;
			}
			else{
				var intersectionDegree = 0;
				var unionDegree = 0;
				for(var k=0; k < toatlItems; k++){
					if(usedSets[i].itemList[k] == 1 && usedSets[j].itemList[k] == 1 ){
						intersectionDegree++;
					}
					if(usedSets[i].itemList[k] == 1 || usedSets[j].itemList[k] == 1 ){
						unionDegree++;
					}
				}
				
				var jaccardSimilarity = (intersectionDegree/unionDegree);
				usedSets[i].similarityMeasure[j] = jaccardSimilarity;
			}
		}
	}
}

//function to generate the similarity links
function generateLinks(){
	similarityLinks = [];
	for(var i=0; i<usedSets.length; i++){
		for(var j=(i+1); j<usedSets.length;j++){
			var link = {};
			link["source"] = i;
			link["target"] = j;
			link["similarity"] = usedSets[i].similarityMeasure[j] ;
			similarityLinks.push(link);
		}
	}
}