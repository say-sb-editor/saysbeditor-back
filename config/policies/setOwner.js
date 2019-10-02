module.exports = async (ctx, next) => {
  const { id } = ctx.state.user;
  const { body } = ctx.request;

  // If object is being sent with files
  if (Object.prototype.hasOwnProperty.call(body, 'data') && typeof body.data === 'string') {
    const _data = JSON.parse(body.data);
    _data.owner = id.toString();
    body.data = JSON.stringify(_data);
  } else {
    body.owner = id.toString();
  }

  await next();
};