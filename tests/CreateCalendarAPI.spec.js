const { test } = require('@playwright/test');
const axios = require('axios');
const ExcelJS = require('exceljs');

const accessToken = 'EwCAA8l6BAAUbDba3x2OMJElkF7gJ4z/VbCPEz0AAYMCzNycfoSWh1fIcF17ChaaknGiIfvMNnwaL41qHA6fBJkQtJRAxyYg+ht23x10YeTZPSugOiwIxfte4kGzfPaPcYZMYANaTBJ7jcjEC3zjK4fIc9OfPgj00z4YSBTem4HDcuVdr+CBfVY+NJOVLVQcS/Z11152QS6NgAiDAuAghvkcfhK98ML3uuNlZ6EerkPE/AZyFzcu1FweTQFc8saJe/+vjuSKvJdFOITMFLr83epLHSeYgyGTCs+YyhBcJJQvqXYIWXIs2+MXs/1X0gkl+4bIeQuGs04G3Rikov1xhcopMFeMB8nsTgBT0Nky55v2IcHCeZzfwUe7YdwizA8DZgAACFmcd4y55J7IUALPk0wUHfwOGU+eoxedjBBGoV0JuShckf3d7oJ8HyV56s7kAJHDq62BH/AN7jse6ytjjHLfDmeVXo+fi8kJRbNelAloGjDpYJaRkSWzLN9rTW0l98bhvqNMXsr7FUhy0iGFQRnHcQwjU9BRP82LKe7Nmg7yh3O1pT6iGa/CDCX5fQIkPYpV9ZpbgrXSoqj4uHjm4WqR8C0VDWa9iNbAsimt6Ky4jfFBhFztgiE4F7Bd2Tri1gwc4AgefHPDFon8LD9HSCACIqkfODH2jSdOiSal3fn5SaLgnZhy4ruY2/8huIitOPmYrKUAnavLgdUIzqLaq6fjWXet2WoBV+5Yti0FPOBTYiZ5oWQJtGR9wYYWL2rhNGKCuw0EREt7TMSGn48KdzIoozDgh6zRKz0NeNS8OetGRkXKDLIAw9C+uQrfHy8E/LrApBA6DNJV5VAWwkvJ3PAX1SyBmo0S/ufig1MhF6EewED0iM+vS0z+jfqQoZfJgRp0kYuSgddXLnslN5LoyMTzahmmJY5DWDd9wI+6e9J85iDPc7VqUugEZ3BOoGwKK16BE8l4MNRqCsCVTVplGWVmHuttP4vMCxRcYNMu/YBB/CbNEhX4UawOPeqd+9gdy9Z9RbQ4HQ4Dh5Qg3luG4K8PCes6VVHK/bLLOJCpgu2j9c2EzZ3c5Xu7GVBipkg7RwMXWvgIsyRVIzG/lFeBefV+DRJov4SB86YQx0xpyrU8TMnDfx8ooNh0g4eCxy7FwJHSgkXlodBAuCXHFElBD5BoGZeCL7Jrz3rX4qVfnAI='; // Replace with your actual access token
const apiUrl = 'https://graph.microsoft.com/v1.0/me/calendars';

//Create Calendars
async function createCalendars() {
  const results = [];
  for (let i = 5; i < 7; i++) {
    const calendarName = `Volunteer ${i + 1}`;
    const startTime = Date.now();
    try {
      //Make the POST request to create calendar
      const response = await axios.post(
        apiUrl,
        { name: calendarName },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      console.log(`Created: ${calendarName}`);
      results.push({
        calendarName: calendarName,
        message: 'Created successfully',
        httpCode: response.status,
        responseTime: responseTime
      });
    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      console.error(`Failed to create: ${calendarName}`, error.response?.data || error.message);
      results.push({
        calendarName: calendarName,
        message: error.response?.data?.error?.message || error.message,
        httpCode: error.response?.status || 'N/A',
        responseTime: responseTime
      });
    }
  }
  return results;
}

async function exportToExcel(data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Calendars');

  worksheet.columns = [
    { header: 'Calendar Name', key: 'calendarName', width: 30 },
    { header: 'Message', key: 'message', width: 50 },
    { header: 'HTTP Code', key: 'httpCode', width: 15 },
    { header: 'Response Time in MS', key: 'responseTime', width: 20 }
  ];

  data.forEach(item => {
    worksheet.addRow(item);
  });

  await workbook.xlsx.writeFile('Calendars.xlsx');
  console.log('Exported to Calendars.xlsx');
}

test('Create and export 1000 calendars', async () => {
  const results = await createCalendars();
  await exportToExcel(results);


});
