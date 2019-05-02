<template>
    <div class="daily">
        <div class="daily-menu">
            <div class="daily-menu-item" :class="{on: type == 'recommend'}"
            @click="handleToRecommend">每日推荐</div>
            <div class="daily-menu-item" :class="{on: type == 'daily'}"
            @click="showThemes = !showThemes">主题日报</div>
            <ul v-show="showThemes">
                <li v-for="(item, index) in themes" :key="index">
                    <a :class="{on: item.id == themeId && type =='daily'}"
                    @click="handleToTheme(item.id)">{{ item.name }}</a>
                </li>
            </ul>
        </div>
        <div class="daily-list" ref="list">
            <template v-if="type == 'recommend'">
                <div v-for="(list, index) in recommendList" :key="index">
                    <div class="daily-date">{{ formatDay(list.date) }}</div>
                    <Item v-for="(item) in list.stories" :key="item.id" :data="item" @click.native="handleClick(item.id)"></Item>
                </div>
            </template>
            <template v-if="type == 'daily'">
                 <Item v-for="(item) in list" :key="item.id" :data="item" @click.native="handleClick(item.id)"></Item>
            </template>
        </div>
        <daily-article :id="articleId"></daily-article>
    </div>
</template>
<script>
    import $ from './libs/util';
    import Item from './components/item.vue';
    import dailyArticle from './components/daily-article.vue';

    export default {
        components: {
            Item,
            dailyArticle
        },
        data(){
            return {
                themes: [],
                showThemes: false,
                type: 'recommend',
                themeId: 0,
                list: [],
                dailyTime: $.getTodayTime(),
                isLoading: false,
                recommendList: [],
                articleId: 0
            }
        },
        methods: {
            handleClick(id){
                this.articleId = id;
            },
            getThemes(){
                $.ajax.get('themes').then(res => {
                    this.themes = res.others;
                })
            },
            handleToTheme(id){
                this.type = 'daily';
                thie.themeId = id;
                this.list = [];
                $.ajax.get('theme/' + id).then(res => {
                    this.list = res.stories.filter(item => {
                        item.type != 1;
                    });
                });
            },
            handleToRecommend(){
                this.type = 'recommend';
                this.recommendList = [];
                this.dailyTime = $.getTodayTime();
                this.getRecommendList();
            },
            getRecommendList(){
                var _this = this;
                this.isLoading = true;
                const prevDay = $.prevDay(this.dailyTime + 86400000);
                $.ajax.get('news/before/' + prevDay).then(res => {
                    this.recommendList.push(res);
                    this.isLoading = false;
                });
            },
            getLatestList(){
                this.isLoading = true;
                const prevDay = $.prevDay(this.dailyTime + 86400000);
                $.ajax.get('news/latest').then(res => {
                    console.log(res.top_stories);
                    console.log(this.recommendList);
                    this.recommendList.push(res.top_stories);
                    this.isLoading = false;
                });
            },
            formatDay(date){
                let month = date.substr(4,2);
                let day = date.substr(6,2);
                if(month.substr(0,1) == '0')
                    month = month.substr(1,1);
                if(day.substr(0,1) == '0')
                    day = day.substr(1,1);
                return `${month} 月 ${day} 日`;
                
            }
        },
        mounted(){
            var _this = this;
            this.getThemes();
            this.getRecommendList();
            setTimeout(function(){
                _this.dailyTime -= 86400000;
                _this.getRecommendList();
            },500);
            const $list = this.$refs.list;
            $list.addEventListener('scroll', () => {
                if(this.type == 'daily' || this.isLoading) 
                    return;
                if($list.scrollTop + document.body.clientHeight >= $list.scrollHeight){
                    this.dailyTime -= 86400000;
                    this.getRecommendList();
                }
            });
        }
    }
</script>


