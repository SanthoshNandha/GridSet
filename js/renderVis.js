function renderVis(data){
	
	//functions to bring the elements from and back
	d3.selection.prototype.moveToFront = function() {  
		return this.each(function(){
			this.parentNode.appendChild(this);
		});
	};
		
	d3.selection.prototype.moveToBack = function() {  
		return this.each(function() { 
			var firstChild = this.parentNode.firstChild; 
			if (firstChild) { 
				this.parentNode.insertBefore(this, firstChild); 
			} 
		});
	};
	
	//Similarity update function
	 function updateSimilarityLinks(){
			link.attr("d",function(d){
				var source = data[d.source];
				var target = data[d.target];
				return  getSimilarityPath(d.source.x,d.source.y,d.target.x,d.target.y);
			})
     };
	
    var elementScale = d3.scaleLinear()    
        	.range([(side-(side/2)), (side+(side/2))]);
    
    var colorRangeScale = d3.scaleLinear()           
    .range([0, 1]);
	
	var xScale = d3.scaleLog()
    .rangeRound([50, (width - 100)]);

	var yScale = d3.scaleLog()
	    .rangeRound([50, (height - 100)]);	
	
	var xTimeScale = d3.scaleTime()
	    .range([50, (width - 100)]); 	
	
	var sym;
	var draggedSetId;

	var setDrag = d3.drag()
		.on("start", dragstarted)
	    .on("drag", dragged)
	    .on("end", dragended);
	
	var viewZoom = d3.zoom()
					.scaleExtent([0.3,7])
					.on("zoom",zoom);

	var svgWidth = $(".lower-band").width();
	var svgHeight = $(".lower-band").height();
	
	var margin = { top: 0, right: 0, bottom: 0, left: 0 },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom; 
	
	projection = d3.geoMercator()          
		.translate([width/2, height/2]);
	
	if(currentSVGTranslateX == null){
		currentSVGTranslateX = margin.left;
	}
	
	if(currentSVGTranslateY == null){
		currentSVGTranslateY = margin.top;
	} 
	
	var t = d3.zoomIdentity.translate(currentSVGTranslateX, currentSVGTranslateY).scale(currentZoomLevel);
		
	svg = d3.select("#svgDiv")
	      .append("div")
	      .attr("id","svgDiv1")
	      //.classed("svg-container", true)
		  .append("svg")
		  .attr("class","main-svg")
		 //.attr("viewBox", "0 0 "+ (width /*+ margin.left + margin.right*/) + " " +  (height + margin.top + margin.bottom))
		  // .attr("viewBox", "0 0 "+ $(".ui-layout-center").width() + " " +  $(".ui-layout-center").height())
		  //.attr("preserveAspectRatio", "xMinYMin meet")
		 // .classed("svg-content-responsive", true)
	      .attr("width", (width + margin.left + margin.right))
	      .attr("height", (height + margin.top + margin.bottom))
	      .call(viewZoom)
	      .call(viewZoom.transform, t)
	      .on("dblclick.zoom", null)
	      .append("g")
	      .attr("class","baseG")
		  .attr("transform", t);
    
	//Set opr menue rendering
	var operationSelectionG = svg
			.append("g")
		    .attr("class", "selectOperation")
		    .style("opacity","0");
    
    var oprMenueItemLabelDiv = operationSelectionG.selectAll(".oprMenueItemLabel")
			.data(operations)
			.enter()
			.append("foreignObject")
			.attr("x", function(){
				return 0;
			})
			.attr("y", function(d,i){
				return (i * oprMenueItemHeight);
			})
			.attr("width",oprMenueItemWidth)
			.attr("height",oprMenueItemHeight)
			.append('xhtml:div')
			.attr("class",function(d){
				return "oprMenueItemLabelDiv oprMenueItemLabelDiv_" + d;
			})
			.on("mouseover",function(d){
				
			})
			.on("mousedown",function(){
				d3.event.stopPropagation();
			})
			.on("click",function(d,i){
		    	d3.selectAll(".selectOperation")
		    		.style("opacity",0)
		    		.attr("transform", "translate(" + 0 + "," + 0 + ")")
		    		.moveToBack();
		    	
		    	$('.legend-div').find('*').attr('disabled', false);
				d3.selectAll(".setGroupG").selectAll("*").classed('disabled-element ', false);
		    	
		    	if(i==0){
		    		//createUnion(oprSet1, oprSet2);
		    		createOprSet(oprSet1, oprSet2, UNION_SYM);
		    	}
		    	else if(i==1){
		    		//createIntersection(oprSet1, oprSet2);
		    		createOprSet(oprSet1, oprSet2, INTERSECTION_SYM);
		    	}
		    	else if(i==2){
		    		//createOneMinus(oprSet1, oprSet2);
		    		createOprSet(oprSet1, oprSet2, MINUS_SYM);
		    	}
		    	else if(i==3){
		    		 //createTwoMinus(oprSet1, oprSet2);
		    		createOprSet(oprSet2, oprSet1, MINUS_SYM);
		    	}
		    	else if(i==4){
		    		opredSet.fx = opredSet.startFx;
		    		opredSet.fy = opredSet.startFy;
		    		
					simulation.tick();
					tick();
					
					d3.selectAll(".oprButton")
						.style("display","none");
						
					opredSet = null;
		   		 	return;
		    	}
    });
    
    var oprMenueItemIcon = d3.selectAll(".oprMenueItemLabelDiv")
    		.append('div')
			.attr("class",function(d){
				return "oprMenueItemIcon pull-left oprMenueItemIcon" + d;
			})
			.html(function(d){
				if(d=="UNION"){
					return "<img src=\"../images/unionOpr.png\" alt=\"&#8746;\" style=\"width:30px;height:30px;\">";
					//return "&#8746;"; 
				}
				else if(d == "INTERSECTION"){
					return "<img src=\"../images/intersectionOpr.png\" alt=\"&#8745;\" style=\"width:30px;height:30px;\">";
					//return "&#8745;";
				}
				else if(d == "MINUS1"){
					return "<img src=\"../images/minusOneOpr.png\" alt=\"&#8722;\" style=\"width:30px;height:30px;\">";
				}
				else if(d == "MINUS2"){
					return "<img src=\"../images/minusTwoOpr.png\" alt=\"&#8722;\" style=\"width:30px;height:30px;\">";
				}
				else if(d =="CANCEL"){ 
					return "<img src=\"../images/cancelOpr.png\" alt=\"	&#8855;\" style=\"width:15px;height:15px;margin-top: 25%;\">";
				}
			});
    
    var oprMenueItemIconDivider = d3.selectAll(".oprMenueItemLabelDiv")
			.append('div')
			.attr("class",function(d){
				return "oprMenueItemIconDivider pull-left";
			})
			
	var oprMenueItemLabel = d3.selectAll(".oprMenueItemLabelDiv")
			.append('div')
			.attr("class",function(d){
				return "oprMenueItemLabel pull-left oprMenueItemLabel" + d;
			});
    
    var oprMenueItemLabelLine1 = d3.selectAll(".oprMenueItemLabel")
    		.append("div")
    		.attr("class",function(d){
    			return "oprMenueItemLabelLine oprMenueItemLabelLine1";
    		})
    		
     var oprMenueItemLabelLine2 = d3.selectAll(".oprMenueItemLabel")
    		.append("div")
    		.attr("class",function(d){
    			return "oprMenueItemLabelLine oprMenueItemLabelLine2";
    		})
    		
     var oprMenueItemLabelLine2 = d3.selectAll(".oprMenueItemLabel")
    		.append("div")
    		.attr("class",function(d){
    			return "oprMenueItemLabelLine oprMenueItemLabelLine3";
    		})
    		
	//Set grid rendering
	var setGroupG = svg
		.append("g")
	    .attr("class", "setGroupG");

	var setGridGroup = setGroupG.selectAll(".setGroup")
		.data(data)
		.enter()
		.append("g")
		.attr("class",function(d){
			return "setGroup " + d.id;
		})
		.attr("id",function(d){
			return d.id;
		})
		.style("opacity","1")
		.call(setDrag);
	
	if(LAYOUT_TYPE == NORMAL_LAYOUT){        
		simulation = d3.forceSimulation(data)
		.force("collide", d3.forceCollide(function(d){
			var width = d.width + ((setBoarderSize + 1) * (side + padding + boarderPadding));
			var height = d.height + ((setBoarderSize + 1) * (side + padding + boarderPadding));
			
			d["collideForce"] = ((Math.sqrt((width*width) + (height*height)))/2);
			return ((Math.sqrt((width*width) + (height*height)))/2);
		}))
		/*.force("link", d3.forceLink(similarityLinks)
			.distance(function(d){
				var source = d.source;
				var width = source.width + ((setBoarderSize+1) * (side + padding + boarderPadding));
				var height = source.height + ((setBoarderSize+1) * (side + padding + boarderPadding));
				var sourceDiagonal = (Math.sqrt((width*width) + (height*height)))/2;
				var target =  d.target;
				width = target.width + ((setBoarderSize+1) * (side + padding + boarderPadding));
				height = target.height + ((setBoarderSize+1) * (side + padding + boarderPadding));
				var targetDiagonal = (Math.sqrt((width*width) + (height*height)))/2;
				d["distance"] = ((similarityLinkLength(d.similarity)/5) + (sourceDiagonal/2) + (targetDiagonal/2)) ;
				return d["distance"] ;
		}))*/
	   .force("center", d3.forceCenter(width / 3, height / 3))
       .stop();
	}
	

	/*if(LAYOUT_TYPE == TIME_LAYOUT){    
               
        var minDate =d3.min(data, function (d) { return new Date(d.time); });
        var maxDate = d3.max(data, function (d) { return new Date(d.time); });
                
        xTimeScale.domain([minDate,maxDate]);
       
        var axis = d3.axisBottom()
            .scale(xTimeScale);
          	
        var g = svg.append("g")
	        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
        var xAxis = g.append("g")
            .attr("class", "axis axis--x")
            .call(axis);
        
        simulation = d3.forceSimulation(data)
            .force("x", d3.forceX(function(d){                
                return xTimeScale(new Date(d.time));})
            .strength(1))
            .force("y", d3.forceY(function(d) { 
					return (height/2); })
					.strength(1))
            .force("collide", d3.forceCollide(function(d){
                var width = d.width + ((setBoarderSize + 2) * (side + padding + boarderPadding));
                var height = d.height + ((setBoarderSize + 2) * (side + padding + boarderPadding));
                d["collideForce"] = ((Math.sqrt((width*width) + (height*height)))/2);
                return ((Math.sqrt((width*width) + (height*height)))/2);
		}))
         .force("link", d3.forceLink(similarityLinks)
			.distance(function(d){                
                return 10;				
		}))
	      .stop();
    }
    if(LAYOUT_TYPE == GEO_LAYOUT){        
	xScale.domain(d3.extent(data, function(d) { return d.xValue; }));
	yScale.domain(d3.extent(data, function(d) { return d.yValue; }));
        
		simulation = d3.forceSimulation(data)
	      .force("x", d3.forceX(function(d) {     	    
				return xScale(d.xValue); 
          })
		  .strength(1))
	      .force("y", d3.forceY(function(d) { 
					return yScale(d.yValue); 
          })
		 .strength(1))
	     .force("collide", d3.forceCollide(function(d){
			var width = d.width + ((setBoarderSize + 2) * (side + padding + boarderPadding));
			var height = d.height + ((setBoarderSize + 2) * (side + padding + boarderPadding));
			d["collideForce"] = ((Math.sqrt((width*width) + (height*height)))/2);
			return ((Math.sqrt((width*width) + (height*height)))/2);
		}))
        .force("link", d3.forceLink(similarityLinks)
			.distance(function(d){                
                return 10;				
		}))
	    .stop();
	}
	
		simulation.force("link")
            .links(similarityLinks);*/
	
     simulation
         .on("tick", tick)
         .on("end",tickEnd);
	 
        for (var i = 0; i < 120; ++i) simulation.tick();
        tick();
        tickEnd();

    //Set boarder rendering
	var setBoarders = d3.selectAll(".setGroup")
					.append("path")
					.attr("class",function(d){
						return "setBoarder " + "setBoarder_" + d.id;
					})
					.attr("d", function(d){
						return d.boarderPath;
					})
					.style("fill",function(d){
						return SET_FILL;
					})
					.style("fill-opacity",SET_FILL_OPACITY)
					.style("stroke",function(d){
						if(d.isOpr){
							return USER_SET_STROKE;
						}
						else{
							return SET_STROKE;
						}
					})
					.style("stroke-opacity",SET_STROKE_OPACITY)
					.style("stroke-width",SET_STROKE_WIDTH)
					.on("mouseover",function(d){
						d3.select(this)
							.style("stroke",function(d){
								return "red";
							});
						d3.selectAll(".similarityLink_" + d.id)
							.style("opacity","0.6")
							.style("stroke","red")
							.style("stroke-opacity","0.8");
						
						tableData.setFilterArgs({
							  setName: d.SetName,
						      isFiltered:true,
						      isSetFiltered : true,
						});
						tableData.refresh();
					})
					.on("mouseout",function(d){
						deHighLightAllSets();
						d3.selectAll(".similarityLink_" + d.id)
							.style("opacity","0.2")
							.style("stroke","black")
							.style("stroke-opacity","0.4");
						
						tableData.setFilterArgs({
							  setName: d.SetName,
						      isFiltered:false,
						      isSetFiltered : false,
						});
						tableData.refresh();
					});
	
	var oprUndoButton = d3.selectAll(".setGroup")
		.append("foreignObject")
		.filter(function(d) {
			return (d.opr != null);
		})
		.attr("x",function(d,i){
			return ((side + padding)* (d.cols)) - 1;
		})
		.attr("y",function(d,i){
			return   -(padding + (padding-1));
		})
		.attr("width", function(d){
			return side;							
		})
		.attr("height", function(d){
			return side + 5;							
		})
		.attr("class","oprUndoButton")
		.append('xhtml:div')
		.on("mousedown",function(d){
			d3.event.stopPropagation();
		})
		.on("click",function(d){
			if (d3.event.defaultPrevented) return;
			removeOprSet(d.SetName, d.oprSet1, d.oprSet2);
		})
		.append("i")
		.attr("class", "fa fa-window-restore closeSymButton")
		.attr("aria-hidden","true");
	
	var closeSymButton = d3.selectAll(".setGroup")
		.append("foreignObject")
		.attr("x",function(d,i){
			return  (side + padding)* (d.cols);				
		})
		.attr("y",function(d,i){
			return  -(side + side - padding +  (padding -2)) ;
		})
		.attr("width", function(d){
			return side;							
		})
		.attr("height", function(d){
			return side + 5;							
		})
		.append('xhtml:div')
		.on("mousedown",function(d){
			d3.event.stopPropagation();
		})
		.on("click",function(d){
	    	if (d3.event.defaultPrevented) return;
	         var set = d.SetName;            
	             for(var i=0; i < usedSets.length; i++){
		    		if(usedSets[i].elementName == set){
		    			usedSets.splice(i,1);
	                    break;
		    		}
		    	}	        
	             reRenderVis();
		})
		.append("i")
		.attr("class", "fa fa-times closeSymButton")
		.attr("aria-hidden","true");
	
	var newSetLabel = d3.selectAll(".setGroup")
		.append("foreignObject")
		.attr("x",function(d,i){
			//return  -(side + padding) ;/*(side) (d.cols - 1)*/
			return -(padding);
		})
		.attr("y",function(d,i){
			return  -(side + side - padding +  (padding-1));
		})
		.attr("width", function(d){
			return (side + padding) * (d.cols);							
		})
		.attr("height", function(d){
			return side + 5;							
		})
		.attr("class","newSetLabelFO")
		.append('xhtml:div')
		.style("height","100%")
		.style("width","100%");
	
	var newSetLabelText = newSetLabel
							.each(function(d){
								if(d.opr == null){
									d3.select(this)
									.append("div")
									.attr("class", "textLabelSpan pull-left disable-select")
									.style("width",function(){
										return ((d.cols)) * (side + padding) + "px";
									})
									.html(function(d){
										return d.SetName;
									});
								}
								else{
									var names = [];
									if(d.oprSet1.isOpr){
										names.push( "[ " + d.oprSet1.SetName + " ]");
									} 
									else{
										names.push(d.oprSet1.SetName);
									}
									names.push(d.opr);
									if(d.oprSet2.isOpr){
										names.push( "[ " + d.oprSet2.SetName + " ]");
									} 
									else{
										names.push(d.oprSet2.SetName);
									}
									d3.select(this).selectAll("span")
										.data(names)
										.enter()
										.append("div")
										.attr("class","textLabelSpan pull-left disable-select")
										.style("width",function(di,i){
											if(i==1){
												return (side + padding + "px");
											}
											else{
												return (((d.cols - 1 )/2) * (side + padding)) + "px";
											}
										})
										.style("text-align",function(di,i){
											if(i==0){
												return "right";
											}
											if(i==2){
												return "left";
											}
										})
										.html(function(d,i){
											return d;
											if(i == 1)
												return d;
											else
												return d.SetName;
										})
								}
							});
	
	var newSetLabelTextToolTip = d3.selectAll(".newSetLabelFO")
			.append("svg:title")
			.html(function(d){
					if(d.opr == null){
						return d.SetName;
					}
					else if(d.opr != null){
						var names = [];
						if(d.oprSet1.isOpr){
							names.push( "[ " + d.oprSet1.SetName + " ]");
						} 
						else{
							names.push(d.oprSet1.SetName);
						}
						names.push(d.opr);
						if(d.oprSet2.isOpr){
							names.push( "[ " + d.oprSet2.SetName + " ]");
						} 
						else{
							names.push(d.oprSet2.SetName);
						}
						return names.join(" ");
					}
				});
		
	/*var subGroupLinkFilter =  d3.selectAll(".setGroup")
			.append("foreignObject")
			.attr("x",function(d,i){
				if(d.rows%2 == 0){
					return ((side + padding)*(d.cols - (sugGroupFiltersCount - 1))) + padding;
				}
				else{
					return -(side);
				}
				return -((side + padding) * 2);
			})
			.attr("y",function(d,i){
				//return ((side + padding) * d.rows) - 1;
				return -((side) * 2) ;
			})
			.attr("width", function(d){
				//return (side + padding) * (sugGroupFiltersCount);	
				return (side + padding);
			})
			.attr("height", function(d){
				//return side + padding;		
				return ( side + padding	) * sugGroupFiltersCount;
			})
			.attr("class",function(d,i){
				return "subGroupLinkFilter";
			})
			.append('xhtml:div')
			.style("height","100%")
			.style("width","100%")
			.append("div")
			.attr("class","btn-group subGroupLinkFilter")
			.attr("data-toggle","buttons")
			.style("height","100%")
			.style("width","100%");

	var subGroupLnkFilterLabel = subGroupLinkFilter
			.selectAll(".filterGroup")
			.data(sugGroupFilters)
			.enter()
			.append("label")
			.attr("class","btn btn-default subGroupLinkFilter")
			.style("width",side+"px")
			.style("height",side+"px");
	
	var subGroupLnkFilterRadio = subGroupLnkFilterLabel
			.append("input")
			.attr("type","radio")
			.attr("id",function(d){
				return d;
			})
			.attr("class",function(d){
				return "setQueryRadio";
			})
			.attr("name",function(d){
				return d3.select(this.parentNode.parentNode).data()[0].SetName;
			})
			.attr("value",function(d){
				if(d == "AND"){
					return 1;
				}
				if(d == "OR"){
					return 2;
				}
				if(d == "NOT"){
					return 0;
				}
			});
	
	var subGroupLnkFilterText = subGroupLnkFilterLabel
				.append("i")
				.attr("class",function(d){
					if(d == "AND"){
						return "fa fa-check-square-o subGroupLinkFilter1";
					}
					else if(d == "OR"){
						return "fa fa-minus-square-o subGroupLinkFilter1";
					}
					else{
						return "fa fa-square-o subGroupLinkFilter1";
					}
				})
				.attr("aria-hidden","true")
				.style("font-size","9px");*/
	
	
	
	// ---- Rendering group boarders --- //
	// -- Rendering set groups -- //
	
	var subGroupsBoarder = setGridGroup.selectAll(".groupBoarder")
			.data(function(d){
				return d.subSets;
			})
			.enter()  
			.filter(function(d){ 
					if(d.coOrdinates){
						return d.coOrdinates;
					}  
			})
			.append("path")
			.attr("class",function(d){
				return "subGroupBoarder setSubGroup_" + d.elementName.hashCode(); //" deegreeSubGroup_" + d.nrCombinedSets;
			})
			.attr("d", function(d){
				return d.boarderPath;
			})
			.style("fill",function(d){
				/*if(subGroupColor == "Deviation")
					return disproportionalityScale(d.disproportionality);*/
				return SUBGROUP_FILL;
			})
			.style("fill-opacity",SUBGROUP_FILL_OPACITY)
			.style("stroke",function(d){
				//if(subGroupColor == "Deviation")
					//return disproportionalityScale(d.disproportionality);
				return SUBGROUP_STROKE;
			})
			.style("stroke-opacity",SUBGROUP_STROKE_OPACITY)
			.style("stroke-width",function(d){
				if(d.setSize < 10){
					return SMALLER_SUBGROUP_STROKE_WIDTH;
				}
				else{
					return SUBGROUP_STROKE_WIDTH;
				}
			})
			.on("mouseover",function(d){
				drawTempSubGroupLink(d.elementName);
				highlightSetByGroupName(d.elementName);
				tableData.setFilterArgs({
					  subGroupName: d.elementName,
				      isFiltered:true,
				      isSetFiltered:false,
				});
				tableData.refresh();
			})
			.on("mouseout",function(d){
				deHighLightAllSets();
				removeTempSubGroupLink(d.elementName);
				tableData.setFilterArgs({
					  subGroupName: d.elementName,
				      isFiltered:false,
				      isSetFiltered:false,
				});
				tableData.refresh();
			})
			.on("mousedown",function(d){
				d3.event.stopPropagation();
			})
			.on("dblclick",function(d){
				
				var subGroupName = d.elementName;
				var nameIndex = activeSubGroups.indexOf(subGroupName);
				
				if(nameIndex < 0){
					activeSubGroups.push(subGroupName);
				}
				else{
					activeSubGroups.splice(nameIndex, 1);
				}
				updateSubGroupBorders();
				updateSubGroupLinks();
			})
			.on('contextmenu', d3.contextMenu(subGroupContextMenu));
            
	var subGroups = setGridGroup.selectAll("g")
						.data(function(d){
							return d.subSets;
						})
						.enter()  
						.filter(function(d){ 
								if(d.coOrdinates){
									return d.coOrdinates;
								}  
						})
						.append("g")
						.attr("class",function(data){
							return "subSetGroup " + data.elementName;
						});
	
	var elementPixels = subGroups.selectAll("g")
	 					.data(function(d){
			 					return d.coOrdinates;
			 			})
			 			.enter()
			 			.append("g")
			 			.attr("class",function(d){
			 						return "element element_"+d.item;
						})
						.attr('transform',function(d,i){
							return "translate("+(((side + padding)*d.x))+","+(((side + padding)*d.y))+ ")";
						});
	
	
	var seperationGroupLink = svg.selectAll(".seperationGroupLink")
					.data(seperateGroupLinks)
					.enter()
					.insert("line",":first-child")
					.attr("class","seperationGroupLink")
					.attr("x1",function(d){
						var source = data[d.source];
						return source.viewBoxCenter.x;
					})
					.attr("y1",function(d){
						var source = data[d.source];
						return source.viewBoxCenter.y;
					})
					.attr("x2",function(d){
						var target = data[d.target];
						return target.viewBoxCenter.x;
					})
					.attr("y2",function(d){
						var target = data[d.target];
						return target.viewBoxCenter.y;
					})
					.style("stroke","red")
					.style("stroke-width","1.5px")
					.style("stroke-dasharray","5, 3");
	
	renderPixels();
	renderPicture();
	renderElementCharts();
	renderShapeSize();
	renderShapeColor();
	renderShapeOrder();
	renderSubGroupColor();
	updateSubGroupBorders();
	queryElementByAttribute();
	
	function renderPixels(){		 
			elementPixels
				.append("path")
				.attr("class",function(d){
					return "pathElement pathElement_"+d.item;
				});
			
			var elementChartG = elementPixels
								.append("g")
								.attr("class", function(d){
									return "elementChart elementChart_" +d.item;
								});
			
			var chartMask = elementChartG
								.append("mask")
								.attr("x",0)
								.attr("y",0)
								.attr("id",function(d){
									return "chartMask_"+d.item;
								})
								.attr("class", function(d){
									return "elementChart elementChart_" +d.item;
								});
			
			var chartPath = elementChartG
								.append("path")
								.attr("class",function(d){
									return "chartPathElement chartPath_"+d.item;
								});
			
			var chartFillPath = elementChartG
							.append("path")
							.attr("class",function(d){
								return "chartFillPath chartFillPath_"+d.item;
							});
			
			if(pictureAttributes.length > 0){
				elementPixels.append("image")
					.attr("class",function(d){
						return "picElement picElement_"+d.item;
					})
					.attr("x",0)
					.attr("y",0)
					.attr("preserveAspectRatio","xMinYMin slice")
					.on("error", function(d) {
						d3.select(this).style("display","none");
						d3.selectAll(".pathElement_"+d.id)
							.style("opacity",function(d){
								d["imgError"] = true;
								return "1";
							});
				})
			}
			
			d3.selectAll(".element")
				.style("stroke",function(d){
					if(activePixels.indexOf(d.id) > -1){
						return FIXED_ELEMENT_STROKE_COLOR;
					}
					return ELEMENT_STROKE_COLOR;
				})
				.on("mouseover",function(d){
					if(pictureAttributes.length > 0){
						var pictureAttr = $("#shapePicture").val();
						if(pictureAttr != null && pictureAttr != undefined && pictureAttr != "None" ){
							d3.selectAll(".pathElement_"+d.id)
								.style("opacity","1");
						}
					}
					
						var sourceSetId = d3.select(this.parentNode.parentNode).datum().id;
						d3.selectAll(".setGroup")
							.each(function(){
								var elementGroup = d3.select(this).selectAll(".element_" + d.item);
								if(!elementGroup.empty()){
									var setId = d3.select(this).datum().id;
				    				
									d3.selectAll(".setBoarder_"+setId)
				    					.style("stroke","red");
				    				
				    				if(setId != sourceSetId){
				    					d3.selectAll(".similarityLink_"+sourceSetId).filter(".similarityLink_" + setId)
										.style("opacity","0.6")
										.style("stroke","red")
										.style("stroke-opacity","0.8");
				    				}
				    				elementGroup
					    				.style("stroke-width",HIGHLIGHTED_ELEMENT_STROKE_WIDTH)
					    				.style("stroke",HIGHLIGHTED_ELEMENT_STROKE_COLOR);
				    				
				    				if(setSpecificAttributes.length == 1){
				    					elementGroup.attr("fill",function(d){
				    						d["lastFill"] = d3.select(this).style("fill");
				    						var setSpecificElementAttr = setSpecificAttributes[0]["name"];
											 if(d[setSpecificElementAttr] == 1){
												 return falseColor;
											 }
											 else{
												 return trueColor;
											 }
				    					});
										 
							          }
							          else{
							            	//for mutiple set specific values
							          }
				    			}
							})
							
					drawTempSubGroupLink(d.subGroupName);
					
					tableData.setFilterArgs({
						  subGroupName: d.subGroupName,
					      isFiltered:true,
					      isSetFiltered:false,
					});
					
					tableData.refresh();
					grid.scrollRowToTop(tableData.getRowById(d.id));
					
					$(".rowNo_"+d.id).addClass("activeRow");
					$(".selectedRowNo_"+d.id).addClass("activeRow");
					
					updateDetailedListView(d);
					
				})
				.on("mouseout",function(d){
					deHighLightAllSets();
					
					/*if(pictureAttributes.length > 0){
						var pictureAttr = $("#shapePicture").val();
						if(pictureAttr != null && pictureAttr != undefined && pictureAttr != "None" ){
							d3.selectAll(".pathElement_"+d.id)
								.style("opacity",function(d){
									if(d["imgError"]){
										return "1";
									} 
									else{
										return "0";
									}
								});
						}
					}*/
					
					d3.selectAll(".similarityLink")
						.style("opacity","0.2")
						.style("stroke","black")
						.style("stroke-opacity","0.4");
					
					removeTempSubGroupLink(d.subGroupName);
					
					tableData.setFilterArgs({
						  subGroupName: d.subGroupName,
					      isFiltered:false,
					      isSetFiltered:false,
					});
					tableData.refresh();
					if(activePixels.indexOf(d.id) < 0){
						d3.selectAll(".element_" + d.item)
				    		.style("stroke",ELEMENT_STROKE_COLOR)
				    		.style("stroke-width",ELEMENT_STROKE_WIDTH);						
						$(".rowNo_"+d.id).removeClass( "selectedRow" );
					}
					else{
						d3.selectAll(".element_" + d.item)
			    		  .style("stroke",FIXED_ELEMENT_STROKE_COLOR);
						
						if(pictureAttributes.length > 0){
							var pictureAttr = $("#shapePicture").val();
							if(pictureAttr != null && pictureAttr != undefined && pictureAttr != "None" ){
								d3.selectAll(".pathElement_"+d.id)
									.style("opacity","1");
							}
						}
						$(".rowNo_"+d.id).addClass( "selectedRow" );
					}
					if(setSpecificAttributes.length == 1){
						d3.selectAll(".element_" + d.item)
						.attr("fill",function(d){
							return d["lastFill"]; 
						});
					}
					
					grid.scrollRowToTop(0);
					
					$(".rowNo_"+d.id).removeClass( "activeRow" );
					$(".selectedRowNo_"+d.id).removeClass("activeRow");
					
					clearDetailedListView();
				})
				.on("mousedown",function(){
					d3.event.stopPropagation();
				})
				.on("click",function(d,i){
					if (d3.event.ctrlKey) {
				        if(d.eleLink){
				        	window.open(d.eleLink, '_blank');
				        }
				    }
					else{
						var id = d.id;
						var idIndex = activePixels.indexOf(id);
						
						if(idIndex < 0){
							activePixels.push(id);
							activeElements.push(d);
						}
						else{
							activePixels.splice(idIndex,1);
							activeElements.splice(idIndex,1);
						}
						updateSelectedDetailedView(activeElements);
					}
				})
				.on("dblclick",function(d){
					var subGroupName = d.subGroupName;
					var nameIndex = activeSubGroups.indexOf(subGroupName);
					
					if(nameIndex < 0){
						activeSubGroups.push(subGroupName);
					}
					else{
						activeSubGroups.splice(nameIndex, 1);
					}
					//svg.selectAll(".subGroupLinkGroupsTemp").remove();
					updateSubGroupBorders();
					updateSubGroupLinks();
					d3.select(".element_" + d.item).moveToFront();
				});
	}
	
	 function tick() {
		 setGridGroup.attr("transform", function(d,i){			 	
				d.xTransalate = (d.x - (d.width/2));					
				d.yTransalate = (d.y - (d.height/2));
				updateSet(d);
				return "translate(" + d.xTransalate + "," + d.yTransalate + ")";
			});
		 updateSubGroupLinks();
		/* updateSimilarityLinks();		*/ 
	 }
	 function tickEnd(){
		 d3.selectAll(".setGroup").each(function(d,i) {
			 	var location={};
				location["x"] = d.x;
				location["y"] = d.y;
				setLocationInfo[d.SetName] = location;
				d.fx = d.x;
			 	d.fy = d.y;
			});
	 }
	 
    function drawTempSubGroupLink(subGroupName){
    	
    	if(activeSubGroups.indexOf(subGroupName) == -1){
    		 svg.selectAll(".subGroupLinkGroupsTemp").remove();
	   		 var subGroupHash = subGroupName.hashCode();
	   		 
	   		 var tempLinks = returnSubGroupByName(subGroupName);
	   		 
	   		 if(tempLinks.subGroups.length > 1){
	   			 if(GROUPED_BY == GROUP_BY_SET){	
	   	    		d3.selectAll(".setSubGroup_"+subGroupHash)
	   					.style("stroke",function(d,i){
	   							return "none";
	   					})
	   					.style("stroke-opacity",function(d,i){
	   							return "0";
	   					})
	   					.style("stroke-width",function(d,i){
	   							return "0px";
	   					})
	   					.style("fill",function(d,i){
	   						var selectedSubGroupAttr = $("#subColor").val();
	   						if(selectedSubGroupAttr == "None"){
	   							return c20(subGroupHash);
	   						}
	   						else{
	   							subGroupAttrMeanColorScale.domain([numericAttrMeanDomains[selectedSubGroupAttr].min,numericAttrMeanDomains[selectedSubGroupAttr].max]);
	   									var scaledValue = subGroupAttrMeanColorScale(tempLinks.subGroups[0].attrMeans[selectedSubGroupAttr]);
	   									return d3.interpolateYlOrBr(scaledValue);
	   							}
	   					});
	   			 }
	   			 var subGroupGroups = tempLinks.subGroups;
	   			 subGroupGroups.sort(sortSubGroupsLinksOnX);
	   			 
	   			 var processedSubGroupGroups = processSubGroupGroups(tempLinks);
	   			 drawTempLink(processedSubGroupGroups);
   		 	}
    	}
	   		 
	   	if(activeSubGroups.indexOf(subGroupName) != -1){
	   	 var subGroupHash = subGroupName.hashCode();
	   		d3.selectAll(".setSubGroup_"+subGroupHash)
	   			.style("fill-opacity",function(d,i){
	   				return "0.8";
	   			});
	   		
	   		d3.selectAll(".subGroupLink"+ subGroupHash)
   				.style("stroke-opacity","0.8")
   				.style("opacity","0.8");
	   	}
	}
	 
	 function removeTempSubGroupLink(subGroupName){
		 svg.selectAll(".subGroupLinkGroupsTemp").remove();
		 
		 if(activeSubGroups.indexOf(subGroupName) == -1){
			 var subGroupHash = subGroupName.hashCode();
			 if(GROUPED_BY == GROUP_BY_SET){	
		    		d3.selectAll(".setSubGroup_"+subGroupHash)
						.style("stroke",function(d,i){
								return SUBGROUP_STROKE;
						})
						.style("stroke-opacity",function(d,i){
								return SUBGROUP_STROKE_OPACITY;
						})
						.style("stroke-width",function(d,i){
							if(d.setSize < 10){
								return SMALLER_SUBGROUP_STROKE_WIDTH;
							}
							return SUBGROUP_STROKE_WIDTH;
						})
						.style("fill",function(d,i){
							var selectedSubGroupAttr = $("#subColor").val();
							if(selectedSubGroupAttr == "None"){
								return SUBGROUP_FILL;
							}
							else{
								subGroupAttrMeanColorScale.domain([numericAttrMeanDomains[selectedSubGroupAttr].min,numericAttrMeanDomains[selectedSubGroupAttr].max]);
									var scaledValue = subGroupAttrMeanColorScale(d.attrMeans[selectedSubGroupAttr]);
									return d3.interpolateYlOrBr(scaledValue);
							}
						})
						.style("fill-opacity",function(d,i){
							return SUBGROUP_FILL_OPACITY;
						})
				 }
		 }
			if(activeSubGroups.indexOf(subGroupName) != -1){
				var subGroupHash = subGroupName.hashCode();
		   		d3.selectAll(".setSubGroup_"+subGroupHash)
		   			.style("fill-opacity",function(d,i){
		   				return SUBGROUP_FILL_OPACITY;
		   			})
		   		
		   			d3.selectAll(".subGroupLink"+ subGroupHash)
	   					.style("stroke-opacity",function(d,i){
	   						if(d.size > 4){
	   							return SUBGROUP_FILL_OPACITY;
	   						}
	   						else{
	   							return "0.8";
	   						}
	   					})
				   		.style("opacity",function(d,i){
								if(d.size > 4){
									return SUBGROUP_FILL_OPACITY;
								}
								else{
									return "0.8";
								}
							});
		   	}
	 }
	 
	 function drawTempLink(processedSubGroupGroups){
		 var subGroupLinkGroups = svg.selectAll(".subGroupLinkGroupsTemp")
			.data(processedSubGroupGroups)
			.enter()
			.append("g")
			.attr("class",function(d,i){
				return "subGroupLinkGroupsTemp subGroupLinkGroupsTemp" + d.name.hashCode() + "_" + i;
			});

		 var subGroupDefs = subGroupLinkGroups
			.append("defs")
			.attr("class",function(d,i){
					return "subGroupDefsTemp subGroupDefsTemp_ "+ d.name.hashCode() + "_" + i;
			});
		
		 var clipPaths = subGroupDefs
			.append("clipPath")
			.attr("id",function(d,i){
				return "subGroupLinkClipPathTemp_"+ d.subGroups[0].elementName.hashCode()+ "_" +d.subGroups[1].elementName.hashCode() + "_" + i;
			})
			.append("path")
			.attr("d",function(d){
				return computeNewSingleClipPath(d);
			}); 
		
		var subGroupLinks = subGroupLinkGroups
				.append("path")
				.attr("class",function(d,i){
					return "subGroupLinkTemp subGroupLinkTemp" + d.name.hashCode() + "_" + i;
				})
				.attr("d",function(d){
					return drawsubGroupLink(d);
				})
				.attr("stroke-width", function(d){
					return (d.size) * linkThicknessFactor;
				})
				.attr("stroke-linecap","butt")
				.attr("fill", "none")
				.attr("clip-path", function(d,i){	
					return "url(#subGroupLinkClipPathTemp_"+ d.subGroups[0].elementName.hashCode()+ "_" +d.subGroups[1].elementName.hashCode() + "_" + i + ")";
				})
				.style("stroke",function(d,i){
					var selectedSubGroupAttr = $("#subColor").val();
					if(selectedSubGroupAttr == "None"){
						return c20(d.name.hashCode());
					}
					else{
						subGroupAttrMeanColorScale.domain([numericAttrMeanDomains[selectedSubGroupAttr].min,numericAttrMeanDomains[selectedSubGroupAttr].max]);
								var scaledValue = subGroupAttrMeanColorScale(d.subGroups[0].attrMeans[selectedSubGroupAttr]);
								return d3.interpolateYlOrBr(scaledValue);
						}
					
				})
				.style("stroke-opacity",function(d){
				
				if(d.size > 4){
					return SUBGROUP_FILL_OPACITY;
				}
				else{
					return "0.8";
				}
			})
			.style("opacity",function(d){
				
				if(d.size > 4){
					return SUBGROUP_FILL_OPACITY;
				}
				else{
					return "0.8";
				}
			});
	 }
	 
	function dragstarted(d) {
		 
		d3.select(this).moveToFront();
		d3.selectAll(".subGroupLinkGroups").moveToFront();
		
		if(d.fx == null){
			 d3.selectAll(".setGroup").each(function(d,i) {
					d.fx = d.x;
				 	d.fy = d.y;
				});
		}
		var mouseX = d3.event.x;
		var mouseY = d3.event.y;
		var originalLeft = d.xTransalate;
		var originalTop = d.yTransalate;
		
		xDifference = mouseX - originalLeft;
		yDifference = mouseY - originalTop;
		
		draggedSetId = d.id; 
		
		d.startFx = d.fx;
		d.startFy = d.fy;
	}

	function dragged(d) {
		var mouseX = d3.event.x;
		var mouseY = d3.event.y;		

		d.xTransalate = mouseX - xDifference;					
		d.yTransalate = mouseY - yDifference;
		
		d.x = d.xTransalate + (d.width/2);
		d.y = d.yTransalate + (d.height/2);
		
		d.fx = d.x;
		d.fy = d.y;
		
		d3.select(this)
			.attr("transform", function(d){	
				updateSet(d);
				return "translate(" + d.xTransalate + "," + d.yTransalate + ")";
		});
		
		if((d3.selectAll(".subGroupLinkGroups_set_" + d.id).size()) > 0) {
			updateFixedLinksBySet(d.id);
		}
		
		d3.selectAll(".seperationGroupLink")
			.attr("x1",function(d){
				return data[d.source].viewBoxCenter.x;
			})
			.attr("y1",function(d){
				return data[d.source].viewBoxCenter.y;
			})
			.attr("x2",function(d){
				return data[d.target].viewBoxCenter.x;
			})
			.attr("y2",function(d){
				return data[d.target].viewBoxCenter.y;
			});
		
		 /*updateSimilarityLinks();	*/	 
		 
		    var currentSet = d;
			var isMatched = false;
			var matchedSet = null;
			var matchedSetId = null;
			
			var boxCenterX = currentSet.viewBoxCenter.x;
			var boxCenterY = currentSet.viewBoxCenter.y;
			
			var boxX1 = currentSet.viewBoxBoundaries.x1;
			var boxX2 = currentSet.viewBoxBoundaries.x2;
			var boxY1 = currentSet.viewBoxBoundaries.y1;
			var boxY2 = currentSet.viewBoxBoundaries.y2;
			
			d3.selectAll(".setGroup").each(function(d,i) { 
				if(currentSet !== d){
					matchedSet = d.SetName;
					matchedSetId = d.id
					var targetBoxCenterX = d.viewBoxCenter.x;
					var targetBoxCenterY = d.viewBoxCenter.y;
					
					var targetBoxX1 = d.viewBoxBoundaries.x1;
					var targetBoxX2 = d.viewBoxBoundaries.x2;
					var targetBoxY1 = d.viewBoxBoundaries.y1;
					var targetBoxY2 = d.viewBoxBoundaries.y2;
					
							if((boxCenterX > targetBoxX1 && boxCenterX < targetBoxX2)){ // || (targetBoxCenterX > boxX1 && boxX1 < boxX2 ) ){
								if((boxCenterY > targetBoxY1 && boxCenterY < targetBoxY2)){ //  || (targetBoxCenterY > boxY1 && targetBoxCenterY < boxY2)){
									isMatched = true;
									matchedSet = d.SetName;	
									matchedSetId = d.id
								}
							}
							else if((targetBoxCenterX > boxX1 && targetBoxCenterX < boxX2 )){
								if((targetBoxCenterY > boxY1 && targetBoxCenterY < boxY2)){
									isMatched = true;
									matchedSet = d.SetName;	
									matchedSetId = d.id
								}
							}
					else{
					}
				}
			});
		 
			if(isMatched){
				d3.select(".setBoarder_"+matchedSetId)
					.style("stroke","red");
			}
			else{
				deHighLightSetsByID(matchedSetId)
			}	
	}

	function dragended(d) {
		var currentSet = d;
		var isCollided = false;
		var isMatched = false;
		
		var boxCenterX = currentSet.viewBoxCenter.x;
		var boxCenterY = currentSet.viewBoxCenter.y;
		
		var boxX1 = currentSet.viewBoxBoundaries.x1;
		var boxX2 = currentSet.viewBoxBoundaries.x2;
		var boxY1 = currentSet.viewBoxBoundaries.y1;
		var boxY2 = currentSet.viewBoxBoundaries.y2;
		
		d3.selectAll(".setGroup").each(function(d,i) { 
			if(currentSet !== d){
				var targetBoxCenterX = d.viewBoxCenter.x;
				var targetBoxCenterY = d.viewBoxCenter.y;
				
				var targetBoxX1 = d.viewBoxBoundaries.x1;
				var targetBoxX2 = d.viewBoxBoundaries.x2;
				var targetBoxY1 = d.viewBoxBoundaries.y1;
				var targetBoxY2 = d.viewBoxBoundaries.y2;
				
				if((boxX1 >targetBoxX1 && boxX1 < targetBoxX2) || (boxX2 > targetBoxX1 && boxX2 < targetBoxX2) || (targetBoxX1 >boxX1 && targetBoxX1 < boxX2) || (targetBoxX2 >boxX1 && targetBoxX2 < boxX2) ){
					if((boxY1 > targetBoxY1 && boxY1 < targetBoxY2) || (boxY2 > targetBoxY1 && boxY2 < targetBoxY2) || (targetBoxY1 >boxY1 && targetBoxY1 < boxY2) || (targetBoxY2 > boxY1 && targetBoxY2 < boxY2)){
						isCollided = true;
						if((boxCenterX > targetBoxX1 && boxCenterX < targetBoxX2) || (targetBoxCenterX > boxX1 && targetBoxCenterX < boxX2 ) ){
							if((boxCenterY > targetBoxY1 && boxCenterY < targetBoxY2) || (targetBoxCenterY > boxY1 && targetBoxCenterY < boxY2)){
								isMatched = true;
								oprSet1 = currentSet;
								oprSet2 = d;
								
								d3.select(".selectOperation").moveToFront();
								
								d3.selectAll(".selectOperation")
									.style("opacity",0.9)
									.attr("transform", "translate(" + ((d.viewBoxBoundaries.x1)+((d.width)/2) - (oprMenueItemWidth/2)) + "," + d.viewBoxBoundaries.y1 + ")");
								
								d3.selectAll(".oprMenueItemLabel")
									.each(function(oprMenueItemLabel,i){
										d3.select(this).selectAll(".oprMenueItemLabelLine")
											.html(function(oprMenueItemLabelLine,j){
												if(i == 4){
													if(j==1){
														return oprMenueItemLabelLine;
													}
												}
												else if(i == 3){
													if(j==0){
														return d.SetName;
													}
													if(j==1){
														return "&#8722;";
													}
													if(j==2){
														return currentSet.SetName;
													}
												}
												else if(i == 2){
													if(j==0){
														return currentSet.SetName;
														
													}
													if(j==1){
														return "&#8722;";
													}
													if(j==2){
														return d.SetName;
													}
												}
												else if(i == 1){
													if(j==0){
														return currentSet.SetName;
													}
													if(j==1){
														return "&#8745;";
													}
													if(j==2){
														return d.SetName;
													}
												}
												else if(i == 0){
													if(j==0){
														return currentSet.SetName;
													}
													if(j==1){
														return "&#8746;";
													}
													if(j==2){
														return d.SetName;
													}
												}
											})
									})
									
									$('.legend-div').find('*').attr('disabled', true);
									d3.selectAll(".setGroupG").selectAll("*").classed('disabled-element ', true);

								opredSet = currentSet;
							}
						}
					}
				}
			}
		});
		
		if((isCollided) && (!isMatched)){
			currentSet.fx = currentSet.startFx;
			currentSet.fy = currentSet.startFy;
			simulation.restart();	
		}
		
		if(!isMatched){
			var location={};
			location["x"] = d.x;
			location["y"] = d.y;
			setLocationInfo[d.SetName] = location;
		}
	} 
	function zoom(){		
		var transform = d3.zoomTransform(this);
		
		transform.scale(currentZoomLevel);
		transform.applyX(currentSVGTranslateX);
		transform.applyY(currentSVGTranslateY);
		
		currentSVGTranslateX = transform.x;
		currentSVGTranslateY = transform.y;
		currentZoomLevel = transform.k;
		
		d3.selectAll(".baseG").attr("transform", transform) ;
	}
}

