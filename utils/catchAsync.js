// async 오류 검출 기능
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
