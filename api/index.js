import express from 'express';
import { createJob, createManyJobs, deleteJobByID, getJobs, updateJobByID, getJobByID } from './controllers/jobs_controller.js';

const app = express();
app.use(express.json());
const apiRouter = express.Router();
app.use('/api', apiRouter);
// you need to set mergeParams: true on the router,
// if you want to access params from the parent router
const jobsRouter = express.Router({ mergeParams: true });
apiRouter.use('/jobs', jobsRouter);
jobsRouter.route('/collection')
  .post(createManyJobs);
jobsRouter.route('/')
  .post(createJob)
  .get(getJobs);
jobsRouter.route('/:id')
  .get(getJobByID)
  .put(updateJobByID)
  .delete(deleteJobByID);
app.listen(process.env.PORT, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT}`);
});
