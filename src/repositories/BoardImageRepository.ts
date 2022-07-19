import { EntityRepository } from "typeorm";
import { Repository } from "typeorm/repository/Repository";
import { BoardImage } from "../entities/BoardImage";

@EntityRepository(BoardImage)
export class BoardImageRepository extends Repository<BoardImage> { }