import { EventItem, FilterOptions, ApiFetchResult } from "../types";
import { MESSAGES } from "../constants";
import { axiosClient } from "../config";

export const eventsApi = {
  /**
   * Fetch all events directly from Nest backend via GET /events
   */
  async getEvents(
    filters?: FilterOptions,
  ): Promise<ApiFetchResult<EventItem[]>> {
    try {
      const params: Record<string, string> = {};
      if (filters?.category && filters.category !== "all") {
        params.category = filters.category;
      }
      if (filters?.searchQuery) {
        params.searchQuery = filters.searchQuery;
      }

      const response = await axiosClient.get<EventItem[]>("/events", { params });
      return { data: Array.isArray(response.data) ? response.data : [], isConnected: true };
    } catch (err: any) {
      console.error("❌ Nest Axios API fetch failed:", err?.message || err);
      return {
        data: [],
        isConnected: false,
        error: err?.message || MESSAGES.ERRORS.FAILED_TO_CONNECT,
      };
    }
  },

  /**
   * Create a new event directly on Nest backend via POST /events
   */
  async createEvent(
    eventData: Omit<EventItem, "id" | "createdAt" | "distanceKm">,
  ): Promise<ApiFetchResult<EventItem>> {
    const payload = {
      title: eventData.title,
      category: eventData.category,
      description: eventData.description,
      posterUrl: eventData.posterUrl,
      date: eventData.date,
      time: eventData.time,
      locationName: eventData.locationName,
      locationAddress: eventData.locationName,
      ticketPrice: eventData.ticketPrice,
      totalSeats: eventData.totalSeats,
      availableSeats: eventData.availableSeats,
      hostName: eventData.hostName,
      hostAvatar: eventData.hostAvatar,
      hostEmail: eventData.hostEmail,
      latitude: (eventData as any).latitude ?? 12.9716,
      longitude: (eventData as any).longitude ?? 77.5946,
    };

    const response = await axiosClient.post<EventItem>("/events", payload);
    return { data: response.data, isConnected: true };
  },

  /**
   * Fetch single event details by ID
   */
  async getEventById(id: string): Promise<ApiFetchResult<EventItem | null>> {
    const response = await axiosClient.get<EventItem>(`/events/${id}`);
    return { data: response.data, isConnected: true };
  },
};
