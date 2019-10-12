class FileName{  
    constructor(filename){
      this._file=filename;
    }
    setFileName(filename){
      this._file=filename;
    }
    getFilename(){
      return this._file;
    }
  }
  export default FileName;