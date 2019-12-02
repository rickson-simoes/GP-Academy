import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const student = await Student.findAll();

    return res.status(200).json(student);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      // eslint-disable-next-line prettier/prettier
      email: Yup.string().email().required(),
      // eslint-disable-next-line prettier/prettier
      age: Yup.number().required().positive(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation error' });
    }

    // verifica se o email do estudante está duplicado
    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ message: 'email already exists' });
    }

    // criacao do aluno
    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    return res.status(200).json({
      Student: {
        id,
        name,
        email,
        age,
        weight,
        height,
      },
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string(),
      // eslint-disable-next-line prettier/prettier
      email: Yup.string().email(),
      // eslint-disable-next-line prettier/prettier
      age: Yup.number().positive(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(401)
        .json({ error: 'Validation error, please insert Student ID' });
    }

    const student = await Student.findByPk(req.body.id);

    // verifica se o email do estudante já existe por algum na base de dados
    if (req.body.email !== student.email) {
      const emailExists = await Student.findOne({
        where: { email: req.body.email },
      });
      if (emailExists) {
        return res.status(400).json({ message: 'email already exists' });
      }
    }

    const { id, name, email, age, weight, height } = await student.update(
      req.body
    );

    return res.status(200).json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }
}

export default new StudentController();