function renderPicture(){
	if(pictureAttributes.length > 0){
		var pictureAttr = $("#shapePicture").val();
		
		if(pictureAttr != null && pictureAttr != undefined && pictureAttr != "None" ){
			 
			d3.selectAll(".picElement")
				.attr("xlink:href", function(d){				
					return d[pictureAttr];
				})
				.style("display",function(d){
					return "inline";
				})
			
			d3.selectAll(".pathElement")
				.style("opacity",function(d){
					if(activePixels.indexOf(d.id) != -1 || d["imgError"] == true){
	    				return 1;
	    			}
	    			else{
	    				return 1;
	    			}
				});
			
			ACTIVE_ELEMENT_OPACITY = "1";
			
			/*d3.selectAll(".element")
				.style("opacity",function(d){
						if(d["isActive"] == true){
							return ACTIVE_ELEMENT_OPACITY;
						}
						else{
							return InACTIVE_ELEMENT_OPACITY; 
						}
				});*/
			
			$("#shapeColor").prop("disabled", true);
			$(".elementColor-svg").hide();
			$(".elementCategoryColor-svg").hide();
		}
		else{
			$("#shapeColor").prop("disabled", false);
			
			d3.selectAll(".picElement")
				.style("display","none");
		
			d3.selectAll(".pathElement")
				.style("opacity","1");
			
			ACTIVE_ELEMENT_OPACITY = "0.7";
			
			d3.selectAll(".element")
				.style("opacity",function(d){
						if(d["isActive"] == true){
							return ACTIVE_ELEMENT_OPACITY;
						}
						else{
							return InACTIVE_ELEMENT_OPACITY; 
						}
				});
			
			var selectedColorAttr = $('#shapeColor').val();
			
			if(selectedColorAttr != "None"){
				var isCategortAttr = $('#shapeColor').find(":selected").attr("isCateg");
				var isDateAttr = $('#shapeColor').find(":selected").attr("isdate");
				if(isCategortAttr == "true"){
					$(".elementColor-svg").hide();
					$(".elementCategoryColor-svg").show();
				}
				else if(isDateAttr == "true"){
					$(".elementCategoryColor-svg").hide();
					$(".elementColor-svg").show();
				}
				else{
					$(".elementCategoryColor-svg").hide();
					$(".elementColor-svg").show();
				}
			}
			else{
				$(".elementColor-svg").hide();
				$(".elementCategoryColor-svg").hide();
			}
		}
	}  
}

