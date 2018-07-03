import { Observable } from 'data/observable';
import { httpRequest, Utils, ParseService } from '../../../shared/tools';
import validate = require('../../../shared/tools/validate');
import frames = require("ui/frame");
import localStorage = require("nativescript-localstorage");
var icModule = require("nativescript-imagecropper");
import cameraModule = require("nativescript-camera");
import imgSource = require("image-source");
import imagepicker = require("nativescript-imagepicker");
import * as ImageModule from "tns-core-modules/ui/image";
import dialogs = require("ui/dialogs");
import { Config } from '../../../shared/env-config';

const UPDATE_AVATAR_FAILED = 'Cập nhật ảnh đại diện thất bại';
const UPDATE_PROFILE_FAILED = 'Cập nhật thông tin tài khoản thất bại';

const UPDATE_AVATAR_SUCCESS = 'Cập nhật ảnh đại diện thành công';
const UPDATE_PROFILE_SUCCESS = 'Cập nhật thông tin tài khoản thành công';

export class ProfileUpdateModel extends Observable {
    private profileConfig;
    private gender: string;
    private avatar: any;
    private phoneNumber: string;
    private page: any;
    private address: string;
    constructor(page) {
        super();
        this.page = page;
        this.profileConfig = {
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
                messageError: " ",
                placeHolder: "Nhập tên",
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
                messageError: " ",
                placeHolder: "Nhập họ",
                value: ""
            },
            email: {
                label: "Email",
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
            phoneNumber: {
                label: "SĐT",
                type: "phone",
                id: "phoneNumber",
                errors: {
                    required: {
                        error: false,
                        message: Config.ERROR_MESSAGE.PHONENUMBER_REQUIRED
                    },
                    format: {
                        error: false,
                        message: Config.ERROR_MESSAGE.PHONENUMBER_FORMAT
                    }
                },
                messageError: " ",
                placeHolder: "Nhập số điện thoại",
                value: ""
            }
        }
        this.getUserInfo();

    }



    getUserInfo() {
        var userInfo = ParseService.currentUser().attributes;
        if (userInfo) {
            this.profileConfig.firstName.value = userInfo.first_name;
            this.profileConfig.lastName.value = userInfo.last_name;
            this.profileConfig.email.value = userInfo.email || '';
            this.avatar = (userInfo.avatar && userInfo.avatar.url) ? userInfo.avatar.url() : '';
            this.profileConfig.phoneNumber.value = userInfo.phone_number || '';
            this.gender = userInfo.gender ? userInfo.gender : 'male';
            this.address = userInfo.address ? userInfo.address : '';
        }
        this.notifyPropertyChange('profileConfig', this.profileConfig);
        this.notifyPropertyChange('avatar', this.avatar);
        console.log(this.avatar)
    }

    updateUserInfo(res) {
        var self = this;
        ParseService.fetchCurrentUser()
            .then((res) => {
                Utils.hideLoadingIndicator();
                console.log(res);
                self.getUserInfo();
            })
            .catch((err) => {
                Utils.hideLoadingIndicator();
                console.log(err)
            })
    }

    goBack() {
        Utils.goBack();
    }

    checkInput(args) {
        validate.verifyInput(args.object.id, this, this.profileConfig, 'profileConfig');
    }

    onChooseGenderTap(args) {
        var gender = args.object.id;
        if (gender == 'male') {
            this.gender = "male";
        }
        else if (gender == 'female') {
            this.gender = "female";
        }
        this.notifyPropertyChange('gender', this.gender);
    }

    updateProfile(args) {
        var validated = true;
        var self = this;
        var txtFirstName = args.object.page.getViewById(this.profileConfig.firstName.id);
        var txtLastName = args.object.page.getViewById(this.profileConfig.lastName.id);
        var txtAddress = args.object.page.getViewById('addressTextView');
        var firstName;
        var lastName;
        var address;
        Utils.hideKeyboard([txtFirstName, txtLastName]);
        for (let i in this.profileConfig) {
            validated = validated && validate.verifyInput(this.profileConfig[i].id, this, this.profileConfig, 'profileConfig')
        }
        firstName = Utils.getValueOfTextField(txtFirstName);
        lastName = Utils.getValueOfTextField(txtLastName);
        address = Utils.getValueOfTextField(txtAddress);
        if (validated) {
            var req = {
                userInfo: {
                    first_name: firstName,
                    last_name: lastName,
                    email: this.profileConfig.email.value,
                    gender: this.gender,
                    phone_number: this.profileConfig.phoneNumber.value,
                    address: address,
                }
            }
            if (!Utils.checkInternetConnection()) {
                return;
            }
            Utils.showLoadingIndicator();
            ParseService.cloud('editProfile', req)
                .then((res: any) => {
                    return ParseService.fetchCurrentUser();
                })
                .then((res) => {
                    Utils.hideLoadingIndicator();
                    Utils.alert('success', "Thông báo", UPDATE_PROFILE_SUCCESS, "Đóng");
                    self.getUserInfo();
                })
                .catch((err) => {
                    Utils.hideLoadingIndicator();
                    console.log(err);
                    Utils.alert('error', "Thông báo", UPDATE_PROFILE_FAILED, "Đóng");
                })
        }
    }

    changeImage(args) {
        var dialogs = require("ui/dialogs");
        dialogs.action({
            cancelButtonText: "Hủy",
            actions: ["Chọn ảnh đại diện", "Chụp ảnh"]
        }).then((result) => {
            switch (result) {
                case 'Chọn ảnh đại diện':
                    this.takeImageFromGallery(args);
                    break;
                case 'Chụp ảnh':
                    this.takeImageFromCamera(args);
                    break;
                default:
                    break;
            }

        });
    }

    cropAndUpdateImage(imageSource) {
        var cropper = new icModule.ImageCropper();
        var self = this;
        cropper.show(imageSource, { width: 300, height: 300 })
            .then((args) => {
                if (args.image !== null) {
                    var imgBase64 = args.image.toBase64String('png', 50);
                    var data = {
                        userInfo: {
                            avatar: imgBase64
                        }
                    }
                    ParseService.cloud('editProfile', data)
                        .then((res: any) => {
                            return ParseService.fetchCurrentUser();
                        })
                        .then((res) => {
                            Utils.hideLoadingIndicator();
                            Utils.alert('success', "Thông báo", UPDATE_AVATAR_SUCCESS, "Đóng");
                            self.getUserInfo();
                        })
                        .catch((err) => {
                            Utils.hideLoadingIndicator();
                            console.log(err)
                            Utils.alert('error', "Thông báo", UPDATE_AVATAR_FAILED, "Đóng");
                        })
                }
            })
            .catch(function (e) {
                console.log(e);
            });
    }

    takeImageFromGallery(args) {
        var context = imagepicker.create({ mode: "single" });
        var self = this;
        context.authorize()
            .then(() => {
                return context.present();
            })
            .then((selection) => {
                selection[0].getImage()
                    .then((res) => {
                        this.cropAndUpdateImage(res);
                    })
                    .catch((err) => {
                        console.log("error: " + err);
                    })
            }).catch(function (e) {
                console.log(e);
            });
    }

    takeImageFromCamera(args) {
        cameraModule.requestPermissions();
        cameraModule.takePicture({ keepAspectRatio: true })
            .then((picture) => {
                imgSource.fromAsset(picture)
                    .then((res) => {
                        this.cropAndUpdateImage(res);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            })
            .catch(function (e) {
                console.dir(e);
            })
    }

    onChangePasswordTap() {
        Utils.navigate('pages/user/password-change/password-change', false, {});
    }
}