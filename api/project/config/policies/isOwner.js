module.exports = async (ctx, next) => {
  const { role, id } = ctx.state.user;
  const fieldId = ctx.params.id;

  if (typeof fieldId !== 'undefined') {
    strapi.services.project.findOne({ id: fieldId }).then(result => {
      if (!result && role.type !== 'administrator') {
        return ctx.unauthorized('You are not allowed to perform this action.');
      }

      if (!result.attributes.owner) {
        return ctx.unauthorized('You are not allowed to perform this action.');
      }

      if (result && result.attributes.owner !== id) {
        return ctx.unauthorized('You are not allowed to perform this action.');
      }
    });
  }

  await next();
};