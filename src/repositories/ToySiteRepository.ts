import { EntityRepository, Repository } from 'typeorm';
import { ToySite } from '../entities/ToySite';

@EntityRepository(ToySite)
export class ToySiteRepository extends Repository<ToySite> {}
