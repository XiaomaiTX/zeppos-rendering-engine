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
import { createWidget, widget, align, prop, text_style } from "@zos/ui";
import { getDeviceInfo } from "@zos/device";
const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = getDeviceInfo();
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
export class ZeppRE {
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

		if (!this.models) {
			this.models = [];
		} else {
			this.models.push(modelObj); // 将模型加入渲染列表
			console.log("add model into scene");
		}
	}

	createCamera(param) {
		/**
		 * @param {number} param.fov Field of view. 视野角度
		 * @param {number} param.aspectRatio Aspect ratio. 长宽比
		 * @param {number} param.nearPlane Near clipping plane. 近截面
		 * @param {number} param.farPlane Far clipping plane. 远截面
		 * */
		this.position = param.position;
		this.rotation = param.rotation;
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
		if (!param.geometry) {
			// 校验
			this.geometry = Model[param.model].geometry;
		} else {
			this.geometry = param.geometry;
		}
		if (!param.material) {
			// 校验
			this.material = Model[param.model].material;
		} else {
			this.material = param.material;
		}

		console.log("create new model");
	}
	render() {
		const cameraParam = {
			position: this.position,
			rotation: this.rotation,
			fov: this.fov,
			aspectRatio: this.aspectRatio,
			nearPlane: this.nearPlane,
			farPlane: this.farPlane,
		};
		canvas.clear({
			x: 0,
			y: 0,
			w: DEVICE_WIDTH,
			h: DEVICE_HEIGHT,
		});
		canvas.setPaint({
			color: 0xffffff,
			line_width: 3,
		});

		let renderTrianglesSet = new Set();
		for (let i = 0; i < this.models.length; i++) {
			const material = this.models[i].material;
			const modelName = this.models[i].name;
			const geometry = this.models[i].geometry;

			switch (material) {
				case "Point":
					Model[modelName].renderPoint(geometry, cameraParam);
					break;
				case "Edge":
					Model[modelName].renderEdge(geometry, cameraParam);
					break;
				case "Mesh":
					vertices = Model[modelName].utils.computeVertices(
						geometry,
						cameraParam
					);
					triangles =
						Model[modelName].utils.computeTriangles(vertices);
					renderTrianglesMesh(geometry, triangles, cameraParam);
					break;
				case "Face":
					vertices = Model[modelName].utils.computeVertices(
						geometry,
						cameraParam
					);
					triangles =
						Model[modelName].utils.computeTriangles(vertices);
					renderTrianglesSet.add(
						Model[modelName].utils.computeTriangles(geometry)
					);
					renderTrianglesFace(geometry, triangles, cameraParam);

					break;
				default:
					// Handle unsupported material types
					break;
			}
		}
	}
}
function renderTrianglesMesh(geometry, triangles, cameraParam) {
	canvas.setPaint({
		color: geometry.color,
		line_width: geometry.line_width,
	});
	for (let i = 0; i < triangles.length; i++) {
		const triangle_vertex_0 = xyz2xy(triangles[i][0], cameraParam);
		const triangle_vertex_1 = xyz2xy(triangles[i][1], cameraParam);
		const triangle_vertex_2 = xyz2xy(triangles[i][2], cameraParam);
		canvas.drawLine({
			x1: DEVICE_WIDTH / 2 + triangle_vertex_0.x,
			y1: DEVICE_HEIGHT / 2 + -triangle_vertex_0.y,
			x2: DEVICE_WIDTH / 2 + triangle_vertex_1.x,
			y2: DEVICE_HEIGHT / 2 + -triangle_vertex_1.y,
			color: geometry.color,
		});
		canvas.drawLine({
			x1: DEVICE_WIDTH / 2 + triangle_vertex_1.x,
			y1: DEVICE_HEIGHT / 2 + -triangle_vertex_1.y,
			x2: DEVICE_WIDTH / 2 + triangle_vertex_2.x,
			y2: DEVICE_HEIGHT / 2 + -triangle_vertex_2.y,
			color: geometry.color,
		});
		canvas.drawLine({
			x1: DEVICE_WIDTH / 2 + triangle_vertex_2.x,
			y1: DEVICE_HEIGHT / 2 + -triangle_vertex_2.y,
			x2: DEVICE_WIDTH / 2 + triangle_vertex_0.x,
			y2: DEVICE_HEIGHT / 2 + -triangle_vertex_0.y,
			color: geometry.color,
		});
	}
}

