export const auth = (req, res, next) => {
  if (req.session.user) {
    return res.status(401).json({ error: "You are already logged in" });
  }

  next();
};
