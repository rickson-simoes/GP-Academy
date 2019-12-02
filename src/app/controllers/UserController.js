import User from '../models/User';

class UserController {
  async store(req, res) {
    // verifica se o email está duplicado
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ message: 'email already exists' });
    }

    // criacao do usuario
    const { id, name, email, password_hash } = await User.create(req.body);

    return res.status(200).json({
      id,
      name,
      email,
      password_hash,
    });
  }
}

export default new UserController();
