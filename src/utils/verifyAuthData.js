import { ForbiddenError } from 'apollo-server-core'

const verifyAuthData = (authData, variables) => {
    const isAuth = Object.keys(authData).some((key) => authData[key] === variables[key])
    if (!isAuth) throw new ForbiddenError()
}

export default verifyAuthData
