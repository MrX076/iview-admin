/**
 * Created by superman on 17/2/16.
 * http配置
 */

import axios from 'axios';
import store from './store/index';
import * as types from './store/types';
import router from './router';
import Cookies from 'js-cookie';

// axios 配置
axios.defaults.timeout = 10000;
// axios.defaults.baseURL = 'https://api.github.com';

// http request 拦截器
axios.interceptors.request.use(
    config => {
        let token = Cookies.get('token');
        // console.log('http interceptor ' + token);
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `bearer ${token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 401 清除token信息并跳转到登录页面
                    store.commit(types.LOGOUT);
                    router.replace({
                        path: '/login',
                        query: {redirect: router.currentRoute.fullPath}// 登录成功后跳入浏览的当前页面
                    });
            }
        }
        // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
        return Promise.reject(error.response.data);
    });

export default axios;
