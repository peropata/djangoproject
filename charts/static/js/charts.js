


function chart_01(data)
{

//alert(JSON.stringify(data));

var svg = d3.select("#svg_chart_01"),
    margin = {top: 30, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
	

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
	y = d3.scaleLinear().rangeRound([height, 0]);

  x.domain(data.map(function(d) { return d.X; }));
  y.domain([0, d3.max(data, function(d) { return d.Y; })]);

	//alert(JSON.stringify(data));

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(5));
	  
  g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.81em")
      .attr("text-anchor", "end")
      .text("Num. of pacients");

  g.append("text")
		.attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "14px") 
        .style("text-decoration", "underline")  
        .text("Pacients age range");
	  
  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.X); })
      .attr("y", function(d) { return y(d.Y); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.Y); });


}

function chart_02(data)
{
 
var svg = d3.select("#svg_chart_02"),
    margin = {top: 30, right: 130, bottom: 50, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
	
var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
	y = d3.scaleLinear().rangeRound([height, 0]);

var chartArea = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
var color = d3.scaleOrdinal(["#AA8900", "#FF6633", "#00ff00", "#007fff", "#00ffff", "#7f00ff", "#99aabc", "#ff007f", "#ff00ff", "#ff7f00", "#ff0000", "#ffff00"])
color.domain(d3.keys(data[0]).filter(function (key) { return key !== "X"; }));

data.forEach(function (d) {
	var y0 = 0;
    d.ages = color.domain().map(function (name) { return { name: name, y0: y0, y1: y0 += +d[name] }; });
    d.total = d.ages[d.ages.length - 1].y1;
});
	
	x.domain(data.map(function (d) { return d.X; }));
    y.domain([0, d3.max(data, function (d) { return d.total; })]);	
	
	chartArea.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
	  .selectAll("text")
		.attr("y", 0)
		.attr("x", 9)
		.attr("dy", ".35em")
		.attr("transform", "rotate(45)")
		.style("text-anchor", "start");
		
	chartArea.append("g")
            .attr("class", "y axis")
			.call(d3.axisLeft(y));	
    
	chartArea.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 15)
            .attr("dy", ".71em")
            .style("text-anchor", "end");

chartArea.append("text")
		.attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "14px") 
        .style("text-decoration", "underline")  
        .text("Number of pacients (by age range) for each month");

var state = chartArea.selectAll()
				.data(data)
				.enter()
				.append("g")
				.attr("class", "g")
				.attr("transform", function (d) { return "translate(" + x(d.X) + ",0)"; });
		

state.selectAll("rect")
            .data(function (d) { return d.ages; })
            .enter()
			.append("rect")
            .attr("width", x.bandwidth())
            .attr("y", function (d) { return y(d.y1); })
            .attr("height", function (d) { return (y(d.y0) - y(d.y1)); })
            .style("fill", function (d) { return color(d.name); });
			

var legend = chartArea.selectAll(".legend")
            .data(color.domain().slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {return "translate(" + 65 * Math.floor(i/10) + "," + (i%10) * 16 + ")"; });

legend.append("rect")
            .attr("x", width + 14)
            .attr("width", 14)
            .attr("height", 14)
            .style("fill", color);
			
legend.append("text")
            .attr("x", width + 35)
            .attr("y", 9)
            .attr("dy", ".30em")
            .style("text-anchor", "start")
			.style("font-size", "12px")
            .text(function (d) { return d; });

}

