import http = require("http");
import { Config } from '../env-config';
import { Utils } from './utils';
import localStorage = require("nativescript-localstorage");
var frames = require("ui/frame");
function rejectUnauthorizedAccess() {
    if (localStorage.getItem('isLogged')) {
        Utils.showLoadingIndicator();
        Utils.hideLoadingIndicator();
        Utils.toastAlert('Đăng nhập hết hạn');
        localStorage.setItem("isLogged", false);
        localStorage.setItem("voucher", undefined);
        if(frames.topmost().currentPage && frames.topmost().currentPage._modal){
            if(frames.topmost().currentPage.isSignIn == 'true'){
                frames.topmost().currentPage._modal._closeModalCallback();
            }
            else{
                frames.topmost().currentPage._modal._closeModalCallback();
                if( frames.topmost().currentPage.getViewById("searchBar")){
                    frames.topmost().currentPage.getViewById("searchBar").dismissSoftInput();
                }
                if(frames.topmost().currentPage.getViewById("barcodeTF")){
                     frames.topmost().currentPage.getViewById("barcodeTF").dismissSoftInput();
                }
                localStorage.setItem('userPageType', 'SignIn');
                Utils.navigate('pages/user/user', true);
            }
        }
        else{
           if(frames.topmost().currentPage.isSignIn == 'true'){
               console.log("no Modal in Sign-in");
                // frames.topmost().currentPage._modal._closeModalCallback();
            }
            else{
                if( frames.topmost().currentPage.getViewById("searchBar")){
                    frames.topmost().currentPage.getViewById("searchBar").dismissSoftInput();
                }
                if(frames.topmost().currentPage.getViewById("barcodeTF")){
                     frames.topmost().currentPage.getViewById("barcodeTF").dismissSoftInput();
                }
                localStorage.setItem('userPageType', 'SignIn');
                Utils.navigate('pages/user/user', true);
            }
        }  
    }
}

export let httpRequest = {
    post: function httpPost(link, data, _accessToken?) {
        return new Promise(function (resolve, reject) {
            http.request({
                url: Config.SERVER_BASE_URL + link,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": "bearer " + _accessToken,
                },
                content: JSON.stringify(data)
            })
                .then((res) => {
                    if (res.statusCode == 401) {
                        rejectUnauthorizedAccess();
                    }
                    else {
                        resolve(res);
                    }
                })
                .catch((err) => {
                    if (err && err.message) {
                        console.log(err.message);
                        Utils.showLoadingIndicator();
                        Utils.hideLoadingIndicator();
                        Utils.toastAlert(err.message);
                    }
                    else{
                         Utils.toastAlert(Config.ERROR_MESSAGE_TOAST.HTTP_CATCH);
                    }
                })
        })
    },
    get: function httpGet(link, _accessToken?) {
        return new Promise(function(resolve,reject){
            http.request({
                url: Config.SERVER_BASE_URL + link,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // "X-Authorization": "bearer " + _accessToken,
                    "Authorization": "bearer " + _accessToken,
                }
            })
                .then((res) => {
                    if (res.statusCode == 401) {
                        rejectUnauthorizedAccess();
                    }
                    else {
                        resolve(res);
                    }
                })
                .catch((err) => {
                    if (err && err.message) {
                        console.log(err.message);
                        Utils.showLoadingIndicator();
                        Utils.hideLoadingIndicator();
                        Utils.toastAlert(err.message);
                    }
                    else{
                         Utils.toastAlert(Config.ERROR_MESSAGE_TOAST.HTTP_CATCH);
                    }
                })
        })
    },
    delete: function httpDelete(link, _accessToken?) {
        return http.request({
            url: Config.SERVER_BASE_URL + link,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-Authorization": "bearer " + _accessToken,
            }
        })
    }
}