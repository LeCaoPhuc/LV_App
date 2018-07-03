import { EventData, fromObject } from 'data/observable';
import * as observable from "tns-core-modules/data/observable";
import * as pages from "tns-core-modules/ui/page";
import * as htmlViewModule from "tns-core-modules/ui/html-view";
import * as LabelModule from "tns-core-modules/ui/label";
import localStorage = require("nativescript-localstorage");
import { Config } from '../../shared/env-config';
import { Utils, httpRequest, verifyInput, ParseService } from '../../shared/tools';
import platformModule = require("platform");
import * as TimeDatePicker from 'nativescript-timedatepicker';
import app = require('application');
import { Color } from "tns-core-modules/color";
import { ShareDataService } from "../../shared/tools";
import { ObservableArray } from 'data/observable-array/observable-array';
import { AddressService } from "./address-service";

var ZXing = require('nativescript-zxing');
var imageSource = require('image-source');

const startTimeDelivery = 8;
const endTimeDelivery = 20;
const eachTimeDelivery = 2;
const delayTimeDelivery = 2;
const deliveryTaxExpress = 40000;
const deliveryTaxStandard = 0;

export class PaymentModal extends observable.Observable {
    private screenWidth: number;
    private screenHeight: number;
    private actionBarTitle: string;
    private address: any;
    private indexScreenShow: number;
    private price: any;
    private page: any;
    private cityList: ObservableArray<any>;
    private districtList: ObservableArray<any>;
    private communeList: ObservableArray<any>;
    private dropDownCity: any;
    private dropDownDistrict: any;
    private dropDownCommune: any;
    private paymentType: string;
    private infoConfig: any;
    private orderPrice: any;
    private currentUser : any;
    // variable check multi tap
    private isTapGoBack: boolean;
    constructor(page, orderPrice) {
        super();
        var self = this;
        this.page = page;
        this.orderPrice = orderPrice;
        this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
        this.screenHeight = platformModule.screen.mainScreen.heightDIPs - Utils.getSoftButtonHeight();
        this.isTapGoBack = false;
        this.actionBarTitle = 'Thanh Toán';
        this.page.getViewById("actionBar").notify({
            eventName: "actionBarTitleNotify",
            object: this,
            eventData: Config.TITLE.PAYMENT
        });
        this.dropDownCity = this.page.getViewById("dropDownCity");
        this.dropDownDistrict = this.page.getViewById("dropDownDistrict");
        this.dropDownCommune = this.page.getViewById("dropDownCommune");
        this.paymentType = "cod";
        this.indexScreenShow = 1;
        this.cityList = new ObservableArray(AddressService.getCityList());
        this.districtList = new ObservableArray();
        this.communeList = new ObservableArray();
        this.currentUser = ParseService.currentUser();
        this.infoConfig = {
            name: {
                label: "Họ tên",
                type: "name",
                id: "name",
                errors: {
                    required: {
                        error: false,
                        message: "Vui lòng nhập họ tên"
                    },
                    format: {
                        error: false,
                        message: "Họ và tên không đúng định dạng"
                    }
                },
                messageError: " ",
                placeHolder: "Nhập họ tên",
                value:  this.currentUser.get('first_name') + ' ' + this.currentUser.get('last_name')
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
                value: this.currentUser.get('email')
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
                value: this.currentUser.get('phone_number')
            },
            street: {
                label: "Đường",
                type: "phone",
                id: "street",
                errors: {
                    required: {
                        error: false,
                        message: "Vui lòng nhập địa chỉ"
                    }
                },
                messageError: " ",
                placeHolder: "Nhập địa chỉ",
                value: ""
            }
        }
    }

    onChangePaymentTypeTap(args) {
        var paymentType = args.object.paymentType;
        if (paymentType == this.paymentType) {
            return;
        }
        this.paymentType = paymentType;
        this.notifyPropertyChange('paymentType', this.paymentType);
    }

    onConfirmButtonTap(args) {
        var screenIndex = args.object.screenIndex;
        switch (screenIndex) {
            case "1":
                if (this.validateAllInput()) {
                    this.changeView(2);
                }
                break;
            case "2":
                this.changeView(3);
                this.address = {
                        city: this.cityList.getItem(this.dropDownCity.selectedIndex),
                        district: this.districtList.getItem(this.dropDownDistrict.selectedIndex),
                        commune: this.communeList.getItem(this.dropDownCommune.selectedIndex),
                        street: this.infoConfig.street.value,
                        name: this.infoConfig.name.value,
                        telephone: this.infoConfig.phoneNumber.value,
                        email: this.infoConfig.email.value,
                        fullAddress:  this.infoConfig.street.value + ', ' + this.communeList.getItem(this.dropDownCommune.selectedIndex) + ', ' +  this.districtList.getItem(this.dropDownDistrict.selectedIndex) + ', ' +this.cityList.getItem(this.dropDownCity.selectedIndex)
                    };
                this.notifyPropertyChange('address',this.address);
                break;
            case "3":
                this.checkOut(args);
                break;
            default:
                console.log('Payment - onConfirmButtonTap Error');
                break;
        }
    }

