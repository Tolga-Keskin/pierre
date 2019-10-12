<template>
    <f7-page>
        <f7-block-title large>Profilim</f7-block-title>
        <f7-block inner class="margin-bottom-half">
            <p style="font-size: 1.3rem">Kisisel Bilgiler</p>
        </f7-block>
        <f7-row>
            <f7-list form inline-labels no-hairlines-md class="width-100">
                <f7-list-input
                        label="Ad"
                        type="text"
                        placeholder="Ad"
                        :value="user.personal_information.given_name"
                        disabled
                ></f7-list-input>
                <f7-list-input
                        label="Soyad"
                        type="text"
                        placeholder="Soyad"
                        :value="user.personal_information.family_name"
                        disabled
                ></f7-list-input>
                <f7-list-input
                    label="Yeni Sifre"
                    type="text"
                    placeholder="Yeni Sifrenizi giriniz"
                    @input="password.text = $event.target.value"
                    :min-length="8"
                    :max-length="24"
                    validate>
                    <span slot="info"></span>
                </f7-list-input>
                <f7-list-button @click="putUser" text="Guncelle" color="green"></f7-list-button>
            </f7-list>
        </f7-row>
    </f7-page>
</template>

<script>
  export default {
    data() {
      return {
        user: {
          id: 0,
          personal_information: {
            given_name: '',
            family_name: '',
          },
          inserted_at: '',
        },
        given_name: {
          error: false,
          errorText: '',
        },
        family_name: {
          error: false,
          errorText: '',
        },
        password: {
          error: false,
          errorText: '',
          text: '',
        }
      }
    },
    mounted() {
      this.getUser();
    },
    activated() {
      this.getUser();
    },
    methods: {
      async getUser() {
        const self = this;
        self.$crequest().get(`/user/${self.$auth().userId}`).then((r) => {
          self.user = r.data.data;

          self.$crequest().get(`/user/${self.user.id}/email`).then((r) => {
            if(r.data.total_count > 0) {
              self.user.emails = r.data.data;
            }
          })
        });
      },
      putUser() {
        this.postPassword();
      },
      postPassword() {
        const self = this;
      }
    },
  }
</script>

<style scoped>

</style>