function renderElementCharts(){
	
	
	if(isElementPictured){
		
	}
	else{
		var selectedShape = $("#shapeShape").val();
		var selectedBarAttr = $('#shapeBar').val();
		
		var type;
		
		sym = d3.symbol();		
		type = elementSymbols[selectedShape][0];
						
		sym.type(type);	
		
		if(selectedBarAttr == "None"){
			d3.selectAll(".elementChart")
				.attr("visibility","hidden");
			
			d3.selectAll(".pathElement")
			.attr("visibility","visible");
		}
		
		else{
			d3.selectAll(".elementChart")
			.attr("visibility","visible");
			
			d3.selectAll(".pathElement")
			.attr("visibility","hidden");
			
			
		}
	}
}

function renderShapeSize(){		
	if(isElementPictured){
		
		
	}
	else{
		var selectedShape = $("#shapeShape").val();
		var selectedSizeAttr = $('#shapeSize').val();
		var isDateAttr = $('#shapeSize').find(":selected").attr("isdate");
		var type;
		
		sym = d3.symbol();		
		type = elementSymbols[selectedShape][0];
						
		sym.type(type);	
		
		if(selectedSizeAttr == "None"){
			sym.size(side*side);
			
			d3.selectAll(".pathElement")
		    	.attr("d",function(d){
		    		return sym();
		    	})
		    	
	    	if(pictureAttributes.length > 0){
	    		d3.selectAll(".picElement")
	    			.attr("height",side)
	    			.attr("width",side)
	    			.attr("transform",function(d){
	    	    		return "translate(" + 0 + "," + 0 +")"; 
	    	    	});
			}
		}
		else if(isDateAttr == "true"){
			pixelDateAttrSizeScale.domain([dateAttrDomins[selectedSizeAttr].min.toDate(), dateAttrDomins[selectedSizeAttr].max.toDate()]);
			d3.selectAll(".pathElement")
	    	.attr("d",function(d){
	    		var scaledValue = pixelDateAttrSizeScale(d["moment_"+selectedSizeAttr].toDate());
	    		sym.size(scaledValue * scaledValue);
	    		return sym();
	    	})
	    	if(pictureAttributes.length > 0){
	    		d3.selectAll(".picElement")
	    			.attr("height",function(d){
	    	    		var scaledValue = pixelDateAttrSizeScale(d["moment_"+selectedSizeAttr].toDate());
	    	    		return (scaledValue);
	    	    	})
	    			.attr("width",function(d){
	    	    		var scaledValue = pixelDateAttrSizeScale(d["moment_"+selectedSizeAttr].toDate());
	    	    		return (scaledValue);
	    	    	})
	    	    	.attr("transform",function(d){
	    	    		var scaledValue = pixelDateAttrSizeScale(d["moment_"+selectedSizeAttr].toDate());
	    	    		var differenceSize = side - scaledValue;
	    	    		return "translate(" + (differenceSize/2) + "," + (differenceSize/2) +")"; 
	    	    	});
			}
		}
		else{
			console.log("new changes 7 !!");
			pixelAttrSizeScale.domain([numericAttrDomins[selectedSizeAttr].min,numericAttrDomins[selectedSizeAttr].max]);
			d3.selectAll(".pathElement")
		    	.attr("d",function(d){
		    		var scaledValue = pixelAttrSizeScale(d[selectedSizeAttr]);
		    		//console.log(scaledValue);
		    		sym.size(scaledValue * scaledValue);
		    		return sym();
		    	})
	    	if(pictureAttributes.length > 0){
	    		d3.selectAll(".picElement")
    			.attr("height",function(d){
    				var scaledValue = pixelAttrSizeScale(d[selectedSizeAttr]);
		    		return (scaledValue);
    	    	})
    			.attr("width",function(d){
    				var scaledValue = pixelAttrSizeScale(d[selectedSizeAttr]);
		    		return (scaledValue);
    	    	})
    	    	.attr("transform",function(d){
    	    		var scaledValue = pixelAttrSizeScale(d[selectedSizeAttr]);
    	    		var differenceSize = side - scaledValue;
    	    		return "translate(" + (differenceSize/2) + "," + (differenceSize/2) +")";
	    	    });
	    	}
		}
		
		d3.selectAll(".pathElement")
	    	.attr('transform',function(d,i){
	        	return "translate("+((side/2))+","+((side/2))+") rotate(" + elementSymbols[selectedShape][1]+ ")";
	        });
	}
}

