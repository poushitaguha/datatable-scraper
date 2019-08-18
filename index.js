const Nightmare = require("nightmare");
const nightmare = Nightmare( {show:true} );

nightmare
  .goto('https://www.google.com')
  .type('input[title="Search"]', 'datatables')
  .wait('input[type="submit"]')
  .click('input[type="submit"]')
  .evaluate(() => document.querySelector('.rc .r a').click())
  .wait('select[name="example_length"]')
  .select('select[name="example_length"]', 100).wait(2500)
  .evaluate(() => document.getElementById('example').rows)
  .end()
  .then(result => {
      console.log(result);
  })
  .catch(error => {
    console.error('Search failed:', error)
  })

