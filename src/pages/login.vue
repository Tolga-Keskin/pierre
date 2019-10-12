<template>
    <f7-page no-toolbar no-navbar no-swipeback login-screen>
        <f7-col class="display-flex align-items-center justify-content-center" style="height: 100%">
            <f7-row>
                <f7-col width="100">
                    <f7-row>
                        <f7-login-screen-title>Pierre Fabre</f7-login-screen-title>
                    </f7-row>
                </f7-col>
                <f7-col width="100">
                    <f7-row>
                        <f7-list form class="width-100">
                            <f7-list-input
                                    label="Email"
                                    type="text"
                                    placeholder="Email"
                                    :value="email"
                                    clear-button
                                    @input="email = $event.target.value"
                            ></f7-list-input>
                            <f7-list-input
                                    label="Sifre"
                                    type="password"
                                    placeholder="Sifre"
                                    :value="password"
                                    clear-button
                                    @input="password = $event.target.value"
                            ></f7-list-input>
                        </f7-list>
                    </f7-row>
                </f7-col>
                <f7-col width="100">
                    <f7-row>
                        <f7-list>
                            <f7-list-button color="green" @click="signIn">Giris</f7-list-button>
                            <!--            <f7-block-footer>Some text about login information.<br>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</f7-block-footer>-->
                        </f7-list>
                    </f7-row>
                </f7-col>
            </f7-row>
        </f7-col>
    </f7-page>
</template>

<script>
  export default {
    data() {
      return {
        loginScreenOpened: false,
        email: '',
        password: '',
        dialog: this.$f7.dialog.create({
          title: 'Hata!',
          buttons: [
            {
              text: 'Tamam', onClick: function (dialog, e) {
                dialog.close(true);
              }
            }
          ]
        }),
      }
    },
    methods: {
      signIn() {
        const self = this;

        if(this.email.length < 5 || this.password.length < 4) {
          self.dialog.setText('Email veya sifre bilgilerini dogru girin!');
          self.dialog.open(true);
          return;
        }
        self.$crequest().setIntercept(false);
        //old is 
        self.$crequest().post('/user/sign_in', {
          credentials: {
            email: this.email,
            password: this.password,
          }
        }).then(function(r) {
          const data = r.data.data;
          const userId = data.user_id;
          const passphrase = data.passphrase;
          const passphraseId = data.id;
          const type = data.type;
          self.$crequest().post(self.$crequest().tokenUri, {
            passphrase_submission: {
              passphrase: passphrase,
            }
          }).then(function(r) {
            const data = r.data.data;
            self.$crequest().setIntercept(true);
            self.$auth().login({passphrase: passphrase, token: data.jwt, userId: userId, type: type,
              passphraseId: passphraseId});
            self.$f7.views.main.router.navigate('/');
          })
        }).catch(function(e) {
          if(e.response.status === 429) {
            self.dialog.setTitle('Hata!');
            self.dialog.setText('Gunluk giris limiti astiniz. Lutfen sistem yoneticinizle iletisime gecin.');
          } else {
            self.dialog.setTitle('Hata!');
            self.dialog.setText('Giris bilgileriniz hatali lutfen tekrar deneyin!');
          }

          self.dialog.open(true);
        });
      },
    }
  }
</script>

<style scoped>

</style>
