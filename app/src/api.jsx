import axios from 'axios';
const URL_BASE = process.env.REACT_APP_API_BASE_URL;
console.log('URL_BASE', URL_BASE);
const createManyHiredEmployees=(data)=>{
    return axios.post(URL_BASE+'/api/hiredEmployees/collection', data);
}
const createManyDepartments=(data)=>{
    return axios.post(URL_BASE+'/api/departments/collection', data);
}
const createManyJobs=(data)=>{
    return axios.post(URL_BASE+'/api/jobs/collection', data);
}
const getYears = ()=>{
    return axios.get(URL_BASE+'/api/years');
}
const getReporte1 = (year)=>{
    return axios.get(URL_BASE+`/api/hiredEmployees/${year}/reporte1`);
};
const getReporte2 = (year)=>{
    return axios.get(URL_BASE+`/api/hiredEmployees/${year}/reporte2`);
};
export {createManyHiredEmployees, createManyDepartments, createManyJobs, getYears, getReporte1, getReporte2};