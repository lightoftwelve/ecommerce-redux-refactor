const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const secret = "mysecretssshhhhhhh";
const expiration = "2h";

module.exports = {
  AuthenticationError: new GraphQLError("Could not authenticate user.", {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  }),
  authMiddleware: function ({ req }) {
    console.log("Headers:", req.headers); // Log all headers

    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    console.log("Token arriving at server:", token); // Log the token

    if (!token) {
      return req;
    }

    try {
      const decoded = jwt.decode(token, { complete: true }); // Decode without verifying
      console.log("Decoded token:", decoded);
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (error) {
      console.log("Token validation error:", error.message); // Log the error message
    }

    return req;
  },
  signToken: function ({ firstName, email, _id }) {
    const payload = { firstName, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
