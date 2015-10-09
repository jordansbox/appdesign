var jsc = require( 'jsverify' );

console.log( "Running the Boolean test:" );
// forall (f: json -> bool, b: bool), f (f (f b)) ≡ f(b).
var boolFnAppliedThrice =
    jsc.forall( "bool -> bool", "bool",
        function( f, b )
        {
            return f( f( f( b ) ) ) === f( b );
        }
    );
jsc.assert( boolFnAppliedThrice );
console.log( "... OK, passed 100 tests" );

function arraysEqual( a1, a2 )
{
    try {
        if( a1.length !== a2.length )
            return false;
        for( var i = 0; i < a1.length; i++ )
        {
            if( a1[i] !== a2[i] )
                return false;
        }
        return true;
    }
    catch( exp ) {
        return false;
    }
}

console.log( "Running the sort idempotent test:" );
// forall (f: string -> nat, arr: array string),
// sortBy(sortBy(arr, f), f) ≡ sortBy(arr, nf).
var sortIdempotent =
    jsc.forall( "array string",
        function( arr )
        {
            var arr_copy = arr.slice();
            arr.sort();
            arr_copy.sort().sort();
            return arraysEqual( arr, arr_copy );
    } );
jsc.assert( sortIdempotent );
console.log( "... OK, passed 100 tests" );


console.log( "Running the lengths equal test:" );
//console.log( "Write a test that returns true if sorting doesn't change an array's length" );
var sortLength =
    jsc.forall( "array string",
        function( arr )
        {
          var arr_copy = arr.slice();
          arr.sort();
            if( arr.length !== arr_copy.length )
            {
              return false;
            }
          return true;
        } );
jsc.assert( sortLength );
console.log( "... OK, passed 100 tests" );


console.log( "Running the in-order test:" );
//console.log( "Write a test that returns true the elements of the sorted array are in order" );
var sortInOrder =
    jsc.forall( "array string",
        function( arr )
        {
            arr.sort();
            if(arr.length<=1)
            {
              return true;
            }
            for(var i=1; i<arr.length; i++)
            {
              if (arr[i]<arr[i-1])
              {
                return false;
              }
              return true;
            }
        } );
jsc.assert( sortInOrder );
console.log( "... OK, passed 100 tests" );


console.log( "Running the add/remove test:" );
//console.log( "Write a test that returns true if every element that appears somewhere in the sorted array appears somewhere in the unsorted array and vice-versa" );
var sortAddRemove =
    jsc.forall( "array string",
        function( arr )
        {
          if(arr.length<=1)
          {
            return true;
          }
          arr_copy = arr.slice();
          arr.sort();
          for(var i=0; i<arr.length; i++)
          {
            var checker = 0;
            for(var j=0; j<arr_copy.length; j++)
            {
              if(arr[i]===arr_copy[j])
              {checker=1;}
            }
            if(checker===0)
            {
              return false;
            }
          }
          return true;
        } );
jsc.assert( sortAddRemove );
console.log( "... OK, passed 100 tests" );


console.log( "Running the sort number of copies test:" );
//console.log( "Write a test that returns true if the number of copies of a particular value in the unsorted array is the same as the number of copies of that value in the sorted array." );
var sortNumCopies =
    jsc.forall( "array string",
        function( arr )
        {
          if(arr.length<=1)
          {
            return true;
          }
          arr_copy = arr.slice();
          arr.sort();
          var new_arr=[];
          var new_arr_copy=[];
          //for loops > froot loops
          for(var k=0; k<2; k++)
          {
            for(var i=0; i<arr.length; i++)
            {
              var arr_check = 0;
              var arr_copy_check = 0;
              var compare_check = 0;
              for(var j=0; j<arr_copy.length; j++)
              {
                if(k===0)
                {
                  if(arr[i]===arr[j])
                  {
                    if(arr_check===1)
                    {
                      new_arr.push(arr[i]);
                      arr.splice(j,1);
                    }
                    else
                    {
                      arr_check=1;
                    }
                  }
                  if(arr_copy[i]===arr_copy[j])
                  {
                    if(arr_copy_check===1)
                    {
                      new_arr_copy.push(arr_copy[i]);
                      arr_copy.splice(j,1);
                    }
                    else {
                      arr_copy_check=1;
                    }
                  }
                }
                if(k===1)
                {
                  if(new_arr[i]===new_arr_copy[j])
                  {
                    new_arr.splice(i,1);
                    new_arr_copy.splice(j,1);
                  }
                }
              }
            }
          }
          if(new_arr.length===0)
          {
            return true;
          }
          else {
            return false;
          }
        } );
jsc.assert( sortNumCopies );
console.log( "... OK, passed 100 tests" );
