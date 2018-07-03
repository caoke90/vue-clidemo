// todo 购题车需要完成的任务（依据数据结构）
// 购题车组件主要负责 （因为购题车是一个公共服务，所以需要考虑到题目的数据结构和相对的对题包题目的遍历等方法）
// 初始化数数据--- 请求后端接口初始化进入h5布置页面的购题车所需数据---对接业务传给壳
// 对接业务传给壳：需要“所选题目数量”“所选题目做题时长”“所选题目详情”
// 数据变动：添加，删除，选词，删词等业务 （选择题包，单题，题组（多个题目）等） 删除单题时需要考虑是否是一个选中题包中的题目，还是一个单题 以上所有都需要依赖后端新的购题车数据结构而定
// 保存变动：调用接口保存数据 ， 删除数据
// 业务逻辑所需：题目添加上限300道，时长算法方法，题目选择数量方法， 选择班级数量方法，所选题目详情数据方法，清除所有数据方法 遍历题包方法。
// 补充：去除重复题目方法详见原来项目中 repeatQuestionsCount方法逻辑


//购题车交互与壳
if (window.external && window.external.updateCart) {
    window.external.updateCart(JSON.stringify({
      question_count: Cart.getAssignQuestionsCount(),
      duration_minutes: Cart.getAssignElapsedTimeInMinutes(),
      cart_detail:Cart.getQusetionDetail()
  }));
}


//购题车的基类
export class Cart {

  constructor(){

    this.selectedQuestionCount = 0; // 选的题目数量
    this.selectedClazzCount = 0;
    this.assignElapsedTimeInMinutes =0; // 布置作业2.0中的时间
    this.cartDetail = []; // 返回给原生使用的题目数据详细
    this.upperLimitCount= 300;
    this.categoriedObjects = {}; // 原来的购题车数据
    this.allClazzCount = 0;// 所选班级数量
  }

  load (){
    // 进行ajax操作调用请求购题车数据接口返回数据后进行组装

    // 需要根据新的购题车数据接口进行简单的数据组装
  }

  // 当前被选中多少题目这个不是用来和壳交互的用来在购题车中和题目数据
  getSelectedQuestionsCount() {
    let count = 0;

    // 选择了多少题目逻辑待实现
    return count;
  };

  // 添加题目超出范围
  isMoreThanUpperLimit(selectedQuestions) {

    if (!Array.isArray(selectedQuestions)) {
      selectedQuestions = [selectedQuestions];
    }

    let count = 0;
    selectedQuestions.forEach(function(question){
      count += question.getQuestionCount();
    });
    let willCount = count + this.getSelectedQuestionsCount();
    if(willCount > this.upperLimitCount){
      // todo alert暂时写在这里，等待封装的弹出框公方法
      alert("题目无法加入，一次作业上限为300道题，请老师拆分为多次布置~");
      // 题目现在超出范围变更状态
      // 此处需要通知原生方法 修改题目详细
      return false;

    }else{
      return true;
    }
  }

  // 添加一个题包
  addObjectiveQuestionPackage(objectiveQuestionPackages, options) {
    let theObjective = null;
    if(!Array.isArray(objectiveQuestionPackages)){
        objectiveQuestionPackages = [objectiveQuestionPackages];
    }

    // todo 逻辑
    return theObjective;
  }

  // 删除一个题包
  removeObjectiveQuestionPackage(objectiveQuestionPackages, options) {
    if(!Array.isArray(objectiveQuestionPackages)){
        objectiveQuestionPackages = [objectiveQuestionPackages];
    }

    // todo 逻辑
  }

  // 添加一道题 因为是在提包里的题目需要对提包状态修改 如果不是提包中的一道不需要传
  addQuestion(question, objectiveQuestionPackage, options) {

    // todo 逻辑

  }

  // 删除一道题 因为是在提包里的题目需要对提包状态修改 如果不是提包中的一道不需要传
  removeQuestion(question, objectiveQuestionPackage, options) {

    // todo 逻辑

  }

  // 一共选择了多少题目getAssignQuestionsCount
  getAssignQuestionsCount() {

    return  this.uniformAssign(function (categoried) {
      return categoried.getSelectedQuestionsCount();
    }.bind(this),function (objective) {
      return objective.getSelectedQuestionsCount();
    }.bind(this));

  }

  // 所选题型的总时间getAssignElapsedTimeInMinutes
  getAssignElapsedTimeInMinutes() {
    return  this.uniformTimeAssign(function (categoried) {
      return categoried.getEsimatedElapsedTime();
    }.bind(this),function (objective) {
      return objective.getSelectedEsimatedElapsedTimeTaken();
    }.bind(this));
  }

