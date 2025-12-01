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
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <div class="flex-shrink-0 flex items-center">
                        <!-- <h1 class="text-xl font-semibold text-gray-800">Mini Booking</h1> -->
                    </div>
                </div>

                <div class="flex items-center space-x-4">
                    <span class="text-gray-700 hidden md:inline">Hello, {{ user?.firstName }}!</span>
                    <router-link to="/my-booking" class="text-blue-700 underline decoration-solid">
                        My Bookings
                    </router-link>
                    <button @click="handleLogout"
                        class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>
