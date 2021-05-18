const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F
//'%05d' basically sets the format for an integer. d stands for digit. It means set the input to 5 digits (no decimal places) and pad with leading zeros as required to make the output 5 digits.

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
}; // so that we have the id number like this 00001

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};


const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

// I: callback function
// O: read & write counters
// C: error-first callbacks
// E:

exports.getNextUniqueId = (callback) => {
  // invoke readCounter with error, data
  readCounter( (err, data) => {
    // if error occurs
    if (err) {
      // run callback on null, 0
      callback(null, 0);
    } else {
    // invoke writeCounter with data + 1,    //function (error, counterString)
    writeCounter(data + 1,(err, counterString) => {
      // if error
      if (err) {
        // THROW error!
        throw (`418, I'm a teapot`);
      // else
      } else {
        // run callback on null, counterString
        callback(null, counterString);
      }
    });
    }
  });
}


// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
