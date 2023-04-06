import { getText } from '@zos/i18n'
Page({
	build() {
		class ZeppRE {
			createScene() {
				this.type = "scene";
				this.models = [];
			}
			add(modelObj) {
				// renderList.push({ type: modelObj.type, geometry: modelObj.geometry });
				this.models.push(modelObj); // 将模型加入渲染列表
			}
		
			createCamera(param) {
				/**
				 * @param {number} param.fov Field of view. 视野角度
				 * @param {number} param.aspectRatio Aspect ratio. 长宽比
				 * @param {number} param.nearPlane Near clipping plane. 近截面
				 * @param {number} param.farPlane Far clipping plane. 远截面
				 * */
				this.type = "camera";
			}
			createModel(type, createParam) {
				/**
				 * @param {string} type The type of the object to be created. 要创建的对象的类型
				 * @param {object} createParam Parameters of the object to be created. 要创建的对象的参数
				 * */
				this.type = "model";
				const modelDef = this.Model[type]; // 获取对应模型类型的定义
				if (!modelDef) {
					// 校验
					console.log(`Unknown model type: ${type}`);
				}//*/
				const modelObj = this.Model[type];
			}
			render() {
				for (i = 0; i < this.models.length; i++) {
					// TODO 循环渲染renderList里的所有模型
				}
			}
			Model = {
				CUBE: {
					geometry: {
						x: 0,
						y: 0,
						z: 0,
						width: 10,
						height: 10,
						depth: 10,
						direction: [0, 0, 0],
					},
				},
			};
		}
		class Vector {
			// 叉积函数，计算当前向量与参数向量v的叉积，并返回一个新向量
			cross(v) {
				const x = this.y * v.z - this.z * v.y;
				const y = this.z * v.x - this.x * v.z;
				const z = this.x * v.y - this.y * v.x;
				return //new Vector(x, y, z);
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
					},
					renderMesh: function (params) {},
					renderFace: function (params) {},
					utils: {
						computeCubeVertices: function (properties) {
							//通过CUBE的属性{ x, y, z, width, height, depth }计算出立方体的顶点和面
		
							if (!properties || typeof properties !== "object") {
								
								console.log(
									"Invalid input: properties must be an object."
								);
								
							}
							const { x, y, z, width, height, depth, direction } =
								properties;
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
								direction.length !== 3 //||
								//!direction.every((angle) => typeof angle === "number")
							) {
								console.log(
									"Invalid input: x, y, z, width, height, depth, and direction must be numbers."
								);//*/
							}
		
							const halfWidth = width / 2;
							const halfHeight = height / 2;
							const halfDepth = depth / 2;
		
							// 计算立方体每个面的顶点坐标
							const vertices = [
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
							for (let i = 0; i < vertices.length; i++) {
								const vertex = vertices[i];
								let [x, y, z] = [vertex.x, vertex.y, vertex.z];
								const xNew =
									cosZ * cosY * x +
									(cosZ * sinY * sinX - sinZ * cosX) * y +
									(cosZ * sinY * cosX + sinZ * sinX) * z;
								const yNew =
									sinZ * cosY * x +
									(sinZ * sinY * sinX + cosZ * cosX) * y +
									(sinZ * sinY * cosX - cosZ * sinX) * z;
								const zNew =
									-sinY * x + cosY * sinX * y + cosY * cosX * z;
								vertex.x = xNew;
								vertex.y = yNew;
								vertex.z = zNew;
							}
						},
						computeFaceIndices: function (vertices, normals) {
							// 根据顶点和法向量，计算每个面的顶点索引
							const indices = [];
							for (let i = 0; i < vertices.length; i += 4) {
								const faceNormal = normals[Math.floor(i / 4)];
								/*
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
								).normalize();//*/
								indices.push(i, i + 1, i + 2);
								indices.push(i, i + 2, i + 3);
							}
							return indices;
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
					},
				},
			};
		}
		
	},
});
