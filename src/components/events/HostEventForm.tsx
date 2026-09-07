import React, { useState } from "react";
import { useApp } from "../../hooks/useApp";
import { useEvents } from "../../hooks/useEvents";
import { EventCategory, IEventItem } from "../../types";
import { formatCurrency, formatDate } from "../../utils/formatters";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Stack,
  InputAdornment,
  Chip,
  LinearProgress,
  Card,
} from "@mui/material";
import {
  AutoAwesome as SparklesIcon,
  Group as UsersIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon,
  Analytics as AnalyticsIcon,
  AddCircleOutline as AddIcon,
  ConfirmationNumber as TicketIcon,
  AccountBalanceWallet as RevenueIcon,
} from "@mui/icons-material";
import { MESSAGES, HOST_CATEGORIES, PRESET_POSTERS } from "../../constants";
import toast from "react-hot-toast";

export const HostEventForm: React.FC = () => {
  const {
    addEvent,
    setActiveNav,
    user,
    setIsAuthModalOpen,
    setIsVerificationModalOpen,
  } = useApp();
  const { events } = useEvents();

  const [activeTab, setActiveTab] = useState<"create" | "my-events">("create");

  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState<Exclude<EventCategory, "all">>("birthday");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:00");
  const [locationName, setLocationName] = useState("");
  const [ticketPrice, setTicketPrice] = useState<number>(0);
  const [totalSeats, setTotalSeats] = useState<number>(100);
  const [posterUrl, setPosterUrl] = useState(PRESET_POSTERS[2].url);
  const [customPoster, setCustomPoster] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Filter events hosted by the current user
  const myHostedEvents = events.filter(
    (e: IEventItem) =>
      (e.hostName && user.name && e.hostName.toLowerCase() === user.name.toLowerCase()) ||
      (e.hostEmail && user.email && e.hostEmail.toLowerCase() === user.email.toLowerCase()),
  );

  const totalRevenue = myHostedEvents.reduce((acc: number, e: IEventItem) => {
    const booked = (e.totalSeats || 100) - (e.availableSeats || 0);
    return acc + booked * (e.ticketPrice || 0);
  }, 0);

  const totalTicketsSold = myHostedEvents.reduce((acc: number, e: IEventItem) => {
    return acc + ((e.totalSeats || 100) - (e.availableSeats || 0));
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user.isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!user.isVerified) {
      setIsVerificationModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    const finalPoster = customPoster.trim() !== "" ? customPoster : posterUrl;

    try {
      await addEvent({
        title,
        category,
        description,
        posterUrl: finalPoster,
        date: date || new Date().toISOString().split("T")[0],
        time,
        locationName,
        ticketPrice: Number(ticketPrice),
        availableSeats: Number(totalSeats),
        totalSeats: Number(totalSeats),
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setActiveTab("my-events");
      }, 1500);
    } catch (err: any) {
      toast.error(MESSAGES.TOAST.EVENT_PUBLISH_FAILED(err?.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", py: 2 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 1,
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Event Host Portal
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Publish events, track ticket sales analytics, and manage remaining seat capacity.
        </Typography>
      </Box>

      {/* Mode Navigation Tabs */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ mb: 4 }}
      >
        <Button
          variant={activeTab === "create" ? "contained" : "outlined"}
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setActiveTab("create")}
          sx={{ borderRadius: 3, fontWeight: 700, px: 3 }}
        >
          Create New Event
        </Button>

        <Button
          variant={activeTab === "my-events" ? "contained" : "outlined"}
          color="secondary"
          startIcon={<AnalyticsIcon />}
          onClick={() => setActiveTab("my-events")}
          sx={{ borderRadius: 3, fontWeight: 700, px: 3 }}
        >
          My Hosted Events ({myHostedEvents.length})
        </Button>
      </Stack>

      {/* TAB 1: CREATE NEW EVENT FORM */}
      {activeTab === "create" && (
        <>
          {submitted ? (
            <Paper
              elevation={2}
              sx={{ p: 6, textAlign: "center", borderRadius: 4 }}
            >
              <CheckIcon sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                {MESSAGES.HOST.SUCCESS_TITLE}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {MESSAGES.HOST.SUCCESS_SUBTITLE}
              </Typography>
            </Paper>
          ) : (
            <Paper
              component="form"
              onSubmit={handleSubmit}
              elevation={2}
              sx={{ p: 4, borderRadius: 4 }}
            >
              <Grid container spacing={3}>
                {/* Title */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Event Title *"
                    placeholder="e.g. Sanya's Grand 21st Birthday Bash"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Grid>

                {/* Category & Pricing */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Event Category</InputLabel>
                    <Select
                      value={category}
                      label="Event Category"
                      onChange={(e) => setCategory(e.target.value as any)}
                    >
                      {HOST_CATEGORIES.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.selectLabel}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Ticket Price (₹ set by host) *"
                    placeholder="0 for FREE ticket"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(Number(e.target.value))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <span className="text-emerald-500 font-bold">₹</span>
                        </InputAdornment>
                      ),
                    }}
                    helperText="Leave as 0 for Free entry"
                    required
                  />
                </Grid>

                {/* Date, Time & Total Capacity */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Event Date *"
                    InputLabelProps={{ shrink: true }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="time"
                    label="Event Time *"
                    InputLabelProps={{ shrink: true }}
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Total Seat Capacity *"
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(Number(e.target.value))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <UsersIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    required
                  />
                </Grid>

                {/* Location */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Venue & Location Address *"
                    placeholder="e.g. Royal Crystal Palace, Downtown 5th Avenue"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon sx={{ color: "#06b6d4" }} />
                        </InputAdornment>
                      ),
                    }}
                    required
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Event Description"
                    placeholder="Tell guests about your event itinerary, dress code, food & entertainment..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>

                {/* Poster Selection */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    {MESSAGES.HOST.PRESETS_LABEL}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ overflowX: "auto", pb: 1 }}
                  >
                    {PRESET_POSTERS.map((preset, idx) => (
                      <Box
                        key={idx}
                        onClick={() => {
                          setPosterUrl(preset.url);
                          setCustomPoster("");
                        }}
                        sx={{
                          position: "relative",
                          width: 120,
                          height: 80,
                          borderRadius: 2,
                          overflow: "hidden",
                          cursor: "pointer",
                          border:
                            posterUrl === preset.url && !customPoster
                              ? "2px solid #6366f1"
                              : "1px solid rgba(0,0,0,0.1)",
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          component="img"
                          src={preset.url}
                          alt={preset.label}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>

                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Or paste custom image/GIF URL..."
                    value={customPoster}
                    onChange={(e) => setCustomPoster(e.target.value)}
                    sx={{ mt: 1.5 }}
                  />
                </Grid>

                {/* Submit */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={isSubmitting}
                    startIcon={<SparklesIcon />}
                    endIcon={<ArrowIcon />}
                    sx={{ py: 1.5, fontWeight: 700, fontSize: "1.05rem" }}
                  >
                    {isSubmitting
                      ? MESSAGES.HOST.SUBMIT_LOADING
                      : MESSAGES.HOST.SUBMIT_BUTTON}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          )}
        </>
      )}

      {/* TAB 2: MY HOSTED EVENTS & TICKET SALES ANALYTICS */}
      {activeTab === "my-events" && (
        <div className="space-y-6">
          {/* Analytics Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <TicketIcon fontSize="medium" />
              </div>
              <div>
                <Typography variant="caption" className="text-slate-400 block font-medium">
                  Total Tickets Sold
                </Typography>
                <Typography variant="h5" className="font-extrabold text-white">
                  {totalTicketsSold} Passes
                </Typography>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <RevenueIcon fontSize="medium" />
              </div>
              <div>
                <Typography variant="caption" className="text-slate-400 block font-medium">
                  Total Revenue Earned
                </Typography>
                <Typography variant="h5" className="font-extrabold text-emerald-400">
                  {formatCurrency(totalRevenue)}
                </Typography>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <UsersIcon fontSize="medium" />
              </div>
              <div>
                <Typography variant="caption" className="text-slate-400 block font-medium">
                  Events Hosted
                </Typography>
                <Typography variant="h5" className="font-extrabold text-white">
                  {myHostedEvents.length} Events
                </Typography>
              </div>
            </div>
          </div>

          {/* Hosted Events List */}
          {myHostedEvents.length === 0 ? (
            <Paper elevation={1} sx={{ p: 6, textAlign: "center", borderRadius: 4 }}>
              <Typography variant="h6" className="font-bold text-white mb-2">
                No Hosted Events Yet
              </Typography>
              <Typography variant="body2" className="text-slate-400 mb-4">
                You haven't created any events under your account. Publish your first event now!
              </Typography>
              <Button variant="contained" onClick={() => setActiveTab("create")}>
                Create an Event
              </Button>
            </Paper>
          ) : (
            <div className="space-y-4">
              {myHostedEvents.map((evt: IEventItem) => {
                const totalCap = evt.totalSeats || 100;
                const left = evt.availableSeats || 0;
                const booked = totalCap - left;
                const percent = Math.min(100, Math.round((booked / totalCap) * 100));
                const revenue = booked * (evt.ticketPrice || 0);

                return (
                  <Card
                    key={evt.id}
                    className="rounded-3xl border border-white/10 bg-slate-900/80 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 items-center">
                      <div className="md:col-span-3 h-32 rounded-2xl overflow-hidden">
                        <img
                          src={evt.posterUrl}
                          alt={evt.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="md:col-span-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <Chip
                            label={evt.category}
                            size="small"
                            className="bg-purple-500/20 text-purple-300 font-bold text-[10px] uppercase"
                          />
                          <Typography variant="caption" className="text-slate-400">
                            {formatDate(evt.date)} • {evt.time}
                          </Typography>
                        </div>

                        <Typography variant="h6" className="font-extrabold text-white">
                          {evt.title}
                        </Typography>

                        <Typography variant="body2" className="text-slate-400 text-xs truncate">
                          📍 {evt.locationName}
                        </Typography>
                      </div>

                      <div className="md:col-span-4 p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-medium">Tickets Remaining:</span>
                          <span className={`font-extrabold ${left === 0 ? 'text-red-400' : left <= 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {left === 0 ? 'SOLD OUT (0 Left)' : `${left} / ${totalCap} Left`}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-medium">Tickets Sold:</span>
                          <span className="font-bold text-white">{booked} Passes ({percent}%)</span>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-medium">Total Revenue:</span>
                          <span className="font-extrabold text-emerald-400">{formatCurrency(revenue)}</span>
                        </div>

                        <LinearProgress
                          variant="determinate"
                          value={percent}
                          className="h-2 rounded-full bg-slate-800 [&>.MuiLinearProgress-bar]:bg-purple-500 mt-2"
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </Box>
  );
};
