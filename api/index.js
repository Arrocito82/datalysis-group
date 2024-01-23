import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { log } from 'console';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
const errorHandler = (e, req, res) => {
  if (e.code === 'P2002') {
    res.json({ error: `ID ${req.body.id} already exists` }
    );
  }
}
app.route('/job-collection')
  .post(async (req, res) => {
    const jobs = req.body;
    // console.log(jobs);
    try{
      const createMany = await prisma.job.createMany({
        data: jobs,
        skipDuplicates: true, // Skip 'Bobo'
      });
      return res.json(createMany);
    }catch(e){
      if(e instanceof Prisma.PrismaClientKnownRequestError){
        errorHandler(e, req, res);
      }
    }
  });
app.route('/jobs')
  .post(async (req, res) => {
    const { id, name } = req.body;
    const requiredFields = ['id', 'name'];
    let errors = [];
    requiredFields.forEach((field) => {
      if(!req.body[field]){
        errors.push({ [field]: `${field} is required` });
      }
    });
    if(errors.length > 0){
      return res.status(400).json({ errors:errors });
    }
    try{
      const job = await prisma.job.create({
        data: {
          id: id,
          name: name,
        },
      });
      return res.json(job);
    }catch(e){
      if(e instanceof Prisma.PrismaClientKnownRequestError){
        errorHandler(e, req, res);
      }
    }
  })
  .get(async (req, res) => {
    const jobs = await prisma.job.findMany({
      // where: { id: id },
      // include: { departments: true },
    });
    return res.json({ data: jobs });
  });

app.route('/jobs/:id')
.get(async (req, res) => {
  const { id } = req.params;
  try{
    const job = await prisma.job.findUnique({
      where: { id: id },
      include: { departments: true },
    });
    return res.json(job);
  }catch(e){
    return res.status(404).json({ error: `Job with ID ${id} not found` });
  }
})
.put(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const job = await prisma.job.update({
    where: { id:parseInt(id) },
    data: {  name:name },
  });
  return res.json(job);
});

app.delete('/jobs/:id', async (req, res) => {
  const { id } = req.params;
  const job = await prisma.job.delete({
    where: {
      id:parseInt(id)
    },
  })
  return res.json(job);
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT}`);
});
