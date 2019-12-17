<template>
  <div>
    <div class="hello">
      <canvas
        ref="myCanvas"
        width="400"
        height="400"
        style="border: 2px solid grey"
        >当前浏览器不支持canvas</canvas
      >
      <p @click="handelClearEl()">清除</p>
      <p @click="handelSaveEl()">保存</p>
      <p @click="handelThickness()">粗细</p>
      <p @click="handelColour()">颜色</p>
      <img :src="imgsrc" alt="" />
    </div>
    <form id="take_picture">
      <input
        id="btn_camera"
        type="file"
        accept="image/png,image/jpeg,image/gif,image/jpg"
        capture="camera"
        @change="onTake"
      />
    </form>
    <!--position: fixed; top: 10px;pointer-events: none;-->
    <img :src="imgBase64" alt="" style="width: 100%; height: 200px;" />
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      imgBase64: null,
      linewidth: 1, //线条粗细，选填
      color: "black", //线条颜色，选填
      background: "pink", //线条背景，选填
      imgsrc: ""
    };
  },
  mounted() {
    console.log("mounted");
    // console.log(this.color);
    // this.getCanvas();
  },
  methods: {
    getCanvas(src) {
      let canvas = this.$refs.myCanvas;
      let cxt = canvas.getContext("2d");
      var img = new Image();
      img.src = src;
      //图片加载完后，将其显示在canvas中
      img.onload = function() {
        cxt.drawImage(this, 0, 0);
        // context.drawImage(this, 0, 0, 1080, 980)改变图片大小到1080*980
      };
      cxt.fillStyle = this.background; //填充绘图的背景颜色
      cxt.fillRect(0, 0, canvas.width, canvas.height); //绘制“已填色”的矩形
      cxt.strokeStyle = this.color; //笔触的颜色
      cxt.lineCap = "round"; //线条末端线帽的样式
      let linewidth = this.linewidth;
      //开始绘制
      canvas.addEventListener(
        "touchstart",
        function(e) {
          cxt.beginPath();
          cxt.lineWidth = linewidth; //当前线条的宽度，以像素计
          cxt.moveTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
        }.bind(this),
        false
      );
      //绘制中
      canvas.addEventListener(
        "touchmove",
        function(e) {
          cxt.lineTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
          cxt.stroke();
        }.bind(this),
        false
      );
      //结束绘制
      canvas.addEventListener(
        "touchend",
        function() {
          cxt.closePath();
        }.bind(this),
        false
      );
    },
    handelColour() {
      this.color = "red";
      this.getCanvas();
    },
    handelThickness() {
      this.linewidth = 5;
      this.getCanvas();
    },
    handelClearEl() {
      let canvas = this.$refs.myCanvas;
      let cxt = canvas.getContext("2d");
      cxt.clearRect(0, 0, canvas.width, canvas.height);
    },
    handelSaveEl() {
      let canvas = this.$refs.myCanvas;
      let imgBase64 = canvas.toDataURL();
      console.log(imgBase64);
      this.imgsrc = imgBase64;
    },

    onTake(e) {
      // console.log(e.target.files);
      let files = e.target.files;
      // console.log(files[0]);
      let reader = new FileReader(); //本地预览
      // console.log('reader---', reader)
      reader.readAsDataURL(files[0]);
      let imgFile = null;
      reader.onload = e => {
        imgFile = e.target.result;
        // console.log(imgFile);
        this.imgBase64 = imgFile; // base64
        this.getCanvas(this.imgBase64);
        // let arr = imgFile.split(',') // 把头跟图片内容切割
        // console.log(arr)
      };
    }
  }
};
</script>

<style scoped></style>
