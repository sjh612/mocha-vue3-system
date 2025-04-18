<template>
  <div class="container">
    <div class="relative flex">
      <el-form inline>
        <el-form-item>
          <el-select v-model="queryForm.province" placeholder="请选择省份">
            <el-option key="1" label="广东省" value="广东省" />
            <el-option key="2" label="湖南省" value="湖南省" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.keyword" placeholder="请输入客户名称搜索" />
        </el-form-item>
        <el-form-item v-if="moreVisible">
          <el-input v-model="queryForm.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item v-if="moreVisible">
          <el-input v-model="queryForm.mobile" placeholder="请输入手机" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.status" placeholder="请选择状态">
            <el-option key="1" label="广东省" value="广东省" />
            <el-option key="2" label="湖南省" value="湖南省" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <span
        class="absolute top-0 right-0 inline-flex items-center ml-auto text-sm cursor-pointer"
        @click="moreVisible = !moreVisible"
      >
        <i-ep-bottom-right />{{ moreVisible ? '展开' : '收起' }}</span
      >
    </div>
    <el-dialog width="1000px" v-model="visible" title="已选数据">
      <ul>
        <li v-for="item in multipleSelection" :key="item.id">
          {{ item.id }} {{ item.name }}
          <el-icon @click="handleDeleteItem(item)"><Close /></el-icon>
        </li>
      </ul>
    </el-dialog>
    <el-card>
      <div class="flex mb-1">
        <el-button @click="handleDelete()" type="danger" plain size="small">删除</el-button
        ><el-button @click="handleExport" size="small">导出</el-button>
        <span @click="visible = true">（已选 {{ multipleSelection.length }}）</span>
      </div>

      <el-table
        :data="tableData"
        border
        stripe
        ref="multipleTable"
        v-adaptive
        v-loading="loading"
        :row-key="(row) => row.id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" :reserve-selection="true" align="center" fixed />
        <el-table-column prop="name" label="客户名称" min-width="200" show-overflow-tooltip fixed>
          <template #default="{ row }">
            <MoOverTooltip :text="row.name" :row="2" />
          </template>
        </el-table-column>
        <el-table-column prop="source" label="客户来源" min-width="100" />
        <el-table-column label="客户类型" min-width="100">
          <template #default="scope">
            <MoDict :value="scope.row.type" dictName="clientType" refresh />
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机" min-width="200" #default="{ row }">
          <EditableInput
            type="string"
            v-model="row.mobile"
            param-name="mobile"
            :row-data="row"
            :update-api="clientApi.updateClient"
          />
        </el-table-column>
        <el-table-column prop="mail" label="邮箱" min-width="200" show-overflow-tooltip />

        <el-table-column label="状态">
          <template #default="scope">
            <MoDict :value="scope.row.status" dictName="status" />
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" min-width="150" show-overflow-tooltip />
        <el-table-column prop="province" label="省份" min-width="100" show-overflow-tooltip />
        <el-table-column prop="city" label="城市" min-width="100" show-overflow-tooltip />
        <el-table-column prop="updated" label="更新时间" min-width="200" />
        <el-table-column prop="created" label="创建时间" min-width="200" />
        <el-table-column prop="createdBy" label="创建人" min-width="200" />
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template #default="scope">
            <i-ep-edit class="mr-4 cursor-pointer" />
            <i-ep-delete class="text-red-500 cursor-pointer" @click="handleDelete(scope.row.id)" />
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        v-model:page="pagination.page"
        v-model:size="pagination.pageSize"
        :total="total"
        @pagination="getData"
        class="mt-3"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Close } from '@element-plus/icons-vue'
import { useTable } from '~/hooks/useTable'
import clientApi from '~/api/client'
import EditableInput from '~/components/EditableInput.vue'
import MoOverTooltip from '~/components/MoOverTooltip.vue'

let moreVisible = ref(false)

const queryForm = reactive({
  address: '',
  name: '',
  keyword: '',
  province: '',
  status: '',
  mobile: ''
})

const {
  tableData,
  loading,
  pagination,
  total,
  getData,
  handleSearch,
  handleExport,
  handleDelete,
  handleSelectionChange,
  multipleSelection
} = useTable(clientApi.getClientList, queryForm, clientApi.deleteClient)

const visible = ref(false)
const multipleTable = ref()
const handleDeleteItem = (item) => {
  multipleTable.value.toggleRowSelection(item, false)
}
</script>

<style scoped></style>
