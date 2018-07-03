import { Config } from '../../../shared/env-config';

export var RESETPASSWORD_CONFIG = {
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
    email: {
        label: "Nhập email để lấy lại mật khẩu",
        type: "email",
        id: "email",
        errors: {
            required: {
                error: false,
                message: Config.ERROR_MESSAGE.EMAIL_REQUIRED
            },
            format: {
                error: false,
                message: Config.ERROR_MESSAGE.EMAIL_FORMAT
            }
        },
        messageError: " ",
        placeHolder: "Nhập email",
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
}