var Logger = require('./log4js-utils').Logger;
var logger = new Logger('nodeReportEFSM');
var CONSTS = require('./consts');
var Utils = require('./util');
var express = require('express');
var router = express.Router();

var QueryProvider = require('./dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'', reports:'open selected', analysis:'', management:'', settings:''};

var indexAcc = global.config.es_index.es_jira;  
var indexMetric = global.config.es_index.es_metric;

var startTime = CONSTS.STARTTIME.KOREA;
var fmt1 = CONSTS.DATEFORMAT.DATE; // "YYYY-MM-DD",
var fmt2 = CONSTS.DATEFORMAT.DATETIME; // "YYYY-MM-DD HH:MM:SS",
var fmt4 = CONSTS.DATEFORMAT.INDEXDATE; // "YYYY.mm.DD",

/* GET reports page. */
router.get('/', function(req, res, next) {
  res.render('./reports/report_all'+global.config.pcode, { title: global.config.productname, mainmenu:mainmenu, indexs: global.config.es_index });
});

router.get('/main', function(req, res, next) {
  res.render('./reports/main', { title: global.config.productname, mainmenu:mainmenu });
});

router.get('/Res_Req', function(req, res, next) {
  res.render('./reports/Res_Req', { title: global.config.productname, mainmenu:mainmenu });
});

router.get('/process', function(req, res, next) {
  res.render('./reports/process', { title: global.config.productname, mainmenu:mainmenu });
});

router.get('/cpu_memory', function(req, res, next) {
  res.render('./reports/cpu_memory', { title: global.config.productname, mainmenu:mainmenu });
});

router.get('/error', function(req, res, next) {
  res.render('./reports/error', { title: global.config.productnam, mainmenu:mainmenu });
});

router.get('/all', function(req, res, next) {
  res.render('./reports/report_allEFSM', { title: global.config.productname, mainmenu:mainmenu });
});

router.get('/test', function(req, res, next) {
  res.render('./reports/test', { title: global.config.productname, mainmenu:mainmenu });
});


// query Report
router.get('/restapi/getJiraAcc', function(req, res, next) {
  console.log('reports/restapi/getJiraAcc');    
  var gte = Utils.getDate(req.query.sdate, fmt1, -1, 0, 0, 0);
  var lte = Utils.getMs2Date(req.query.edate, fmt1);  
  var indexs = [], cnt = 0;
  for(i=new Date(gte).getTime(); i<=new Date(lte).getTime(); i+= 24*60*60*1000){
    indexs[cnt++] = indexAcc+Utils.getMs2Date(i, fmt4)
  }
  var in_data = { index : indexs,  gte : gte+startTime, lte : lte+startTime  };
  queryProvider.selectSingleQueryByID2("reports","selectJiraAcc", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {
      var minTime = new Date().getTime(), maxTime = new Date('1990-01-01').getTime();
      var data = [];
      out_data.forEach(function(d){
        if(d._source.timestamp != null){
          if(d._type == "access"){
           d._source.type = "jira";
          } 
          d = d._source;
          d.response = parseInt(d.response);     
          d.responsetime = parseInt(d.responsetime);        
          if(d.response >= 400)  {
            d.section = 'error';
            d.index = 4;
          } else if(d.responsetime <= 1000) {
            d.section = '1s';
            d.index = 0;
          } else if(d.responsetime <= 3000) {
            d.section = '3s';
            d.index = 1;
          } else if(d.responsetime <= 5000) {
            d.section = '5s';
            d.index = 2;
          } else {
            d.section = 'slow';
            d.index = 3;
          }
          d.timestamp =Utils.getDateUTC2Local(d.timestamp,fmt2);                        
          if(minTime > new Date(d.timestamp).getTime()){
            minTime = new Date(d.timestamp).getTime();
          }           
          if(maxTime < new Date(d.timestamp).getTime()){
            maxTime = new Date(d.timestamp).getTime();
          }        
          data.push(d);
        }
      });
    }
    res.json({rtnCode: rtnCode, rtnData: data, minTime : minTime, maxTime : maxTime });
  });
});

