const { OAuth2Client } = require('google-auth-library');

const restrict = {
  // Restrict access to a route to authenticated users
  auth: async (req, res, next) => {
    try {
      // Get the token from the request
      const token = req.headers["authorization"].split(" ")[1];

      // Verify the token
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      // Get user info
      const payload = ticket.getPayload();

      // Attach the user to the request
      req.user = payload;
      next();
    } catch (err) {
      console.error(err);
      // Send 401 status code
      res.status(401).json({
        status: "error",
        message: "Kode akses tidak valid",
      });
    }
  },
};

module.exports = restrict;
