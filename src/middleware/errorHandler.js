export const errotHandler = (error, req, res, next) => {
  if (error) {
    console.error(`There was an error: `, error.message);
    return res.status(500).json({
      success: `error en el servidor`,
      error: `${error.maessage}`,
    });
  }
};
