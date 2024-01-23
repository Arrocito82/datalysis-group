import { PrismaClient, Prisma } from '@prisma/client';
import { errorHandler } from './error_handler.js';
const prisma = new PrismaClient();
const createManyDepartments=async (req, res) => {
  const departments = req.body;
  // console.log(departments);
  try {
    const createMany = await prisma.department.createMany({
      data: departments,
      skipDuplicates: true, // Skip 'Bobo'
    });
    return res.json(createMany);
  } catch (e) {
    errorHandler(e, req, res);
  }
};
const createDepartment = async (req, res) => {
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
    const department = await prisma.department.create({
      data: {
        id: id,
        name: name,
      },
    });
    return res.json(department);
  } catch (e) {
    errorHandler(e, req, res);
  }
};

const getDepartments=async (req, res) => {
  const departments = await prisma.department.findMany({
    // where: { id: id },
    // include: { departments: true },
  });
  return res.json({ data: departments });
};


const getDepartmentByID = async (req, res) => {
  const { id } = req.params;
  try {
    const department = await prisma.department.findUnique({
      where: { id: parseInt(id) },
      include: { jobs: true },
    });
    if(!department) {
      throw new Error(`ID ${id} not found`);
    }
    return res.json(department);
  } catch (e) {
    errorHandler(e, req, res);
  }
};
const updateDepartmentByID =async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const department = await prisma.department.update({
      where: { id: parseInt(id) },
      data: { name: name },
    });
    return res.json(department);
  } catch (e) {
    errorHandler(e, req, res);
  }
};
const deleteDepartmentByID = async (req, res) => {
  const { id } = req.params;
  try {
    const department = await prisma.department.delete({
      where: {
        id: parseInt(id)
      },
    });
    return res.json(department);
  } catch (e) {
    errorHandler(e, req, res);
  }
};
export {
  createDepartment,
  getDepartments,
  getDepartmentByID,
  updateDepartmentByID,
  deleteDepartmentByID,
  createManyDepartments,
}