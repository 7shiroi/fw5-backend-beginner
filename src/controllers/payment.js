const midtransClient = require('midtrans-client');
const responseHandler = require('../helpers/responseHandler');
const userModel = require('../models/user');
const historyModel = require('../models/history');

const { MIDTRANS_SERVER_KEY } = process.env;

exports.payment = async (req, res) => {
  try {
    const transactionData = await historyModel.getHistoryAsync(req.body.idHistory);
    if (transactionData.length === 0) {
      return responseHandler(res, 400, 'Transaction is not found');
    }
    const user = await userModel.getUserAsync(req.user.id);

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: MIDTRANS_SERVER_KEY,
    });

    const parameter = {
      transaction_details: {
        order_id: `order-${transactionData[0].booking_code}`,
        gross_amount: Math.round(transactionData[0].subtotal),
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: user[0].name.split(' ')[0],
        last_name: user[0].name.split(' ').slice(1).join(' '),
        email: user[0].email,
        phone: user[0].phone_number,
      },
    };
    const data = await snap.createTransaction(parameter);

    return responseHandler(res, 200, 'Payment redirect data', data);
  } catch (error) {
    return responseHandler(res, 500, 'Unexpected Error', error);
  }
};
