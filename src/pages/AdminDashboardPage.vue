<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';
import NavBar from "../components/NavBar.vue";

const bookings = ref([]);
const rooms = ref([]);
const meta = ref({ page: 1, totalPage: 0 });
const roomMeta = ref({ page: 1, totalPage: 0 });
const loading = ref(false);
const updatingId = ref(null);
const showCreateRoomModal = ref(false);

const fetchBookings = async (page = 1) => {
    loading.value = true;
    try {
        const result = await api.getAllBookings(page, 10);
        bookings.value = result.data;
        roomMeta.value = result.meta;
    } catch (error) {
        console.error('Error:', error);
        alert('Error:', error);
    } finally {
        loading.value = false;
    }
};

const fetchRooms = async (page = 1) => {
    loading.value = true;
    try {
        const result = await api.getAllRooms(page, 5);
        rooms.value = result.data;
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

const updateBookingStatus = async (bookingId, newStatus) => {
    if (!confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) {
        return;
    }

    updatingId.value = bookingId;

    try {
        await api.updateBookingStatus({ bookingId, status: newStatus })

        const index = bookings.value.findIndex(booking => booking.id === bookingId);
        if (index !== -1) {
            bookings.value[index].status = newStatus;
        }

        alert(`Booking marked as ${newStatus} successfully!`);
    } catch (error) {
        console.error(`Error updating booking status to ${newStatus}:`, error);
        alert(`Failed to update booking status to ${newStatus}`);
    } finally {
        updatingId.value = null;
    }
};

onMounted(() => {
    fetchBookings();
    fetchRooms();
});
</script>

<template>
    <div class="min-h-screen bg-gray-100">
        <NavBar />

        <main class="px-4 py-6 mx-auto max-w-7xl">
            <div class="p-4 bg-white rounded-lg shadow">
                <h2 class="mb-4 text-lg font-medium text-gray-900">All Room Data</h2>

                <div v-if="loading" class="py-4 text-center">
                    Loading...
                </div>


                <div v-else-if="rooms.length > 0">
                    <button type="button"
                        class="px-4 py-2 mb-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                        Create Room
                    </button>

                    <div class="-mx-4 overflow-x-auto sm:mx-0">
                        <div class="inline-block min-w-full align-middle">
                            <div class="overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
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
                                                Available
                                            </th>
                                            <th scope="col"
                                                class="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase sm:px-6">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr v-for="room in rooms" :key="room.id">
                                            <td class="px-4 py-4 text-sm font-medium whitespace-nowrap sm:px-6">
                                                {{ room.id }}
                                            </td>
                                            <td class="px-4 py-4 text-sm whitespace-nowrap sm:px-6">
                                                {{ room.roomName }}
                                            </td>
                                            <td class="px-4 py-4 text-sm whitespace-nowrap sm:px-6">
                                                {{ room.available }}
                                            </td>
                                            <td class="px-4 py-4 text-sm whitespace-nowrap sm:px-6">

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-center gap-2 mt-4">
                        <button @click="fetchBookings(meta.page - 1)" :disabled="meta.page <= 1"
                            class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50">
                            Previous
                        </button>

                        <span class="px-3 py-1">
                            Page {{ roomMeta.page }} of {{ roomMeta.totalPage }}
                        </span>

                        <button @click="fetchBookings(roomMeta.page + 1)"
                            :disabled="roomMeta.page >= roomMeta.totalPage"
                            class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                </div>

                <div v-else class="py-8 text-center text-gray-500">
                    No rooms found.
                </div>
            </div>

            <div class="p-4 bg-white rounded-lg shadow">
                <h2 class="mb-4 text-lg font-medium text-gray-900">All Booking Data</h2>

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
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr v-for="booking in bookings" :key="booking.id">
                                            <td class="px-4 py-4 text-sm font-medium whitespace-nowrap sm:px-6">
                                                {{ booking.id }}
                                            </td>
                                            <td class="px-4 py-4 text-sm whitespace-nowrap sm:px-6">
                                                {{ booking.roomId }}
                                            </td>
                                            <td class="px-4 py-4 text-sm whitespace-nowrap sm:px-6">
                                                {{ booking.room.roomName }}
                                            </td>
                                            <td class="px-4 py-4 text-sm whitespace-nowrap sm:px-6">
                                                {{ booking.user.firstName }} {{ booking.user.lastName }}
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
                                                    :disabled="updatingId === booking.id" :class="{
                                                        'px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500': updatingId !== booking.id,
                                                        'px-3 py-1.5 bg-red-400 text-white text-xs font-medium rounded-md cursor-not-allowed': updatingId === booking.id
                                                    }" @click="() => updateBookingStatus(booking.id, 'cancelled')"
                                                    class="mr-2">
                                                    <span v-if="updatingId === booking.id">Updating...</span>
                                                    <span v-else>Cancel</span>
                                                </button>

                                                <button v-if="booking.status === 'booked'"
                                                    :disabled="updatingId === booking.id" :class="{
                                                        'px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500': updatingId !== booking.id,
                                                        'px-3 py-1.5 bg-green-400 text-white text-xs font-medium rounded-md cursor-not-allowed': updatingId === booking.id
                                                    }" @click="() => updateBookingStatus(booking.id, 'done')">
                                                    <span v-if="updatingId === booking.id">Updating...</span>
                                                    <span v-else>Mark as Done</span>
                                                </button>

                                                <span v-if="booking.status === 'cancelled' || booking.status === 'done'"
                                                    class="text-xs italic text-gray-500">
                                                    No actions available
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-center gap-2 mt-4">
                        <button @click="fetchBookings(meta.page - 1)" :disabled="meta.page <= 1"
                            class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50">
                            Previous
                        </button>

                        <span class="px-3 py-1">
                            Page {{ meta.page }} of {{ meta.totalPage }}
                        </span>

                        <button @click="fetchBookings(meta.page + 1)" :disabled="meta.page >= meta.totalPage"
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