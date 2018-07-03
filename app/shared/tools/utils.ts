import app = require("application");
import frames = require("ui/frame");
import * as Toast from 'nativescript-toast';
import { Error } from "./error";
import { Page } from "ui/page";
import { Config } from '../env-config';
import * as utils from "utils/utils";
import * as Connectivity from "connectivity";
import dialogs = require("ui/dialogs");
import { BarcodeScanner } from 'nativescript-barcodescanner';
import { ShareDataService } from "./share-data-service";
import { SliderControl } from './';
import { TNSFancyAlert, TNSFancyAlertButton } from 'nativescript-fancyalert';

var CryptoJS = require('../libs/crypto').CryptoJS;
var frame = require('ui/frame');
const pageCommon = require("ui/page/page-common").PageBase;
var LoadingIndicator = require("nativescript-loading-indicator").LoadingIndicator;
var page = new Page();
declare var android: any;
var loader = new LoadingIndicator();
var barcodescanner = new BarcodeScanner();
var oldMissingSize = 0;
var optionsIndicator = {
    message: 'Đang tải...',
};

if (app.ios) {
    TNSFancyAlert.backgroundType = TNSFancyAlert.BACKGROUND_TYPES.Shadow;
}
TNSFancyAlert.shouldDismissOnTapOutside = false;

export class Utils {

    public static SpotsDialog;

    /**
     * Set number keyboard for TextField
     * @param textField 
     * @param isSecure optional, only for android(default is false)
     */
    public static setNumberKeyboardInputForTextField(textField: any, isSecure?: boolean) {
        var inputType;
        isSecure = !!isSecure;
        if (!textField) {
            return;
        }
        if (app.android) {
            inputType = (isSecure) ? (android.text.InputType.TYPE_CLASS_NUMBER | android.text.InputType.TYPE_NUMBER_VARIATION_PASSWORD) : android.text.InputType.TYPE_CLASS_NUMBER;
            textField._setInputType(inputType);
        }
        else {
            // In iOS, keyboardType = 4 is numberPad
            textField.nativeView.keyboardType = 4;
        }
    }

    public static hideScrollViewBar(scrollView: any) {
        if (app.android) {
            scrollView.android.setVerticalScrollBarEnabled(false);
        }
        else {
            scrollView.ios.showsVerticalScrollIndicator = false;
        }
    }

    public static customPrice(price) {
        var firstPrice = "";
        var lastPrice = "";
        if (price.length > 3) {
            firstPrice = price.substr(0, price.length - 3);
            firstPrice = this.numberToFormatedString(firstPrice) + '.';
            lastPrice = price.substr(price.length - 3);
        }
        else {
            firstPrice = price;
            lastPrice = "0";
        }
        return {
            firstPrice: firstPrice,
            lastPrice: lastPrice
        }
    }

    public static numberToFormatedString(num: any) {
        var str = num.toString();
        var result: string = '';
        var count = -1;
        for (let i = str.length - 1; i > -1; i--) {
            count++;
            if (count != 0 && count % 3 == 0) {
                result = '.'.concat(result);
            }
            result = str[i].concat(result);
        }
        return result;
    }

    public static getSoftButtonHeight() {
        var softButtonHeight = 0;
        if (app.android) {
            var context = utils.ad.getApplicationContext();
            var metrics = new android.util.DisplayMetrics();
            var windowManager = context.getSystemService(android.content.Context.WINDOW_SERVICE);
            windowManager.getDefaultDisplay().getMetrics(metrics);
            var usableHeight = metrics.heightPixels / metrics.density;
            windowManager.getDefaultDisplay().getRealMetrics(metrics);
            var realHeight = metrics.heightPixels / metrics.density;
            softButtonHeight = realHeight - usableHeight;
            return softButtonHeight;
        }
        else {
            return softButtonHeight;
        }
    }

    public static clearConfig(config) {
        for (var i in config) {
            if (config[i].errors) {
                for (var error of config[i].errors) {
                    error.error = false;
                }
            }
            if (config[i].error) config[i].error = false;
            if (config[i].value) config[i].value = '';
            if (config[i].messageError) config[i].messageError = ' ';
        }
    }

