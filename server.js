import express from 'express';
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 4000;
const PERCENT = process.env.PERCENT || 7.5;

const categories = [
  {name: "Food", type: "Exempted"},
  {name: "Transport", type: "Zero"},
  {name: "Properties", type: "Taxable"},
]

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.post('/calculate', (req, res) => {
  const { price, isVatInclusive, category } = req.body;
  // validate income value
  const validationError = validateIncome(price);
  if (validationError) {
    return res.status(400).json({ message: validationError, status: false });
  }
  // check product/service category to ascertain which type of vat to apply
  if(category){
    const cat = categories.find((cat) => cat.name === category)
    if(cat && cat?.type === "Exempted"){
      return res.status(400).json({
        message: "This product is exempted from tax and will not be able to claim vat credit.",
        data: {
          payable: Number(price),
          taxAmount: 0,
        },
        status: false
      });
    }

    if(cat && cat?.type === "Zero"){
      return res.status(400).json({
        message: "This product has zero tax",
        data: {
          payable: Number(price),
          taxAmount: 0,
        },
        status: false
      });
    }
  }
  const amount = isVatInclusive ? price / (1 + (PERCENT/100)) : price;
  const taxAmount = amount * (PERCENT / 100);
  const payable = amount + taxAmount;

  res.json({
    message: 'Tax calculation successful!',
    data: {
      payable: Number(payable.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      percent: PERCENT
    },
    status: true
  });
});

// validation function
function validateIncome(income) {
  if (!income) {
    return 'Income is required!';
  }
  if (isNaN(income)) {
    return 'Income must be a number!';
  }
  if (income <= 0) {
    return 'Income must be a positive number!';
  }
  if (income > 800000) {
    return 'Income must be less than 800,000 per annum';
  }
  return null;
}


app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
