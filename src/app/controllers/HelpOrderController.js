import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const listQuestions = await HelpOrder.findAll({
      where: { student_id: id },
      attributes: ['id', 'question', 'answer', 'answer_at', 'created_at'],
    });

    return res.json(listQuestions);
  }

  async store(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    const { question } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid information' });
    }

    const insertQuestion = await HelpOrder.create({
      student_id: id,
      question,
    });

    return res.status(200).json({
      Client: student.name,
      Question: insertQuestion.question,
      Message:
        'Your question has been submited, please wait until someone answers it',
    });
  }
}

export default new HelpOrderController();
