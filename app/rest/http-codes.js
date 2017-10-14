/**
 * Contains HTTP status codes.
 *
 * @module app/rest/HTTPCodes
 * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
 * @see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 */
module.exports = {
  // 1xx Informational
  continue          : 100,
  switchingProtocols: 101,
  processing        : 102,

  // 2xx Success
  ok                         : 200,
  created                    : 201,
  accepted                   : 202,
  nonAuthoritativeInformation: 203,
  noContent                  : 204,
  resetContent               : 205,
  partialContent             : 206,
  multiStatus                : 207,
  alreadyReported            : 208,
  imUsed                     : 226,

  // 3xx Redirection
  multipleChoices  : 300,
  movedPermanently : 301,
  found            : 302,
  seeOther         : 303,
  notModified      : 304,
  useProxy         : 305,
  switchProxy      : 306,
  temporaryRedirect: 307,
  permanentRedirect: 308,

  // 4xx Client Errors
  badRequest                 : 400,
  unauthorized               : 401,
  paymentRequired            : 402,
  forbidden                  : 403,
  notFound                   : 404,
  methodNotAllowed           : 405,
  notAcceptable              : 406,
  proxyAuthenticationRequired: 407,
  requestTimeout             : 408,
  conflict                   : 409,
  gone                       : 410,
  lengthRequired             : 411,
  preconditionFailed         : 412,
  payloadTooLarge            : 413,
  uriTooLong                 : 414,
  unsupportedMediaType       : 415,
  rangeNotSatisfiable        : 416,
  expectationFailed          : 417,
  imATeapot                  : 418,
  misdirectedRequest         : 421,
  unprocessableEntity        : 422,
  locked                     : 423,
  failedDependency           : 424,
  upgradeRequired            : 426,
  preconditionRequired       : 428,
  tooManyRequests            : 429,
  requestHeaderFieldsTooLarge: 431,
  unavailableForLegalReasons : 451,

  // 5xx Server Errors
  internalServerError          : 500,
  notImplemented               : 501,
  badGateway                   : 502,
  serviceUnavailable           : 503,
  gatewaytimeout               : 504,
  httpVersionNotSupported      : 505,
  variantAlsoNegotiates        : 506,
  insufficientStorage          : 507,
  loopDetected                 : 508,
  notExtended                  : 510,
  networkAuthenticationRequired: 511
};
