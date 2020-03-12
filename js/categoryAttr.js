function renderCategoryFilter(categoryAttrs){

	var card = d3.select("#category-attribute-accordion")
					.selectAll("div")
					.data(categoryAttrs)
					.enter()
					.append("div")
					.attr("class",function(d,i){
						return "new-row card card_"+d.name;
					});
		
		var card_header = card.append("div")
							.attr("class",function(d,i){
								return "new-row mini-header-tab card-header card-header_"+d.name;
							});
		
		var card_symbol = card_header.append("div")
							.attr("class",function(d,i){
								return "card_symbol pull-left card_symbol_"+d.name;
							})
							.attr("data-toggle","collapse")
							.attr("data-target",function(d,i){
								return "#CategoryList_"+d.name;
							})
							.append("i")
							.attr("class",function(d,i){
								return "fa fa-plus";
							})
							.attr("aria-hidden","true");
							
		var card_name  = card_header.append("div")
							.attr("class",function(d,i){
								return "card-name pull-left card-name_"+d.name;
							})		
							.text(function(d,i){
								return "By " +d.name;
							});
		
		
		var card_check = card_header.append("div")
							.attr("class",function(d,i){
								return "card-name pull-right card-name_"+d.name;
							})
							.append("input")
							.attr("type","checkbox")
							.attr("id",function(d,i){
								return "category-attr-"+d.name;
							})
							.attr("name",function(d,i){
								return "category-attr-"+d.name;
							})
							.attr("class",function(d){
								return "categoryCheck categoryCheck_"+d.name;
							})
							.attr("catName",function(d,i){
								return d.name;
							})
							.attr("checked","true");
		
		var categoryListDiv = card.append("div")
								.attr("class","new-row card-block pull-left collapse")
								.attr("id",function(d,i){
									return "CategoryList_"+d.name;
								})
								.attr("aria-expanded","false");
		
		var option = categoryListDiv
						.selectAll(".options")
						.data(function(d,i){
							return d.categories;
						})
						.enter()
						.append("div")
						.attr("class","new-row categoryOptions");
		
		var categoryLabel = option.append("div")
							.attr("class","col-9 categoryLabel pull-left")
							.text(function(d,i){
								return d;
							})
							
		var optionCheck = option
						.append("div")
		 				.attr("class","col-3 pull-right optionCheckDiv")
						.append("input")
						.attr("type","checkbox")
						.attr("class",function(d){
							//console.log(d3.select((this.parentNode).parentNode.parentNode).datum().name);
							return "optionCheck pull-rights optionCheck_" + d3.select((this.parentNode).parentNode.parentNode).datum().name;
						})
						.attr("catName",function(d){
							return d3.select((this.parentNode).parentNode.parentNode).datum().name;
						})
						.attr("id",function(d,i){
							return "categoryOption_"+d.replace(/\s/g, '');
						})
						.attr("name",function(d,i){
							return "categoryOption_"+d.replace(/\s/g, '');
						})
						.attr("value",function(d,i){
							return d;
						})
						.attr("checked","true");
		
		$('.categoryCheck').change(function(){
		    if(this.checked){
		    	$(".optionCheck.optionCheck_"+$(this).attr("catName")).prop('checked', true);
		    }
		    else{
		    	$(".optionCheck.optionCheck_"+$(this).attr("catName")).prop('checked', false);
		    }
		    queryElementByAttribute();
		});
		
		$(".optionCheck").change(function(){
			var catName = $(this).attr("catName");
			 if(this.checked){
				 if ($(".optionCheck_"+catName+":checked").length == $(".optionCheck_"+catName).length) {
					 $(".categoryCheck_"+catName).prop("indeterminate", false);
					 $(".categoryCheck_"+catName).prop('checked', true);
				 }
				 else{
					 $(".categoryCheck_"+catName).prop("indeterminate", true);
				 }
			 }
			 else{
				 if($(".optionCheck_"+catName+":checked").length > 0){
					 $(".categoryCheck_"+catName).prop('checked', false);
					 $(".categoryCheck_"+catName).prop("indeterminate", true);
					 
				 }
				 else{
					 $(".categoryCheck_"+catName).prop('checked', false);
					 $(".categoryCheck_"+catName).prop("indeterminate", false);
				 }
			 }
			 queryElementByAttribute();
		})
		
		 d3.selectAll(".card_symbol").on("click",function(d){
		 if(d3.select(this).select("i").classed("fa-minus")){
			 d3.select(this).select("i").classed("fa-minus",false);
			 d3.select(this).select("i").classed("fa-plus",true);
		 }
		 else if(d3.select(this).select("i").classed("fa-plus")){
			 d3.select(this).select("i").classed("fa-plus",false);
			 d3.select(this).select("i").classed("fa-minus",true);
		 }
	 })
}