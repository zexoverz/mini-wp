let quill = new Quill('#editor', {
    theme: 'snow'
});


let app = new Vue({
    el: "#app",
    data: {
        isLogin: localStorage.getItem("token"),
        usernameLogin: "",
        username: "",
        password: "",
        search: "",
        articles: [],
        inputTitle: "",
        inputContent: "",
        inputUsername: "",
        editTitle: "",
        editContent: ""
    },
    methods: {
        login() {
            axios({
                method: "post",
                url: "http://localhost:3000/user/login",
                data: {
                    email: this.username,
                    password: this.password
                }
            }).then((response) => {
                Swal.fire({
                    title: 'Success',
                    text: 'login Success',
                    icon: 'success'
                })
                this.usernameLogin = response.data.name
                this.getData();
                localStorage.setItem("username", response.data.name);
                localStorage.setItem("token", response.data.token);
                this.isLogin = localStorage.getItem("token");
            }).catch((err) => {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: err.responseJSON.message,
                })
            })
        },
        signOut() {
            Swal.fire({
                title: 'Are you sure to signout ?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes'
            }).then((result) => {
                if (result.value) {
                    localStorage.clear();
                    this.isLogin = null
                }
            })
        },
        getData() {
            axios({
                method: 'post',
                url: 'http://localhost:3000/article',
                data: {
                    username: this.usernameLogin
                }
            }).then((response) => {
                console.log(response.data);
                for (let i = 0; i < response.data.length; i++) {
                    let date = new Date(response.data[i].createdAt);
                    let formated = date.toString().slice(0, 15);
                    response.data[i].createdAt = formated;
                }
                this.articles = response.data
            }).catch((err) => {
                console.log(err);
            })
        },
        addArticle() {
            axios({
                method: "post",
                url: "http://localhost:3000/article/create",
                data: {
                    title: this.inputTitle,
                    username: this.usernameLogin,
                    content: this.inputContent,

                }
            }).then((response) => {
                this.articles.push(response.data);
                Swal.fire({
                    title: 'Success',
                    text: 'add article Success',
                    icon: 'success'
                })
            }).catch(err => {
                console.log(err);
            })
        },
        deleteArticle(id) {
            Swal.fire({
                    title: 'Are you sure to Delete this article?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes'
                }).then((result) => {
                    if (result.value) {
                        return axios({
                            method: "delete",
                            url: `http://localhost:3000/article/delete/${id}`
                        })
                    }
                })
                .then((response) => {
                    Swal.fire({
                        title: 'Success',
                        text: 'Article Deleted',
                        icon: 'success'
                    });
                    this.getData();
                }).catch((err) => {
                    console.log(err);
                })
        }
    },
    computed: {
        filteredList() {
            return this.articles.filter(value => {
                return value.title.toLowerCase().includes(this.search.toLowerCase())
            })
        }
    }

})