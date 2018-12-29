import Core from '@/utils/Core';
// CSS全局注入
import '@/assets/Common.css';

// Vue实例全局注入
var instance = {
  methods: {
    back: _back,
  },
};

function _back() {
  Core.navigator.go(-1);
}

export default instance;