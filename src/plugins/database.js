class Database {
  constructor() {
    const self = this;
    self.app = null;
    self.db = null;
  }

  setApp(app){
    this.app = app;
    return this;
  }

  setDb(db) {
    this.db = db;
    return this;
  }
}

export default Database;
