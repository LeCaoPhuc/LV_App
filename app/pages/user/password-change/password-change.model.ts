import { Observable } from 'data/observable';
import { httpRequest, Utils, ParseService } from '../../../shared/tools';
import validate = require('../../../shared/tools/validate');
import localStorage = require("nativescript-localstorage");
import { Config } from '../../../shared/env-config';
import dialogs = require("ui/dialogs");
import app = require('application');
const CHANGE_PASSWORD_SUCCESS = 'Đổi mật khẩu thành công';
const CHANGE_PASSWORD_FAILED = 'Đổi mật khẩu thất bại';

export class PasswordChangeModel extends Observable {
    private passwordConfig = {
        passwordOld: {
            label: "Mật khẩu cũ",
            type: "password",
            id: "passwordOld",
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
            placeHolder: "Mật khẩu cũ",
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
            placeHolder: "Mật khẩu mới",
            value: ""
        },
        rePasswordNew: {
            label: "Xác nhận mật khẩu mới",
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
            placeHolder: "Xác nhận",
            value: "",
            matchField: 'passwordNew'
        }
    }
    private actionBarTitle;
    private passwordOldIsSecure;
    private passwordNewIsSecure;
    private rePasswordNewIsSecure;
    constructor() {
        super();
        this.actionBarTitle = 'Đổi mật khẩu';
        this.passwordOldIsSecure = true;
        this.passwordNewIsSecure = true;
        this.rePasswordNewIsSecure = true;
    }

    public checkInput(args) {
        validate.verifyInput(args.object.id, this, this.passwordConfig, 'passwordConfig');
    }

    updatePassword(args) {
        var validated = true;
        var page = args.object.page;
        var txtPasswordOld = page.getViewById(this.passwordConfig.passwordOld.id);
        var txtPasswordNew = page.getViewById(this.passwordConfig.passwordNew.id);
        var txtRePasswordNew = page.getViewById(this.passwordConfig.rePasswordNew.id);
        Utils.hideKeyboard([txtPasswordOld, txtPasswordNew, txtRePasswordNew]);
        for (let i in this.passwordConfig) {
            validated = validated && validate.verifyInput(this.passwordConfig[i].id, this, this.passwordConfig, 'passwordConfig');
        }
        if (validated) {
            //send req to server
            var userInfo = ParseService.currentUser().attributes;
            var data = {
                username: userInfo ? userInfo.username : '',
                oldPassword: this.passwordConfig.passwordOld.value,
                newPassword: this.passwordConfig.passwordNew.value
            }
            if (!Utils.checkInternetConnection()) {
                return;
            }
            Utils.showLoadingIndicator();
            ParseService.cloud('changePassword', data)
                .then((res) => {
                    Utils.hideLoadingIndicator();
                    Utils.alert('success', "Thông Báo", CHANGE_PASSWORD_SUCCESS, "Đóng");
                    Utils.goBack();
                })
                .catch((err) => {
                    Utils.hideLoadingIndicator();
                    if (err.message.code == 101) {
                        Utils.alert('error', "Thông Báo", "Mật khẩu cũ không chính xác vui lòng kiểm tra lại", "Đóng");
                    }
                    else {
                        Utils.alert('error', "Thông Báo", CHANGE_PASSWORD_FAILED, "Đóng");
                    }
                })

        }
    }

    changeSecure(args) {
        var id = args.object.id;
        var textFieldId;
        switch (id) {
            case 'passwordOldIsSecure':
                this.passwordOldIsSecure = !this.passwordOldIsSecure;
                this.notifyPropertyChange('passwordOldIsSecure', this.passwordOldIsSecure);
                break;
            case 'passwordNewIsSecure':
                this.passwordNewIsSecure = !this.passwordNewIsSecure;
                this.notifyPropertyChange('passwordNewIsSecure', this.passwordNewIsSecure);
                break;
            case 'rePasswordNewIsSecure':
                this.rePasswordNewIsSecure = !this.rePasswordNewIsSecure;
                this.notifyPropertyChange('rePasswordNewIsSecure', this.rePasswordNewIsSecure);
                break;
            default:
                return;
        }

    }

    goBack() {
        Utils.goBack();
    }
}


