# Nori-Server with Express
요즘 누가 롯데월드 가나~? 나는 💚nori-dongsan💚 Server로 간다

## Member

#### [구건모](https://github.com/gunom)
* 크롤링, 크롤링 DB연동, 커뮤니티 기능

#### [이다은](https://github.com/dannaward)
* 홈, 컬렉션 기능

#### [이승헌](https://github.com/lsh328328)
* 서버 세팅, 소셜로그인, 검색 & 필터 기능

## 서버 계약서

* [Commit convention](https://happy-elephant-0ba.notion.site/Branch-Strategy-e9de712df9ff4874a546a0cba47467f7)
* [Code convention](https://happy-elephant-0ba.notion.site/Clean-Code-f0ca109f3087431c994180aeda6031ee)
* [Branch strategy](https://techblog.woowahan.com/2553/)
* [ERD](https://happy-elephant-0ba.notion.site/ERD-7cdf8bd16e1b4a3bbbcf35b6dce1d28b)

## Project structure

```markdown
📦 src
┣ 📂 constants
┃ 📂 controllers
┣ 📂 dtos
┣ 📂 entities
┣ 📂 middlewares
┣ 📂 modules
┣ 📂 repositories
┣ 📂 services
┣ 📂 utils
┣ 📜 app.ts
┣ 📜 database.ts
┣ 📜 env.ts
┣ 📜 server.ts
```

## Dependencies Module
```markdown
"dependencies: {
    "aws-sdk": "^2.1178.0",
    "body-parser": "^1.20.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.13.2",
    "class-validator-jsonschema": "^3.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.0.1",
    "express": "^4.18.1",
    "jsonwebtoken": "^8.5.1",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "mysql2": "^2.3.3",
    "reflect-metadata": "^0.1.13",
    "routing-controllers": "^0.8.0",
    "routing-controllers-openapi": "^1.8.1",
    "slack-node": "^0.1.8",
    "swagger-ui-express": "^4.1.4",
    "ts-node": "^10.8.2",
    "typedi": "^0.8.0",
    "typeorm": "^0.2.24",
    "typeorm-typedi-extensions": "^0.4.1",
    "typescript": "^4.7.4",
    "winston": "^3.8.1",
    "winston-daily-rotate-file": "^4.7.1"
}
```

## 전체 API 로직 구현 진척도
* API 코드 작성 100%

[API 명세서](https://happy-elephant-0ba.notion.site/API-066af5edeae34f01b3a6c098ac95cda6)
