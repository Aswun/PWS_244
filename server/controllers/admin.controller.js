const db = require("../config/db");

exports.create = (req, res) => {
  const { name, description, price } = req.body;
  db.query(
    "INSERT INTO api_products (name, description, price) VALUES (?, ?, ?)",
    [name, description, price],
    () => res.json({ message: "Product created" })
  );
};

exports.getAll = (req, res) => {
  db.query("SELECT * FROM api_products", (err, result) => {
    res.json(result);
  });
};

exports.update = (req, res) => {
  const { name, description, price } = req.body;
  db.query(
    "UPDATE api_products SET name=?, description=?, price=? WHERE id=?",
    [name, description, price, req.params.id],
    () => res.json({ message: "Updated" })
  );
};

exports.remove = (req, res) => {
  db.query(
    "DELETE FROM api_products WHERE id=?",
    [req.params.id],
    () => res.json({ message: "Deleted" })
  );
};
