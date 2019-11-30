import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AnswerOrderController from './app/controllers/AnswerOrderController';
import authMiddleware from './app/middlewares/auth';
// import adminMiddleware from './app/middlewares/adminAuth';

const routes = new Router();

routes.post('/session', SessionController.store);
routes.post('/users', UserController.store);

// Checkin
routes.get('/students/:id/checkins', CheckinController.index);
routes.post('/students/:id/checkins', CheckinController.store);

// Help_Orders - Student question
routes.post('/students/:id/help-orders', HelpOrderController.store);

routes.use(authMiddleware);

// Alunos
routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);

// Help_Orders - List and Answer
routes.get('/students/:id/help-orders', HelpOrderController.index);
routes.post('/help-orders/:id/answer', AnswerOrderController.store);

// Planos
routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

// Registro
routes.get('/registration', RegistrationController.index);
routes.post('/registration', RegistrationController.store);
routes.put('/registration/:id', RegistrationController.update);
routes.delete('/registration/:id', RegistrationController.delete);

export default routes;
