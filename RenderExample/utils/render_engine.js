/**
 * render_engine.js
 * @description A 3D rendering engine running on ZeppOS 一个适用于ZeppOS的3D渲染引擎
 * @version 1.0.0
 * @date 2023/03/29
 * @author XiaomaiTX
 * @license MIT
 * https://github.com/XiaomaiTX/zeppos-render-engine
 *
 * */

const deviceInfo = hmSetting.getDeviceInfo();
const { width, height } = deviceInfo;
const ExtraHeight = (height - width) / 2;

renderList = [
	{
		sceneID: "scene1",
		models: [
			{ type: CUBE, geometry: { x: 1, y: 1, z: 1 } },
			{ type: CUBE, geometry: { x: 3, y: 3, z: 3 } },
		],
	},
]; // TODO Test data

class ZeppRE {
	createScene() {
		const canvas = createWidget(widget.CANVAS, {
			x: 0,
			y: 0,
			w: width,
			y: height,
		});
	}
	static add(modelObj) {
		renderList.push({ type: modelObj.type, geometry: modelObj.geometry }); // 将模型加入渲染列表
	}

	createCamera(param) {}
	createModel(type, createParam) {
		/**
		 * @param {string} type The type of the object to be created. 要创建的对象的类型
		 * @param {object} createParam Parameters of the object to be created. 要创建的对象的参数
		 * */
	}
	static render(sceneID) {
		for (i = 0; i < renderList.length; i++) {
			// 循环渲染renderList里的所有模型
			Renderer.render[renderList[sceneID].models[i].type](geometry);
		}
	}
	static add() {}
	Models = {
		CUBE,
	};
	Material = {
		BASIC,
	};
}
class Vector {}
class Renderer {
	render = {
		CUBE: function (geometry) {
			return 0;
		},
	};
}
const Matrices = {
	PANNING: function () {},
};
