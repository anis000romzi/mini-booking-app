<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';
import NavBar from "../components/NavBar.vue";
import { useRouter } from 'vue-router';

const bookings = ref([]);
const meta = ref({ page: 1, totalPage: 0 });
const loading = ref(false);
const router = useRouter();

const fetchBookings = async (page = 1) => {
    loading.value = true;
    try {
        const result = await api.getOwnedBookings(page, 10);
        bookings.value = result.data;
        meta.value = result.meta;
    } catch (error) {
        console.error('Error:', error);
    } finally {
        loading.value = false;
    }
};

const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

onMounted(() => {
    fetchBookings();
});
</script>

<template>
    <div class="min-h-screen bg-gray-100">
        <NavBar />

        <main class="max-w-7xl mx-auto py-6 px-4">
            <button
                class="mb-4 px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                @click="() => { router.push('/') }">
                Back
            </button>
            <div class="bg-white shadow rounded-lg p-4">
                <h2 class="text-lg font-medium text-gray-900 mb-4">My Bookings</h2>

                <div v-if="loading" class="text-center py-4">
                    Loading...
                </div>

                <div v-else-if="bookings.length > 0">
                    <table class="table-auto w-full text-sm">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="p-2 text-left">Booking ID</th>
                                <th class="p-2 text-left">Room ID</th>
                                <th class="p-2 text-left">Room Name</th>
                                <th class="p-2 text-left">Start Time</th>
                                <th class="p-2 text-left">End Time</th>
                                <th class="p-2 text-left">Status</th>
                                <th class="p-2 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="booking in bookings" :key="booking.id" class="border-t">
                                <td class="p-2">{{ booking.id }}</td>
                                <td class="p-2">{{ booking.roomId }}</td>
                                <td class="p-2">{{ booking.room.roomName }}</td>
                                <td class="p-2">{{ formatDateTime(booking.startAt) }}</td>
                                <td class="p-2">{{ formatDateTime(booking.endAt) }}</td>
                                <td class="p-2">
                                    <div class="p-3 bg-blue-50 rounded-md">
                                        <p class="text-sm text-center text-blue-800">
                                            {{ booking.status }}
                                        </p>
                                    </div>
                                </td>
                                <td class="p-2">
                                    <button
                                        class="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        @click="() => { }">
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="mt-4 flex items-center justify-center gap-2">
                        <button @click="fetchBookings(meta.page - 1)" :disabled="meta.page <= 1"
                            class="px-3 py-1 border rounded disabled:opacity-50">
                            Previous
                        </button>

                        <span class="px-3 py-1">
                            Page {{ meta.page }} of {{ meta.totalPage }}
                        </span>

                        <button @click="fetchBookings(meta.page + 1)" :disabled="meta.page >= meta.totalPage"
                            class="px-3 py-1 border rounded disabled:opacity-50">
                            Next
                        </button>
                    </div>
                </div>

                <div v-else class="text-center py-8 text-gray-500">
                    No bookings found.
                </div>
            </div>
        </main>
    </div>
</template>