  // todo 所选题目的详细数据给原生展示用getQusetionDetail
  getQusetionDetail () {

    let detailArray = [];

    //遍历每一个类型对象
    this.categoriedObjects.forEach(function(categoried) {
      if (categoried.selectedClazzCount && categoried.selectedClazzCount>0) {
        detailArray.push({block_name:categoried.name,block_value:categoried.selectedClazzCount+'个班'});
      }
      else if (categoried.selectedQuestionCount && categoried.selectedQuestionCount>0) {
        detailArray.push({block_name:categoried.name,block_value:categoried.selectedQuestionCount+'道'});
      }
    });

    return detailArray;
  }

  // todo 布置作业2.0时间和题目数量交互统一方法 现在看新需求和数据结构去实现吧暂时列在这里供你参考
  uniformAssign (callbackone,callbacktwo) {
    let count = 0, //普通题时间
        min = 0,
        max = 0,
        specialObj = {},
        specialOrignArray = [],
        specialArray = [];

    this.categoriedObjects.forEach(function(categoried) {
      // 特殊的2大类型 高频错题和薄弱巩固
      if (categoried.name && (categoried.name==='高频错题' || categoried.name==='巩固练习')) {

        if (categoried.objectives && categoried.objectives.length>0) {
          categoried.objectives.forEach(function (objective) {
            specialOrignArray.push(objective);
          });
        }

      }
      else if (categoried.selectedQuestionCount && categoried.selectedQuestionCount>0) {

        count += callbackone(categoried);//普通时间/数量总和
      }
    }.bind(this));

    // 找到每一个不同的班级布置得特殊类型作业
    if (specialOrignArray.length>0 && this.allClazzCount>0) {

      specialOrignArray.forEach(function (objective) {

        if (!specialObj[objective.clazz_id]) {
          specialObj[objective.clazz_id] = callbacktwo(objective);
        }
        else {
          specialObj[objective.clazz_id] += callbacktwo(objective);//班级相同则加总
        }

      });

      for (var i in specialObj) {
        specialArray.push(specialObj[i]);
      }

      max = count+(Math.max.apply(null, specialArray));

      // 布置的班级题目数量与这个老师总班级数量区分显示
      if (this.allClazzCount > specialArray.length) {
        min = count>0?count:Math.min.apply(null, specialArray);
      }
      else if(this.allClazzCount == specialArray.length) {
        min = count>0?count+(Math.min.apply(null, specialArray)):Math.min.apply(null, specialArray);
      }

      return (min == max)?max.toString():min+"~"+max;
    }

    return count.toString();
  }

  // todo 布置作业2.0时间 现在看新需求和数据结构去实现吧暂时列在这里供你参考
  uniformTimeAssign (callbackone,callbacktwo) {
    let count = 0, //普通题时间
        min = 0,
        max = 0,
        specialObj = {},
        specialOrignArray = [],
        specialArray = [];

    this.categoriedObjects.forEach(function(categoried) {
      //特殊的2大类型 高频错题和薄弱巩固
      if (categoried.name && (categoried.name==='高频错题' || categoried.name==='巩固练习')) {

        if (categoried.objectives && categoried.objectives.length>0) {
          categoried.objectives.forEach(function (objective) {
            specialOrignArray.push(objective);
          });
        }

      }
      else if (categoried.selectedQuestionCount && categoried.selectedQuestionCount>0) {

        count += callbackone(categoried);//普通时间/数量总和
      }
    }.bind(this));

    //找到每一个不同的班级布置得特殊类型作业
    if (specialOrignArray.length>0 && this.allClazzCount>0) {

      specialOrignArray.forEach(function (objective) {

        if (!specialObj[objective.clazz_id]) {
          specialObj[objective.clazz_id] = callbacktwo(objective);
        }
        else {
          specialObj[objective.clazz_id] += callbacktwo(objective);//班级相同则加总
        }

      });

      for (var i in specialObj) {
        specialArray.push(specialObj[i]);
      }

      max = count+(Math.max.apply(null, specialArray));

      //布置的班级题目数量与这个老师总班级数量区分显示
      if (this.allClazzCount > specialArray.length) {
        min = count>0?count:Math.min.apply(null, specialArray);
      }
      else if(this.allClazzCount == specialArray.length) {
        min = count>0?count+(Math.min.apply(null, specialArray)):Math.min.apply(null, specialArray);
      }

      max = Math.ceil(max/60);
      min =  Math.ceil(min/60);

      return (min == max)?max.toString():min+"~"+max;
    }

    return Math.ceil(count/60).toString();
  }

  // todo 保存数据删除数据等接口方法
  saveAddQuestion(){

  }
}

