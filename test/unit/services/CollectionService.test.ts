import { Connection } from 'typeorm';
import { CollectionRepository } from '../../../src/repositories/CollectionRepository';
import { CollectionService } from '../../../src/services/CollectionService';
import { createMemoryDatabase } from '../../utils/CreateMemoryDatabase';
import { FriendSeed } from '../../utils/seeds/FriendTestSeed';

describe('BoardService', () => {
  let db: Connection;
  let collectionRepository: CollectionRepository;
  let collectionService: CollectionService;

  beforeAll(async () => {
    db = await createMemoryDatabase();
    collectionRepository = db.getCustomRepository(CollectionRepository);
    await collectionRepository.save(FriendSeed);
    collectionService = new CollectionService(collectionRepository);
  });

  afterAll(() => db.close);

  it('컬렉션 장난감 리스트를 조회한다. (themeId: 0, sort: price-desc)', async () => {
    const collection = await collectionService.fetchList(0, 'price-desc');
    expect(collection.title).toBe('toddle');
    expect(collection.toyList).toBeCalledWith(expect.anything()); // non-null
    if (collection.toyList != null) {
      expect(collection.toyList[0].title).toBe(15000);
    }
  });

  it('컬렉션 장난감 리스트를 조회한다. (themeId: 0)', async () => {
    const collection = await collectionService.fetchList(0, null);
    // expect(collection.title).toBe('toddle');
    expect(collection.toyList).toBeCalledWith(expect.anything()); // non-null
    if (collection.toyList != null) {
      expect(collection.toyList[0].title).toBe(10000);
    }
  });

  it('컬렉션 장난감 리스트를 조회한다. (themeId: 100)', async () => {
    const collection = await collectionService.fetchList(100, null);
    expect(collection.toyList).toBeNull;
  });
});
