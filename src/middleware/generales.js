export const middleware01 = (req, res, next) => {
  console.log(`paso x middlewalw - 01 - ${req.url} - metodo ${req.method}`);

  next();
};

export const middleware02 = (req, res, next) => {
  console.log(`paso x middlewalw - 02 - ${req.url} - metodo ${req.method}`);
  if (req.query.name) {
    rec.query.name = req.query.toUpperCase();
  }
  req.codigo = "coderCoder123";

  next();
};

export const middleware03 = (req, res, next) => {
  console.log(`paso x middlewalw - 03 - ${req.url} - metodo ${req.method}`);

  next();
};
