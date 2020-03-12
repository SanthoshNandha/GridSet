$.ui.plugin.add("resizable", "alsoResizeReverse", {
	
	start: function (event, ui) {
        	/*console.log("resizing!!")
        	console.log(event.clientX);*/

        	 if ( !resizeIsDragging ) {
        		 resizeStartX = event.clientX; //#set-vis-container
        		 resizeleftWidth = $("#mainView").width();
        		 resizeRightLeft = $("#rightView").width();
                 resizeIsDragging = true;
             }
        },

        resize: function (event, ui) {
             if ( resizeIsDragging ) {
            	resizeEndX = event.clientX;
                event.stopPropagation()

                $("#mainView").width( resizeleftWidth + (resizeEndX - resizeStartX) );
                $("#rightView").width( resizeRightLeft - (resizeEndX - resizeStartX) );
                
                var panelWidth = $(".setViewPanelRow").width();
                var leftPanelWidth = $(".setLabelDivConatiner").width();
                
                $(".barDivContainer").width( panelWidth - leftPanelWidth );
                
                /*$(".dataView-section").width( leftWidth + (endX - startX) );
                $(".set-list-section").width( leftWidth + (endX - startX) );*/
                
//                $("#vis svg").width( leftWidth + (endX - startX) );
//                $("#right").offset( { left: rightLeft + (endX - startX) } );
//                $("#right").width( rightLeft - (endX - startX) );


            }
        },

        stop: function (event, ui) {
        	resizeIsDragging = false;
        }
    });