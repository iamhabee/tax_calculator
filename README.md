# tax_calculator
<!-- How to start the project -->
1. Clone the project `git clone https://github.com/iamhabee/tax_calculator.git`
2. Install dependencies `npm install`
3. Run the project `node server.js`

<!-- How to use the project -->
1. Send a POST request to `http://localhost:3000/calculate-tax` with the following JSON body:
```json
{
  "price": 50000,
  "isVatInclusive": true
}
```
2. The server will respond with the calculated tax:
```json
message: 'Tax calculation successful!',
    data: { "payable": 50000, "taxAmount": 3488.37, "percent": 7.5 },
    status: true
```