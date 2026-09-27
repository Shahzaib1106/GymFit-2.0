
import {
  BadgeCheck,
  Camera,
  Check,
  Lock,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import MemberSidebar from "../../components/MemberSidebar.jsx";
import MemberHeader from "../../components/MemberHeader.jsx";
import { useAuth } from "../../context/useAuth.jsx";
import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
} from "../../services/memberService.js";

const defaultForm = {
  name: "",
  email: "",
  phone: "",
  age: "",
  height: "",
  weight: "",
  goal: "Build Muscle",
};

export default function Profile() {
  const { user, token } = useAuth();

  const fileInputRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getMyProfile(token);
        const member = data.member || {};

        setForm({
          name: member.name || user?.name || "",
          email: member.email || user?.email || "",
          phone: member.phone || "",
          age: member.age || "",
          height: member.height || member.height_cm || "",
          weight: member.weight || member.weight_kg || "",
          goal:
            member.fitness_goal ||
            user?.fitness_goal ||
            "Build Muscle",
        });

        setProfileImage(
          member.profile_image ||
            user?.profile_image ||
            ""
        );
      } catch (err) {
        console.error("Profile loading failed:", err);

        setError(
          err.message || "Failed to load your profile."
        );

        setForm({
          ...defaultForm,
          name: user?.name || "",
          email: user?.email || "",
          goal:
            user?.fitness_goal || "Build Muscle",
        });

        setProfileImage(user?.profile_image || "");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setSaved(false);
    setError("");
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile image must be smaller than 5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfileImage(reader.result);
      setSaved(false);
      setError("");
    };

    reader.onerror = () => {
      setError("Failed to load the selected image.");
    };

    reader.readAsDataURL(file);
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    if (!token) {
      setError("Authentication required.");
      return;
    }

    setSaving(true);
    setSaved(false);
    setError("");

    try {
      await updateMyProfile(token, {
        name: form.name,
        phone: form.phone,
        age: form.age
          ? Number(form.age)
          : null,
        height: form.height
          ? Number(form.height)
          : null,
        weight: form.weight
          ? Number(form.weight)
          : null,
        fitness_goal: form.goal,
        profile_image: profileImage || null,
      });

      setSaved(true);
    } catch (err) {
      console.error("Profile save failed:", err);

      setError(
        err.message || "Failed to save your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((current) => ({
      ...current,
      [name]: value,
    }));

    setPasswordMessage("");
  };

  const savePassword = async (event) => {
    event.preventDefault();

    if (!token) {
      setPasswordMessage("Authentication required.");
      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      setPasswordMessage(
        "New passwords do not match."
      );
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage(
        "New password must be at least 6 characters."
      );
      return;
    }

    setPasswordSaving(true);
    setPasswordMessage("");

    try {
      await changeMyPassword(token, {
        currentPassword:
          passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordMessage(
        "Password changed successfully."
      );
    } catch (err) {
      console.error(
        "Password change failed:",
        err
      );

      setPasswordMessage(
        err.message || "Failed to change password."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const firstLetter =
    form.name?.trim()?.charAt(0)?.toUpperCase() || "M";

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(
        "en-US",
        {
          month: "long",
          year: "numeric",
        }
      )
    : "September 2026";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <MemberSidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <div className="lg:ml-64">
          <MemberHeader
            onMenuClick={() => setMobileOpen(true)}
          />

          <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-6">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />

              <p className="text-sm text-gray-500">
                Loading your profile...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <MemberSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="lg:ml-64">
        <MemberHeader
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="mx-auto max-w-[1400px] p-5 sm:p-6 lg:p-8">
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-orange-500/15 via-[#111111] to-[#080808] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              Account
            </p>

            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Profile Settings
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
              Manage your personal information and fitness
              profile from one place.
            </p>
          </section>

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.05] px-5 py-4">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-red-400"
              />

              <div>
                <p className="text-sm font-semibold text-red-400">
                  Profile Notice
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setError("")}
                className="ml-auto text-gray-600 hover:text-white"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="mt-7 grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="h-fit space-y-5">
              <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
                <div className="relative mx-auto w-fit">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-orange-500 text-4xl font-black text-black shadow-lg shadow-orange-500/10">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      firstLetter
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handlePhotoClick}
                    className="absolute -bottom-2 -right-2 rounded-xl border-4 border-[#080808] bg-white p-2 text-black transition hover:bg-orange-500"
                    aria-label="Change profile photo"
                    title="Change profile photo"
                  >
                    <Camera size={16} />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>

                <div className="mt-5 text-center">
                  <h3 className="truncate font-black">
                    {form.name || "Member"}
                  </h3>

                  <p className="mt-1 truncate text-xs text-gray-600">
                    {form.email || "Member account"}
                  </p>

                  <div className="mt-5 flex items-center justify-center gap-1.5 rounded-xl bg-orange-500/10 px-4 py-3">
                    <BadgeCheck
                      size={15}
                      className="text-orange-500"
                    />

                    <span className="text-xs font-bold text-orange-500">
                      Pro Member
                    </span>
                  </div>

                  <div className="mt-3 rounded-xl border border-white/5 bg-black/20 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-700">
                      Member since
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {memberSince}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-green-500/10 p-2.5 text-green-400">
                    <ShieldCheck size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-bold">
                      Account Security
                    </p>

                    <p className="mt-1 text-[10px] text-gray-600">
                      Your account is protected.
                    </p>
                  </div>
                </div>
              </section>
            </aside>

            <form
              onSubmit={saveProfile}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                    Personal Information
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    Account Details
                  </h3>

                  <p className="mt-1 text-xs text-gray-600">
                    Keep your account information accurate.
                  </p>
                </div>

                {saved && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-green-400">
                    <Check size={15} />
                    Changes saved
                  </span>
                )}
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <Field
                  icon={User}
                  label="Full name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                <Field
                  icon={Mail}
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled
                />

                <Field
                  icon={Phone}
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                />

                <Field
                  icon={User}
                  label="Age"
                  name="age"
                  type="number"
                  value={form.age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  placeholder="23"
                />
              </div>

              <div className="my-8 h-px bg-white/10" />

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                  Fitness Information
                </p>

                <h3 className="mt-2 text-xl font-black">
                  Body & Goals
                </h3>

                <div className="mt-5 grid gap-5 sm:grid-cols-3">
                  <Field
                    label="Height"
                    name="height"
                    type="number"
                    value={form.height}
                    onChange={handleChange}
                    suffix="cm"
                    min="1"
                    placeholder="178"
                  />

                  <Field
                    label="Weight"
                    name="weight"
                    type="number"
                    value={form.weight}
                    onChange={handleChange}
                    suffix="kg"
                    min="1"
                    step="0.1"
                    placeholder="74.2"
                  />

                  <div>
                    <label
                      htmlFor="goal"
                      className="mb-2 block text-xs font-semibold text-gray-400"
                    >
                      Primary goal
                    </label>

                    <select
                      id="goal"
                      name="goal"
                      value={form.goal}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 text-sm text-white outline-none transition focus:border-orange-500"
                    >
                      <option>Build Muscle</option>
                      <option>Lose Weight</option>
                      <option>Improve Fitness</option>
                      <option>Increase Strength</option>
                      <option>Maintain Weight</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="my-8 h-px bg-white/10" />

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                  Account Security
                </p>

                <div className="mt-5 flex flex-col justify-between gap-4 rounded-xl border border-white/5 bg-black/20 p-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-orange-500/10 p-2.5 text-orange-500">
                      <Lock size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Password
                      </p>

                      <p className="mt-1 text-xs text-gray-600">
                        Keep your account password secure.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword(true);
                      setPasswordMessage("");
                    }}
                    className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-gray-400 transition hover:border-orange-500/30 hover:text-orange-500"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
                <p className="text-xs text-gray-700">
                  Your profile information helps personalize
                  your GymFit experience.
                </p>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {showPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm">
          <form
            onSubmit={savePassword}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0c0c] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
                  Security
                </p>

                <h3 className="mt-2 text-xl font-black">
                  Change Password
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowPassword(false)}
                className="rounded-xl border border-white/10 p-2 text-gray-500 transition hover:text-white"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <PasswordField
                label="Current Password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
              />

              <PasswordField
                label="New Password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
              />

              <PasswordField
                label="Confirm New Password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
              />
            </div>

            {passwordMessage && (
              <p
                className={`mt-4 rounded-xl px-4 py-3 text-xs ${
                  passwordMessage.includes(
                    "successfully"
                  )
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {passwordMessage}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowPassword(false)}
                className="flex-1 rounded-xl border border-white/10 px-5 py-3 text-xs font-bold text-gray-400 transition hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={passwordSaving}
                className="flex-1 rounded-xl bg-orange-500 px-5 py-3 text-xs font-black text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {passwordSaving
                  ? "Updating..."
                  : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  suffix,
  placeholder,
  disabled = false,
  required = false,
  min,
  max,
  step,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-semibold text-gray-400"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
          />
        )}

        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          step={step}
          className={`w-full rounded-xl border border-white/10 bg-black py-4 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50 ${
            Icon ? "pl-11" : "pl-4"
          } ${suffix ? "pr-14" : "pr-4"}`}
        />

        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-600">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function PasswordField({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-semibold text-gray-400"
      >
        {label}
      </label>

      <input
        id={name}
        type="password"
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-orange-500"
      />
    </div>
  );
}
