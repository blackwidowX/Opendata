xn1y14(28172175£©

## Hosting information:
A live version of the visualisations can be found at: http://users.ecs.soton.ac.uk/hpe1g11/comp6214-open-data/

## Data Cleaning and Manipulation
Before cleaning, Excel tools were applied to check the .csv file. Open Refine was used for data cleaning. Issues found are listed below:

1: Badly Formatted csv,
	1.1Issue, unexpected consecutive blank cells within columns, which made several records out of places. 

	Solution, delete those blank cells.

	1.2Issue, one project ID were separated into two cells occurs in different places. 

	Solution, manually merge them in Excel document.
 
2: Spelling Errors,
	Issue, spelling errors were found after using Text Facet function in Agency Name column. Such as agriculture and ¡®agraculture¡¯, commerce and ¡®comerce¡¯. 

	Solution, apply cluster to display groups in which each group included similar agency name. Then chose reasonable grouping results and merged them into one correct name.

3: Multiple Representations, 
	Issue, multiple representation in Agency Name such as ¡®agriculture department¡¯, ¡®department of agriculture¡¯. Similar issue with transportation department.

	Solution, finding similar values by adjusting Radius parameter. Using Method and Distance Functionis another choice.
4: Inconsistent formats,
	Issue, Project ID, Lifecycle Cost and date related columns had this issue.
	Issue, Dates are represented in multiple ways, such as 2012-30-09 and 31/03/2012.

	Solution, applying replace command ¡°value.replace(¡®,¡¯,¡¯¡¯)¡± in GREL and edit cells -> common transforms to change date or number formats.
5: Duplicate Records, 
	Issue, by using Duplicates Facet function, some duplicate records emerged. 

	Solution, remove these repeated rows.
6: Blank Rows,
	Issue, blank rows found in given data.  
	Solution, using Facet by Blank function find blank records and remove them.
7: Lost Records,
	Blank cells were found by using Facet by Blank. Such as 17 date related values were missing.
	Solution, attempt to find them to enrich dataset.
8: Summation Records, 
	Issue, summation records (26 rows found) are not useful in data visualization part. 

	Solution, using Facet by Blank to locate and remove them.
9: Transformed Data, 
	Issue, two columns were found recording project updated time.

	Solution, merged them into one column and transform to 	standard date format using ¡°value +¡¯ ¡¯+cells[¡®Updated Time¡¯].value¡± in GREL.
10: Inconsistent Value,
	Issue, one-to-one correspondences columns found such as Agency Name and Agency Code. In this case, department of agriculture associate with agency code 6(should be 5) 	occurred twice.

	Solution, change wrong value to right one.


## Audience and Use Case
The intended audiences are American general public. Based on detailed project planned and real cost records within the dataset, comparing them could bring further information on government efficiency or tendencies, which audiences or taxpayers care a lot. Utilizing advantages of different charts (e.g. pie chart for percentage), visualizations were simple and easy for audiences to understand and extract information from them.
  
## Interactivity
Charts within each visualization correlated closely, which allows audiences do complicated information search easily. Beside each visualizations, an introduction on interactivity and reasons for why it is appropriate, is given.

##A number of external libraries, were used to build the visualisations:
D3.js
Dc.js
jQuery
colorbrewer.js
crossfilter.js
							
