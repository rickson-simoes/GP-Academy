import * as Yup from 'yup';
import { format } from 'date-fns';
import Mail from '../../lib/Mail';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class AnswerOrderController {
  async store(req, res) {
    const { id } = req.params;

    const helpOrder = await HelpOrder.findByPk(id);

    if (!helpOrder) {
      return res.status(400).json({ message: 'Invalid helpOrder ID' });
    }

    const student = await Student.findOne({
      where: { id: helpOrder.student_id },
    });

    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid information' });
    }

    HelpOrder.addHook('beforeSave', async () => {
      helpOrder.answer_at = await new Date();
    });

    const { answer } = await helpOrder.update(req.body);

    const formattedDate = format(
      helpOrder.answer_at,
      "MMMM do 'of' yyyy, 'at' H:mm a"
    );

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Answer of your question on GYMPOINT',
      template: 'answerquestion',
      context: {
        data: formattedDate,
        client: student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    });

    return res.status(200).json({
      Ticket_ID: helpOrder.id,
      Client: student.name,
      Answer: answer,
      Answer_at: helpOrder.answer_at,
      Message: 'Your answer has been submited',
    });
  }
}

export default new AnswerOrderController();
