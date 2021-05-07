//     構造イメージ
//              ・AllApp
//              /      \
//     ・header-comp    ・item-box - - - - 
//                    /   \               \
//               ・item ・search-form      ・cart
//             (props)  (syncでデータ変更) (propsでデータを取得して表示)


//ヘッダーコンポーネント
const Header = {
    template:
    `<div id="header"><a href="ecSite.html"><img id="headerImage" src="./img/logo.jpeg"></a></div>`
}

//検索コンポーネント(ItemBoxの子、親の値を変更して送り返す)
const SearchForm = {
    props:{
        itemsList:{type:Array}
    },
    data(){
        return {
            text:'',
            items:this.itemsList
        }
    },
    template:
    `<div id="searchBox">
        <p>商品を検索する</p>
        <div><input class="textBox" type="text" v-model="text"></div>
        <div><button class="button" @click="search">検索</button></div>
    </div>`,
    methods:{
        update(){
            this.$emit('update:itemsList',this.items)
        },
        search(){
            this.items.forEach(item=>{
                if(item.name.indexOf(this.text)!=-1){
                    item.flag = true
                }else{
                    item.flag = false
                }
            })
            this.text=''
            this.update()
        }
    }
}

//カート内容表示欄(ItemBoxの子、親のカート情報を参照して表示するだけ)
const Cart = {
    props:{
        cartList:{type:Array}
    },
    data(){
        return {
            carts:this.cartList,
        }
    },
    computed:{
        cartItemTotalPrice(){
            let cartSum = 0
            this.carts.forEach(cart=>{
                cartSum+=cart.price*cart.itemNum
            })
            return cartSum
        },
    },
    template:
    `<ul id="cart-item" v-show="carts.length!=0">
        <h3>カート</h3>
        <li v-for="cart in carts">
            <div>
                {{cart.name}}{{cart.size}} : {{cart.itemNum}}個 {{cart.itemNum * cart.price}}円
                <button class="delButton" @click="delCartItem(cart)">削除</button>
            </div>
        </li>
        <div id="sumPrice">合計：{{cartItemTotalPrice}}円</div>
    </ul>`,
    methods:{
        delCartItem(item){
            let itemIndex = this.carts.indexOf(item)
            //アイテムの個数が一個の時はそのまま削除
            if(item.itemNum===1){
                this.carts.splice(itemIndex,1)
            }else{
                this.carts[itemIndex].itemNum--
            }
            this.$emit('update:cartList',this.carts)
        }
    }
}

//アイテム（ItemBoxの子、親の値を参照して表示するだけ）
const Item = {
    props:{
        itemsList:{type:Array},
        cartList:{type:Array}
    },
    data(){
        return {
            text:'',
            items:this.itemsList,
            carts:this.cartList
        }
    },
    template:
    `<ul id="list">
        <li v-for="item in items" v-if="item.flag">
            <img :src="item.img" alt="写真">
            <div class="name">{{item.name}}</div>
            <div class="price">
                M: {{item.mPrice}}円
                <button class="button" @click="addCart(item.id,item.name,item.mPrice,'M')">カート</button>
            </div>
            <div class="price">
                L: {{item.lPrice}}円
                <button class="button" @click="addCart(item.id,item.name,item.lPrice,'L')">カート</button>
            </div>
        </li>
    </ul>`,
    methods:{
        addCart(id,name,price,size){
            let sameFlag =false
            let obj = {id:id,name:name,price,price,size:size,itemNum:1}
            //配列に値が入っている時、配列内の値とこれから追加されるアイテムの重複をチェック
            if(this.carts.length!==0){
                this.carts.forEach(cart=>{
                    if(cart.id===obj.id&&cart.size===obj.size){
                        sameFlag=true
                        cart.itemNum++
                    }
                })
                //重複をフラグで管理、フラグが立っていなかった場合はそのまま追加、
                if(sameFlag===false){
                    this.carts.push(obj)
                    this.$emit('update:cartList',this.carts)                    
                }else{
                    this.$emit('update:cartList',this.carts)
                }
            //配列が空の時
            }else{
                this.carts.push(obj)
                this.$emit('update:cartList',this.carts)
            }
        }
    }
}

//アイテム表示欄（ItemとSearchFormの親）
const ItemBox = {
    components:{
        'item':Item,
        'search-form':SearchForm,
        'cart':Cart
    },
    data(){
        return {
            items:[
                {id:0,img:'./img/02.jpeg',name:'チョコドーナツ',mPrice:200,lPrice:300,flag:true},
                {id:1,img:'./img/01.jpeg',name:'プレーンドーナツ',mPrice:100,lPrice:200,flag:true},
                {id:2,img:'./img/03.jpeg',name:'キャラメルドーナツ',mPrice:150,lPrice:300,flag:true},
                {id:3,img:'./img/04.jpeg',name:'抹茶ドーナツ',mPrice:200,lPrice:300,flag:true},
                {id:4,img:'./img/05.jpeg',name:'ブレンドコーヒー',mPrice:200,lPrice:300,flag:true},
                {id:5,img:'./img/06.jpeg',name:'カフェラテ',mPrice:200,lPrice:300,flag:true},
                {id:6,img:'./img/07.jpeg',name:'いちごドーナツ',mPrice:200,lPrice:300,flag:true},
                {id:7,img:'./img/08.jpeg',name:'ポンデリング',mPrice:200,lPrice:300,flag:true},
                {id:8,img:'./img/09.jpeg',name:'おにぎり',mPrice:300,lPrice:400,flag:true},
                {id:9,img:'./img/10.jpeg',name:'サンドイッチ',mPrice:400,lPrice:500,flag:true},
                {id:10,img:'./img/11.jpeg',name:'メロンソーダ',mPrice:200,lPrice:300,flag:true},
                {id:11,img:'./img/12.jpeg',name:'ハンバーガー',mPrice:500,lPrice:700,flag:true},
            ],
            cart:[]
        }
    },
    template:
    `<div id="itemBox">
        <search-form :items-list.sync="items"></search-form>
        <div id="container">
            <item :items-list="items" :cart-list.sync="cart"></item>
            <cart :cart-list.sync="cart"></cart>
        </div>
    </div>
    `,
    computed:{
        check(){
            console.log(this.cart)
        }
    }
    
}

//すべてのコンポーネントを表示させるための大枠
const AllComp ={
    components:{
        'header-comp':Header,
        'item-box':ItemBox
    },
    template:
    `<div>
        <header-comp></header-comp>
        <item-box></item-box>
    </div>`
}

new Vue({
    el:'#app',
    components:{
        'all-comp':AllComp
    }
})