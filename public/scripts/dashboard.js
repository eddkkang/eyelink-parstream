'use strict';
var fluctuationChart = dc.barChart('#fluctuation-chart');

d3.json("/dashboard/restapi/getReportRawData", function(err, out_data) {
  // if (err) throw error;

  var dateFormat = d3.time.format('%Y-%m-%d %H:%M:%S.s');
  var numberFormat = d3.format('.2f');
  var minDate  = new Date("2016-11-24");
  var maxDate = new Date("2016-11-25");

  // {"node_id":"0001.00000001","event_time":"2016-11-25 15:42:34.0","event_type":"1",
  //  "active_power":19.618999481201172,"ampere":183.35400390625,"als_level":null,
  //  "dimming_level":null,"noise_decibel":0,"noise_frequency":null,"vibration_x":null,
  //  "vibration_y":null,"vibration_z":null}

  var data = out_data.rtnData[0];
  data.forEach(function (d) {
    console.log(d);
    d.dd = dateFormat.parse(d.event_time);
    // d.month = d3.time.month(d.dd); // pre-calculate month for better performance
    // d.VOLTAGE = +d.VOLTAGE;
    d.AMPERE = +d.ampere;
    // d.POWER_FACTOR = +d.POWER_FACTOR;
    d.ACTIVE_POWER = +d.active_power;
    // d.REACTIVE_POWER = +d.REACTIVE_POWER;
    // d.APPARENT_POWER = +d.APPARENT_POWER;
    // d.AMOUNT_OF_ACTIVE_POWER = +d.AMOUNT_OF_ACTIVE_POWER;
    d.check = +0.85;
    console.log(d);
  });

  var nyx = crossfilter(data);
  var all = nyx.groupAll();

  var fluctuation = nyx.dimension(function (d) {
      return d.AMOUNT_OF_ACTIVE_POWER * 100;
  });

  var fluctuationGroup = fluctuation.group();

    // Create a bar chart and use the given css selector as anchor. You can also specify
    // an optional chart group for this chart to be scoped within. When a chart belongs
    // to a specific group then any interaction with such chart will only trigger redraw
    // on other charts within the same chart group.
    // <br>API: [Bar Chart](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#bar-chart)
  fluctuationChart /* dc.barChart('#volume-month-chart', 'chartGroup') */
    .width(420)
    .height(180)
    .margins({top: 10, right: 50, bottom: 30, left: 40})
    .dimension(fluctuation)
    .group(fluctuationGroup)
    .elasticY(true)
    // (_optional_) whether bar should be center to its x value. Not needed for ordinal chart, `default=false`
    .centerBar(true)
    // (_optional_) set gap between bars manually in px, `default=2`
    .gap(1)
    // (_optional_) set filter brush rounding
    .round(dc.round.floor)
    .alwaysUseRounding(true)
    .x(d3.scale.linear().domain([-25, 25]))
    .renderHorizontalGridLines(true)
    // Customize the filter displayed in the control span
    .filterPrinter(function (filters) {
        var filter = filters[0], s = '';
        s += numberFormat(filter[0]) + '% -> ' + numberFormat(filter[1]) + '%';
        return s;
    });

    // Customize axes
    fluctuationChart.xAxis().tickFormat(
        function (v) { return v + '%'; });
    fluctuationChart.yAxis().ticks(5);

});