function renderShapeColor(){
	if(isElementPictured){
		
	}
	else{
		var selectedColorAttr = $('#shapeColor').val();
		if(selectedColorAttr == "None"){
			d3.selectAll(".element")
				.attr("fill",ELEMENT_DEFAULT_FILL);
			
		}
		else{
			var isCategortAttr = $('#shapeColor').find(":selected").attr("isCateg");
			var isDateAttr = $('#shapeColor').find(":selected").attr("isdate");
			
			if(isCategortAttr == "true"){
				var categories;
				for(var c=0; c < categoryAttribute.length; c++){
					if(categoryAttribute[c].name == selectedColorAttr){
						categories = categoryAttribute[c].categories;
					}
				}
				d3.selectAll(".element")
				.attr("fill",function(d){
					var attrValue = d[selectedColorAttr];
					return colores(categories.indexOf(attrValue));
				});
			}
			else if(isDateAttr == "true"){
				pixelDateAttrColorScale.domain([dateAttrDomins[selectedColorAttr].min.toDate(), dateAttrDomins[selectedColorAttr].max.toDate()]);
				d3.selectAll(".element")
				.attr("fill",function(d){
					var scaledValue = pixelDateAttrColorScale(d["moment_"+selectedColorAttr].toDate());
					return d3.interpolateBlues(scaledValue);
				});
			}
			else{
				pixelAttrColorScale.domain([numericAttrDomins[selectedColorAttr].min,numericAttrDomins[selectedColorAttr].max]);
				d3.selectAll(".element")
				.attr("fill",function(d){
					var scaledValue = pixelAttrColorScale(d[selectedColorAttr]);
					return d3.interpolateBlues(scaledValue); 
				});
			}
		}
	}
}