function chart_03(data)
{
 
var svg = d3.select("#svg_chart_03"),
    margin = {top: 30, right: 100, bottom: 50, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
	
var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
	y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
var color = d3.scaleOrdinal(["#007fff", "#00ffff", "#7f00ff", "#99aabc"])
color.domain(d3.keys(data[0]).filter(function (key) { return key !== "X"; }));

data.forEach(function (d) {
	var y0 = 0;
    d.ages = color.domain().map(function (name) { return { name: name, y0: y0, y1: y0 += +d[name] }; });
    d.total = d.ages[d.ages.length - 1].y1;
});
	
	x.domain(data.map(function (d) { return d.X; }));
    y.domain([0, d3.max(data, function (d) { return d.total; })]);	
	
	g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
	  .selectAll("text")
		.attr("y", 0)
		.attr("x", 9)
		.attr("dy", ".35em")
		.attr("transform", "rotate(45)")
		.style("text-anchor", "start");
		
	g.append("g")
            .attr("class", "y axis")
			.call(d3.axisLeft(y).ticks(5, "%"));
    
	g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
			
g.append("text")
		.attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "14px") 
        .style("text-decoration", "underline")  
        .text("Pacients gender by month");

var state = g.selectAll(".X")
				.data(data)
				.enter()
				.append("g")
				.attr("class", "g")
				.attr("transform", function (d) { return "translate(" + x(d.X) + ",0)"; });
		

state.selectAll("rect")
            .data(function (d) { return d.ages; })
            .enter().append("rect")
            .attr("width", x.bandwidth())
            .attr("y", function (d) { return y(d.y1); })
            .attr("height", function (d) { return y(d.y0) - y(d.y1); })
            .style("fill", function (d) { return color(d.name); });
			

var legend = g.selectAll(".legend")
            .data(color.domain().slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
            .attr("x", width + 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);
			
legend.append("text")
            .attr("x", width + 45)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function (d) { return d; });

}

function chart_04(data)
{
	
var svg = d3.select("#svg_chart_04"),
    margin = {top: 30, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
	
var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
	y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  x.domain(data.map(function(d) { return d.X; }));
  y.domain([0, d3.max(data, function(d) { return d.Y; })]);
  
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(5));
	  
  g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.81em")
      .attr("text-anchor", "end")
      .text("Num. of pacients");

  g.append("text")
		.attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "14px") 
        .style("text-decoration", "underline")  
        .text("Most common procedures");
	  
  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.X); })
      .attr("y", function(d) { return y(d.Y); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.Y); });


}


function update_chart_02()
{
	// get age range
	var e = document.getElementById("sel1");
	var age_range = e.options[e.selectedIndex].text;
	// get year from
	e = document.getElementById("sel_year_from");
	var year_from = e.options[e.selectedIndex].text;
	// get month from
	e = document.getElementById("sel_month_from");
	var month_from = e.options[e.selectedIndex].text;
	// get year from
	e = document.getElementById("sel_year_to");
	var year_to = e.options[e.selectedIndex].text;
	// get month from
	e = document.getElementById("sel_month_to");
	var month_to = e.options[e.selectedIndex].text;

	$.ajax({
			url: "/charts/ajax/chart02_update/",
			data : {
				age_range : age_range,
				year_from: year_from,
				month_from: month_from,
				year_to: year_to,
				month_to: month_to
			},
			dataType: 'json',
	  }).done(function( data ) {
			d3.select("#svg_chart_02").selectAll("g").remove();
			chart_02(data);
	  	});
}


function update_chart_02_zoom_all(date_min_year, date_min_month, date_max_year, date_max_month) {
	console.log(date_min_year + '/' + date_min_month + ' - ' + date_max_year + '/' + date_max_month);

	// set month from
	var e = document.getElementById("sel_month_from");
	e.selectedIndex = (date_min_month -1) ;
	// set year from
	e = document.getElementById("sel_year_from");
	for (var i = 0; i< e.options.length;i++){
		if (e.options[i].text == date_min_year){
			e.selectedIndex = i;
			break;
		}
	}
	// set month to
	var e = document.getElementById("sel_month_to");
	e.selectedIndex = (date_max_month -1) ;
	// set year to
	e = document.getElementById("sel_year_to");
	for (var i = 0; i< e.options.length;i++){
		if (e.options[i].text == date_max_year){
			e.selectedIndex = i;
			break;
		}
	}

	update_chart_02();
}
