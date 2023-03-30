import { Fx } from "./fx";
// https://github.com/XiaomaiTX/zeppos-fx
import { SmoothTimer, stopSmoothTimer } from "./smoothTimer";

export function layerOutCheck() {
  console.log("endLayer : "+getApp()._options.globalData.endLayer)
  new SmoothTimer(
    0,
    1000,
    function (option) {
      if (getApp()._options.globalData.endLayer + hmApp.getLayerY() < 480) {
        hmUI.setLayerScrolling(false);
        console.log("out layer");
        console.log(
          "set layer : " + (px(480) - getApp()._options.globalData.endLayer)
        );

        new Fx({
          begin: 0, // Initial value of function. 初始函数值
          end: 1, // Target value of function. 目标函数值
          fps: 60, // FPS. 帧率
          time: 0.1, // Total during time (s). 总时长(秒)
          style: Fx.Styles.EASE_OUT_EXPO, // Types of animation presets used, seeing @Fx.Style. 预设类型 见下面的Fx.Style
          onStop() {
            hmUI.setLayerScrolling(true);
          }, // Callback function at the end of the animation. 动画结束后的回调函数

          // Callback function for each frame, the parameter is the current function value, the value range is [begin, end]
          // 每一帧的回调函数，参数为当前函数值，取值范围为[begin, end]
          func: (result) => {
            //px(480) - getApp()._options.globalData.endLayer
            hmApp.setLayerY(
              hmApp.getLayerY() +
                (hmApp.getLayerY() -
                  (px(480) - getApp()._options.globalData.endLayer)) *
                  -result
            );
            //480 - getApp()._options.globalData.endLayer
          },
        }); //*/
      }
    },
    {},
    1
  );
}
