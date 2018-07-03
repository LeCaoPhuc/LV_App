import { EventData, fromObject } from 'data/observable';
import * as observable from "tns-core-modules/data/observable";
import * as pages from "tns-core-modules/ui/page";
import * as htmlViewModule from "tns-core-modules/ui/html-view";
import * as LabelModule from "tns-core-modules/ui/label";
import localStorage = require("nativescript-localstorage");
import { Config } from '../../shared/env-config';
import { Utils, httpRequest, verifyInput } from '../../shared/tools';
import platformModule = require("platform");
import * as TimeDatePicker from 'nativescript-timedatepicker';
import app = require('application');
import enums = require("ui/enums");
import { Color } from "tns-core-modules/color/color";
import { PaymentModal } from "./payment.model";
import { ShareDataService } from "../../shared/tools";


var page: pages.Page;   
var closeCallback: Function;
var item: any;


export function navigatingTo(args) {
    args.object.bindingContext = new PaymentModal(args.object.page, args.context);
}

export function onLoaded(args) {
    Utils.hideLoadingIndicator();
    args.object.page.getViewById("actionBar").notify({
        eventName: "actionBarTitleNotify",
        object: this,
        eventData: Config.TITLE.PAYMENT
    });
}

export function onScrollViewLoaded(args) {
    Utils.hideScrollViewBar(args.object)
}


