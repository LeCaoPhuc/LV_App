import validate = require('../../tools/validate');
import { EventData, fromObject } from 'data/observable';
import { httpRequest, Utils, Error, ShareDataService, ParseService,ManagementCategoryMap } from '../../tools';
import { Config } from '../../env-config';
import localStorage = require("nativescript-localstorage");
import dialogs = require("ui/dialogs");
import app = require('application');
var pageModel;
var managementCategoryMap = ManagementCategoryMap;
export function onLoad(args) {
    pageModel = args.object.bindingContext;
    pageModel.notifyPropertyChange("signInConfig", pageModel.signInConfig);
}


export function checkInput(args) {
    if (!validate.verifyInput(args.object.id, pageModel, pageModel.signInConfig, 'signInConfig')) {
        for (let i in pageModel.signInConfig) {
            if (pageModel.signInConfig[i].id == args.object.id) {
                pageModel.messageError = pageModel.signInConfig[i].messageError;
                pageModel.notifyPropertyChange('messageError', pageModel.messageError);
                return;
            }
        }
    }
}

export function signIn() {
    // Utils.navigate('pages/payment/payment');
    var validated = true;
    pageModel.hideKeyBoard();
    for (let i in pageModel.signInConfig) {
        if (!validate.verifyInput(pageModel.signInConfig[i].id, pageModel, pageModel.signInConfig, 'signInConfig')) {
            pageModel.messageError = pageModel.signInConfig[i].messageError;
            pageModel.notifyPropertyChange('messageError', pageModel.messageError);
            console.log(pageModel.messageError);
            return;
        }
    }
    Utils.showLoadingIndicator();
    ParseService.logIn(pageModel.signInConfig['userName'].value, pageModel.signInConfig['password'].value)
        .then((res) => {
            managementCategoryMap.initCategoryMap()
            .then(()=>{
                managementCategoryMap.init();
                var user = ParseService.currentUser();
                localStorage.setItem("isLogged", true);
                Utils.navigate('pages/home-page/home-page', true);
            })
            .catch((err)=>{
                Utils.hideLoadingIndicator();
                console.log("signIn -LogIn- initCategoryMap -" ,err)
            })
           
        })
        .catch((err) => {
            Utils.hideLoadingIndicator();
            if (err.code == 101 ) {
                Utils.alert('warning', 'Đăng nhập thất bại', ' Vui lòng kiểm tra tài khoản và mật khẩu', 'Đóng');
            }
            console.log("logIn ERROR")
            console.log(err);
        })
}


export function signInOld() {
    Utils.showLoadingIndicator();
    httpRequest.post('scanngo_v1/customer/login', {
        username: '0979904917',
        password: '111111'

    })
        .then((res: any) => {
            Utils.hideLoadingIndicator();
            res = res.content.toJSON();
            if (res.success) {
                localStorage.setItem('accessToken', res.data.access_token);
                localStorage.setItem('isLogged', true);
                localStorage.setItem('newLogin', true);
                var userInfo = {
                    firstName: res.data.first_name ? res.data.first_name : '',
                    lastName: res.data.last_name ? res.data.last_name : '',
                    phone: res.data.phone_number ? res.data.phone_number : '',
                    email: res.data.email ? res.data.email : '',
                    avatar: res.data.avatar_url ? res.data.avatar_url : '',
                    id: res.data.id ? res.data.id : '',
                    coopId: res.data.coop_id ? res.data.coop_id : '',
                    gender: (res.data.gender == 'Male' || res.data.gender == true || res.data.gender == 'male') ? 'male' : 'female'
                }
                localStorage.setItem('userInfo', userInfo);
                Utils.navigate('pages/home-page/home-page', true);
            }

        })
        .catch((err) => {
            Utils.hideLoadingIndicator();
            console.log('dsdsds')
        })
}

export function onSignInTouch(args) {
    if (args.action == 'down') {
        args.object.backgroundColor = '#4a148c';
        args.object.getChildAt(0).color = '#ffffff'
    }
    else if (args.action == "up" || args.action == "cancel") {
        args.object.backgroundColor = '#ffffff';
        args.object.getChildAt(0).color = '#812092'
        signIn();
    }
}

export function onForgotPasswordTap(args) {
    Utils.navigate('pages/user/password-forgot/password-forgot');
}