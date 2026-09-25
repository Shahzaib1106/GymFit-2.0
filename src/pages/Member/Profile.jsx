import { useState } from "react";
import {
  Camera,
  Check,
  Lock,
  Mail,
  Phone,
  Save,
  User,
} from "lucide-react";

import MemberSidebar from "../../components/MemberSidebar";
import MemberHeader from "../../components/MemberHeader";

export default function Profile() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const storedUser = JSON.parse(
    localStorage.getItem("gymfit_user") ||
      '{"name":"Member","email":"member@example.com"}'
  );

  const [form, setForm] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "",
    phone: "+92 300 1234567",
    age: "23",
    height: "178",
    weight: "74.2",
    goal: "Build Muscle",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setSaved(false);
  };

  const saveProfile = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "gymfit_user",
      JSON.stringify({
        name: form.name,
        email: form.email,
      })
    );

    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <MemberSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="lg:pl-72">
        <MemberHeader onMenu={() => setMobileOpen(true)} />

        <main className="mx-auto max-w-[1200px] px-5 py-7 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              Account
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Profile Settings
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Keep your personal and fitness information up to date.
            </p>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-[280px_1fr]">
            <section className="h-fit rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <div className="relative mx-auto w-fit">
                <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-orange-500 text-4xl font-black">
                  {form.name?.charAt(0)?.toUpperCase() || "M"}
                </div>

                <button className="absolute -bottom-2 -right-2 rounded-xl border-4 border-[#080808] bg-white p-2 text-black">
                  <Camera size={16} />
                </button>
              </div>

              <div className="mt-5 text-center">
                <h3 className="font-black">{form.name}</h3>

                <p className="mt-1 text-xs text-gray-600">
                  Pro Member
                </p>

                <div className="mt-5 rounded-xl bg-orange-500/10 px-4 py-3">
                  <p className="text-xs font-bold text-orange-500">
                    Member since
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    September 2026
                  </p>
                </div>
              </div>
            </section>

            <form
              onSubmit={saveProfile}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                    Personal information
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    Account details
                  </h3>
                </div>

                {saved && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-green-400">
                    <Check size={15} />
                    Saved
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
                />

                <Field
                  icon={Mail}
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />

                <Field
                  icon={Phone}
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />

                <Field
                  icon={User}
                  label="Age"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                />
              </div>

              <div className="my-8 h-px bg-white/10" />

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                  Fitness information
                </p>

                <div className="mt-5 grid gap-5 sm:grid-cols-3">
                  <Field
                    label="Height"
                    name="height"
                    suffix="cm"
                    value={form.height}
                    onChange={handleChange}
                  />

                  <Field
                    label="Weight"
                    name="weight"
                    suffix="kg"
                    value={form.weight}
                    onChange={handleChange}
                  />

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-gray-400">
                      Primary goal
                    </label>

                    <select
                      name="goal"
                      value={form.goal}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 text-sm outline-none focus:border-orange-500"
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

              <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-400 hover:bg-white/5 hover:text-white"
                >
                  <Lock size={16} />
                  Change Password
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold hover:bg-orange-600"
                >
                  <Save size={17} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
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
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-gray-400">
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
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full rounded-xl border border-white/10 bg-black py-4 text-sm outline-none transition focus:border-orange-500 ${
            Icon ? "pl-11" : "px-4"
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