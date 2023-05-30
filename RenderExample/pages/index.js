import { getDeviceInfo } from "@zos/device";
import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import { GestureListener } from "../libs/advanced_gesture";
import { ZeppRE } from "../libs/render_engine";

const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = getDeviceInfo();

import { createWidget, widget, align, prop, event, text_style } from "@zos/ui";
import { onGesture, offGesture, GESTURE_UP } from "@zos/interaction";
import { push } from "@zos/router";

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
		onGesture({
			callback: (event) => {
				return true;
			},
		});

		console.log("Device w&h : " + DEVICE_WIDTH + "x" + DEVICE_HEIGHT);

		const strokeRect = createWidget(widget.STROKE_RECT, {
			x: 0,
			y: 0,
			w: DEVICE_WIDTH,
			h: DEVICE_HEIGHT,
			radius: 0,
			color: 0x000000,
		});
		const debug_text = createWidget(widget.TEXT, {
			x: 0,
			y: 0,
			w: px(480),
			h: 100,
			color: 0xffffff,
			text_size: 26,
			align_h: align.CENTER_H,
			align_v: align.CENTER_V,
			text_style: text_style.NONE,
			text: "Debug",
		});
		createWidget(widget.BUTTON, {
			x: 100,
			y: 400,
			w: 50,
			h: 50,
			radius: 12,
			normal_color: 0xfc6950,
			press_color: 0xfeb4a8,
			text: "Reset",
			click_func: (button_widget) => {
				scene.rotation[0] = 0;
				scene.rotation[1] = 0;
				scene.rotation[2] = 0;
				scene.fov = 60;
				scene.render();
				debug_text.setProperty(prop.MORE, {
					text: "Debug",
				});
			},
		});
		createWidget(widget.BUTTON, {
			x: 160,
			y: 400,
			w: 50,
			h: 50,
			radius: 12,
			normal_color: 0xfc6950,
			press_color: 0xfeb4a8,
			text: "-",
			click_func: (button_widget) => {
				switch (true) {
					case scene.fov < 20:
						scene.fov = 20;
						break;

					case scene.fov > 350:
						scene.fov = 350;
						break;

					default:
						scene.fov += 5;
						break;
				} //*/
				debug_text.setProperty(prop.MORE, {
					text:
						"rot " +
						parseInt(scene.rotation[0]) +
						" " +
						parseInt(scene.rotation[1]) +
						" " +
						parseInt(scene.rotation[2]) +
						" " +
						"\n" +
						"pos " +
						parseInt(scene.position[0]) +
						" " +
						parseInt(scene.position[1]) +
						" " +
						parseInt(scene.position[2]) +
						" " +
						"\n" +
						"fov " +
						scene.fov,
				});

				scene.render();
			},
		});
		createWidget(widget.BUTTON, {
			x: 220,
			y: 400,
			w: 50,
			h: 50,
			radius: 12,
			normal_color: 0xfc6950,
			press_color: 0xfeb4a8,
			text: "+",
			click_func: () => {
				switch (true) {
					case scene.fov < 20:
						scene.fov = 20;
						break;

					case scene.fov > 350:
						scene.fov = 350;
						break;

					default:
						scene.fov -= 5;
						break;
				} //*/
				debug_text.setProperty(prop.MORE, {
					text:
						"rot " +
						parseInt(scene.rotation[0]) +
						" " +
						parseInt(scene.rotation[1]) +
						" " +
						parseInt(scene.rotation[2]) +
						" " +
						"\n" +
						"pos " +
						parseInt(scene.position[0]) +
						" " +
						parseInt(scene.position[1]) +
						" " +
						parseInt(scene.position[2]) +
						" " +
						"\n" +
						"fov " +
						scene.fov,
				});

				scene.render();
			},
		});
		const scene = new ZeppRE();
		scene.createScene(); // 创建场景 scene
		scene.createCamera({
			position: [0, 0, 0],
			rotation: [0, 0, 0],
			fov: 60,
			aspectRatio: 1,
			nearPlane: 1,
			farPlane: 10,
		});
		console.log(scene.rotation);
		const cube = new ZeppRE();
		cube.createModel({
			model: "CUBE",
			geometry: {
				x: 0,
				y: 0,
				z: 0,
				width: 20,
				height: 20,
				depth: 20,
				direction: [0, 0, 0],
				color: 0xffffff,
			},
		});

		const polyline = new ZeppRE();
		polyline.createModel({
			model: "POLYLINE",
			geometry: {
				points: [
					[0, 0, 0],

					[10, 10, 10],

					[18, 18, 18],
					[19, 19, 19],
					[20, 20, 20],
					[-20, 30, 40],
				],
			},
		});
		const plane = new ZeppRE();
		plane.createModel({
			model: "PLANE",
			geometry: {
				position: [10, 10, 10],
				direction: [20, -20, 20],
				width: 20,
				height: 20,
			},
		});
		const LineX = new ZeppRE();
		LineX.createModel({
			model: "POLYLINE",
			geometry: {
				points: [
					[0, 0, 0],
					[100, 0, 0],
				],
				color: 0xff0000,
			},
		});
		const LineY = new ZeppRE();
		LineY.createModel({
			model: "POLYLINE",
			geometry: {
				points: [
					[0, 0, 0],
					[0, 100, 0],
				],
				color: 0x00ff00,
			},
		});
		const LineZ = new ZeppRE();
		LineZ.createModel({
			model: "POLYLINE",
			geometry: {
				points: [
					[0, 0, 0],
					[0, 0, 100],
				],
				color: 0x0000ff,
			},
		});
		scene.add(cube);

		//scene.add(polyline);
		//scene.add(plane);

		//scene.add(LineX);
		//scene.add(LineY);
		//scene.add(LineZ);

		scene.render();
		var rotationStatus = null;

		new GestureListener().add({
			objects: [strokeRect],

			/*
			conf: {
				LONG_PRESS: {
					delay: 5000,
				},
			}, //*/
			CLICK: (result) => {
				console.log("event CLICK");
			},
			LONG_PRESS: (result) => {
				console.log("event LONG_PRESS");
			},
			LONG_DISTANCE_MOVE: (result) => {
				console.log("event LONG_DISTANCE_MOVE");
			},
			SWIPE_LEFT: (result) => {},
			SWIPE_RIGHT: (result) => {},
			SWIPE_UP: (result) => {
				console.log("event SWIPE_UP");
			},
			SWIPE_DOWN: (result) => {
				console.log("event SWIPE_DOWN");
			},
			MOVE: (result) => {
				// console.log("event MOVE");
				deltaX = result.startPos.x - result.x;
				deltaY = result.startPos.y - result.y;
				if (scene.rotation[0] >= 360) {
					scene.rotation[0] -= 360;
				}
				if (scene.rotation[1] >= 360) {
					scene.rotation[1] -= 360;
				}

				if (scene.rotation[2] >= 360) {
					scene.rotation[2] -= 360;
				}
				if (scene.rotation[0] <= -360) {
					scene.rotation[0] += 360;
				}
				if (scene.rotation[1] <= -360) {
					scene.rotation[1] += 360;
				}

				if (scene.rotation[2] <= -360) {
					scene.rotation[2] += 360;
				}

				const ranges = [
					{
						//前面
						min: -360,
						max: -315,
						code() {
							scene.rotation[0] = scene.rotation[0] + deltaY / 10;
							console.log("前面 -135 -45");
						},
					},
					{
						//右面
						min: -315,
						max: -225,
						code() {
							scene.rotation[0] = scene.rotation[0] + deltaY / 10;
							console.log("右面 -135 -45");
						},
					},
					{
						//后面
						min: -225,
						max: -135,
						code() {
							scene.rotation[0] = scene.rotation[0] - deltaY / 10;
							console.log("后面 -135 -45");
						},
					},
					{
						//左面
						min: -135,
						max: -45,
						code() {
							scene.rotation[2] = scene.rotation[2] + deltaY / 10;
							console.log("左面 -135 -45");
						},
					},
					{
						//前面
						min: -45,
						max: 45,
						code() {
							scene.rotation[0] = scene.rotation[0] + deltaY / 10;
							console.log("前面 -45 45");
						},
					},
					{
						//右面
						min: 45,
						max: 135,
						code() {
							scene.rotation[0] = scene.rotation[0] + deltaY / 10;
							console.log("右面 45 135");
						},
					},
					{
						//后面
						min: 135,
						max: 225,
						code() {
							scene.rotation[0] = scene.rotation[0] - deltaY / 10;
							console.log("后面 135 225");
						},
					},
					{
						//左面
						min: 225,
						max: 315,
						code() {
							scene.rotation[2] = scene.rotation[2] + deltaY / 10;
							console.log("左面 225 315");
						},
					},
					{
						//前面
						min: 315,
						max: 360,
						code() {
							scene.rotation[0] = scene.rotation[0] + deltaY / 10;
							console.log("前面 315 360");
						},
					},
				];

				for (let range of ranges) {
					if (
						scene.rotation[1] >= range.min &&
						scene.rotation[1] < range.max
					) {
						range.code(); // 执行对应的代码
						break;
					}
				} //*/
				//scene.rotation[0] = scene.rotation[0] + deltaY / 10;
				scene.rotation[1] = scene.rotation[1] + deltaX / 10;
				//scene.rotation[2] = scene.rotation[2] + deltaY / 10;

				scene.render();
				debug_text.setProperty(prop.MORE, {
					text:
						"rot " +
						parseInt(scene.rotation[0]) +
						" " +
						parseInt(scene.rotation[1]) +
						" " +
						parseInt(scene.rotation[2]) +
						" " +
						"\n" +
						"pos " +
						parseInt(scene.position[0]) +
						" " +
						parseInt(scene.position[1]) +
						" " +
						parseInt(scene.position[2]) +
						" " +
						"\n" +
						"fov " +
						scene.fov,
				});
			},
			END: (result) => {},
		});
	},
	onHide() {
		logger.log("page on hide invoke");
	},
	onDestroy() {
		logger.log("page on destroy invoke");
	},
});
