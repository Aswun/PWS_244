const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

exports.getProducts = (req, res) => {
  db.query("SELECT * FROM api_products", (err, result) => {
    res.json(result);
  });
};

exports.generateKey = (req, res) => {
  const apiKey = uuidv4();
  const { api_product_id } = req.body;

  db.query(
    "INSERT INTO api_keys (user_id, api_product_id, api_key) VALUES (?, ?, ?)",
    [req.user.id, api_product_id, apiKey],
    () => res.json({ apiKey })
  );
};

exports.getKeys = (req, res) => {
  db.query(
    "SELECT * FROM api_keys WHERE user_id=?",
    [req.user.id],
    (err, result) => res.json(result)
  );
};