    validateAllInput() {
        var validated = true;
        for (let i in this.infoConfig) {
            validated = verifyInput(this.infoConfig[i].id, this, this.infoConfig, "infoConfig") && validated;
        }
        if (validated) {
            if (!this.dropDownCity.selectedIndex && this.dropDownCity.selectedIndex != 0) {
                validated = false;
                Utils.alert('notice', 'Thông Báo', 'Vui lòng chọn tỉnh/thành phố', 'Đóng');
            }
            else if (!this.dropDownDistrict.selectedIndex && this.dropDownDistrict.selectedIndex != 0) {
                validated = false;
                Utils.alert('notice', 'Thông Báo', 'Vui lòng chọn quận/huyện', 'Đóng');
            }
            else if (!this.dropDownCommune.selectedIndex && this.dropDownCommune.selectedIndex != 0) {
                validated = false;
                Utils.alert('notice', 'Thông Báo', 'Vui lòng chọn phường/xã', 'Đóng');
            }
        }
        return validated;
    }

    validateInput(args) {
        verifyInput(args.object.id, this, this.infoConfig, "infoConfig");
    }

    changeView(screenIndex) {
        var self = this;
        var viewNeedToHide = this.page.getViewById(`screen-${this.indexScreenShow}`);
        var viewNeedToShow = this.page.getViewById(`screen-${screenIndex}`);
        viewNeedToHide.class = "animationHide";
        setTimeout(function () {
            self.indexScreenShow = screenIndex;
            self.notifyPropertyChange("indexScreenShow", self.indexScreenShow);
            viewNeedToShow.class = "animationShow";
        }, 350);
    }


    goBack() {
        if (this.isTapGoBack) {
            return;
        }
        else {
            switch (this.indexScreenShow) {
                case 3:
                    this.changeView(2);
                    break;
                case 2:
                    this.changeView(1);
                    break;
                case 1:
                    Utils.goBack();
                    break;
                default:
                    Utils.goBack();
                    break;
            }
        }
    }

    checkOut(args) {
        var listItemsInCart = localStorage.getItem('listItemsInCart');
        var data = {
            address: {
                city: this.cityList.getItem(this.dropDownCity.selectedIndex),
                district: this.districtList.getItem(this.dropDownDistrict.selectedIndex),
                commune: this.communeList.getItem(this.dropDownCommune.selectedIndex),
                street: this.infoConfig.street.value,
                name: this.infoConfig.name.value,
                telephone: this.infoConfig.phoneNumber.value,
                email: this.infoConfig.email.value
            },
            items: [],
            payment_type: this.paymentType,
        }
        for (let i in listItemsInCart) {
            data.items.push({
                id: listItemsInCart[i].productId,
                qty: listItemsInCart[i].quantity
            })
        }
        Utils.showLoadingIndicator();
        ParseService.cloud('order', data)
            .then((res) => {
                var listItemsInCart = localStorage.getItem('listItemsInCart');
                for (let i in listItemsInCart) {
                    Utils.changeQuantityOfProductInCart(listItemsInCart[i].productId, 0, null);
                }
                localStorage.setItem('listItemsInCart', {});
                if (this.paymentType == 'local') {
                    var imgQRCode: any = this.page.getViewById('QRCode');
                    var zx = new ZXing();
                    setTimeout(function () {
                        var img = zx.createBarcode({
                            encode: res.data.orderInfo.id,
                            height: 500,
                            width: 500,
                            format: ZXing.QR_CODE
                        });
                        imgQRCode.imageSource = imageSource.fromNativeSource(img);
                        Utils.hideLoadingIndicator();
                    }, 400);
                }
                else {
                    Utils.hideLoadingIndicator();
                }
                this.changeView(4);
            })
            .catch((err) => {
                Utils.hideLoadingIndicator();
                console.log(err);
                Utils.alert('error', 'Thông Báo', 'Xảy ra lỗi trong quá trình thanh toán.', 'Đóng');
            })
    }

    dropDownCityListChanged(args) {
        var cityName = this.cityList.getItem(args.newIndex);
        this.districtList = new ObservableArray(AddressService.getDistrictList(cityName));
        this.communeList = new ObservableArray();
        this.notifyPropertyChange('districtList', this.districtList);
        this.notifyPropertyChange('communeList', this.communeList);
        this.dropDownDistrict.selectedIndex = null;
    }

    dropDownDistrictListChanged(args) {
        var districtName = this.districtList.getItem(args.newIndex);
        var cityName = this.cityList.getItem(this.dropDownCity.selectedIndex);
        this.communeList = new ObservableArray(AddressService.getCommuneList(cityName, districtName));
        this.notifyPropertyChange('communeList', this.communeList);
        this.dropDownCommune.selectedIndex = null;
    }

    onOutSideTap(args) {
        // var page = args.object.page;
        // var companyNameTF = page.getViewById(this.VATBillConfig.companyName.id);
        // var taxNumberTF = page.getViewById(this.VATBillConfig.taxNumber.id);
        // var companyAddressTF = page.getViewById(this.VATBillConfig.companyAddress.id);
        // var listTF = [];
        // if (companyNameTF) {
        //     listTF.push(companyNameTF);
        // }
        // if (taxNumberTF) {
        //     listTF.push(taxNumberTF);
        // }
        // if (companyAddressTF) {
        //     listTF.push(companyAddressTF);
        // }
        // Utils.hideKeyboard(listTF);
    }
}
