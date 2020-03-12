function renderSetQuerySection(data){
	
	d3.select(".used-counter").text(data.length);
	
	$("#setQueryView").empty();
	
	for(var i=0; i<data.length; i++){
		data[i]["index"] = i;
	}
	
	 var setListDiv = d3.select('#setQueryView')
		.selectAll('.setQueryPanel')
		.data(data)
		.enter()
		.append('div')
		.attr("class","new-row setQueryPanel");
	 
	var setName = d3.selectAll(".setQueryPanel")
		.append("div")
		.attr("class","setQuerySetName pull-left")
		.attr("data-toggle","tooltip")
		.attr("data-placement","top")
		.attr("title",function(d){
			var toolTipName = d.SetName.valueOf();
			//toolTipName = toolTipName.replace("&#8746;","&cup;");
			toolTipName = $.parseHTML( toolTipName );
			return toolTipName[0].data;
		})
		.html(function (d) { return d.SetName;});
	
	/*$('[data-toggle="tooltip"]').tooltip();  */ 
		/*.append("span")
		.attr("class","tooltiptext")
		.html(function (d) { return d.SetName;});*/
	
	var radioDiv = d3.selectAll(".setQueryPanel")
	.append("div")
	.attr("class","radioButton-conatiner pull-right");

	var notRadioButton = d3.selectAll(".radioButton-conatiner")
			.append("div")
			.attr("class","singleRadio-conatiner pull-right")
			.append("input")
			.attr("type","radio")
			.attr("class","setQueryRadio")
			.attr("name",function(d){
				return d.index;
			})
			.attr("value","0");
	
	var mayRadioButton = d3.selectAll(".radioButton-conatiner")
				.append("div")
				.attr("class","singleRadio-conatiner pull-right")
				.append("input")
				.attr("type","radio")
				.attr("class","setQueryRadio")
				.attr("checked","checked")
				.attr("name",function(d){
					return  d.index;
				})
				.attr("value","2");
	
	var mustRadioButton = d3.selectAll(".radioButton-conatiner")
			.append("div")
			.attr("class","singleRadio-conatiner pull-right")
			.append("input")
			.attr("type","radio")
			.attr("class","setQueryRadio")
			.attr("name",function(d){
				return d.index;
			})
			.attr("value","1");
	

	d3.selectAll(".setQueryRadio").on("change",function(){
		querySubGroupsBySets();
	});
}


	