const pool = require('../db');
const { sendRegistrationEmail } = require('../utils/mailer');

exports.createUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const profilePicturePath = req.file ? req.file.path : null;

    const [result] = await pool.query(
      'INSERT INTO users (name, email, phone, profile_picture_path) VALUES (?, ?, ?, ?)',
      [name, email, phone, profilePicturePath]
    );

    sendRegistrationEmail(email, name);

    res.status(201).json({ id: result.insertId, name, email, phone, profile_picture_path: profilePicturePath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;
        const [result] = await pool.query(
            'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
            [name, email, phone, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};