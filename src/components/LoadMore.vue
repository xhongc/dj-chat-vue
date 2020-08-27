<template>
  <div class="load-more">
    <div class="load-state" v-if="showState">
      <div class="finish" v-if="finish">
        <span>没有更多了</span>
      </div>
      <div class="more" v-else>
        <i class="el-icon-loading"></i>
      </div>
    </div>
    <slot>这里的作用不多说</slot>
  </div>
</template>

<script>
  export default {
    name: 'LoadMore',
    data () {
      return {
        loadState: true, // 是否显示底部加载状态，默认true
        finish: false, // 是否加载完成
        loading: false, // 是否正在加载中
        domHeight: 0, // 内容可视区的高度
        container: null, // 绑定能被监听滚动的元素
        showState: false
      }
    },
    mounted () {
      // 如果组件是基于body或者其他父元素进行滚动，则下面获取的对象为相应的对象
      this.container = this.$el
      this.domHeight = this.$el.clientHeight
      // this.switchBottom()
      this.$el.scrollTop = 1000
      console.log('rhisres', this.$el.scrollTop)
      this.bindSrcoll()
    },
    // 视图数据更新，重新调用
    updated () {
      // this.switchBottom()
    },
// 如果有用到keep-alive，组件激活时调用
    activated () {
      this.switchBottom()
    },
    // 页面销毁，移除滚动监听
    beforeDestroy () {
      this.unScroll()
    },
    methods: {
      scrollPage () {
        console.log('scrollPage', this.$el)
        if (!this.$el) {
          return
        }
        // 获取内容向上滚动了多少距离
        var domScrollTop = this.container.scrollTop
        console.log(domScrollTop, this.loading, this.finish)
        // 当内容滚动到距离底部<50时,且没有加载完成&&没有正在加载中
        // 内容距离底部多少距离 = 内容总高度-滚动高度-当前可视高度
        if (domScrollTop < 1 && !this.loading && !this.finish) {
          // 设置为正在加载中
          this.loading = true
          // 0.5秒后执行父组件接口方法
          setTimeout(() => {
            this.$emit('loadMore')
          }, 500)
        }
      },
      switchBottom () {
        this.$nextTick(() => {
          // 判断容器内容是否 大于 自身内容可视区域高度
          if (this.$el.scrollHeight > this.domHeight) {
            // 如果大于，则显示加载状态，至于是加载完成还是没有可以继续加载，我们不用关心，如果继续上滑有数据会执行方法的
            this.showState = true
          } else {
            // 如果页面不足一屏且还有下一页数据，继续执行加载更多方法
            if (!this.finish) {
              // 不足一屏，还有数据，现在加载状态
              this.showState = true
              // 执行父组件请求数据方法
              setTimeout(() => {
                this.$emit('loadMore')
              }, 1000)
            } else {
              // 没有数据不显示底部加载状态
              this.showState = false
            }
          }
        })
      },
      bindSrcoll () {
        this.unScroll()
        if (this.container) {
          this.container.addEventListener('scroll', this.scrollPage)
        }
      },
      unScroll () {
        if (this.container) {
          this.container.removeEventListener('scroll', this.scrollPage)
        }
      }
    }
  }
</script>

<style scoped>
  .more {
    text-align: center;
    color: gray;
  }
</style>
