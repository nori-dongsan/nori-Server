import { EntityRepository, Repository } from 'typeorm';
import { Toy } from '../entities/Toy';

@EntityRepository(Toy)
export class collectionRepository extends Repository<Toy> {}
