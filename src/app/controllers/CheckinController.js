import {
  addDays,
  isWithinInterval,
  differenceInCalendarDays,
  compareDesc,
} from 'date-fns';
import Checkin from '../../schemas/Checkins';
import Student from '../models/Student';

import Registration from '../models/Registration';

class CheckinController {
  async index(req, res) {
    const { id } = req.params;

    const checkStudent = await Student.findByPk(id);

    if (!checkStudent) {
      return res.status(400).json({ message: 'This user does not exists' });
    }

    const listStudent = await Checkin.find({ student_id: id })
      .sort({ createdAt: 'desc' })
      .limit(5);

    return res.json(listStudent);
  }

  async store(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ message: 'student not found' });
    }

    const { id } = req.params;

    const countCheckins = await Checkin.countDocuments(
      { student_id: id },
      (err, count) => {
        if (err) {
          return res.status(400).json({ error: err });
        }
        return count;
      }
    );

    const registration = await Registration.findOne({
      where: {
        student_id: req.params.id,
      },
    });

    if (compareDesc(new Date(), registration.end_date) === 1) {
      return res.status(401).json({ message: 'Your membership has expired' });
    }

    await Checkin.create({ student_id: student.id });

    const { createdAt } = await Checkin.findOne({ student_id: id });
    const expDays = addDays(createdAt, 7);
    const actualDay = new Date();
    const remnantDays = differenceInCalendarDays(expDays, actualDay);
    const withinDays = isWithinInterval(actualDay, {
      start: createdAt,
      end: expDays,
    });

    if (countCheckins >= 5 && withinDays === false) {
      await Checkin.deleteMany({ student_id: id });

      return res
        .status(401)
        .json({ message: 'Gympass is now free, you can log again.' });
    }

    if (countCheckins >= 5) {
      return res.status(401).json({
        Denied: `You can only do 5 checkins within 7 days. Days left to log again: ${remnantDays}`,
      });
    }

    return res.json({ message: `Welcome ${student.name}, be Fit!` });
  }
}

export default new CheckinController();
