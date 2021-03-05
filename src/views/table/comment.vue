<template>
  <div>
    <br>
    <el-form :inline="true">
      <el-form-item label="文章编号">
        <el-input v-model="searchMap.articleid" placeholder="文章ID"></el-input>
      </el-form-item>
      <el-form-item label="文章标题">
        <el-input v-model="searchMap.articleid" placeholder="文章标题"></el-input>
      </el-form-item>
      <el-form-item label="发布日期">
        <el-input v-model="searchMap.publishdate" placeholder="发布日期"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch  placeholder="状态" on-text="" off-text=""  active-value="1" inactive-value="0" v-model="searchMap.state" ></el-switch>
      </el-form-item>
      <el-button type="primary" @click="fetchData()">查询</el-button>
    </el-form>
    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="article" label="文章ID"></el-table-column>
      <el-table-column prop="article" label="文章标题"></el-table-column>
      <el-table-column prop="content" label="评论内容"></el-table-column>
      <el-table-column prop="user" label="用户ID"></el-table-column>
      <el-table-column prop="parentid" label="父评论ID"></el-table-column>
      <el-table-column prop="publishdate" label="发布时间"></el-table-column>
      <el-table-column prop="checktime" label="审核时间"></el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleDelete(scope.row.id)" type="text" size="small">删除</el-button>
          <el-button type="warning" plain size="small" @click="handleExamine(scope.row.id)" >审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5,10,20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
import commentApi from '@/api/comment'
export default {
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页大小
      searchMap: {}, // 查询条件
      pojo: {}, // 编辑表单绑定的实体对象
      id: '' // 评论ID
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      commentApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    handleSave() {
      commentApi.update(this.id, this.pojo).then(response => {
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
        if (response.flag) { // 如果成功
          this.fetchData() // 刷新列表
        }
      })
      this.dialogFormVisible = false // 关闭窗口
    },
    handleDelete(id) {
      this.$confirm('确定要删除此纪录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        commentApi.deleteById(id).then(response => {
          this.$message({ message: response.message, type: (response.flag ? 'success' : 'error') })
          if (response.flag) {
            this.fetchData() // 刷新数据
          }
        })
      })
    },
    handleExamine(id) {
      this.$confirm('确定要审核吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        message.handleShowMessage(commentApi.examine(id), this)
      })
    }
  }
}
</script>
