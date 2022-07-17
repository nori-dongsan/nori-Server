import { Repository } from "typeorm";
import { EntityRepository } from "typeorm/decorator/EntityRepository";
import { ToySite } from "../entities/ToySite";

@EntityRepository(ToySite)
export class ToySiteRepository extends Repository<ToySite> { }