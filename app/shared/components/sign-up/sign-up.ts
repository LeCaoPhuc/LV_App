import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import { Observable, PropertyChangeData } from 'data/observable';
import validate = require('../../tools/validate');
import * as switchModule from "tns-core-modules/ui/switch";
import { ParseService } from '../../tools';
import view = require("ui/core/view");
import textField = require("ui/text-field");
import http = require("http");
import frames = require("ui/frame");
import { Utils } from "../../tools";
import localStorage = require("nativescript-localstorage");
import dialogs = require("ui/dialogs");
import { Config } from '../../env-config';
import app = require('application');
var utils = require("utils/utils");

var pageModel;
var page;


export function onLoad(args) {
    pageModel = args.object.bindingContext;
}

export function checkInput(args) {
    if (!validate.verifyInput(args.object.id, pageModel, pageModel.signUpConfig, 'signUpConfig')) {
        for (let i in pageModel.signUpConfig) {
            if (pageModel.signUpConfig[i].id == args.object.id) {
                pageModel.messageError = pageModel.signUpConfig[i].messageError;
                pageModel.notifyPropertyChange('messageError', pageModel.messageError);
                return;
            }
        }
    }
}

export function signUp() {
    var req: any;
    var validated = true;
    pageModel.hideKeyBoard();
    for (let i in pageModel.signUpConfig) {
        if (!validate.verifyInput(pageModel.signUpConfig[i].id, pageModel, pageModel.signUpConfig, 'signUpConfig')) {
            pageModel.messageError = pageModel.signUpConfig[i].messageError;
            pageModel.notifyPropertyChange('messageError', pageModel.messageError);
            console.log(pageModel.messageError);
            return;
        }
    }
    req = {
        username: pageModel.signUpConfig['userName'].value,
        first_name: pageModel.signUpConfig['firstName'].value,
        last_name: pageModel.signUpConfig['lastName'].value,
        password: pageModel.signUpConfig['password'].value
    };
    Utils.showLoadingIndicator();
    ParseService.cloudNoneOauth('signUp', req)
        .then((res) => {
            ParseService.logIn(pageModel.signUpConfig['userName'].value, pageModel.signUpConfig['password'].value)
                .then((res)=>{
                    pageModel.clearConfig('signUp');
                    pageModel.notifyPropertyChange('signUpConfig', pageModel.signUpConfig);
                    Utils.hideLoadingIndicator();
                    localStorage.setItem("isLogged", true);
                    Utils.navigate('pages/home-page/home-page', true);
                    Utils.alert('success', 'Thông Báo', 'Đăng ký tài khoản thành công', 'Tiếp Tục');
                })
                .catch((err)=>{
                    Utils.hideLoadingIndicator();
                })
        })
        .catch((err) => {
            Utils.hideLoadingIndicator();
            if (err.message.message == "username is exists") {
                Utils.alert('error', 'Thông Báo', 'Tài khoản đã tồn tại trong hệ thống vui lòng chọn tài khoản khác', 'Đóng');
            }
            else {
                Utils.alert('error', 'Thông Báo', 'Đăng ký tài khoản thất bại', 'Đóng');
            }
        })
}

export function onSignUpTouch(args) {
    if (args.action == 'down') {
        args.object.backgroundColor = '#4a148c';
        args.object.getChildAt(0).color = '#ffffff'
    }
    else if (args.action == "up" || args.action == "cancel") {
        args.object.backgroundColor = '#ffffff';
        args.object.getChildAt(0).color = '#812092'
        signUp();
    }
}