<template>
    <nav class="navbar navbar-vertical fixed-left navbar-expand-md navbar-light bg-white" id="sidenav-main">
        <div class="container-fluid">

            <!--Toggler-->
            <navbar-toggle-button @click.native="showSidebar">
                <span class="navbar-toggler-icon"></span>
            </navbar-toggle-button>
            <router-link class="navbar-brand" to="/">
                <img :src="logo" class="navbar-brand-img" alt="...">
            </router-link>

            <slot name="mobile-right">
                <ul class="nav align-items-center d-md-none">
                    <!--                    <base-dropdown class="nav-item" position="right">-->
                    <!--                        <a slot="title" class="nav-link nav-link-icon" href="#" role="button" data-toggle="dropdown"-->
                    <!--                           aria-haspopup="true" aria-expanded="false">-->
                    <!--                            <i class="ni ni-bell-55"></i>-->
                    <!--                        </a>-->

                    <!--                        <a class="dropdown-item" href="#">Action</a>-->
                    <!--                        <a class="dropdown-item" href="#">Another action</a>-->
                    <!--                        <div class="dropdown-divider"></div>-->
                    <!--                        <a class="dropdown-item" href="#">Something else here</a>-->
                    <!--                    </base-dropdown>-->
                    <base-dropdown class="nav-link pr-0" position="right">
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
                            <!--                            <div class="dropdown-divider"></div>-->
                            <LoadDataButtonGroup :is-mobile="true"/>
                            <span class="dropdown-item" @click="handleClick" style="cursor:pointer;">
                                <i class="ni ni-user-run"></i>
                                <span>退出登录</span>
                            </span>
<!--                            <base-button class="dropdown-item" type="secondary" icon="ni ni-air-baloon" style="border-radius: 0; box-shadow: 0 0 0;" disabled="true">-->
<!--                                <b-spinner small type="grow"/>-->
<!--                                122-->
<!--                            </base-button>-->
<!--                            <base-button class="dropdown-item" type="secondary" icon="ni ni-bulb-61" style="border-radius: 0; box-shadow: 0 0 0;" disabled="true">-->
<!--                                <b-spinner small type="grow"/>-->
<!--                                122-->
<!--                            </base-button>-->
                        </template>
                    </base-dropdown>
                </ul>
            </slot>
            <slot></slot>
            <div v-show="$sidebar.showSidebar" class="navbar-collapse collapse show" id="sidenav-collapse-main">

                <div class="navbar-collapse-header d-md-none">
                    <div class="row">
                        <div class="col-6 collapse-brand">
                            <router-link to="/">
                                <img :src="logo">
                            </router-link>
                        </div>
                        <div class="col-6 collapse-close">
                            <navbar-toggle-button @click.native="closeSidebar"></navbar-toggle-button>
                        </div>
                    </div>
                </div>

                <ul class="navbar-nav">
                    <slot name="links">
                    </slot>
                </ul>
                <!--Divider-->
                <hr class="my-3">
                <!--Heading-->
                <!--                <h6 class="navbar-heading text-muted">Documentation</h6>-->
                <!--                &lt;!&ndash;Navigation&ndash;&gt;-->
                <!--                <ul class="navbar-nav mb-md-3">-->
                <!--                    <li class="nav-item">-->
                <!--                        <a class="nav-link"-->
                <!--                           href="https://demos.creative-tim.com/vue-argon-dashboard/documentation">-->
                <!--                            <i class="ni ni-spaceship"></i> Getting started-->
                <!--                        </a>-->
                <!--                    </li>-->
                <!--                    <li class="nav-item">-->
                <!--                        <a class="nav-link"-->
                <!--                           href="https://demos.creative-tim.com/vue-argon-dashboard/documentation/foundation/colors.html">-->
                <!--                            <i class="ni ni-palette"></i> Foundation-->
                <!--                        </a>-->
                <!--                    </li>-->
                <!--                    <li class="nav-item">-->
                <!--                        <a class="nav-link"-->
                <!--                           href="https://demos.creative-tim.com/vue-argon-dashboard/documentation/components/alerts.html">-->
                <!--                            <i class="ni ni-ui-04"></i> Components-->
                <!--                        </a>-->
                <!--                    </li>-->
                <!--                </ul>-->
            </div>
        </div>
    </nav>
</template>
<script>
import NavbarToggleButton from '@/components/NavbarToggleButton'
import {mapActions, mapMutations, mapState} from "vuex";
import {handleLogOut} from "@/functions";
import LoadDataButtonGroup from "@/components/MyComponents/LoadDataButtonGroup";

export default {
    name: 'sidebar',
    components: {
        LoadDataButtonGroup,
        NavbarToggleButton
    },
    props: {
        logo: {
            type: String,
            default: 'img/brand/green.png',
            description: 'Sidebar app logo'
        },
        autoClose: {
            type: Boolean,
            default: true,
            description: 'Whether sidebar should autoclose on mobile when clicking an item'
        }
    },
    provide() {
        return {
            autoClose: this.autoClose
        };
    },
    beforeDestroy() {
        if (this.$sidebar.showSidebar) {
            this.$sidebar.showSidebar = false;
        }
    },
    methods: {
        ...mapActions(["updateViewComponent", "increaseRequestingTasksCount"]),
        ...mapMutations(['UPDATE_VIEW']),
        closeSidebar() {
            this.$sidebar.displaySidebar(false)
        },
        showSidebar() {
            this.$sidebar.displaySidebar(true)
        },
        handleClick() {
            handleLogOut(this)
        }
    },
    computed: {
        ...mapState(['loginView']),
        name: function () {
            return this.loginView.name
        },
    }
};
</script>

<style>
.dropdown-menu-right {
    left: auto !important;
}
</style>
