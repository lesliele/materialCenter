
const axios = require('axios');
import config from '../config';

const axiosConfig = axios.create({
    baseURL: config.baseURL,
    timeout: 30000
});

axiosConfig.interceptors.request.use(config => {
    if (config.method == 'post') {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    return config;
})

export default axiosConfig;