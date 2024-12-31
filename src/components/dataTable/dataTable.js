/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { getFiles } from "../../services/fileServices";
import Table from 'react-bootstrap/Table';

export const DataTable = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [fileName, setFileName] = useState('');
  
    const fetchData = async () => {
      try {
        const result = await getFiles(fileName.trim());
        if (Array.isArray(result)) {
          const transformedData = result.flatMap(({ file, lines }) =>
            lines.map((line) => ({
              fileName: file,
              ...line,
            }))
          );
          setFilteredData(transformedData);
        } else {
          console.error('Invalid data format received from API:', result);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, [fileName]);
  
    return (
      <div className="app-container">
        <h1 className="app-header">Demo-toolbox-front</h1>
        <div className="filter-container">
          <input
            type="text"
            placeholder="Enter file name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="file-input"
          />
          <button onClick={fetchData} className="fetch-button">
            Fetch Data
          </button>
        </div>
        {filteredData.length > 0 ? (
          <Table striped bordered hover className="data-table">
            <thead className="table-header">
              <tr>
                <th className="table-header__column">File Name</th>
                <th className="table-header__column">Text</th>
                <th className="table-header__column">Number</th>
                <th className="table-header__column">Hex</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredData.map((row, index) => (
                <tr key={index} className="table-row">
                  <td className="table-cell">{row.fileName || 'N/A'}</td>
                  <td className="table-cell">{row.text || 'N/A'}</td>
                  <td className="table-cell">{row.number || 'N/A'}</td>
                  <td className="table-cell">{row.hex || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="no-data-message">No data available.</p>
        )}
      </div>
    );
};