const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// Fungsi baru untuk simulasi pembelian
exports.buyProduct = (req, res) => {
  const { api_product_id } = req.body;
  const sql = "INSERT INTO transactions (user_id, api_product_id, status) VALUES (?, ?, 'paid')";
  
  db.query(sql, [req.user.id, api_product_id], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Pembelian berhasil!" });
  });
};

// Update fungsi generateKey dengan pengecekan transaksi
exports.generateKey = (req, res) => {
  const { api_product_id } = req.body;

  // Cek apakah user sudah membeli produk ini
  const checkSql = "SELECT * FROM transactions WHERE user_id = ? AND api_product_id = ? AND status = 'paid'";
  
  db.query(checkSql, [req.user.id, api_product_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    
    if (results.length === 0) {
      return res.status(403).json({ message: "Anda harus membeli produk ini terlebih dahulu!" });
    }

    const apiKey = uuidv4();
    db.query(
      "INSERT INTO api_keys (user_id, api_product_id, api_key) VALUES (?, ?, ?)",
      [req.user.id, api_product_id, apiKey],
      () => res.json({ apiKey })
    );
  });
};

exports.getProducts = (req, res) => {
  db.query("SELECT * FROM api_products", (err, result) => {
    res.json(result);
  });
};

exports.getKeys = (req, res) => {
  db.query(
    "SELECT * FROM api_keys WHERE user_id=?",
    [req.user.id],
    (err, result) => res.json(result)
  );
};

exports.getTransactions = (req, res) => {
    const sql = "SELECT api_product_id FROM transactions WHERE user_id = ? AND status = 'paid'";
    db.query(sql, [req.user.id], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(result);
    });
};