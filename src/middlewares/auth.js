const userAuth = (req, res, next) => {
  const authtoken = "xydz";
  if (authtoken === "xyz") {
    next();
  } else {
    res.status(401).send("this is unauthorized");
  }
};

module.exports = {
  userAuth,
};
