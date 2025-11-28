import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio,
  Rating,
  Slider,
  Checkbox,
  Button,
  Typography,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";

const courses = ["DSA", "Operating Systems", "DBMS", "Networks"];
const instructors = ["Dr. Sharma", "Prof. Mehta", "Ms. Kapoor", "Mr. Rao"];
const workedOptions = ["Lectures", "Labs", "Assignments", "Projects", "Others"];

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    instructor: "",
    recommend: "",
    rating: 0,
    pace: 5,
    workedWell: [],
    comments: "",
    consent: false,
  });

  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  // ---------------------- VALIDATION ----------------------
  const validate = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value) error = "Required";
        else if (value.length < 2) error = "Minimum 2 characters";
        break;
      case "email":
        if (!value) error = "Required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email format";
        break;
      case "course":
        if (!value) error = "Select a course";
        break;
      case "instructor":
        if (!value) error = "Required";
        break;
      case "recommend":
        if (!value) error = "Select Yes or No";
        break;
      case "rating":
        if (value < 1) error = "Give a rating";
        break;
      case "pace":
        if (value === null) error = "Required";
        break;
      case "comments":
        if (!value) error = "Required";
        else if (value.length < 50) error = "Minimum 50 characters";
        break;
      case "consent":
        if (!value) error = "Consent required";
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // live validation
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  // ---------------------- PROGRESS ----------------------
  useEffect(() => {
    const requiredFields = [
      "name",
      "email",
      "course",
      "instructor",
      "recommend",
      "rating",
      "pace",
      "comments",
      "consent",
    ];

    let filled = 0;
    requiredFields.forEach((f) => {
      if (formData[f] && !validate(f, formData[f])) filled++;
    });

    setProgress((filled / requiredFields.length) * 100);
  }, [formData]);

  // ---------------------- SUBMIT ----------------------
  const isFormValid = Object.values(errors).every((e) => !e) &&
    formData.name &&
    formData.email &&
    formData.course &&
    formData.instructor &&
    formData.recommend &&
    formData.rating &&
    formData.comments.length >= 50 &&
    formData.consent;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) setOpenDialog(true);
  };

  const handleConfirm = () => {
    const existing = JSON.parse(localStorage.getItem("feedback_submissions")) || [];
    existing.push(formData);
    localStorage.setItem("feedback_submissions", JSON.stringify(existing));

    setSnackbar(true);
    setOpenDialog(false);
    // reset form
    setFormData({
      name: "",
      email: "",
      course: "",
      instructor: "",
      recommend: "",
      rating: 0,
      pace: 5,
      workedWell: [],
      comments: "",
      consent: false,
    });
    setErrors({});
  };

  const handleCancel = () => setOpenDialog(false);

  // ---------------------- UI ----------------------
  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: 3,
        p: 4,
        maxWidth: 700,
        mx: "auto",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Student Course Feedback
      </Typography>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ mb: 3, height: 10, borderRadius: 5 }}
      />

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* 1. Student Name */}
          <TextField
            label="Student Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            required
            fullWidth
          />

          {/* 2. Email */}
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
            fullWidth
          />

          {/* 3. Course */}
          <FormControl fullWidth error={!!errors.course}>
            <InputLabel>Course</InputLabel>
            <Select
              value={formData.course}
              label="Course"
              onChange={(e) => handleChange("course", e.target.value)}
              required
            >
              {courses.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.course}</FormHelperText>
          </FormControl>

          {/* 4. Instructor */}
          <Autocomplete
            freeSolo
            options={instructors}
            value={formData.instructor}
            onInputChange={(e, value) => handleChange("instructor", value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Instructor"
                error={!!errors.instructor}
                helperText={errors.instructor}
              />
            )}
          />

          {/* 5. Recommend */}
          <FormControl error={!!errors.recommend}>
            <Typography>Would you recommend this course?</Typography>
            <RadioGroup
              row
              value={formData.recommend}
              onChange={(e) => handleChange("recommend", e.target.value)}
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
            <FormHelperText>{errors.recommend}</FormHelperText>
          </FormControl>

          {/* 6. Rating */}
          <Box>
            <Typography>Overall Rating:</Typography>
            <Rating
              value={formData.rating}
              onChange={(e, value) => handleChange("rating", value)}
            />
            {errors.rating && (
              <FormHelperText error>{errors.rating}</FormHelperText>
            )}
          </Box>

          {/* 7. Pace */}
          <Box>
            <Typography>Pace of the Course:</Typography>
            <Slider
              value={formData.pace}
              onChange={(e, value) => handleChange("pace", value)}
              valueLabelDisplay="on"
              min={0}
              max={10}
            />
          </Box>

          {/* 8. Worked well */}
          <Box>
            <Typography>What worked well?</Typography>
            <Stack direction="row" flexWrap="wrap">
              {workedOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={formData.workedWell.includes(option)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        let newList = [...formData.workedWell];
                        if (checked) newList.push(option);
                        else newList = newList.filter((o) => o !== option);
                        handleChange("workedWell", newList);
                      }}
                    />
                  }
                  label={option}
                />
              ))}
            </Stack>
          </Box>

          {/* 9. Comments */}
          <TextField
            label="Comments"
            multiline
            minRows={3}
            value={formData.comments}
            onChange={(e) => handleChange("comments", e.target.value)}
            error={!!errors.comments}
            helperText={`${errors.comments ? errors.comments + " " : ""}${
              formData.comments.length
            } / 50`}
            required
            fullWidth
          />

          {/* 10. Consent */}
          <FormControl error={!!errors.consent}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.consent}
                  onChange={(e) => handleChange("consent", e.target.checked)}
                />
              }
              label="I agree to share this feedback with the instructor"
            />
            <FormHelperText>{errors.consent}</FormHelperText>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isFormValid}
          >
            Submit
          </Button>
        </Stack>
      </form>

      {/* -------- Preview Dialog -------- */}
      <Dialog open={openDialog} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>Confirm Your Feedback</DialogTitle>
        <DialogContent dividers>
  <Typography><strong>Student Name:</strong> {formData.name}</Typography>
  <Typography><strong>Email:</strong> {formData.email}</Typography>
  <Typography><strong>Course:</strong> {formData.course}</Typography>
  <Typography><strong>Instructor:</strong> {formData.instructor}</Typography>
  <Typography><strong>Recommend:</strong> {formData.recommend}</Typography>
  <Typography><strong>Overall Rating:</strong> {formData.rating} / 5</Typography>
  <Typography><strong>Pace of Course:</strong> {formData.pace} / 10</Typography>
  <Typography><strong>What Worked Well:</strong> {formData.workedWell.join(", ")}</Typography>
  <Typography sx={{ whiteSpace: "pre-wrap" }}>
    <strong>Comments:</strong> {formData.comments}
  </Typography>
  <Typography>
    <strong>Consent:</strong>{" "}
    {formData.consent ? "Given ✅" : "Not Given ❌"}
  </Typography>
</DialogContent>

      </Dialog>

      {/* -------- Success Snackbar -------- */}
      <Snackbar
        open={snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(false)}
      >
        <Alert severity="success" variant="filled">
          Feedback submitted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
