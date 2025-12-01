<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const user = computed(() => store.getters.currentUser);

const handleLogout = () => {
    store.dispatch('logout');
    router.push('/login');
};
</script>

<template>
    <nav class="bg-white shadow-sm">
        <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <div class="flex items-center flex-shrink-0">
                        <!-- <h1 class="text-xl font-semibold text-gray-800">Mini Booking</h1> -->
                    </div>
                </div>

                <div class="flex items-center space-x-4">
                    <span class="hidden text-gray-700 md:inline">Hello, {{ user?.firstName }}!</span>
                    <router-link to="/" class="text-blue-700 underline decoration-solid">
                        Home
                    </router-link>
                    <router-link v-if="user?.role === 'admin'" to="/admin-dashboard"
                        class="text-blue-700 underline decoration-solid">
                        Admin Dashboard
                    </router-link>
                    <router-link to="/my-booking" class="text-blue-700 underline decoration-solid">
                        My Bookings
                    </router-link>
                    <button @click="handleLogout"
                        class="px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-red-600 rounded-md hover:bg-red-700">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>
