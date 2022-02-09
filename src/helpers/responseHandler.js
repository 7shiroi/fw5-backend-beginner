// eslint-disable-next-line max-len
const responseHandler = (res, status = 200, message = null, data = null, error = null, pageinfo = null) => {
  let success = true;
  if (status >= 400) {
    success = false;
  }
  const jsonRes = {
    success,
  };
  if (message) {
    jsonRes.message = message;
  }
  if (error) {
    jsonRes.error = error;
  }
  if (pageinfo) {
    jsonRes.pageinfo = pageinfo;
  }
  if (data) {
    jsonRes.result = data;
  }
  return res.status(status).json(jsonRes);
};

module.exports = responseHandler;
