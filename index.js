const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: true });
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

nightmare
    .goto('https://www.google.com')     // Navigate to Google URL
    .type('input[title="Search"]', 'datatables')    // Search for 'datatables' in Google
    .wait('input[type="submit"]')
    .click('input[type="submit"]')
    .evaluate(() => document.querySelector('.rc .r a').click())     // Select the first result (https://datatables.net) and click on it
    .wait('select[name="example_length"]')
    .select('select[name="example_length"]', 100).wait(2000)    // Filter table entries by 100 and wait for 2 secs
    .evaluate(() => {
        // Populate table header into array
        let tableHeader = Array.prototype.map.call(
            document.querySelectorAll('#example thead tr th'),
            element => element.innerText
        );
        // Populate table row data into array
        let tableInfo = Array.prototype.map.call(
            document.querySelectorAll('#example tbody tr'),
            element_tr => {
                let rowDataArray = Array.prototype.map.call(
                    element_tr.querySelectorAll('td'),
                    element_td => element_td.innerText
                );
                let rowDataObject = {};
                // Convert row data into an array of objects
                for (let i in rowDataArray) {
                    rowDataObject[tableHeader[i]] = rowDataArray[i];
                }
                return rowDataObject;
            });
        return [tableHeader, tableInfo];
    })
    .end()
    .then(result => {
        let header = [];
        // Create table header for CSV file
        result[0].forEach(element => {
            let item = new Object();
            item.id = element;
            item.title = element;
            header.push(item);
        });
        // Create CSV file path and write table header to CSV file
        const csvWriter = createCsvWriter({
            path: 'datatables_output.csv',
            header: header
        });
        // Write table row data to CSV file
        csvWriter
            .writeRecords(result[1])
            .then(() => console.log('The CSV file has been written successfully'));
        console.log(result[0]);
        console.log(result[1]);
    })
    .catch(error => {
        console.error('Search failed:', error);
    })