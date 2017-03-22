<?php
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: kerry.gao <1509699669@vip.qq.com> <http://weibo.com/coderzero>
// +----------------------------------------------------------------------
namespace Admin\Controller;
use Think\Controller;
use Think\Upload\Driver\Qiniu\QiniuStorage;
use Common\Tools\Page;

class ArticleController extends BaseController {

  /**
   * [contentManage 文章内容列表页]
   * @return [type] [description]
   */
  public function index(){
      $arr = I();
      $table = M('article');
      $articleCategory = M('article_category');
      $where = array('is_del' =>0);
      if($arr['search']){
          $where['title']=array('like',"%".$arr['search']."%");
      }
      if($arr['categoryid']){
          $where['category_id'] = $arr['categoryid'];
      }
      $articleCategorys = $articleCategory->select();

      $count = $table->where($where)->count();
      $pagesize = C('BACKEND_PAGESIZE');
      $page = getpage($count,$pagesize);

      $result = $table->where($where)->order('createtime desc')->limit($page->firstRow.','.$page->listRows)->select();
      foreach ($result as $key => $value) {
          $category = $articleCategory->where(array('id'=>$value['category_id']))->find();
          $result[$key]['categoryName'] = $category['name'];
      }
      $nowPage = $arr['p'] && $arr['p'] > 1 ? $arr['p'] : 1;
      $totalSize = $count;
      $totalPage = ceil($count/$pagesize);

      $this->assign('page',$page->show());
      $this->assign('search',$arr['search']);
      $this->assign('categoryid',$arr['categoryid']);
      $this->assign('categorys',$articleCategorys);
      $this->assign('nowPage',$nowPage);
      $this->assign('result', $result); // 赋值数据集
      $this->assign('totalSize',$totalSize);
      $this->assign('totalPage',$totalPage);
      $this->display();
  }


    public function addArticle(){
        $articleCategory = M('article_category');
        $articleCategorys = $articleCategory->select();
        $articleTags = M('article_tags');
        $articleTagsData = $articleTags->select();
        $this->assign('articleTags',$articleTagsData);
        $this->assign('categorys',$articleCategorys);
        $this->display();
    }

    public function editArticle(){
        $arr = I();
        $articleCategory = M('article_category');
        $relational = M('article_tags_relational');
        $article = M('article');
        $articleCategorys = $articleCategory->select();
        $where = array('id'=>$arr['id']);
        $whereStage = array('article_id'=>$arr['id']);
        $stags = $relational->where($whereStage)->select();
        $result = $article->where($where)->find();
        $articleTags = M('article_tags');
        $articleTagsData = $articleTags->select();
        $this->assign('stags',$stags);
        $this->assign('articleTags',$articleTagsData);
        $this->assign('categorys',$articleCategorys);
        $this->assign('result',$result);
        $this->display();
    }

    public function addArticleMethod(){
    	$arr = I();
    	$article = D('article');
    	if($article->create($arr)){
    		$aid = $article->add();
            if($aid){
                $relational = M('articleTagsRelational');
                foreach ($arr['tagName'] as $key => $value) {
                    $data = array('article_id'=>$aid,'tags_id'=>$value);
                    $relational->data($data)->add();
                }
            }
    	}
    	$this->redirect('Article/editArticle', array(
          'id' => $aid
      ));
    }

    public function editArticleMethod(){
    	$arr = I();
    	$article = M('article');
    	$article->data($arr)->save();
      $relational = M('articleTagsRelational');
      $where = array('article_id'=>$arr['id']);
      $relational->where($where)->delete();
      foreach ($arr['tagName'] as $key => $value) {
          $data = array('article_id'=>$arr['id'],'tags_id'=>$value);
          $relational->data($data)->add();
      }
      $this->redirect('Article/editArticle', array(
          'id' => $arr['id']
      ));
    }

    /**
     * [articleIsShow 是否发布]
     * @return [type] [description]
     */
    public function articleIsShow(){
        $arr = I();
        $articleId = $arr['id'];
        $article = M('article');
        $where = array('id'=>$articleId);
        $data = $article->field('is_show')->where($where)->find();
        if($data['is_show']){
            $data = $article->where($where)->save(array('is_show'=>'0'));
            $this->resultMsg('success', '取消发布成功', '0');
        }else{
            $data = $article->where($where)->save(array('is_show'=>'1'));
            $this->resultMsg('success', '发布成功','1');
        }
    }

    /**
     * [articleIsTop 是否置顶]
     * @return [type] [description]
     */
    public function articleIsTop(){
        $arr = I();
        $articleId = $arr['id'];
        $article = M('article');
        $where = array('id'=>$articleId);
        $data = $article->field('is_top')->where($where)->find();
        if($data['is_top']){
            $data = $article->where($where)->save(array('is_top'=>'0'));
            $this->resultMsg('success', '取消置顶成功', '0');
        }else{
            $data = $article->where($where)->save(array('is_top'=>'1'));
            $this->resultMsg('success', '置顶成功','1');
        }
    }

    /**
     * [delArticle 删除文章]
     * @return [type] [description]
     */
    public function delArticle(){
        $arr = I();
        $articleId = $arr['id'];
        $article = M('article');
        $where = array('id'=>$articleId);
        $data = $article->where($where)->save(array('is_del'=>'1'));
        $this->resultMsg('success', '删除成功', '1');
    }


}
