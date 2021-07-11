<template>
  <div>
    <br />
    <el-form :inline="true">
      <el-form-item label="专栏名称">
        <el-select
          v-model="searchMap.name"
          filterable
          remote
          :remote-method="searchColumnName"
          :loading="loading"
          placeholder="专栏名称"
        >
          <el-option
            v-for="item in columnName"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专栏简介">
        <el-select
          v-model="searchMap.summary"
          filterable
          remote
          :remote-method="searchColumnSummary"
          :loading="loading"
          placeholder="专栏简介"
        >
          <el-option
            v-for="item in columnSummary"
            :key="item.id"
            :label="item.summary"
            :value="item.summary"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户ID">
        <el-input v-model="searchMap.userid" placeholder="用户ID"></el-input>
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
      <el-button type="primary" @click="handleEdit('')">新增</el-button>
    </el-form>
    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="专栏名称"></el-table-column>
      <el-table-column prop="summary" label="专栏简介"></el-table-column>
      <el-table-column prop="userid" label="用户ID"></el-table-column>
      <el-table-column prop="createtime" label="申请日期"></el-table-column>
      <el-table-column prop="checktime" label="审核日期"></el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row.id)" type="text" size="small">修改</el-button>
          <el-button @click="handleDelete(scope.row.id)" type="text" size="small">删除</el-button>
          <el-button type="warning" plain size="small" @click="handleExamine(scope.row.id)">审核</el-button>
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
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form label-width="80px">
        <el-form-item label="专栏名称">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="专栏简介">
          <el-input v-model="pojo.summary"></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="pojo.userid"></el-input>
        </el-form-item>
        <el-form-item label="申请日期">
          <el-input v-model="pojo.createtime"></el-input>
        </el-form-item>
        <el-form-item label="审核日期">
          <el-input v-model="pojo.checktime"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="pojo.state"></el-input>
        </el-form-item>
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import columnApi from "@/api/column";
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
      cityList: [], // 城市列表
      id: "", // 当前用户修改的ID
      columnName: [],
      columnSummary: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      columnApi
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
      columnApi.update(this.id, this.pojo).then((response) => {
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
        columnApi.findById(id).then((response) => {
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
        columnApi.deleteById(id).then((response) => {
          this.$message({
            message: response.message,
            type: response.flag ? "success" : "error",
          });
          if (response.flag) {
            this.fetchData(); // 刷新数据
          }
        });
      });
    },
    handleExamine(id) {
      this.$confirm("确定要审核吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        message.handleShowMessage(columnApi.examine(id), this);
      });
    },
    searchColumnName(query) {
      if (query !== "") {
        this.loading = true;
        searchApi.searchColumnName(query).then((response) => {
          this.columnName = response.data.rows;
        });
        this.loading = false;
      } else {
        this.columnName = [];
        this.searchMap.name = null;
      }
    },
    searchColumnSummary(query) {
      if (query !== "") {
        this.loading = true;
        searchApi.searchColumnSummary(query).then((response) => {
          this.columnSummary = response.data.rows;
        });
        this.loading = false;
      } else {
        this.columnSummary = [];
        this.searchMap.summary = null;
      }
    },
  },
};
</script>
