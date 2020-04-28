function generateDataView(){    
    var columns = [];  
    var j=0;
    
    for(var i=0; i<attributes.length; i++){
    	if(attributes[i].name != "Sets" && attributes[i].tableDisplay == "true" ){
    		columns[j] = {
            		id : attributes[i].name,
                    name : attributes[i].name,
                    field : attributes[i].name,
                    sortable: true,
                    sortable: true,
                    width: 50,
    		}
    		j++;
        };
    }	
	  var options = {
			headerRowHeight: 18,
			rowHeight: 18,
		    enableCellNavigation: true,
		    enableColumnReorder: false,
		    enableCellNavigation: true,
		    asyncEditorLoading: false,
		    enableCellNavigation: true,
		    multiColumnSort: true,
	  };	
	  
	  selectedTableData = new Slick.Data.DataView();	  
	  selectedDataGrid = new Slick.Grid("#selectedDataViewDiv", selectedTableData, columns, options);
	  
	  tableData = new Slick.Data.DataView({inlineFilters: true});	    
	  grid = new Slick.Grid("#dataViewDiv", tableData, columns, options);	  
	    
	  selectedTableData.onRowCountChanged.subscribe(function (e, args) {
		  selectedDataGrid.updateRowCount();
		  selectedDataGrid.render();
	    });
	  selectedTableData.onRowsChanged.subscribe(function (e, args) {
		  selectedDataGrid.invalidateRows(args.rows);
		  selectedDataGrid.render();
	    });
		
		selectedDataGrid.onMouseEnter.subscribe(function(e, args){
	    	 var cell = selectedDataGrid.getCellFromEvent(e);	
	    	 var item = selectedTableData.getItem(cell.row);//RowNum is the number of the row
		     var RowID = item.id     		    
		     
		     item["active"] = true;
		     
		     d3.selectAll(".setGroup")
				.each(function(){
					var elementGroup = d3.select(this).selectAll(".element_" + RowID);
					if(!elementGroup.empty()){
						var setId = d3.select(this).datum().id;
	    				
						d3.selectAll(".setBoarder_"+setId)
	    					.style("stroke","red");
	    				
	    				elementGroup
		    				.style("stroke-width",HIGHLIGHTED_ELEMENT_STROKE_WIDTH)
		    				.style("stroke",HIGHLIGHTED_ELEMENT_STROKE_COLOR);
	    				
	    				if(pictureAttributes.length > 0){
							var pictureAttr = $("#shapePicture").val();
							if(pictureAttr != null && pictureAttr != undefined && pictureAttr != "None" ){
								d3.selectAll(".pathElement_"+RowID)
									.style("opacity","1");
							}
						}
	    			}
				})
	    });
	    
	    selectedDataGrid.onMouseLeave.subscribe(function(e, args){
	    	deHighLightAllSets();
			
			d3.selectAll(".element")
	    		.style("stroke",function(d){
	    			if(activePixels.indexOf(d.id) == -1){
	    				return ELEMENT_STROKE_COLOR;
	    			}
	    			else{
	    				return FIXED_ELEMENT_STROKE_COLOR;
	    			}
	    		})
	    		.style("stroke-width",function(d){
	    			if(activePixels.indexOf(d.id) == -1){
	    				return ELEMENT_STROKE_WIDTH;
	    			}
	    			else{
	    				return HIGHLIGHTED_ELEMENT_STROKE_WIDTH;
	    			}
	    		});
	    });
		
		selectedDataGrid.onDblClick .subscribe(function(e, args){
	    	 var cell = selectedDataGrid.getCellFromEvent(e);	
	    	 var item = selectedTableData.getItem(cell.row);//RowNum is the number of the row
		     var RowID = item.id
		     
		     var id = RowID;
			 var idIndex = activePixels.indexOf(id);
			
				activePixels.splice(idIndex,1);
				d3.selectAll(".element_" + RowID)
					.each(function(d){
						activeElements.splice(idIndex,1);
					})
				    .style("stroke-width",ELEMENT_STROKE_COLOR)
				    .style("stroke",ELEMENT_STROKE_WIDTH);
			 updateSelectedDetailedView(activeElements);
			 
			 deHighLightAllSets();
			
			d3.selectAll(".element")
	    		.style("stroke",function(d){
	    			if(activePixels.indexOf(d.id) == -1){
	    				return ELEMENT_STROKE_COLOR;
	    			}
	    			else{
	    				return FIXED_ELEMENT_STROKE_COLOR;
	    			}
	    		})
	    		.style("stroke-width",function(d){
	    			if(activePixels.indexOf(d.id) == -1){
	    				return ELEMENT_STROKE_WIDTH;
	    			}
	    			else{
	    				return HIGHLIGHTED_ELEMENT_STROKE_WIDTH;
	    			}
	    		});
			
			if(pictureAttributes.length > 0){
				var pictureAttr = $("#shapePicture").val();
				if(pictureAttr != null && pictureAttr != undefined && pictureAttr != "None" ){
					d3.selectAll(".pathElement_"+RowID)
						.style("opacity",function(d){
							if(d["imgError"] == true){
								return "1";
							} 
							else{
									return "0";
							}
						});
				}
			}
	    });
	  
	  
	  // wire up model events to drive the grid
	    tableData.onRowCountChanged.subscribe(function (e, args) {
	      grid.updateRowCount();
	      grid.render();
	      $("#eleCount").html(tableData.getLength());
	    });
	    tableData.onRowsChanged.subscribe(function (e, args) {
	      grid.invalidateRows(args.rows);
	      grid.render();
	    });
	    
	    grid.onClick.subscribe(function(e, args){
	    	 var cell = grid.getCellFromEvent(e);	
	    	 var item = tableData.getItem(cell.row);//RowNum is the number of the row
		     var RowID = item.id
		     
		     var id = RowID;
			 var idIndex = activePixels.indexOf(id);
			
			 if(idIndex < 0){
				activePixels.push(id);
				d3.selectAll(".element_" + RowID)
					.each(function(d){
						activeElements.push(d);
					})
				    .style("stroke-width",HIGHLIGHTED_ELEMENT_STROKE_WIDTH)
				    .style("stroke",FIXED_ELEMENT_STROKE_COLOR);
			 }
			 else{
				activePixels.splice(idIndex,1);
				d3.selectAll(".element_" + RowID)
					.each(function(d){
						activeElements.splice(idIndex,1);
					})
				    .style("stroke-width",ELEMENT_STROKE_COLOR)
				    .style("stroke",ELEMENT_STROKE_WIDTH);
			 }
			 updateSelectedDetailedView(activeElements);
	    });
	    grid.onMouseEnter.subscribe(function(e, args){
	    	 var cell = grid.getCellFromEvent(e);	
	    	 var item = tableData.getItem(cell.row);//RowNum is the number of the row
		     var RowID = item.id     

		     item["active"] = true;
		     
		     d3.selectAll(".setGroup")
				.each(function(){
					var elementGroup = d3.select(this).selectAll(".element_" + RowID);
					if(!elementGroup.empty()){
						var setId = d3.select(this).datum().id;
	    				
						d3.selectAll(".setBoarder_"+setId)
	    					.style("stroke","red");
	    				
	    				elementGroup
		    				.style("stroke-width",HIGHLIGHTED_ELEMENT_STROKE_WIDTH)
		    				.style("stroke",HIGHLIGHTED_ELEMENT_STROKE_COLOR);
	    				
	    				if(pictureAttributes.length > 0){
							var pictureAttr = $("#shapePicture").val();
							if(pictureAttr != null && pictureAttr != undefined && pictureAttr != "None" ){
								d3.selectAll(".pathElement_"+RowID)
									.style("opacity",function(d){
										return "1";
									});
							}
						}
	    			}
				})
	    });
	    
	    grid.onMouseLeave.subscribe(function(e, args){
	    	deHighLightAllSets();
			
			d3.selectAll(".element")
	    		.style("stroke",function(d){
	    			if(activePixels.indexOf(d.id) == -1){
	    				return ELEMENT_STROKE_COLOR;
	    			}
	    			else{
	    				return FIXED_ELEMENT_STROKE_COLOR;
	    			}
	    		})
	    		.style("stroke-width",function(d){
	    			if(activePixels.indexOf(d.id) == -1){
	    				return ELEMENT_STROKE_WIDTH;
	    			}
	    			else{
	    				return HIGHLIGHTED_ELEMENT_STROKE_WIDTH;
	    			}
	    		});
			
			var cell = grid.getCellFromEvent(e);	
	    	 var item = tableData.getItem(cell.row);//RowNum is the number of the row
		     var RowID = item.id  
			
			if(pictureAttributes.length > 0){
				var pictureAttr = $("#shapePicture").val();
				if(pictureAttr != null && pictureAttr != undefined && pictureAttr != "None" ){
					d3.selectAll(".pathElement_"+RowID)
						.style("opacity",function(d){
							if(d["imgError"] == true){
								// console.log("in true");
								return "1";
							} 
							else{
								if(activePixels.indexOf(d.id) == -1){
									return "0";
								}
								return "1";
							}
						});
				}
			}
	    });
	    
	    grid.onSort.subscribe(function (e, args) {
		      var cols = args.sortCols;
		      tableData.sort(function (dataRow1, dataRow2) {
		        for (var i = 0, l = cols.length; i < l; i++) {
		          var field = cols[i].sortCol.field;
		          var sign = cols[i].sortAsc ? 1 : -1;
		          var value1 = dataRow1[field], value2 = dataRow2[field];
		          var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
		          if (result != 0) {
		            return result;
		          }
		        }
		        return 0;
		      });
		      grid.invalidate();
		      grid.render();
		 });
	    
	   selectedTableData.getItemMetadata = selectedMetaData(selectedTableData.getItemMetadata);
	   tableData.getItemMetadata = metadata(tableData.getItemMetadata);
	    
	   selectedTableData.beginUpdate();
	   selectedTableData.setItems(selectedTableData);
	   selectedTableData.setFilterArgs({
	   });
	   selectedTableData.setFilter(filterBySelectedElements);
	   selectedTableData.endUpdate();
	   
	   tableData.beginUpdate();
	    tableData.setItems(tableData);
	    tableData.setFilterArgs({
	      subGroupName: "",
	      setName:"",
	      isFiltered:false,
	      isSetFiltered:false,
	    });
	    tableData.setFilter(filterBySubGroup);
	    tableData.endUpdate();
	    
	    $("#dataViewDiv")
		    .on('mouseenter', ".slick-row", function () {
		        $(this).addClass( "activeRow" );
		    })
		    .on('mouseleave', ".slick-row", function () {
		    	$(this).removeClass( "activeRow" );
		    	var flag = false;
		    	for(var i=0; i<activePixels.length; i++ ){
		    		if($(this).hasClass("rowNo_"+activePixels[i])){
		    			flag = true;
		    			break;
		    		}
		    	}
		    	if(!flag){
		    		$(this).removeClass( "selectedRow" );
		    	}
		    	else{
		    		$(this).addClass( "selectedRow" );
		    	}
		    });
			
		$("#selectedDataViewDiv")
		    .on('mouseenter', ".slick-row", function () {
		        $(this).addClass( "activeRow" );
		    })
		    .on('mouseleave', ".slick-row", function () {
		    	$(this).removeClass( "activeRow" );
		    	// var flag = false;
		    	// for(var i=0; i<activePixels.length; i++ ){
		    		// if($(this).hasClass("rowNo_"+activePixels[i])){
		    			// flag = true;
		    			// break;
		    		// }
		    	// }
		    	// if(!flag){
		    		// $(this).removeClass( "selectedRow" );
		    	// }
		    	// else{
		    		// $(this).addClass( "selectedRow" );
		    	// }
		    });
}

