import { Test } from "../entities/Test";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Test)
export class TestRepository extends Repository<Test> {}