    public static checkInternetConnection() {
        if (Connectivity.getConnectionType() == Connectivity.connectionType.none) {
            dialogs.alert({
                title: "Không thể kết nối",
                message: Config.ERROR_MESSAGE.NO_INTERNET_CONNECTION,
                okButtonText: "OK"
            });
            return false;
        }
        return true;
    }

    public static hideKeyboard(txtArray?) {
        if (app.android) {
            try {
                let activity = app.android.foregroundActivity;
                let Context = app.android.currentContext;
                let inputManager = Context.getSystemService(android.content.Context.INPUT_METHOD_SERVICE);
                inputManager.hideSoftInputFromWindow(activity.getCurrentFocus().getWindowToken(), android.view.inputmethod.InputMethodManager.HIDE_NOT_ALWAYS);
            }
            catch (ex) {

            }
        }
        else if (app.ios) {
            for (var txtItem in txtArray) {
                // txtArray[txtItem].ios.endEditing(true);
                txtArray[txtItem].ios.resignFirstResponder();

            }
        }
    }

    public static navigate(path: string, clearHistory?: boolean, data?: any, transitionOption?: any) {
        if (path) {
            try {
                if (app.ios) {
                    frames.topmost().navigate({
                        moduleName: path,
                        context: data || '',
                        animated: true,
                        clearHistory: clearHistory || false
                    })
                }
                else {
                    if (!transitionOption) {
                        transitionOption = {
                            name: "slide",
                            duration: 250,
                            curve: "ease"
                        }
                    }
                    frames.topmost().navigate({
                        moduleName: path,
                        context: data || '',
                        animated: true,
                        clearHistory: clearHistory || false,
                        transition: transitionOption
                    })
                }

            }
            catch (ex) {
                console.log(ex);
            }
        }
    }

    public static goBack(BackstackEntry?) {
        try {
            if (BackstackEntry)
                frames.topmost().goBack(BackstackEntry);
            else
                frames.topmost().goBack();
        } catch (ex) {
            console.log(ex);
        }
    }

    public static hideStatusBar() {
        if (app.android)
            app.android.startActivity.getWindow().addFlags(android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN);
        else
            UIApplication.sharedApplication.statusBarHidden = true;
    }

