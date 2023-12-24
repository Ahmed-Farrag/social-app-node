const responseCreate = (status, data, message) => {
  return {
    apiStatus: status,
    data,
    message,
  };
};
module.exports = responseCreate;
