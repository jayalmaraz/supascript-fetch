module.exports.fetch = function (url, init) {
  const options = {
    method: init.method ?? "GET", // *GET, POST, PUT, DELETE, etc.
    mode: init.mode ?? "cors", // no-cors, *cors, same-origin
    cache: init.cache ?? "default", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: init.credentials ?? "same-origin", // include, *same-origin, omit
    headers,
    redirect: init.redirect ?? "follow", // manual, *follow, error
    referrerPolicy: init.referrerPolicy ?? "no-referrer-when-downgrade", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body, // body data type must match "Content-Type" header
  };

  const content = JSON.stringify(body);
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
      `select * from http(('PUT','${url}','${headers}','${
        content_type || "application/x-www-form-urlencoded"
      }', '${params}'))`
    )[0];
  }

  if (options.method === "DELETE") {
    return sql(
      `select * from http(('DELETE','${url}','${headers}', null, null))`
    )[0];
  }

  if (options.method === "PATCH") {
    return sql(
      `select * from http(('PATCH','${url}','${headers}','${
        content_type || "application/x-www-form-urlencoded"
      }', '${params}'))`
    )[0];
  }

  throw new Error("Invalid method provided");
};

function stringifyHeaders(headers) {
  const keys = Object.keys(headers);
  return keys.reduce((prev, current, index) => {
    const value = headers[current];
    return (
      prev +
      `\"(${current},\\\"${value}\\\")\"${
        index === keys.length - 1 ? "}" : ","
      }`
    );
  }, "{");
}
