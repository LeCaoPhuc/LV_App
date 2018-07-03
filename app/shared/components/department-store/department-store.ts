import { Observable } from "data/observable";
import {DepartmentStoreModel} from "./department-store.model"
var app = require("application");
var nameOfProduct;
export function onLoaded(args){
    console.log("onLoaded Deparetment"); 
    var layout = args.object;
    layout.visibility = "collapse";
    layout.on('notifyDepartmentBindingComplete',function(departmentStore){
        var departmentStoreModel = new DepartmentStoreModel(args.object.page,departmentStore.eventData);
        args.object.bindingContext = departmentStoreModel;
        var shelfList = departmentStoreModel.initShelfList();
            args.object.getViewById("firstShelf").notify({
                eventName: "notifyShelfListBindingComplete",
                object : this,
                eventData : { 
                    shelfListLength: shelfList.length,
                    shelf: shelfList[0]
                }
            })
              args.object.getViewById("secondShelf").notify({
                eventName: "notifyShelfListBindingComplete",
                object : this,
                eventData :  { 
                    shelfListLength: shelfList.length,
                    shelf: shelfList[1]
                }
            })
            args.object.getViewById("thirdShelf").notify({
                eventName: "notifyShelfListBindingComplete",
                object : this,
                eventData :  { 
                    shelfListLength: shelfList.length,
                    shelf: shelfList[2]
                }
            })
        
    })
}
