//import { runInThisContext } from "vm";

class File {
  constructor() {
    const self = this;
    self.app = null;
    self.driver = null;
    self.downloadedFile = 0;
    self.device = null;
    self.directory = "";   
  }

  setApp(app) {
    this.app = app;
    return this;
  }

  setDriver(driver) {
    this.driver = driver;
    return this;
  }

  setDevice(plt) {
    this.device = plt;

    return this;
  }
  setDirectory(dir){
    this.directory=dir;

    return this.directory;
  }

  download(uri, successCallback = false, errorCallback = false) {
    const self = this;
    let parsedUri = new URL(uri);
    
    if (self.driver !== 'null') {
      self.driver.download(encodeURI(uri), self.directory + parsedUri.pathname,
        successCallback, errorCallback);
    }
  }

  getDirectory() {
    var self = this;

    // if (self.device.toLowerCase() == "ios") {
    //   self.directory = cordova.file.externalDataDirectory;
    // } else if (self.device.toLowerCase() == "android") {
    //   self.directory = cordova.file.dataDirectory;
    // }
    // if(self.device==null && cordova.file.externalDataDirectory==null){
    //   self.directory=cordova.file.dataDirectory;
    // }else{
    //   self.directory=cordova.file.externalDataDirectory;
    // }

    return self.directory;
  }

  isExist(uri, successCallback = false, errorCallback = false) {
    var self = this;
    //onsole.info("is exist--->",uri,self.get(uri));
    var q=window.resolveLocalFileSystemURL(self.get(uri), successCallback, errorCallback);
    
  }

  getStatus() {
    return this.status;
  }
  getFsURL(uri) {
    let parsedUri = new URL(uri);
    return self.directory + parsedUri.pathname;
  }
  get(uri, successCallback = false, errorCallback = false) {
    const self = this;
    let parsedUri = new URL(uri);
    if (self.driver !== 'null') {
      return self.directory + parsedUri.pathname;
    }
  }
}

export default File;
