import { EntityRepository, Repository } from "typeorm";
import { BoardComment } from "../entities/BoardComment";

@EntityRepository(BoardComment)
export class BoardCommentRepository extends Repository<BoardComment> { }