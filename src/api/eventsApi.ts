import { EventItem, FilterOptions, ApiFetchResult } from "../types";
import { ENDPOINTS, MESSAGES } from "../constants";

export const eventsApi = {
  /**
   * Fetch all events directly from Nest backend via GET /events
   */
  async getEvents(
    filters?: FilterOptions,
  ): Promise<ApiFetchResult<EventItem[]>> {
    try {
      const params = new URLSearchParams();
      if (filters?.category && filters.category !== "all") {
        params.append("category", filters.category);
      }
      if (filters?.searchQuery) {
        params.append("searchQuery", filters.searchQuery);
      }

      const queryString = params.toString();
      const url = `${ENDPOINTS.EVENTS}${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(MESSAGES.ERRORS.SERVER_ERROR(response.status, errorText));
      }

      const data = await response.json();
      return { data: Array.isArray(data) ? data : [], isConnected: true };
    } catch (err: any) {
      console.error("❌ Nest API fetch failed:", err?.message || err);
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

    const response = await fetch(ENDPOINTS.EVENTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(MESSAGES.ERRORS.CREATE_EVENT_FAILED(response.status, errorText));
    }

    const createdEvent: EventItem = await response.json();
    return { data: createdEvent, isConnected: true };
  },

  /**
   * Fetch single event details by ID
   */
  async getEventById(id: string): Promise<ApiFetchResult<EventItem | null>> {
    const response = await fetch(ENDPOINTS.EVENT_BY_ID(id));
    if (!response.ok) {
      throw new Error(MESSAGES.ERRORS.EVENT_NOT_FOUND(id));
    }
    const data = await response.json();
    return { data, isConnected: true };
  },
};
