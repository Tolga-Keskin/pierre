<template>
  
  <c-image
    v-if="$props.type=='background' || $props.type=='img' "
    :type="$props.type"
    :src="url"
    :style="style"
    :class="classString + ' PrAppImage'"
    @error="imgError"
  />
  <vue-plyr v-else-if="$props.type=='video'" allowtransparency ref="plyr">
    <video>
      <source :src="`${url}`" type="video/mp4" />
    </video>
  </vue-plyr>

  <vue-plyr v-else-if="$props.type=='audio'" allowtransparency ref="plyr">
    <audio>
      <source :src="`${url}`" type="audio/mp3" />
    </audio>
  </vue-plyr>
  <f7-link v-else-if="$props.type=='link'" :href="url" external target="_blank">url</f7-link>

  <f7-card v-else-if="$props.type=='text'" :content="url"></f7-card>

</template>

<script>
import onex from "assets/images/1x.png";
import cImage from "./cImage";
export default {
  name: "cslide",
  props: {
    src: String,
    type: String,
    classes: Array,
    special:Object
  },
  components: {
   cImage
  },
  data() {
    return {
      style: "",
      classString: "",
      url: "",

    };
  },
  mounted() {
    console.info(this);
    var self = this;
    if (this.$props.type === "background") {
      this.classString += "BackgroundImage";
      this.style = `background-image: url('${this.src}')`;
      this.url = onex;
    } else {
      this.url = this.src;
    }
    if(typeof this.$props.special.data.css !="undefined"){    
      this.style+=  Object.keys(this.$props.special.data.css).map(function(x){return (self.$props.special.data.css[x]!=null)?x+":"+self.$props.special.data.css[x]+";":""});
    }
    if (typeof this.$props.classes !== "undefined") {
      this.classString += " " + this.$props.classes.join(" ");
    }
  },
  methods: {
    changeSrc() {},
    imgError(e) {
      console.log(e);
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
