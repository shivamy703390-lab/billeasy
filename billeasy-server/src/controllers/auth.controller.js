function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  // Mock auth: accept any non-empty email/password
  res.json({
    success: true,
    data: {
      user: { email },
      token: 'mock-token'
    }
  });
}

module.exports = { login };