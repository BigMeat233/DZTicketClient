<template>
  <div class="addPersonDiv">
    <el-form :model="personInfo" label-width="35%" :rules="rules" ref="form">
      <el-form-item label="乘客姓名" required prop="name">
        <el-input
          v-model="personInfo.name"
          placeholder="请输入乘客姓名"
          :style="{width:'195px'}"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="乘客性别" required prop="sex">
        <el-radio v-model="personInfo.sex" label="M">男</el-radio>
        <el-radio v-model="personInfo.sex" label="F">女</el-radio>
      </el-form-item>
      <el-form-item label="证件类型" required prop="certCode">
        <el-select v-model="personInfo.certCode" placeholder="请选择证件类型">
          <el-option
            v-for="certType in certTypes"
            :key="certType.value"
            :label="certType.label"
            :value="certType.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件号码" required prop="certNo">
        <el-input
          v-model="personInfo.certNo"
          placeholder="请输入证件号码"
          :style="{width:'195px'}"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="乘客类型" required prop="personCode">
        <el-select v-model="personInfo.personCode" placeholder="请选择证件类型">
          <el-option key="1" label="成人" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click.native="addBtnClick">添加乘客</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Macro from '@/utils/Macro';
export default {
  name: 'AddPerson',
  data() {
    return {
      personInfo: {
        name: '',
        sex: '',
        certCode: '',
        certNo: '',
        personCode: '1',
      },
      rules: {
        name: [{ required: true, message: '请输入乘客姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择乘客性别', trigger: 'change' }],
        certCode: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
        certNo: [{ required: true, message: '请输入证件号码', trigger: 'blur' }],
      },
      certTypes: Macro.certTypes,
    };
  },
  methods: {
    addBtnClick() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('onPersonInputFinish', this.personInfo);
        }
      });
    },
    reset() {
      this.personInfo = {
        name: '',
        sex: '',
        certType: '',
        certNo: '',
        personType: '1',
      };
    },
  },
}
</script>

<style scoped>
.addPersonDiv {
  margin-top: 20px;
}
</style>
