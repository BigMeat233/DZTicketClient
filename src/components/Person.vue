<template>
  <div class="personDiv" :class="{isSelected:person.isSelected}" @click="onPersonClick($event)">
    <el-checkbox
      v-model="person.isSelected"
      border
      :style="{border:'0'}"
      @change="onCheckBoxChange(value)"
    ></el-checkbox>
    <label class="personInfoText">{{person.name}}</label>
    <label class="personInfoText">{{person.typeName}}</label>
    <label class="personInfoText">{{person.certType}}</label>
    <label class="personInfoText">{{person.certNo}}</label>
    <el-select v-model="person.seatCodes" placeholder="请选择座位类型" multiple>
      <el-option
        v-for="seatType in seatTypes"
        :key="seatType.value"
        :label="seatType.label"
        :value="seatType.value"
      ></el-option>
    </el-select>
    <el-button type="danger" icon="el-icon-delete" circle @click.native="onDeleteBtnClick($event)"></el-button>
  </div>
</template>
<script>
import Core from '@/utils/Core';
import Macro from '@/utils/Macro';
export default {
  name: 'Person',
  props: ['value'],
  computed: {
    person: {
      get() { return this.value },
      set(newValue) { this.$emit('input', newValue) }
    },
  },
  watch: {
    'person.seatCodes': {
      handler(newValue, oldValue) {
        if (newValue.length === 0) {
          this.person.isSelected = false;
        }
      }
    },
  },
  data() {
    return {
      seatTypes: Macro.seatTypes,
    };
  },
  methods: {
    onPersonClick(event) {
      event.stopPropagation();
      if (this.person.seatCodes.length === 0) {
        this.person.isSelected = false;
        Core.ui.message.warn('请先选择座位类型');
        return;
      }
      if (this.person.typeCode !== '1') {
        this.person.isSelected = false;
        Core.ui.message.warn('无法为非成人乘客购票');
        return;
      }
      this.person.isSelected = !this.person.isSelected;
    },
    onCheckBoxChange(value) {
      if (this.person.seatCodes.length === 0) {
        this.person.isSelected = false;
        Core.ui.message.warn('请先选择座位类型');
      }
      if (this.person.typeCode !== '1') {
        this.person.isSelected = false;
        Core.ui.message.warn('无法为非成人乘客购票');
        return;
      }
    },
    onDeleteBtnClick(event) {
      event.stopPropagation();
      Core.ui.box.confirm('确定删除', '确定要删除该乘客吗?(一旦删除不可恢复)', () => {
        this.$emit('onDelete', this.person);
      }, () => { });
    }
  },
}
</script>
<style scoped>
.personDiv {
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  min-height: 65px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0);
  transition: border 0.2s;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
}

.isSelected {
  border: 1px solid orange;
}

.personInfoText {
  font-size: 16px;
}
</style>


