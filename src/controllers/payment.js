const axios = require('axios');
const responseHandler = require('../helpers/responseHandler');
const userModel = require('../models/user');
const historyModel = require('../models/history');

exports.payment = async (req, res) => {
  try {
    const transactionData = await historyModel.getHistoryAsync(req.body.idHistory);
    if (transactionData.length === 0) {
      return responseHandler(res, 400, 'Transaction is not found');
    }
    const user = await userModel.getUserAsync(req.user.id);
    const { data } = await axios({
      url: 'https://app.sandbox.midtrans.com/snap/v1/transactions',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization:
          `Basic ${
            Buffer.from('SB-Mid-server-GwUP_WGbJPXsDzsNEBRs8IYA').toString('base64')}`,
        // Above is API server key for the Midtrans account, encoded to base64
      },
      data:
      // Below is the HTTP request body in JSON
      {
        transaction_details: {
          order_id: `order-csb-${Date.now()}`,
          gross_amount: Math.round(transactionData[0].subtotal),
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          name: user[0].name,
          email: user[0].email,
          phone: user[0].phone_number,
        },
      },
    });

    return responseHandler(res, 200, 'Payment redirect data', data);
  } catch (error) {
    return responseHandler(res, 500, 'Unexpected Error', error);
  }
};
