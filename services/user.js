const BaseService = require('./baseService');
const { generateToken } = require('../util/jwt');
const CustomError = require('../util/customError');

class UserService extends BaseService {
    constructor(userRepository, roleRepository) {
        super(userRepository);
        this.roleRepository = roleRepository; 
    }

    async registerUser(userData) {
        const existingUser = await this.repository.findByUsername(userData.username);
        if (existingUser) {
            throw new CustomError('User already exists');
        }

        if (!userData.roles) {
            const role = await this.roleRepository.findByName('user');
            if (!role) {
                throw new CustomError('user role not found', 500);
            }
            userData.roles = role._id; 
        }

        await newUser.populate({
            path: 'roles',
            populate: {
                path: 'permissions',
                model: 'Permission'
            }
        });

        const token = await generateToken(newUser._id);

        return {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            roles: newUser.roles,
            token: 'Bearer ' + token
        };
    }

    async loginUser(username, password) {
        const user = await this.repository.validateUser(username, password);
        if (!user) {
            throw new CustomError('Invalid username or password');
        }
    
         const foundUser = await this.repository.model
        .findById(user._id)
        .populate({
            path: 'roles',
            populate: {
                path: 'permissions',
                model: 'Permission'
            }
        });
    
        const token = await generateToken(foundUser._id);
    
        return {
            _id: foundUser._id,
            username: foundUser.username,
            email: foundUser.email,
            roles: foundUser.roles, 
            token: 'Bearer ' + token
        };
    }
    

    async getUserById(id) {
        const user = await this.repository.findById(id).populate({
            path: 'roles',
            populate: {
                path: 'permissions',
                model: 'Permission'
            }
        });

        if (!user) {
            throw new CustomError('User not found');
        }
        return user;
    }

    async getAllUsers() {
  return await this.repository.findAll({}, {
    populate: {
      path: 'roles',
      populate: {
        path: 'permissions',
        model: 'Permission',
      },
    },
  });
}


    async assignRole(userId, roleId) {
        try {
            
            const user = await this.repository.findById(userId);
            if (!user) {
                throw new CustomError('User not found');
            }
    
            const role = await this.roleRepository.findById(roleId);
            if (!role) {
                throw new CustomError('Role not found');
            }
    
            if (!user.roles.includes(roleId)) {
                user.roles.push(roleId);
    
                try {
                    await user.save();
                    console.log('@!@!@!@! Roles assigning completed');
                } catch (error) {
                    console.error('Error while saving user:', error);
                    throw new CustomError('Error while saving user role');
                }
            } else {
                console.log('@!@!@!@! Role already assigned to the user');
            }
    
            const savedUser =  await this.repository.model
            .findById(userId)
            .populate({
                path: 'roles',
                populate: {
                    path: 'permissions',
                    model: 'Permission'
                }
            });

            return await savedUser
        } catch (error) {
            console.error('Error in assignRole function:', error);
            throw new CustomError('Internal Server Error');
        }
    }
}

module.exports = UserService;
