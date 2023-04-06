import { getDeviceInfo } from "@zos/device";
import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import { push } from "@zos/router";
import { ZeppRE } from "../libs/render_engine";

const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = getDeviceInfo();

const logger = log.getLogger("index.page");

Page({
	onCreate(e) {
		logger.log("app on create invoke");
	},
	onInit() {
		logger.log("page on init invoke");
	},
	onShow() {
		logger.log("page on show invoke");
	},
	build() {
		console.log("Device w&h : " + DEVICE_WIDTH + "x" + DEVICE_HEIGHT);
		const scene = new ZeppRE();
		scene.createScene(); // 创建场景 scene
		scene.createCamera({
			fov: 60,
			aspectRatio: 1,
			nearPlane: 1,
			farPlane: 10,
		});
		const cube = new ZeppRE();
		cube.createModel({
			model: "CUBE",
		}); // 创建一个立方体模型 cube
		scene.add(cube);
		const cube1 = new ZeppRE();
		cube1.createModel({
			model: "CUBE",
		}); // 创建一个立方体模型 cube
		scene.add(cube1);
		// DEBUG 列出场景中的所有模型
		scene.models.forEach((model) => {
			console.log("Models in scene : " + model.name);
		});
		scene.render();
	},
	onHide() {
		logger.log("page on hide invoke");
	},
	onDestroy() {
		logger.log("page on destroy invoke");
	},
});
