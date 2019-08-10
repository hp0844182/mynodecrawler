<style lang="scss">
.header {
  height: 400px;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  div {
    z-index: 100;
  }
  .header-tool {
    display: flex;
    justify-content: space-between;

    div {
      width: 200px;
      height: 150px;
      border-radius: 5px;
      margin-left: 20px;
      .ant-checkbox-wrapper {
        span {
          color: #fff;
        }
      }
    }
    .filter-type {
      background: #2185d0;
    }
    .shop-type {
      background: #21ba45;
    }
  }
}
</style>

 
<template>
  <div
    class="header"
    id=""
  >
    <HeaderBack />
    <div class="header-tool">
      <div class="filter-type">
      </div>
      <div class="shop-type"></div>
    </div>
  </div>
</template>
<script>
import HeaderBack from "./headerback";
const options = [
  { label: "Apple", value: "Apple" },
  { label: "Pear", value: "Pear" },
  { label: "Orange", value: "Orange" }
];
export default {
  data() {
    return {
      options,
      value: []
    };
  },
  methods: {
    onChange: function(val) {
      console.log(val);
    }
  },
  components: {
    HeaderBack
  }
};
</script>
