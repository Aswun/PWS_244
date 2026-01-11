const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

exports.getProducts = (req, res) => {
  db.query("SELECT * FROM api_products", (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};

exports.buyProduct = (req, res) => {
  const api_product_id = Number(req.body.api_product_id); // Pastikan angka
  const sql = "INSERT INTO transactions (user_id, api_product_id, status) VALUES (?, ?, 'pending')";
  db.query(sql, [req.user.id, api_product_id], (err) => {
    if (err) return res.status(400).json({ message: "Produk sudah ada di keranjang atau sudah dibeli." });
    res.json({ message: "Pesanan dibuat, silakan bayar." });
  });
};

exports.payProduct = (req, res) => {
  const api_product_id = Number(req.body.api_product_id);
  const sql = "UPDATE transactions SET status = 'paid' WHERE user_id = ? AND api_product_id = ? AND status = 'pending'";
  db.query(sql, [req.user.id, api_product_id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(400).json({ message: "Gagal membayar atau sudah lunas." });
    res.json({ message: "Pembayaran berhasil!" });
  });
};

exports.getTransactions = (req, res) => {
  db.query("SELECT * FROM transactions WHERE user_id = ?", [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};

exports.generateKey = (req, res) => {
  const api_product_id = Number(req.body.api_product_id); // Pastikan angka

  // Validasi apakah benar-benar sudah PAID di database
  const checkSql = "SELECT * FROM transactions WHERE user_id = ? AND api_product_id = ? AND status = 'paid'";
  
  db.query(checkSql, [req.user.id, api_product_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    
    if (results.length === 0) {
      return res.status(403).json({ message: "Produk belum dibayar!" });
    }

    const apiKey = uuidv4();
    db.query(
      "INSERT INTO api_keys (user_id, api_product_id, api_key) VALUES (?, ?, ?)",
      [req.user.id, api_product_id, apiKey],
      () => res.json({ apiKey })
    );
  });
};

exports.getKeys = (req, res) => {
  db.query("SELECT * FROM api_keys WHERE user_id=?", [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};