"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const GENDER_OPTIONS = ["Male", "Female", "Prefer not to say", "Other"];
const REFERRAL_OPTIONS = ["Social Media", "Friend / Referral", "Google Search", "Event", "Other"];

export default function OnboardingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [userId, setUserId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [educationBackground, setEducationBackground] = useState("");
  const [occupation, setOccupation] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [motivation, setMotivation] = useState("");

  useEffect(() => {
    const check = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/auth/login?next=${encodeURIComponent("/onboarding")}`);
        return;
      }
      setUserId(user.id);

      const { data: profile } = await supabase.from("profiles").select("profile_completed, full_name, phone").eq("id", user.id).maybeSingle();
      if (profile?.profile_completed) {
        router.push("/student-dashboard");
        return;
      }
      if (profile?.full_name) setFullName(profile.full_name);
      if (profile?.phone) setPhone(profile.phone);
      setChecking(false);
    };
    check();
  }, [router]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setError("Full name, phone, and address are required.");
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      let avatarUrl: string | null = null;

      if (avatarFile) {
        const uploadForm = new FormData();
        uploadForm.append("file", avatarFile);
        const uploadRes = await fetch("/api/upload/avatar", { method: "POST", body: uploadForm });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadJson.error || "Photo upload failed");
        avatarUrl = uploadJson.url;
      }

      const { error: updateErr } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          phone: phone.trim(),
          ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
          date_of_birth: dateOfBirth || null,
          gender: gender || null,
          address: address.trim(),
          education_background: educationBackground.trim() || null,
          occupation: occupation.trim() || null,
          emergency_contact_name: emergencyContactName.trim() || null,
          emergency_contact_phone: emergencyContactPhone.trim() || null,
          referral_source: referralSource || null,
          motivation: motivation.trim() || null,
          profile_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateErr) throw updateErr;

      router.push("/student-dashboard");
    } catch (err) {
      console.error("Failed to save admission profile:", err);
      setError(err instanceof Error ? err.message : "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            <span className="material-symbols-outlined text-sm">verified</span>
            Admission Confirmed
          </div>
          <h1 className="font-syne text-2xl font-bold text-on-surface mb-2">Complete Your Admission Profile</h1>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto">
            One last step before you start — this is the official record for your enrollment at Khodz Academy.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 space-y-8 border border-white/10">
          {/* Profile picture */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full bg-surface-container-high border-2 border-dashed border-white/20 hover:border-primary transition-colors flex items-center justify-center overflow-hidden cursor-pointer group"
            >
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-primary transition-colors">add_a_photo</span>
              )}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-primary font-bold hover:underline cursor-pointer">
              {avatarPreview ? "Change photo" : "Upload profile picture"}
            </button>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-white/5 pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full Name" required value={fullName} onChange={setFullName} placeholder="Kofi Atta" />
              <Field label="Phone Number" required value={phone} onChange={setPhone} placeholder="233240000000" type="tel" />
              <Field label="Date of Birth" value={dateOfBirth} onChange={setDateOfBirth} type="date" />
              <SelectField label="Gender" value={gender} onChange={setGender} options={GENDER_OPTIONS} />
            </div>
            <Field label="Address / Location" required value={address} onChange={setAddress} placeholder="City, Region, Country" />
          </div>

          {/* Background */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-white/5 pb-2">Background</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Education Background" value={educationBackground} onChange={setEducationBackground} placeholder="e.g. BSc Computer Science" />
              <Field label="Occupation" value={occupation} onChange={setOccupation} placeholder="e.g. Student, Freelancer" />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-white/5 pb-2">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Contact Name" value={emergencyContactName} onChange={setEmergencyContactName} placeholder="Full name" />
              <Field label="Contact Phone" value={emergencyContactPhone} onChange={setEmergencyContactPhone} placeholder="233240000000" type="tel" />
            </div>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-white/5 pb-2">Tell Us More</h3>
            <SelectField label="How did you hear about Khodz Academy?" value={referralSource} onChange={setReferralSource} options={REFERRAL_OPTIONS} />
            <div className="space-y-1.5 flex flex-col">
              <label className="text-on-surface-variant px-1 text-xs font-medium">Why do you want to join this program?</label>
              <textarea
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                rows={3}
                placeholder="Tell us a bit about your goals..."
                className="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-outline/50 outline-none focus:border-primary transition-all resize-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-error flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="primary-glow w-full bg-primary text-black font-syne font-bold py-3.5 rounded-lg hover:scale-[1.01] active:scale-95 transition-all cursor-pointer text-sm uppercase tracking-wider disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                Saving…
              </>
            ) : (
              "Complete Enrollment"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5 flex flex-col">
      <label className="text-on-surface-variant px-1 text-xs font-medium">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-outline/50 outline-none focus:border-primary transition-all"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-1.5 flex flex-col">
      <label className="text-on-surface-variant px-1 text-xs font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 text-sm text-on-surface outline-none focus:border-primary transition-all"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
