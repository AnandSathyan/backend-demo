console.log('#################### InitiatePayment ########################');
var request = require("request");
var token = 'mytokenvalue'; // Place your actual token here
var baseURL = 'https://apitest.myfatoorah.com';

// Initiate Payment request
var initiateOptions = {
  method: 'POST',
  url: baseURL + '/v2/InitiatePayment',
  headers: {
    Accept: 'application/json',
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: { 
    InvoiceAmount: 100, 
    CurrencyIso: 'KWD' 
  },
  json: true
};

// Log request headers for debugging
console.log('Request Headers:', initiateOptions.headers);

request(initiateOptions, function (error, response, body) {
  if (error) {
    console.error('Error in InitiatePayment:', error);
    return;
  }

  // Log the response body and status code
  console.log('Response Body:', body);
  console.log('Status Code:', response.statusCode);

  if (response.statusCode === 200) {
    console.log('#################### ExecutePayment ########################');

    var executeOptions = {
      method: 'POST',
      url: baseURL + '/v2/ExecutePayment',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: {
        PaymentMethodId: '2',
        CustomerName: 'Ahmed',
        DisplayCurrencyIso: 'KWD',
        MobileCountryCode: '+965',
        CustomerMobile: '12345678',
        CustomerEmail: 'xx@yy.com',
        InvoiceValue: 100,
        CallBackUrl: 'https://google.com',
        ErrorUrl: 'https://google.com',
        Language: 'en',
        CustomerReference: 'ref 1',
        CustomerCivilId: 12345678,
        UserDefinedField: 'Custom field',
        ExpiryDate: '',
        CustomerAddress: {
          Block: '',
          Street: '',
          HouseBuildingNo: '',
          Address: '',
          AddressInstructions: ''
        },
        InvoiceItems: [{ ItemName: 'Product 01', Quantity: 1, UnitPrice: 100 }]
      },
      json: true
    };

    request(executeOptions, function (error, response, body) {
      if (error) {
        console.error('Error in ExecutePayment:', error);
        return;
      }

      console.log('ExecutePayment Response:', body);
      console.log('Status Code:', response.statusCode);
    });

  } else {
    console.log('Payment initiation failed with status code:', response.statusCode);
  }
});
