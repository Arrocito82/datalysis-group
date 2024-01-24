import { PrismaClient, Prisma } from '@prisma/client';
import { errorHandler } from './error_handler.js';
const prisma = new PrismaClient();

const createManyHiredEmployees = async (req, res) => {
  const hiredEmployees = req.body;
  // console.log(hiredEmployees);
  try {
    const createMany = await prisma.hiredEmployee.createMany({
      data: hiredEmployees,
      skipDuplicates: true, // Skip 'Bobo'
    });
    return res.json(createMany);
  } catch (e) {
    errorHandler(e, req, res);
  }
};
const createHiredEmployee = async (req, res) => {
  const { id, name, hire, departmentId, jobId } = req.body;
  const requiredFields = ['id', 'name', 'hire', 'departmentId', 'jobId'];
  let errors = [];
  let job = null, department = null;
  requiredFields.forEach((field) => {
    if (!req.body[field]) {
      errors.push({ [field]: `${field} is required` });
    }
  });
  try {
    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }
    job = await prisma.job.findUnique({
      where: { id: parseInt(jobId) }
    });
    department = await prisma.department.findUnique({
      where: { id: parseInt(departmentId) }
    });
    if (!job) {
      errors.push({ jobId: `Job ID: ${jobId} not found` });
    }
    if (!department) {
      errors.push({ departmentId: `Department ID: ${departmentId} not found` });
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }
    const hiredEmployee = await prisma.hiredEmployee.create({
      data: {
        id: id,
        name: name,
        hire: hire,
        departmentId: departmentId,
        jobId: jobId,
      },
    });
    return res.json(hiredEmployee);
  } catch (e) {
    errorHandler(e, req, res);
  }
};

const getHiredEmployees = async (req, res) => {
  const hiredEmployees = await prisma.hiredEmployee.findMany({
    select: {
      id: true,
      name: true,
      hire: true,
      department: true,
      job: true
    },
  });
  return res.json({ data: hiredEmployees });
};


const getHiredEmployeeByID = async (req, res) => {
  const { id } = req.params;
  try {
    const hiredEmployee = await prisma.hiredEmployee.findUnique({
      where: { id: parseInt(id) },
      include: {
        department: true,
        job: true
      },
    });
    if (!hiredEmployee) {
      return res.status(400).json({ errors: [{ id: `ID ${id} not found` }] });
    }
    return res.json(hiredEmployee);
  } catch (e) {
    errorHandler(e, req, res);
  }
};
const updateHiredEmployeeByID = async (req, res) => {
  const { id } = req.params;
  const { name, hire, departmentId, jobId } = req.body;
  console.log(req.body);
  let job = null, department = null;
  let errors = [];
  let data = {};
  const requiredFields = ['id', 'name', 'hire', 'departmentId', 'jobId'];
  requiredFields.forEach((field) => {
    if (req.body[field]) {
      data[field] = req.body[field];
    }
  });
  try {
    if (jobId) {
      job = await prisma.job.findUnique({
        where: { id: parseInt(jobId) }
      });
      if (!job) {
        errors.push({ jobId: `Job ID: ${jobId} not found` });
      }
    }
    if (departmentId) {
      department = await prisma.department.findUnique({
        where: { id: parseInt(departmentId) }
      });
      if (!department) {
        errors.push({ departmentId: `Department ID: ${departmentId} not found` });
      }
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }
    const hiredEmployee = await prisma.hiredEmployee.update({
      where: { id: parseInt(id) },
      data: data,
    });
    return res.json(hiredEmployee);
  } catch (e) {
    errorHandler(e, req, res);
  }
};
const deleteHiredEmployeeByID = async (req, res) => {
  const { id } = req.params;
  try {
    const hiredEmployee = await prisma.hiredEmployee.delete({
      where: {
        id: parseInt(id)
      },
    });
    return res.json(hiredEmployee);
  } catch (e) {
    errorHandler(e, req, res);
  }
};
export {
  createHiredEmployee,
  getHiredEmployees,
  getHiredEmployeeByID,
  updateHiredEmployeeByID,
  deleteHiredEmployeeByID,
  createManyHiredEmployees,
}