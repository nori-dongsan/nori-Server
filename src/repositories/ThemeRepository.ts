import { ToyCollection } from '../entities/ToyCollection';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ToyCollection)
export class ThemeRepository extends Repository<ToyCollection> {}
