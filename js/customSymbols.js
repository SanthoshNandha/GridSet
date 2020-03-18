/* 
	* Author: Santhosh Nandhakumar
	* eMail ID: nsanthosh2409@gmail.com
 */

var triangleSymbol = {
		draw: function(context, size) {
		    var w = Math.sqrt(size),
	        x = -w / 2;
		    context.moveTo(((x +(x+w))/2), x);
		    context.lineTo(x, (x+w));
		    context.lineTo((x+w),(x+w));
		    context.closePath();
	  }
}
var dimondSymbol = {
		draw: function(context, size) {
		    var w = Math.sqrt(size),
	        x = -w / 2;
		    context.moveTo(((x +(x+w))/2), x);
		    context.lineTo((x+w), ((x +(x+w))/2));
		    context.lineTo(((x +(x+w))/2),(x+w));
		    context.lineTo(x ,((x +(x+w))/2));
		    context.closePath();
	  }
}