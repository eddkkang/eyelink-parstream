var CONSTS = require('./consts');
var Utils = require('./util');
var express = require('express');
var router = express.Router();

var QueryProvider = require('./dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'', reports:'', analysis:'', management:'', settings:'', sample:'open selected'};

/* GET reports page. */
router.get('/', function(req, res, next) {
  res.render('./sample/serverMap', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/samplePage', function(req, res, next) {
  res.render('./sample/samplePage', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/serverMap', function(req, res, next) {
  res.render('./sample/serverMap', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/serverMap1', function(req, res, next) {
  res.render('./sample/serverMap1', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/serverMap2', function(req, res, next) {
  res.render('./sample/serverMap2', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/scatter01', function(req, res, next) {
  res.render('./sample/scatter01', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});


router.get('/scatterTest01', function(req, res, next) {
  res.render('./sample/scatterTest01', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/scatterTest02', function(req, res, next) {
  res.render('./sample/scatterTest02', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/scatterTest03', function(req, res, next) {
  res.render('./sample/scatterTest03', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/summary', function(req, res, next) {
  res.render('./sample/summary', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

// query Report
router.get('/restapi/scatterPower', function(req, res, next) {
  console.log('sample/restapi/scatterPower');
  var in_data = {};
  queryProvider.selectSingleQueryByID("sample","scatterPower", in_data, function(err, out_data, params) {
    // console.log(out_datsa);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });

});

  
module.exports = router;