function metadata(old_metadata) {
    return function(row) {
      var item = this.getItem(row);
      var meta = old_metadata(row) || {};

      if (item) {
        // Make sure the "cssClasses" property exists 
        meta.cssClasses = meta.cssClasses || '';

       /* if (item.active) {                    // If the row object has a truthy "canBuy" property
          meta.cssClasses += ' activeRow';      // add a class of "buy-row" to the row element.
        } // Note the leading ^ space.
       */        
        meta.cssClasses += ' rowNo_'+item.id;
        
        if(activePixels.indexOf(item.id) > -1){
        	meta.cssClasses += ' selectedRow';
        }
      }

      return meta;
    }
  }
  
function selectedMetaData(old_metadata) {
    return function(row) {
      var item = this.getItem(row);
      var meta = old_metadata(row) || {};

      if (item) {
        // Make sure the "cssClasses" property exists
        meta.cssClasses = meta.cssClasses || '';

       /* if (item.active) {                    // If the row object has a truthy "canBuy" property
          meta.cssClasses += ' activeRow';      // add a class of "buy-row" to the row element.
        } // Note the leading ^ space.
       */        
        meta.cssClasses += ' selectedRowNo_'+item.id;
        
        if(activePixels.indexOf(item.id) > -1){
        	meta.cssClasses += ' selectedRow';
        }
      }

      return meta;
    }
  }

