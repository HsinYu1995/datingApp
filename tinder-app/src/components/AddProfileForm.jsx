import { useState } from "react";
import { useProfiles } from "../context/ProfileContext";

const COLORS = ["#FF6B9D", "#6B9DFF", "#9DFF6B", "#FFB86B", "#C96BFF", "#FF9F6B", "#6BFFD1"];

const INTEREST_OPTIONS = [
  "Hiking", "Coffee", "Music", "Travel", "Cooking", "Reading",
  "Gaming", "Yoga", "Art", "Photography", "Dancing", "Movies",
  "Fitness", "Food", "Nature", "Fashion",
];

const emptyForm = {
  name: "",
  age: "",
  location: "",
  bio: "",
  interests: [],
};

export default function AddProfileForm({ onCancel }) {
  const { addProfile } = useProfiles();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.age || form.age < 18 || form.age > 99) e.age = "Age must be 18–99";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.bio.trim()) e.bio = "Bio is required";
    if (form.interests.length === 0) e.interests = "Pick at least one interest";
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  }

  function toggleInterest(interest) {
    setForm((f) => {
      const has = f.interests.includes(interest);
      return {
        ...f,
        interests: has
          ? f.interests.filter((i) => i !== interest)
          : [...f.interests, interest],
      };
    });
    setErrors((er) => ({ ...er, interests: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) {
      setErrors(e2);
      return;
    }
    const initials = form.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    addProfile({
      id: Date.now(),
      name: form.name.trim(),
      age: Number(form.age),
      location: form.location.trim(),
      bio: form.bio.trim(),
      interests: form.interests,
      avatar: initials,
      color,
    });
    onCancel();
  }

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <h2 className="form-title">Add a New Profile</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div className="form-group form-group--small">
              <label>Age</label>
              <input
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                placeholder="Age"
                min={18}
                max={99}
              />
              {errors.age && <span className="error">{errors.age}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="City, State"
            />
            {errors.location && <span className="error">{errors.location}</span>}
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows={3}
            />
            {errors.bio && <span className="error">{errors.bio}</span>}
          </div>

          <div className="form-group">
            <label>Interests</label>
            <div className="interest-picker">
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  className={`interest-btn ${form.interests.includes(interest) ? "selected" : ""}`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
            {errors.interests && <span className="error">{errors.interests}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
