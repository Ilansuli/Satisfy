<template>
    <section class="login-modal-wrapper" :class="loginErrType">
        <section class="login-modal">
            <div class="tippy-arrow">
            </div>
            <p class="login-modal-title">{{ title }}</p>
            <p class="login-modal-body">{{ body }}</p>
            <div class="login-modal-btns">
                <div class="login-modal-close-btn" @click.stop="closeModal">Not now</div>
                <div class="login-modal-login-btn" @click.stop="routeToLogin"> 
                    <span >Log in</span>
                </div>
            </div>
        </section>
    </section>
</template>

<script>
export default {
    name: 'Login Error Modal',
    props: {
        title: {
            type: String
        },
        body: {
            type: String
        },
        loginErrType: {
            type: String
        }
    },
    methods: {
        closeModal() {
            this.$store.commit({ type: 'closeModals' })
        },
        routeToLogin(){
            this.closeModal()
            this.$router.push('/login')
        }
    }
}
</script>
