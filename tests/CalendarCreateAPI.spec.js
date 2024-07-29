const { test } = require('@playwright/test'); 
const axios = require('axios'); 
const ExcelJS = require('exceljs'); 

// Define the access token and API URL for Microsoft Graph
const accessToken = 'EwCAA8l6BAAUbDba3x2OMJElkF7gJ4z/VbCPEz0AAWiRM7nlyLOZGTbd/PvneZ4i87trk+zk6xaYEFSj+Y4ur4xRzopX4AF5egiP53tmdVUyo5fuMUe91RRijgMq/+pN2C0zsWfc3yumcQDNlYzW+8qeHymufYXsHQnRama87wk34DuEvwxnat/FzIS4MV2AMBNiJU+920YsIhI7iraqRktcmkSHcx5zPUhy6NFQII0y73hhLK1gComevYtV8DFOuJOscZNPN6zacnIkjXzZY618TFdqJml++M1tZo5epfkb54gpv7TELU++qnthMIEmYANYPY0IPhpVsaczjkejwNDyer2BIW3IPRNIdWBRYNUZPi9M3Fr6m8JWT/mRlncDZgAACEuu2KmzWxAIUAJKtvldekS2I9t5mnsGydox1o+8ndb7m3+ARaG+UFvR8ZvXeV6ylOUmUCY/ag385d5DkE6H4Gao1uorzKGyBUZiaMqzKBbeN9F7GghD3/SUrS1Q69Mo9r1QCfWXTZxfcjR7vSPnuM9VE6F1SdBSYoW1VVoOTYMKPu5iZqt2qJG1i/NeK/aLTLhd/Z0trzHQqu5DrKl8bwHJMaDyOJzlOx5kya7gQLPO02aWMVnL2XDBCOkENTyIU9LN5T3m3dq8K3zh0s28FJufvho5LmW4cOgmuzpV96fanlNJXPtplilw12k0P/Nj9RUyEgfyIjzOFi0neqvmEWfAfbPqYo6OklxkgGSZ+TWEWpxJN45fihDS88AjOYjnMzMrWKL22n/b6q9YEc0kYQMVfyLA4ATlnVg2QbxVI4VLE7gnMO2TPZNH0yFug0KKrCTIKWPwqpZDJqLTQI10S4a9cFmmysUbdmCXOsApeDY1lA+rTgaWoH3VaXJ1zj301DNCqpZtvEZJnO50ZmEIbYEVMGlsuATh7kSa6jgqXi87rM3sDhirRp0AaujR1ULCJsDQ1dyTH7BRUaAmQrBve1XdvZ3C827fdBvdScH/wrDV8Hm/+kPDOjuiy8LASStpXWrJSdFGLad51fThmhgY9fW18MR/s/dZcC7Pn118MsGGpfKGq0MkHLgeCdz77bjnNPd3Finm/6yytTi8UeqlQwa5UkEhf2TvmOQZhkDsvxlXx3hw8YtsM7N7DUkHoc8+DVvHQh7jq3IyWnkfJJOwQM61wEhc9aB0Y131nAI='; // Replace with your actual access token
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
  for (let i = 2912; i < 3000; i++) { 
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
