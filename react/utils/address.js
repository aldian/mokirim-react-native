import Database from './database';
import MokirimAPI from './MokirimAPI';

const getSubdistrict = (languageCode, accessToken, id) => {
  return Database.openDatabase().then(db => {
    return Database.getSubdistrict(db, id).then(rows => {
      if (rows.length < 1) {
        return null;
      }
      return rows.item(0);
    }).catch(err => {
      return null;
    }).then(row => {
      if (row !== null) {
        return row;
      }

      return MokirimAPI.getSubdistrict(languageCode, accessToken, id).then(response => {
        if (!response.ok) {
          return null;
        }
        return response.json().then(obj => {
          Database.addSubdistrict(db, obj);
          return obj;
        });
      });
    });
  });
};

const getDistrict = (languageCode, accessToken, id) => {
  return Database.openDatabase().then(db => {
    return Database.getDistrict(db, id).then(rows => {
      if (rows.length < 1) {
        return null;
      }
      return rows.item(0);
    }).catch(err => {
      return null;
    }).then(row => {
      if (row !== null) {
        return row;
      }

      return MokirimAPI.getDistrict(languageCode, accessToken, id).then(response => {
        if (!response.ok) {
          return null;
        }
        return response.json().then(obj => {
          Database.addDistrict(db, obj);
          return obj;
        });
      });
    });
  });
};

const getCity = (languageCode, accessToken, id) => {
  return Database.openDatabase().then(db => {
    return Database.getCity(db, id).then(rows => {
      if (rows.length < 1) {
        return null;
      }
      return rows.item(0);
    }).catch(err => {
      return null;
    }).then(row => {
      if (row !== null) {
        return row;
      }

      return MokirimAPI.getCity(languageCode, accessToken, id).then(response => {
        if (!response.ok) {
          return null;
        }
        return response.json().then(obj => {
          Database.addCity(db, obj);
          return obj;
        });
      });
    });
  });
};

const getState = (languageCode, accessToken, id) => {
  return Database.openDatabase().then(db => {
    return Database.getState(db, id).then(rows => {
      if (rows.length < 1) {
        return null;
      }
      return rows.item(0);
    }).catch(err => {
      return null;
    }).then(row => {
      if (row !== null) {
        return row;
      }

      return MokirimAPI.getState(languageCode, accessToken, id).then(response => {
        if (!response.ok) {
          return null;
        }
        return response.json().then(obj => {
          Database.addState(db, obj);
          return obj;
        });
      });
    });
  });
};

const getPostalCode = (languageCode, accessToken, id) => {
  return Database.openDatabase().then(db => {
    return Database.getPostalCode(db, id).then(rows => {
      if (rows.length < 1) {
        return null;
      }
      return rows.item(0);
    }).catch(err => {
      return null;
    }).then(row => {
      if (row !== null) {
        return row;
      }

      return MokirimAPI.getPostalCode(languageCode, accessToken, id).then(response => {
        if (!response.ok) {
          return null;
        }
        return response.json().then(obj => {
          Database.addPostalCode(db, obj);
          return obj;
        });
      });
    });
  });
};

export default {
  getSubdistrict,
  getDistrict,
  getCity,
  getState,
  getPostalCode,
}