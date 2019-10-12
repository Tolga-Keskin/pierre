import axios from 'axios';

class Request {
  constructor(params = false) {
    const self = this;
    self.version = "v1";
    //real one
   // self.apiUrl = (process.env.NODE_ENV === 'production') ? `http://192.168.8.102:4000/${self.version}` :      `http://192.168.8.102:4000/${self.version}`;
   //just for test
   self.apiUrl = (process.env.NODE_ENV === 'production') ? `https://api.pierre-fabre-clm.buzziletisim.com/${self.version}` :`https://api.pierre-fabre-clm.buzziletisim.com/${self.version}`;
    self.tokenUri = '/user/sign_in/token';
    self.cdnUrl = 'https://files.pierre-fabre-clm.buzziletisim.com/media';
    self.response = null;
    self.retrieve = false;
    self.token = null;
    self.storage = (typeof params.storage !== 'undefined') ? params.storage : window.localStorage;
    self.timeInformation = {};
    self.app = null;
    self.socket = null;
    self.intercept = true;
    if (params) {
      self.params = params;
    }

    if (self.storage.getItem('token') === null) {
      self.req = axios.create({
        baseUrl: self.apiUrl,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        responseType: 'json',
        xsrfCookieName: null,
        xsrfHeaderName: null,
      });
    } else {
      self.token = self.storage.getItem('token');
      self.req = axios.create({
        baseUrl: self.apiUrl,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${self.token}`,
          Accept: 'application/json',
        },
        responseType: 'json',
        xsrfCookieName: null,
        xsrfHeaderName: null,
      });
    }
  }
  setIntercept(value) {
    this.intercept = value;
    if(value === true){
      this.interceptor();
    }
    return this;
  }
  setVersion(version) {
    this.version = version;
    this.apiUrl = (process.env.NODE_ENV === 'production') ? `https://api.pierre-fabre-clm.buzziletisim.com/${this.version}` :
      `https://api.pierre-fabre-clm.buzziletisim.com/${this.version}`;
    return this;
  }
  setApp(app) {
    this.app = app;
    return this;
  }
  get(uri) {
    return this.req.get(this.apiUrl + uri);
  }
  post(uri, data) {
    return this.req.post(this.apiUrl + uri, data);
  }
  put(uri, data) {
    return this.req.put(this.apiUrl + uri, data);
  }
  patch(uri, data) {
    return this.req.patch(this.apiUrl + uri, data);
  }
  delete(uri, data = false) {
    if (!data) {
      return this.req.delete(this.apiUrl + uri);
    }
    return this.req.delete(this.apiUrl + uri, data);
  }
  // genRequest(method, uri, params = false) {
  //   if(this.retrieve === false) {
  //     switch (method) {
  //       case 'post':
  //         return this.req.post(this.apiUrl + uri, params);
  //       case 'put':
  //         return this.req.put(this.apiUrl + uri, params);
  //       case 'patch':
  //         return this.req.patch(this.apiUrl + uri, params);
  //       case 'delete':
  //         return (params !== false ? this.req.delete(this.apiUrl + uri, params) :
  //           this.req.delete(this.apiUrl + uri));
  //       case 'get':
  //       default:
  //         return this.req.get(this.apiUrl + uri);
  //     }
  //   } else {
  //     return this.genRequest(method, uri, params);
  //   }
  // }
  genAuthReq() {
    const self = this;
    self.token = self.storage.getItem('token');
    self.req = axios.create({
      baseUrl: self.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${self.token}`,
        Accept: 'application/json',
      },
      responseType: 'json',
      xsrfCookieName: null,
      xsrfHeaderName: null,
    });
  }
  genNewToken() {
    const self = this;
    const tokenRequest = axios.create({
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      responseType: 'json',
      xsrfCookieName: null,
      xsrfHeaderName: null,
    });

    return tokenRequest.post(self.apiUrl + self.tokenUri, {
      passphrase_submission: {
        passphrase: self.storage.getItem('passphrase'),
      },
    }).then((response) => {
      const token = response.data.data.jwt;
      self.storage.setItem('token', token);
      self.token = token;
      self.genAuthReq();
    }).catch((e) => {
      self.storage.removeItem('passphrase');
      self.storage.removeItem('token');
      self.storage.removeItem('userId');
      self.storage.removeItem('setting');
      self.storage.removeItem('type');
      location.reload();
    });
  }
  generateRoute(uri) {
    return `${this.apiUrl}/${uri}`;
  }
  generateCDNRoute(uri) {    
    return `${this.cdnUrl}/${uri}`;
  }
  genAuthUrl(uri, seperator = false) {
    return `${this.apiUrl}${seperator ? '/' : ''}${uri}?token=${this.token}`;
  }
  genAuthStaticUrl(uri, seperator = false) {
    return (uri.search('http') > 1 ?
      `${uri}?token=${this.token}` :
      `${this.apiUrl.replace(this.version, '')}${seperator ? '/' : ''}${uri}?token=${this.token}`);
  }
  genAuthStaticCDNUrl(uri, seperator = false) {  
    return (uri.search('http') > 1 ?
      `${uri}?token=${this.token}` :
      `${this.cdnUrl.replace(this.version, '')}${seperator ? '/' : ''}${uri}?token=${this.token}`);
  }
  interceptor() {
    const self = this;
    if(self.intercept) {
      self.req.interceptors.response.use(response => response, (error) => {
        if (error.response) {
          const originalRequest = error.config;
          if (!(typeof self.storage.getItem('token') === 'undefined' ||
            typeof self.storage.getItem('token') === null)) {
            if (error.response.status === 401 && !originalRequest._retry) {
              originalRequest._retry = true;
              const tokenRequest = axios.create({
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                },
                responseType: 'json',
                xsrfCookieName: null,
                xsrfHeaderName: null,
              });

              return tokenRequest.post(self.apiUrl + self.tokenUri, {
                passphrase_submission: {
                  passphrase: self.storage.getItem('passphrase'),
                },
              }).then((response) => {
                const token = response.data.data.jwt;
                self.storage.setItem('token', token);
                self.token = token;
                axios.defaults.headers.common.Authorization = `Bearer ${token}`;
                originalRequest.headers.Authorization = `Bearer ${token}`;
                self.genAuthReq();
                return axios(originalRequest);
              }).catch((e) => {
                self.storage.removeItem('passphrase');
                self.storage.removeItem('token');
                self.storage.removeItem('userId');
                self.storage.removeItem('setting');
                self.storage.removeItem('type');
                location.reload();
              });
            } else if (error.response.status === 404 && !originalRequest._retry) {
              return Promise.reject(error);
            }
          } else {
            return Promise.reject({error: error, response: error.response});
          }
        } else if (error.message === 'Network Error') {
          return Promise.reject(error);
        }
        return Promise.reject(error);
      });
    }
  }
  errorHandler(err, cb = false) {
    if (err.status === 422) {
      if(cb) {
        return cb();
      } else {
        return {
          error: err,
          changeset: err.data.errors.changeset,
        };
      }
    } else {
      return err;
    }
  }
}

export default Request;
