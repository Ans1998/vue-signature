<template>
  <div>
    <img style="width: 100%; height: 100%" :src="canvasBuildImgBase64" alt="" />
  </div>
</template>

<script>
export default {
  name: "photograph",
  data() {
    return {
      canvasBuildImgBase64: null
    };
  },
  mounted() {
    this.canvasBuildImgBase64 =
      sessionStorage.getItem("canvasBuildImgBase64") || null;
  },
  watch: {},
  methods: {}
};
</script>

<style scoped></style>
