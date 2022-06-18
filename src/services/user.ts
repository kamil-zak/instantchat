import User from '../models/user'

interface IUserData {
    userId: number
    email: string
}

interface ISignInData {
    email: string
    password: string
}

export const getUserById = async (userId: string | number): Promise<IUserData> => {
    const { id, email } = await User.query().findById(userId)
    return { userId: id, email }
}

export const getUserBySignInData = async ({ email, password }: ISignInData): Promise<IUserData> => {
    const user = await User.query().where({ email, password }).first()
    if (!user) return null
    return { userId: user.id, email }
}
