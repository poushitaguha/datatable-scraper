const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: true });
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

nightmare
    .goto('https://www.google.com')
    .type('input[title="Search"]', 'datatables')
    .wait('input[type="submit"]')
    .click('input[type="submit"]')
    .evaluate(() => document.querySelector('.rc .r a').click())
    .wait('select[name="example_length"]')
    .select('select[name="example_length"]', 100).wait(2000)
    .evaluate(() => {
        let tableHeader = Array.prototype.map.call(
            document.querySelectorAll('#example thead tr th'),
            element => element.innerText
        );
        let tableInfo = Array.prototype.map.call(
            document.querySelectorAll('#example tbody tr'),
            element_tr => {
                let rowDataArray = Array.prototype.map.call(
                    element_tr.querySelectorAll('td'),
                    element_td => element_td.innerText
                );
                let rowDataObject = {};
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
        result[0].forEach(element => {
            let item = new Object();
            item.id = element;
            item.title = element;
            header.push(item);
        });
        const csvWriter = createCsvWriter({
            path: 'datatables_output.csv',
            header: header
        });
        csvWriter
            .writeRecords(result[1])
            .then(() => console.log('The CSV file has been written successfully'));
        console.log(result[0]);
        console.log(result[1]);
    })
    .catch(error => {
        console.error('Search failed:', error);
    })