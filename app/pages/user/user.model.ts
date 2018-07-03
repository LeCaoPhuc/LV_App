import { Observable, PropertyChangeData } from 'data/observable';
import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import { ParseService } from '../../shared/tools';
import { getSignInConfigDefault, getSignUpConfigDefault } from './user-config';
import platformModule = require("platform");
import validate = require('../../shared/tools/validate');
import app = require('application');
import localStorage = require("nativescript-localstorage");
import { Utils } from "../../shared/tools/utils";
import { Config } from "../../shared/env-config";

export class UserModel extends Observable {
	private page: any;
	private signUpConfig: any;
	private signInConfig: any;
	private listTextField: Array<any>;
	private showSignIn: boolean;
	private screenWidth: number;
	private screenHeight: number;
	private showScreenTabView: string;
	private showScreen: string;
	private signInView: any;
	private signUpView: any;
	private messageError: string;
	constructor(page) {
		super();
		this.page = page;
		this.signInConfig = getSignInConfigDefault();
		this.signUpConfig = getSignUpConfigDefault();
		this.showScreenTabView = 'signin';
		this.showScreen = 'signin';
		this.signInView = page.getViewById('signInView');
		this.signUpView = page.getViewById('signUpView');
		this.messageError = " ";
	}

	onChangeViewTap(args) {
		var self = this;
		var type = args.object.viewType;
		if (type == 'signin') {
			if (this.showScreen == 'signin') {
				return;
			}
			else {
				this.clearConfig('signUp');
				this.messageError = ' ';
				this.showScreenTabView = 'signin';
				this.signUpView.class = 'animationHide';
				setTimeout(function () {
					self.showScreen = 'signin';
					self.clearConfig('signIn');
					self.signInView.class = 'animationShow';
					self.messageError = ' ';
					self.notifyPropertyChange('messageError', self.messageError);
					self.notifyPropertyChange('showScreen', self.showScreen);
					self.notifyPropertyChange('showScreenTabView', self.showScreenTabView);
				}, 350);
			}
		}
		else {
			if (this.showScreen == 'signup') {
				return;
			}
			else {
				this.clearConfig('signIn');
				this.messageError = ' ';
				this.notifyPropertyChange('messageError', this.messageError);
				this.showScreenTabView = 'signup';
				this.signInView.class = 'animationHide';
				setTimeout(function () {
					self.showScreen = 'signup';
					self.clearConfig('signUp');
					self.signUpView.class = 'animationShow';
					self.messageError = ' ';
					self.notifyPropertyChange('messageError', self.messageError);
					self.notifyPropertyChange('showScreen', self.showScreen);
					self.notifyPropertyChange('showScreenTabView', self.showScreenTabView);
				}, 350);
			}
		}
		this.notifyPropertyChange('showScreen', this.showScreen);
		this.notifyPropertyChange('showScreenTabView', this.showScreenTabView);
	}

	pageLoaded() {
		this.listTextField = [
			this.page.getViewById(this.signInConfig.userName.id),
			this.page.getViewById(this.signInConfig.password.id),
			this.page.getViewById(this.signUpConfig.userName.id),
			this.page.getViewById(this.signUpConfig.password.id),
			this.page.getViewById(this.signUpConfig.firstName.id),
			this.page.getViewById(this.signUpConfig.lastName.id),
			this.page.getViewById(this.signUpConfig.rePassword.id),
		];
		this.hideKeyBoard();
	}

	hideKeyBoard() {
		Utils.hideKeyboard(this.listTextField);
	}

	clearConfig(typeConfig: string) {
		if (typeConfig == 'signIn') {
			Utils.clearConfig(this.signInConfig);
			this.notifyPropertyChange('signInConfig', this.signInConfig);
		}
		else if (typeConfig == 'signUp') {
			Utils.clearConfig(this.signUpConfig);
			this.notifyPropertyChange('signUpConfig', this.signUpConfig);
		}
	}

	changeIpServer() {
		var dialogs = require("ui/dialogs");
		dialogs.prompt({
			title: "Thay đổi địa chỉ server",
			message: "nhập ip và port server dạng 192.168.1.128:3000",
			okButtonText: "Xác nhận",
			cancelButtonText: "Hủy",
			inputType: dialogs.inputType.text
		}).then(function (r) {
			if (r.result) {
				ParseService.configServerUrl(r.text);
			}
		});
	}
}