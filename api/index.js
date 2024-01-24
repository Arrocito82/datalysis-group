import express from 'express';
import { createJob, createManyJobs, deleteJobByID, getJobs, updateJobByID, getJobByID } from './controllers/jobs_controller.js';
import { createDepartment, createManyDepartments, deleteDepartmentByID, getDepartments, updateDepartmentByID, getDepartmentByID } from './controllers/departments_controller.js';
import { createHiredEmployee, createManyHiredEmployees, deleteHiredEmployeeByID, getHiredEmployees, updateHiredEmployeeByID, getHiredEmployeeByID, validateManyHiredEmployees,getHiredEmployeesPerDepartmentForEachQuaterPerYear,getHiredEmployeesPerDepartmentPerYearAboveAverage  } from './controllers/hired_employees_controller.js';
import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();
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
hiredEmployeesRouter.get('/:year/reporte1',async (req, res) => {
  const { year } = req.params;
  const result = await prisma.$queryRaw(
    Prisma.sql`SELECT "Department"."name" as "departmentName", 
    "Job"."name"  as "jobName", 
    sum(CASE
      WHEN extract(quarter from "HiredEmployee"."hire")=1 THEN 1
    ELSE
      0
    END) as "Q1",
    sum(CASE
      WHEN extract(quarter from "HiredEmployee"."hire")=2 THEN 1
    ELSE
      0
    END) as "Q2",
    sum(CASE
      WHEN extract(quarter from "HiredEmployee"."hire")=3 THEN 1
    ELSE
      0
    END) as "Q3",
    sum(CASE
      WHEN extract(quarter from "HiredEmployee"."hire")=4 THEN 1
    ELSE
      0
    END) as "Q4"
    FROM  "HiredEmployee", "Department", "Job" 
    where "HiredEmployee"."departmentId" = "Department"."id" 
    and "HiredEmployee"."jobId" = "Job"."id" 
    GROUP BY "departmentName", "jobName"
    ORDER BY "departmentName" ASC, "jobName" ASC ;`
  );
  /**
    GROUP BY "departmentName", "jobName"	  
    extract(quarter from "HiredEmployee"."hire") as "quarter"  
  sum(CASE
      WHEN extract(quarter from "HiredEmployee"."hire")=1 THEN 1
    ELSE
      0
    END) as "Q1",
    sum(CASE
      WHEN extract(quarter from "HiredEmployee"."hire")=2 THEN 1
    ELSE
      0
    END) as "Q2",
    sum(CASE
      WHEN extract(quarter from "HiredEmployee"."hire")=3 THEN 1
    ELSE
      0
    END) as "Q3",
    sum(CASE
      WHEN extract(quarter from "HiredEmployee"."hire")=4 THEN 1
    ELSE
      0
    END) as "Q4"
   */
  console.log(result);
  return res.json("Working");
});
// hiredEmployeesRouter.get('/:year/reporte1',getHiredEmployeesPerDepartmentForEachQuaterPerYear);
hiredEmployeesRouter.get('/:year/reporte2',getHiredEmployeesPerDepartmentPerYearAboveAverage);
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
