const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};
//web : {'00001': 'visit dad'}  edit
//fs {00001: visit dad}

// Public API - Fix these CRUD functions ///////////////////////////////////////
//i:text(string), callback function
//o:create a .txt
//c:
//e:

// exports.create = (text, callback) => {
//   var id = counter.getNextUniqueId();
//   items[id] = text;
//   callback(null, { id, text });
// };

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    console.log(text)
    if (err) {
      throw ('418, Tea Time');
    } else {
      items[id] = text;
      console.log(text)
    }
    // fs.writeFile invoke with exports.dataDir + '/id' + '.txt' , text, (err)
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
      err ? callback(err) : callback(null, { id, text });
    })
      // if err
        // callback on error
      // else
        // callback null, { id, text }
  });
}

// i: get request(callback)
// o: return an array of todos to client app
// c: don't read the contents of each file that contains the todo item text
// e:



// exports.readAll = (callback) => {
//   var data = _.map(items, (text, id) => {
//     return { id, text };
//   });
//   callback(null, data);
// };

exports.readAll = (callback) => {
  var result = [];
  fs.readdir(exports.dataDir, (err, data) => {
    if (err) {
      throw ('418, Tea Time');
    } else {
      _.each(data, (file) => {
        // console.log(data, 'data', file, 'files')
        var id = file.split('.')[0];
        result.push({ id, text: id });
        // console.log(id);
      });
      callback(null, result);
    }
  });
}

// exports.readOne = (id, callback) => {
//   var text = items[id];
//   if (!text) {
//     callback(new Error(`No item with id: ${id}`));
//   } else {
//     callback(null, { id, text });
//   }
// };

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      // console.log(text);
      callback(null, {id, text});
    }
  });
}

// i: id, text, callback
// o: overwrite
// c:
// e:
exports.update = (id, text, callback) => {
  var filePath = `${exports.dataDir}/${id}.txt`
  fs.access(filePath, (err) => {
    if (err) {
      callback(err)
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(new Error('invalid file'));
        } else {
          callback(null, { id, text });
        }
      })
    }
  });
}

exports.delete = (id, callback) => {
  fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
}

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
