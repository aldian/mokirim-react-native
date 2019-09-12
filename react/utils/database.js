import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DATABASE_NAME = "mokirim.sqlite";
const DATABASE_VERSION = "1.0";
const DATABASE_DISPLAY_NAME = "Mokirim Local Database";
const DATABASE_SIZE = 33554432;

let msg = "";

const openDatabase = () => {
  return SQLite.openDatabase(
    DATABASE_NAME, DATABASE_VERSION, DATABASE_DISPLAY_NAME, DATABASE_SIZE
  ).then(db => {
    //alert("THE DB X: " + (db === undefined || db === null));
    //msg += "RESULT -1 ";
    //alert(msg);
    return new Promise((resolve, reject) => {
      resolve("BERHASIL");
//    return db.transaction(tx => {
//      //msg += "RESULT 0 "
//      //alert(msg);
//      return tx.executeSql('DROP TABLE UserState');
    }).then(result => {
      //msg += "RESULT 1: " + result + " ";
      //alert(msg);
      return db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
          'UserState (name TEXT PRIMARY KEY, value TEXT)'
        );

        tx.executeSql(
         'CREATE TABLE IF NOT EXISTS ' +
         'PostalCode (id INTEGER PRIMARY KEY, code TEXT, subdistrict INTEGER)'
        );

        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
          'Subdistrict (id INTEGER PRIMARY KEY, name TEXT, district INTEGER)'
        );

        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
          'District (id INTEGER PRIMARY KEY, name TEXT, city INTEGER)'
        );

        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
          'City (id INTEGER PRIMARY KEY, name TEXT, state INTEGER)'
        );

        return tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
          'State (id INTEGER PRIMARY KEY, name TEXT, country INTEGER)'
        );
      });
    }).then(result => {
      //msg += "RESULT 2: " + result + " ";
      //alert(msg);
      //alert("THE DB:" + db);
      return db;
    });
  }).catch(error => {
    alert("ERROR: " + msg + " " + JSON.stringify(error));
    //alert("ERROR: " + error);
  });
};

const updateUserStates = (db, states) => {
  const names = Object.keys(states);
  return db.transaction(tx => {
    names.forEach(name => {
      tx.executeSql("DELETE FROM UserState WHERE name = ?", [name]);
      if (states[name] !== undefined) {
        tx.executeSql('INSERT INTO UserState (name, value) VALUES (?, ?)', [name, states[name]]);
      }
    });
  }).catch(error => {
    alert("ERROR: " + JSON.stringify(error));
  });
};

const loadUserStates = db => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT name, value FROM UserState").then(([tx, results]) => {
        resolve(results.rows);
      });
    }).catch(error => {
      reject(error);
    });
  });
};

const addSubdistrict = (db, obj) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Subdistrict (id, name, district) VALUES (?, ?, ?)',
        [obj.id, obj.name, obj.district]
      );
      resolve(1);
    }).catch(error => {
      reject(error);
    });
  });
};

const getSubdistrict = (db, id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT id, name, district FROM Subdistrict WHERE id = ? LIMIT 1", [id]).then(([tx, results]) => {
        resolve(results.rows);
      });
    }).catch(error => {
      reject(error);
    });
  });
};

const addDistrict = (db, obj) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO District (id, name, city) VALUES (?, ?, ?)',
        [obj.id, obj.name, obj.city]
      );
      resolve(1);
    }).catch(error => {
      reject(error);
    });
  });
};

const getDistrict = (db, id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT id, name, city FROM District WHERE id = ? LIMIT 1", [id]).then(([tx, results]) => {
        resolve(results.rows);
      });
    }).catch(error => {
      reject(error);
    });
  });
};

const addCity = (db, obj) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO City (id, name, state) VALUES (?, ?, ?)',
        [obj.id, obj.name, obj.state]
      );
      resolve(1);
    }).catch(error => {
      reject(error);
    });
  });
};

const getCity = (db, id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT id, name, state FROM City WHERE id = ? LIMIT 1", [id]).then(([tx, results]) => {
        resolve(results.rows);
      });
    }).catch(error => {
      reject(error);
    });
  });
};

const addState = (db, obj) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO State (id, name, country) VALUES (?, ?, ?)',
        [obj.id, obj.name, obj.country]
      );
      resolve(1);
    }).catch(error => {
      reject(error);
    });
  });
};

const getState = (db, id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT id, name, country FROM State WHERE id = ? LIMIT 1", [id]).then(([tx, results]) => {
        resolve(results.rows);
      });
    }).catch(error => {
      reject(error);
    });
  });
};

const addPostalCode = (db, obj) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO PostalCode (id, code, subdistrict) VALUES (?, ?, ?)',
        [obj.id, obj.code, obj.subdistrict]
      );
      resolve(1);
    }).catch(error => {
      reject(error);
    });
  });
};

const getPostalCode = (db, id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT id, code, subdistrict FROM PostalCode WHERE id = ? LIMIT 1", [id]).then(([tx, results]) => {
        resolve(results.rows);
      });
    }).catch(error => {
      reject(error);
    });
  });
};

export default Database = {
  openDatabase,
  updateUserStates,
  loadUserStates,

  addSubdistrict,
  getSubdistrict,
  addDistrict,
  getDistrict,
  addCity,
  getCity,
  addState,
  getState,
  addPostalCode,
  getPostalCode,
};
