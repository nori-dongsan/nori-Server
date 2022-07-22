import { Connection } from 'typeorm';
import { HomeRepository } from '../../../src/repositories/HomeRepository';
import { ThemeRepository } from '../../../src/repositories/ThemeRepository';
import { ToySiteRepository } from '../../../src/repositories/ToySiteRepository';
import { HomeService } from '../../../src/services/HomeService';
import { createMemoryDatabase } from '../../utils/CreateMemoryDatabase';
import { ToySeed } from '../../utils/seeds/ToyTestSeed';
import { ThemeSeed } from '../../utils/seeds/ThemeSeed';
import { ToySiteSeed } from '../../utils/seeds/ToySiteSeed';

describe('BoardService', () => {
  let db: Connection;
  let homeRepository: HomeRepository;
  let themeRepository: ThemeRepository;
  let homeService: HomeService;
  let toySiteRepository: ToySiteRepository;

  beforeAll(async () => {
    db = await createMemoryDatabase();
    homeRepository = db.getCustomRepository(HomeRepository);
    themeRepository = db.getCustomRepository(ThemeRepository);
    toySiteRepository = db.getCustomRepository(ToySiteRepository);
    await homeRepository.save(ToySeed);
    await themeRepository.save(ThemeSeed);
    await toySiteRepository.save(ToySiteSeed);
    homeService = new HomeService(homeRepository, themeRepository);
  });

  afterAll(() => db.close);

  it('홈 장난감 추천 리스트를 조회한다.', async () => {
    const toyList = await homeService.fetchList();
    // expect(toyList).toBeCalledWith(expect.anything()); // non-null
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
