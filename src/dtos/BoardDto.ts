import { Board } from "../entities/Board"
import { BoardComment } from "../entities/BoardComment"
import { BoardImage } from "../entities/BoardImage"
import { BoardCommentResponseDto } from "./BoardComment"
import { User } from "../entities/User"

export class BoardResponseDto {
    author: boolean
    category: string
    title: string
    userNickname: string
    createdAt: Date
    imageList: string[]
    content: string
    replyCount: number = 0
    likeCount: number = 0
    replyList: BoardCommentResponseDto[]

    constructor(board: Board, comment: BoardComment[]) {
        this.category = board.section
        this.title = board.title
        this.userNickname = board.user.nickname
        this.createdAt = board.createdAt
        const imageLinkList = board.boardImages.map((value) => {
            return value.imageLink
        })
        this.imageList = imageLinkList
        this.content = board.content
        this.replyCount = 0
        this.likeCount = 0
        const commentList = comment.map((value) => {
            return <BoardCommentResponseDto>{
                userNickname: value.user.nickname,
                content: value.content,
                createAt: value.createdAt
            }
        })
        this.replyList = commentList
    }
}

export class BoardDto {
    author: boolean
    category: string
    title: string
    userNickname: string
    createdAt: Date
    imageList: string[]
    content: string
    replyCount: number = 0
    likeCount: number = 0
    replyList: BoardCommentResponseDto[]

export class BoardCreateDto {
    category: string
    title: string
    content: string
    user: User
}