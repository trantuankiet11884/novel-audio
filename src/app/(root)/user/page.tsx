"use client";

import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UserInfoCard from "@/components/user/user-info-card";
import QuickActionsCard from "@/components/user/quick-actions-card";
import ProfileTabs from "@/components/user/profile-tab";

export default function UserProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    notifications: true,
  });
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (user) {
      setUserForm({
        username: user.username || "",
        email: user.email || "",
        notifications: true,
      });
      setIsCheckingAuth(false);
    } else {
      router.push("/sign-in");
    }
  }, [user, router]);

  const handleSaveProfile = () => {
    toast("Profile updated", {
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  if (isCheckingAuth) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 space-y-6">
          <UserInfoCard user={user} />
          <QuickActionsCard signOut={signOut} user={user} />
        </div>
        <div className="w-full md:w-2/3">
          <ProfileTabs
            user={user}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            userForm={userForm}
            setUserForm={setUserForm}
            handleSaveProfile={handleSaveProfile}
          />
        </div>
      </div>
    </div>
  );
}
