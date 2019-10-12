<template>
  <f7-page
    infinite
    :infinite-distance="200"
    :infinite-preloader="showPreloader && !searchError"
    @infinite="loadBooks"
    ptr
    @ptr:refresh="refreshBooks"
    :ptr-preloader="showPtrPreloader && !searchError"
  >
    <f7-block-title medium>{{ title }}</f7-block-title>
    <f7-block inner>
      <p>{{ smallTitle }} {{ totalCount }}</p>
    </f7-block>

    <f7-list v-if="!searchError" media-list>
      <template v-for="b in books">
        <f7-list-item
          :key="`book${b.id}`"
          link="#"
          :title="b.title"
          :after="`${b.year}/${b.month}`"
          :subtitle="b.type.capitalize()"
          :text="typeof b.description === 'string' ? b.description.escape().slice(0, 220) + '...' : ''"
          @click="openPopup(b.id)"
        >
          <f7-row class="margin-top">
            <!-- <f7-col>{{b.title}}</f7-col> -->
            <f7-col>
              <div class="display-flex justify-content-flex-end width-100">
                <f7-button fill style="width: 40%">
                  <span v-if="b.type === 'normal'">Oku</span>
                  <span v-else-if="b.type === 'video'">Izle</span>
                  <span v-else>Dinle</span>
                </f7-button>
              </div>
            </f7-col>
          </f7-row>
          <c-image
            v-if="b.image !== null"
            :src="$crequest().genAuthStaticCDNUrl(`${b.image}`)"
            slot="media"
            width="80"
            height="120"
            type="background"
            :download="true"
          />
          <f7-popup
            :class="`popup${b.id}`"
            :id="`popup${b.id}`"
            @popup:closed="closeAllMedia(b.id)"
            swipe-to-close
            tablet-fullscreen
          >
            <f7-page :style="applybackground(b.image)">
              <f7-navbar :title="b.title" style="opacity:.6">
                <f7-nav-right>
                  <f7-link popup-close>X</f7-link>
                </f7-nav-right>
              </f7-navbar>

              <f7-swiper
                :id="`slider${b.id}`"
                :width="innerWidth"
                :height="innerHeight"
                pagination
                :options="swiperOptions"
                :ref="`slider${b.id}`"
              >
                <f7-swiper-slide
                  :key="b.id+page.id"
                  v-for="page in b.pages"
                  :id="`swiper${b.id+page.id}`"
                  :style="applybackground(page.image)"
                >
                  <div
                    :key="asset.id"
                    v-for="asset in getAssets(page.book_id,page.id)"
                    :style="applyAssetStyle(asset)"
                  >
                    <c-image
                      v-if="asset.type=='background'"
                      :src="`${asset.content}`"
                      :type="asset.type"
                      slot="media"
                      class="inner-page"
                    />

                    <vue-plyr v-else-if="asset.type=='video'" allowtransparency ref="plyr">
                      <video>
                        <source :src="`${asset.content}`" type="video/mp4" />
                      </video>
                    </vue-plyr>

                    <vue-plyr v-else-if="asset.type=='audio'" allowtransparency ref="plyr">
                      <audio>
                        <source :src="`${asset.content}`" type="audio/mp3" />
                      </audio>
                    </vue-plyr>
                    <f7-card v-else-if="asset.type=='link'">
                      <f7-link
                        :href="asset.content"
                        external
                        target="_system"
                        @click="window.open(`${asset.content}`, "_system"); return false;"
                      >{{asset.content}}</f7-link>
                    </f7-card>
                    <f7-card v-else-if="asset.type=='text'" :content="asset.content"></f7-card>
                  </div>
                </f7-swiper-slide>
              </f7-swiper>
            </f7-page>
          </f7-popup>
        </f7-list-item>
      </template>
    </f7-list>
    <f7-block v-else strong>
      <p>{{ searchErrorText }}</p>
    </f7-block>
    <f7-block-footer v-if="!searchError" class="padding-bottom">
      <p class="text-align-center">{{ bottomMessage }}</p>
      <div class="width-100 text-align-center">
        <f7-icon fa="dot-circle"></f7-icon>
        <f7-icon fa="dot-circle"></f7-icon>
        <f7-icon fa="dot-circle"></f7-icon>
      </div>
    </f7-block-footer>
  </f7-page>
</template>
<script>
import { cImage } from "../components/all";
import { mapGetters, mapActions } from "vuex";

import qs from "query-string";

