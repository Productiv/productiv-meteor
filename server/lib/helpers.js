
sendError = function(res, err) {
  res.statusCode = 500;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");

  if(typeof err === 'object' || typeof err === 'array')
    err = JSON.stringify(err);
  else
    err = err.toString();

  res.end(err);
};

sendJson = function(res, obj) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  res.end(JSON.stringify(obj));
};
