import { EventData } from 'data/observable';
import * as observable from "tns-core-modules/data/observable";
import * as pages from "tns-core-modules/ui/page";
import * as htmlViewModule from "tns-core-modules/ui/html-view";
import * as LabelModule from "tns-core-modules/ui/label";
import localStorage = require("nativescript-localstorage");
import { Config } from '../../env-config';
import { Utils, Product, httpRequest } from '../../tools';
import platformModule = require("platform");
import app = require('application');
var page: pages.Page;
var context: any;
var closeCallback: Function;
var background: any;
Utils.transparentModalIOS();

export function onLoaded(args) {
    page = <pages.Page>args.object;
    var product = {
        productId: '1',
        productName: 'Cà chua loại 1',
        productImageList: ['~/images/tomato'],
        productFinalPrice: '200000',
        productOriginalPrice: '200000',
        productIsSalable: true,
        productIsFresh: true,
    }
    page.bindingContext = new ScaleModal(args.object._modalContext.productId);
}

export function onShownModally(args: pages.ShownModallyData) {
    closeCallback = args.closeCallback;
}

export function goBack() {
    closeCallback(0);
}

export class ScaleModal extends observable.Observable {
    private product: any;
    private quantity: number;
    private disableButton: number;
    private minQuantity: number;
    private screenWidth: number;
    private screenHeight: number;
    private price: any = {
        value: 0,
        display: '',
    };

    constructor(productId) {
        super();
        this.minQuantity = 50;
        this.quantity = this.minQuantity;
        // this.calcPrice();
        this.callAPIToGetProductDetails(productId);
        this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
        this.screenHeight = platformModule.screen.mainScreen.heightDIPs - Utils.getSoftButtonHeight();
    }

    callAPIToGetProductDetails(productId) {
        var warehouseId = localStorage.getItem("warehouseInfo") ? localStorage.getItem("warehouseInfo").id : 49;
        var self = this;
        if (!Utils.checkInternetConnection()) {
            return;
        }
        Utils.showLoadingIndicator();
        httpRequest.get(`scanngo_v1/warehouse/${warehouseId}/product/id/${productId}`, localStorage.getItem('accessToken'))
            // httpRequest.get(`scanngo_v1/warehouse/${warehouseId}/product/id/1962`, localStorage.getItem('accessToken'))
            .then((res: any) => {
                Utils.hideLoadingIndicator();
                if (res.statusCode == 200 && res.content.toJSON().success) {
                    res = res.content.toJSON();
                    var product = new Product(res.data);
                    console.log('sjsjsj');
                    self.product = product;
                    self.calcPrice();
                    var minQty = res.data.min_order_qty ? parseInt(res.data.min_order_qty) : 1;
                    if (minQty > 1) {
                        self.disableButton = 5; // disable 4 btn
                    }
                    else if (minQty == 1) {
                        self.disableButton = 4; // enable 1KG btn
                    }
                    else if (minQty < 1 && minQty >= 0.75) {
                        self.disableButton = 3; // enable 0.75KG 1KG btn
                    }
                    else if (minQty < 0.75 && minQty >= 0.5) {
                        self.disableButton = 2; // enable 0.5KG 0.75KG 1KG btn
                    }
                    else {
                        self.disableButton = 1; // enable 0.25KG 0.5KG 0.75KG 1KG btn
                    }
                    if (res.data.selling_u_m == "KG" || res.data.selling_u_m == "kg") {
                        self.minQuantity = minQty * 1000;
                        self.quantity = self.minQuantity;
                        self.notifyPropertyChange('quantity', self.quantity);
                        self.calcPrice();
                    }
                    else {
                        console.log('------ res.data.selling_u_m: ' + res.data.selling_u_m);
                    }
                    self.notifyPropertyChange('product', self.product);
                    self.notifyPropertyChange('disableButton', self.disableButton);
                }
            })
            .catch((err) => {
                Utils.hideLoadingIndicator();
                console.log('get product details error: ' + err);
            })
    }

    onTapPlusButton(args) {
        this.quantity += this.minQuantity;
        this.notifyPropertyChange('quantity', this.quantity);
        this.calcPrice();
    }

    onTapMiniusButton(args) {
        if (this.quantity == this.minQuantity) {
            return;
        }
        else {
            this.quantity -= this.minQuantity;
            this.notifyPropertyChange('quantity', this.quantity);
            this.calcPrice();
        }
    }

    calcPrice() {
        this.price.value = Math.round((this.quantity / 1000) * parseInt(this.product.productFinalPrice));
        this.price.display = Utils.numberToFormatedString(this.price.value);
        this.notifyPropertyChange("price", this.price);
        console.log(this.price.value + ' - ' + this.price.display);
    }

    onTapQuarterButton(args) {
        if (this.disableButton <= 1) {
            var img = args.object;
            if (args.action == "down") {
                img.src = 'res://icon_scale_quarter_disable';
            }
            else if (args.action == "up" || args.action == "cancel") {
                img.src = 'res://icon_scale_quarter';
                this.quantity = 250;
                this.notifyPropertyChange('quantity', this.quantity);
                this.calcPrice();
            }
            else {
                return;
            }
        }
    }

    onTapHalfButton(args) {
        if (this.disableButton <= 2) {
            var img = args.object;
            if (args.action == "down") {
                img.src = 'res://icon_scale_half_disable';
            }
            else if (args.action == "up" || args.action == "cancel") {
                img.src = 'res://icon_scale_half';
                this.quantity = 500;
                this.notifyPropertyChange('quantity', this.quantity);
                this.calcPrice();
            }
            else {
                return;
            }
        }
    }

    onTapThreeQuarterButton(args) {
        if (this.disableButton <= 3) {
            var img = args.object;
            if (args.action == "down") {
                img.src = 'res://icon_scale_three_quarter_disable';
            }
            else if (args.action == "up" || args.action == "cancel") {
                img.src = 'res://icon_scale_three_quarter';
                this.quantity = 750;
                this.notifyPropertyChange('quantity', this.quantity);
                this.calcPrice();
            }
            else {
                return;
            }
        }
    }

    onTapOneKgButton(args) {
        if (this.disableButton <= 4) {
            var img = args.object;
            if (args.action == "down") {
                img.src = 'res://icon_scale_1kg_disable';
            }
            else if (args.action == "up" || args.action == "cancel") {
                img.src = 'res://icon_scale_1kg';
                this.quantity = 1000;
                this.notifyPropertyChange('quantity', this.quantity);
                this.calcPrice();
            }
            else {
                return;
            }
        }
    }

    confirm() {
        closeCallback(this.quantity / 1000);
    }
}