function renderTrianglesFace(geometry, triangles, cameraParam) {
	canvas.setPaint({
		color: geometry.color,
		line_width: geometry.line_width,
	});
	for (let i = 0; i < triangles.length; i++) {
		const triangle_vertex_0 = xyz2xy(triangles[i][0], cameraParam);
		const triangle_vertex_1 = xyz2xy(triangles[i][1], cameraParam);
		const triangle_vertex_2 = xyz2xy(triangles[i][2], cameraParam);
		const coordinateArray = [
			{
				x: DEVICE_WIDTH / 2 + triangle_vertex_0.x,
				y: DEVICE_HEIGHT / 2 + -triangle_vertex_0.y,
			},
			{
				x: DEVICE_WIDTH / 2 + triangle_vertex_1.x,
				y: DEVICE_HEIGHT / 2 + -triangle_vertex_1.y,
			},
			{
				x: DEVICE_WIDTH / 2 + triangle_vertex_2.x,
				y: DEVICE_HEIGHT / 2 + -triangle_vertex_2.y,
			},
		];
		canvas.drawPoly({
			data_array: coordinateArray,
			color: geometry.color,
		});
	}
}

function xyz2xy(point, cameraParam) {
	const cameraPosition = cameraParam.position;

	// 将摄像机坐标系的原点设置为摄像机的位置
	const x = point.x - cameraPosition[0];
	const y = point.y - cameraPosition[1];
	const z = point.z - cameraPosition[2];

	// 将三维点坐标投影到二维平面上
	const fovRadians = ((cameraParam.fov / 2) * Math.PI) / 180; // 视野角度转为弧度
	const aspectRatio = cameraParam.aspectRatio;
	const nearPlane = cameraParam.nearPlane;
	const farPlane = cameraParam.farPlane;
	const tanFov = Math.tan(fovRadians / 2);

	const projectedX = (x * nearPlane) / (tanFov * aspectRatio);
	const projectedY = (y * nearPlane) / tanFov;
	//const projectedX = (x * nearPlane) / (tanFov * nearPlane * aspectRatio);
	//const projectedY =  (y * nearPlane) / (tanFov * nearPlane);
	//const projectedZ = -nearPlane;
	const projectedZ = -nearPlane;

	const normalizedX = projectedX / nearPlane;
	const normalizedY = projectedY / nearPlane;
	const normalizedZ = projectedZ / nearPlane;

	const projectedPoint = {
		x: normalizedX,
		y: normalizedY,
		z: normalizedZ,
	};
	return projectedPoint;
}
function rotatePoint(point, cameraParam) {
	// TODO rotatePoint
	/*
  先完成点本身的旋转，再进行相机的旋转，最后在进行投影，这几个方法分别抽象出来作为公用方法
  */
}
function rotateCamera(point, cameraParam) {
	// 将旋转角度转换为弧度
	const [radX, radY, radZ] = cameraParam.rotation.map(
		(r) => (r * Math.PI) / 180
	);

	// 计算相机的旋转矩阵
	const cosX = Math.cos(radX);
	const sinX = Math.sin(radX);
	const cosY = Math.cos(radY);
	const sinY = Math.sin(radY);
	const cosZ = Math.cos(radZ);
	const sinZ = Math.sin(radZ);
	const matrix = [
		cosZ * cosY,
		-sinZ * cosX + cosZ * sinY * sinX,
		sinZ * sinX + cosZ * sinY * cosX,
		sinZ * cosY,
		cosZ * cosX + sinZ * sinY * sinX,
		-cosZ * sinX + sinZ * sinY * cosX,
		-sinY,
		cosY * sinX,
		cosY * cosX,
	];

	// 将顶点转换为相机坐标系
	const { x, y, z } = point;
	const cx = matrix[0] * x + matrix[1] * y + matrix[2] * z;
	const cy = matrix[3] * x + matrix[4] * y + matrix[5] * z;
	const cz = matrix[6] * x + matrix[7] * y + matrix[8] * z;

	// 返回相机坐标系下的坐标
	return { x: cx, y: cy, z: cz };
}

