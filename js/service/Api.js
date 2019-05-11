import { take, call, select, put } from 'redux-saga/effects';
import * as Actions from '../redux/action/index';
import _ from 'lodash';
import config from '../config/Config';
import StringUtils from '../utils/StringUtils'
import * as  FileUtils from '../utils/FileUtils'
import RNFetchBlob from 'rn-fetch-blob'
import * as mime from 'react-native-mime-types';

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
        .then(res=>{
            if(res.status!=200)
            {
                throw  new Error(res.status);
            }
            return res;
        })
        .then((response) => {
                return response.json();
        })
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

    const  uploadMessage=(msg) =>
        {
            files=
            [msg].map(msg=>{return {
            name:'files',
            filename:FileUtils.getFileName(msg.snd),
            data:RNFetchBlob.wrap(FileUtils.cleanLocalFilePath(msg.snd)),
            type:mime.lookup(FileUtils.getSuffix(msg.snd)) 
            }})
            
            return RNFetchBlob.fetch('POST',config.api.base+config.api.soundMsgUp, {
            // header...
            'Content-Type': 'multipart/form-data',
            'enctype': 'multipart/form-data'
            }, [
                // path是指文件的路径，wrap方法可以根据文件路径获取到文件信息
                ...files,
                { name: 'message', data: JSON.stringify(msg) },
                //... 可能还会有其他非文件字段{name:'字段名',data:'对应值'}
            ])
        }

    return {
        post,get,put,del, login, register, mobileCaptcha, checkVersion, fetchHomepageInfo,
        uploadMessage
    }

}
export default publicAPI;