// query Report
router.get('/restapi/getCpuMemoryFilesystemAll', function(req, res, next) {
  console.log('reports/restapi/getCpuMemoryFilesystemAll');
  var in_data = {
    index : req.query.index,
    gte : req.query.gte,
    lte : req.query.lte
  };
  queryProvider.selectSingleQueryByID2("reports","selectCpuMemoryFilesystemAll", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }       
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

// query Report
router.get('/restapi/getProcessList', function(req, res, next) {
  console.log('reports/restapi/getProcessList');
  var in_data = {
    index : req.query.index,
    gte : req.query.gte,
    lte : req.query.lte
  };
  queryProvider.selectSingleQueryByID2("reports","selectProcessList", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }       
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

// query Report
router.get('/restapi/getProcessListByName', function(req, res, next) {
  console.log('reports/restapi/getProcessListByName');
  var in_data = {
    index : req.query.index,
    gte : req.query.gte,
    lte : req.query.lte,
    name : req.query.name
  };
  queryProvider.selectSingleQueryByID2("reports","selectProcessListByName", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }       
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

// query Report
router.get('/restapi/getProcess', function(req, res, next) {
  console.log('reports/restapi/getProcess');
  var in_data = {
    index : req.query.index,
    gte : req.query.gte,
    lte : req.query.lte
  };
  queryProvider.selectSingleQueryByID2("reports","selectProcess", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }       
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

// query Report
router.get('/restapi/getProcessByName', function(req, res, next) {
  console.log('reports/restapi/getProcessByName');
  var in_data = {
    index : req.query.index,
    gte : req.query.gte,
    lte : req.query.lte,
    name : req.query.name
  };
  queryProvider.selectSingleQueryByID2("reports","selectProcessByName", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }       
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});


// query Report
router.get('/restapi/getAccessError', function(req, res, next) {
  console.log('reports/restapi/getAccessError');
  var in_data = {
    index : req.query.index,
    gte : req.query.gte,
    lte : req.query.lte
  };
  queryProvider.selectSingleQueryByID2("reports","selectAccessError", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }           
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

// query Report
router.get('/restapi/getOneIndexCount', function(req, res, next) {
  console.log('reports/restapi/getOneIndexCount');
  var in_data = {    index : req.query.index   };
  queryProvider.selectSingleQueryByID3("reports","selectOneIndexCount", in_data, function(err, out_data, params) {
     console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }               
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

// query Report
router.get('/restapi/getMultiIndexCount', function(req, res, next) {
  console.log('reports/restapi/getMultiIndexCount');  
  var lte = Utils.getMs2Date(req.query.edate, fmt1)+startTime;    
  var indexs = [], cnt = 0, ranges = [], xValue = [];
  console.log('^^^^^^^^^^^^')
  console.log(req.query.type)
  console.log(lte)
  var settingDate = new Date(lte);
  console.log(settingDate)
  settingDate.setDate(settingDate.getDate()-1); //하루 전
  console.log(settingDate)
  settingDate.setMonth(settingDate.getMonth()-1); //한달 전
  console.log(settingDate)
  if(req.query.type == "#day"){
    var gte = Utils.getDate(req.query.sdate, fmt1, -1, 0, 0, 0);
    for(i=new Date(gte).getTime(); i<=new Date(lte).getTime(); i+= 24*60*60*1000){
      indexs[cnt] = indexAcc+Utils.getMs2Date(i, fmt4);
      xValue[cnt] = Utils.getMs2Date(i, "mm/DD");
      if(i != new Date(gte).getTime()){
        ranges[cnt] = '{"key" : "'+xValue[cnt++]+'", "from" : "'+Utils.getMs2Date(i-24*60*60*1000, fmt1, "Y")+startTime+'", "to" : "'+Utils.getMs2Date(i, fmt1, "Y")+startTime+'" }';
      }
    }
  } else if(req.query.type == "#week") {
    var gte = Utils.getDate(lte, fmt1, parseInt(req.query.sdate)*(-7)+1, 0, 0, 0);    
    for(i=new Date(gte).getTime(); i<new Date(lte).getTime(); i+= 7*24*60*60*1000){      
      xValue[cnt] = Utils.getMs2Date(i, "mm/DD")+'-'+Utils.getMs2Date(i+6*24*60*60*1000, "mm/DD");      
      ranges[cnt] = '{"key" : "'+xValue[cnt++]+'", "from" : "'+Utils.getMs2Date(i-24*60*60*1000, fmt1, "Y")+startTime+'", "to" : "'+Utils.getMs2Date(i+6*24*60*60*1000, fmt1, "Y")+startTime+'" }';      
    }
    indexs[0] = indexAcc+Utils.getDate(gte, "YYYY.mm.*", -1, 0, 0, 0);
    indexs[1] = indexAcc+Utils.getMs2Date(lte, "YYYY.mm.*");    
  } else if(req.query.type == "#month") {    
    var mNum = parseInt(req.query.sdate);
    var end = new Date(lte), start = new Date(lte);
    for(i=0; i<mNum; i++){         
      start.setMonth(start.getMonth()-1);      
      indexs[mNum-i-1] = indexAcc+Utils.getMs2Date(end, "YYYY.mm")+"*";      
      xValue[mNum-i-1] = Utils.getMs2Date(end, "YYYY.mm")  ;      
      ranges[mNum-i-1] = '{"key" : "'+xValue[mNum-i-1]+'", "from" : "'+Utils.getMs2Date(start,fmt2,"Y")+'", "to" : "'+Utils.getMs2Date(end,fmt2,"Y")+'" }';      
      end = new Date(start);
    }    
    indexs[mNum] = indexAcc+Utils.getMs2Date(start, "YYYY.mm")+"*";      
  }
  var in_data = {    index : indexs, range : ranges.toString()   };
  queryProvider.selectSingleQueryByID3("reports","selectMultiIndexCount", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    res.json({rtnCode: rtnCode, rtnData: out_data, xValue : xValue});
  });
});


module.exports = router;
