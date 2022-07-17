import { Request, Response } from "express";
import { HttpCode, JsonController, Post, Req, Res, UploadedFiles } from "routing-controllers";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import util from "../modules/util";
import { ToyService } from "../services/ToyService";
import { logger } from "../utils/Logger";
import * as iconv from "iconv-lite"
import { categoryType, playHowType, toySiteConstant } from "../constants/ToyConstants";
import { ToyCreateDto } from "../dtos/ToyDto";
import { ToySite } from "../entities/ToySite";
import { ToySiteCreateDto } from "../dtos/ToySiteDto";
import { ToySiteService } from "../services/ToySiteService";

@JsonController("/toy")
export class ToyUploadController {
    constructor(private toyService: ToyService, private toySiteService: ToySiteService) { }

    @HttpCode(200)
    @Post("/data")
    public async uploadData(
        @Req() req: Request,
        @Res() res: Response,
        @UploadedFiles("files") files: Express.Multer.File[]
    ) {
        try {

            files.map(async (file) => {
                const rowData = iconv.decode(Buffer.concat([file.buffer]), "euc-kr").toString()
                const rows: String[] = rowData.split("\r\n")
                const header = rows[0].split(",")
                rows.map(async (row, index) => {
                    const data = row.split("\"")
                    console.log(data)
                    console.log(data.length)
                    let ageData
                    let siteData
                    let toyPersonal
                    let title
                    let price
                    let priceCd
                    let link
                    let image
                    let month
                    let minMonth
                    let maxMonth
                    let playHowCd
                    let playHow
                    let categoryCd
                    let category
                    if (data.length == 3) {
                        ageData = data[1].split(',')
                        siteData = data[0].split(',')
                        toyPersonal = data[2].split(',')
                        title = siteData[0]
                        price = parseInt(siteData[1])
                        priceCd = parseInt(siteData[2])
                        link = siteData[3]
                        image = siteData[5]
                        month = siteData[6]
                        minMonth = parseInt(ageData[0])
                        maxMonth = parseInt(ageData[ageData.length - 1])
                        playHowCd = parseInt(toyPersonal[1])
                        playHow = playHowType[playHowCd]
                        categoryCd = parseInt(toyPersonal[2])
                        category = categoryType[categoryCd]
                    } else {
                        const splitData = data[0].split(",")
                        title = splitData[0]
                        price = parseInt(splitData[1])
                        priceCd = parseInt(splitData[2])
                        link = splitData[3]
                        image = splitData[4]
                        month = splitData[6]
                        minMonth = parseInt(splitData[7])
                        maxMonth = parseInt(splitData[7])
                        playHowCd = parseInt(splitData[8])
                        playHow = playHowType[playHowCd]
                        categoryCd = parseInt(splitData[9])
                        category = categoryType[categoryCd]
                    }

                    const toyCreateDto = new ToyCreateDto()
                    let toySiteCd = 0
                    const toySiteName = `${file.originalname}`.split('.csv')[0]
                    switch (toySiteName) {
                        case "국민장난감":
                            toySiteCd = 1;
                            break;
                        case "그린키드":
                            toySiteCd = 2;
                            break;
                        case "러브로":
                            toySiteCd = 3;
                            break;
                        case "리틀베이비":
                            toySiteCd = 4;
                            break;
                        case "빌리바바":
                            toySiteCd = 5;
                            break;
                        case "어텐션홈이벤트":
                            toySiteCd = 6;
                            break;
                        case "장난감점빵":
                            toySiteCd = 7;
                            break;
                        case "젤리바운스":
                            toySiteCd = 8;
                            break;
                        case "해피장난감":
                            toySiteCd = 9;
                            break;
                    }
                    toyCreateDto.title = title
                    toyCreateDto.price = price
                    toyCreateDto.priceCd = priceCd
                    toyCreateDto.link = link
                    toyCreateDto.image = image
                    toyCreateDto.month = month
                    toyCreateDto.minMonth = minMonth
                    toyCreateDto.maxMonth = maxMonth
                    toyCreateDto.playHowCd = playHowCd
                    toyCreateDto.playHow = playHow
                    toyCreateDto.categoryCd = categoryCd
                    toyCreateDto.category = category
                    toyCreateDto.toySiteCd = toySiteCd
                    console.log(toyCreateDto)
                    const toy = await this.toyService.create(toyCreateDto)
                    const toySiteDto = new ToySiteCreateDto()
                    toySiteDto.toys = toy

                    // const site = await this.toySiteService.create(toySiteDto)
                })
            })
            return res.send(util.success(statusCode.OK, message.READ_BAORD_LIST_SUCCESS))
        } catch (err) {
            logger.error(err)
        }
    }
}