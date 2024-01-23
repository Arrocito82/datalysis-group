import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
const errorHandler = (e, req, res) => {
  if (e.code === 'P2002') {
    res.json({ error: `ID ${req.body.id} already exists` }
    );
  }
}
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
      // where: { published: true },
      // include: { author: true },
    });
    return res.json({ data: jobs });
  });

app.get('/feed', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  })
  return res.json(posts)
});


app.put('/publish/:id', async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.update({
    where: { id },
    data: { published: true },
  })
  return res.json(post)
});

app.delete('/user/:id', async (req, res) => {
  const { id } = req.params
  const user = await prisma.user.delete({
    where: {
      id,
    },
  })
  return res.json(user)
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT}`);
});
