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
    return kvs
}

function addStudent( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var name = kvs[ 'name' ];
    var sandwich = kvs[ 'sandwich' ];
    db.run( "INSERT INTO Students(Name, SandwichPreference) VALUES ( ?, ? )", name, sandwich,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "Added student" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "FAILED" );
                }
            } );
}

function addTeacher( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var name = kvs[ 'name' ];
    db.run( "INSERT INTO Students(Name) VALUES ( ?)", name,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "Added teacher" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "FAILED" );
                }
            } );
}

function addClass( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var name = kvs[ 'name' ];
    db.run( "INSERT INTO Courses(Name) VALUES ( ? )", name,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "Added student" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "FAILED" );
                }
            } );
}

function addEnrollment( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var a = kvs[ 'student' ];
    var b = kvs[ 'class' ];
    db.run( "INSERT INTO Students(student, class) VALUES ( ?, ? )", a, b,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "Added student" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "FAILED" );
                }
            } );
}

function addAssignment( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var a = kvs[ 'teacher' ];
    var b = kvs[ 'class' ];
    db.run( "INSERT INTO Students(student, class) VALUES ( ?, ? )", a, b,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "Added assignment" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "FAILED" );
                }
            } );
}

function server_fun( req, res )
{
    //console.log( "The URL: '", req.url, "'" );
    // ...
    if( req.url === "/" || req.url === "/index.htm" )
    {
        req.url = "/index.html";
    }
    var filename = "./" + req.url;
    try {
        var contents = fs.readFileSync( filename ).toString();
        res.writeHead( 200 );
        res.end( contents );
    }
    catch( exp ) {
        if( req.url.indexOf( "add_student?" ) >= 0 )
        {
            addStudent( req, res );
        }
        else if( req.url.indexOf( "add_teacher?" ) >= 0 )
        {
            addTeacher( req, res );
        }
        else if( req.url.indexOf( "add_class?" ) >= 0 )
        {
            addClass( req, res );
        }
        else if( req.url.indexOf( "add_enrollment?" ) >= 0 )
        {
            addEnrollment( req, res );
        }
        else if( req.url.indexOf( "add_assignment?" ) >= 0 )
        {
            addAssignment( req, res );
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
