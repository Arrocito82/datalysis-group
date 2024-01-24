import express from 'express';
import { createJob, createManyJobs, deleteJobByID, getJobs, updateJobByID, getJobByID } from './controllers/jobs_controller.js';
import { createDepartment, createManyDepartments, deleteDepartmentByID, getDepartments, updateDepartmentByID, getDepartmentByID } from './controllers/departments_controller.js';
import { createHiredEmployee, createManyHiredEmployees, deleteHiredEmployeeByID, getHiredEmployees, updateHiredEmployeeByID, getHiredEmployeeByID, validateManyHiredEmployees } from './controllers/hired_employees_controller.js';

const app = express();
app.use(express.json());
const apiRouter = express.Router();
app.use('/api', apiRouter);
// you need to set mergeParams: true on the router,
// if you want to access params from the parent router
const jobsRouter = express.Router({ mergeParams: true });
const departmentsRouter = express.Router({ mergeParams: true });
const hiredEmployeesRouter = express.Router({ mergeParams: true });
apiRouter.use('/jobs', jobsRouter);
apiRouter.use('/departments', departmentsRouter);
apiRouter.use('/hiredEmployees', hiredEmployeesRouter);
jobsRouter.route('/collection')
  .post(createManyJobs);
jobsRouter.route('/')
  .post(createJob)
  .get(getJobs);
jobsRouter.route('/:id')
  .get(getJobByID)
  .put(updateJobByID)
  .delete(deleteJobByID);
departmentsRouter.route('/collection')
  .post(createManyDepartments);
departmentsRouter.route('/')
  .post(createDepartment)
  .get(getDepartments);
departmentsRouter.route('/:id')
  .get(getDepartmentByID)
  .put(updateDepartmentByID)
  .delete(deleteDepartmentByID);
hiredEmployeesRouter.route('/collection')
  .post(createManyHiredEmployees);
hiredEmployeesRouter.route('/collection/validate')
  .post(validateManyHiredEmployees);
hiredEmployeesRouter.route('/')
  .post(createHiredEmployee)
  .get(getHiredEmployees);
hiredEmployeesRouter.route('/:id')
  .get(getHiredEmployeeByID)
  .put(updateHiredEmployeeByID)
  .delete(deleteHiredEmployeeByID);
app.listen(process.env.PORT, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT}`);
});
