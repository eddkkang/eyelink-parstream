var CONSTS = require('./consts');
var config = require('../config/config.json');
require('date-utils');

var DashboardProvider = require('./dao/parstream/db-dashboard').DashboardProvider;
var dashboardProvider = new DashboardProvider();

// 어제날짜까지의 Raw Data를 메모리에 적재 처리함.
// TO-DO 1시간전까지 데이터 적재 로직 보완 필요함.
function loadData(callback) {
  var d = new Date();
  console.log('initApps/loadData -> today : %s', Date.today());

  for (var i=0; i<config.loaddataonstartup.loading_day; i++) {
    console.log('initApps/loadData -> day : %s', d.removeDays(1).toFormat('YYYY-MM-DD'));
    var flag = 'R';
    if (i === (config.loaddataonstartup.loading_day-1))
      flag = 'C';
    // console.log('initApps/loadData -> i :   %s, loadind day : %s, flag : %s', i, (CONSTS.CONFIG.LOADING_DAY-1), flag);
    var vDate = d.toFormat('YYYY-MM-DD');
    var in_data = {
      LOAD_DATE : vDate,
      START_TIMESTAMP: vDate + ' 00:00:00',
      END_TIMESTAMP: vDate + ' 23:59:59',
      FLAG : flag};
    dashboardProvider.selectSingleQueryByID("selectEventRawDataOld", in_data, function(err, out_data, params) {
      // console.log(out_data);
      _rawDataByDay[params.LOAD_DATE] = out_data[0];
      console.log('initApps/loadData -> load_date : %s, count : %s', params.LOAD_DATE, _rawDataByDay[params.LOAD_DATE].length);
      // console.log('initApps/loadData -> flag : %s', params['FLAG'], params.FLAG);
      callback(params);
    });
  }
}

module.exports.loadData = loadData;
