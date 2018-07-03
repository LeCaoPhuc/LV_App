import { Pagination, SliderControl ,sliderOfView  } from  "./";
import { Product, DepartmentStore, Mode,ManageDepartmentList,typeOfListProduct,ShareDataService,typeOfProduct, ManagementCategoryMap,Utils } from "../tools";
import { MockDataProduct} from "../../pages/product-list/mock-data-product";
import { DepartmentSliderItem } from "../components/department-slider/department-slider.model"
import { Image } from "ui/image";
import { Observable, fromObject } from "data/observable";
import * as platformModule from "tns-core-modules/platform";
var cache = require("nativescript-cache");
var enums = require("ui/enums");
export class ManagementProduct {

    private pagination: Pagination;
    private productItems;
    private typeOfPage: any;
    private page: any;
    private lastItemFunc: any;
    private lastArrayNext = [];
    private cacheAPIUrl : any;
    private managementCategoryMap = ManagementCategoryMap;
    constructor(
        page,
        typeOfPage,
        pagination
    ) {
        this.pagination = pagination;
        this.typeOfPage = typeOfPage;
        this.page = page;
        this.cacheAPIUrl = ShareDataService.setData("cacheApiUrl", {});
    }
    getProductListOfCurrentSlide() {
        var currentProductList;
        if (SliderControl.sliderCenter.id == "firstSlider") {
            currentProductList = "notifyFirstProductListBindingComplete";
        } else {
            if (SliderControl.sliderCenter.id == "secondSlider") {
                currentProductList = "notifySecondProductListBindingComplete";
            } else {
                currentProductList = "notifyThirdProductListBindingComplete";
            }
        }
        return currentProductList;
    }

    onPanSlider(args, lastPage, currentPageTemp?) {
        var self = this;
        var currentPage ;
        if(!currentPageTemp) {
            currentPage = self.pagination.page;
        }  
        else {
            currentPage = currentPageTemp;
        }
        return new Promise(function(resolve,reject){
             SliderControl.onPanSlider(args, self.pagination.page,lastPage,self.typeOfPage ,function(id,delta){
                if(delta < 0) { //slide from right -> left
                    if(self.typeOfPage == typeOfListProduct.CATEGORY_LIST) {
                        var departmentData = ShareDataService.getData("cacheDepartmentData");
                        var key = self.managementCategoryMap.current().categoryId;
                        if(lastPage &&  args.deltaX < 0 ){
                            if(departmentData[key]){
                                self.pagination.page = 1;
                                resolve(departmentData[key][1]);
                            }
                            else{
                                self.pagination.page = 1;
                                self.initProductList()
                                .then((response)=>{
                                    resolve(response);
                                })
                                .catch((err)=>{
                                    reject(err);
                                })
                            }
                            
                        }
                        else{
                            self.loadNewData(self.page,"next")
                            .then((response)=>{
                                resolve(response);
                            })
                            .catch((err)=>{
                                reject(err);
                            })
                        }
                    }
                    else {
                        self.loadNewData(self.page,"next")
                        .then((response)=>{
                            resolve(response);
                        })
                        .catch((err)=>{
                            reject(err);
                        })
                    }
                }else{
                    if(self.typeOfPage == typeOfListProduct.CATEGORY_LIST) {
                        var departmentData = ShareDataService.getData("cacheDepartmentData");
                        var key = self.managementCategoryMap.current().categoryId;
                        if(currentPage == 1 && args.deltaX > 0) {
                            if(departmentData[key] && departmentData[key][self.managementCategoryMap.current().totalPage]){
                                resolve( departmentData[key][self.managementCategoryMap.current().totalPage])
                            }
                            else{
                                self.pagination.page = self.managementCategoryMap.current().totalPage;
                                self.initProductList()
                                .then((response : any)=>{
                                    resolve(response);
                                })
                                .catch((err)=>{
                                    reject(err);
                                })
                            }
                        }
                        else{
                            self.loadNewData(self.page,"previous")
                            .then((response)=>{
                                resolve(response);
                            })
                            .catch((err)=>{
                                reject(err);
                            })
                        }
                    }
                    else {
                        self.loadNewData(self.page,"previous")
                        .then((response)=>{
                            resolve(response);
                        })
                        .catch((err)=>{
                            reject(err);
                        })
                    }
                    
                }      
            })
        })

    }

