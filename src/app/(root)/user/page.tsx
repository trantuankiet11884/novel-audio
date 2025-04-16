"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCrown, FaEdit, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { toast } from "sonner";

export default function UserProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    notifications: true,
  });

  useEffect(() => {
    if (user) {
      setUserForm({
        username: user.username || "",
        email: user.email || "",
        notifications: true,
      });
    }
  }, [user]);

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  const handleSaveProfile = () => {
    toast("Profile updated", {
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column - User info */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <div className="flex flex-col items-center justify-center">
                <Avatar className="h-24 w-24 mb-3">
                  <AvatarImage
                    src="/placeholders/user-avatar.png"
                    alt={user.username || user.email || "User"}
                  />
                  <AvatarFallback className="text-xl">
                    {(user.username || user.email || "User")
                      .substring(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-center">
                  {user.username || user.email || "User"}
                </CardTitle>
                {user.removeads && (
                  <Badge className="mt-2 bg-gradient-to-r from-amber-500 to-yellow-300 text-black">
                    <FaCrown className="mr-1 h-3 w-3" /> Premium Member
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Member since
                  </span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Listening status
                  </span>
                  <span className="font-medium">Active</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pt-2">
              {!user.removeads && (
                <Link href={`/vip`}>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-300 text-black hover:from-amber-600 hover:to-yellow-400">
                    <FaCrown className="mr-2 h-4 w-4" /> Upgrade to Premium
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/history`}>
                <Button variant="outline" className="w-full justify-start">
                  <FaHistory className="mr-2 h-4 w-4" /> Listening History
                </Button>
              </Link>
              <Separator className="my-2" />
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={signOut}
              >
                <FaSignOutAlt className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Tabs */}
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-4">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Recent Reading</CardTitle>
                  <CardDescription>Novels you've recently read</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You haven't read any novels yet.</p>
                    <Link href={`/search`}>
                      <Button variant="link">Discover novels</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookmarks Tab */}
            <TabsContent value="bookmarks" className="space-y-4">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Your Bookmarks</CardTitle>
                  <CardDescription>Novels you've saved</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You haven't bookmarked any novels yet.</p>
                    <Link href={`/search`}>
                      <Button variant="link">Find novels to bookmark</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                      Manage your account details
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <FaEdit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={userForm.username}
                        onChange={(e) =>
                          setUserForm({ ...userForm, username: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userForm.email}
                        onChange={(e) =>
                          setUserForm({ ...userForm, email: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates on new chapters from your bookmarked
                          novels
                        </p>
                      </div>
                      <Switch
                        id="notifications"
                        checked={userForm.notifications}
                        onCheckedChange={(checked) =>
                          setUserForm({ ...userForm, notifications: checked })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile}>Save Changes</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-md mt-6">
                <CardHeader>
                  <CardTitle>Premium Membership</CardTitle>
                  <CardDescription>
                    {user.removeads
                      ? "Manage your premium subscription"
                      : "Upgrade to premium for an ad-free experience"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user.removeads ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-amber-500/20 to-yellow-300/20 p-4 rounded-lg">
                        <div className="flex items-center">
                          <FaCrown className="h-5 w-5 text-yellow-600 mr-2" />
                          <h3 className="font-medium">Premium Member</h3>
                        </div>
                        <p className="text-sm mt-2">
                          Your premium membership is active.
                        </p>
                      </div>
                      <Link href={`/vip`}>
                        <Button variant="outline" className="w-full">
                          Manage Subscription
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Monthly Premium</h3>
                            <p className="text-sm text-muted-foreground">
                              Ad-free reading and listening
                            </p>
                          </div>
                          <p className="font-bold">$14,99/mo</p>
                        </div>
                      </div>

                      <Link href={`/vip`}>
                        <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-300 text-black hover:from-amber-600 hover:to-yellow-400">
                          Upgrade Now
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
