import React, { useState } from "react";
import { useApp } from "../../hooks/useApp";
import { EventCategory } from "../../types";
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
} from "@mui/material";
import {
  AutoAwesome as SparklesIcon,
  AttachMoney as DollarIcon,
  Group as UsersIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import { MESSAGES, HOST_CATEGORIES, PRESET_POSTERS } from "../../constants";
import toast from "react-hot-toast";

export const HostEventForm: React.FC = () => {
  const { addEvent, setActiveNav, user, setIsAuthModalOpen, setIsVerificationModalOpen } = useApp();

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
        setActiveNav("dashboard");
      }, 1500);
    } catch (err: any) {
      toast.error(MESSAGES.TOAST.EVENT_PUBLISH_FAILED(err?.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", py: 2 }}>
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
          {MESSAGES.HOST.HEADER_TITLE}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {MESSAGES.HOST.HEADER_SUBTITLE}
        </Typography>
      </Box>

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
                label="Ticket Price ($ set by host) *"
                placeholder="0 for FREE ticket"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DollarIcon sx={{ color: "success.main" }} />
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
                label="Total Capacity *"
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
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
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
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
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
    </Box>
  );
};
