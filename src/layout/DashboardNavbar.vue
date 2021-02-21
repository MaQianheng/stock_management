<template>
    <base-nav class="navbar-top navbar-dark"
              id="navbar-main"
              :show-toggle-button="false"
              expand>
        <ul class="navbar-nav align-items-center d-none d-md-flex" style="right: 20px; position: absolute;">
            <LoadDataButtonGroup/>
            <li class="nav-item dropdown">
                <base-dropdown class="nav-link pr-0">
                    <div class="media align-items-center" slot="title" style="cursor: pointer;">
                        <span class="avatar avatar-sm rounded-circle">
                            <img alt="Image placeholder" src="img/theme/user-icon.jpg">
                        </span>
                        <div class="media-body ml-2 d-none d-lg-block">
                            <span class="mb-0 text-sm  font-weight-bold">{{ name }}</span>
                        </div>
                    </div>

                    <template>
                        <div class=" dropdown-header noti-title">
                            <h6 class="text-overflow m-0">欢迎!</h6>
                        </div>
                        <div class="dropdown-divider"></div>
                        <span class="dropdown-item" @click="handleClick" style="cursor:pointer;">
                            <i class="ni ni-user-run"></i>
                            <span>退出登录</span>
                        </span>
                    </template>
                </base-dropdown>
            </li>
        </ul>
    </base-nav>
</template>
<script>
import {mapActions, mapState, mapMutations} from "vuex";
import {handleLogOut} from "@/functions";
import LoadDataButtonGroup from "@/components/MyComponents/LoadDataButtonGroup";
// import {funcGetLikeIdKey} from "@/functions";

export default {
    components: {LoadDataButtonGroup},
    data() {
        return {
            activeNotifications: false,
            showMenu: false,
            searchQuery: ''
        };
    },
    methods: {
        ...mapActions(["updateViewComponent", "increaseRequestingTasksCount"]),
        ...mapMutations(['UPDATE_VIEW']),
        toggleSidebar() {
            this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
        },
        hideSidebar() {
            this.$sidebar.displaySidebar(false);
        },
        toggleMenu() {
            this.showMenu = !this.showMenu;
        },
        handleClick() {
            handleLogOut(this)
        }
    },
    computed: {
        ...mapState(["commonView", "colorView", "warehouseView", "shelfView", "productView", "customerView", "supplierView", 'loginView']),
        name: function () {
            return this.loginView.name
        },
    }
};
</script>
