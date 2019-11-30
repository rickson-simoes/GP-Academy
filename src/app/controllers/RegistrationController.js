import * as Yup from 'yup';
import { format, parseISO, addMonths } from 'date-fns';
import Mail from '../../lib/Mail';
import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

class RegistrationController {
  async index(req, res) {
    const { page } = req.query;

    const registration = await Registration.findAll({
      attributes: ['start_date', 'end_date', 'price'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'price', 'duration'],
        },
      ],
    });

    if (!registration) {
      return res.status(401).json({ message: 'No registrations yet' });
    }

    return res.json(registration);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!schema.isValid()) {
      return res.status(400).json({ message: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ message: 'student does not exists' });
    }

    const findStudent = await Registration.findOne({
      where: { student_id },
    });

    if (findStudent) {
      return res.status(400).json({ message: 'student already registred' });
    }

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ message: 'this plan does not exists' });
    }

    const insertReg = await Registration.create({
      student_id,
      plan_id,
      start_date,
      end_date: addMonths(parseISO(start_date), plan.duration),
      price: plan.duration * plan.price,
    });

    const { end_date, price } = await Registration.findOne({
      where: { student_id },
    });

    const formattedDate = format(end_date, "MMMM do 'of' yyyy, 'at' H:mm a");

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Membership on GYMPOINT',
      template: 'registration',
      context: {
        client: student.name,
        plan: plan.title,
        enddate: formattedDate,
        price,
      },
    });

    return res.json(insertReg);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Invalid information' });
    }

    const registration = await Registration.findByPk(req.params.id);

    if (!registration) {
      return res.status(400).json({ message: 'Register not found' });
    }

    const plan = await Plan.findByPk(req.body.plan_id);

    if (!plan) {
      return res.status(400).json({ message: 'this plan does not exists' });
    }

    Registration.addHook('beforeSave', async () => {
      // eslint-disable-next-line prettier/prettier
      registration.end_date = await addMonths(parseISO(req.body.start_date), plan.duration);
      registration.price = await (plan.duration * plan.price);
    });

    const registerUpdate = await registration.update(req.body);

    return res.json(registerUpdate);
  }

  async delete(req, res) {
    const registration = await Registration.findByPk(req.params.id);

    if (!registration) {
      return res.status(400).json({ message: 'registration not found' });
    }

    await registration.destroy();

    return res.json({ message: 'registration has been deleted.' });
  }
}

export default new RegistrationController();
