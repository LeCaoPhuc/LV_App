import { EventData } from 'data/observable';
import * as observable from "tns-core-modules/data/observable";
import * as pages from "tns-core-modules/ui/page";
import * as htmlViewModule from "tns-core-modules/ui/html-view";
import * as LabelModule from "tns-core-modules/ui/label";
import { Color } from "color";
import localStorage = require("nativescript-localstorage");
import { BarcodeScanner } from 'nativescript-barcodescanner';
import { Config } from '../../env-config';
import { Utils, ShareDataService } from "../../tools";
import platformModule = require("platform");
import app = require('application');

declare var CGSizeMake: any;
var page: pages.Page;
var contextFunction: Function;
var closeCallback: Function;
var textTitle: any;
var htmlView: any;
var type: any;
var scanModal: any;

const DELAY_TIME_SCAN_PRODUCT = 10000;

export function onLoaded(args: observable.EventData) {
    page = <pages.Page>args.object;
    scanModal = new ScanModal(page);
    page.bindingContext = scanModal;
}

export function onShownModally(args: pages.ShownModallyData) {
    contextFunction = args.context;
    closeCallback = args.closeCallback;
}

export function goBack() {
    scanModal.stopInterval();
    closeCallback();
}

export function goBackAndTypeBarCode() {
    try {
        scanModal.stopInterval();
        closeCallback();
        contextFunction('', true);
    } catch (error) {
        console.log('Scan barcode modal ERROR: goBackAndTypeBarCode function ' + error);
    }
    
}

export function creatingView(args) {
    var barcodescanner = new BarcodeScanner();
    barcodescanner.scan({
        formats: "CODE_39, CODE_93, CODE_128, DATA_MATRIX, EAN_8, EAN_13, UPC_E, ITF",
        message: " ", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
        showFlipCameraButton: false,   // default false
        preferFrontCamera: false,     // default false
        showTorchButton: false,        // default false
        beepOnScan: false,             // Play or Suppress beep on scan (default true)
        torchOn: false,               // launch with the flashlight on (default false)
        closeCallback: () => {
            // close modal for IOS
            scanModal.stopInterval();
            closeCallback();
        },
        resultDisplayDuration: 500,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
        openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
    }, args)
        .then((res) => {
            var app = require("application");
            if (app.android) {
                // close modal for Android
                scanModal.stopInterval();
                closeCallback();
            }
            contextFunction(res.text, false);
        })
        .catch((err) => {
            console.log(err);
        })
}

export class ScanModal extends observable.Observable {
    private screenWidth: number;
    private buttonMaunalText: string;
    private interval: any;
    private redLineIOS: any;
    private timerCloseScanProduct: any;
    constructor(page) {
        super();
        var self = this;
        this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
        this.buttonMaunalText = localStorage.getItem('buttonMaunalText');
        this.redLineIOS = page.getViewById('redLine');
        setTimeout(function () {
            self.startInterval();
        }, 200);
        
    }

    startInterval() {
        if (app.ios) {
            // animation for ios
            scanModal.interval = setInterval(function () {
                scanModal.redLineIOS.opacity = 1;
                setTimeout(function () {
                    scanModal.redLineIOS.opacity = 0;
                }, 400);
            }, 800)
        }
        if (ShareDataService.getData('isScanBarCodeProduct')) {
            // close modal after 10s
            ShareDataService.setData('isScanBarCodeProduct', false);
            scanModal.timerCloseScanProduct = setTimeout(function() {
                goBackAndTypeBarCode();
            }, DELAY_TIME_SCAN_PRODUCT);
        }
        
    }

    stopInterval() {
        if (app.ios) {
            clearInterval(scanModal.interval);
        }
        clearTimeout(scanModal.timerCloseScanProduct);
    }
}