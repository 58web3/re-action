const mockRequest = (params = {},
    body = {},
    query = {},
    headers = {},
    user = {}) => ({
  params,
  body,
  query,
  headers,
  user,
});

const mockResponse = () => {
  const res = {statusCode: null};
  res.status = (statusCode) => {
    res.statusCode = statusCode;
    return res;
  };
  res.json = (data) => {
    res.data = data;
    return res;
  };
  return res;
};

module.exports = {
  mockRequest,
  mockResponse,
};
