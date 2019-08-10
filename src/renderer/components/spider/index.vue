<style lang="scss">
.data-container {
  margin: 20px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  .put-form {
    padding: 10px;
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
  }
}
</style>
<template>
  <div
    class=""
    id=""
  >
    <Header />
    <div class="data-container">
      <a-form
        class="put-form"
        layout="inline"
        :form="form"
        @submit="handleSubmit"
      >
        <a-form-item
          :validate-status="userNameError() ? 'error' : ''"
          :help="userNameError() || ''"
        >
          <a-select
            mode="multiple"
            v-decorator="['productType']"
            placeholder="产品类型"
            style="width: 300px"
          >
            <a-select-option
              v-for="i in productTypes"
              :key="i.url"
            >
              {{i.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
       
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :disabled="hasErrors(form.getFieldsError())"
          >
            开始采集
          </a-button>
        </a-form-item>
      </a-form>
      <a-table
        :columns="columns"
        :rowKey="record => record.login.uuid"
        :dataSource="data"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template
          slot="name"
          slot-scope="name"
        >
          {{name.first}} {{name.last}}
        </template>
      </a-table>
    </div>

  </div>
</template>
<script>
import { constants } from "fs";
import { ipcRenderer } from "electron";
import reqwest from "reqwest";
import Header from "./header";
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: true,
    width: "20%",
    scopedSlots: { customRender: "name" }
  },
  {
    title: "Gender",
    dataIndex: "gender",
    filters: [
      { text: "Male", value: "male" },
      { text: "Female", value: "female" }
    ],
    width: "20%"
  },
  {
    title: "Email",
    dataIndex: "email"
  }
];

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
export default {
  data() {
    return {
      columns,
      pagination: {},
      loading: false,
      data: [],
      form: this.$form.createForm(this),
      hasErrors,
      productTypes: []
    };
  },
  mounted() {
    const that = this;
    ipcRenderer.on("productType", (e, data) => {
      console.log(this);
      // 获取产品类型
      this.productTypes = data || [];
    });
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      });
    },
    fetch(params = {}) {
      this.loading = true;
      reqwest({
        url: "https://randomuser.me/api",
        method: "get",
        data: {
          results: 10,
          ...params
        },
        type: "json"
      }).then(data => {
        const pagination = { ...this.pagination };
        // Read total count from server
        // pagination.total = data.totalCount;
        pagination.total = 200;
        this.loading = false;
        this.data = data.results;
        this.pagination = pagination;
      });
    },
    userNameError() {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched("productType") && getFieldError("productType");
    },
    // Only show error after a field is touched.
    passwordError() {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched("password") && getFieldError("password");
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          if(values){
            // 向主进程请求爬取数据
            ipcRenderer.send('goSpider',values.productType);
          }
        }
      });
    }
  },
  components: {
    Header
  }
};
</script>
