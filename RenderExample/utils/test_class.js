const deviceInfo = hmSetting.getDeviceInfo();
const { width, height } = deviceInfo;
const ExtraHeight = (height - width) / 2;
export class TEST {
    create() {
		this.type = "test_type";
		this.data = [];
	}

}