function renderShapeOrder(){
	var selectedOrderAttr = $('#shapeOrder').val();
	var selectedShape = $("#shapeShape").val();
	 
	 if(selectedOrderAttr != "None"){
		 var isCategortAttr = $('#shapeOrder').find(":selected").attr("isCateg");
		 var isDateAttr = $('#shapeOrder').find(":selected").attr("isdate");
		 d3.selectAll(".subSetGroup")
		  	.each(function(d){
		  		d.coOrdinates.sort(sortSubGroupElements);
		  		var coOrdinates = d.coOrdinates;
		  		var orderedCoOrdinates = [];
		  		for(var i=0; i<coOrdinates.length; i++){
		  			var position = {};
		  			position["x"] = coOrdinates[i].x;
		  			position["y"] = coOrdinates[i].y;
		  			orderedCoOrdinates.push(position);
		  		}
		  		d["orderedCoOrdinates"] = orderedCoOrdinates;
		  		if(isCategortAttr == "true"){
		  			d.coOrdinates.sort(sortElementByAttr(selectedOrderAttr,true));
		  		}
		  		else if(isDateAttr == "true"){
		  			d.coOrdinates.sort(sortElementByDateAttr(selectedOrderAttr));
		  		}
		  		else{
		  			d.coOrdinates.sort(sortElementByAttr(selectedOrderAttr,false));
		  		}
		  		
		  		
		  		for(var i=0; i<coOrdinates.length; i++){
		  			coOrdinates[i].x = orderedCoOrdinates[i].x;
		  			coOrdinates[i].y = orderedCoOrdinates[i].y;
		  		}
		  	})
		  	
		  	d3.selectAll(".element")
		  	.attr('transform',function(d,i){
	        	return "translate("+(((side + padding)*d.x))+","+(((side + padding)*d.y))+ ")";
	        })
	 }
}
function renderSubGroupColor(){
	var selectedSubGroupAttr = $("#subColor").val();
	if(selectedSubGroupAttr == "None"){
		d3.selectAll(".subGroupBoarder")
			.style("fill",SUBGROUP_FILL);
	}
	else{
		subGroupAttrMeanColorScale.domain([numericAttrMeanDomains[selectedSubGroupAttr].min,numericAttrMeanDomains[selectedSubGroupAttr].max]);
		d3.selectAll(".subGroupBoarder")
			.style("fill",function(d){
				var scaledValue = subGroupAttrMeanColorScale(d.attrMeans[selectedSubGroupAttr]);
				return d3.interpolateYlOrBr(scaledValue);
			});
		}
}
function highlightSetByGroupName(subGroupName){
	d3.selectAll(".setGroup")
		.each(function(d){
			if(subGroupName.split(" ").indexOf(d.SetName) != -1){
				var id = d.id;
				d3.select(".setBoarder_"+id)
					.style("stroke","red");
			}
		});
}
function deHighLightAllSets(){
	d3.selectAll(".setBoarder")
		.style("stroke",function(d){
			if(d.isOpr){
				return USER_SET_STROKE;
			}
			else{
				return SET_STROKE;
			}
		});
}

