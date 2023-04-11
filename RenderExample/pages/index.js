import { getDeviceInfo } from "@zos/device";
import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import { push } from "@zos/router";
import { ZeppRE } from "../libs/render_engine";
import { ZeppTimer } from "../libs/zeppos_timer";

const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = getDeviceInfo();

import { createWidget, widget, prop } from "@zos/ui";
import { Time } from "@zos/sensor";

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
    /*
		const strokeRect = createWidget(widget.STROKE_RECT, {
			x: 0,
			y: 0,
			w: DEVICE_WIDTH,
			h: DEVICE_HEIGHT,
			radius: DEVICE_WIDTH / 2,
			line_width: 2,
			color: 0xffffff,
		});//*/
    console.log("Device w&h : " + DEVICE_WIDTH + "x" + DEVICE_HEIGHT);
    const scene = new ZeppRE();
    scene.createScene(); // 创建场景 scene
    scene.createCamera({
      position: [0, 0, 0],
      rotation: [45, 45, 45],
      fov: 60,
      aspectRatio: 1,
      nearPlane: 1,
      farPlane: 10,
    });
    console.log(scene.rotation)
    const cube = new ZeppRE();
    cube.createModel({
      model: "CUBE",
      geometry: {
        x: 0,
        y: 0,
        z: 0,
        width: 50,
        height: 50,
        depth: 50,
        direction: [0, 0, 0],
      },
  
    }); 
    scene.add(cube);
    // DEBUG 列出场景中的所有模型
    scene.render();
    
		const timer = new ZeppTimer(() => {
			console.log(
				"scene.rotation[1] " +
					scene.rotation[1]
			);
			scene.rotation[1] =
				scene.rotation[1] + 10;
			console.log(
				"scene.rotation[1] " +
					scene.rotation[1]
			);

			scene.render();
		}, 1000 / 60);
		timer.start();//*/
    /*
		const timer = new ZeppTimer(() => {
			console.log(
				"scene.models[0].geometry.direction[1] " +
					scene.models[0].geometry.direction[1]
			);
			scene.models[0].geometry.direction[1] =
				scene.models[0].geometry.direction[1] + 10;
			console.log(
				"scene.models[0].geometry.direction[1] " +
					scene.models[0].geometry.direction[1]
			);

			scene.render();
		}, 1000 / 60);
		timer.start();//*/
  },
  onHide() {
    logger.log("page on hide invoke");
  },
  onDestroy() {
    logger.log("page on destroy invoke");
  },
});
