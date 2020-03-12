//Set Boarders constants
var TOPLEFT  = 1;
var BOTTOMLEFT = 2;
var BOTTOMRIGHT = 3;
var TOPRIGHT = 4;
var LEFTMAX = 5;
var RIGHTMIN = 6;

//Sub-Group Boarders constants
var ENDPOINT = 1;
var INTERPOINT = 2;

//Layout Types constants
var NORMAL_LAYOUT = 1;
var GEO_LAYOUT = 2;
var TIME_LAYOUT = 3;

var LAYOUT_TYPE = 1;

//Group by constants
var GROUP_BY_SET = "sets";
var GROUP_BY_DEGREE = "degree";

var GROUPED_BY = GROUP_BY_SET;

//prefixs
var setPrefix = "S_";

//Element repersentation
var isElementPictured = false;
var isElementCategorised = false;
var PIC_PIXEL = false;

//SubGroup color state;
var subGroupColor = "Deviation";

var rawSets = [];
var setNames = [];

var pictureInfo = [];
var allItems = [];  
var dataset;
var pixelShape;
var edges = []; 
var edges2  = [];
var subGroupsLinks = [];
var processedfilteredLinks = [];
var filteredLinks =[];
var filteredLinksByNames =[];
var similarityLinks = [];
var degreeTempLinksIds = [];
var degreeTempLinks = null;
var degreeSelectedLinks = {};
var degreeSelectedLinkIds = {};
var tempLinks = null;
var simulation;

var seperateGroupLinks = [];

var setLocationInfo = {};

var activeSubGroups = [];
var activeSubGroupNames = [];
var degreeActiveSubGroups = [];

var activePixels = [];
var activeElements = [];

var pixelSizeScales = {};
var selectedAttr = "";

var selectedSubGroups = [];

var subGroupsInfo = [];
var minSetSide = Number.MAX_VALUE;
var maxCardinality;
var minCardinality;

var referenceParts = 10;

var myLayout;

// Detailed view rendering

var addedIds = [];

//Grid Boarder properties
var setBoarderSize = 1;
var topBoarderExtent = 0;

//Sub-link filters
var sugGroupFilters = ["AND","OR","NOT"];
var sugGroupFiltersCount = sugGroupFilters.length

var maxCols = 3;
var side = 10;
var padding = 4;
var boarderPadding = padding/2;

//Elemenet Rendering
var ACTIVE_ELEMENT_OPACITY = "0.7";
var InACTIVE_ELEMENT_OPACITY = "0.05";

var ELEMENT_DEFAULT_FILL = "gray";

var ELEMENT_STROKE_COLOR = "gray";
var ELEMENT_STROKE_WIDTH =  "0.7px"; //(boarderPadding/4) + "px";

var ACTIVE_ELEMENT_STROKE_OPACITY = "0.6";
var InACTIVE_ELEMENT_STROKE_OPACITY = "0.1";

var COLOR_ACTIVE_ELEMENT_STROKE_WIDTH = "0.75px";
var COLOR_ACTIVE_ELEMENT_STROKE_OPACITY = "0.8";

var HIGHLIGHTED_ELEMENT_STROKE_COLOR = "red";
var HIGHLIGHTED_ELEMENT_STROKE_WIDTH = "1px";
var FIXED_ELEMENT_STROKE_COLOR = "blue";

//SubGroup Rendering
var SUBGROUP_STROKE = "black";
var SUBGROUP_STROKE_WIDTH = "0.7px"; //(boarderPadding/4) + "px";
var SMALLER_SUBGROUP_STROKE_WIDTH = "1px"; //(boarderPadding/4) + "px";
var SUBGROUP_STROKE_OPACITY = "1";

var SUBGROUP_FILL = "white";
var SUBGROUP_FILL_OPACITY = "0.5";

//SetRendering
var SET_FILL = "white";
var SET_FILL_OPACITY = "1";
var SET_STROKE = "black";
var USER_SET_STROKE = "blue";
var SET_STROKE_OPACITY = "1";
var SET_STROKE_WIDTH = "0.8px";


