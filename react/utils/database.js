import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DATABASE_NAME = "mokirim.sqlite";
const DATABASE_VERSION = "1.0";
const DATABASE_DISPLAY_NAME = "Mokirim Local Database";
const DATABASE_SIZE = 134217728;

let msg = "";

const openDatabase = () => {
  return SQLite.openDatabase(
    DATABASE_NAME, DATABASE_VERSION, DATABASE_DISPLAY_NAME, DATABASE_SIZE
  ).then(db => {
    return new Promise((resolve, reject) => {
      resolve(null);
    }).then(result => {
      return db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
          'UserState (name TEXT PRIMARY KEY, value TEXT)'
        );

        tx.executeSql(
         'CREATE TABLE IF NOT EXISTS ' +
         'Address (id INTEGER PRIMARY KEY, name TEXT, subdistrict INTEGER, postalCode INTEGER, latitude REAL, longitude REAL)'
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
      return db;
    });
  }).catch(error => {
    return new Promise((resolve, reject) => reject(error));
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
    reject(error);
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

const insertTxRow = (tx, tableName, obj) => {
  const keys = Object.keys(obj);
  const fieldNames = keys.join(', ');
  const placeholders = keys.map(key => '?').join(', ');
  const values = keys.map(key => obj[key]);
  const sql = `INSERT INTO ${tableName} (${fieldNames}) VALUES (${placeholders})`;
  tx.executeSql(
    sql,
    values
  );
  //alert(sql + " " + values);
};

const updateTxRow = (tx, tableName, obj) => {
  const keys = Object.keys(obj).filter(key => key !== 'id');
  const fieldNames = keys.join(', ');
  const pairs = keys.map(key => `${key} = ?`).join(', ');
  const values = keys.map(key => obj[key]);
  const sql = `UPDATE ${tableName} SET ${pairs} WHERE id = ?`;
  tx.executeSql(
    sql,
    [...values, obj.id]
  );
  //alert(sql + " " + values);
};

const insertRow = (db, tableName, obj) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      try {
        insertTxRow(tx, tableName, obj);
        resolve(success);
      } catch (error) {
        reject(error);
      }
    }).catch(error => {
      reject(error);
    });
  });
};

const updateRow = (db, tableName, obj) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      try {
        updateTxRow(tx, tableName, obj);
        resolve(success);
      } catch (error) {
        reject(error);
      }
    }).catch(error => {
      reject(error);
    });
  });
}

const insertRows = (db, tableName, objs) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      objs.forEach(obj => {
        tx.executeSql(`SELECT id FROM ${tableName} WHERE id = ? LIMIT 1`, [obj.id]).then(([tx2, results]) => {
          const rows = results.rows;
          try {
            if (rows.length < 1) {
              insertRow(db, tableName, obj);
            } else {
              updateRow(db, tableName, obj);
            }
            resolve(true);
          } catch (error) {
            reject(error);
          }
        });
      });
    }).catch(error => {
      reject(error);
    });
  });
};

const addAddress = (db, obj) => insertRow(db, 'Address', {
  id: obj.id, name: obj.name, subdistrict: obj.subdistrict, postalCode: obj.postalCode,
  latitude: obj.latitude, longitude: obj.longitude,
});
const updateAddress = (db, obj) => {
  let cleanObj = {}
  Object.keys(obj).filter(
    key => key === 'id' || key === 'name' || key === 'subdistrict' || key === 'postalCode' || key === 'latitude' || key === 'longitude'
  ).forEach(key => {
    cleanObj[key] = obj[key];
  });
  return updateRow(db, 'Address', cleanObj)
};
const getAddress = (db, id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT id, name, subdistrict, postalCode, latitude, longitude FROM Address WHERE id = ? LIMIT 1", [id]).then(([tx, results]) => {
        resolve(results.rows);
      });
    }).catch(error => {
      reject(error);
    });
  });
};
const addOrUpdateAddress = (db, obj) => {
  return getAddress(db, obj.id).then(rows => {
    if (rows.length < 1) {
      return addAddress(db, obj);
    }
    return updateAddress(db, obj);
  }).catch(err => {
    return null;
  });
};