    onPanProductImage(args, callback) {
        console.log("on Pan product 2");
        var self = this;
        SliderControl.onPanProductImage(args, callback);
    }
    resetSliderControlForPage() {
        SliderControl.resetLayout(this.page.getViewById("firstSlider"), this.page.getViewById("secondSlider"), this.page.getViewById("thirdSlider"), sliderOfView.PAGE);
    }
    initSliderControlForPage() {
        SliderControl.setFirstSliderPosition(this.page.getViewById("firstSlider"), sliderOfView.PAGE);
        SliderControl.setSecondtSliderPosition(this.page.getViewById("secondSlider"), sliderOfView.PAGE)
        SliderControl.setThirdSliderPosition(this.page.getViewById("thirdSlider"), sliderOfView.PAGE);
    }
    loadNewData(page, state) {
        var self = this;
        return new Promise(function(resolve,reject){
            var currentPage ;
            if(state=="next"){
                if(self.typeOfPage == typeOfListProduct.CATEGORY_LIST) {
                    var departmentData = ShareDataService.getData("cacheDepartmentData");
                    var key = self.managementCategoryMap.current().categoryId;
                    if(departmentData[key] && departmentData[key][self.pagination.page+1]){
                        console.log("\n \n ---------loadNewData Next Cache Data -------- \n \n" ,self.pagination.page+1);
                        currentPage = self.pagination.page+1;
                        self.pagination.page = self.pagination.page+1;
                        resolve(departmentData[key][currentPage])
                    }
                    else{
                        self.initNextPageProductList()
                        .then((response)=>{
                            console.log("initNextPageProductList");
                            resolve(response);
                        })
                        .catch((err)=>{
                            reject(err);
                        })
                    }
                }
                else {
                    var departmentData = ShareDataService.getData("cacheOtherDepartmentData");
                    if(departmentData && departmentData[self.pagination.page+1]) {
                        var managem = ShareDataService.getData(self.typeOfPage);
                        currentPage = self.pagination.page+1;
                        self.pagination.page = self.pagination.page+1;
                        resolve(departmentData[currentPage])
                    }
                    else{
                        self.initNextPageProductList()
                        .then((response)=>{
                            var managem = ShareDataService.getData(self.typeOfPage);
                            console.log("initNextPageProductList", self.pagination.page);
                            resolve(response);
                        })
                        .catch((err)=>{
                            reject(err);
                        })
                    }
                } 
            }else{
                if(self.typeOfPage == typeOfListProduct.CATEGORY_LIST) {
                    var departmentData = ShareDataService.getData("cacheDepartmentData");
                    var key = self.managementCategoryMap.current().categoryId;
                    if(departmentData[key] && departmentData[key][self.pagination.page-1]){
                        console.log("\n \n---------loadNewData Previous Cache Data-------- \n \n",self.pagination.page-1)
                        currentPage = self.pagination.page-1;
                        self.pagination.page = self.pagination.page-1;
                        resolve(departmentData[key][currentPage])
                    }
                    else{
                        self.initPreviousProductList()
                        .then((response)=>{
                            console.log("initPreviousProductList");
                            resolve(response);
                        })
                        .catch((err)=>{
                            console.log("Error" + err);
                            reject(err);
                        })
                    }
                }
                else {
                    var departmentData = ShareDataService.getData("cacheOtherDepartmentData");
                    if(departmentData && departmentData[self.pagination.page-1]) {
                        currentPage = self.pagination.page-1;
                         var managem = ShareDataService.getData(self.typeOfPage);
                        self.pagination.page = self.pagination.page-1;
                        resolve(departmentData[currentPage])
                    }
                    else {
                        self.initPreviousProductList()
                        .then((response)=>{
                            console.log("initPreviousProductList");
                            resolve(response);
                        })
                        .catch((err)=>{
                            console.log("Error" + err);
                            reject(err);
                        })
                    }
                }
            }
        })
    }
    initProductList() {
        var self = this;
        return new Promise(function(resolve,reject){
            if(self.typeOfPage == typeOfListProduct.CATEGORY_LIST) {
                var cacheDepartmentData = ShareDataService.getData("cacheDepartmentData");
                var key = self.managementCategoryMap.current().categoryId;
                if(cacheDepartmentData[key] && cacheDepartmentData[key][self.pagination.page]){
                    resolve(cacheDepartmentData[key][self.pagination.page]);
                }
                else{
                    self.pagination.getPage(self.pagination.page)
                    .then((res: any)=>{
                        console.log(self.pagination.page);
                        var last = false;
                        var objResolve : any;
                        if(res && res.success){
                            if(res.lastPage) {
                                last = true;
                            }
                            if(!res.data){
                                resolve({
                                    productArr : [],
                                    last : true
                                });
                                return;
                            }
                            else {
                                if(res.data && res.data.length > 0){
                                    res = res.data;
                                }
                                else{
                                    resolve({
                                        productArr : [],
                                        last : true
                                    });
                                      return;
                                }           
                            }
                            if(self.pagination.page == self.managementCategoryMap.current().totalPage && self.typeOfPage == typeOfListProduct.CATEGORY_LIST) {
                            last = true;
                        }
                            var productArr = [];
                            var productIntoCart = localStorage.getItem('listItemsInCart');
                            for(var i =0; i< res.length; i++){
                                var product = new Product(res[i]);
                                product.typeOfManagementProductObject = self.typeOfPage;
                                var newProduct : any =  fromObject(product);
                                if(productIntoCart && productIntoCart[newProduct.productId]){ 
                                    newProduct.quantity = productIntoCart[product.productId].quantity;
                                    // productIntoCart[product.productSKUCode] = newProduct;
                                }
                                productArr.push(newProduct);
                            }
                            ShareDataService.setData("productIntoCart",productIntoCart);
                            resolve({
                                productArr : productArr,
                                last : last
                            });
                        }
                        else{
                            last = true;
                            resolve({
                                productArr : [],
                                last : last
                            });
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                        reject(err);
                    })
                }
            }
           else {
            self.pagination.getPage(self.pagination.page)
                .then((res: any) => {
                    console.log(self.pagination.page);
                    var last = false;
                    var objResolve : any;
                    if(res && res.success){
                        if(res.lastPage && self.typeOfPage == typeOfListProduct.SEARCH_LIST) {
                            last = true;
                        }
                        if(!res.data){
                            resolve({
                                productArr : [],
                                last : true
                            });
                            return;
                        }
                        else {
                            if(res.data && res.data.length > 0){
                                res = res.data;
                            }
                            else{
                                resolve({
                                    productArr : [],
                                    last : true
                                });
                                return;
                            }           
                        }
                        var productArr = [];
                        var productIntoCart = localStorage.getItem('listItemsInCart');
                        for(var i =0; i< res.length; i++){
                            var product = new Product(res[i]);
                            product.typeOfManagementProductObject = self.typeOfPage;
                            var newProduct : any =  fromObject(product);
                            if(productIntoCart && productIntoCart[newProduct.productId]){ 
                                newProduct.quantity = productIntoCart[product.productId].quantity;
                                // productIntoCart[product.productSKUCode] = newProduct;
                            }
                            productArr.push(newProduct);
                        }
                        ShareDataService.setData("productIntoCart",productIntoCart);
                        resolve({
                            productArr : productArr,
                            last : last
                        });
                }
                else{
                    last = true;
                    resolve({
                        productArr : [],
                        last : last
                    });
                }
            })
            .catch((err)=>{
                console.log(err);
                reject(err);
            })
           }
            
        })
    }
    initNextPageProductList() {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.pagination.nextPage()
                .then((res: any) => {
                    console.log(self.pagination.page);
                    var last = false;
                    var objResolve : any;
                    if(res && res.success){
                        if(res.lastPage && self.typeOfPage == typeOfListProduct.SEARCH_LIST) {
                            last = true;
                        }
                        if(!res.data){
                            resolve({
                                productArr : [],
                                last : true
                            });
                            return;
                        }
                        else {
                            if(res.data && res.data.length > 0){
                                res = res.data;
                            }
                            else{
                                resolve({
                                    productArr : [],
                                    last : true
                                });
                                    return;
                            }           
                        }
                        if(self.pagination.page == self.managementCategoryMap.current().totalPage && self.typeOfPage == typeOfListProduct.CATEGORY_LIST) {
                            last = true;
                        }
                        var productArr = [];
                        var productIntoCart = localStorage.getItem('listItemsInCart');
                        for(var i =0; i< res.length; i++){
                            var product = new Product(res[i]);
                            product.typeOfManagementProductObject = self.typeOfPage;
                            var newProduct : any =  fromObject(product);
                            if(productIntoCart && productIntoCart[newProduct.productId]){ 
                                newProduct.quantity = productIntoCart[product.productId].quantity;
                            }
                            productArr.push(newProduct);
                        }
                        resolve({
                            productArr : productArr,
                            last : last
                        });
                    }
                    else {
                        last = true;
                        resolve({
                            productArr: [],
                            last: last
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                })
        })
    }
    initPreviousProductList() {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.pagination.prevPage()
                .then((res: any) => {
                    console.log(self.pagination.page);
                    var last = false;
                    var objResolve : any;
                    if(res && res.success){
                        if(res.lastPage && self.typeOfPage == typeOfListProduct.SEARCH_LIST) {
                            last = true;
                        }
                        if(!res.data){
                            resolve({
                                productArr : [],
                                last : true
                            });
                            return;
                        }
                        else {
                            if(res.data && res.data.length > 0){
                                res = res.data;
                            }
                            else{
                                resolve({
                                    productArr : [],
                                    last : true
                                });
                                    return;
                            }           
                        }
                        if(self.pagination.page == self.managementCategoryMap.current().totalPage && self.typeOfPage == typeOfListProduct.CATEGORY_LIST) {
                            last = true;
                        }
                        var productArr = [];
                        var productIntoCart = localStorage.getItem('listItemsInCart');
                        for(var i =0; i< res.length; i++){
                            var product = new Product(res[i]);
                            product.typeOfManagementProductObject = self.typeOfPage;
                            var newProduct : any =  fromObject(product);
                            if(productIntoCart && productIntoCart[newProduct.productId]){ 
                                newProduct.quantity = productIntoCart[product.productSKUCode].quantity;
                                // productIntoCart[product.productSKUCode] = newProduct;
                            }
                            productArr.push(newProduct);
                        }
                        resolve({
                            productArr : productArr,
                            last : last
                        });
                    }
                    else {
                        last = true;
                        resolve({
                            productArr: [],
                            last: last
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                })
        })
    }
    initProductListWithProductItemsList(productItems) {
        var productArr = [];
        var last = false;
        var listProductInCart = localStorage.getItem('listItemsInCart');
        for (var i = 0; i < productItems.length; i++) {
            var newProduct: any = fromObject(productItems[i]);
            if (listProductInCart && listProductInCart[newProduct.productId]) {
                // newProduct.quantity = listProductInCart[productItems[i].productId].quantity;
                console.log("initProductListWithProductItemsList");
                // listProductInCart[product.productSKUCode] = newProduct;
            }
            productArr.push(newProduct);
        }
        return {
            productArr: productArr,
            last: last
        }
    }

    initDepartmentStoreList() {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.pagination.page = 0;
            self.pagination.perPage = 9;
            self.pagination.getData = function (page, perPage) {
                return new Promise(function (resolve, reject) {
                    var data = [];
                    if (page < 0) {
                        return;
                    }
                    for (var i = page * perPage; i < (page + 1) * perPage; i++) {
                        if (MockDataProduct.mockDataProduct[i]) {
                            data.push(MockDataProduct.mockDataDepartmentStore.data[i]);
                        } else {
                            break;
                        }
                    }
                    resolve(data);
                })
            }
            self.pagination.getPage(0)
                .then((response: any) => {
                    self.productItems = new Array<Product>();
                    for (var i = 0; i < response.length; i++) {
                        var product = new Product(
                            response[i],
                        )
                        self.productItems.push(product);
                    }
                    resolve(self.productItems);
                })
                .catch((err) => {
                    console.log("Err " + err);
                    reject(err);
                })
        })

    }

    // parseListManyProduct(res, last) {
    //     var productArr = [];
    //     var last = last;
    //     var self = this;
    //     if (!last) {
    //         last = false;
    //     }
    //     else {
    //         last = true;
    //     }
    //     res = res.data;
    //     productArr = self.parseProductList(res);
    //     this.parseDepartmentSliderItemFromProductList(productArr, last);
    // }

    // parseProductList(res) {
    //     var productIntoCart =  CartService.getLocalCart();
    //     var productArr = [];
    //     for (var i = 0; i < res.length; i++) {
    //         if (res[i].wishlist_item_id) {
    //             var product = new Product(res[i].product);
    //             product.productFavoriteId = res[i].wishlist_item_id;
    //             product.typeOfProduct = typeOfProduct.FAVORITE;
    //         }
    //         else {
    //             var product = new Product(res[i]);
    //         }
    //         product.typeOfManagementProductObject = this.typeOfPage;
    //         var newProduct: any = fromObject(product);
    //         if (productIntoCart && productIntoCart[newProduct.productSKUCode]) {
    //             newProduct.productCartId = productIntoCart[product.productSKUCode].productCartId;
    //             newProduct.quantity = productIntoCart[product.productSKUCode].quantity;
    //             newProduct.weight = productIntoCart[product.productSKUCode].weight;
    //         }
    //         productArr.push(newProduct);
    //     }
    //     ShareDataService.setData("productIntoCart", productIntoCart);
    //     return productArr;
    // }

    parseDepartmentSliderItemFromProductList(productArr, last) {
        var lastPageList = {};
        var cacheDepartmentData = ShareDataService.getData("cacheDepartmentData");
        for (var i = 0; i < productArr.length; i += 9) {
            var arrTemp = [];
            if (last) { // if last reponse == true then check tru in number page ?
                if (productArr.length % 9 != 0) {
                    if (Math.floor(i / 9) + 1 <= (Math.floor(productArr.length / 9))) { // number of page have length = 9 so last == false
                        console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=" + Math.floor(i / 9) + 1 + "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")
                        lastPageList[(i / 9) + 1] = false;
                    }
                    else {
                        console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=" + Math.floor(i / 9) + 1 + true + "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")
                        lastPageList[(i / 9) + 1] = true;
                    }
                }
                else { // length of final list  == 9 ( final list have length = 9)
                    if (Math.floor(i / 9) + 1 == (Math.floor(productArr.length / 9))) {
                        lastPageList[(i / 9) + 1] = true;
                    }
                    else {
                        lastPageList[(i / 9) + 1] = false;
                    }
                }
            }
            for (var j = i; j < i + 9; j++) {
                arrTemp.push(productArr[j]);
            }
            var department = new DepartmentSliderItem(arrTemp);
            cacheDepartmentData[(i / 9) + 1] = {
                productArr: department.productList,
                last: !last ? false : lastPageList[Math.floor(i / 9) + 1]
            };
            ShareDataService.setData("cacheDepartmentData", cacheDepartmentData);
        }
    }
}