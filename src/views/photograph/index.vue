<style scoped>
.photograph_content {
}
/*canvas */
.photograph_canvas_content {
}
#photographCanvas {
  background-color: #fff;
}
.photograph_noCanvas_content {
  width: 100%;
  height: 200px;
  line-height: 200px;
  text-align: center;
  background-color: #fff;
}

/*按钮*/
.photograph_button_photograph {
  position: fixed;
  top: 50%;
  left: 0;
  margin-top: -150px;
}
.photograph_button_photograph div {
  width: 100px;
}

/*文件按钮*/
.photograph_fileButton input[type="file"] {
  position: relative;
  left: 0;
  top: 40px;
  width: 100%;
  /*line-height: 60px;*/
  opacity: 0;
  cursor: pointer;
  /*background-color: red;*/
}
</style>
<template>
  <div class="photograph_content">
    <div class="photograph_canvas_content">
      <div v-if="!this.canvas" class="photograph_noCanvas_content">
        请先点击拍照按钮
      </div>
      <!--canvas 必须定义id-->
      <canvas id="photographCanvas" :width="screenWidth" :height="screenHeight"
        >当前浏览器不支持canvas</canvas
      >
    </div>

    <div class="photograph_button_photograph">
      <div class="photograph_fileButton">
        <input
          @change="getFile"
          type="file"
          accept="image/*"
          capture="camera"
        />
        <cube-button>拍照</cube-button>
      </div>

      <div style="z-index: 999; margin: 5px 0;">
        <cube-button @click="canvasRemove">重新签名</cube-button>
      </div>
      <div style="z-index: 999">
        <cube-button @click="canvasBuildImg" style="background-color: green"
          >保存签名照</cube-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
export default {
  name: "photograph",
  data() {
    return {
      canvas: null,
      drawWidth: 2, //笔触宽度
      color: "#fff", //画笔颜色
      doDrawing: false, // 绘制状态
      screenWidth: 300, // 屏幕宽
      screenHeight: 500, // 屏幕高
      files: [],
      canvasBuildImgBase64: null, // canvas保存图片
      uploadingImgBase64: null // 上传图片
    };
  },
  mounted() {
    console.log(document.body.clientWidth);
    console.log(document.body.clientHeight);
    this.screenWidth = document.body.clientWidth;
    this.screenHeight = document.body.clientHeight;
    // this.initCanvas();
  },
  watch: {
    screenWidth(val) {
      this.screenWidth = val;
    },
    screenHeight(val) {
      this.screenHeight = val;
    }
  },
  methods: {
    getFile(e) {
      if (this.canvas) {
        this.canvas.clear(); // canvas全部清空
      }
      // console.log(e.target.files);
      let files = e.target.files;
      this.files = files;
      let reader = new FileReader(); //本地预览
      reader.readAsDataURL(files[0]);
      let imgFile = null;
      reader.onload = e => {
        imgFile = e.target.result;
        this.uploadingImgBase64 = imgFile; // base64
        this.initCanvas(this.uploadingImgBase64);
        // console.log(this.uploadingImgBase64);
        // console.log(this.files);
      };
    },
    // 初始化canvas
    initCanvas(uploadingImgBase64) {
      if (!this.canvas) {
        this.canvas = new fabric.Canvas("photographCanvas", {
          isDrawingMode: true, // 可以自由绘制
          skipTargetFind: true, // 整个画板元素不能被选中
          selectable: false, // 控件不能被选择，不会被操作
          selection: false, // 是否画板显示选中
          freeDrawingBrush: {
            color: this.color, // 设置自由绘画笔的颜色
            width: this.drawWidth // 自由绘笔触宽度
          }
        });
      }
      // 读取图片地址，设置画布背景
      fabric.Image.fromURL(uploadingImgBase64, img => {
        img.set({
          // 通过scale来设置图片大小，这里设置和画布一样大
          scaleX: this.canvas.width / img.width,
          scaleY: this.canvas.height / img.height
        });
        // 设置背景
        this.canvas.setBackgroundImage(
          img,
          this.canvas.renderAll.bind(this.canvas)
        );
        this.canvas.renderAll();
      });
    },
    // 清空签名
    canvasRemove() {
      if (!this.canvas) {
        const toast = this.$createToast({
          txt: "请您先拍照",
          type: "error"
        });
        toast.show();
        return false;
      }
      // this.canvas.clear(); // canvas全部清空
      let json = this.canvas.toJSON();
      this.canvas.clear();
      console.log("重新签名", json);
      if ("objects" in json) {
        json.objects = [];
      }
      this.canvas.loadFromJSON(json, this.canvas.renderAll.bind(this.canvas));
    },
    // 将画布导出成图片
    canvasBuildImg() {
      if (!this.canvas) {
        const toast = this.$createToast({
          txt: "请您先拍照",
          type: "error"
        });
        toast.show();
        return false;
      }
      console.log("保存签名照");
      // const dataURL = this.canvas.toDataURL({
      //   format: 'jpeg', // jpeg或png
      //   quality: 0.8 // 图片质量，仅jpeg时可用
      //   // 截取指定位置和大小
      //   //left: 100,
      //   //top: 100,
      //   //width: 200,
      //   //height: 200
      // });
      // console.log(this.canvas.toDataURL());
      let toastBuild = this.$createToast({
        txt: "正在生成签名照...",
        mask: true,
        time: 1800,
        onTimeout: () => {
          this.canvasBuildImgBase64 = this.canvas.toDataURL();
          sessionStorage.setItem(
            "canvasBuildImgBase64",
            this.canvasBuildImgBase64
          );
          this.$createToast({
            txt: "生成签名照成功",
            type: "correct",
            time: 1300,
            onTimeout: () => {
              this.$router.push({
                path: "/"
              });
            }
          }).show();
        }
      });
      toastBuild.show();
    }
  }
};
</script>
