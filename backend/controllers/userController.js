export const getProfile = (req, res) => {
  res.status(200).json({
    message: "Welcome to CampusConnect",
    user: req.user,
  });
};