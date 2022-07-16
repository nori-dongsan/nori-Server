import { User } from "../entities/User"

export class BoardCreateDto {
    title: string
    content: string
    user: User
}