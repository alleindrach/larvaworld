import { take, call, select, put } from 'redux-saga/effects';
import * as Actions from '../redux/action/index';
import _ from 'lodash';
import config from '../config/Config';
import StringUtils from '../utils/StringUtils'
const publicAPI = (baseURL: string = config.api.base) => {

    const baseOptions = {
        credentials: 'include',
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': "XMLHttpRequest"
        }
    }
    const post = (path, data, headers) =>
        fetch(baseURL + path, {
            ...baseOptions,
            headers: {
                ...baseOptions.headers,
                ...headers
            },
            body: StringUtils.param(data)
        }).then((response) => {
            return response.json();
        });
    const put = (path, data, headers) =>
        fetch(baseURL + path, {
            ...baseOptions,
            method:'PUT',
            headers: {
                ...baseOptions.headers,
                ...headers
            },
            body: StringUtils.param(data)
        }).then((response) => {
            return response.json();
        });
    const del = (path, data, headers) =>
        fetch(baseURL + path, {
            ...baseOptions,
            method:'DELETE',
            headers: {
                ...baseOptions.headers,
                ...headers
            },
            body: StringUtils.param(data)
        }).then((response) => {
            return response.json();
        });
    const get = (path, data, headers) =>
        fetch(baseURL + path+"?"+StringUtils.param(data), {
            ...baseOptions,
            method:'GET',
            headers: {
                ...baseOptions.headers,
                ...headers
            }
        }).then((response) => {
            return response.json();
        });        
    const login = (username, password, captcha) =>
        fetch(baseURL + config.api.login, {
            ...baseOptions,
            body: 'username=' + username + '&password=' + password + '&captcha=' + captcha
        })
        .then((response) => {
                return response.json();
        }).catch(error=>{
            return false
        });
    const register = (username, password, captcha, mobile) =>
        fetch(baseURL + config.api.register, {
            ...baseOptions,
            body: 'username=' + username + '&password=' + password + '&mobileCaptcha=' + captcha + '&mobile=' + mobile
        })
            .then((response) => {
                return response.json();
            });

    const mobileCaptcha = (captcha, mobile) =>
        fetch(baseURL + config.api.mobileCaptcha, {
            ...baseOptions,
            body: '&captcha=' + captcha + '&mobile=' + mobile
        })
            .then((response) => {
                return response.json();
            });

    const checkVersion = () =>
        fetch(baseURL + config.api.getVersion, {
            ...baseOptions,
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.state === 1) {
                    return {
                        hasNewVersion: DeviceInfo.getBuildNumber() < data.data.version,
                        url: data.data.url
                    }
                }
                else
                    throw new Error(data.message)
            })
    const fetchHomepageInfo = () =>
        fetch(baseURL + config.api.homepage, {
            ...baseOptions,
        })
            .then(response => {
                return response.json();
            })


    return {
        post,get,put,del, login, register, mobileCaptcha, checkVersion, fetchHomepageInfo
    }

}
export default publicAPI;