    public static showStatusBar() {
        if (app.android)
            app.android.startActivity.getWindow().addFlags(android.view.WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
        else
            UIApplication.sharedApplication.statusBarHidden = false;
    }

    public static showModal(page: any, path: string, closeModalCallBack: Function, fullsreen: boolean, context?: any, ) {
        if (path && page) {
            try {
                if (app.android) {
                    var modal = page.showModal(path, context || {}, closeModalCallBack, fullsreen);
                    modal.opacity = 0.7;
                    modal.animate({
                        opacity: 1,
                        duration: 700
                    });
                }
                else {
                    // var modal = page.showModal(path, context || {}, closeModalCallBack, fullsreen);
                    var modal = page.showModal(path, context || {}, closeModalCallBack, fullsreen);
                    modal.opacity = 0.7;
                    modal.animate({
                        opacity: 1,
                        duration: 700
                    });
                }
            } catch (ex) {
                console.log("Error showModal Utils: " + ex);
            }
        } else {
            console.log("Error showModal Utils");
        }
    }

    public static toastAlert(message) {
        Toast.makeText(message, "short").show();
    }

    public static showLoadingIndicator() {
        if (app.android) {
            if (!Utils.SpotsDialog) {
                Utils.SpotsDialog = new dmax.dialog.SpotsDialog(app.android.foregroundActivity, "Đang tải...", com.nativescript.handmademarket.R.style.Custom);
                Utils.SpotsDialog.getWindow().setDimAmount(0.9);
            }
            Utils.SpotsDialog.show();
        }
        else {
            loader.show(optionsIndicator);
        }
    }

    public static hideLoadingIndicator() {
        if (app.android) {
            if (!Utils.SpotsDialog) return;
            Utils.SpotsDialog.dismiss();
        }
        else {
            loader.hide();
        }
    }

    public static transparentModalIOS() {
        if (app.ios) {
            Page.prototype._showNativeModalView = function (parent, context, closeCallback, fullscreen) {
                pageCommon.prototype._showNativeModalView.call(this, parent, context, closeCallback, fullscreen);
                let that = this;
                this._modalParent = parent;
                if (!parent.ios.view.window) {
                    throw new Error('Parent page is not part of the window hierarchy. Close the current modal page before showing another one!');
                }
                if (fullscreen) {
                    this._ios.modalPresentationStyle = 0;
                } else {
                    this._ios.modalPresentationStyle = 2;
                    this._UIModalPresentationFormSheet = true;
                }
                pageCommon.prototype._raiseShowingModallyEvent.call(this);
                this._ios.providesPresentationContextTransitionStyle = true;
                this._ios.definesPresentationContext = true;
                this._ios.modalPresentationStyle = UIModalPresentationOverFullScreen;
                this._ios.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
                this._ios.view.backgroundColor = UIColor.clearColor;
                parent.ios.presentViewControllerAnimatedCompletion(this._ios, false, function completion() {
                    that._ios.modalPresentationStyle = UIModalPresentationCurrentContext;
                    that._raiseShownModallyEvent(parent, context, closeCallback);
                });
            }
        }
    }

    public static turnOffAnimateParentModalIOS() {
        if (app.ios) {
            Page.prototype._hideNativeModalView = function (parent) {
                parent.requestLayout();
                parent._ios.dismissModalViewControllerAnimated(false);
                pageCommon.prototype._hideNativeModalView.call(parent);
            }
        }
    }

    public static fixCrashModalAndroid() {
        if (app.android) {
            Page.prototype._hideNativeModalView = function (parent) {
                try {
                    this._dialogFragment.dismissAllowingStateLoss();
                    this._dialogFragment = null;
                    parent._modal = undefined;
                    pageCommon.prototype._hideNativeModalView.call(this, parent);
                } catch (error) {

                }
            };
        }
    }

    public static scanBarCode(page: any, callBackFunction: Function, closeCallbackFunction?: Function, buttonMaunalText?: string) {
        if (!closeCallbackFunction) {
            closeCallbackFunction = function () { console.log('close scan modal'); };
        }
        if (!buttonMaunalText) {
            buttonMaunalText = 'Nhập mã barcode';
        }
        localStorage.setItem('buttonMaunalText', buttonMaunalText);
        barcodescanner.hasCameraPermission()
            .then((permitted) => {
                if (permitted) {
                    page.showModal('shared/components/scan-modal/scan-modal', callBackFunction, closeCallbackFunction, (!!app.ios));
                }
                else {
                    barcodescanner.requestCameraPermission()
                        .then(() => {
                            page.showModal('shared/components/scan-modal/scan-modal', callBackFunction, closeCallbackFunction, (!!app.ios));

                        })
                        .catch((err) => {
                            dialogs.alert({
                                title: "Thông Báo",
                                message: "Vui lòng cho phép ứng dụng truy cập Camera để sử dụng tính năng quét barcode.",
                                okButtonText: "Trở lại"
                            });
                        })
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    public static assign(obj) {
        var newObj: any = {};
        for (var i in obj) {
            newObj[i] = obj[i];
        };
        return newObj;
    }

    public static resizeImage(context, image, width, height) {
        if (app.android) {
            var picasso = com.squareup.picasso.Picasso.with(context);
            var builder = picasso.load(image.imageUri);
            builder.resize(width, height);
            builder.into(image.android)
        }
    }

    public static encodeURLHTTP(url) {
        if (url) {
            var newURL = encodeURI(url)
            return newURL;
        }
        else {
            return url;
        }
    }

    public static getValueOfTextField(textField) {
        if (!textField) {
            return '';
        }
        else {
            if (app.ios) {
                return textField.ios.text;
            }
            else {
                return textField.text;
            }
        }
    }

    public static lengthOfObject(obj) {
        return Object.keys(obj).length;
    }

    public static changeQuantityOfProductInCart(productId, newQuantity, page) {
        var self = this;
        var cacheCategoryProductList = ShareDataService.getData("cacheDepartmentData");
        var syncCategoryList = new Promise(function (resolve, reject) {
            if (cacheCategoryProductList) {
                for (var item in cacheCategoryProductList) {
                    if (cacheCategoryProductList[item]) {
                        for (var i = 1; i <= self.lengthOfObject(cacheCategoryProductList[item]); i++) {
                            if (cacheCategoryProductList[item][i] && cacheCategoryProductList[item][i].productArr) {
                                for (var j = 0; j < cacheCategoryProductList[item][i].productArr.length; j++) {
                                    if (cacheCategoryProductList[item][i].productArr[j].productItems) {
                                        for (var k = 0; k < cacheCategoryProductList[item][i].productArr[j].productItems.length; k++) {
                                            if (cacheCategoryProductList[item][i].productArr[j].productItems[k]) {
                                                if (cacheCategoryProductList[item][i].productArr[j].productItems[k].productId == productId) {
                                                    cacheCategoryProductList[item][i].productArr[j].productItems[k].quantity = newQuantity;
                                                    var centerSlide = SliderControl.sliderCenter.id;
                                                    if (page && page.getViewById("departmentSlider") && page.getViewById("departmentSlider").bindingContext) {
                                                        if (centerSlide == "secondSlider") {
                                                            page.getViewById("departmentSlider").bindingContext.notifyPropertyChange("secondProductList", cacheCategoryProductList[item][i].productArr);
                                                        }
                                                        else {
                                                            if (centerSlide == "thirdSlider") {
                                                                page.getViewById("departmentSlider").bindingContext.notifyPropertyChange("thirdProductList", cacheCategoryProductList[item][i].productArr);
                                                            }
                                                            else {
                                                                page.getViewById("departmentSlider").bindingContext.notifyPropertyChange("firstProductList", cacheCategoryProductList[item][i].productArr);
                                                            }
                                                        }
                                                    }
                                                    else {

                                                    }
                                                }
                                            }
                                            else {
                                                continue;
                                            }
                                        }
                                    }
                                    else {
                                        continue
                                    }
                                }
                            }
                            else {
                                continue;
                            }
                        }
                    }
                    else {

                    }
                }
            }
        })
        var syncOtherList = new Promise(function (resolve, reject) {
            var cacheOtherProductList = ShareDataService.getData("cacheOtherDepartmentData");
            if (cacheOtherProductList) {
                console.log("Have Product intoCart");
                for (var i = 1; i <= self.lengthOfObject(cacheOtherProductList); i++) {
                    if (cacheOtherProductList[i] && cacheOtherProductList[i].productArr) {
                        for (var j = 0; j < cacheOtherProductList[i].productArr.length; j++) {
                            if (cacheOtherProductList[i].productArr[j].productItems) {
                                for (var k = 0; k < cacheOtherProductList[i].productArr[j].productItems.length; k++) {
                                    if (cacheOtherProductList[i].productArr[j].productItems[k]) {
                                        if (cacheOtherProductList[i].productArr[j].productItems[k].productId == productId) {
                                            cacheOtherProductList[i].productArr[j].productItems[k].quantity = newQuantity;
                                        }
                                    }
                                    else {
                                        continue;
                                    }
                                }
                            }
                            else {
                                continue
                            }
                        }
                    }
                    else {
                        continue;
                    }
                }
            }
            else {
                console.log("Don't Have Product intoCart");
            }
        });
        var promiseArr = [syncCategoryList, syncOtherList];
        Promise.all(promiseArr)
            .then((res) => {
                console.log("promise All changeQuantityOfProductInCart complete - utils.ts");
            })
            .catch((err) => {
                console.log("Error promise All changeQuantityOfProductInCart - utils.ts", err);
            })

    }

    /**
     * 
     * @param type : success, error, warning, notice
     * @param titleText 
     * @param contentText 
     * @param closeBtnText 
     */
    public static alert(type: string, titleText: string, contentText: string, closeBtnText: string) {
        switch (type) {
            case 'success':
                return TNSFancyAlert.showSuccess(titleText, contentText, closeBtnText);
            case 'error':
                return TNSFancyAlert.showError(titleText, contentText, closeBtnText);
            case 'warning':
                return TNSFancyAlert.showWarning(titleText, contentText, closeBtnText);
            case 'notice':
                return TNSFancyAlert.showNotice(titleText, contentText, closeBtnText);
            case 'info':
                return TNSFancyAlert.showInfo(titleText, contentText, closeBtnText);
            default:
                console.log('Utils.alert ERROR: invalid type param');
                break;
        }
    }
}

