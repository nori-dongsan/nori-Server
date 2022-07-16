import { User } from "../entities/User"

export class BoardCreateDto {
    category: string
    title: string
    content: string
    user: User
}