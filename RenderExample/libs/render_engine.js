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

/*
function example() {
	const scene = new ZeppRE.createScene(); // 创建场景 scene
	const camera = new ZeppRE.createCamera(); // 创建摄像机 camera

	const cube = new ZeppRE.createModel(ZeppRE.Model.CUBE, {
		material: ZeppRE.Material.BASIC,
	}); // 创建一个立方体模型 cube
	scene.add(cube); // 将模型 cube 加入渲染列表
	scene.render(); // 渲染场景 scene
}//*/
import { createWidget, widget } from "@zos/ui";
import { getDeviceInfo } from "@zos/device";
const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = getDeviceInfo();

export class ZeppRE {
	test() {
		console.log("ZeppRE class test()");
	}
	createScene() {
		this.type = "scene";
		this.models = [];
		console.log("create new scene");
	}
	add(modelObj) {
		/**
		 * @param {object} modelObj Field of view. 视野角度
		 * */

		// 校验this.type是否为scene
		if (this.type !== "scene") {
			console.error("Cannot add model to non-scene object.");
			return;
		}

		// 校验modelObj.type是否为model
		if (modelObj.type !== "model") {
			console.error(
				"Invalid model type. Only models can be added to scenes."
			);
			return;
		}
		// 如果this.models数组未定义，则创建一个新数组
		if (!this.models) {
			this.models = [];
		}
		this.models.push(modelObj); // 将模型加入渲染列表
		console.log("add model into scene");
	}

