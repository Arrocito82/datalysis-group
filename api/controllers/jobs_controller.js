import { PrismaClient, Prisma } from '@prisma/client';
import { errorHandler } from './error_handler.js';
const prisma = new PrismaClient();

const createManyJobs=async (req, res) => {
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
};
const createJob = async (req, res) => {
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
};

const getJobs=async (req, res) => {
  const jobs = await prisma.job.findMany({
    // where: { id: id },
    // include: { departments: true },
  });
  return res.json({ data: jobs });
};


const getJobByID = async (req, res) => {
  const { id } = req.params;
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
};
const updateJobByID =async (req, res) => {
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
};
const deleteJobByID = async (req, res) => {
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
};
export {
  createJob,
  getJobs,
  getJobByID,
  updateJobByID,
  deleteJobByID,
  createManyJobs,
}