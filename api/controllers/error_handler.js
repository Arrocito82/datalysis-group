export default errorHandler = (e, req, res) => {
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