import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorPage from "./components/error-page";
import HiredEmployeesPerDepartmentPerYearAboveAverage from './components/hired-employees-per-department-per-year-above-average';
import HiredEmployeesPerDepartmentForEachQuaterPerYear from './components/hired-employees-per-department-for-each-quater-per-year';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Departments from './components/departments';
import Jobs from './components/jobs';
import HiredEmployees from './components/hired-employees';
console.log(process.env);
console.log("Hola");
const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "reporte1",
                element: <HiredEmployeesPerDepartmentForEachQuaterPerYear/>,
            },
            {
                path: "reporte2",
                element: <HiredEmployeesPerDepartmentPerYearAboveAverage/>,
            },
            {
                path: "/departments",
                element: <Departments/>,
            },
            {
                path: "/jobs",
                element: <Jobs/>,
            },
            {
                path: "/hired-employees",
                element: <HiredEmployees/>,
            }
        ],
    },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);
