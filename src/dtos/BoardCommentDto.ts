import { Board } from "../entities/Board"
import { UserDto } from "./UserDto"

export class BoardCommentResponseDto {
    userNickname: string
    content: string
    createAt: Date
}

export class BoardCommentCreateDto {
    user: UserDto
    board: Board
    content: string
}

export class BoardCommentRequsetDto {
    content: string
    boardId: number
}