function perspectiveProjection(point, cameraParam) {
	// 将摄像机坐标系的原点设置为摄像机的位置
	const cameraPosition = cameraParam.position;
	const x = point.x - cameraPosition[0];
	const y = point.y - cameraPosition[1];
	const z = point.z - cameraPosition[2];
	// 将三维点坐标投影到二维平面上
	const fovRadians = ((cameraParam.fov / 2) * Math.PI) / 180; // 视野角度转为弧度
	const aspectRatio = cameraParam.aspectRatio;
	const nearPlane = cameraParam.nearPlane;
	const farPlane = cameraParam.farPlane;
	const tanFov = Math.tan(fovRadians / 2);

	let projectedX = x / (tanFov * nearPlane * aspectRatio);
	let projectedY = y / (tanFov * nearPlane);
	let projectedZ =
		(farPlane + nearPlane) / (farPlane - nearPlane) +
		(-2 * farPlane * nearPlane) / (farPlane - nearPlane) / -z;

	// 将顶点旋转到相机坐标系
	// 将旋转角度转换为弧度
	const radX = (cameraParam.rotation[0] * Math.PI) / 180;
	const radY = (cameraParam.rotation[1] * Math.PI) / 180;
	const radZ = (cameraParam.rotation[2] * Math.PI) / 180;

	// 计算相机的旋转矩阵
	const cosX = Math.cos(radX);
	const sinX = Math.sin(radX);
	const cosY = Math.cos(radY);
	const sinY = Math.sin(radY);
	const cosZ = Math.cos(radZ);
	const sinZ = Math.sin(radZ);
	const matrix = [
		cosZ * cosY,
		-sinZ * cosX + cosZ * sinY * sinX,
		sinZ * sinX + cosZ * sinY * cosX,
		sinZ * cosY,
		cosZ * cosX + sinZ * sinY * sinX,
		-cosZ * sinX + sinZ * sinY * cosX,
		-sinY,
		cosY * sinX,
		cosY * cosX,
	];

	const cx = matrix[0] * x + matrix[1] * y + matrix[2] * z;
	const cy = matrix[3] * x + matrix[4] * y + matrix[5] * z;
	const cz = matrix[6] * x + matrix[7] * y + matrix[8] * z;

	projectedX = cx / nearPlane;
	projectedY = cy / nearPlane;

	return {
		x: projectedX,
		y: projectedY,
		z: projectedZ,
	};
}

