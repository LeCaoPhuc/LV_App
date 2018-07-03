import { Config } from '../../shared/env-config';

export function getSignInConfigDefault() {
    return {
        userName: {
            label: "Tài khoản",
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
            error: false,
            placeHolder: "Tài khoản",
            value: ""
        },
        password: {
            label: "Mật khẩu",
            type: "password",
            id: "password",
            errors: {
                required: {
                    error: false,
                    message: Config.ERROR_MESSAGE.PASSWORD_REQUIRED
                },
                format: {
                    error: false,
                    message: Config.ERROR_MESSAGE.PASSWORD_FORMAT
                },
                length: {
                    error: false,
                    message: Config.ERROR_MESSAGE.PHONENUMBER_FORMAT,
                    min: 8,
                    max: 12
                },
            },
            messageError: " ",
            error: false,
            placeHolder: "Mật khẩu",
            value: ""
        }
    }
}
export function getSignUpConfigDefault() {
    return {
        userName: {
            label: "Tài khoản",
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
            error: false,
            placeHolder: "Tài khoản",
            value: ""
        }, 
        password: {
            label: "Mật khẩu",
            type: "password",
            id: "password",
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
            error: false,
            placeHolder: "Mật khẩu",
            value: ""
        },
        rePassword: {
            label: "Xác nhận mật khẩu",
            type: "rePassword",
            id: "rePassword",
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
            messageError: "",
            placeHolder: "Xác nhận mật khẩu",
            value: "",
            matchField: 'password'
        },
        firstName: {
            label: "Tên",
            type: "name",
            id: "firstName",
            errors: {
                required: {
                    error: false,
                    message: Config.ERROR_MESSAGE.FIRSTNAME_REQUIRED
                },
                format: {
                    error: false,
                    message: Config.ERROR_MESSAGE.FIRSTNAME_FORMAT
                }
            },
            messageError: "",
            placeHolder: "Tên",
            value: ""
        },
        lastName: {
            label: "Họ",
            type: "name",
            id: "lastName",
            errors: {
                required: {
                    error: false,
                    message: Config.ERROR_MESSAGE.LASTNAME_REQUIRED
                },
                format: {
                    error: false,
                    message: Config.ERROR_MESSAGE.LASTNAME_FORMAT
                }
            },
            messageError: "",
            placeHolder: "Họ",
            value: ""
        }
    }
}