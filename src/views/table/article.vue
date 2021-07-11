<template>
  <div>
    <br />
    <el-form :inline="true">
      <el-form-item label="标题">
        <el-select
          v-model="searchMap.title"
          filterable
          remote
          placeholder="文章标题"
          :remote-method="searchArticleTitle"
          :loading="loading"
        >
          <el-option
            v-for="item in titleList"
            :key="item.id"
            :label="item.title"
            :value="item.title"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属频道">
        <el-select
          v-model="searchMap.channelid"
          filterable
          remote
          :remote-method="searchChannel"
          :loading="loading"
          placeholder="所属频道"
        >
          <el-option v-for="item in channel" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          placeholder="状态"
          on-text
          off-text
          active-value="1"
          inactive-value="0"
          v-model="searchMap.state"
        ></el-switch>
      </el-form-item>
      <el-button type="primary" @click="fetchData()">查询</el-button>
    </el-form>
    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="columnid" label="专栏ID"></el-table-column>
      <el-table-column prop="userid" label="用户ID"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="image" label="文章封面"></el-table-column>
      <el-table-column prop="createtime" label="发表日期"></el-table-column>
      <el-table-column prop="ispublic" label="是否公开"></el-table-column>
      <el-table-column prop="istop" label="是否置顶"></el-table-column>
      <el-table-column prop="state" label="审核状态"></el-table-column>
      <el-table-column prop="channelid" label="所属频道"></el-table-column>
      <el-table-column prop="url" label="URL"></el-table-column>
      <el-table-column prop="type" label="类型"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row.id)" type="text" size="small">修改</el-button>
          <el-button @click="handleDelete(scope.row.id)" type="text" size="small">删除</el-button>
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
      :total="total"
    ></el-pagination>
    <!--编辑窗口-->
    <el-dialog title="详情" :visible.sync="dialogFormVisible">
      {{pojo.title}}
      <hr />
      <div v-html="pojo.content"></div>
      <el-button type="success" @click="handleExamine(pojo.id)">审核通过</el-button>
      <el-button type="danger" @click="handleDelete(pojo.id)">删除</el-button>
      <el-button @click="dialogFormVisible = false">关闭</el-button>
    </el-dialog>
  </div>
</template>
<script>
import articleApi from "@/api/article";
import searchApi from "@/api/search";
export default {
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页大小
      searchMap: {}, // 查询条件
      dialogFormVisible: false, // 编辑窗口是否可见
      pojo: {}, // 编辑表单绑定的实体对象
      id: "", // 当前用户修改的ID
      channel: [], //频道列表
      loading: false,
      titleList: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 远程搜索标题
    searchArticleTitle(query) {
      if (query !== '') {
        this.loading = true;
        searchApi.searchArticleTitle(query).then((res) => {
          this.titleList = res.data.rows;
        });
        this.loading = false;
      }else{
        this.titleList = []
        this.searchMap.title = null
      }
    },
    fetchData() {
      articleApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then((response) => {
          this.list = response.data.rows;
          this.total = response.data.total;
        });
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
      articleApi.update(this.id, this.pojo).then((response) => {
        this.$message({
          message: response.message,
          type: response.flag ? "success" : "error",
        });
        if (response.flag) {
          // 如果成功
          this.fetchData(); // 刷新列表
        }
      });
      this.dialogFormVisible = false; // 关闭窗口
    },
    handleEdit(id) {
      this.id = id;
      this.dialogFormVisible = true; // 打开窗口
      if (id !== "") {
        // 修改
        articleApi.findById(id).then((response) => {
          if (response.flag) {
            this.pojo = response.data;
          }
        });
      } else {
        this.pojo = {}; // 清空数据
      }
    },
    handleDelete(id) {
      this.$confirm("确定要删除此纪录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        articleApi.deleteById(id).then((response) => {
          this.$message({
            message: response.message,
            type: response.flag ? "success" : "error",
          });
          if (response.flag) {
            this.fetchData(); // 刷新数据
            this.dialogFormVisible = false; // 隐藏窗口
          }
        });
      });
    },
    handleExamine(id) {
      this.$confirm("确定要审核通过吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        message.handleShowMessage(article.examine(id), this);
        this.dialogFormVisible = false; // 隐藏窗口
      });
    },
    searchChannel(query) {
      if (query !== '') {
        this.loading = true;
        searchApi.searchChannel(query).then((response) => {
          this.channel = response.data.rows;
        });
        this.loading = false;
      }else{
        this.channel = []
        this.searchMap.channelid = null
      }
    },
  },
};
</script>