export default {
  components: {
    cImage
  },
  computed: {
    ...mapGetters({
      searchQuery: "getSearchQuery"
    })
  },
  data() {
    return {
      books: [],
      totalCount: 0,
      allowInfinite: true,
      showPreloader: true,
      showPtrPreloader: true,
      lastPage: 0,
      bottomMessage: "Daha fazla yuklemek icin kaydirin.",
      title: "Arama Sonuclari",
      titleNormal: "Son Yayinlanan Icerikler",
      smallTitle: "Toplam bulunan sonuc: ",
      query: null,
      searchError: false,
      searchErrorText: "",
      assets: {},
      innerHeight: 0,
      innerWidth: 0,
      swiperOptions: {
        pagination: {
          el: ".swiper-pagination",
          type: "progressbar"
        }
      },
      asset: {
        add: true,
        name: "",
        delay: 0,
        order: 0,
        background: "",
        backgroundPosition: "",
        backgroundSize: "",
        typeList: [
          { key: "text", value: "Yazi" },
          { key: "img", value: "Gorsel" },
          { key: "video", value: "Video" },
          { key: "audio", value: "Ses" },
          { key: "popup", value: "Popup" },
          { key: "link", value: "Baglanti" }
        ],
        animationList: [],
        delayList: [
          { key: "0.5", value: ".5s" },
          { key: "1", value: "1s" },
          { key: "2", value: "2s" },
          { key: "3", value: "3s" },
          { key: "4", value: "4s" },
          { key: "5", value: "5s" },
          { key: "6", value: "6s" },
          { key: "7", value: "7s" },
          { key: "8", value: "8s" },
          { key: "9", value: "9s" },
          { key: "10", value: "10s" }
        ],
        positionList: [
          { key: "c1", value: "center center" },
          { key: "c2", value: "center left" },
          { key: "c3", value: "center right" },
          { key: "t1", value: "top center" },
          { key: "t2", value: "top right" },
          { key: "t3", value: "top left" }
        ],
        sizeList: [
          { key: "s1", value: "cover" },
          { key: "s2", value: "100%" },
          { key: "s4", value: "50%" },
          { key: "s5", value: "25%" },
          { key: "s6", value: "5%" }
        ],
        zIndex: 0,
        width: "0",
        height: "0",
        left: "0",
        top: "0",
        fontSize: "",
        color: "",
        animation: "",
        positions: {
          c1: "center center",
          c2: "center left",
          c3: "center right",
          t1: "top center",
          t2: "top right",
          t3: "top left"
        },
        sizes: {
          s1: "cover",
          s2: "100%",
          s3: "100% 100%",
          s4: "50%",
          s5: "50% 50%"
        }
      }
    };
  },
  mounted() {
    const self = this;
    if (this.$auth().loggedIn()) {
      this.books = [];
      this.query = this.searchQuery;
      if (this.query.length < 3) {
        this.searchError = true;
        this.searchErrorText =
          "Arama yapabilmek icin minumum 3 karakter girin.";
      } else {
        this.getBooks();
      }
    }
  },
  activated() {
    const self = this;
    if (this.$auth().loggedIn()) {
      if (self.isSearch === true) {
        self.books = [];
        this.query = this.searchQuery;

        if (this.query.length < 3) {
          this.searchError = true;
          this.searchErrorText =
            "Arama yapabilmek icin minumum 3 karakter girin.";
        } else {
          this.getBooks();
        }
      }
    }
  },
  destroyed() {
    this.books = [];
  },
  deactivated() {
    this.books = [];
  },
  methods: {
    refreshBooks(e, done) {
      if (this.isSearch) {
        return;
      }
      this.books = [];
      this.lastPage = 0;
      this.getBooks(done);
    },
    loadBooks() {
      if (this.isSearch) {
        return;
      }
      const self = this;
      if (!self.allowInfinite) return;
      self.allowInfinite = false;
      self.lastPage = this.lastPage + 1;
      self.getBooks();
    },
    async getBooks(done = false) {
      const self = this;
      self.offset = self.limit * this.lastPage;
      const params = qs.stringify({
        query: self.query,
        order_by: "asc",
        order_field: "order"
      });

      self
        .$crequest()
        .get(`/book?${params}`)
        .then(r => {
          self.totalCount = r.data.total_count;

          if (r.data.total_count > 0) {
             r.data.data.forEach(v => {
              v["photos"] = self.getBookPhotos(v);
              self.books.push(v);
            });
            self.showPtrPreloader = true;
          } else {
            self.searchError = true;
            self.searchErrorText =
              "Aradiginiz kelime ile uyumlu herhangi bir yayin bulunamadi.";
          }
          setTimeout(function() {
            self.showPreloader = false;
            self.allowInfinite = self.books.length !== r.data.total_count;
            self.bottomMessage = "Goruntulenek yayin kalmadi.";
            self.showPtrPreloader = false;
            if (done) {
              done();
            }
          }, 500);
        });
    },
    applyAssetStyle(asset) {
      var assetResult = { position: "relative" };

      if (asset.type === "background") {
        assetResult.background = asset.content;
        if (
          asset.data !== null &&
          typeof asset.data["css"] !== "undefined" &&
          asset.data["css"].backgroundPosition !== null
        ) {
          assetResult["background-position"] =
            asset.data.css.backgroundPosition;
          assetResult["background-size"] = asset.data.css.backgroundSize;
        }
      } else {
        assetResult["z-index"] =
          asset &&
          asset.data !== null &&
          asset.data.css !== null &&
          asset.data.css.zIndex !== null
            ? asset.data.css.zIndex
            : 0;
        assetResult.width =
          asset &&
          asset.data !== null &&
          asset.data.css !== null &&
          asset.data.css.width !== "null"
            ? `${asset.data.css.width}%`
            : 0;
        assetResult.height =
          asset &&
          asset.data !== null &&
          asset.data.css !== null &&
          asset.data.css.height !== "null"
            ? `${asset.data.css.height}%`
            : 0;
        assetResult.top =
          asset &&
          asset.data !== null &&
          asset.data.css !== null &&
          asset.data.css.top !== "null"
            ? `${asset.data.css.top}%`
            : 0;
        assetResult.left =
          asset &&
          asset.data !== null &&
          asset.data.css !== null &&
          asset.data.css.left !== "null"
            ? `${asset.data.css.left}%`
            : 0;
        assetResult["text-align"] =
          typeof asset.data.css.fontAlign !== "undefined" &&
          asset.data.css.fontAlign !== null
            ? asset.data.css.fontAlign
            : "left";
        assetResult.color =
          typeof asset.data.css.color !== "undefined" &&
          asset.data.css.color !== null
            ? asset.data.css.color
            : "#000000";
      }

      var styleResult = "";
      for (var c in assetResult) {
        styleResult += c + ":'" + assetResult[c] + "';";
      }
      return assetResult;
    },
    applybackground(img) {
      let result = { background: "center center / cover no-repeat" };
      result["backgroundImage"] =
        "url(" + this.$crequest().genAuthStaticCDNUrl(`${img}`) + "]";
      return result;
    },
    openPopup(key) {
      var popup = this.$f7.popup.create({
        el: ".popup" + key,
        swipeToClose: true
      });
      var self = this;
      var swiper = this.$f7.swiper.get("#slider" + key);
      this.$nextTick(() => {
        //re-render end
        swiper.$el[0].swiper.update();
      });

      popup.open();
    },
    closeAllMedia(key) {
      for (var pID in this.$refs["plyr"]) {
        var pl = this.$refs["plyr"][pID].player;
        if (typeof pl.stop == "function") {
          pl.stop();
        } else if (
          typeof pl.player == "object" &&
          typeof pl.player == "function"
        ) {
          pl.player.stop();
        }
      }
    },
    changeFileName(asset) {
      console.info("changename-->",asset);
      var name = this.$file.get(asset.content);
      asset.content = name;
      this.assets[asset.id] = asset;
    },
    getAssets(bookID, pageID) {
      let result = [];
      let self = this;
      for (var assetID in this.assets) {
        var x = self.assets[assetID];
        if (x.page_id == pageID && x.book_id == bookID) {
          result.push(x);
        }
      }
      return result;
    },
    getBookPhotos(bookObj) {
      let sonuc = [];
      let pages = {};
      var self = this;
      if (bookObj.pages.length > 0) {
        self.showPtrPreloader = true;
        for (var page in bookObj.pages) {
          if (
            typeof bookObj.pages[page] != "undefined" &&
            typeof bookObj.pages[page].assets != "undefined" &&
            bookObj.pages[page].assets.length > 0
          ) {
            let assets = bookObj.pages[page].assets;
            for (var asset in assets) {
              let tmpAsset = assets[asset];

              if (
                tmpAsset.type == "video" ||
                tmpAsset.type == "img" ||
                tmpAsset.type == "audio" ||
                tmpAsset.type == "background"
              ) {                
                tmpAsset.content = self
                  .$crequest()
                  .generateCDNRoute(tmpAsset.content);
                self.$file.isExist(
                  self.$file.get(tmpAsset.content),
                  function() {
                    console.info("dosya-var-->");
                    self.changeFileName(tmpAsset);
                  },
                  function() {
                    self.$file.download(
                      tmpAsset.content,
                      function() {
                        console.info("dosya-indirildi-->");
                        self.changeFileName(tmpAsset);
                      },
                      function() {
                        console.info("indirilemedi");
                      }
                    );
                  }
                );
              }
              //console.table(tmpAsset);
              sonuc.push(tmpAsset);
              this.assets[tmpAsset.id] = tmpAsset;
            }
            self.showPtrPreloader = false;
          }
        }
      }
      return sonuc;
    }
  },
  watch: {
    searchQuery(val) {
      const self = this;
      self.searchError = false;
      self.searchErrorText = "";
      self.books = [];
      self.query = val;
      if (self.query.length < 3) {
        self.searchError = true;
        self.searchErrorText =
          "Arama yapabilmek icin minumum 3 karakter girin.";
        return;
      }
      self.getBooks();
    }
  }
};
</script>

<style scoped>
.ios {
  --f7-ptr-preloader-size: 20px;
  --f7-ptr-size: 44px;
}
.md {
  --f7-ptr-preloader-size: 22px;
  --f7-ptr-size: 40px;
}
.aurora {
  --f7-ptr-preloader-size: 20px;
  --f7-ptr-size: 38px;
}
</style>
