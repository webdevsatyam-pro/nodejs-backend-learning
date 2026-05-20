const authentication = (req, res, next) => {
  if (!req.headers.authentication) {
    res.status(401).json({ eror: "No token supplied , Login Again!!" });
  }
  return;
};

const token = req.headers.authentication.replace("Bearer", "");
console.log(token);

const output = Jwt.verify(token, process.env.TOKEN_SECRET);
console.log(output);
req.user = output;
next();

export { authentication };
