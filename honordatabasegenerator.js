var fs = require( 'fs' );
var http = require( 'http' );
var sql = require( 'sqlite3' ).verbose();

try{
  var import_data = fs.readFileSync('weather_data.csv').toString();
}
catch(exp)
{
  //console.log("Error: File Not Found");
  process.exit(1);
}
try
{
  var db = new sql.Database( 'weather.sqlite' );
}
catch(exp)
{
  //console.log("Error: Table Not Found");
  process.exit(1);
}

var data_full = import_data.split( "\n" );
for( var i = 1; i < data_full.length-1; i++ )
{
  data_full[i] = data_full[i].split(",");
  var current_row = "('"+data_full[i][0]+"'";
  //console.log(current_row);
  //console.log(data_full[i]);
  for(var j = 1; j<14; j++)
  {
    //console.log(data_full[i][j])
    if(((j>0)&&(j<6))||(j===12))
    {
      current_row+=","+data_full[i][j];
    }
    else
    {
      current_row+=",'"+data_full[i][j]+"'";
    }
  }
  current_row+=")";
  //console.log(current_row);
  //var current_row = "('"+data_full[i]+"')";
  db.run("INSERT INTO weatherdata VALUES"+current_row, function(err)
    {
      if(err)
      {
        console.log("Nice one. "+err);
        process.exit(1);
      }
    });
}
