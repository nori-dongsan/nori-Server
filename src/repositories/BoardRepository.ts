import { EntityRepository, Repository } from "typeorm";
import { Board } from "../entities/Board";

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> { }