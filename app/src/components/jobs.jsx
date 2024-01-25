import React, { useState} from 'react';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import {createManyJobs} from '../api';
function Jobs() {
    const [file, setFile] = useState(null);
    const [jsonData, setJsonData] = useState(null);
    const [responseData, setResponseData] = useState(null);
    const [show, setShow] = useState(true);
    const [messageAlert, setMessageAlert] = useState();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const convertToJSON = () => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const csvData = event.target.result;
            const lines = csvData.split('\n');
            const newJsonData = [];

            for (let i = 0; i < lines.length; i++) {
                const currentLine = lines[i].split(',');
                const obj = {};
                if(currentLine.length ===2) {
                obj["id"]=parseInt(currentLine[0]);
                obj["name"]=currentLine[1];
                newJsonData.push(obj);
                }
            }
            setResponseData(null);
            setJsonData(newJsonData);

        };
        reader.readAsText(file);
    };

    const sendData = (data) => {
        createManyJobs(data)
            .then((response) => {
                console.log(response.data);
                setResponseData(response.data.invalidData);
                if (response.data.count > 0) {
                    setMessageAlert(<Alert variant="success" onClose={() => setShow(false)} dismissible>
                        <Alert.Heading>Congratulations!</Alert.Heading>
                        <p>You have successfully created and saved {response.data.count} job{`(s)`}. 
                            Your data is now securely stored.</p>
                    </Alert>);
                    setShow(true);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleSendData = () => {
        if (jsonData) {
            const batchSize = 1000;
            const totalRows = jsonData.length;
            let startIndex = 0;

            while (startIndex < totalRows) {
                const endIndex = Math.min(startIndex + batchSize, totalRows);
                const batchData = jsonData.slice(startIndex, endIndex);
                sendData(batchData);
                startIndex += batchSize;
            }
        }
    }

    return (
        <Container className='py-4'>
            {messageAlert && messageAlert}
            <Row>
                <h1>Jobs</h1>
                <Form>
                    <Form.Group className='py-2'>
                        <Form.Label>Upload CSV File</Form.Label>
                        <Form.Control type="file" accept=".csv" onChange={handleFileChange} />
                    </Form.Group>
                    <Form.Group className='py-2'>
                        <Button variant='secondary' onClick={convertToJSON}>Preview</Button>
                        <Button className='mx-1' value="primary" onClick={handleSendData}>Save</Button>
                    </Form.Group>
                </Form>
            </Row>
            <Row className='py-2'>

                {!responseData &&
                    <div>
                        <p className='h3'>Preview</p>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jsonData && jsonData.map((data) => {
                                    return (
                                        <tr>
                                            <td>{data.id}
                                            </td>
                                            <td>{data.name}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </div>
                }
            </Row>
            <Row className='py-2'>

                {responseData &&
                    <div>
                        <h1>Invalid Data</h1>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {responseData && responseData.map((data) => {
                                    return (
                                        <tr>
                                            <td>
                                                <div>{data.id}</div>
                                                <div className='text-danger'>{data.errors && data.errors.id}</div>
                                            </td>
                                            <td>
                                                <div>{data.name}</div>
                                                <div className='text-danger'>{data.errors && data.errors.name}</div>

                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </div>
                }
            </Row>
        </Container>
    );
}

export default Jobs;
