var CONSTS = require('./consts');
var Utils = require('./util');
var express = require('express');
var router = express.Router();
var DashboardProvider = require('./dao/parstream/db-dashboard').DashboardProvider;

var dashboardProvider = new DashboardProvider();

var mainmenu = {home: 'is-selected', info: '', job: '', staff: '', consult: '', event: ''};


/* GET reports page. */
router.get('/', function(req, res, next) {
  console.log(_rawDataByDay);
  res.render('./dashboard/main', { title: 'EyeLink for ParStream' });
});

// test db query logic
router.get('/restapi/get_successcount', function(req, res, next) {
  var in_data = {};
  dashboardProvider.selectSingleQueryByID("selectSuccessCount", in_data, function(err, out_data) {
    console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

// query Dashboard Section 1
router.get('/restapi/getDashboardSection1', function(req, res, next) {
  var in_data = {};
  dashboardProvider.selectSingleQueryByID("selectDashboardSection1", in_data, function(err, out_data) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });

});

// query RawData
router.get('/restapi/getReportRawData', function(req, res, next) {
  var in_data = {MERGE:'Y'};
  dashboardProvider.selectSingleQueryByID("selectEventRawData", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data[0] === null) {
      rtnCode = CONSTS.getErrData('0001');
    }

    // console.log('typeof array : %s', (typeof out_data[0] !== 'undefined'));
    // console.log('typeof array : %s', (out_data[0] !== null));

    // MERGE = 'Y'이면 이전 날짜의 RawData를 합쳐준다.
    if (params.MERGE === 'Y')
      out_data = Utils.mergeLoadedData(out_data);

    // console.log('dashboard/restapi/getReportRawData -> out_data : %s', out_data);
    // console.log('dashboard/restapi/getReportRawData -> out_data : %s', out_data[0]);
    console.log('dashboard/restapi/getReportRawData -> length : %s', out_data[0].length);
    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });
});

router.get('/restapi/getNodeGeo', function(req, res, next) {
  var out_data = [
    {type : '0001.0000001', geo : '37.467271, 127.042861'},
    {type : '0001.0000002', geo : '37.467271, 128.042861'},
  ];
  res.json(out_data);
});

// query RawData for test
router.get('/restapi/fruits', function(req, res, next) {
  var in_data = ["user_id"];

  var out_data = [
    {"name": "apple", "cnt": 10},
    {"name": "orange", "cnt": 15},
    {"name": "banana", "cnt": 12},
    {"name": "grapefruit", "cnt": 2},
    {"name": "grapefruit", "cnt": 4},
    {"name": "pomegranate", "cnt": 1},
    {"name": "lime", "cnt": 12},
    {"name": "grape", "cnt": 50}
  ];

    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    res.json(out_data);

});



module.exports = router;