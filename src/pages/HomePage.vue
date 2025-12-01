<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter, RouterLink } from "vue-router";
import api from "../api";
import NavBar from "../components/NavBar.vue";

const store = useStore();
const router = useRouter();

const getDefaultStartTime = () => {
    const now = new Date();
    // Set to current hour
    const startTime = new Date(now);
    startTime.setMinutes(0, 0, 0);
    return formatDateTimeLocal(startTime);
};

const getDefaultEndTime = () => {
    const now = new Date();
    // Set to next hour
    const endTime = new Date(now);
    endTime.setHours(endTime.getHours() + 1);
    endTime.setMinutes(0, 0, 0);
    return formatDateTimeLocal(endTime);
};

const formatDateTimeLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const toApiDateTimeFormat = (datetimeLocal) => {
    return datetimeLocal.replace("T", " ");
};

const startAt = ref(getDefaultStartTime());
const endAt = ref(getDefaultEndTime());
const availableRoomsList = ref([]);
const loading = ref(false);

const showBookingModal = ref(false);
const selectedRoom = ref(null);
const bookingLoading = ref(false);
const bookingError = ref('');
const bookingSuccess = ref('');

const bookingStartAt = ref('');
const bookingEndAt = ref('');

const user = computed(() => store.getters.currentUser);
const isAuthenticated = computed(() => store.getters.isAuthenticated);

const loadAvailableRooms = async () => {
    loading.value = true;

    try {
        const apiStartAt = toApiDateTimeFormat(startAt.value);
        const apiEndAt = toApiDateTimeFormat(endAt.value);

        const response = await api.getAvailableRooms(apiStartAt, apiEndAt);
        availableRoomsList.value = response.availableRooms;
    } catch (error) {
        console.error("Error loading available rooms:", error);
        alert(error)
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    if (!isAuthenticated.value) {
        router.push("/login");
    }
    loadAvailableRooms();
});

const setQuickTimeRange = (hours) => {
    const now = new Date();
    const startTime = new Date(now);
    const endTime = new Date(now);

    switch (hours) {
        case 1:
            startTime.setMinutes(0, 0, 0);
            endTime.setHours(endTime.getHours() + 1);
            endTime.setMinutes(0, 0, 0);
            break;
        case 2:
            startTime.setMinutes(0, 0, 0);
            endTime.setHours(endTime.getHours() + 2);
            endTime.setMinutes(0, 0, 0);
            break;
        case 4:
            startTime.setMinutes(0, 0, 0);
            endTime.setHours(endTime.getHours() + 4);
            endTime.setMinutes(0, 0, 0);
            break;
        case "today":
            startTime.setMinutes(0, 0, 0);
            endTime.setHours(23, 59, 0, 0);
            break;
        case "tomorrow":
            startTime.setDate(startTime.getDate() + 1);
            startTime.setHours(9, 0, 0, 0);
            endTime.setDate(endTime.getDate() + 1);
            endTime.setHours(17, 0, 0, 0);
            break;
    }

    startAt.value = formatDateTimeLocal(startTime);
    endAt.value = formatDateTimeLocal(endTime);
    loadAvailableRooms();
};

const openBookingModal = (room) => {
    selectedRoom.value = room;
    bookingStartAt.value = startAt.value;
    bookingEndAt.value = endAt.value;
    bookingError.value = '';
    bookingSuccess.value = '';
    showBookingModal.value = true;
};

const closeBookingModal = () => {
    showBookingModal.value = false;
    selectedRoom.value = null;
    bookingLoading.value = false;
    bookingError.value = '';
    bookingSuccess.value = '';
};

