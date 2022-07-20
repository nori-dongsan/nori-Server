import {
  Get,
  HttpCode,
  JsonController,
  QueryParams,
  Res,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Response } from 'express';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import message from '../modules/responseMessage';
import { logger } from '../utils/Logger';
import { IsAlpha, IsInt } from 'class-validator';
import { CollectionService } from '../services/CollectionService';

class GetCollectionQuery {
  @IsInt()
  theme: number;

  sort: string | null;
}

@JsonController('/collection')
export class CollectionController {
  constructor(private collectionService: CollectionService) {}

  @HttpCode(200)
  @Get('')
  @OpenAPI({
    summary: '컬렉션 별 데이터 조회',
    description: '컬렉션별 데이터 반환',
    statusCode: '200',
  })
  public async getData(
    @QueryParams() query: GetCollectionQuery,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const list = await this.collectionService.fetchList(
        query.theme,
        query.sort
      );

      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            message.FETCH_COLLECTION_DATA_SUCCESS,
            list
          )
        );
    } catch (err) {
      logger.error(err);

      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR
          )
        );
    }
  }
}