function deHighLightSetsByID(setID){
	d3.selectAll(".setBoarder_"+setID)
		.style("stroke",function(d){
			if(d.isOpr){
				return USER_SET_STROKE;
			}
			else{
				return SET_STROKE;
			}
		});
}

function updateSubGroupBorders(){
	
	d3.selectAll(".subGroupBoarder")
		.style("stroke",function(d,i){
				return SUBGROUP_STROKE;
		})
		.style("stroke-opacity",function(d,i){
				return SUBGROUP_STROKE_OPACITY;
		})
		.style("stroke-width",function(d,i){
			if(d.setSize < 10){
				return SMALLER_SUBGROUP_STROKE_WIDTH;
			}
			else{
				return SUBGROUP_STROKE_WIDTH;
			}
		})
		.style("fill",function(d,i){
			var selectedSubGroupAttr = $("#subColor").val();
			if(selectedSubGroupAttr == "None"){
				return SUBGROUP_FILL;
			}
			else{
				subGroupAttrMeanColorScale.domain([numericAttrMeanDomains[selectedSubGroupAttr].min,numericAttrMeanDomains[selectedSubGroupAttr].max]);
					var scaledValue = subGroupAttrMeanColorScale(d.attrMeans[selectedSubGroupAttr]);
					return d3.interpolateYlOrBr(scaledValue);
			}
		});
	
	 for(var k=0; k < activeSubGroups.length; k++){
			d3.selectAll(".setSubGroup_"+activeSubGroups[k].hashCode())
				.style("stroke",function(d,i){
						return "none";
				})
				.style("stroke-opacity",function(d,i){
						return 0;
				})
				.style("stroke-width",function(d,i){
						return 0;
				})
				.style("fill",function(d,i){
					var selectedSubGroupAttr = $("#subColor").val();
					if(selectedSubGroupAttr == "None"){
						return c20(d.elementName.hashCode());
					}
					else{
						subGroupAttrMeanColorScale.domain([numericAttrMeanDomains[selectedSubGroupAttr].min,numericAttrMeanDomains[selectedSubGroupAttr].max]);
								var scaledValue = subGroupAttrMeanColorScale(d.attrMeans[selectedSubGroupAttr]);
								return d3.interpolateYlOrBr(scaledValue);
						}
				});
		}
}
function updateSubGroupLinks(){
	 
	var filteredLinks = subGroupsLinks.filter(isSubgroupActiveByName);
	
	for(var index=0; index < filteredLinks.length; index++){
			filteredLinks[index].subGroups.sort(sortSubGroupsLinksOnX);
		}
	processedfilteredLinks = processSubGroupLinks(filteredLinks);
	
	drawFixedLinks(processedfilteredLinks);
}

