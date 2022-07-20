const message = {
  NULL_VALUE: '필요한 값이 없습니다.',
  FORBIDDEN: 'Forbidden',
  DUPLICATED: 'Duplicated',
  NOT_FOUND: '존재하지 않는 자원',
  BAD_REQUEST: '잘못된 요청',
  INTERNAL_SERVER_ERROR: '서버 내부 오류',
  TOKEN_ERROR: '토큰이 없거나 검증이 안된 토큰입니다',
  NULL_VALUE_TOKEN: '토큰이 없습니다.',
  EXPIRED_TOKEN: '만료된 토큰입니다.',
  CREATE_TOKEN: '토큰 생성 완료',
  INVALID_TOKEN: '검증이 안된 토큰입니다.',
  INVALID_PASSWORD: '비밀번호 오류',

  // 유저
  CREATE_USER: '유저 생성 성공',
  NONEXIST_USER: '존재하지 않는 유저',
  CREATE_USER_FAIL: '유저 생성 실패',
  LOGIN_SUCCESS: '로그인 성공',
  DUPLICATE_NICKNAME: '이미 사용중인 닉네임입니다',
  AVAILABLE_NICKNAME: '사용가능한 닉네임입니다.',

  // 장난감
  READ_TOY_SUCCESS: '장난감 조건 조회 성공',

  // 홈
  FETCH_HOME_DATA_SUCCESS: '홈 데이터 조회 성공',

  // 컬렉션
  FETCH_COLLECTION_DATA_SUCCESS: '장난감 컬렉션 리스트 조회 성공',

  // 게시판
  READ_BAORD_LIST_SUCCESS: '게시물 목록 조회 성공',
  READ_BOARD_FAIL: '게시물 조회 실패',
  READ_BOARD_SUCCESS: '게시물 조회 성공',
  CREATE_BOARD_SUCCESS: '게시물 생성 성공',

  // 댓글
  CREATE_COMMENT_SUCCESS: '댓글 작성 성공',
};

export default message;
