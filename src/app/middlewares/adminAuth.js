/*
 * segunda forma para fazer uma "autenticação"
 * verifica se o email existe, se o password está correto
 * e se o email junto com o admin_status é verdadeiro.
 *
 * sendo verdadeiro, o admin tem permissao para cadastrar o aluno
 *
 * para utilizar esse middleware é necessario inserir os campos:
 * 	"emailLog":"email do banco",
 *  "passwordLog":"password do banco"
 *  junto com o resto dos dados do aluno
 *
 * onde por exemplo ficaria:
 *
 * {
 *	"emailLog":"admin@gympoint.com",
 *	"passwordLog":"123456",
 *	"name":"carl",
 *	"email":"carlsmith@aol.com",
 *	"age":21,
 *	"weight":82.3,
 *	"height":1.79
 * }
 *
 */

import User from '../models/User';

export default async (req, res, next) => {
  const { emailLog, passwordLog } = req.body;

  const user = await User.findOne({ where: { email: emailLog } });
  if (!user) {
    return res
      .status(401)
      .json({ message: 'LOG: email does not exists in our database' });
  }

  if (!(await user.checkPassword(passwordLog))) {
    return res.status(401).json({ message: 'LOG: Password does not match' });
  }

  // compara o email e o admin status, verificando se é permitido.
  if (
    !(await User.findOne({ where: { email: emailLog, admin_status: true } }))
  ) {
    return res.status(401).json({
      message: `LOG: ${emailLog} is not available to do such action`,
    });
  }

  return next();
};
