import React,{useState, useEffect} from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { URL_BASE } from '../constants';
const HiredEmployeesPerDepartmentForEachQuaterPerYear=()=> {
    const [years, setYears] = useState([]);
    const [resultData, setResultData] = useState(null);
    useEffect(() => {
        axios.get(URL_BASE+'/api/years')
        .then(response => {
                let data=[];
                response.data.forEach(element => data.push(element.year));
                // console.log(data);
                setYears(data);
            })
            .catch(error => {
                console.error(error);
            });
            return;
    },[]);

    const handleSubmit = () => {
        const yearSelect = document.getElementById('yearSelect');
        // console.log(selectedYear);
        axios.get(URL_BASE+`/api/hiredEmployees/${yearSelect.value}/reporte1`)
            .then(response => {
                if(response.data.length===0){
                    setResultData(null);
                    return;
                }
                setResultData(response.data);
                // console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    };
    
    return (
        <Container className='py-4'>
            <Row className='py-2'>
            <div className='h2'>Hired Employees By Department</div>
            <form>
                <div className="form-group">
                    <Form.Select id="yearSelect" onChange={handleSubmit}>
                        <option disabled>Select Year:</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </Form.Select>
                </div>
                {/* <button type="submit" className="btn btn-primary my-2">Submit</button> */}
            </form>
            </Row>
            <Row className='py-2'>

            <div className='h4'>Results</div>
            <Table striped bordered hover className='mx-2 py-2'>
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Job</th>
                        <th>Q1</th>
                        <th>Q2</th>
                        <th>Q3</th>
                        <th>Q4</th>
                    </tr>
                </thead>
                <tbody>
                    {resultData && (resultData.map((e, index) =>
                        <tr key={index}>
                            <td>{e.department}</td>
                            <td>{e.job}</td>
                            <td>{e.q1}</td>
                            <td>{e.q2}</td>
                            <td>{e.q3}</td>
                            <td>{e.q4}</td>
                        </tr>
                    ))}
                    {!resultData && <tr>
                        <td colSpan={6} className='py-3 text-center'>
                    No records found.
                        </td>
                    </tr>}
                </tbody>
            </Table>
            </Row>
        </Container>
    );
};

export default HiredEmployeesPerDepartmentForEachQuaterPerYear;
