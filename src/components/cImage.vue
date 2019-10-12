<template>
  <img
    :src="url"
    :style="style"
    :width="width"
    :height="height"
    :class="classString + ' PrAppImage'"
    @error="imgError"
  />
</template>

<script>
import onex from "assets/images/1x.png";

export default {
  name: "cimage",
  props: {
    src: String,
    type: String,
    classes: Array,
    width: String,
    height: String,
    download: Boolean
  },
  data() {
    return {
      style: "",
      classString: "",
      url: ""
    };
  },
  mounted() {
    var self = this;
    let parsedUri = new URL(self.src);
    
    if (this.$props.download === true) {
      var src=self.$file.get(self.src);
      self.$file.isExist(
        src,
        function() {
          //console.info("qqqqq->",this.src);
          self.changeSrc(self.$file.get(self.src));
        },
        function() {
          self.$file.download(
            self.src,
            function(s) {
              //console.info("image-uri-->",s);              
              self.changeSrc(self.$file.get(self.src));
            },
            function(e) {
              console.log("download error->", e);
            }
          );
        }
      );
    }
    if (this.$props.type === "background") {
      this.classString += "BackgroundImage";
      this.style = `background-image: url('${this.src}')`;
      this.url = onex;
    } else {
      this.url = this.src;
    }

    if (typeof this.$props.classes !== "undefined") {
      this.classString += " " + this.$props.classes.join(" ");
    }
  },
  methods: {
    changeSrc(src) {
      this.src=src;
    },
    imgError(e) {
      console.log("image error->", e);
      // console.log(12312312);
    }
  }
};
</script>

<style scoped>
.BackgroundImage {
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
</style>
