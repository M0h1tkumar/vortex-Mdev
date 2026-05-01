import { prisma } from '../config/db.js';
import { env } from '../config/env.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // For a real app, you should use bcrypt to hash and compare passwords
    // Since the project is currently storing passwords in plain text or not at all (mock),
    // we will check for a student with this email and password.
    // Note: Admin might need a special entry or hardcoded check if not in DB.

    let user = await prisma.student.findUnique({
      where: { email },
      include: {
        domain: true,
        institute: true,
        problemStatement: true
      }
    });

    // Simple hardcoded admin check if no student found, or you can add an admin role to the student table
    if (!user && email === 'admin@vortex.com' && password === 'admin123') {
      user = {
        id: 'admin_root',
        fullName: 'System Administrator',
        email: 'admin@vortex.com',
        role: 'ADMIN'
      };
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    }

    if (user.role === 'STUDENT' && user.verificationStatus !== 'VERIFIED') {
      return res.status(403).json({ error: 'ACCOUNT_NOT_VERIFIED' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.ACCESS_TOKEN_SECRET,
      { expiresIn: env.ACCESS_TOKEN_EXPIRY }
    );

    res.json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        domain: user.domain,
        institute: user.institute,
        ps: user.problemStatement
      }
    });
  } catch (err) {
    next(err);
  }
};
