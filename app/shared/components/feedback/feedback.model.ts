import { Observable } from "data/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Utils, httpRequest, Error } from "../../../shared/tools";
import validate = require('../../../shared/tools/validate');
import { Config } from '../../../shared/env-config';
import platformModule = require("platform");
var localStorage = require("nativescript-localstorage");

export class CommentModel extends Observable {
    private actionBarTitle;
    private closeCallback: Function;
    private screenWidth: number;
    private screenHeight: number;
    private feedbackConfig: any;
    private page;
    private warehouseInfo: any;
    constructor(page, context, closeCallback) {
        super();
        this.page = page;
        this.actionBarTitle = Config.TITLE.COMMENT;
        this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
        this.screenHeight = platformModule.screen.mainScreen.heightDIPs - Utils.getSoftButtonHeight();
        this.closeCallback = closeCallback;
        this.feedbackConfig = {
            title: {
                label: "title",
                type: "",
                id: "title",
                errors: {
                   required: {
                        error: false,
                        message: Config.ERROR_MESSAGE.TITLE_REQUIRED
                    }
                },
                messageError: " ",
                placeHolder: "Nhập tiêu đề phản hồi",
                value: ""
            },
            content: {
                label: "Nội dung phản hồi",
                type: "",
                id: "content",
                errors: {
                   required: {
                        error: false,
                        message: Config.ERROR_MESSAGE.CONTENT_REQUIRED
                    }
                },
                messageError: " ",
                placeHolder: "Nhập nội dung phản hồi",
                value: ""
            }
        };
        this.page.getViewById("actionBar").notify({
            eventName: "actionBarTitleNotify",
            object: this,
            eventData: Config.TITLE.COMMENT
        });
    }

    checkInput(args) {
        validate.verifyInput(args.object.id, this, this.feedbackConfig, 'feedbackConfig');
    }

    onKeyboard(args) {
        console.log("onKeyboard");
    }

    onTapSendFeedback(args) {
        console.log("onTapSendFeedback");
        var validated = true;
        var self = this;
        for (let i in this.feedbackConfig) {
            validated = validated && validate.verifyInput(this.feedbackConfig[i].id, this, this.feedbackConfig, 'feedbackConfig');
        }
        if (validated) {
            // Utils.showLoadingIndicator();
            // httpRequest.post("scanngo_v1/feedback",{
            //     "subject": Utils.getValueOfTextField(this.page.getViewById(this.feedbackConfig.title.id)),
            //     "warehouse_id": self.warehouseInfo.id,
            //     "content":  Utils.getValueOfTextField(this.page.getViewById(this.feedbackConfig.content.id)),
            // }, localStorage.getItem("accessToken"))
            // .then((res: any)=>{
            //     if(res.statusCode == 200){
            //         Utils.hideLoadingIndicator();
            //         Utils.toastAlert("Gửi phản hồi thành công");
            //         self.closeCallback(true);
            //     }
            //     else{
            //         Utils.hideLoadingIndicator();
            //         console.log("Error - onTapSendFeedback - else ", res.statusCode);
            //        Utils.toastAlert(Config.ERROR_MESSAGE_TOAST.ERROR_HANDLING);
            //     }
            // })
            // .catch((err)=>{
            //     Utils.hideLoadingIndicator();
            //     Utils.toastAlert(Config.ERROR_MESSAGE_TOAST.ERROR_HANDLING);
            //     console.log("Error - onTapSendFeedback - feedback-model.ts ",err);
            // })
        }
    }

    goBack() {
        console.log("close Modal");
        this.closeCallback(false);
    }
}