const addSubdistrict = (db, obj) => insertRow(db, 'Subdistrict', {
  id: obj.id, name: obj.name, district: obj.district
});
const updateSubdistrict = (db, obj) => {
  let cleanObj = {}
  Object.keys(obj).filter(
    key => key === 'id' || key === 'name' || key === 'district'
  ).forEach(key => {
    cleanObj[key] = obj[key];
  });
  return updateRow(db, 'Subdistrict', cleanObj)
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
const addOrUpdateSubdistrict = (db, obj) => {
  return getSubdistrict(db, obj.id).then(rows => {
    if (rows.length < 1) {
      return addSubdistrict(db, obj);
    }
    return updateSubdistrict(db, obj);
  }).catch(err => {
    return null;
  });
};

const addDistrict = (db, obj) => insertRow(db, 'District', {
  id: obj.id, name: obj.name, city: obj.city
});
const updateDistrict = (db, obj) => {
  let cleanObj = {}
  Object.keys(obj).filter(
    key => key === 'id' || key === 'name' || key === 'city'
  ).forEach(key => {
    cleanObj[key] = obj[key];
  });
  return updateRow(db, 'District', cleanObj)
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
const addOrUpdateDistrict = (db, obj) => {
  return getDistrict(db, obj.id).then(rows => {
    if (rows.length < 1) {
      return addDistrict(db, obj);
    }
    return updateDistrict(db, obj);
  }).catch(err => {
    return null;
  });
};

const addCity = (db, obj) => insertRow(db, 'City', {
  id: obj.id, name: obj.name, state: obj.state
});
const updateCity = (db, obj) => {
  let cleanObj = {}
  Object.keys(obj).filter(
    key => key === 'id' || key === 'name' || key === 'state'
  ).forEach(key => {
    cleanObj[key] = obj[key];
  });
  return updateRow(db, 'City', cleanObj)
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
const addOrUpdateCity = (db, obj) => {
  return getCity(db, obj.id).then(rows => {
    if (rows.length < 1) {
      return addCity(db, obj);
    }
    return updateCity(db, obj);
  }).catch(err => {
    return null;
  });
};

const addState = (db, obj) => insertRow(db, 'State', {
  id: obj.id, name: obj.name, country: obj.country
});
const updateState = (db, obj) => {
  let cleanObj = {}
  Object.keys(obj).filter(
    key => key === 'id' || key === 'name' || key === 'country'
  ).forEach(key => {
    cleanObj[key] = obj[key];
  });
  return updateRow(db, 'State', cleanObj)
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
const addOrUpdateState = (db, obj) => {
  return getState(db, obj.id).then(rows => {
    if (rows.length < 1) {
      return addState(db, obj);
    }
    return updateState(db, obj);
  }).catch(err => {
    return null;
  });
};

const addPostalCode = (db, obj) => insertRow(db, 'PostalCode', {
  id: obj.id, code: obj.code, subdistrict: obj.subdistrict
});
const updatePostalCode = (db, obj) => {
  let cleanObj = {}
  Object.keys(obj).filter(
    key => key === 'id' || key === 'code' || key === 'subdistrict'
  ).forEach(key => {
    cleanObj[key] = obj[key];
  });
  return updateRow(db, 'PostalCode', cleanObj);
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
const addOrUpdatePostalCode = (db, obj) => {
  return getPostalCode(db, obj.id).then(rows => {
    if (rows.length < 1) {
      return addPostalCode(db, obj);
    }
    return updatePostalCode(db, obj);
  }).catch(err => {
    return null;
  });
};

export default Database = {
  openDatabase,
  updateUserStates,
  loadUserStates,

  insertRows,
  addAddress,
  updateAddress,
  addOrUpdateAddress,
  getAddress,
  addSubdistrict,
  updateSubdistrict,
  addOrUpdateSubdistrict,
  getSubdistrict,
  addDistrict,
  updateDistrict,
  addOrUpdateDistrict,
  getDistrict,
  addCity,
  updateCity,
  addOrUpdateCity,
  getCity,
  addState,
  updateState,
  addOrUpdateState,
  getState,
  addPostalCode,
  updatePostalCode,
  addOrUpdatePostalCode,
  getPostalCode,
};