	createCamera(param) {
		/**
		 * @param {number} param.fov Field of view. 视野角度
		 * @param {number} param.aspectRatio Aspect ratio. 长宽比
		 * @param {number} param.nearPlane Near clipping plane. 近截面
		 * @param {number} param.farPlane Far clipping plane. 远截面
		 * */
		this.fov = param.fov;
		this.aspectRatio = param.aspectRatio;
		this.nearPlane = param.nearPlane;
		this.farPlane = param.farPlane;
		console.log("create new camera in scene");
	}
	createModel(param) {
		/**
		 * @param {string} type The type of the object to be created. 要创建的对象的类型
		 * @param {object} createParam Parameters of the object to be created. 要创建的对象的参数
		 * */
		const modelDef = Model[param.model]; // 获取Model中的指定模型对象
		if (!modelDef) {
			// 校验
			console.log(`Unknown model type: ${param.model}`);
			return;
		}
		this.type = "model";
		this.name = Model[param.model].name;
		this.geometry = Model[param.model].geometry;
		console.log("create new model");
	}
	render(material) {
		// 校验this.type是否为scene
		if (this.type !== "scene") {
			console.error("Cannot add model to non-scene object.");
			return;
		}
		cameraParam = {
			fov: this.fov,
			aspectRatio: this.aspectRatio,
			nearPlane: this.nearPlane,
			farPlane: this.farPlane,
		};
		for (i = 0; i < this.models.length; i++) {
			// TODO 循环渲染 this.models 里的所有模型
			console.log("render " + this.models[i].name); // DEBUG
			Model[this.models[i].name].renderVertex(
				this.models[i].geometry,
				cameraParam
			);
		}
	}
}
const Material = {
	BASIC,
	Vertex,
};
function xyz2xy(point, cameraParam) {
	// 将摄像机坐标系的原点设置为摄像机的位置
	const cameraPosition = [0, 0, 0];
	const x = point[0] - cameraPosition[0];
	const y = point[1] - cameraPosition[1];
	const z = point[2] - cameraPosition[2];

	// 将三维点坐标投影到二维平面上
	const fovRadians = ((cameraParam.fov / 2) * Math.PI) / 180; // 视野角度转为弧度
	const aspectRatio = cameraParam.aspectRatio;
	const nearPlane = cameraParam.nearPlane;
	const farPlane = cameraParam.farPlane;
	const tanFov = Math.tan(fovRadians / 2);

	const projectedX = x / (tanFov * nearPlane * aspectRatio);
	const projectedY = y / (tanFov * nearPlane);
	const projectedZ = -z;

	const normalizedX = projectedX / nearPlane;
	const normalizedY = projectedY / nearPlane;

	const projectedPoint = {
		x: normalizedX,
		y: normalizedY,
		z: projectedZ,
	};
	return projectedPoint;
}
const Model = {
	CUBE: {
		name: "CUBE",
		geometry: {
			x: 0,
			y: 0,
			z: 0,
			width: 2,
			height: 2,
			depth: 2,
			direction: [0, 0, 0],
		},
		renderVertex: function (params, cameraParam) {
			/**
			 * @example const vertices = this.utils.computeCubeVertices(params);
			 * */
			const canvas = createWidget(widget.CANVAS, {
				x: 0,
				y: 0,
				w: DEVICE_WIDTH,
				h: DEVICE_HEIGHT,
			});
			canvas.setPaint({
				color: 0xffffff,
				line_width: 3,
			});

			// DEBUG render a point
			const point = [0, 0, 0];
			const x_end = [20, 0, 0];
			const y_end = [0, 20, 0];
			const z_end = [-10, -10, 20];

			const point_2d = xyz2xy(point, cameraParam);
			const x_2d = xyz2xy(x_end, cameraParam);
			const y_2d = xyz2xy(y_end, cameraParam);
			const z_2d = xyz2xy(z_end, cameraParam);

			canvas.drawPixel({
				x: DEVICE_WIDTH / 2 + point_2d.x,
				y: DEVICE_HEIGHT / 2 + -point_2d.y,
				color: 0xffffff,
			});

			canvas.drawLine({
				x1: DEVICE_WIDTH / 2 + point_2d.x,
				y1: DEVICE_HEIGHT / 2 + -point_2d.y,
				x2: DEVICE_WIDTH / 2 + x_2d.x,
				y2: DEVICE_HEIGHT / 2 + -x_2d.y,
				color: 0xff0000,
			});
			canvas.drawLine({
				x1: DEVICE_WIDTH / 2 + point_2d.x,
				y1: DEVICE_HEIGHT / 2 + -point_2d.y,
				x2: DEVICE_WIDTH / 2 + y_2d.x,
				y2: DEVICE_HEIGHT / 2 + -y_2d.y,
				color: 0x00ff00,
			});
			canvas.drawLine({
				x1: DEVICE_WIDTH / 2 + point_2d.x,
				y1: DEVICE_HEIGHT / 2 + -point_2d.y,
				x2: DEVICE_WIDTH / 2 + z_2d.x,
				y2: DEVICE_HEIGHT / 2 + -z_2d.y,
				color: 0x0000ff,
			});
			/* TODO renderVertex
			const vertices = this.utils.computeCubeVertices(params);
			console.log("vertices : " + vertices.length);
			// 对于每个顶点，通过透视投影的方法映射到二维平面上
			for (let i = 0; i < vertices.length; i++) {
				console.log(
					vertices[i].x + "," + vertices[i].y + "," + vertices[i].z
				);
			}//*/
		},
		renderMesh: function (params) {},
		utils: {
			computeCubeVertices: function (properties) {
				if (!properties || typeof properties !== "object") {
					console.log("Invalid input: properties must be an object.");
					return;
				}

				const { x, y, z, width, height, depth, direction } = properties;

				if (
					![x, y, z, width, height, depth].every(
						(n) => typeof n === "number"
					)
				) {
					console.log(
						"Invalid input: x, y, z, width, height, and depth must be numbers."
					);
					return;
				}

				const halfWidth = width / 2;
				const halfHeight = height / 2;
				const halfDepth = depth / 2;

				const vertices = [
					{ x: x - halfWidth, y: y + halfHeight, z: z + halfDepth },
					{ x: x + halfWidth, y: y + halfHeight, z: z + halfDepth },
					{ x: x + halfWidth, y: y - halfHeight, z: z + halfDepth },
					{ x: x - halfWidth, y: y - halfHeight, z: z + halfDepth },
					{ x: x + halfWidth, y: y + halfHeight, z: z - halfDepth },
					{ x: x - halfWidth, y: y + halfHeight, z: z - halfDepth },
					{ x: x - halfWidth, y: y - halfHeight, z: z - halfDepth },
					{ x: x + halfWidth, y: y - halfHeight, z: z - halfDepth },
				];

				const [xRot, yRot, zRot] = [
					direction[0] || 0,
					direction[1] || 0,
					direction[2] || 0,
				].map((angle) => (angle * Math.PI) / 180);

				for (let i = 0; i < vertices.length; i++) {
					const vertex = vertices[i];
					const { x, y, z } = vertex;
					const sinX = Math.sin(xRot);
					const cosX = Math.cos(xRot);
					const sinY = Math.sin(yRot);
					const cosY = Math.cos(yRot);
					const sinZ = Math.sin(zRot);
					const cosZ = Math.cos(zRot);

					// Apply x-axis rotation
					const y1 = y * cosX - z * sinX;
					const z1 = y * sinX + z * cosX;

					// Apply y-axis rotation
					const x2 = x * cosY + z1 * sinY;
					const z2 = -x * sinY + z1 * cosY;

					// Apply z-axis rotation
					const x3 = x2 * cosZ - y1 * sinZ;
					const y3 = x2 * sinZ + y1 * cosZ;

					vertex.x = x3 + properties.x;
					vertex.y = y3 + properties.y;
					vertex.z = z2 + properties.z;
				}

				return vertices;
			},
			computeCubeFaces: function (properties) {
				//通过CUBE的属性{ x, y, z, width, height, depth }计算出立方体的顶点和面

				if (!properties || typeof properties !== "object") {
					console.log("Invalid input: properties must be an object.");
				}
				const { x, y, z, width, height, depth, direction } = properties;
				if (
					// 判断 x, y, z, width, height, depth 是否为数字类型
					typeof x !== "number" ||
					typeof y !== "number" ||
					typeof z !== "number" ||
					typeof width !== "number" ||
					typeof height !== "number" ||
					typeof depth !== "number" ||
					// 判断 direction 是否为数组类型，数组长度是否为3，以及数组每个元素是否为数字类型
					!Array.isArray(direction) ||
					direction.length !== 3 ||
					!direction.every((angle) => typeof angle === "number")
				) {
					console.log(
						"Invalid input: x, y, z, width, height, depth, and direction must be numbers."
					); //*/
				}

				const halfWidth = width / 2;
				const halfHeight = height / 2;
				const halfDepth = depth / 2;

				// 计算立方体每个面的顶点坐标
				const faces = [
					// 前面
					{
						x: x - halfWidth,
						y: y + halfHeight,
						z: z + halfDepth,
					},
					{
						x: x + halfWidth,
						y: y + halfHeight,
						z: z + halfDepth,
					},
					{
						x: x + halfWidth,
						y: y - halfHeight,
						z: z + halfDepth,
					},
					{
						x: x - halfWidth,
						y: y - halfHeight,
						z: z + halfDepth,
					},

					// 后面
					{
						x: x + halfWidth,
						y: y + halfHeight,
						z: z - halfDepth,
					},
					{
						x: x - halfWidth,
						y: y + halfHeight,
						z: z - halfDepth,
					},
					{
						x: x - halfWidth,
						y: y - halfHeight,
						z: z - halfDepth,
					},
					{
						x: x + halfWidth,
						y: y - halfHeight,
						z: z - halfDepth,
					},

					// 左面
					{
						x: x - halfWidth,
						y: y + halfHeight,
						z: z - halfDepth,
					},
					{
						x: x - halfWidth,
						y: y + halfHeight,
						z: z + halfDepth,
					},
					{
						x: x - halfWidth,
						y: y - halfHeight,
						z: z + halfDepth,
					},
					{
						x: x - halfWidth,
						y: y - halfHeight,
						z: z - halfDepth,
					},

					// 右面
					{
						x: x + halfWidth,
						y: y + halfHeight,
						z: z + halfDepth,
					},
					{
						x: x + halfWidth,
						y: y + halfHeight,
						z: z - halfDepth,
					},
					{
						x: x + halfWidth,
						y: y - halfHeight,
						z: z - halfDepth,
					},
					{
						x: x + halfWidth,
						y: y - halfHeight,
						z: z + halfDepth,
					},

					// 上面
					{
						x: x - halfWidth,
						y: y + halfHeight,
						z: z - halfDepth,
					},
					{
						x: x + halfWidth,
						y: y + halfHeight,
						z: z - halfDepth,
					},
					{
						x: x + halfWidth,
						y: y + halfHeight,
						z: z + halfDepth,
					},
					{
						x: x - halfWidth,
						y: y + halfHeight,
						z: z + halfDepth,
					},
				];
				// 根据direction旋转顶点坐标
				const [xRot, yRot, zRot] = properties.direction.map(
					(angle) => (angle * Math.PI) / 180
				);
				const cosX = Math.cos(xRot);
				const sinX = Math.sin(xRot);
				const cosY = Math.cos(yRot);
				const sinY = Math.sin(yRot);
				const cosZ = Math.cos(zRot);
				const sinZ = Math.sin(zRot);
				const cosTheta = cosY * cosX;
				const sinTheta = cosY * sinX;
				const cosPhi = sinY * cosZ + cosY * sinX * sinZ;
				const sinPhi = sinY * sinZ - cosY * sinX * cosZ;
				for (let i = 0; i < faces.length; i++) {
					const vertex = faces[i];
					let [x, y, z] = [vertex.x, vertex.y, vertex.z];
					const xNew =
						cosZ * cosY * x +
						(cosZ * sinY * sinX - sinZ * cosX) * y +
						(cosZ * sinY * cosX + sinZ * sinX) * z;
					const yNew =
						sinZ * cosY * x +
						(sinZ * sinY * sinX + cosZ * cosX) * y +
						(sinZ * sinY * cosX - cosZ * sinX) * z;
					const zNew = -sinY * x + cosY * sinX * y + cosY * cosX * z;
					vertex.x = xNew;
					vertex.y = yNew;
					vertex.z = zNew;
				}
				return faces;
			},
			computeCubeTriangles: function (vertices) {},
			/*
			computeFaceIndices: function (vertices, normals) {
				// 根据顶点和法向量，计算每个面的顶点索引
				const indices = [];
				for (let i = 0; i < vertices.length; i += 4) {
					const faceNormal = normals[Math.floor(i / 4)];
					
					const dotProduct = Vector3.dot(faceNormal, {
						x: 0,
						y: 1,
						z: 0,
					});
					let referenceVector;
					if (dotProduct < -0.9 || dotProduct > 0.9) {
						referenceVector = { x: 0, y: 0, z: 1 };
					} else {
						referenceVector = { x: 0, y: 1, z: 0 };
					}
					
					const tangent = Vector3.cross(
						referenceVector,
						faceNormal
					).normalize();
					const bitangent = Vector3.cross(
						faceNormal,
						tangent
					).normalize();
					indices.push(i, i + 1, i + 2);
					indices.push(i, i + 2, i + 3);
				}
				return indices;
			},
			computeFaceNormal: function (v1, v2, v3) {
				// 计算一个三角面的法向量
				if (
					typeof v1 !== "object" ||
					typeof v2 !== "object" ||
					typeof v3 !== "object"
				) {
					console.log("All parameters must be objects");
				}
				const vector1 = new Vector(
					v1.x - v2.x,
					v1.y - v2.y,
					v1.z - v2.z
				);
				const vector2 = new Vector(
					v1.x - v3.x,
					v1.y - v3.y,
					v1.z - v3.z
				);
				const normalVector = vector1.cross(vector2).normalize();
				return normalVector;
			},
			computeFaceNormals: function (vertices) {
				// 根据CUBE顶点和法向量，计算每个三角面的法向量
				if (!Array.isArray(vertices) || vertices.length !== 24) {
					console.log(
						"vertices must be an array containing information about 24 vertices"
					);
				}
				const normals = [];
				for (let i = 0; i < vertices.length; i += 4) {
					const v1 = vertices[i];
					const v2 = vertices[i + 1];
					const v3 = vertices[i + 2];
					const faceNormal = computeFaceNormal(v1, v2, v3);
					normals.push(
						faceNormal,
						faceNormal,
						faceNormal,
						faceNormal
					);
				}
				return normals;
			},//*/
		},
	},
};

