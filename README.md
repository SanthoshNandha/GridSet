# GridSet

GridSet is a novel visualization technique for visualizing sets and a large number of their individual
elements and associated attributes. Each set representation is composed of glyphs, which represent individual elements and their numerous attributes utilizing different visual encodings.

## Local Deployment

1. Clone the repository using ```git clone``` or download and extract the [ZIP file](https://github.com/SanthoshNandha/GridSet/archive/master.zip).
2. Launch the [Python SimpleHTTPServer](https://docs.python.org/2/library/simplehttpserver.html) in the project directory.
 
   ```
   $ python -m SimpleHTTPServer 8000
   ```
   For Python 3
   ```
   $ python -m http.server 8000 &
   ```


3. View UpSet in your browser at [localhost:8000](http://localhost:8000).

## To Add new Dataset

1. Create a new folder inside \data
2. Add the dataset in the CSV format into the created folder
 i.  Each row is a Set Element
	ii. Each column is an Element Attribute or a Set
	
3. Create the metadata (JSON file) for the CSV inside the same folder
	### Example JSON format
	{\
	// Location of the CSV file\
	"file": "../data/acadameyAwards/AcamdameyAwards.csv",
	
	// Name of the dataset\
	"name": "Acadamey Awards", 
	
	// Row number which contains the column headers\
	"header": 0, 
	
	// Type of Sperator. only "," supportted currently\
	"separator": ",", 
	
	// The row numbers that needs to be skiped\
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

4. Add the link of the JSON file as <option> to the <Select> tag with ID as "fileLink" in web\index.html
	### Example
		<select name="file" id="fileLink">
			<option value="../data/NewMovies/newMovies.json">IMDB + Oscars </option>
		</select>
5. Restart the python server and go to home page. The dataset will be added to the dropdown box.
