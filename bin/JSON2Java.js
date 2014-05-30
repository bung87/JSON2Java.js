#!/usr/bin/env node

var path=require('path'),
    url=require('url'),
    fs=require('fs'),
    http = require("http"),
    JSON2Java = require('../JSON2Java.js'),
    args=process.argv.slice(2)
    ;

function printHelp(){
    var script='./JSON2Java.js';
  console.log('  Examples:');
  console.log('');
  console.log('    '+script+' Profile ~/Json2Java/sample.json ~/Json2Java/out');
  console.log('    '+script+' WeatherInfo http://www.bungos.me/weather.php ~/Json2Java/out');
  console.log('');
}
if (args.length<3) {
    if(args.length==1 && (args[0]=='--help' || args[0]=='-h')){
        printHelp();
        return;
    }
    printHelp();
    return;
}

var cls=args[0],
    src=args[1].indexOf('http')!==-1? url.parse(args[1]):path.normalize(args[1]),
    dest=path.normalize(args[2]),
    opts=args.slice(3),
    only_getter=false,
    less_getter=false
    ;

if(opts.length){
    var opt=opts[0];
    switch(opt){
        case '--o':
            only_getter=true;
            break;
        case '--ol':
            only_getter=true;
            less_getter=true;
            break;
        case '--l':
            less_getter=true;
            break;
    }
}
if(typeof src=='object'){
    var options = src;
    options['method']='GET';
    var content = '';
    var req = http.request(options, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
       content += chunk;
      });
      res.on('end', function () {
        parse(content);
        });
    });
    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });
    req.end();
}else{
    parse(fs.readFileSync(src, 'utf8'))
}


function writeOut(cls,content){
    var out=path.join(dest,cls+'.java');
    fs.writeFile(out, content, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log('see output file:'+out);
        }
    });
}
function parse(str){
    var data = JSON.parse(str);
    parser = new JSON2Java(cls,{'ONLY_GETTER':only_getter,'LESS_GETTER':less_getter,'callback':writeOut});
    parser.parse(data);
}
