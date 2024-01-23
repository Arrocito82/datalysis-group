import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
const apiRouter = express.Router();
// you need to set mergeParams: true on the router,
// if you want to access params from the parent router
const jobsRouter = express.Router({ mergeParams: true });
app.use('/api', apiRouter);
apiRouter.use('/jobs', jobsRouter);
const errorHandler = (e, req, res) => {
  let id = 0;
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (req.params.id !== undefined) {
      id = req.params.id;
    } else {
      id = req.body.id;
    }
    if (e.code === 'P2002') {
      return res.json({ error: `ID ${id} already exists` }
      );
    } else if (e.code === 'P2025') {
      return res.json({ error: `ID ${id} not found` }
      );
    }
  }
  return res.json({ error: e.message });
}
jobsRouter.route('/collection')
  .post(async (req, res) => {
    const jobs = req.body;
    // console.log(jobs);
    try {
      const createMany = await prisma.job.createMany({
        data: jobs,
        skipDuplicates: true, // Skip 'Bobo'
      });
      return res.json(createMany);
    } catch (e) {
      errorHandler(e, req, res);
    }
  });
jobsRouter.route('/')
  .post(async (req, res) => {
    const { id, name } = req.body;
    const requiredFields = ['id', 'name'];
    let errors = [];
    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        errors.push({ [field]: `${field} is required` });
      }
    });
    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }
    try {
      const job = await prisma.job.create({
        data: {
          id: id,
          name: name,
        },
      });
      return res.json(job);
    } catch (e) {
      errorHandler(e, req, res);
    }
  })
  .get(async (req, res) => {
    const jobs = await prisma.job.findMany({
      // where: { id: id },
      // include: { departments: true },
    });
    return res.json({ data: jobs });
  });

jobsRouter.route('/:id')
  .get(async (req, res) => {
    const { id } = req.params;
    console.log('IN', id);
    try {
      const job = await prisma.job.findUnique({
        where: { id: parseInt(id) },
        include: { departments: true },
      });
      if(!job) {
        throw new Error(`ID ${id} not found`);
      }
      return res.json(job);
    } catch (e) {
      errorHandler(e, req, res);
    }
  })
  .put(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const job = await prisma.job.update({
        where: { id: parseInt(id) },
        data: { name: name },
      });
      return res.json(job);
    } catch (e) {
      errorHandler(e, req, res);
    }
  }).delete(async (req, res) => {
    const { id } = req.params;
    try {
      const job = await prisma.job.delete({
        where: {
          id: parseInt(id)
        },
      });
      return res.json(job);
    } catch (e) {
      errorHandler(e, req, res);
    }
  });
app.listen(process.env.PORT, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT}`);
});