var filteredElements = [];
var linkThicknessFactor;

var setDetails = [];
var dataSetDescriptions = [];
var SET_SIZE_GROUP_PREFIX = 'SetSizeG_';
var EMPTY_GROUP_ID = 'EmptyGroup';
var SET_BASED_GROUPING_PREFIX = "SetG_";

var similarityLinkScale = d3.scaleLinear()
							.domain([0,1]);
                            

var similarityLinkLength = d3.scaleLinear()
.domain([0,1]);

var svg;
var SVG_HEIGHT = 983;
var SVG_WIDTH = 1249;

var grid;
var selectedDataGrid;
var tableData;
var selectedTableData;


var currentZoomLevel = 1;
var currentSVGTranslateX = null;
var currentSVGTranslateY = null;

var operations = ["UNION","INTERSECTION","MINUS1","MINUS2","CANCEL"];
var projection;
var OprSet1;
var OprSet2;
var opredSet;
var UNION_SYM = "&#8746;";
var INTERSECTION_SYM = "&#8745;";
var MINUS_SYM ="&#8722;";

var oprMenueItemWidth = 120;
var oprMenueItemHeight = 40;

var degreeSlider;

var attrSliders = {};
var dateAttrSliders = {};

var isFirstLoad = true;
var isFirstSetQuryLoad = true;

var resizeIsDragging = false;
var resizeStartX = undefined;
var resizeEndX = undefined;
var resizeleftWidth = undefined;
var resizeRightLeft = undefined;

var numericAttrScales = {};
var attributeMeanScale = [];

var setsAttribute;

var elementSymbols = [[d3.symbolSquare,0],[d3.symbolCircle,0],[triangleSymbol,0],[dimondSymbol,0],[triangleSymbol,180]];

var shapeLegendPre;

var SetArrayJSON;

var subGroupContextMenu = [
           	            {
           	                title: 'Seperate',
           	                action: function(elm, d, i) {
           	                	var parentnode = d3.select(elm).node().parentNode;
           	                	var parentData = d3.select(parentnode).datum();
           	                	seperateGubGroup(d,parentData.SetName);
           	                }
           	            },
           	            {
        	                title: 'Cancel',
        	                action: function(elm, d, i) {
        	                   return;
        	                }
        	            }
           	        ];

//Scales for subGroups
var disproportionalityScale = d3.scaleLinear()
								.domain([-1, 0, +1])
								.range(["red", "yellow", "green"]);

/*var pixelAttrSizeScale = d3.scaleLinear()
							.range([(side/1.5),(side+(padding/1.25))]);*/

/*var pixelAttrSizeScale = d3.scalePow()
							.exponent(0.5)
							.range([(side/1.35),(side+(padding * 2.5))]);*/

var pixelAttrSizeScale = d3.scalePow()
.exponent(0.5)
.range([(side/2.5),(side+(padding * 1.25 ))]);



console.log("new scale6");

var pixelDateAttrSizeScale = d3.scaleTime()
								.range([(side/2),(side+(padding/2))]);

var pixelAttrColorScale = d3.scaleLinear()
							.range([0.1,1]);

var pixelDateAttrColorScale = d3.scaleTime()
								.range([0.1,1]);

var subGroupAttrMeanColorScale = d3.scaleLinear()
									.range([0.4,1]);

var numericAttrDomins = {};
var numericAttrMeanDomains = {};
var dateAttrDomins = {};
var dateAttrMeanDomains = {};

//Color Scales
var c20 = d3.scaleOrdinal(d3.schemeCategory20);

//concad all visible elements;
var visibleElements = [];
var numericAttributes=[];
var categoryAttribute = [];
var dateAttributes=[];
var pictureAttributes = [];
var searchAttribute = [];
var linkAttribute=null;

String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return Math.abs(hash);
}

// Legend Variable
var SizeLegendcenterPoint;
var pixelOrderData = [0,1,2,3];

//Degree slider update
var degreeSliderChanges = {};
var maxDegree = 1;

//set specific Attributes 
var currentEleColor;