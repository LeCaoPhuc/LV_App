import { Config } from '../env-config';
import { Utils } from "./utils";
import app = require("application");
var Parse = require('../libs/parse.min');
var ParseAndroid: any;
var ParseObject: any;
var ParseQuery: any;
var ParseLiveQueryClient: any;
var FindCallback: any;
var ParseException: any;
var SubscriptionHandling: any;
var ParseUser;
var localStorage = require("nativescript-localstorage");
export class ParseService {

    private liveQueryEvent: any = {};

   public static init() {
        Parse.initialize(Config.PARSE_APP_ID);
        Parse.serverURL = localStorage.getItem('parseServerUrl') || Config.PARSE_SERVER_URL;
    }

    public static configServerUrl(serverAddress: string) {
        if (serverAddress) {
            Parse.serverURL = `http://${serverAddress}/parse`;
            localStorage.setItem('parseServerUrl', `http://${serverAddress}/parse`);
            Utils.toastAlert(Parse.serverURL);
        }
    }

    public static query(className: string, where: any) {
        if (!className || className == '') return false;
        var query = new Parse.Query(className);
        if (where)
            query = where(query);
        return query.find();
    }

    public static newQuery(classObj: any) {
        var query = new Parse.Query(classObj);
        return query;
    }

    public static queryCount(className: string, where: any) {
        if (!className || className == '') return false;
        var query = new Parse.Query(className);
        if (where)
            query = where(query);
        return query.count();
    }

    public static orQuery(className: string, returnFindPromise: boolean, customfunction: Function, ...queryFunctionList: any[]) {
        var queryObjList: any = [];
        var queryList = [...queryFunctionList];
        for (var i in queryList) {
            var query = new Parse.Query(className);
            query = queryList[i](query);
            queryObjList.push(query);
        }
        var mainQuery = Parse.Query.or(...queryObjList);
        if (customfunction) {
            mainQuery = customfunction(mainQuery);
        }
        if (returnFindPromise)
            return mainQuery.find();
        else return mainQuery;
    }

    public static extendObject(className: string) {
        if (!className || className == '') return false;
        var ParseObj = Parse.Object.extend(className);
        return ParseObj;
    }

    public static newObject(className: string) {
        if (!className || className == '') return false;
        var ParseObj = Parse.Object.extend(className);
        var parseObj = new ParseObj();
        return parseObj;
    }

    public static newUser(data: any) {
        if (data) return new Parse.User(data);
        return new Parse.User();
    }

    public static setData(parseObj: any, data: any, save: boolean) {
        for (var i in data) {
            parseObj.set(i, data[i]);
        }
        if (save == true) {
            return parseObj.save();
        }
        else
            return parseObj;
    }

    public static saveAll(objList: any) {
        return Parse.Object.saveAll(objList);
    }

    public static parseFile(name: string, file: any, save: boolean) {
        var parseFile = new Parse.File(name, file);
        if (save == true) {
            return parseFile.save();
        }
        return parseFile;
    }

    public static parseFileImage(name: string, file: any, save: boolean) {
        var parseFile = new Parse.File(name, file, "image/png");
        if (save == true) {
            return parseFile.save();
        }
        return parseFile;
    }

    public static currentUser() {
        return Parse.User.current();
    }

    public static currentUserObject() {
        if (app.android) {
            return com.parse.ParseUser.getCurrentUser();
        }
        else {
            return PFUser.currentUser();
        }
    }

    public static fetchCurrentUser() {
        return Parse.User.current().fetch();
    }

    public static cloudTest(cloudName, params) {
        return new Promise(function (resolve, reject) {
            Parse.Cloud.run(cloudName, params, {
                sessionToken: Parse.User.current().get('sessionToken')
            })
                .then(function (res) {
                    console.log("aaaaaa");
                })
                .catch(function (err) {
                    console.log(err);
                })
        })
    }

    public static cloud(cloudName, params) {
        return Parse.Cloud.run(cloudName, params, {
            sessionToken: Parse.User.current().get('sessionToken')
        });
    }

    public static cloudNoneOauth(cloudName, params) {
        return Parse.Cloud.run(cloudName, params);
    }

    public static parse(): any {
        return Parse;
    }

    public static logIn(username, password) {
        return Parse.User.logIn(username.toLowerCase(), password);
    }

    public static logOut() {
        return Parse.User.logOut();
    }

    public static loginWith(authData: any, loginType: any) {
        Parse.User._registerAuthenticationProvider(authData);
        return Parse.User.logInWith(loginType, authData);
    }


    // newParseUser(id){
    //     if(app.android){
    //          var user = new ParseUser();
    //         user.setObjectId(id);
    //         return user;

    //     }else{
    //        var user =  new PFUser();
    //        user.objectId = id;
    //     //     user.id = id;
    //         return user;
    //     }
    // }

}
