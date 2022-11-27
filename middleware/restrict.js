const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const client = jwksClient({
  jwksUri: "https://www.googleapis.com/oauth2/v3/certs",
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const restrict = {
  // Restrict access to a route to authenticated users
  auth: (req, res, next) => {
    // If token invalid, send error
    if (
      !req.headers["authorization"] ||
      !req.headers["authorization"].startsWith("Bearer ")
    ) {
      res.status(401).json({
        status: "error",
        message: "Authorization header invalid",
      });
    } else {
      // Get the token from the request
      const token = req.headers["authorization"].split(" ")[1];

      // Verify the token
      jwt.verify(token, getKey, {}, function (err, decoded) {
        // If token valid, continue
        if (!err && decoded.exp * 1000 > Date.now()) {
          // Attach the user to the request
          req.user = decoded;
          next();
        } else {
          // If token invalid, send error
          res.status(401).json({
            status: "error",
            message: "Invalid token",
          });
        }
      });
    }
  },
};

module.exports = restrict;
