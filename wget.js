var http = require('http');
var fs = require('fs');
var downloadList = [];

process.argv.splice(0,2);
while(process.argv[0]!==null)
{
  if(process.argv[1]!==null)
  {
    console.log("Error! File "+process.argv[0]+" does not have corresponding URL");
    process.exit(1);
  }
  var fileName=process.argv[0];
  var fileLoc=process.argv[1];
  process.argv.splice(0,2);
  var listObj = {name: fileName, location: fileLoc};
  downloadList.push(listObj);
}


function download( url, dest, callback)
{
  console.log('start download');
  var file = fs.createWriteStream(dest);

  var request = http.get(url, function(response){
    //console.log("response?", response);
    response.pipe(file);
    //pipe method means whatever data response represents gets put into file
  })

  console.log('sent request');
}

for(var i=0; i<downloadList.length; i++)
{
  download(downloadList[i].location,downloadList[i].name, null);
}

//download('http://cs.coloradocollege.edu/index.html',"cs.html", null);

console.log('done?')