const Model = {
	CUBE: {
		name: "CUBE",
		geometry: {
			x: 0,
			y: 0,
			z: 0,
			width: 50,
			height: 50,
			depth: 50,
			direction: [0, 0, 0],
			color: 0xffffff,
			line_width: 3,
		},
		material: "Edge",
		renderEdge: function (params, cameraParam) {
			const vertices = this.utils.computeVertices(params, cameraParam);
			//8个顶点的三维坐标信息
			// 计算每个边的坐标信息并保存在一个数组中

			const edges = [];

			const edgeIndices = [
				[0, 5],
				[1, 0],
				[1, 4],
				[2, 3],
				[2, 1],
				[2, 7],
				[3, 0],
				[3, 6],
				[7, 6],
				[7, 4],
				[6, 5],
				[4, 5],
			];

			for (const [i, j] of edgeIndices) {
				const edge = [vertices[i], vertices[j]];
				edges.push(edge);
			}
			for (let i = 0; i < edges.length; i++) {
				start = xyz2xy(edges[i][0], cameraParam);
				end = xyz2xy(edges[i][1], cameraParam);
				canvas.drawLine({
					x1: DEVICE_WIDTH / 2 + start.x,
					y1: DEVICE_HEIGHT / 2 + -start.y,
					x2: DEVICE_WIDTH / 2 + end.x,
					y2: DEVICE_HEIGHT / 2 + -end.y,
					color: params.color,
				});
			}
		},

		utils: {
			computeVertices: function (properties, cameraParam) {
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

					const rotatedPoint = rotateCamera(vertex, cameraParam);

					vertex.x = rotatedPoint.x;
					vertex.y = rotatedPoint.y;
					vertex.z = rotatedPoint.z;
				}

				return vertices;
			},
			computeTriangles: function (vertices) {
				/*
				       1 -------------- 2
				      /|              /|
				     / |             / |
				    /  |            /  |
				   6 -------------- 5  |
				   |   |           |   |
				   |   4 ----------|-- 3
				   |  /            |  /
				   |/              |/
				   7 -------------- 8

				//*/
				const triangles = [];

				// 底面上的三角形
				triangles.push([vertices[2], vertices[3], vertices[6]]);
				triangles.push([vertices[2], vertices[7], vertices[6]]);

				// 顶面上的三角形
				triangles.push([vertices[1], vertices[0], vertices[5]]);
				triangles.push([vertices[1], vertices[4], vertices[5]]);

				// 前面的三角形
				triangles.push([vertices[4], vertices[5], vertices[6]]);
				triangles.push([vertices[4], vertices[7], vertices[6]]);

				// 后面的三角形
				triangles.push([vertices[0], vertices[1], vertices[2]]);
				triangles.push([vertices[0], vertices[3], vertices[2]]);

				// 左侧面的三角形
				triangles.push([vertices[0], vertices[3], vertices[6]]);
				triangles.push([vertices[0], vertices[5], vertices[6]]);

				// 右侧面的三角形
				triangles.push([vertices[1], vertices[2], vertices[7]]);
				triangles.push([vertices[1], vertices[4], vertices[7]]);

				return triangles;
			},
		},
	},
	POLYLINE: {
		name: "POLYLINE",
		geometry: {
			points: [
				[0, 0, 0],
				[10, 10, 10],
				[20, 30, 40],
				[-20, 30, 40],
				[12, -60, 52],
				[42, 43, -40],
			],
			color: 0xffffff,
			line_width: 1,
		},
		material: "Edge",

		renderEdge: function (params, cameraParam) {
			canvas.setPaint({
				color: params.color,
				line_width: params.line_width,
			});
			let lastProjectedPoint = null;
			for (let i = 0; i < params.points.length; i++) {
				const point = {
					x: params.points[i][0],
					y: params.points[i][1],
					z: params.points[i][2],
				};
				const projectedPoint = rotateCamera(point, cameraParam);
				const rotatedPoint = xyz2xy(projectedPoint, cameraParam);
				if (i > 0) {
					canvas.drawLine({
						x1: DEVICE_WIDTH / 2 + lastProjectedPoint.x,
						y1: DEVICE_HEIGHT / 2 + -lastProjectedPoint.y,
						x2: DEVICE_WIDTH / 2 + rotatedPoint.x,
						y2: DEVICE_HEIGHT / 2 + -rotatedPoint.y,
						color: params.color,
					});
				}
				lastProjectedPoint = rotatedPoint;
			}
		},
	},
	PLANE: {
		name: "PLANE",
		geometry: {
			position: [0, 0, 0],
			direction: [0, 0, 0],
			width: 10,
			height: 10,
			color: 0xffffff,
		},

		renderMesh: function (params, cameraParam) {
			canvas.setPaint({
				color: params.color,
				line_width: params.line_width,
			});
			const vertices = this.utils.computeVertices(params);

			const triangles = this.utils.computeTriangles(vertices);
			for (let i = 0; i < triangles.length; i++) {
				const triangle_vertex_0 = xyz2xy(triangles[i][0], cameraParam);
				const triangle_vertex_1 = xyz2xy(triangles[i][1], cameraParam);
				const triangle_vertex_2 = xyz2xy(triangles[i][2], cameraParam);
				canvas.drawLine({
					x1: DEVICE_WIDTH / 2 + triangle_vertex_0.x,
					y1: DEVICE_HEIGHT / 2 + -triangle_vertex_0.y,
					x2: DEVICE_WIDTH / 2 + triangle_vertex_1.x,
					y2: DEVICE_HEIGHT / 2 + -triangle_vertex_1.y,
					color: 0xffffff,
				});
				canvas.drawLine({
					x1: DEVICE_WIDTH / 2 + triangle_vertex_1.x,
					y1: DEVICE_HEIGHT / 2 + -triangle_vertex_1.y,
					x2: DEVICE_WIDTH / 2 + triangle_vertex_2.x,
					y2: DEVICE_HEIGHT / 2 + -triangle_vertex_2.y,
					color: 0xffffff,
				});
				canvas.drawLine({
					x1: DEVICE_WIDTH / 2 + triangle_vertex_2.x,
					y1: DEVICE_HEIGHT / 2 + -triangle_vertex_2.y,
					x2: DEVICE_WIDTH / 2 + triangle_vertex_0.x,
					y2: DEVICE_HEIGHT / 2 + -triangle_vertex_0.y,
					color: 0xffffff,
				});
			}
		},

		utils: {
			computeVertices: function (params) {
				//const position = params.position;
				//const direction = params.direction;

				const position = Vector.create(
					params.position[0],
					params.position[1],
					params.position[2]
				);
				const direction = Vector.create(
					params.direction[0],
					params.direction[1],
					params.direction[2]
				);
				const w = params.width;
				const h = params.height;

				console.log(position);
				console.log(direction);
				console.log(w);
				console.log(h);

				const normal = Vector.create(
					direction.x,
					direction.y,
					direction.z
				).normalize(); // 平面法向量
				const t1 = Vector.create(normal.y, -normal.x, 0).normalize(); // 平面上的一个向量
				const t2 = normal.cross(t1); // 平面上的另一个向量
				const halfW = w / 2; // 平面宽度的一半
				const halfH = h / 2; // 平面高度的一半

				// 四个顶点的坐标
				const vertex1 = [
					position.x - t1.x * halfW - t2.x * halfH,
					position.y - t1.y * halfW - t2.y * halfH,
					position.z - t1.z * halfW - t2.z * halfH,
				];
				const vertex2 = [
					position.x + t1.x * halfW - t2.x * halfH,
					position.y + t1.y * halfW - t2.y * halfH,
					position.z + t1.z * halfW - t2.z * halfH,
				];
				const vertex3 = [
					position.x + t1.x * halfW + t2.x * halfH,
					position.y + t1.y * halfW + t2.y * halfH,
					position.z + t1.z * halfW + t2.z * halfH,
				];
				const vertex4 = [
					position.x - t1.x * halfW + t2.x * halfH,
					position.y - t1.y * halfW + t2.y * halfH,
					position.z - t1.z * halfW + t2.z * halfH,
				];

				console.log([vertex1, vertex2, vertex3, vertex4]);

				return [vertex1, vertex2, vertex3, vertex4];
			},
			computeTriangles: function (vertices) {
				const triangles = [];

				triangles.push([vertices[0], vertices[1], vertices[2]]);
				triangles.push([vertices[0], vertices[3], vertices[2]]);

				return triangles;
			},
		},
	},
	POINT: {
		name: "POINT",
		geometry: {
			points: [[0, 0, 0]],
			color: 0xffffff,
		},

		renderPoint: function (params, cameraParam) {
			canvas.setPaint({
				color: params.color,
			});
			console.log("POINT");
			for (let i = 0; i < params.points.length; i++) {
				const init_point = {
					x: params.points[i][0],
					y: params.points[i][1],
					z: params.points[i][2],
				};
				const point = xyz2xy(init_point, cameraParam);
				console.log(
					DEVICE_WIDTH / 2 +
						point.x +
						"x" +
						DEVICE_HEIGHT / 2 +
						point.y
				);
				canvas.drawPixel({
					x: DEVICE_WIDTH / 2 + point.x,
					y: DEVICE_HEIGHT / 2 + point.y,
					color: params.color,
				});
			}
		},

		utils: {},
	},
	BALL: {
		name: "BALL",
		geometry: {
			position: [[0, 0, 0]],
			width: 3,
			radius: 10,
			color: 0xffffff,
		},

		renderEdge: function (params, cameraParam) {
			canvas.setPaint({
				color: params.color,
				line_width: params.line_width,
			});
			for (let i = 0; i < params.position.length; i++) {
				const init_position = {
					x: params.position[i][0],
					y: params.position[i][1],
					z: params.position[i][2],
				};
                
				const rotate_position = rotateCamera(init_position, cameraParam);
				const point = xyz2xy(rotate_position, cameraParam);
				canvas.strokeCircle({
					center_x: DEVICE_WIDTH / 2 + point.x,
					center_y: DEVICE_HEIGHT / 2 + point.y,
					radius: params.radius,
					color: params.color,
				});
			}
		},

		utils: {},
	},
};

