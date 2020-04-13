# GridSet

## About

GridSet is a web-based novel interactive visualization technique for visualizing sets and a large number of their individual elements and associated attributes. Each set representation is composed of glyphs, which represent individual elements and their numerous attributes utilizing different visual encodings.

## Demo

A demo instance of GridSet is avialable at [https://santhoshnandha.github.io/GridSet/web/](https://santhoshnandha.github.io/GridSet/web/)

## Local Deployment

1. Clone the repository using ```git clone``` or download and extract the [ZIP file](https://github.com/SanthoshNandha/GridSet/archive/master.zip).
1. Launch the [Python SimpleHTTPServer](https://docs.python.org/2/library/simplehttpserver.html) in the project directory.
	
	* Python 2
   ```
   $ python -m SimpleHTTPServer 8000
   ```
   * Python 3
   ```
   $ python -m http.server 8000 &
   ```


1. View GridSet in your browser at [localhost:8000/web](http://localhost:8000/web).

## To Add new Dataset

1. Create a new folder inside \data folder
1. Add the dataset in the CSV format into the created folder
	* Each row is a Set Element
	* Each column is an Element Attribute or a Set
	
1. Create the metadata file (JSON file) for the CSV inside the same folder
	#### Example JSON format
	```
	{	
		// Location of the CSV file
		"file": "../data/datasetName/datasetname.csv",
	
		// Name of the dataset	
		"name": "Acadamey Awards", 
	
		// Row number which contains the column headers
		"header": 0, 
	
		// Type of Sperator. only "," supportted currently	
		"separator": ",", 
	
		// The row numbers that needs to be skiped
		"skip": 0, 
	
		//Metadata of the element attributes
		"type" -- type of attribute	
		"Index" -- column number of attribute
		"name" -- Name of the attribute
		"tableDisplay" -- Decides if the attribute needs to be shown in  the detailed view or not
		"meta": [ 
				{ "type": "id", "index": 0, "name": "Name","tableDisplay":"true" },
				{ "type": "integer", "index": 1, "name": "Nominations","tableDisplay":"true"},	
				{ "type": "text", "index": 2, "name": "Nominated 2017","tableDisplay":"true"}
		], 
	
		// column range that repersent the sets\ 
		"sets": [
			{ "format": "binary", "start": 3, "end": 116 }
		],
	
    	"author": "",
    	"description": "",
    	"source": ""
	}

1. Add the link of the JSON file as Json object to the array in the data/datsets.json file
	### Example
	```
		 {
        	"name" : "AcadameyAwards2017",
        	"link":"../data/AcadameyAwards2017/awards2017.json"
    	}
	```
1. Restart the python server and go to [localhost:8000/web](http://localhost:8000/web). The new dataset will be visible in the dropdown box.
