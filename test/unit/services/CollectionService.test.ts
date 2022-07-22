import { Connection } from 'typeorm';
import { CollectionRepository } from '../../../src/repositories/CollectionRepository';
import { ThemeRepository } from '../../../src/repositories/ThemeRepository';
import { ToySiteRepository } from '../../../src/repositories/ToySiteRepository';
import { CollectionService } from '../../../src/services/CollectionService';
import { createMemoryDatabase } from '../../utils/CreateMemoryDatabase';
import { ThemeSeed } from '../../utils/seeds/ThemeSeed';
import { ToySiteSeed } from '../../utils/seeds/ToySiteSeed';
import { ToySeed } from '../../utils/seeds/ToyTestSeed';

describe('BoardService', () => {
  let db: Connection;
  let collectionRepository: CollectionRepository;
  let themeRepository: ThemeRepository;
  let toySiteRepository: ToySiteRepository;
  let collectionService: CollectionService;

  beforeAll(async () => {
    db = await createMemoryDatabase();
    collectionRepository = db.getCustomRepository(CollectionRepository);
    themeRepository = db.getCustomRepository(ThemeRepository);
    toySiteRepository = db.getCustomRepository(ToySiteRepository);
    await collectionRepository.save(ToySeed);
    await themeRepository.save(ThemeSeed);
    await toySiteRepository.save(ToySiteSeed);
    collectionService = new CollectionService(
      collectionRepository,
      themeRepository
    );
  });

  afterAll(() => db.close);

  it('컬렉션 장난감 리스트를 조회한다. (themeId: 0, sort: price-desc)', async () => {
    const collection = await collectionService.fetchList(0, 'price-desc');
    expect(collection.title).toBe('title');
    // expect(collection.toyList).toBeCalledWith(expect.anything()); // non-null
    if (collection.toyList != null) {
      expect(collection.toyList[0].price).toBe(15000);
    }
  });

  it('컬렉션 장난감 리스트를 조회한다. (themeId: 0)', async () => {
    const collection = await collectionService.fetchList(0, null);
    // expect(collection.title).toBe('toddle');
    // expect(collection.toyList).toBeCalledWith(expect.anything()); // non-null
    if (collection.toyList != null) {
      expect(collection.toyList[0].price).toBe(10000);
    }
  });

  it('컬렉션 장난감 리스트를 조회한다. (themeId: 100)', async () => {
    const collection = await collectionService.fetchList(100, null);
    expect(collection.toyList).toBeNull;
  });
});
