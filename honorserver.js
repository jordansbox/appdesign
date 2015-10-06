/******
Jordan Berman, 10/5/2015
Honor Code Upheld

Note: The Time checker and css elements sometimes glitch out, however, the other moving parts all seem to be working fine.
It's getting late, so I'm turning in as is.
******/

var fs = require( 'fs' );
var http = require( 'http' );
var sql = require( 'sqlite3' ).verbose();

function getFormValuesFromURL( url )
{
    var kvs = {};
    var parts = url.split( "?" );
    var key_value_pairs = parts[1].split( "&" );
    for( var i = 0; i < key_value_pairs.length; i++ )
    {
        var key_value = key_value_pairs[i].split( "=" );
        kvs[ key_value[0] ] = key_value[1];
    }
    // console.log( kvs );
    return kvs
}

function compareTimes(hour1, min1, m1, hour2, min2, m2)
{
  var checker=0;
  if(m1===m2)
  {
    if(hour1===hour2)
    {
      if(min1<=min2)
      {
        checker=1;
      }
    }
    else
    {
      if(hour1===12)
      {
        hour1=0;
      }
      if(hour2===12)
      {
        hour2=0;
      }
      if(hour1<hour2)
      {
        checker=1;
      }
    }
  }
  else
  {
    if((m1===AM)&&(m2===PM))
    {
      checker=1;
      console.log("huh.")
    }
  }

  if(checker===1)
  {
    return true;
  }
  else
  {
    return false;
  }
}
function extractTime(time_block)
{
  var time_arr=[];
  time_block.split(":");
  time_block[1].split(" ");
  time_arr[0]=time_block[0];
  time_arr[1]=time_block[1][0];
  time_arr[2]=time_block[1][1];
  return time_arr;
}

function server_fun( req, res )
{
    //console.log( req.url );
    try
    {
      var db = new sql.Database( 'weather.sqlite' );
    }
    catch(exp)
    {
      console.log("Error: Table Not Found");
      process.exit(1);
    }

    var filename = "./" + req.url;
    try
    {
        var contents = fs.readFileSync( filename ).toString();
        res.writeHead( 200 );
        res.end( contents );
    }
    catch( exp )
    {
      if( req.url.indexOf( "first_form?" ) >= 0 )
      {
        res.writeHead( 200 );
        var kvs=getFormValuesFromURL(req.url);
        console.log(kvs["first"]+"  "+kvs["last"]);
        front_time = extractTime(kvs["first"])
        back_time = extractTime(kvs["last"])
        console.log(front_time[0]+front_time[1]+front_time[2]+"  "+back_time[0]+back_time[1]+back_time[2]);
        db.all("SELECT * FROM weatherdata", function(err, rows)
        {
          if(err)
          {
            console.log("something went wrong with reading the database.")
            process.exit(1);
          }
          else
          {
            var counter=0;
            var correct_rows=[];
            for( var i = 0; i < rows.length; i++ )
            {
              var times = extractTime(rows[i].Time)
              if((compareTimes(front_time[0], front_time[1], front_time[2], times[0], times[1], times[2]))&&(compareTimes(times[0], times[1], times[2], back_time[0], back_time[1], back_time[2])))
              {
                correct_rows[counter]=i;
                counter++;
              }
            }
            if(counter==0)
            {
              console.log("failure.")
            }
            else {
              console.log("success!")
            }
            var final_string="";
            for (var j=0; j<counter; j++)
            {
              final_string += rows[j].Time+" "+rows[j].Temp+" "+rows[j].DewPoint+" "+rows[j].Humidity+" "+rows[j].Pressure+" "+rows[j].Visibility+" "+rows[j].WindDirection+" "+rows[j].WindSpeed+" "+rows[j].GustSpeed+" "+rows[j].Precipitation+" "+rows[j].Events+" "+rows[j].Conditions+" "+rows[j].WindDirDegrees+" "+rows[j].Date+" "+"\n";
            }
            res.end(final_string)
          }
        })
      }
      if( req.url.indexOf( "second_form?" ) >= 0 )
      {
        res.writeHead( 200 );
        var kvs=getFormValuesFromURL(req.url);
        var add_string = "('"+kvs['time']+"',"+kvs['tmp']+","+kvs['dew']+","+kvs['humid']+","+kvs['pres']+","+kvs['vis']+",'"+kvs['windir']+"',"+kvs['windsp']+",'"+kvs['gustsp']+"','"+kvs['prec']+"','"+kvs['eve']+"','"+kvs['cond']+"',"+kvs['windirdeg']+",'"+kvs['date']+"')";
        db.run("INSERT INTO weatherdata VALUES"+add_string, function(err)
        {
          if(err)
          {
            console.log("failed to insert data. Try again.\n"+err);
          }
          else {
            console.log("data added to database.");
            add_string.className="added-row";
            res.end("The following monster string was inserted into the weatherdatabase: "+add_string)
          }
        });
      }
    }
}

var server = http.createServer( server_fun );

server.listen( 8080 );
