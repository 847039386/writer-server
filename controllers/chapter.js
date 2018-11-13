const Chapter = require('../proxy').Chapter;
const Handling = require('../common').Handling;

const chapterAndDirectory = async ( ctx ,next ) => {
    let id = ctx.query.id;
    let did = ctx.query.did;
    let result = { success :false }
    if(id && did){
        result = await Chapter.chapterAndDirectory(id,did)
    }else{
        result = Object.assign(result,{ msg :'参数不符合规则' ,data : {}})
    }
    if(result.success){
        let chapter = result.data.chapter;
        chapter = Object.assign(chapter,{ content: chapter.content.replace(/\r\n/g, '<br/><br/>').replace(/\n/g, '<br/><br/>').replace(/\s/g, ' ') })
        await ctx.render('drama-chapter', {
            drama :chapter.drama_id,
            chapter :chapter,
            chapters :result.data.chapters
        })
    }else{
        await ctx.render('default/exception', { 
            img:'',
            title :'剧集错误',
            desc :`剧本剧集可能不存在！`,
            other :true
        })
    }
}


const list = async ( ctx ,next ) => {
    const id = ctx.query.id;
    const page = ctx.query.page || 1;
    const pageSize = ctx.query.pageSize || 999;
    const title = ctx.query.title;
    let result = { success :false }
    if(id){
        result = await Chapter.find(page,pageSize,{
            query : { drama_id : id }
            ,sort : { 'chapterorder' : -1}
            ,select : 'title create_at chapterorder wordCount'
        })
    }else{
        result = Object.assign(result,{ msg :'参数不符合规则' ,data : {}})
    }
    await ctx.render('user/drama/chapters', {
        drama_id :id,
        drama_title : title,
        chapters :result.data.list
        ,current : {
            total :result.data.pagination.total
            ,page :result.data.pagination.current
            ,pageSize :result.data.pagination.size
        }
    })
}

module.exports = {
    chapterAndDirectory,
    list
}