function drawFixedLinks(processedSubGroupGroups){
	 
	 d3.selectAll(".subGroupLinkGroups").remove();
	 
	 var subGroupLinkGroups = svg.selectAll(".subGroupLinkGroups")
		.data(processedSubGroupGroups)
		.enter()
		.append("g")
		.attr("class",function(d,i){
			return "subGroupLinkGroups subGroupLinkGroups_set_" + d.source + " subGroupLinkGroups_set_" + d.target + " subGroupLinkGroups_" + d.name.hashCode() + "_" + d.index;
		});
	 
	 var subGroupDefs = subGroupLinkGroups
		.append("defs")
		.attr("class",function(d,i){
				return "subGroupDefs subGroupDefs_"+ d.name.hashCode()+ "_" + d.index;
		});

	 var clipPaths = subGroupDefs
		.append("clipPath")
		.attr("id",function(d,i){
			return "subGroupLinkClipPath_"+ d.name.hashCode()+ "_" + d.index;
		})
		.append("path")
		.attr("class",function(d,i){
			return "subGroupLinkClipPathPath subGroupLinkClipPathPath_" + d.source + " subGroupLinkClipPathPath_" + d.target + 
						" subGroupLinkClipPathPath_"+ d.name.hashCode()+ "_" + d.index;
		})
		.attr("d",function(d){
			return computeNewSingleClipPath(d);
		}); 

	var subGroupLinks = subGroupLinkGroups
			.append("path")
			.attr("class",function(d,i){
				return "subGroupLink subGroupLink_" +  d.source  + " subGroupLink_" +  d.target  + " subGroupLink" + d.name.hashCode() + " subGroupLink" + d.name.hashCode()+"_" + d.index;
			})
			.attr("d",function(d){
				return drawsubGroupLink(d);
			})
			.attr("stroke-width", function(d){
				return (d.size) * linkThicknessFactor;
			})
			.attr("stroke-linecap","butt")
			.attr("fill", "none")
			.attr("clip-path", function(d,i){	
				return "url(#subGroupLinkClipPath_"+ d.name.hashCode()+ "_" + d.index + ")";
			})
			.style("stroke",function(d,i){
				var selectedSubGroupAttr = $("#subColor").val();
				if(selectedSubGroupAttr == "None"){
					return c20(d.name.hashCode());
				}
				else{
					subGroupAttrMeanColorScale.domain([numericAttrMeanDomains[selectedSubGroupAttr].min,numericAttrMeanDomains[selectedSubGroupAttr].max]);
							var scaledValue = subGroupAttrMeanColorScale(d.subGroups[0].attrMeans[selectedSubGroupAttr]);
							return d3.interpolateYlOrBr(scaledValue);
					}
				
			})
			.style("stroke-opacity",function(d){
				if(d.size > 4){
					return SUBGROUP_FILL_OPACITY;
				}
				else{
					return "0.8";
				}
			})
			.style("opacity",function(d){
				
				if(d.size > 4){
					return SUBGROUP_FILL_OPACITY;
				}
				else{
					return "0.8";
				}
			})
			.on("mouseover",function(d,i){
				
			})
			.on("mouseout",function(d,i){
				
			})
			.on("dblclick",function(d){
				
			});
}

function updateFixedLinksBySet(setID){

	d3.selectAll(".subGroupLinkClipPathPath_" + setID)
			.attr("d",function(d){
				return computeNewSingleClipPath(d);
			});
		
	d3.selectAll(".subGroupLink_" + setID )
			.attr("d",function(d){
				return drawsubGroupLink(d);
			})
			.attr("clip-path", function(d,i){	
				return "url(#subGroupLinkClipPath_"+ d.name.hashCode()+ "_" + d.index + ")";
			});
}