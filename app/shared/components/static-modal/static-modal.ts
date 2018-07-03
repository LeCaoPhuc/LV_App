import { EventData, Observable, fromObject } from 'data/observable';
import * as observable from "tns-core-modules/data/observable";
import * as pages from "tns-core-modules/ui/page";
import * as htmlViewModule from "tns-core-modules/ui/html-view";
import * as LabelModule from "tns-core-modules/ui/label";
import localStorage = require("nativescript-localstorage");
import { Config } from '../../env-config';
import { Utils, ParseService, ShareDataService } from '../../tools';
import platformModule = require("platform");
var page: pages.Page;
var context: any;
var closeCallback: Function;
var actionBarTitle: any;
var staticModalModel: any;

export function onLoaded(args) {
    page = <pages.Page>args.object;
    var htmlView = page.getViewById("htmlView");
    var type = ShareDataService.getData('staticModalType');
    switch (type) {
        case Config.STATIC_PAGE.PRIVACY_POLICY:
            page.getViewById("actionBar").notify({
                eventName: "actionBarTitleNotify",
                object: this,
                eventData: Config.TITLE.PRIVACY_POLICY_PAGE
            });
            break;
        case Config.STATIC_PAGE.FAQ:
            page.getViewById("actionBar").notify({
                eventName: "actionBarTitleNotify",
                object: this,
                eventData: Config.TITLE.FAQ_PAGE
            });
            break;
        default:
            actionBarTitle = '';
            break;
    }
    staticModalModel = new StaticModal(args.object._closeModalCallback, actionBarTitle)
    page.bindingContext = staticModalModel;

}

export function onShownModally(args: pages.ShownModallyData) {
    context = args.context;
    closeCallback = args.closeCallback;
}

export class StaticModal extends observable.Observable {
    private closeCallback: Function;
    private actionBarTitle: string;
    private screenWidth: number;
    private screenHeight: number;
    private content: any;
    constructor(_closeCallback: Function, title: string) {
        super();
        this.closeCallback = _closeCallback;
        this.actionBarTitle = title;
        this.content = [];
        this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
        this.screenHeight = platformModule.screen.mainScreen.heightDIPs - Utils.getSoftButtonHeight();
        // this.getStaticPage(ShareDataService.getData('staticModalType'));
        this.content = _content;
        Utils.showLoadingIndicator();
        this.getStaticPage();
    }

    goBack() {
        closeCallback();
    }

    getStaticPage() {
        var typeOfPage = ShareDataService.getData('staticModalType');
        var self =this;
        ParseService.cloud('getShopInfo', { })
            .then((res) => {
                if(res && res.success) {
                    if(res.data) {
                        var content = res.data.get(typeOfPage);
                         self.content = [];
                        for(var i in content) {
                            self.content.push(content[i]);
                        }
                        self.notifyPropertyChange('content',self.content);
                    }
                    else {
                        console.log(res.message);
                    }
                }
                else {
                    console.log(res.message);
                }
                Utils.hideLoadingIndicator();
                console.log(res)
            })
            .catch((err) => {
                console.log('getStaticPage - error - ',err.message);
            })
    }



}

var _content = {
"0":{
        "index":1,
        "header": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce scelerisque",
        "body":"Tellus integer feugiat scelerisque varius morbi enim nunc.",
        footer:"Ut etiam sit amet",
    },
    "1":{
        "index":2,
        "header": "Sagittis purus sit amet volutpat consequat mauris nunc congue.",
        "body": "In aliquam sem fringilla ut. Quis hendrerit dolor magna eget est lorem ipsum dolor. Facilisi morbi tempus iaculis urna id volutpat lacus laoreet non. Mi bibendum neque egestas congue quisque.",
        footer: "Dictum varius",
    },
    "2":{
        "index":3,
        "header":"Tincidunt eget nullam non nisi est",
        "body":"Risus nullam eget felis eget nunc lobortis mattis. Diam vel quam elementum pulvinar etiam non quam lacus. Mauris a diam maecenas sed enim ut sem. Vestibulum rhoncus est pellentesque elit. In est ante in nibh mauris cursus mattis. Lectus sit amet est placerat in egestas erat imperdiet. Sit amet mauris commodo quis imperdiet massa tincidunt.",
        "footer":"Vitae nunc sed",
    },
    "3":{
        "index":4,
        "header":"Gravida in fermentum",
        "body":"Massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada. Lacus viverra vitae congue eu consequat. Ultricies lacus sed turpis tincidunt id aliquet risus feugiat. Sollicitudin tempor id eu nisl. Morbi leo urna molestie at elementum eu facilisis sed",
        "footer":"Et ligula",
    }
}



