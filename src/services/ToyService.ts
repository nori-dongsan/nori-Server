import { Service } from 'typedi';
import { createQueryBuilder } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { SearchAndFilterDto } from '../dtos/ToyDto';
import { Toy } from '../entities/Toy';
import { ToySite } from '../entities/ToySite';
import { HomeRepository } from '../repositories/HomeRepository';
import { logger } from '../utils/Logger';

@Service()
export class ToyService {
  constructor(@InjectRepository() private toyRepository: HomeRepository) {}

  /**
   * 검색과 필터에 따른 장난감 리스트를 반환한다.
   * @param searchAndFilterDto
   */
  public async searchAndFilter(
    categoryId: string,
    searchAndFilterDto: SearchAndFilterDto
  ) {
    try {
      const filterData: {
        [key: string]: number[] | string[];
      } = {};
      let categorySplitData: string[] = [];

      if (categoryId === '1') {
        categorySplitData = ['3', '4', '5'];
      }

      if (categoryId === '2') {
        categorySplitData = ['10', '11'];
      }

      if (categoryId === '3') {
        categorySplitData = ['14', '15'];
      }

      if (categoryId === '4') {
        categorySplitData = ['12', '13'];
      }

      if (categoryId === '5') {
        categorySplitData = ['6', '7', '8'];
      }

      if (categoryId === '6') {
        categorySplitData = ['1', '2'];
      }

      if (categoryId === '7') {
        categorySplitData = ['9'];
      }
      const searchAndFilterSplitData: {
        [key: string]: string | string[] | undefined;
      } = {};
      let result: Toy[] = [];

      let monthList: number[] = [];
      let priceList: number[] = [];
      let playHowList: number[] = [];
      let storeList: string[] = [];

      // 입력받은 검색 & 필터 조건을 리스트 형태로 split
      for (const key in searchAndFilterDto) {
        if (key === 'search') {
          searchAndFilterSplitData[key] =
            searchAndFilterDto[key as keyof SearchAndFilterDto];
          continue;
        }
        searchAndFilterSplitData[key] =
          searchAndFilterDto[key as keyof SearchAndFilterDto]?.split('');
      }

      const toyCategoryList = await this.toyRepository
        .createQueryBuilder('toy')
        .leftJoinAndMapOne(
          'toy.toySite',
          ToySite,
          'toySite',
          'toy.toySiteCd = toySite.id'
        )
        .where('category_cd IN (:category)', { category: categorySplitData })
        .getMany();

      toyCategoryList.forEach((toyData) => {
        const minMonth = toyData.minMonth;
        const maxMonth = toyData.maxMonth;

        console.log(toyData);

        for (let month = minMonth; month <= maxMonth; month++) {
          if (!monthList.includes(month)) monthList.push(month);
        }

        if (!priceList.includes(toyData.priceCd))
          priceList.push(toyData.priceCd);

        if (!playHowList.includes(toyData.playHowCd))
          playHowList.push(toyData.playHowCd);

        if (!storeList.includes(toyData.toySite.toySite))
          storeList.push(toyData.toySite.toySite);
      });

      filterData.month = monthList.sort();
      filterData.price = priceList.sort();
      filterData.playHow = playHowList.sort();
      filterData.store = storeList;
      console.log(filterData);

      if (Object.keys(searchAndFilterSplitData).length === 0) {
        result = toyCategoryList;

        return { filterData, result };
      }

      toyCategoryList.map((toy) => {
        let isOkay = false;
        for (const key in searchAndFilterSplitData) {
          if (key === 'search') continue;

          if (key === 'categoryCd') {
            if (
              searchAndFilterSplitData[key]?.includes(String(toy.categoryCd))
            ) {
              isOkay = true;
            } else {
              isOkay = false;
            }

            if (isOkay === false) {
              return;
            }
          }

          if (key === 'month') {
            const minMonth = toy.minMonth;
            const maxMonth = toy.maxMonth;
            const monthList = [];
            for (let month = minMonth; month <= maxMonth; month++) {
              monthList.push(String(month));
            }

            const month = monthList.filter((month) =>
              searchAndFilterSplitData[key]?.includes(month)
            );

            if (month.length > 0) {
              isOkay = true;
            } else {
              isOkay = false;
            }

            if (isOkay === false) {
              return;
            }
          }

          if (key === 'priceCd') {
            if (searchAndFilterSplitData[key]?.includes(String(toy.priceCd))) {
              isOkay = true;
            } else {
              isOkay = false;
            }

            if (isOkay === false) {
              return;
            }
          }

          if (key === 'playHowCd') {
            console.log(toy);
            if (
              searchAndFilterSplitData[key]?.includes(String(toy.playHowCd))
            ) {
              isOkay = true;
            } else {
              isOkay = false;
            }

            if (isOkay === false) {
              return;
            }
          }

          if (key === 'store') {
            if (
              searchAndFilterSplitData[key]?.includes(String(toy.toySiteCd))
            ) {
              isOkay = true;
            } else {
              isOkay = false;
            }

            if (isOkay === false) {
              return;
            }
          }
        }
        if (isOkay === true) {
          result.push(toy);
        }
      });

      return { filterData, result };
    } catch (err) {
      logger.error(err);
    }
  }
}
