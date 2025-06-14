import { Router } from 'express';
import bcrypt from 'bcrypt';
import { getDb } from '../database/init';
import { generateToken } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const db = getDb();

    db.run(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(409).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Registration failed' });
        }

        const userId = this.lastID;
        const token = generateToken(userId);

        res.status(201).json({
          user: { id: userId, email, name },
          token
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const db = getDb();

    db.get(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, user: any) => {
        if (err || !user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user.id);

        res.json({
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          },
          token
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;