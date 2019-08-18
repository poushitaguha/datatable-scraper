const Nightmare = require("nightmare");
const nightmare = Nightmare( {show:true} );
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
        let headers = [];
        Array.prototype.forEach.call(
        document.querySelectorAll('#example thead tr th'),
        element => headers.push(element.innerText)
        );
        let tableInfo = Array.prototype.map.call(
        document.querySelectorAll('#example tr'),
        function(tr) {
            let out = Array.prototype.map.call(
            tr.querySelectorAll('td'),
            td => td.innerHTML
            );
            let output = {};
            for (i in out) {
            output[headers[i]] = out[i];
            }
            return output;
        }
        );
        return [headers, tableInfo];
    })
  .end()
  .then(result => {
        let headers = [];
        result[0].forEach(i => {
        let item = new Object();
        item.id = i;
        item.title = i;
        headers.push(item);
        });
        const csvWriter = createCsvWriter({
        path: 'out.csv',
        header: headers
        });
        csvWriter
        .writeRecords(result[1])
        .then(() => console.log('The CSV file was written successfully'));
        console.log(result[1]);
  })
  .catch(error => {      
        console.error('Search failed:', error);
  })