function myFilter(item, args) {
	if(args.isFiltered){
		if (item["id"] == args.id) {
		    return true;
		  }
		else{
			return false;
		}
	}
	else{
		return true;
	}
}

function filterBySelectedElements(item,args){
	if(activePixels.indexOf(item["id"]) > -1 && item["isActive"]){
		return true;
	}
	else{
		return false;
	}
}

function filterBySubGroup(item,args){
	if(args.isFiltered){
		if(args.isSetFiltered){
			if(item["subGroupName"].split(" ").indexOf(args.setName) != -1 && item["isActive"]){
				return true;
			}
			else{
				return false;
			}
		}
		else{
			if (item["subGroupName"] == args.subGroupName && item["isActive"]) {
			    return true;
			  }
			else{
				return false;
			}
		}
	}
	else{
		if(item["isActive"]){
			return true;
		}
		else{
			return false;
		}
	}
}


function updateDetailedViewByUsedSets(data){
	addedIds = [];
	var dataArray = [];
	for(var i=0; i<data.length; i++){
		var subGroups = data[i].subSets;
		for(var j=0; j<subGroups.length;j++){
			var coOrdinates = subGroups[j].coOrdinates;
			for(var k=0; k < coOrdinates.length; k++){
				if(addedIds.indexOf(coOrdinates[k].id) == -1){
					addedIds.push(coOrdinates[k].id);
					dataArray.push(coOrdinates[k]);
				}
			}
		}
	}
	
	updateDetailedView(dataArray);
}

function updateDetailedView(dataArray){
	//grid.css('height', "490px");
	tableData.setItems(dataArray);
	selectedTableData.setItems(dataArray);
	selectedTableData.refresh();
  /*  grid.invalidate();
    grid.updateRowCount();
    grid.render();*/
}

function updateSelectedDetailedView(dataArray){
	selectedTableData.refresh();
	/*selectedTableData.beginUpdate();
	selectedTableData.setItems(dataArray);
	selectedTableData.endUpdate();*/
}

