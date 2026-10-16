
import { useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../layouts/PageHeader";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Mail,
  AtSign,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";

const API_URL = "https://reviewqrapi.onrender.com/auth/staff/bulk-add/";

const emptyUser = () => ({ username: "", email: "" });

export default function TeamMembers() {
  const [users, setUsers] = useState([emptyUser()]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const { business } = useParams();

  const updateField = (index, field, value) => {
    setUsers((current) =>
      current.map((user, i) =>
        i === index ? { ...user, [field]: value } : user
      )
    );

    setSuccess(false);
    setError("");
  };

  const addRow = () => {
    setUsers((current) => [...current, emptyUser()]);
    setSuccess(false);
    setError("");
  };

  const removeRow = (index) => {
    setUsers((current) => current.filter((_, i) => i !== index));
    setSuccess(false);
    setError("");
  };

  const submitUsers = async (event) => {
    event.preventDefault();

    setSuccess(false);
    setError("");

    const cleanedUsers = users.map((user) => ({
      username: user.username.trim(),
      email: user.email.trim(),
    }));

    if (cleanedUsers.some((user) => !user.username || !user.email)) {
      setError("Please enter a username and email for every team member.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (cleanedUsers.some((user) => !emailPattern.test(user.email))) {
      setError("Please enter a valid email address for each team member.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Your session may have expired. Please log in again.");
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ users: cleanedUsers }),
      });

      if (!response.ok) {
        let message = "Unable to add team members. Please try again.";

        try {
          const body = await response.json();
          if (body.detail) message = body.detail;
          else if (body.error) message = body.error;
          else if (body.message) message = body.message;
        } catch {
          // Keep the fallback message if the response isn't JSON.
        }

        throw new Error(message);
      }

      setSuccess(true);
      setUsers([emptyUser()]);
    } catch (err) {
      console.error("Bulk add team members failed:", err);
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      <PageHeader businessName={business || "Your Business"} title="Team Members" />

      <main className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
            <Users size={15} />
            Team management
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
                Build your team
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Invite your staff to help manage reviews and keep your business
                running smoothly.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-600 shadow-sm">
              <Users size={16} className="text-indigo-500" />
              <span className="font-semibold text-gray-900">
                {users.length}
              </span>
              {users.length === 1 ? "member" : "members"}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          {/* Main form */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.35 }}
            className="min-w-0 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm"
          >
            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h2 className="font-semibold tracking-tight text-gray-900">
                    Add team members
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Enter the account details for each person.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={submitUsers} className="p-5 sm:p-6">
              <div className="mb-4 hidden grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_40px] gap-3 px-1 sm:grid">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Username
                </label>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Email address
                </label>
                <span />
              </div>

              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {users.map((user, index) => (
                    <motion.div
                      key={index}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-xl border border-gray-200 bg-gray-50/70 p-3 sm:border-0 sm:bg-transparent sm:p-0"
                    >
                      <div className="mb-3 flex items-center justify-between sm:hidden">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Member {index + 1}
                        </span>

                        {users.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRow(index)}
                            disabled={loading}
                            aria-label={`Remove member ${index + 1}`}
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_40px] sm:items-center">
                        <div className="relative min-w-0">
                          <AtSign
                            size={16}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="text"
                            name={`username-${index}`}
                            autoComplete="off"
                            placeholder="Username"
                            aria-label={`Username for member ${index + 1}`}
                            value={user.username}
                            onChange={(event) =>
                              updateField(index, "username", event.target.value)
                            }
                            disabled={loading}
                            required
                            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-gray-100"
                          />
                        </div>

                        <div className="relative min-w-0">
                          <Mail
                            size={16}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="email"
                            name={`email-${index}`}
                            autoComplete="off"
                            placeholder="name@company.com"
                            aria-label={`Email for member ${index + 1}`}
                            value={user.email}
                            onChange={(event) =>
                              updateField(index, "email", event.target.value)
                            }
                            disabled={loading}
                            required
                            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-gray-100"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeRow(index)}
                          disabled={loading || users.length === 1}
                          aria-label={`Remove member ${index + 1}`}
                          title="Remove member"
                          className="hidden h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30 sm:flex"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={addRow}
                disabled={loading}
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white px-4 text-sm font-medium text-gray-600 transition hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 disabled:opacity-50 sm:w-auto"
              >
                <Plus size={16} />
                Add another member
              </button>

              {/* Feedback */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    role="alert"
                    className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700"
                  >
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="status"
                    className="mt-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-700"
                  >
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Team members added</p>
                      <p className="mt-0.5 text-emerald-700/90">
                        Your request was successful.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 border-t border-gray-100 pt-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      Adding team members...
                    </>
                  ) : (
                    <>
                      <UserPlus size={17} />
                      Add {users.length === 1 ? "team member" : "team members"}
                      <ArrowRight size={17} className="ml-1" />
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-xs leading-5 text-gray-400">
                  Make sure each username and email address is correct before
                  submitting.
                </p>
              </div>
            </form>
          </motion.section>

          {/* Side information */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={21} />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                Team access
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Add the people who help manage your customer reviews and
                business activity.
              </p>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                <Mail size={18} />
              </div>

              <h3 className="mt-3 text-sm font-semibold text-indigo-950">
                Before you submit
              </h3>

              <ul className="mt-2 space-y-2 text-sm leading-5 text-indigo-900/75">
                <li className="flex gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
                  Use a unique username for each person.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
                  Double-check email addresses.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
                  Confirm permissions are handled by your backend.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
