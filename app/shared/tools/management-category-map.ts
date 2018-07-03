import { ShareDataService,httpRequest,Utils,ParseService } from "./"

export class ManagementCategoryMap {

    /*
        structur categoryMapFlat

        categorMap = {
            0 : {
                subCategoryId:"302",
                subCategoryName: 'Hoa pham hoa hoc',
                totalPage: 20,
                last : false,
                first: true,
                categoryId: categoryId,
                imageUrl: imageUrl,
                categoryName : categoryName,
                
            },
            1: {
                subCategoryId:"302",
                subCategoryName: 'Hoa pham hoa hoc',
                totalPage: 20,
                last : false,
                first: true,
                categoryId: categoryId,
                imageUrl: imageUrl,
                categoryName : categoryName,
            },
            2 : {
                subCategoryId:"302",
                subCategoryName: 'Hoa pham hoa hoc',
                totalPage: 20,
                last : true,
                first: true,
                categoryId: categoryId,
                imageUrl: imageUrl,
                categoryName : categoryName,
            }
        }
        
    */

    private static _currentCategory: any = {};
    private static _categoryMap = null;
    private static _categoryMapFlat = null;
    private static _categoryList = [];
    public static get categoryMap (){
        return this._categoryMap;
    }
    public static set categoryMap (value){
        this._categoryMap = value;
    }
    public static get categoryMapFlat (){
        return this._categoryMapFlat;
    }
    public static set categoryMapFlat (value){
        this._categoryMapFlat = value;
    }
    public static get categoryList (){
        return this._categoryList;
    }
    public static set categoryList (value){
        this._categoryList = value;
    }
    public static get currentCategory (){
        return this._currentCategory;
    }
    
    public static set currentCategory (value ){
         this._currentCategory = value;
    }

    public static initCategoryMap(){
        var self = this;
        return new Promise(function(resolve, reject) {
            self.categoryMap = {} ;
            var promiseArr = [];
            self.getListCategory()
            .then(()=>{
                resolve();
            })
            .catch((err)=>{
                reject(err);
                console.log("initCategoryMap - managemen-category-map - ", err);
            })
        })
        
    }

    public static init(categoryId ?){
        if(categoryId){
            for(let i in this.categoryMap) {
                if(this.categoryMap[i].categoryId == categoryId) {
                    this.currentCategory = this.categoryMap[i];
                }
            }
        }
        else{
             this.currentCategory = this.categoryMap[0];
        }  
    }
    public static getListCategory() {
        var self =this;
        return new Promise(function(resolve, reject) {
            ParseService.cloud('getCategoryList',{
                page: 1,
                limit: 100
            })
            .then((res: any)=>{
                self.categoryMap = {};
                if(res && res.success){
                    if(res && res.data){
                        res = res.data;
                        for(var i = 0; i< res.length ; i++){
                            self.categoryMap[i] = {
                                categoryId : res[i].id,
                                imageUrl : res[i].get('image') ? res[i].get('image').url() : '~/images/no_image.jpg',
                                categoryName: res[i].get('category_name'),
                                totalPage: res[i].get('count_product') ? self.getNumOfPageFromProductCount(res[i].get('count_product'))  : 0,
                                first : i == 0 ? true : false,
                                last : i == res.length-1 ? true : false,
                            };
                        }
                        resolve();
                    }
                }
            })
            .catch((err)=>{
                reject(err);
                console.log("Error - getListCategory - management-category-map.ts",err);
            })
        }) 
    }

    public static next(){
        for(var i in this.categoryMap) {
            if(this.categoryMap[i].categoryId == this.currentCategory.categoryId) {
                if(this.categoryMap[i].last) {
                    return this.currentCategory;
                }
                else {
                    this.currentCategory = this.categoryMap[parseInt(i)+1];
                    return  this.currentCategory;
                }
            }
        }
       
    }
    public static previous(){
        for(var i in this.categoryMap) {
            if(this.categoryMap[i].categoryId == this.currentCategory.categoryId) {
                if(this.categoryMap[i].first) {
                    return this.currentCategory;
                }
                else {
                    this.currentCategory = this.categoryMap[parseInt(i)-1];
                    return this.currentCategory;
                }
            }
        }
    }

    public static getPrevious() {
         for(var i in this.categoryMap) {
            if(this.categoryMap[i].categoryId == this.currentCategory.categoryId) {
                if(this.categoryMap[i].first) {
                    return this.currentCategory;
                }
                else {
                    return this.categoryMap[parseInt(i)-1];
                }
            }
        }
    }

    public static getNext() {
         for(var i in this.categoryMap) {
            if(this.categoryMap[i].categoryId == this.currentCategory.categoryId) {
                if(this.categoryMap[i].last) {
                    return this.currentCategory;
                }
                else {
                    return this.categoryMap[parseInt(i)+1];
                }
            }
        }
    }
    public static current(){
        return  this.currentCategory;
    }

    private static nextCategory(){
        var resultObj = {};
        var currentCategoryId = this.currentCategory.categoryId;
        for(var i = 0 ; i < Utils.lengthOfObject(this.categoryMap) ; i++){
            if(this.categoryMap[i].categoryId == currentCategoryId){
                if(this.categoryMap[i].last) {
                    resultObj = this.currentCategory;
                }
                else{
                    this.currentCategory = this.categoryMap[i+1];
                    resultObj =  this.currentCategory;
                }
                break;
            }
        }
        return resultObj;
    }

    private static preCategory() {
        var resultObj = {};
        var currentCategoryId = this.currentCategory.categoryId;
        for(var i = Utils.lengthOfObject(this.categoryMap) - 1 ; i >= 0  ; i--){
            if(this.categoryMap[i].categoryId ==currentCategoryId){
                if(i==0) {
                    // this.currentCategory = this.categoryMap[0];
                    // this.currentSubCategory = this.categoryMap[0].subCategoryListId[0];
                    resultObj = this.currentCategory;
                }
                else{
                    this.currentCategory = this.categoryMap[i-1];
                    resultObj =  this.currentCategory;
                }
                break;
            }
        }
        return resultObj;
    }
    private static getNumOfPageFromProductCount(count) {
        if(count%9 != 0) {
            return Math.floor(count/9)+1
        }
        else {
            return  Math.floor(count/9);
        }
    }
}