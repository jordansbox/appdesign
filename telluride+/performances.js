var fs = require( 'fs' );
var http = require( 'http' );
var sql = require( 'sqlite3' ).verbose();
var db = new sql.Database( 'telluride.sqlite' );

function getFormValuesFromURL( url )
{
    var kvs = {};
    var parts = url.split( "?" );
    var key_value_pairs = parts[1].split( "&" );
    for( var i = 0; i < key_value_pairs.length; i++ )
    {
        //console.log(key_value_pairs.length);
        var key_value = key_value_pairs[i].split( "=" );
        kvs[ key_value[0] ] = key_value[1];
    }
    return kvs;
}

function server_fun( req, res )
{
    console.log( req.url );
    // ...
    var filename = "./" + req.url;
    try
    {
        var contents = fs.readFileSync( filename ).toString();
        res.writeHead( 200 );
        res.end( contents );
    }
    catch( exp )
    {
        if( req.url.indexOf( "get_performer_info?" ) >= 0 )
        {
            var kvs = getFormValuesFromURL( req.url );
            //console.log( kvs['perf_id'] );
            db.all( "SELECT * FROM Performers WHERE Name = ?",
            //? means fill in the hole, fill in hole with next parameter
                    kvs['perf_id'],
            // db.all( "SELECT * FROM Performers", protects from nasty
                    function( err, rows ) {
                        console.log(rows.length);
                        if( err )
                        {
                            res.writeHead( 200 );
                            res.end( "ERROR: " + err );
                        }
                        else
                        {
                            res.writeHead( 200 );
                            var response_text = "<html><body>"+rows.length+"<table><tbody>";
                            for( var i = 0; i < rows.length; i++ )
                            {
                                response_text += "<tr><td>" + rows[i].Name +
                                    "</td><td>"+rows[i].GroupSize+"</td></tr>";
                            }
                            response_text += "</tbody></table></body></html>";
                            res.end( response_text );
                        }
                    } );
        }
        else if( req.url.indexOf( "get_start_time?" ) >= 0 )
        {
            var dont_care = getFormValuesFromURL( req.url );
            console.log(req.url)
            console.log( dont_care['start_time'] );
            db.all( "SELECT * FROM Performances JOIN Performers ON Performers.ID = Performances.pid JOIN Stages ON Stages.ID = Performances.SID",
                    function(err, rows)
                    {
                      if (err)
                      {
                        res.writeHead(200);
                        res.end("Eror"+ err);
                      }
                      else
                      {
                        res.writeHead(200);
                        var j=0;
                        var time_compare = dont_care['start_time'].split(":");
                        while (j<rows.length)
                        {
                          var time_ints= rows[j].Time.split( ":" );
                          if((time_ints[0]<time_compare[0])&&((time_ints[0]<time_compare[0])||(time_ints[1]<time_compare[1])))
                          {
                            rows.splice(j,1);
                          }
                          else
                          {
                            j++;
                          }
                          console.log(rows.length);
                        }
                        var response_text = "<html><body><table><tbody>";
                        for(var i=0; i<rows.length; i++)
                        {
                          response_text+="<tr><td>"+rows[i].Time+"</td>"
                          response_text+="<td>"+rows[i].PID+"</td>"
                          response_text+="<td>"+rows[i].SID+"</td></tr>"
                        }
                        response_text+="</ul></body></html>"
                        //console.log(response_text);
                        res.end( response_text );
                      }
                    });
        }
        else
        {
            // console.log( exp );
            res.writeHead( 404 );
            res.end( "Cannot find file: "+filename );
        }
    }
}

var server = http.createServer( server_fun );

server.listen( 8080 );
