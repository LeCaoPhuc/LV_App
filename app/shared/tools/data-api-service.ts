import { Pagination,ShareDataService, typeOfProduct, Product,ManagementCategoryMap,typeOfListProduct,httpRequest } from "./";
import { Observable, fromObject } from "data/observable";
import { DepartmentSliderItem } from "../components/department-slider/department-slider.model";
var localStorage = require("nativescript-localstorage");
export class DataAPIServiceOfCategory{
    private pagination ;
    private warehouseId;
    constructor(){
        var managementCategoryMap = ManagementCategoryMap;
        this.warehouseId = localStorage.getItem("warehouseInfo") ? localStorage.getItem("warehouseInfo").id : 49;
        var self =this;
        this.pagination = new Pagination();
        this.pagination.page = 1;
        this.pagination.perPage = 90;
        this.pagination.step = 5;
        this.pagination.getData = function(){
            var url =   url  = "scanngo_v1/warehouse/" + self.warehouseId + "/category/" + managementCategoryMap.current().subCategory.subCategoryId + "/product?page="+ self.pagination.page + "&per_page=" + self.pagination.perPage;
            console.log(url);
            return httpRequest.get(url,localStorage.getItem("accessToken"));
        }
    }

    initDataItems(){
      
    }

    parseListManyProduct(res, last){
        var productArr = [];
        var last = last;
        var self = this;
        if(!last){
            last = false;
        }
        else{
            last =true;
        }
        res = res.data;
        productArr = self.parseProductList(res);
        this.parseDepartmentSliderItemFromProductList(productArr,last);
    }

    parseProductList(res){
        var productIntoCart = ShareDataService.getData("productIntoCart");
        var productArr = [];
        for(var i =0; i< res.length; i++){
            var product = new Product(res[i]);
            product.typeOfManagementProductObject = typeOfListProduct.CATEGORY_LIST;
            var newProduct : any =  fromObject(product);
            if(productIntoCart && productIntoCart[newProduct._productSKUCode]){ 
                newProduct._productCartId = productIntoCart[product.productSKUCode]._productCartId;
                newProduct._quantity = productIntoCart[product.productSKUCode]._quantity;
                newProduct._weight = productIntoCart[product.productSKUCode]._weight;
            }
            productArr.push(newProduct);
        }
        ShareDataService.setData("productIntoCart",productIntoCart);
        return productArr;
    }

    parseDepartmentSliderItemFromProductList(productArr,last){
        var lastPageList = {};
        var cacheDepartmentData = ShareDataService.getData("cacheDepartmentData");
        //  for(var i =0 ; i < productArr.length ; i += 9){
        //     var arrTemp = [];
        //     if(last){ // if last reponse == true then check tru in number page ?
        //         if(productArr.length % 9 != 0){ 
        //             if(Math.floor(i/9)+1 <=  (Math.floor(productArr.length/9))){ // number of page have length = 9 so last == false
        //                 console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="+ Math.floor(i/9)+1 +"-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")
        //                 lastPageList[(i/9)+1] = false;
        //             }
        //             else{
        //                 console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="+ Math.floor(i/9)+1 + true + "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")
        //                 lastPageList[(i/9)+1] = true;
        //             }
        //         }
        //         else{ // length of final list  == 9 ( final list have length = 9)
        //             if(Math.floor(i/9)+1 == (Math.floor(productArr.length/9))){
        //                 lastPageList[(i/9)+1] = true;
        //             }
        //             else{
        //                 lastPageList[(i/9)+1] = false;
        //             }
        //         }
        //     }
        //     for(var j = i ; j < i+9 ; j++){
        //         arrTemp.push(productArr[j]);
        //     }
        //     var department = new DepartmentSliderItem(arrTemp);
        //     cacheDepartmentData[(i/9)+1] =  {
        //         productArr : department.productList,
        //         last : !last ? false :  lastPageList[Math.floor(i/9)+1]
        //     };
        //     ShareDataService.setData("cacheDepartmentData", cacheDepartmentData);
        // }
    }
}