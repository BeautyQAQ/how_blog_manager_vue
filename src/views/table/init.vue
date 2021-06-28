<template>
  <div>
    <el-col :span="24">
      <div style="text-align: center">
        <el-button type="primary" @click="init()">初始化索引</el-button>
      </div>
    </el-col>
  </div>
</template>
<script>
import initApi from "@/api/init";
export default {
  data() {
    return {};
  },
  methods: {
    fetchData() {
      initApi.init().then((response) => {
        this.$message({
          message: response.message,
          type: response.flag ? "success" : "error",
        });
      });
    },
  },
};
</script>
