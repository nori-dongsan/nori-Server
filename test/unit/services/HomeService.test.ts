import { Connection } from 'typeorm';
import { HomeRepository } from '../../../src/repositories/HomeRepository';
import { HomeService } from '../../../src/services/HomeService';
import { createMemoryDatabase } from '../../utils/CreateMemoryDatabase';
import { FriendSeed } from '../../utils/seeds/FriendTestSeed';

describe('BoardService', () => {
  let db: Connection;
  let homeRepository: HomeRepository;
  let homeService: HomeService;

  beforeAll(async () => {
    db = await createMemoryDatabase();
    homeRepository = db.getCustomRepository(HomeRepository);
    await homeRepository.save(FriendSeed);
    homeService = new HomeService(homeRepository);
  });

  afterAll(() => db.close);

  it('홈 장난감 추천 리스트를 조회한다.', async () => {
    const toyList = await homeService.fetchList();
    expect(toyList).toBeCalledWith(expect.anything()); // non-null
    if (
      toyList.trending != null &&
      toyList.noriPick != null &&
      toyList.senses != null &&
      toyList.smart != null
    ) {
      expect(toyList.trending[0].title).toBe('test');
      expect(toyList.noriPick[1].title).toBe('test2');
      expect(toyList.senses[2].title).toBe('test3');
      expect(toyList.smart[3].title).toBe('test4');
    }
  });
});
