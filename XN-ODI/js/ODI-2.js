

var startDateChart = dc.barChart('#yearly-startDate-chart');
var comDateChart = dc.barChart('#yearly-comDate-chart');

var lifecycleRow = dc.rowChart('#lifecycle_row');
var costChart = dc.lineChart('#yearly-cost-chart');
var volumeChart = dc.barChart('#yearly-volume-chart');

var ndx;


d3.csv('Projects_CW1-csv.csv', function (error, data) {
    if (error) {
        alert("Unable to load projects csv.");
        return;
    }
	ndx = crossfilter(data);
    var all = ndx.groupAll();
	var dateFormat = d3.time.format('%Y-%m-%dT%H:%I:%SZ');
    var numberFormat = d3.format('.2f');
    var intFormat = d3.format('d');
var yearFormat = d3.time.format("%Y");
    
    data.forEach(function (d) {
        d.name = d["Agency Name"],
            d.investment = d["Investment Title"],
            d.project_id = d["Project ID"],
            d.investment_link = d['Investment URL'],
            d.project_name = d['Project Name'],
            d.project_desc = d['Project Description'] || '',
            d.lifecycle_cost = +d["Lifecycle Cost ($ M)"],
            d.planned_cost = +d["Planned Cost ($ M)"],
            d.projected_cost = +d["Projected/Actual Cost ($ M)"],
            d.variance = +d["Cost Variance ($ M)"],
            d.completed_date = dateFormat.parse(d["Completion Date (B1)"]),
            d.schedule_variance = +d["Schedule Variance (in days)"];
    })
    
 
    
  var minSdate = new Date();
  var maxSdate = new Date(1970, 1, 1);

  // Create a new date object (d.dd) and work out the earliest and latest date in the dataset.
  data.forEach(function(d) {
    tmp = dateFormat.parse(d["Start Date"]);
    if (tmp < minSdate) {
      minSdate = tmp;
    }
    if (tmp > maxSdate) {
      maxSdate = tmp;
    }
    d.start_date = tmp;
  });
    
    var minCdate = new Date();
  var maxCdate = new Date(1970, 1, 1);
    data.forEach(function(d) {
    tmp = dateFormat.parse(d["Completion Date (B1)"]);
    if (tmp < minCdate) {
      minCdate = tmp;
    }
    if (tmp > maxCdate) {
      maxCdate = tmp;
    }
    d.completed_date = tmp;
  });
           // updated: dateFormat.parse(d.Updated)

	var yearlyDimension = ndx.dimension(function (d) {
        return yearFormat(d.start_date);
    });
    

    
  


    
    var nameDimension = ndx.dimension(function (d) {
        return d.name;
    }); 
    var nameGroup = nameDimension.group().reduceSum(function(d){
        return d.lifecycle_cost;
    });
    
   
    
  lifecycleRow
    .width(480)
    .height(800)
    .dimension(nameDimension)
    .group(nameGroup)
    .label(function(d) {
      return d.key;
    })
    .title(function(d) {
      return d.value;
    })
    .elasticX(true)
    .ordering(function(d) {
      return -d.value;
    })
    .xAxis().ticks(6);
    
    
    var minSYear = yearFormat(minSdate);//d3.time.year(mindate).getFullYear();
    var maxSYear = yearFormat(maxSdate);//d3.time.year(maxdate).getFullYear();
     var minCYear = yearFormat(minCdate);
     var maxCYear = yearFormat(maxCdate);
    var yearDimension = ndx.dimension(function(d){
        return d3.time.year(d.completed_date).getFullYear();
    });
        
    
    
     startDateChart.width(820) 
        .height(300)
        .margins({top: 0, right: 30, bottom: 40, left: 40})
        .dimension(yearlyDimension)
        .group(yearlyDimension.group())
         .elasticY(true)
        .centerBar(true)
        .gap(10)
        .x(d3.time.scale().domain([1990,2014]))
         .yAxisPadding('10%')
         .renderHorizontalGridLines(true)
     .filterPrinter(function (filters) {
            var filter = filters[0], s = '';
            s += intFormat(filter[0]) + ' -> ' + intFormat(filter[1]);
            return s;
        })
        .xUnits(function(){return 25;})
         .xAxisLabel("Started Year")
        .yAxisLabel("Annual Started Project Quantity")
         .renderLabel(true);
 
    startDateChart.xAxis().tickFormat(
        function (v) { return intFormat(v); });
    startDateChart.yAxis().ticks(10);
    
    comDateChart.width(820) 
        .height(300)
        .margins({top: 0, right: 50, bottom: 40, left: 40})
        .dimension(yearDimension)
        .group(yearDimension.group())
        .elasticY(true)
        .centerBar(true)
        .gap(10)
        .x(d3.time.scale().domain([2009,2050]))
        .yAxisPadding('10%')
         .renderHorizontalGridLines(true)
            .filterPrinter(function (filters) {
            var filter = filters[0], s = '';
            s += intFormat(filter[0]) + ' -> ' + intFormat(filter[1]);
            return s;
        })
        .xUnits(function(){return 30;})
        .xAxisLabel("Completed Year")
        .yAxisLabel("Annual Completed Project Quantity")
    .renderLabel(true)
    .on('renderlet', function(chart) {
        chart.selectAll('rect').on("click", function(d) {
            console.log("click!", d);
        });
    });
    
    comDateChart.xAxis().tickFormat(
        function (v) { return intFormat(v); });
    comDateChart.xAxis().ticks(8);
    comDateChart.yAxis().ticks(10);
    
    
    


var sumPlanned_cost = yearlyDimension.group().reduceSum(function (d) {
        return d.planned_cost;
    });
    var sumProjected_cost = yearlyDimension.group().reduceSum(function (d) {
            return d.projected_cost;
    });
costChart 
        .renderArea(true)
        .width(990)
        .height(300)
        .transitionDuration(1000)
        .margins({top: 30, right: 50, bottom: 25, left: 50})
        .dimension(yearlyDimension)
        .mouseZoomable(true)
        .rangeChart(volumeChart)
        .x(d3.time.scale().domain([minSYear,maxSYear]))
        .xUnits(d3.time.years)
        .elasticY(true)
        .yAxisPadding('10%')
        .renderHorizontalGridLines(true)
        .legend(dc.legend().x(800).y(5).itemHeight(13).gap(5))
        .brushOn(false)
        .group(sumPlanned_cost, 'Yearly Planned Cost ($ M)')
        .stack(sumProjected_cost, 'Yearly Projected Cost ($ M)', function (d) {
            return d.value;
        })
        .title(function (d) {
            var value = d.planned_cost ? d.planned_cost : d.value;
            if (isNaN(value)) {
                value = 0;
            }
            return d.key + '\n' + numberFormat(value);
        });
    
    costChart.xAxis().tickFormat(
        function (v) { return intFormat(v); });
    costChart.yAxis().ticks(10);
    
    volumeChart
        .width(990) 
        .height(40)
        .margins({top: 0, right: 50, bottom: 20, left: 50})
        .dimension(yearlyDimension)
        .group(yearlyDimension.group())
        .centerBar(true)
        .gap(1)
        .x(d3.time.scale().domain([minSYear,maxSYear]))
        .xUnits(function(){return 25;});

     volumeChart.xAxis().tickFormat(
        function (v) { return intFormat(v); });
    volumeChart.yAxis().ticks(0);
			  
    
    
    dc.renderAll();
    
    
              
});

