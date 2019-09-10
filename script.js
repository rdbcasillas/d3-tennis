function timelineChart() {
    var margin = { top: 20, right: 60, bottom: 50, left: 50 },
        width = 450,
        height = 450,
        parseTime = d3.timeParse("%m/%Y"),
        timeValue = function(d) { return parseTime(d.month); },
        fedValue = function (d) { return +d.fedvalue; },
        nadValue = function (d) { return +d.nadvalue; },
        djokValue = function (d) { return +d.djokvalue; };
        

    // From https://bl.ocks.org/mbostock/5649592
    function transition(path) {
        path.transition()
            .duration(15000)
            .attrTween("stroke-dasharray", tweenDash);
    }
    function tweenDash() {
        var l = this.getTotalLength(),
            i = d3.interpolateString("0," + l, l + "," + l);
        return function (t) { return i(t); };
    }

    function chart(selection) {
        selection.each(function (data) {
            data = data.map(function (d, i) {
                return { time: timeValue(d), fedvalue: fedValue(d), nadvalue: nadValue(d), djokvalue: djokValue(d) };
            });
            var x = d3.scaleTime()
                .rangeRound([0, width - margin.left - margin.right])
                .domain(d3.extent(data, function(d) { return d.time; }));
            var y = d3.scaleLinear()
                .rangeRound([height - margin.top - margin.bottom, 0])
                .domain(d3.extent(data, function(d) { return d.fedvalue; }));
            
            var fed_line = d3.line()
                .x(function(d) { return x(d.time); })
                .y(function(d) { return y(d.fedvalue); });

            var nad_line = d3.line()
                .x(function(d) { return x(d.time); })
                .y(function(d) { return y(d.nadvalue); });
          
            var djok_line = d3.line()
                .x(function(d,i) { return x(d.time); })
                .y(function(d) { return y(d.djokvalue); });
          
          slamColor = function(d) {
            console.log(d);
            return "green";
          }
            var svg = d3.select(this).selectAll("svg").data([data]);
            var gEnter = svg.enter().append("svg").append("g");

          
         var lineSize = d3.scaleOrdinal().domain(["Federer", "Nadal", "Djokovic"])
         .range(["green", "#ffa07a", "steelblue"]); 
          
          gEnter.append("g")
          .attr("class", "legendSizeLine")
          .attr("transform", "translate(20, 20)");

          var legendSizeLine = d3.legendColor()
                .scale(lineSize)
                .shape("rect")
                .orient("vertical")
                .shapeWidth(40)
                .shapeHeight(3)
                .labelAlign("start")
                .shapePadding(10);

          svg.select(".legendSizeLine")
            .call(legendSizeLine);

            gEnter.append("path")
                .datum(data)
                .attr("class", "feddata line")
                //.attr("fill", "none")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                //.attr("stroke-width", 4);
          
             gEnter.append("path")
                .datum(data)
                .attr("class", "nadaldata")
                .attr("fill", "none")
                .attr("stroke", "#ffa07a")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 4);   
          
              gEnter.append("path")
                .datum(data)
                .attr("class", "djokdata")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 4);          
          
            gEnter.append("g").attr("class", "axis x");
          
            gEnter.append("g").attr("class", "axis y")
                .append("text")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("x", -160)
                .attr("y", -40)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .style("font-size", "18px")
                .text("Grand Slams");


            var svg = selection.select("svg");
            svg.attr('width', width).attr('height', height);
            var g = svg.select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            g.select("g.axis.x")
                .attr("transform", "translate(0," + (height - margin.bottom - 15) + ")")
                .call(d3.axisBottom(x).ticks(5))


            g.select("g.axis.y")
                .attr("class", "axis y")
                .call(d3.axisLeft(y));

            g.select("path.feddata")
                .datum(data)
                .attr("d", fed_line)
                .classed("line", true)
                .call(transition);
          
            g.select("path.nadaldata")
                .datum(data)
                .attr("d", nad_line)
                .call(transition);
          
            g.select("path.djokdata")
                .datum(data)
                .attr("d", djok_line)
                .call(transition);
        });
    }

    chart.margin = function (_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.width = function (_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function (_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.parseTime = function (_) {
        if (!arguments.length) return parseTime;
        parseTime = _;
        return chart;
    };

    chart.timeValue = function (_) {
        if (!arguments.length) return timeValue;
        timeValue = _;
        return chart;
    };

    chart.dataValue = function (_) {
        if (!arguments.length) return dataValue;
        dataValue = _;
        return chart;
    };

    return chart;
}