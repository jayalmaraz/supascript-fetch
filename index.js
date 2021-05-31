module.exports = function (url, init) {
  const content_type = _tern(
    init.headers,
    undefined,
    "application/json",
    _tern(
      init.headers["Content-Type"],
      undefined,
      "application/json",
      init.headers["Content-Type"]
    )
  );
  const options = {
    method: _co(init.method, "GET"), // *GET, POST, PUT, DELETE, etc.
    mode: _co(init.mode, "cors"), // no-cors, *cors, same-origin
    cache: _co(init.cache, "default"), // *default, no-cache, reload, force-cache, only-if-cached
    credentials: _co(init.credentials, "same-origin"), // include, *same-origin, omit
    headers: {
      ...init.headers,
      "Content-Type": content_type,
    },
    redirect: _co(init.redirect, "follow"), // manual, *follow, error
    referrerPolicy: _co(init.referrerPolicy, "no-referrer-when-downgrade"), // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: init.body, // body data type must match "Content-Type" header
  };

  const content = JSON.stringify(options.body);
  const headers = stringifyHeaders(options.headers);

  if (options.method === "GET") {
    return sql(
      `select * from http(('GET','${url}','${headers}', null, null))`
    )[0];
  }

  if (options.method === "POST") {
    return sql(
      `select * from http(('POST','${url}','${stringifyHeaders(
        headers
      )}', '${content_type}', '${content}'))`
    )[0];
  }

  if (options.method === "PUT") {
    return sql(
      `select * from http(('PUT','${url}','${headers}','${content_type}', '${content}'))`
    )[0];
  }

  if (options.method === "DELETE") {
    return sql(
      `select * from http(('DELETE','${url}','${headers}', null, null))`
    )[0];
  }

  if (options.method === "PATCH") {
    return sql(
      `select * from http(('PATCH','${url}','${headers}','${content_type}', '${content}'))`
    )[0];
  }

  throw new Error("Invalid method provided");
};

function _co(value, fallback) {
  if (value) return value;
  return fallback;
}

function _tern(value, target, a, b) {
  if (value === target) return a;
  return b;
}

function stringifyHeaders(headers) {
  const keys = Object.keys(headers);
  return keys.reduce((prev, current, index) => {
    const value = headers[current];
    return (
      prev +
      `\"(${current},\\\"${value}\\\")\"${_tern(
        index,
        keys.length - 1,
        "}",
        ","
      )}`
    );
  }, "{");
}
