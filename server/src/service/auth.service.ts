import prisma from '../config/prisma.ts';
import { createAccessToken } from '../helpers/token.ts';

export const loginUserService = async ({ email, password }: any) => {
    if (!email || !password) throw new Error('Email and password are required');

    const user = await prisma.profile.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    const isPasswordValid = password === user.password;
    if (!isPasswordValid) throw new Error('Invalid password');

    const token = createAccessToken(user.id, user.email, user.role);

    return {
        message: 'Login successful',
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        token,
    };
};

export const logoutUserService = () => {
    return {
        message: 'Logout successful',
    };
};
