<template>
  <view class="city_picker">
    <!-- 省市区街道四级联动 -->
    <u-picker
      :show="pickerShow"
      :title="title"
      ref="uPicker"
      :columns="columns"
      :loading="loading"
      :keyName="$attrs.keyName || 'name'"
      :defaultIndex="defaultIndex"
      @cancel="pickerShow = false"
      @confirm="confirm"
      @change="changeHandler"
    ></u-picker>
  </view>
</template>

<script>
/**
 * @file 四级-省市区街道 三级-省市区
 * @param {string} title picker标题
 * @param {number} type 三级或四级
 * @param {array} indexs 回显数据
 * @param {function} callback 回调函数,返回选中数据
 */
export default {
  data() {
    return {
      pickerShow: false,
      loading: false,
      columns: [],
      indexs: [],
      defaultIndex: [],
      callback: () => {},
      cityData: [],
      title: "城市选择",
      type: 3, //  
    };
  },
  methods: {
    // open
    open(value, callback) {
      for (const key in value) this[key] = value[key];
      this.initCityData();
      this.callback = callback;
      this.pickerShow = true;
    },
    // 加载城市数据
    async loadCityData(type, delayed = 50) {
      const typeMap = {
        3: require("../three-ctiy.json"), // 三级联动
        4: require("../three-ctiy.json"), // 四级联动
      };
      const cityData = typeMap[type] || [];
      const batchSize = 5; // 每批加载的数据量
      const batches = Math.ceil(cityData.length / batchSize); // 计算总共需要加载的批次
      let loadedData = [];
      // 分批加载 兼容性能不好的手机
      for (let i = 0; i < batches; i++) {
        const start = i * batchSize;
        const end = start + batchSize;
        const batch = cityData.slice(start, end);
        await new Promise(resolve => setTimeout(resolve, delayed));
        loadedData = loadedData.concat(batch);
      }
      return loadedData;
    },
    // 初始化联动数据
    async initCityData() {
      this.loading = true;
      let indexs = [0, 0, 0];
      // 如果有回显值
      if (this.indexs.length) {
        this.defaultIndex = this.indexs;
        indexs = this.indexs.slice(0, 3);
      } else {
        this.defaultIndex = this.type === 3 ? [0, 0, 0] : this.type === 4 ? [0, 0, 0, 0] : [];
      }
      const cityData = await this.loadCityData(this.type);
      this.cityData = cityData;
      // 获取编码和地址
      const callback = item => ({ id: item.ext_id, name: item.ext_name });
      // 三级联动
      if (this.type === 3) {
        const [province, city, area] = [
          cityData.map(callback),
          cityData[indexs[0]].childs.map(callback),
          cityData[indexs[0]].childs[indexs[1]].childs.map(callback),
        ];
        this.columns = [province, city, area];
      }
      // 四级联动
      if (this.type === 4) {
        const [province, city, area, street] = [
          cityData.map(callback),
          cityData[indexs[0]].childs.map(callback),
          cityData[indexs[0]].childs[indexs[1]].childs.map(callback),
          cityData[indexs[0]].childs[indexs[1]].childs[indexs[2]].childs.map(callback),
        ];
        this.columns = [province, city, area, street];
      }
      this.loading = false;
    },
    // 处理联动数据
    changeHandler(event) {
      let { columnIndex, indexs, picker = this.$refs.uPicker } = event;
      const callback = item => ({ id: item.ext_id, name: item.ext_name });
      // 第一列 得到第二列数据
      if (columnIndex === 0) {
        // const province = this.cityData[index];
        // 动了indexs,会导致index为0(index就是indexs第一项数据,也可以对indexs进行深拷贝处理)
        const province = this.cityData[indexs[0]];
        indexs.fill(0, 1); // 保留前一位,其余重置为0,防止直辖市出现indexs[1]无值出现报错
        const child1 = province.childs.map(callback);
        const child2 = province.childs[indexs[1]].childs.map(callback);
        picker.setColumnValues(1, child1);
        picker.setColumnValues(2, child2);
        // 如果是四级联动
        if (this.type === 4) {
          const child3 = province.childs[indexs[1]].childs[indexs[2]].childs.map(callback);
          picker.setColumnValues(3, child3);
        }
      }
      // 第二列 得到第三列数据
      if (columnIndex === 1) {
        indexs.fill(0, 2); // 保留前两位
        const child1 = this.cityData[indexs[0]].childs[indexs[1]].childs.map(callback);
        picker.setColumnValues(2, child1);
        // 如果是四级联动
        if (this.type === 4) {
          const child2 = this.cityData[indexs[0]].childs[indexs[1]].childs[indexs[2]].childs.map(callback);
          picker.setColumnValues(3, child2);
        }
      }
      // 第三列 得到第四列数据(只有四级联动才有)
      if (columnIndex === 2 && this.type === 4) {
        indexs.fill(0, 3); // 保留前三位
        const child1 = this.cityData[indexs[0]].childs[indexs[1]].childs[indexs[2]].childs.map(callback);
        picker.setColumnValues(3, child1);
      }
    },
    /**
     * 根据省市区街道编码获取地址在cityData中的索引、编码、名称
     * @param {object} data 包含 province、city、district、street 编码的对象
     * @param {number} type 三级或四级
     * @returns {array} 返回一个Promise数组(索引,编码,名称)
     */
    async getCurrentAddress(data, type = 4) {
      const cityData = await this.loadCityData(type);
      let iteratorList = ["province", "city", "district", "street"];
      if (type === 3) iteratorList = iteratorList.slice(0, 3);
      // 定义一个简化版的迭代器，方便在 search 函数中遍历
      const iterator = iteratorList[Symbol.iterator]();
      // 递归搜索地址在 cityData 中的索引路径
      const search = (list, level) => {
        const current = level.next();
        if (current.done) return [];
        let indexs = [];
        for (let i = 0, len = list.length; i < len; i++) {
          if (list[i].ext_id === data[current.value]) {
            const item = list[i];
            indexs.push({ index: i, name: item.ext_name, id: item.ext_id });
            if (Array.isArray(item.childs)) {
              const children = search(item.childs, level);
              if (children.length > 0) indexs.push(...children);
            }
            break;
          }
        }
        if (indexs.length === 0) console.error(`${current.value} not found`);
        return indexs;
      };
      return search(cityData, iterator);
    },
    // 选择联动数据
    confirm(event) {
      this.callback(event);
      this.pickerShow = false;
    },
  },
};
</script>

