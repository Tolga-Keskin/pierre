<template>
  <f7-page class="PrAppPanelLeft">
    <f7-block-title>Menu</f7-block-title>
    <f7-list>
      <f7-list-item link="/" panel-close>
        Ana Sayfa
      </f7-list-item>
      <f7-list-item link="/profile/" panel-close>
        Profil
      </f7-list-item>
      <f7-list-item @click="signOut" style="cursor: pointer" panel-close>
        Cikis
        <f7-icon fa="sign-out-alt"></f7-icon>
      </f7-list-item>
      <f7-list-group>
        <f7-list-item title="Kategoriler" group-title></f7-list-item>
        <template v-for="c in categories">
          <f7-list-item :key="c.id" :title="`${c.name}`" :link="`/category/${c.id}/`" panel-close></f7-list-item>
        </template>
      </f7-list-group>
    </f7-list>
  </f7-page>
</template>
<script>
  import { mapGetters } from 'vuex';

  export default {
    components: {},
    computed: {
      ...mapGetters({
        getCategories: 'category/getCategories',
        getLogged: 'getLogged',
      })
    },
    data() {
      return {
        categories: [],
      }
    },
    mounted() {
      const self = this;
      setTimeout(function () {
        self.categories = self.getCategories;
      }, 350);
    },
    methods: {
      signOut() {
        this.$auth().logout();
        this.$f7.panel.close('left', true);
      },
    },
    watch: {
      'getLogged'(val) {
        const self = this;
        if(val === true) {
          setTimeout(function () {
            self.categories = this.getCategories;
          })
        }
      },
    }
  };
</script>

<style scoped>
  .PrAppPanelLeft{
    background: #FFFFFF;
  }
</style>
