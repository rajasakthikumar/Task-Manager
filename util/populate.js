const populateRolesAndPermissions = (query) => {
    return query.populate({
      path: 'roles',
      populate: {
        path: 'permissions',
        model: 'Permission',
      },
    });
  };
  
  module.exports = {
    populateRolesAndPermissions,
  };