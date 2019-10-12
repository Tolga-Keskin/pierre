import qs from 'query-string';

class Auth {
  constructor(params = false) {
    const self = this;
    self.types = {
      'self': 'user',
      'superadmin': 'superadmin',
    };
    self.userId = null;
    self.storage = window.localStorage;
    self.type = self.types.superadmin;
    self.request = params.request;
    self.passphraseId = null;
    self.app = null;
    if(this.storage.getItem('token') !== null) {
      self.logged = true;
      this.userId = this.storage.getItem('userId');
      this.type = this.storage.getItem('type');
      this.passphraseId = this.storage.getItem('passphraseId');
      this.type = this.types[this.storage.getItem('type')];
    } else {
      self.logged = false;
    }

    if(typeof params.request !== 'undefined') {
      self.request = params.request;
    }

    if(typeof params.store !== 'undefined') {
      self.store = params.store;
    }
  }

  setApp(app) {
    this.app = app;
    return this;
  }

  loggedIn() {
    const self = this;
    if (this.storage.getItem('token') !== null || self.logged) {
      this.userId = this.storage.getItem('userId');
      this.type = this.storage.getItem('type');
      this.passphraseId = this.storage.getItem('passphraseId');
      this.type = this.types[this.storage.getItem('type')];
      this.store._actions.setLogged[0](true);
      return true;
    } else {
      this.store._actions.setLogged[0](false);
      return false;
    }
  }

  login(params) {
    const self = this;
    self.logged = true;
    self.request.token = params.token;
    self.storage.setItem('token', params.token);
    self.storage.setItem('passphrase', params.passphrase);
    self.storage.setItem('userId', params.userId);
    self.storage.setItem('type', params.type);
    self.storage.setItem('passphraseId', params.passphraseId);
    self.userId = params.userId;
    self.type = self.types[params.type];
    self.store._actions.setLogged[0](true);
    self.request.genAuthReq();
    if(typeof params.cb !== 'undefined' && typeof params.cb === 'function'){
      params.cb();
    }
  }

  logout() {
    const self = this;
    self.logged = false;
    self.request.post(`/user/${self.userId}/sign_out?` + qs.stringify({passphrase_ids: [self.passphraseId]},
      {arrayFormat: 'bracket'})).then((e) => {
      self.storage.removeItem('passphrase');
      self.storage.removeItem('token');
      self.storage.removeItem('user_id');
      self.storage.removeItem('type');
      self.storage.removeItem('passphraseId');
      self.storage.removeItem('setting');
      self.store._actions.setLogged[0](false);
      // self.app.$router.push({ name: 'Login' });
      self.app.$f7.views.main.router.navigate({url: '/login'});
    }).catch((e) => {
      console.log(e);
    });
  }
}

export default Auth;
