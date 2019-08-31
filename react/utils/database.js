import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DATABASE_NAME = "mokirim.sqlite";
const DATABASE_VERSION = "1.0";
const DATABASE_DISPLAY_NAME = "Mokirim Local Database";
const DATABASE_SIZE = 1000000;

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
        return tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
          'UserState (name TEXT PRIMARY KEY, value TEXT)'
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

export default Database = {
  openDatabase,
  updateUserStates,
  loadUserStates,
};
