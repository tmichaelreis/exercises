/*
  Problem 3 from Interview Cake:
  (https://www.interviewcake.com)

  Calculates the highest product of three numbers in an array.
  Uses Ramda functional javascript library.
  This problem could have been solved with a simple loop, but I chose
  a trampolined tail-recursive implementation for academic purposes.
*/

/*
  Use (with node):
    Specific inputs:
      node highest_product.js input
    Randomly generated array:
      node highest_product.js
*/

(function(){
  var R = require('ramda');

  /****************
  * Input selection
  *****************/

  // Command line input
  var input_array = process.argv.slice(2);

  if (input_array.length == 0){
    // Generate random input array
    var input_array = (function(){
      // Scale should not be much less than array size, otherwise
      // it's likely that three of the maximum values will appear,
      // and the maximum product will be 3*maximum.
      var array_size = 1000;
      var scale = 10000;

      // Composition to return rounded, scaled random numbers.
      var roundedScaledRandom = R.compose(
        Math.round,
        R.multiply(scale),
        Math.random
      );

      return R.map(R.call, R.repeat(roundedScaledRandom, array_size));
    })();
  }


  /********
  * Helpers
  *********/

  function processInputsAsArray(fn, array){
    return array.map(fn);
  };

  function trampoline(fn){
    while(typeof fn === 'function'){
      fn = fn();
    }

    return fn;
  }

  function newTrackingObject(tracking_object, item){
    var new_tracking_object = {
      highest_product_of_3: Math.max(
        tracking_object.highest_product_of_2 * item,
        tracking_object.lowest_product_of_2 * item,
        tracking_object.highest_product_of_3
      ),
      highest_product_of_2: Math.max(
        tracking_object.highest_product_of_2,
        tracking_object.highest * item,
        tracking_object.lowest * item
      ),
      lowest_product_of_2: Math.min(
        tracking_object.lowest_product_of_2,
        tracking_object.highest * item,
        tracking_object.lowest * item
      ),
      highest: Math.max(
        tracking_object.highest,
        item
      ),
      lowest: Math.min(
        tracking_object.lowest,
        item
      )
    };

    return new_tracking_object
  }


  /*************************
  * Tail-recursive algorithm
  **************************/

  function maxProduct(array, tracking_object){
    // Create tracking object if it doesn't exist and skip over elements
    // used to create initial tracking object.
    if (!tracking_object){
      var tracking_object = {
        highest_product_of_3: array.slice(0,3).reduce((prev, curr) => prev * curr),
        highest_product_of_2: array[0] * array[1],
        lowest_product_of_2: array[0] * array[1],
        highest: Math.max(array[0], array[1]),
        lowest: Math.min(array[0], array[1])
      };

      // Slice array to start at 3rd element
      array = array.slice(2);
    }

    return function(){
      if (array.length == 0){
        return tracking_object.highest_product_of_3;
      } else {
        return maxProduct(array.slice(1), newTrackingObject(tracking_object, array[0]));
      }
    }
  };


  /**********************
  * Trampolined algorithm
  ***********************/

  var trampolinedMaxProduct = function(array){
    return trampoline(function(){
      return maxProduct(array);
    });
  }


  /******************
  * Simple test cases
  *******************/

  var test = function(){
    var cases = [];
    cases.push(trampolinedMaxProduct([1, 10, -5, 1, -100]) == 5000);
    cases.push(trampolinedMaxProduct([1, 2, 3, 4, 5]) == 60);
    cases.push(trampolinedMaxProduct([-1, -2, -3, -4, -5]) == -6);

    for (var result of cases){
      if (!result) return "Failed";
      console.log("case passed");
    }

    return "Passed";
  }


  /********
  * Results
  *********/

  console.log("Test result: " + test());

  console.time("Execution time");
  var processed_input = processInputsAsArray(Number, input_array);

  // Throw error if fewer than 3 items given
  if (processed_input.length < 3){
    throw "Input must contain at least 3 numbers";
  }

  var max = trampolinedMaxProduct(input_array);
  console.timeEnd("Execution time");
  console.log("Max product: " + max);
})();