class Vector {
	// 叉积函数，计算当前向量与参数向量v的叉积，并返回一个新向量
	cross(v) {
		const x = this.y * v.z - this.z * v.y;
		const y = this.z * v.x - this.x * v.z;
		const z = this.x * v.y - this.y * v.x;
		return; //new Vector(x, y, z);
	}

	// 归一化函数，计算当前向量的单位向量，并返回一个新向量
	normalize() {
		// 计算当前向量的模长
		const magnitude = Math.sqrt(
			this.x * this.x + this.y * this.y + this.z * this.z
		);
		// 如果模长为0，返回一个零向量
		if (magnitude === 0) {
			//return new Vector(0, 0, 0);
		}
		// 否则，计算当前向量各分量除以模长的值，得到单位向量
		const x = this.x / magnitude;
		const y = this.y / magnitude;
		const z = this.z / magnitude;
		//return new Vector(x, y, z);
	}
}
class Renderer {
	render() {}
	Models = {
		CUBE: {
			renderVertex: function (params) {
				/**
				 * @example const vertices = this.utils.computeCubeVertices(params);
				 * */
				const vertices = this.utils.computeCubeVertices(params);
				console.log(vertices);
			},
			renderMesh: function (params) {},
			renderFace: function (params) {},
		},
	};
}
