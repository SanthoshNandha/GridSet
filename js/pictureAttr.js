function addPictureAttributes(){
	if(pictureAttributes.length > 0){
		$(".legend-picture").show();
		$('#shapePicture')
	    	.append($("<option></option>")
	            .attr("value","None")
	            .text("None")); 
		
		for(var c=0; c < pictureAttributes.length; c++){
    		$('#shapePicture')
    	    .append($("<option></option>")
    	            .attr("value",pictureAttributes[c].name)
    	            .text(pictureAttributes[c].name));
    	}
	}
	else{
		$(".legend-picture").hide();
	}
}

function renderSearchFilter(){
	
	var searchCard = d3.selectAll("#search-attribute-section")
						.selectAll(".searchCard")
						.data(searchAttribute)
						.enter()
						.append("div")
						.attr("class",function(d){
							return "new-row searchCard searchCard_"+d.name;
						})
						.style("margin-bottom",function(d,i){
							if(i == (searchAttribute.length -1))
								return "6px";
						});
	
	var searchAttrName = searchCard
							.append("div")
							.attr("class",function(d){
								return "new-row mini-header-tab searchAttrName searchAttrName_"+d.name;
							})
							.text(function(d){
								return "By " + d.name;
							});
	var searchBox = searchCard
						.append("div")
						.attr("class",function(d){
							return "new-row searchBox searchBox"+d.name;
						})
						/*.append("select")
						.attr("multiple","multiple")*/
						.append("input")
						.attr("id",function(d){
							return "searchAttr_"+d.name;
						})
						.attr("searchAttr",function(d){
							return d.name;
						})
						.style("width","95%");
	
	for(var i=0; i < searchAttribute.length; i++){
		/* $('#searchAttr_'+searchAttribute[i].name).multipleSelect({
	            filter: true,
	            selectAll: true,
	            maxHeightType : 50,
	            onClose : function(view) {
	            	queryElementByAttribute();
	            },
	            onClick : function(view) {
	            	queryElementByAttribute();
	            },
	        });*/
		
		var searchArray = [];
		
		$( '#searchAttr_'+searchAttribute[i].name) // don't navigate away from the field on tab when selecting an item
	      .on( "keydown", function( event ) {
	          if ( event.keyCode === $.ui.keyCode.TAB &&
	              $( this ).autocomplete( "instance" ).menu.active ) {
	        	  	event.preventDefault();
	          }
	        });
	}
}

var attrArrays = {};
function updateSearchFilters(data){
	for(var l=0; l < searchAttribute.length; l++){
		//$('#searchAttr_'+searchAttribute[l].name).empty();
		addedIds = [];
		var dataArray = [];
		for(var i=0; i<data.length; i++){
			var subGroups = data[i].subSets;
			for(var j=0; j<subGroups.length;j++){
				var coOrdinates = subGroups[j].coOrdinates;
				for(var k=0; k < coOrdinates.length; k++){
					if(addedIds.indexOf(coOrdinates[k].id) == -1){
						addedIds.push(coOrdinates[k].id);
						if(dataArray.indexOf(coOrdinates[k][searchAttribute[l].name]) == -1){
							dataArray.push(coOrdinates[k][searchAttribute[l].name]);
							/*$('#searchAttr_'+searchAttribute[l].name)
					          .append($('<option>', { value : coOrdinates[k][searchAttribute[l].name] })
					          .text(coOrdinates[k][searchAttribute[l].name]));*/
						}
					}
				}
			}
		}
		attrArrays[searchAttribute[l].name] = dataArray;
		var serAttName = searchAttribute[l].name;
		//$('#searchAttr_'+searchAttribute[l].name).multipleSelect("refresh");
		
		$( '#searchAttr_'+serAttName)
		.focus(function() {
			 serAttName = $(this).attr("searchAttr");
		})
		.autocomplete({
	          minLength: 0,
	          source: function( request, response ) {
	            // delegate back to autocomplete, but extract the last term
	            response( $.ui.autocomplete.filter(
	            		attrArrays[serAttName], extractLast( request.term ) ) );
	          },
	          focus: function() {
	            // prevent value inserted on focus
	            return false;
	          },
	          select: function( event, ui ) {
	            var terms = split( this.value );
	            // remove the current input
	            terms.pop();
	            // add the selected item
	            terms.push( ui.item.value );
	            // add placeholder to get the comma-and-space at the end
	            terms.push( "" );
	            this.value = terms.join( ", " );
	            queryElementByAttribute();
	            return false;
	          },
	          change:function( event, ui ) {
	        	  queryElementByAttribute();
	          }
	        });
	}
}

function split( val ) {
    return val.split( /,\s*/ );
}
  function extractLast( term ) {
    return split( term ).pop();
}

function renderDetailedListView(){
	
	var table = d3.select("#listDataViewDiv")
					.append("table")
					.attr("class","table")
					.append("tbody");
	
	var tableRows = table.selectAll(".listTableRow")
					.data(attributes)
					.enter()
					.append("tr")
					.filter(function(d){
						return d.tableDisplay == "true";
					})
					.attr("class","listTableRow");
	
	var attrNameCell = tableRows
						.append("td")
						.attr("class","attrCell attrNameCell")
						.html(function(d){
							return d.name + " :";
						});
	
	var attrValueCell = tableRows
							.append("td")
							.attr("class","attrCell attrNameValue");
}



function updateDetailedListView(data){
	d3.selectAll(".attrNameValue")
			.html(function(d){
				return data[d.name];
			});
}
function clearDetailedListView(){
	d3.selectAll(".attrNameValue")
	.html(function(d){
		return "";
	});
}