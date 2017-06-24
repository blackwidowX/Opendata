
var yearlyBubbleChart = dc.bubbleChart('#yearly-bubble-chart');
var variancePieChart = dc.pieChart('#gain-loss-chart');
var scheduleVariancePieChart = dc.pieChart('#timeline');
var dataTable = dc.dataTable("#dc-data-table");
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

	var yearlyDimension = ndx.dimension(function (d) {
        return yearFormat(d.start_date);;
    });
    

    
    var yearlyPerformanceGroup = yearlyDimension.group().reduce(
        /* callback for when data is added to the current filter results */
        function (p, v) {
            ++p.count;
            p.sumVariance += v.variance;
            p.sumSchedule_variance += v.schedule_variance;
            return p;
        },
        /* callback for when data is removed from the current filter results */
        function (p, v) {
            --p.count;
            p.sumVariance -= v.variance;
            p.sumSchedule_variance -= v.schedule_variance;
            return p;
        },
        /* initialize p */
        function () {
            return {
                count: 0,
                sumVariance: 0,
                sumSchedule_variance: 0,

            };
        }
    );    


    var extVariance = d3.extent(data, function(d) {
  return d.sumVariance;
});
    var extSchedule_variance = d3.extent(data, function(d) {
  return d.sumSchedule_variance;
});

    var nameDimension = ndx.dimension(function (d) {
        return d.name;
    }); 
    var nameGroup = nameDimension.group().reduceSum(function(d){
        return d.lifecycle_cost;
    });
    
    yearlyBubbleChart
            .width(990)
	        .height(400)
		    .transitionDuration(1500)
            .margins({top: 10, right: 50, bottom: 30, left: 60})
            .dimension(yearlyDimension)
			.group(yearlyPerformanceGroup)
			.colors(colorbrewer.RdYlGn[9])
			.colorDomain([-500,500])
			.colorAccessor(function (d) {
            return d.value.sumVariance;
        })
			.keyAccessor(function (p) {
            return p.value.sumVariance;
        })
			.valueAccessor(function (p) {
            return p.value.sumSchedule_variance;
        })
			.radiusValueAccessor(function (p) {
            return p.value.count;
        })
            .maxBubbleRelativeSize(0.3)
            .x(d3.scale.linear().domain(extVariance))
            .y(d3.scale.linear().domain(extSchedule_variance))
            .r(d3.scale.linear().domain([0, 8000]))
			.elasticY(true)
            .elasticX(true)
			.yAxisPadding(8000)
            .xAxisPadding(100)
			.renderHorizontalGridLines(true)
			.renderVerticalGridLines(true)
			.xAxisLabel('Cost Variance ($ M)')
			.yAxisLabel('Schedule Variance (in days)')
			.renderLabel(true)
            .label(function (p) {
            return p.key;
        })
			.renderTitle(true)
			.title(function (p) {
            return [
                p.key,
                'Cost Variance ($ M): ' + numberFormat(p.value.sumVariance),
                'Schedule Variance (in days): ' + numberFormat(p.value.sumSchedule_variance),
                'count: ' + p.value.count
            ].join('\n');
        })
			// JavaScript Document
    

    var varianceDimention = ndx.dimension(function (d) {
          if(d.variance > 0)
           return 'positive';
          if(d.variance < 0)
           return 'negative';
          return 'balanced';
    });
    var varianceGroup = varianceDimention.group();
                   
    variancePieChart 
        .width(330)
        .height(180)
        .radius(80)
        .dimension(varianceDimention)
        .group(varianceGroup)
        .colorDomain([-1750, 1644])
        .colorAccessor(function(d, i){return d.value;})
        .legend(dc.legend())
        .label(function (d) {
            if (variancePieChart.hasFilter() && !variancePieChart.hasFilter(d.key)) {
                return d.key + '(0%)';
            }
            var label = d.key;
            if (all.value()) {
                label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
            }
            return label;
        })
        .renderLabel(true);
    
    var scheduleVarianceDimention = ndx.dimension(function (d) {
          if(d.schedule_variance > 0)
           return 'positive';
          if(d.schedule_variance < 0)
           return 'negative';
          return 'balanced';
    });
    
    var scheduleVarianceGroup = scheduleVarianceDimention.group();
    
    scheduleVariancePieChart 
        .width(330)
        .height(180)
        .radius(80)
        .innerRadius(20)
        .dimension(scheduleVarianceDimention)
        .group(scheduleVarianceGroup)
        .colorDomain([-1750, 1644])
        .colorAccessor(function(d, i){return d.value;})
        .label(function (d) {
            if (scheduleVariancePieChart.hasFilter() && !scheduleVariancePieChart.hasFilter(d.key)) {
                return d.key + '(0%)';
            }
            var label = d.key;
            if (all.value()) {
                label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
            }
            return label;
        })
        .legend(dc.legend())
        .renderLabel(true);
    

    dataTable
        .width(568)
        .height(480)
        .dimension(nameDimension)
        .group(function(d) {
      return d3.time.year(d.start_date).getFullYear();
    })
        .size(Infinity)
        .columns(['Start Date',
                  'Agency Name',
                  'Project Name',
                  'Investment Title',
                  'Lifecycle Cost ($ M)'])
        .sortBy(function (d) { return d.start_date;})//d3.time.year(d.dd).getFullYear();})//d['Agency Name']; })
        .order(d3.ascending);
        update();

    
    
    dc.renderAll();
    
});

    var ofs = 0, pag = 10;
  function display() {
      d3.select('#begin')
          .text(ofs);
      d3.select('#end')
          .text(ofs+pag-1);
      d3.select('#last')
          .attr('disabled', ofs-pag<0 ? 'true' : null);
      d3.select('#next')
          .attr('disabled', ofs+pag>=ndx.size() ? 'true' : null);
      d3.select('#size').text(ndx.size());
  }
  function update() {
      dataTable.beginSlice(ofs);
      dataTable.endSlice(ofs+pag);
      display();
  }
  function next() {
      ofs += pag;
      update();
      dataTable.redraw();
  }
  function last() {
      ofs -= pag;
      update();
      dataTable.redraw();
  }
