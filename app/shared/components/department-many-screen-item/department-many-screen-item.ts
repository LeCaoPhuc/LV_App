import { DepartmentManyScreenItem } from "./department-many-screen-item.model";
import { Utils,Pagination, ShareDataService } from "../../tools";
var gestures = require("ui/gestures");
var app = require("application");
var listProduct = [];
export function onLoaded(args){
    console.log('onLoaded department item');
    var layout = args.object;
    if (app.android){
        var label = layout.getChildAt(1);
        var image = layout.getChildAt(0);
        image.imageUri = label.text;
        if(layout.mode==9){
            Utils.resizeImage(args.object._context,image,360,640);
        }
        else{
            Utils.resizeImage(args.object._context,image,360,640);
        }
    }
    
    var shareManagementDepartment =  ShareDataService.getData("shareManagementDepartment");
    var isTapDepartmentItem = false;
    layout.on(gestures.GestureTypes.tap,function(args){
        if(isTapDepartmentItem){
            return;
        }
        isTapDepartmentItem = true;
        listProduct = args.object.listProduct;
        args.object.page.closeModal(true,listProduct,args.object.bindingContext.departmentPage);
        isTapDepartmentItem = false;
    })
    if(app.android){
        layout.on(gestures.GestureTypes.pan,function(args){
            var lastPageModal = ShareDataService.getData("lastPageModal");
            shareManagementDepartment.onPanSlider(args,layout.mode,lastPageModal);
        })
    }
    
}
