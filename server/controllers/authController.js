const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    try {
        // Validation de base (à améliorer avec express-validator)
        const { firstName, lastName, email, password, phone } = req.body;

        if(!email || !password) return res.status(400).json({ message: 'Email et mot de passe sont requis.' });

        if (await User.findOne({ where: { email } })) return res.status(409).json({ message: 'Cet email est déjà utilisé.' });

        // Hash du mot de passe avant de le stocker
        const hashed = await bcrypt.hash(password, 12);

        // Créer l'utilisateur dans la base de données
        const user = await User.create({ firstName, lastName, email, password: hashed, phone });

        // Générer un token JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({ token, user: { ...user.toJSON(), password: undefined } });
    } catch (err) { next(err); }
};

exports.signin = async (req, res, next) => {
    try {
        // Validation de base
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "email et mot de passe requis" })
        
        // Trouver l'utilisateur par email
        if (await User.findOne({ where: {email} })) return res.status(409).json({ message: "Cet email est déjà utilisé" })
    } catch(err) { next(err); }
};