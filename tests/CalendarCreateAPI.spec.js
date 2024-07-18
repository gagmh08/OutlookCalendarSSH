const { test } = require('@playwright/test'); 
const axios = require('axios'); 
const ExcelJS = require('exceljs'); 

// Define the access token and API URL for Microsoft Graph
const accessToken = 'EwCAA8l6BAAUbDba3x2OMJElkF7gJ4z/VbCPEz0AAWiRM7nlyLOZGTbd/PvneZ4i87trk+zk6xaYEFSj+Y4ur4xRzopX4AF5egiP53tmdVUyo5fuMUe91RRijgMq/+pN2C0zsWfc3yumcQDNlYzW+8qeHymufYXsHQnRama87wk34DuEvwxnat/FzIS4MV2AMBNiJU+920YsIhI7iraqRktcmkSHcx5zPUhy6NFQII0y73hhLK1gComevYtV8DFOuJOscZNPN6zacnIkjXzZY618TFdqJml++M1tZo5epfkb54gpv7TELU++qnthMIEmYANYPY0IPhpVsaczjkejwNDyer2BIW3IPRNIdWBRYNUZPi9M3Fr6m8JWT/mRlncDZgAACJ6gggpuwQg5UAKnuRBXCpOdjSIH5XsMTU4mcKS5pKxAJNcGSqSrn/rhQpkE8URdxtsUo3+s+Mm6ltYJnYZ/JYAI3f2LHlbZH+N6dM5idsAPS2C+LGIiX491Y0dNwcG7MKGTmoNNX19PhPei6AEZi68DbsiBHknk/IhE2Z0j2gu+VN3Hr3bN32XqCC8sPB4rhlix/UdpbrnO89JwuMITZ1XsjycCff7Mxb3DhT8wshv4yagdUtnL61LAF20LFiHLj5Jfn8piOdrs+4ZSqd8KjQsDTeDqnGeMD4I21Vhjidh84Q6u2di8nLsk9uYHRLVrIFIdtLncVA1FupgPYutgvgUn7ZgIqh8NIM099u16a/KEAAiSfVl7cEbqlBXQZslZS3tCeBD7Sbpu1QMuIK+UGnhMNzBODuufBFhtQEn5SZhopS8dNL9etl9oJycdItOOyDCTthPuf/WfxGVAXwqtDACOaaGjVuRcn2XAznP31I8aWU0gBIHh6IF6PXuaiOI0EUTpgjjsqnlEQ4AbJjLSLLUhozaIQE4D1ny9Itc7Pd1feje3t3exjW0N7uFVoZ4J7vVAZDX9Nw8bc+iIdJ2mENiwGQ5K7CXcFoBrKTbOyBoHIJz81npTXDFAeaCz6MH6fDEfDjuA1R9BoG/aYD1M17xy8r8Ydg7QrUkEm206w+Fv0MEFt+/aJCbwkADJ22YblUCF1u7caFc2EXkNMoNYAoAyKUXTuPrqR8zLOtY/2dOYkklRs363pzkNs3HBLAhC9TBT5LkHxcJAfpLoWXtjql1f/ZHeYwlxeMIGnAI='; // Replace with your actual access token
const apiUrl = 'https://graph.microsoft.com/v1.0/me/calendars';

// Axios interceptors to measure response time
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(config => {
  config.metadata = { startTime: new Date() };
  return config;
});

axiosInstance.interceptors.response.use(response => {
  response.config.metadata.endTime = new Date();
  response.duration = response.config.metadata.endTime - response.config.metadata.startTime;
  return response;
}, error => {
  error.config.metadata.endTime = new Date();
  error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
  return Promise.reject(error);
});

// Function to create calendars
async function createCalendars() {
  const results = []; // Array to store results of calendar creation
  for (let i = 855; i < 1000; i++) { 
    const calendarName = `Calendars ${i + 1}`; 
    try {
      // Make a POST request to create a calendar
      const response = await axiosInstance.post(
        apiUrl,
        { name: calendarName }, // Request body with the calendar name
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Authorization header with the access token
            'Content-Type': 'application/json' 
          }
        }
      );
      console.log(`Created: ${calendarName}, Time: ${response.duration} ms`); 
      // Store the result in the results array
      results.push({
        calendarName: calendarName,
        message: 'Created',
        httpCode: response.status,
        responseTime: response.duration
      });
    } catch (error) {
      // Log the error
      console.error(`Failed to create: ${calendarName}, Time: ${error.duration} ms`, error.response?.data || error.message);
      // Store the error result in the results array
      results.push({
        calendarName: calendarName,
        message: error.response?.data?.error?.message || error.message,
        httpCode: error.response?.status || 'N/A',
        responseTime: error.duration
      });
    }
  }
  return results; // Return the results array
}

// Function to export results to an Excel file
async function exportToExcel(data) {
  const workbook = new ExcelJS.Workbook(); // Create a new workbook
  const worksheet = workbook.addWorksheet('Calendars'); // Add a new worksheet

  // Define the columns for the worksheet
  worksheet.columns = [
    { header: 'Calendar Name', key: 'calendarName', width: 30 },
    { header: 'Message', key: 'message', width: 50 },
    { header: 'HTTP Code', key: 'httpCode', width: 15 },
    { header: 'Response Time in MS', key: 'responseTime', width: 20 }
  ];

  // Add rows to the worksheet from the data array
  data.forEach(item => {
    worksheet.addRow(item);
  });

  // Write the workbook to a file
  await workbook.xlsx.writeFile('Calendars.xlsx');
  console.log('Exported to Calendars.xlsx'); // Log the export success
}

// Playwright test to create and export calendars
test('Create and export 1000 calendars', async () => {
  test.setTimeout(36000000); // Set the test timeout to 10 hours (36000000 ms)
  let results = [];
  try {
    results = await createCalendars(); // Create calendars and get the results
  } catch (error) {
    console.error('An error occurred during calendar creation:', error);
  } finally {
    await exportToExcel(results); // Export the results to an Excel file
  }
});
