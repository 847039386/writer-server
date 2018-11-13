/**
 * 热度算法,很简单大神勿喷.
 * @param   {any}     createAt    发布时间
 * @param   {number}  score       分数：例如一个赞的分数 
 * @return  {number}              总分   
 * @example
 *   (发布时间:今天)   追加分数    (11 - 0) /100 = 0.11;
 *   (发布时间:10天后) 追加分数    (11 - 10)/100 = 0.01; 
 *   0.1 为分数; 
 *   算法: (11 - 发布天数) / 100 + 分数;
 *   例1: 今天:    (11 - 0) / 100 + 0.1  = 0.21;
 *   例2: 10天后:  (11 - 10) / 100 + 0.01  = 0.11;
 *   总分数 = 追加分数 + 分数;
 */
const heat = ( createAt , score ) => {
    score = score || 0;
    let be = 10;
    const today = new Date();
    let total_score = 0;
    if(createAt){
        try {
            // 发布与今天相隔时间;
            be = Math.floor((Date.parse(today) - Date.parse(createAt)) / (1000 * 60 * 60 * 24));
            if(!isNaN(be)){
                be = be > 10 ? 10 : be;
                const add_to_score = ( 11 - be ) / 100;
                total_score = add_to_score + score;
                total_score = total_score.toFixed(2);
            }else{
                total_score = 0;
            }
        } catch (error) {
            total_score = 0;
        }
    }
    // 总分数 = 追加分数 + 分数
    return total_score;
}




exports.heat = heat;