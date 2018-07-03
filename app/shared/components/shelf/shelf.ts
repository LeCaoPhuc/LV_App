import { Observable } from "data/observable";
import {ShelfModel} from "./shelf.model"
var app = require("application");
var nameOfProduct;
export function onLoaded(args){
    console.log("onLoaded Shelf"); 
    var layout = args.object;
    layout.on('notifyShelfListBindingComplete',function(shelf){
        console.log("notifyShelfListBindingComplete");
        var shelfModel = new ShelfModel(shelf.eventData);
        args.object.bindingContext = shelfModel;
        var product = shelfModel.initProductList();
        if(product.length == 1){
                args.object.getViewById("secondProduct").notify({
                    eventName: "notifyProductBindingComplete",
                    object : this,
                    eventData :  { 
                        mode: shelf.eventData.shelf.mode,
                        productListLength: product.length,
                        product: product[0]
                    }
                })
        }

            args.object.getViewById("firstProduct").notify({
                eventName: "notifyProductBindingComplete",
                object : this,
                eventData : { 
                    mode: shelf.eventData.shelf.mode,
                    productListLength: product.length,
                    product: product[0]
                }
            })

            args.object.getViewById("secondProduct").notify({
                eventName: "notifyProductBindingComplete",
                object : this,
                eventData :  { 
                    mode: shelf.eventData.shelf.mode,
                    productListLength: product.length,
                    product: product[1]
                }
             })

            args.object.getViewById("thirdProduct").notify({
                eventName: "notifyProductBindingComplete",
                object : this,
                eventData :  { 
                    mode: shelf.eventData.shelf.mode,
                    productListLength: product.length,
                    product: product[2]
                }
            })
    })
}
