module.exports = [
  {

    //本地的url =》 本地的url
    "/":"/mteacher/list.html",
  }, {
    //线上的url =》 本地的mock
    "/ok": "/ok",
    "/teacher/assign/questionCart": "/teacher/assign/questionCart",
    "/question/choice": "/question/choice.json",
  },
  //题包接口 吴桐
  {
    "/v1/assign/loadpackageContent": "/assign/loadpackageContent1.json",
    "/v1/assign/loadpackageContent2": "/assign/loadpackageContent2.json",
    // "/v1/assign/questionBankSearchCondition": "/assign/questionBankSearchCondition.json",
    "/v1/assign/questionBankSearchCondition": "/assign/newQuestionBankSearchCondition.json",
    "/v1/assign/getQuestionsFromQuestionBank": "/assign/getQuestionsFromQuestionBank.json",
    "/v1/assign/loadPaperContent": "/assign/loadPaperContent.json",
    "/v1/assign/getBigdataPackageContent": "/assign/getBigdataPackageContent.json",
    "/v1/assign/lessonWrongPackageList": "/assign/lessonWrongPackageList.json",
    "/v1/assign/lessonWrongContent": "/assign/lessonWrongContent.json",
    "/v1/assign/changeSpeakingMode": "/v1/assign/changeSpeakingMode.json",
    "/v1/assign/changeFollowUpNum": "/v1/assign/changeFollowUpNum.json",
    "/v1/assign/listenSpeakSpecialContent": "/assign/listenSpeakSpecialContent.json",
    "/v1/assign/listenSpeakPaperContent": "/assign/listenSpeakPaperContent.json",

  },
  {
    "/v1/review/questionTypesDetail": "/review/questionTypesDetail.json",
    "/v1/review/config": "/review/config.json",
    "/v1/review/knowledgePointSearchConditions": "/review/knowledgePointSearchConditions.json",
    "/v1/review/knowledgePointDetail": "/review/knowledgePointDetail.json",
    "/v1/review/paperDetail": "/assign/paperDetail.json"
  },
  {

    // 购题车 2、通过压缩数据，请求完整数据
    "/v1/cart/questionCart": "/v1/cart/questionCart.json",
    "/v1/cart/info": "/v1/cart/info.json",
    "/v1/cart/add_questions": "/v1/cart/add_questions.json",
    "/v1/cart/flush": "/v1/cart/flush.json",
    "/v1/cart/preview": "/v1/cart/preview.json",
    "/v1/cart/remove_questions": "/v1/cart/remove_questions.json"
  },
  {
    // 期末复习
    "/mteacher/ReviewHomework/reportList": "/finalReview/reportList.json",
    "/v1/finalReview/index": "/finalReview/index.json",
    "/pc/v1/assign/loadUlTree": "/assign/loadUlTree.json",
    "/mteacher/ReviewHomework/listDay": "/page/listDay.json"
  },
  {
    // 反馈页面
    "/mteacher/page/feedbackDetail": "/page/feedbackDetail.json"
  },
  {
    //寒假作业
    "/pc/v1/assign/loadUlTree":"/assign/loadUlTree.json",
    "/v1/vacation/bookPlan":"/v1/vacation/bookPlan.json",
    "/Mteacher/vacation/isAllClassesAssigned":"/v1/vacation/isAllClassesAssigned.json",
    "/Mteacher/vacation/classStatus":"/v1/vacation/classStatus.json",
    "/Mteacher/vacation/StudentsStatus": "/v1/vacation/StudentsStatus.json",
    "/Mteacher/vacation/StudentStatus": "/v1/vacation/StudentStatus.json",
    "/Mteacher/vacation/deletePlan": "/v1/vacation/deletePlan.json",
    "/Mteacher/vacation/changePlanTime": "/v1/vacation/changePlanTime.json",
    "/Mteacher/vacation/rewardToConfigure": "/v1/vacation/rewardToConfigure.json"
  },
  {
    //复习计划
    "/v1/finalReview/basicsConsolidate": "/v1/finalReview/basicsConsolidate.json", //基础巩固
    "/v1/finalReview/listenUnitList": "/v1/finalReview/listenUnitList.json", //听力列表
    "/v1/finalReview/lessonWrongPackageList": "/v1/finalReview/lessonWrongPackageList.json", //高频错题列表
    "/v1/finalReview/grammarUnitList": "/v1/finalReview/grammarUnitList.json",// 语法,词汇列表
    "/v1/finalReview/grammarPackageContent": "/v1/finalReview/grammarPackageContent.json",//语法、词汇题包数据
    "/v1/finalReview/listenPackageContent": "/v1/finalReview/listenPackageContent.json" ,//听力题包数据
    "/v1/finalReview/lessonWrongPackageContent": "/v1/finalReview/lessonWrongPackageContent.json", //高频错题题包数据
    "/v1/finalReview/FinalComprehensiveDetection": "/assign/paperDetail.json"
  }
]
