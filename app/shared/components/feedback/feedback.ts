import { CommentModel } from "./feedback.model"
var voucherModel ;
export function onLoaded(args){
    console.log("onloaded");
    voucherModel = new CommentModel(args.object,args.object._modalContext,args.object._closeModalCallback);
    args.object.bindingContext = voucherModel;

}

export function onShownModally(args){
    console.log("showModally");
}