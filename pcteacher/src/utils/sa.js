import sa from '@/utils/sensorsdata';

function sendSaLog(event,paramsObj,globalVariable){
    if(!globalVariable){
        sa.track(event, paramsObj);
    }else{
        let globalVarObj={
            platformType:'Web',
            product:'Online',
            userType:'老师',
            subject_list:JSON.stringify(['英语'])
        };
        let AllParamsObj=Object.assign(globalVarObj,paramsObj);
        sa.track(event,AllParamsObj);
    }
    
}
export default sendSaLog