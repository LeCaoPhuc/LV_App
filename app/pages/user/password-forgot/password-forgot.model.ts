import { Observable } from 'data/observable';
import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import { httpRequest, Utils, ParseService } from '../../../shared/tools';
import dialogs = require("ui/dialogs");
import validate = require('../../../shared/tools/validate');
import frames = require("ui/frame");
import { RESETPASSWORD_CONFIG } from './password-forgot-config';
import { Config } from "../../../shared/env-config";


export class ForgotPasswordModel extends Observable {
    private resetPasswordConfig: any;
    private actionBarTitle: string;
    private userView: any;
    private passwordView: any;
    constructor(page) {
        super();
        this.resetPasswordConfig = {
            verifyCode: {
                label: 'Mã xác thực',
                type: "code", 
                id: 'verifyCode',
                errors: {
                    required:{
                        error: false,
                        message: Config.ERROR_MESSAGE.VERIFYCODE_REQUIRED
                    },
                    format: {
                        error: false,
                        message: Config.ERROR_MESSAGE.VERIFYCODE_FORMAT
                    },
                    length: {
                        error: false,
                        message: Config.ERROR_MESSAGE.VERIFYCODE_FORMAT,
                        min: 6,
                        max: 6,
                    },
                },
                messageError: " ",
                placeHolder: "Mã xác thực",
                serverValue: '',
                value: '',
            },
            userName: {
                label: "Nhập tài khoản để lấy lại mật khẩu",
                type: "id",
                id: "userName",
                errors: {
                    required: {
                        error: false,
                        message: Config.ERROR_MESSAGE.USERNAME_REQUIRED
                    },
                    format: {
                        error: false,
                        message: Config.ERROR_MESSAGE.USERNAME_FORMAT
                    }
                },
                messageError: " ",
                placeHolder: "Nhập tài khoản",
                value: ""
            },
            passwordNew: {
                label: "Mật khẩu mới",
                type: "password",
                id: "passwordNew",
                errors: {
                    required: {
                        error: false,
                        message: Config.ERROR_MESSAGE.PASSWORD_REQUIRED
                    },
                    format: {
                        error: false,
                        message: Config.ERROR_MESSAGE.PASSWORD_FORMAT
                    }
                },
                messageError: " ",
                placeHolder: "Nhập mật khẩu mới",
                value: ""
            },
            rePasswordNew: {
                label: "Xác nhận",
                type: "rePassword",
                id: "rePasswordNew",
                errors: {
                    required: {
                        error: false,
                        message: Config.ERROR_MESSAGE.REPASSWORD_REQUIRED
                    },
                    match: {
                        error: false,
                        message: Config.ERROR_MESSAGE.REPASSWORD_NOMATCH,
                    }
                },
                messageError: " ",
                placeHolder: "Nhập lại mật khẩu mới",
                value: "",
                matchField: 'passwordNew'
            }
        };
        this.userView = page.getViewById('userView');
        this.passwordView = page.getViewById('passwordView');
        this.actionBarTitle = 'Quên mật khẩu';
    }

    checkInput(args) {
        validate.verifyInput(args.object.id, this, this.resetPasswordConfig, 'resetPasswordConfig');
    }

    onRequestPasswordTap(args) {
        var self = this;
        if (validate.verifyInput('userName', this, this.resetPasswordConfig, 'resetPasswordConfig')) {
            if (!Utils.checkInternetConnection()) {
                return;
            }
            Utils.showLoadingIndicator();
            ParseService.cloudNoneOauth('requestPassword', { username: this.resetPasswordConfig['userName'].value })
                .then((res) => {
                    Utils.hideLoadingIndicator();
                    self.userView.class = "animationHide";
                    setTimeout(function () {
                        self.userView.visibility = "collapsed";
                        self.passwordView.visibility = "visible";
                        self.passwordView.class = "animationShow";
                    }, 350);
                })
                .catch((err) => {
                    Utils.hideLoadingIndicator();
                    console.log(err);
                    if (err.message && err.message.error && err.message.error.code == 601) {
                        Utils.alert('warning', 'Thông Báo', 'Tài khoản không tồn tại trong hệ thống vui lòng kiểm tra lại', 'Đóng');
                    }
                    else {
                        Utils.alert('error', 'Thông Báo', 'Gửi mã xác thực thất bại', 'Đóng');
                    }
                })
        }

    }

    onResetPasswordTap(args) {
        var self = this;
        var validated = true;
        var data;
        for (let i in this.resetPasswordConfig) {
            if (!validate.verifyInput(this.resetPasswordConfig[i].id, this, this.resetPasswordConfig, 'resetPasswordConfig')) {
                return;
            }
        }
        if (!Utils.checkInternetConnection()) {
            return;
        }
        data = {
            username: this.resetPasswordConfig['userName'].value,
            password: this.resetPasswordConfig['passwordNew'].value,
            verifyCode: this.resetPasswordConfig['verifyCode'].value 
        }
        Utils.showLoadingIndicator();
        ParseService.cloudNoneOauth('resetPassword', data)
            .then((res) => {
                Utils.hideLoadingIndicator();
                Utils.alert('success', 'Thông Báo', 'Cập nhật mật khẩu mới thành công', 'Đóng');
                Utils.goBack();
            })
            .catch((err) => {
                Utils.hideLoadingIndicator();
                console.log(err);
                if (err.message && err.message.code == 401) {
                    Utils.alert('warning', 'Thông Báo', 'Mã xác thực khộng chính xác hoặc đã hết hạn', 'Đóng');
                }
                else {
                    Utils.alert('error', 'Thông Báo', 'Cập nhật mật khẩu mới thất bại', 'Đóng');
                }
            })
    }

    goBack() {
        Utils.goBack();
    }
}