const submitBooking = async () => {
    if (!selectedRoom.value) return;

    const start = new Date(bookingStartAt.value);
    const end = new Date(bookingEndAt.value);

    if (end <= start) {
        bookingError.value = 'End time must be after start time';
        return;
    }

    bookingLoading.value = true;
    bookingError.value = '';

    try {
        const apiStartAt = toApiDateTimeFormat(bookingStartAt.value);
        const apiEndAt = toApiDateTimeFormat(bookingEndAt.value);

        const bookingData = {
            roomId: selectedRoom.value.id,
            startAt: apiStartAt,
            endAt: apiEndAt,
        };

        const response = await api.createBooking(bookingData);

        bookingSuccess.value = `Successfully booked "${selectedRoom.value.roomName}" from ${apiStartAt} to ${apiEndAt}`;

        setTimeout(() => {
            closeBookingModal();
            loadAvailableRooms();
        }, 2000);

    } catch (error) {
        console.error('Booking error:', error);
        bookingError.value = error.response?.data?.message || 'Failed to book room. Please try again.';
    } finally {
        bookingLoading.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen bg-gray-100">
        <NavBar />

        <main class="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="p-6 mb-6 bg-white rounded-lg shadow">
                <h2 class="mb-4 text-lg font-medium text-gray-900">Select Date Range</h2>
                <div class="flex flex-wrap gap-2 mb-4">
                    <button @click="setQuickTimeRange(1)"
                        class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors">
                        Next Hour
                    </button>
                    <button @click="setQuickTimeRange(2)"
                        class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors">
                        Next 2 Hours
                    </button>
                    <button @click="setQuickTimeRange(4)"
                        class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors">
                        Next 4 Hours
                    </button>
                    <button @click="setQuickTimeRange('today')"
                        class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors">
                        Rest of Today
                    </button>
                    <button @click="setQuickTimeRange('tomorrow')"
                        class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors">
                        Tomorrow 9AM-5PM
                    </button>
                </div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label for="startAt" class="block mb-1 text-sm font-medium text-gray-700">
                            Start Date & Time
                        </label>
                        <input type="datetime-local" id="startAt" v-model="startAt"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        <p class="mt-1 text-xs text-gray-500">
                            Current: {{ new Date().toLocaleDateString() }}
                            {{ new Date().getHours() }}:00
                        </p>
                    </div>
                    <div>
                        <label for="endAt" class="block mb-1 text-sm font-medium text-gray-700">
                            End Date & Time
                        </label>
                        <input type="datetime-local" id="endAt" v-model="endAt"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        <p class="mt-1 text-xs text-gray-500">
                            Next hour:
                            {{ new Date(new Date().getTime() + 60 * 60 * 1000).getHours() }}:00
                        </p>
                    </div>
                </div>
                <button @click="loadAvailableRooms" :disabled="loading"
                    class="px-4 py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                    {{ loading ? "Loading..." : "Search Available Rooms" }}
                </button>
            </div>

            <div class="p-6 bg-white rounded-lg shadow">
                <h2 class="mb-4 text-lg font-medium text-gray-900">
                    Available Rooms
                    <span class="ml-2 text-sm text-gray-500">
                        ({{ availableRoomsList.length }} room{{
                            availableRoomsList.length !== 1 ? "s" : ""
                        }}
                        available)
                    </span>
                </h2>

                <div class="p-3 mb-4 rounded-md bg-blue-50">
                    <p class="text-sm text-blue-800">
                        Showing rooms available from
                        <span class="font-medium">{{ startAt.replace("T", " ") }}</span>
                        to
                        <span class="font-medium">{{ endAt.replace("T", " ") }}</span>
                    </p>
                </div>

                <div v-if="loading" class="py-8 text-center">
                    <div class="w-12 h-12 mx-auto border-b-2 border-indigo-600 rounded-full animate-spin"></div>
                    <p class="mt-4 text-gray-600">Loading available rooms...</p>
                </div>

                <div v-else-if="availableRoomsList.length === 0" class="py-8 text-center">
                    <font-awesome-icon class="w-12 h-12" :icon="['far', 'face-frown']" />

                    <h3 class="mt-2 text-sm font-medium text-gray-900">No rooms available</h3>
                    <p class="mt-1 text-sm text-gray-500">
                        Try adjusting your date range or try a different time.
                    </p>
                </div>

                <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div v-for="room in availableRoomsList" :key="room.id"
                        class="p-4 transition-shadow duration-200 border border-gray-200 rounded-lg hover:shadow-md">
                        <div class="flex items-start justify-between mb-2">
                            <h3 class="text-lg font-medium text-gray-900">{{ room.roomName }}</h3>
                        </div>

                        <button
                            class="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            @click="openBookingModal(room)">
                            Book This Room
                        </button>
                    </div>
                </div>
            </div>
        </main>

        <div v-if="showBookingModal" class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeBookingModal">
                </div>

                <div
                    class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-medium leading-6 text-gray-900">
                            Book Room: {{ selectedRoom?.roomName }}
                        </h3>
                        <button @click="closeBookingModal" class="text-gray-400 hover:text-gray-500">
                            <font-awesome-icon :icon="['fas', 'xmark']" class="w-5 h-5" />
                        </button>
                    </div>

                    <div v-if="bookingSuccess" class="p-3 mb-4 border border-green-200 rounded-md bg-green-50">
                        <p class="text-sm text-green-800">{{ bookingSuccess }}</p>
                    </div>

                    <div v-if="bookingError" class="p-3 mb-4 border border-red-200 rounded-md bg-red-50">
                        <p class="text-sm text-red-800">{{ bookingError }}</p>
                    </div>

                    <form v-if="!bookingSuccess" @submit.prevent="submitBooking">
                        <div class="space-y-4">
                            <div>
                                <label class="block mb-1 text-sm font-medium text-gray-700">
                                    Start Date & Time
                                </label>
                                <input type="datetime-local" v-model="bookingStartAt" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>

                            <div>
                                <label class="block mb-1 text-sm font-medium text-gray-700">
                                    End Date & Time
                                </label>
                                <input type="datetime-local" v-model="bookingEndAt" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>

                            <div class="p-3 rounded-md bg-gray-50">
                                <p class="text-sm text-gray-600">
                                    <span class="font-medium">Room:</span> {{ selectedRoom?.roomName }}
                                </p>
                                <p class="mt-1 text-sm text-gray-600">
                                    <span class="font-medium">Room ID:</span> {{ selectedRoom?.id }}
                                </p>
                            </div>
                        </div>

                        <div class="flex justify-end mt-6 space-x-3">
                            <button type="button" @click="closeBookingModal"
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                :disabled="bookingLoading">
                                Cancel
                            </button>
                            <button type="submit" :disabled="bookingLoading"
                                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                {{ bookingLoading ? 'Booking...' : 'Confirm Booking' }}
                            </button>
                        </div>
                    </form>

                    <div v-if="bookingSuccess" class="flex justify-end mt-6">
                        <button @click="closeBookingModal"
                            class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
