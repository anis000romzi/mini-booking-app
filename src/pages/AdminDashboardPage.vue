<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../api';
import NavBar from "../components/NavBar.vue";

const bookings = ref([]);
const rooms = ref([]);
const meta = ref({ page: 1, totalPage: 0 });
const roomMeta = ref({ page: 1, totalPage: 0 });
const loading = ref(false);
const updatingId = ref(null);
const showCreateRoomModal = ref(false);
const showUpdateRoomModal = ref(false);
const roomToUpdate = ref(null);

const form = reactive({
    roomName: "",
    available: true,
});

const updateForm = reactive({
    roomName: "",
    available: true,
});

const fetchBookings = async (page = 1) => {
    loading.value = true;
    try {
        const result = await api.getAllBookings(page, 10);
        bookings.value = result.data;
        meta.value = result.meta;
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
        roomMeta.value = result.meta;
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

const openCreateRoomModal = () => {
    showCreateRoomModal.value = true
    form.roomName = '';
    form.available = true;
};

const closeCreateRoomModal = () => {
    showCreateRoomModal.value = false;
    form.roomName = '';
    form.available = true;
};

const openUpdateRoomModal = (room) => {
    showUpdateRoomModal.value = true;
    roomToUpdate.value = room;
    updateForm.roomName = room.roomName;
    updateForm.available = room.available;
};

const closeUpdateRoomModal = () => {
    showUpdateRoomModal.value = false;
    roomToUpdate.value = null;
    updateForm.roomName = '';
    updateForm.available = true;
};

const createRoom = async (e) => {
    e.preventDefault();

    if (!form.roomName.trim()) {
        alert('Please enter a room name');
        return;
    }

    loading.value = true;
    try {
        const response = await api.createRoom({
            roomName: form.roomName,
            available: form.available
        });

        rooms.value.unshift(response.data);

        alert('Room created successfully!');
        closeCreateRoomModal();

        fetchRooms(roomMeta.value.page);
    } catch (error) {
        console.error('Error creating room:', error);
        alert('Failed to create room');
    } finally {
        loading.value = false;
    }
};

const updateRoom = async (e) => {
    e.preventDefault();

    if (!updateForm.roomName.trim()) {
        alert('Please enter a room name');
        return;
    }

    if (!roomToUpdate.value) {
        alert('No room selected for update');
        return;
    }

    loading.value = true;
    try {
        const response = await api.updateRoom({
            roomId: roomToUpdate.value.id,
            roomName: updateForm.roomName,
            available: updateForm.available
        });

        const index = rooms.value.findIndex(room => room.id === roomToUpdate.value.id);
        if (index !== -1) {
            rooms.value[index] = { ...rooms.value[index], ...response };
        }

        alert('Room updated successfully!');
        closeUpdateRoomModal();
    } catch (error) {
        console.error('Error updating room:', error);
        alert('Failed to update room');
    } finally {
        loading.value = false;
    }
};

const deleteRoom = async (roomId) => {
    if (!confirm('Are you sure you want to delete this room?')) {
        return;
    }

    loading.value = true;
    try {
        await api.deleteRoom(roomId);

        rooms.value = rooms.value.filter(room => room.id !== roomId);

        alert('Room deleted successfully!');

        if (rooms.value.length === 0 && roomMeta.value.page > 1) {
            fetchRooms(roomMeta.value.page - 1);
        }
    } catch (error) {
        console.error('Error deleting room:', error);
        alert('Failed to delete room');
    } finally {
        loading.value = false;
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
                        class="px-4 py-2 mb-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        @click="openCreateRoomModal">
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
                                                <button
                                                    class="mr-2 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    @click="() => openUpdateRoomModal(room)">
                                                    Update
                                                </button>
                                                <button
                                                    class="mr-2 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    @click="() => deleteRoom(room.id)">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-center gap-2 mt-4">
                        <button @click="fetchRooms(Number(roomMeta.page) - 1)" :disabled="Number(roomMeta.page) <= 1"
                            class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50">
                            Previous
                        </button>

                        <span class="px-3 py-1">
                            Page {{ roomMeta.page }} of {{ roomMeta.totalPage }}
                        </span>

                        <button @click="fetchRooms(Number(roomMeta.page) + 1)"
                            :disabled="Number(roomMeta.page) >= Number(roomMeta.totalPage)"
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
                        <button @click="fetchBookings(Number(meta.page) - 1)" :disabled="Number(meta.page) <= 1"
                            class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50">
                            Previous
                        </button>

                        <span class="px-3 py-1">
                            Page {{ meta.page }} of {{ meta.totalPage }}
                        </span>

                        <button @click="fetchBookings(Number(meta.page) + 1)"
                            :disabled="Number(meta.page) >= Number(meta.totalPage)"
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

        <div v-if="showCreateRoomModal" class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeCreateRoomModal">
                </div>

                <div
                    class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-medium leading-6 text-gray-900">
                            Create New Room
                        </h3>
                        <button @click="closeCreateRoomModal" class="text-gray-400 hover:text-gray-500">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form @submit="createRoom">
                        <div class="mb-4">
                            <label for="roomName" class="block text-sm font-medium text-gray-700">
                                Room Name
                            </label>
                            <input type="text" id="roomName" v-model="form.roomName"
                                class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                required />
                        </div>

                        <div class="mb-4">
                            <label class="flex items-center">
                                <input type="checkbox" v-model="form.available"
                                    class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                <span class="ml-2 text-sm text-gray-700">Available for booking</span>
                            </label>
                        </div>

                        <div class="flex justify-end mt-6 space-x-3">
                            <button type="button" @click="closeCreateRoomModal"
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                Cancel
                            </button>
                            <button type="submit" :disabled="loading"
                                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                {{ loading ? 'Creating...' : 'Create' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div v-if="showUpdateRoomModal" class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeUpdateRoomModal">
                </div>

                <div
                    class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-medium leading-6 text-gray-900">
                            Update Room
                        </h3>
                        <button @click="closeUpdateRoomModal" class="text-gray-400 hover:text-gray-500">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form @submit="updateRoom">
                        <div class="mb-4">
                            <label for="updateRoomName" class="block text-sm font-medium text-gray-700">
                                Room Name
                            </label>
                            <input type="text" id="updateRoomName" v-model="updateForm.roomName"
                                class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                required />
                        </div>

                        <div class="mb-4">
                            <label class="flex items-center">
                                <input type="checkbox" v-model="updateForm.available"
                                    class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                <span class="ml-2 text-sm text-gray-700">Available for booking</span>
                            </label>
                        </div>

                        <div class="flex justify-end mt-6 space-x-3">
                            <button type="button" @click="closeUpdateRoomModal"
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                Cancel
                            </button>
                            <button type="submit" :disabled="loading"
                                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                {{ loading ? 'Updating...' : 'Update' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>