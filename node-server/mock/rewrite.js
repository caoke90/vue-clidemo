module.exports = [
  {

    //本地的url =》 本地的url
    "/":"/document/index.html",
  }, {
    //线上的url =》 本地的mock
    "/ok": "/ok",
    "/teacher/assign/questionCart": "/teacher/assign/questionCart",
    "/question/choice": "/question/choice.json",
  },
  //题包接口 吴桐
  {
    "/assign/loadpackageContent": "/assign/loadpackageContent.json",
    "/assign/questionBankSearchCondition": "/assign/questionBankSearchCondition.json",
    "/assign/getQuestionsFromQuestionBank": "/assign/getQuestionsFromQuestionBank.json",
  },
  {

    // 购题车 2、通过压缩数据，请求完整数据
    "/v1/cart/questionCart": "/v1/cart/questionCart.json",
    "/v1/cart/info": "/v1/cart/info.json",
    "/v1/cart/add_questions": "/v1/cart/add_questions.json",
    "/v1/cart/flush": "/v1/cart/flush.json",
    "/v1/cart/preview": "/v1/cart/preview.json",
    "/v1/cart/remove_questions": "/v1/cart/remove_questions.json"
  }
]
