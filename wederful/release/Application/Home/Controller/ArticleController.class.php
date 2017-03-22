<?php
namespace Home\Controller;
use Think\Controller;

class ArticleController extends BaseController {

    /**
     * [articleList 文章列表页]
     * @return [type] [description]
     */
    public function index(){
        $arr = I();
        $article = M('article');
        $currenCategory = $_SERVER['CATEGORY'];
        $articleCategory = M('article_category');
        $articleCategorys = $articleCategory->select();

        $where = array('is_show'=>'1','is_del'=>'0');
        if($arr['category']){
            $where['category_id'] = $arr['category'];
        }
        // $list = $article->where($where)->order('createtime')->select();
        $listHot = $article->where(array('is_show'=>'1','is_del'=>'0'))->order('visit_num desc')->limit(0,5)->select();


        $count = $article->where($where)->count();// 查询满足要求的总记录数
        
        $page = getpage($count,10);
        $page->route = 'article';

        $list = $article->where($where)->limit($page->firstRow.','.$page->listRows)->order('is_top desc')->select();

        $this->assign('currenCategory',$currenCategory);
        $this->assign('categorys',$articleCategorys);
        $this->assign('page', $page->show());
        $this->assign('list', $list);
        $this->assign('listHot', $listHot);
        $this->display();
    }

    public function articleDetail(){
        $arr =I();
        $article = M('article');
        $tags = M('articleTags');
        $relational = M('articleTagsRelational');
        $articleCategory = M('article_category');
        $articleCategorys = $articleCategory->select();

        $article->where(array('id'=>$arr['id']))->setInc('visit_num');
        $data = $article->where(array('id'=>$arr['id']))->find();
        $listHot = $article->where(array('is_show'=>'1','is_del'=>'0'))->order('visit_num desc')->limit(0,5)->select();
        $relat = $relational->where(array('article_id'=>$arr['id']))->select();
        $aboutArticle = "";
        
        if($relat){
            $tag = array();
            $t = array();
            foreach ($relat as $key => $value) {
                $d = $tags->where(array('id'=>$value['tags_id']))->find();
                $tag[$key]['name'] = $d['name'];
                $tag[$key]['id'] = $d['id'];
                if($d){              
                    $t[$key][] = 'eq';
                    $t[$key][] = $d['id'];
                }
            }
            if($t){
                array_push($t, 'or');
                $condition = array();
                $condition['tags_id'] = $t;
                $condition['article_id'] = array('neq',$arr['id']);
                $about = $relational->distinct(true)->field('article_id')->where($condition)->select();
                if($about){
                    $about = i_array_column($about,'article_id');
                    $con['id']= array('in',$about);
                    $con['is_show']= '1';
                    $aboutArticle = $article->where($con)->limit(0,2)->select();
                }
            }
        }

        $this->assign('aboutArticle', $aboutArticle);
        $this->assign('listHot', $listHot);
        $this->assign('categorys',$articleCategorys);
        $this->assign('data', $data);
        $this->assign('tag', $tag);
        $this->display();
    }

    /**
     * [praise 点赞]
     * @return [type] [description]
     */
    public function praise(){
        $arr = I();
        $articleId = $arr['aid'];
        if($articleId){        
            $article = M('article');
            $article->where(array('id'=>$articleId))->setInc('praise_num');
            $praise_num = $article->field('praise_num')->where(array('id'=>$articleId))->find();
            $this->resultMsg('success', '点赞成功',$praise_num);
        }
    }

}