import express, { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = express.Router();

interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

const register: RequestHandler<{}, {}, RegisterBody> = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ error: 'Cet email est déjà utilisé.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "Inscription réussie !" });
  } catch (error) {
    next(error);
  }
};

const login: RequestHandler<{}, {}, LoginBody> = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(404).json({ error: "Utilisateur introuvable." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Mot de passe incorrect." });
      return;
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: "Connexion réussie !",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMe: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: "Token non fourni." });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: string;
      username: string;
      role: string;
    };

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(404).json({ error: "Utilisateur introuvable." });
      return;
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    next(error);
  }
};

router.post('/register', register);
router.post('/login', login);
router.get('/me', getMe);

export default router;
