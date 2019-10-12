<template>
  <!-- App -->
  <f7-app :params="f7params">
    <f7-statusbar></f7-statusbar>
    <f7-panel left cover resizable>
      <f7-view url="/panel-left/" links-view=".view-main" />
    </f7-panel>
    <f7-navbar v-if="getLogged">
      <f7-nav-left>
        <f7-link class="panel-open" open-panel="left">
          <f7-icon fa="bars"></f7-icon>
          <span>Menu</span>
        </f7-link>
      </f7-nav-left>
      <div class="title">Pierre Fabre</div>
      <f7-nav-right>
        <f7-link
          class="searchbar-enable"
          data-searchbar=".searchbar-components"
          icon="fas fa-search"
        ></f7-link>
      </f7-nav-right>
      <f7-searchbar
        class="searchbar-components"
        search-container=".components-list"
        search-in="a"
        :custom-search="true"
        expandable
        @change="search"
      ></f7-searchbar>
    </f7-navbar>
    <f7-view url="/" :main="true" class="ios-edges"></f7-view>
  </f7-app>
</template>
<script>
// Import Routes...
import {
  f7App,
  f7Panel,
  f7View,
  f7Statusbar,
  f7PhotoBrowser,
  f7Popup,
  f7Swiper,
  f7SwiperSlide
} from "framework7-vue";
import routes from "./routes.js";

let theme = "auto";
if (document.location.search.indexOf("theme=") >= 0) {
  theme = document.location.search.split("theme=")[1].split("&")[0];
}

import { Socket, Presence } from "./plugins/phoenix";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    f7App,
    f7Panel,
    f7View,
    f7Statusbar,
    f7Popup,
    f7Swiper,
    f7SwiperSlide
  },
  computed: {
    ...mapGetters({
      getLogged: "getLogged",
      getBooks: "book/getBooks"
    })
  },
  data() {
    return {
      f7params: {
        theme,
        routes,
        id: "com.buzz.presentationapp"
      },
      mainDirectory: null
    };
  },
  created() {
    var self = this;
    document.addEventListener(
      "deviceready",
      function() {
        console.info("device ready");
        self.setDirectory();
        self.$file.setDevice(device.platform);
      },
      false
    );
  },
  mounted() {
    const self = this;
    this.$f7ready(f7 => {
      if (!self.$auth().loggedIn()) {
        f7.views.main.router.navigate({ url: "/login" });
      } else {
        const app = self.$f7;
        const currentColorClass = app.root[0].className.match(
          /color-theme-([a-z]*)/
        );
        if (currentColorClass) app.root.removeClass(currentColorClass[0]);
        app.root.addClass(`color-theme-pink`);
        self.$crequest().setIntercept(true);
        self.getCategories();
        self.connectSocket();
        self.$auth().setApp(self);
        
        self.$file.setDriver(new FileTransfer());
        self.openDb();
        
      }
    });
  },
  methods: {
    ...mapActions({
      addCategories: "category/addCategories",
      setSearchQuery: "setSearchQuery"
    }),
    postDeviceInformation() {
      const self = this;

      if (typeof PushNotification !== "undefined") {
        let push = PushNotification.init({
          android: {
            senderID: "386491485179"
          },
          ios: {
            alert: true,
            badge: true,
            sound: true
          }
        });

        let platform;
        self.$file.setDevice(device.platform);
        switch (device.platform) {
          case "Android":
            platform = "android";

            push.on("registration", function(data) {
              self
                .$crequest()
                .post(`/user/${self.$auth().userId}/device_information`, {
                  device_information: {
                    os_platform: platform,
                    token: data.registrationId
                  }
                });
            });
            break;
          case "iOS":
            platform = "ios";
            push.on("registration", function(data) {
              self
                .$crequest()
                .post(`/user/${self.$auth().userId}/device_information`, {
                  device_information: {
                    os_platform: platform,
                    token: data.registrationId
                  }
                });
            });
            break;
        }
      }
    },
    setDirectory() {
      
      var directory = "";
      if (device.platform.toLowerCase() == "ios") {
        directory = cordova.file.externalDataDirectory;
      } else if (device.platform.toLowerCase() == "android") {
        directory = cordova.file.dataDirectory;
      }
      this.mainDirectory = cordova.file.dataDirectory;
    },
    openDb() {
      const dbSize = 50 * 1024 * 1024;

      if (this.$isApp()) {
        const db = window.sqlitePlugin.openDatabase(
          {
            name: "my.db",
            location: "default",
            androidDatabaseProvider: "system"
          },
          function() {
            console.log("SQLite Database created");
          }
        );

        this.$database().setDb(db);
      } else {
        const db = window.openDatabase(
          "presenstationApp",
          "",
          "PrDatabase",
          dbSize,
          function() {
            console.log("WebSQL Database created");
          }
        );

        this.$database().setDb(db);
      }
    },
    search(event) {
      const self = this;
      self.setSearchQuery(event.target.value);
      self.$f7.views.main.router.navigate("/search/");
    },
    async getCategories() {
      const self = this;
      self
        .$crequest()
        .get("/category")
        .then(r => {
          if (r.data.total_count > 0) {
            self.addCategories(r.data.data);
          }
        });
    },
    connectSocket() {
      //   const self = this;
      //   const apiUrl = self
      //     .$crequest()
      //     .apiUrl.replace("http", "ws")
      //     .replace(`/${this.$crequest().version}`, "");
      //   this.$socket = new Socket(`${apiUrl}/socket`, {
      //     params: {
      //       token: this.$crequest().token,
      //       connect_type: "dashboard"
      //     }
      //   });
      // this.$socket.connect(false);
      // setTimeout(function () {
      //   let channel = self.$socket.channel('lobby');
      //   channel.join();
      //   self.$channels['lobby'] = channel;
      //   let presence = new Presence(channel);
      //   self.$presence['lobby'] = presence;
      //   presence.onSync(() => {
      //     self.setLoggedUserCount(presence.list().filter((f) => {
      //       return f.type === "mobile";
      //     }).length);
      //     self.setActiveUsers(_.map(presence.list().slice(0, 10).filter((f) => {
      //       return f.type === "mobile";
      //     }), (v) => {
      //       return v.user;
      //     }));
      //     self.setLoggedAdminCount(presence.list().filter((f) => {
      //       return f.type === "dashboard";
      //     }).length);
      //     self.setActiveAdmins(_.map(presence.list().filter((f) => {
      //       return f.type === "dashboard";
      //     }), (v) => {
      //       return v.user;
      //     }))
      //   })
      // }, 250);
    },
    disconnectSocket() {
      // this.$socket.disconnect(function() {
      //   console.log("Socket disconnected");
      // });
    }
  },
  watch: {
    mainDirectory() {
      var self = this;
      console.info("maindirektoryChange", self.mainDirectory);
      self.$file.setDirectory(self.mainDirectory);
    },
    getLogged(val) {
      const self = this;
      if (val === true) {
        //   //     //self.connectSocket();
        //   //     self.getCategories();
        //   //     self.$crequest().setIntercept(true);
        //   //     self.$auth().setApp(self);
        self.openDb();
        self.$file.setDriver(new FileTransfer());
        //   //     self.postDeviceInformation();
      } else {
        //   //   //   // Object.keys(self.$channels).map((k) => {
        //   //   //   //   self.$channels[k].leave();
        //   //   //   // });
        //   //   //   // setTimeout(function () {
        //   //   //   //   self.disconnectSocket();
        //   //   //   // }, 350);
      }
    }
  }
};
</script>

