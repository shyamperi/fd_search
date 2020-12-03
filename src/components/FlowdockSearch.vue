<template>
    <div class="app">
        <h1>{{ msg }}</h1>
        <div class="input-container">
            <p> API Token:<input v-model="token" type="password" placeholder="Token"> | <button @click="reset">Reset</button></p>
            <p> Search:<input v-model="keyword" type="text" placeholder="Keyword" @keyup.enter="search"/> <button @click="search">Search</button> </p>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Flow</th>
                    <th>Title</th>
                    <th>Comment</th>
                    <th>CreatedAt</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="loading">Loading results {{flow_name}}...</tr>
                <tr v-for="item in list" v-bind:key="item.msgId">
                    <td class="fitwidth">{{ item.flow }}</td>
                    <td><a :href=item.threadUrl>{{ item.title }}</a></td>
                    <td>{{ item.comment }}</td>
                    <td class="fitwidth">{{ item.created_at }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'FlowdockSearch',
    props: {
        msg: String
    },
    data() {
        return {
            token: null,
            keyword: null,
            list: [],
            loading: false,
            flow_name: null
        }
    },
    mounted() {
        if (localStorage.token) {
            this.token = localStorage.token;
        }
        this.instance = this.axios.create({
            baseURL: 'https://api.flowdock.com',
            headers: {
                common: {
                    Authorization: `Basic ${btoa(localStorage.token)}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        })
    },
    watch: {
        token(newToken) {
            localStorage.token = newToken;
            this.refreshFlows();
        }
    },
    methods: {
        refreshFlows() {
            this.instance.get('/flows').then((result) => {
                localStorage.flows = JSON.stringify(result.data)
            })
        },
        async search() {
            console.log('searching for keyword: ' + this.keyword)
            var flows = JSON.parse(localStorage.flows)
            var res = []
            this.loading = true;
            for (var flowIdx in flows) {
                var flowObj = flows[flowIdx]
                this.flow_name = `${flowIdx}/${flows.length} - ${flowObj.name}`
                console.log(flowObj.name)
                const resp = await this.instance.get(`/flows/${flowObj.organization.parameterized_name}/${flowObj.parameterized_name}/messages/?limit=100&search=${encodeURI(this.keyword)}`, {dataType: 'json'})
                for (var msgIdx in resp.data) {
                    var msgObj = resp.data[msgIdx]
                    //console.log(msgObj)
                    var titleOK = msgObj.thread && (typeof(msgObj.thread.title) === 'string')
                    var contentOK = (typeof(msgObj.content) === 'string')
                    if (contentOK && titleOK) {
                        res.push({
                            flow: flowObj.name,
                            title: msgObj.thread.title,
                            comment: msgObj.content,
                            created_at: msgObj.created_at,
                            threadUrl: `https://www.flowdock.com/app/${flowObj.organization.parameterized_name}/${flowObj.parameterized_name}/threads/${msgObj.thread_id}`,
                            msgId: msgObj.id
                        })
                    }
                }
            }
            console.log("Finished fetching responses from all the flows")
            this.list = res.flat()
            this.loading = false
        },
        reset() {
            localStorage.removeItem("flows")
            localStorage.removeItem("token")
            this.token = null
        }
    },
}
</script>
<style>

body {
    font-family: Helvetica Neue, Arial, sans-serif;
    font-size: 14px;
    color: #444;
}

table {
    table-layout: fixed;
    width: 100%;
    border: 2px solid #42b983;
    border-radius: 3px;
    background-color: #fff;
}

th {
    background-color: #42b983;
    color: rgba(255, 255, 255, 0.66);
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

td {
    background-color: #f9f9f9;
}

th,
td {
    min-width: 120px;
    padding: 10px 20px;
}
td.fitwidth {
    width: 1px;
    white-space: nowrap;
}
</style>