const Vector = {
	// 向量对象的构造函数
	create: function (x, y, z) {
		return Object.create(this, {
			x: { value: x || 0, writable: true },
			y: { value: y || 0, writable: true },
			z: { value: z || 0, writable: true },
		});
	},

	// 向量对象的加法方法，返回一个新向量对象
	add: function (v) {
		return Vector.create(this.x + v.x, this.y + v.y, this.z + v.z);
	},

	// 向量对象的减法方法，返回一个新向量对象
	subtract: function (v) {
		return Vector.create(this.x - v.x, this.y - v.y, this.z - v.z);
	},

	// 向量对象的乘法方法，返回一个新向量对象
	multiply: function (n) {
		return Vector.create(this.x * n, this.y * n, this.z * n);
	},

	// 向量对象的叉积方法，返回一个新向量对象
	cross: function (v) {
		const x = this.y * v.z - this.z * v.y;
		const y = this.z * v.x - this.x * v.z;
		const z = this.x * v.y - this.y * v.x;
		return Vector.create(x, y, z);
	},

	// 向量对象的归一化方法，返回一个新向量对象
	normalize: function () {
		const length = Math.sqrt(
			this.x * this.x + this.y * this.y + this.z * this.z
		);
		if (length === 0) {
			return Vector.create();
		}
		return Vector.create(this.x / length, this.y / length, this.z / length);
	},
};
