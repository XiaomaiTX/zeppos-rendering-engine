import { gettext } from "i18n";
import { gotoPage, pageInit } from "../utils/newGotoPage";
import {
	SmoothTimer,
	createSmoothTimer,
	stopSmoothTimer,
} from "../utils/smoothTimer";
import { ZeppRE } from "../utils/render_engine";

const deviceInfo = hmSetting.getDeviceInfo();
const { width, height } = deviceInfo;
const ExtraHeight = (height - width) / 2;
hmUI.setStatusBarVisible(false);

console.log("index.js");
console.log(width + "x" + height);
console.log("ExtraHeigh : " + ExtraHeight);

Page({
	build() {
		pageInit({
			state: {
				data: null,
			},
			onStop() {
				const scene = new ZeppRE.createScene(); // 创建场景 scene
				const camera = new ZeppRE.createCamera(); // 创建摄像机 camera

				const cube = new ZeppRE.createModel(ZeppRE.CUBE, {
					material: ZeppRE.Material.BASIC,
				}); // 创建一个立方体模型 cube
				scene.add(cube); // 将模型 cube 加入渲染列表
				scene.render(); // 渲染场景 scene
			},
		});
	},
});
