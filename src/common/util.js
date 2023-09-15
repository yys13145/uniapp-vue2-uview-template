export function dateFormat(timestamp, formats){
    formats = formats || 'Y-m-d';
    let zero = v => v < 10 ? `0${v}` : v
    let myDate = timestamp ? new Date(timestamp) : new Date();
    let year = myDate.getFullYear();
    let month = zero(myDate.getMonth() + 1);
    let day = zero(myDate.getDate());
    let hour = zero(myDate.getHours());
    let minute = zero(myDate.getMinutes());
    let second = zero(myDate.getSeconds());

    return formats.replace(/Y|m|d|H|i|s/ig, matches => {
        return ({
            Y: year,
            m: month,
            d: day,
            H: hour,
            i: minute,
            s: second
        })[matches];
    });
}
 
export function formatDate(initdate, fmt) { //author: meizz
           
    var date = new Date(+initdate) 
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    
    return fmt;
}

export function parseDate(val) {
     var nowdate = new Date();
     switch(val) {
         case '0': //当天
         return {
             receiptDate: formatDate(new Date(nowdate),'yyyy-MM-dd'),
             receiptEndDate: formatDate(nowdate,'yyyy-MM-dd')
         }
         break;
         case '1': //近一周
             return {
                 receiptDate: formatDate(new Date(nowdate-7*24*3600*1000),'yyyy-MM-dd'),
                 receiptEndDate: formatDate(nowdate,'yyyy-MM-dd')
             }
         break;
         case '2': //近一月
             return {
                 receiptDate: formatDate(new Date(nowdate-24*3600*1000*30),'yyyy-MM-dd'),
                 receiptEndDate: formatDate(nowdate,'yyyy-MM-dd')
             }
         break;
         case '3': //近一年
             return {
                 receiptDate: formatDate(new Date(nowdate-24*3600*1000*365),'yyyy-MM-dd'),
                 receiptEndDate: formatDate(nowdate,'yyyy-MM-dd')
             }
         break;
     }
 }