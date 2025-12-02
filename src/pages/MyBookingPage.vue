<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';
import NavBar from "../components/NavBar.vue";

const bookings = ref([]);
const meta = ref({ page: 1, totalPage: 0 });
const loading = ref(false);
const cancelingId = ref(null);

const fetchBookings = async (page = 1) => {
    loading.value = true;
    try {
        const result = await api.getOwnedBookings(page, 10);
        bookings.value = result.data;
        meta.value = result.meta;
    } catch (error) {
        console.error('Error:', error);
        alert('Error:', error);
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

const cancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }

    cancelingId.value = bookingId;

    try {
        await api.cancelBooking(bookingId);

        const index = bookings.value.findIndex(booking => booking.id === bookingId);
        if (index !== -1) {
            bookings.value[index].status = 'cancelled';
        }

        alert('Booking cancelled successfully!');
    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking');
    } finally {
        cancelingId.value = null;
    }
};

onMounted(() => {
    fetchBookings();
});
</script>

<template>
    <div class="min-h-screen bg-gray-100">
        <NavBar />

        <main class="px-4 py-6 mx-auto max-w-7xl">
            <div class="p-4 bg-white rounded-lg shadow">
                <h2 class="mb-4 text-lg font-medium text-gray-900">My Bookings</h2>

                <div v-if="loading" class="py-4 text-center">
                    Loading...
                </div>

                <div v-else-if="bookings.length > 0">
                    <div class="-mx-4 overflow-x-auto sm:mx-0">
                        <div class="inline-block min-w-full align-middle">
                            <div class="overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th scope="col"
                                                class="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase sm:px-6">
                                                Booking ID
                                            </th>
                                            <th scope="col"
                                                class="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase sm:px-6">
                                                Room ID
                                            </th>
                                            <th scope="col"
                                                class="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase sm:px-6">
                                                Room Name
                                            </th>
                                            <th scope="col"
                                                class="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase sm:px-6">
                                                Customer Name
                                            </th>
                                            <th scope="col"
                                                class="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase sm:px-6">
                                                Start Time
                                            </th>
                                            <th scope="col"
                                                class="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase sm:px-6">
                                                End Time
                                            </th>
                                            <th scope="col"
                                                class="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase sm:px-6">
                                                Status
                                            </th>
                                            <th scope="col"
                                                class="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase sm:px-6">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr v-for="booking in bookings" :key="booking.id">
                                            <td
                                                class="px-4 py-4 text-sm font-medium whitespace-nowrap sm:px-6">
                                                {{ booking.id }}
                                            </td>
                                            <td class="px-4 py-4 text-sm whitespace-nowrap sm:px-6">
                                                {{ booking.roomId }}
                                            </td>
                                            <td class="px-4 py-4 text-sm whitespace-nowrap sm:px-6">
                                                {{ booking.roomName }}
                                            </td>
                                            <td class="px-4 py-4 text-sm whitespace-nowrap sm:px-6">
                                                {{ booking.customerName }}
                                            </td>
                                            <td class="px-4 py-4 text-sm whitespace-nowrap sm:px-6">
                                                {{ formatDateTime(booking.startAt) }}
                                            </td>
                                            <td class="px-4 py-4 text-sm whitespace-nowrap sm:px-6">
                                                {{ formatDateTime(booking.endAt) }}
                                            </td>
                                            <td class="px-4 py-4 text-sm whitespace-nowrap sm:px-6">
                                                <div :class="{
                                                    'bg-blue-50 text-blue-800': booking.status === 'booked',
                                                    'bg-green-50 text-green-800': booking.status === 'done',
                                                    'bg-red-50 text-red-800': booking.status === 'cancelled',
                                                    'bg-gray-50 text-gray-800': !['booked', 'done', 'cancelled'].includes(booking.status)
                                                }"
                                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                                    {{ booking.status }}
                                                </div>
                                            </td>
                                            <td class="px-4 py-4 text-sm whitespace-nowrap sm:px-6">
                                                <button
                                                    v-if="booking.status !== 'cancelled' && booking.status !== 'done'"
                                                    :disabled="cancelingId === booking.id" :class="{
                                                        'px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500': cancelingId !== booking.id,
                                                        'px-3 py-1.5 bg-red-400 text-white text-xs font-medium rounded-md cursor-not-allowed': cancelingId === booking.id
                                                    }" @click="() => cancelBooking(booking.id)">
                                                    <span v-if="cancelingId === booking.id">Cancelling...</span>
                                                    <span v-else>Cancel</span>
                                                </button>
                                                <span v-else class="text-xs italic text-gray-500">
                                                    Cannot cancel
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-center gap-2 mt-4">
                        <button @click="fetchBookings(Number(meta.page) - 1)" :disabled="Number(meta.page) <= 1"
                            class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50">
                            Previous
                        </button>

                        <span class="px-3 py-1">
                            Page {{ meta.page }} of {{ meta.totalPage }}
                        </span>

                        <button @click="fetchBookings(Number(meta.page) + 1)" :disabled="Number(meta.page) >= Number(meta.totalPage)"
                            class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                </div>

                <div v-else class="py-8 text-center text-gray-500">
                    No bookings found.
                </div>
            </div>
        </main>
    </div>
</template>