import { Model } from 'objection'

interface User {
    id: number
    email: string
}

class User extends Model {
    static tableName = 'users'
}

export default User
