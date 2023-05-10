/**
 * zeppos-advanced-gesture.js
 * @description An advanced gesture recognition library for ZeppOS. 一个适用于ZeppOS的进阶手势识别库
 * @version 1.0.0
 * @date 2023/04/12
 * @author XiaomaiTX
 * @license MIT
 * https://github.com/XiaomaiTX/zeppos-gesture
 *
 * */

import { createWidget, widget, prop, event } from "@zos/ui";

export class GestureListener {
	add({
		objects,
		conf = {},
		LONG_PRESS,
		CLICK,
		MOVE,
		SWIPE_LEFT,
		SWIPE_RIGHT,
		SWIPE_UP,
		SWIPE_DOWN,
		END,
	}) {
		objects.forEach((object) => {
			let gestureState = "possible";
			let isClick = true;
			let isLongPress = null;
			let longPress = null;
			let startPos = null;
			let endPos = null;
			let isSwipeEnabled = true;

			object.addEventListener(event.CLICK_DOWN, (info) => {
				console.log("TouchChain Start");

				const longPressDelay = conf.LONG_PRESS?.delay || 1000;
				longPress = setTimeout(() => {
					console.log("TouchChain Long Press");
					isClick = false;
					isLongPress = true;
					LONG_PRESS(info);
				}, longPressDelay);

				startPos = {
					x: info.x,
					y: info.y,
				};
			});

			object.addEventListener(event.CLICK_UP, (info) => {
				if (isClick) {
					console.log("TouchChain Click");
					CLICK(info);
				}
				console.log("TouchChain End");
				if (END && startPos) {
					info.startPos = startPos;
					END(info);
				}
				clearTimeout(longPress);
				isSwipeEnabled = true;
				isClick = true;
			});

			object.addEventListener(event.MOVE, (info) => {
				isClick = false;
				clearTimeout(longPress);
				if (MOVE && startPos) {
					console.log("TouchChain Move");
					info.startPos = startPos;
					MOVE(info);
					isSwipeEnabled = false;
				} else {
					if (isSwipeEnabled && startPos) {
						const deltaX = info.x - startPos.x;
						const deltaY = info.y - startPos.y;
						const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

						if (
							SWIPE_LEFT &&
							deltaX < -50 &&
							Math.abs(deltaY) < 50
						) {
							console.log("TouchChain Swipe Left");
							SWIPE_LEFT(info);
							isSwipeEnabled = false;
						}
						if (
							SWIPE_RIGHT &&
							deltaX > 50 &&
							Math.abs(deltaY) < 50
						) {
							console.log("TouchChain Swipe Right");
							SWIPE_RIGHT(info);
							isSwipeEnabled = false;
						}
						if (SWIPE_UP && deltaY < -50 && Math.abs(deltaX) < 50) {
							console.log("TouchChain Swipe Up");
							SWIPE_UP(info);
							isSwipeEnabled = false;
						}
						if (
							SWIPE_DOWN &&
							deltaY > 50 &&
							Math.abs(deltaX) < 50
						) {
							console.log("TouchChain Swipe Down");
							SWIPE_DOWN(info);
							isSwipeEnabled = false;
						}
					}
				}
			});
		});
	}
	stop(objects) {
		objects.forEach((object) => {
			object.removeEventListener(event.MOVE, {})
			object.removeEventListener(event.CLICK_DOWN, {})
			object.removeEventListener(event.CLICK_UP, {})
			object.removeEventListener(event.MOVE_IN, {})
			object.removeEventListener(event.MOVE_OUT, {})
		});
	}
}
