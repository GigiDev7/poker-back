export default function errorHandler(err, req, res, next) {
  if (err.name === "NotFound Error") {
    res.status(404).json({ msg: err.message });
  } else if (err.name === "Authentication Error") {
    res.status(403).json({ msg: err.message });
  } else if (err.code == 11000) {
    res.status(400).json({ msg: "User already exists" });
  } else {
    res.status(500).json({ msg: err.message || "Something went wrong" });
  }
}
