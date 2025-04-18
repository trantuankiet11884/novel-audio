import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { FaCrown, FaEdit, FaPaypal } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileTabsProps {
  user: { username?: string; email?: string; removeads?: boolean };
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  userForm: { username: string; email: string; notifications: boolean };
  setUserForm: (value: {
    username: string;
    email: string;
    notifications: boolean;
  }) => void;
  handleSaveProfile: () => void;
}

export default function ProfileTabs({
  user,
  isEditing,
  setIsEditing,
  userForm,
  setUserForm,
  handleSaveProfile,
}: ProfileTabsProps) {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [hasCancelled, setHasCancelled] = useState(false);

  const handleCancelSubscription = async () => {
    setIsCancelling(true);

    setTimeout(() => {
      setIsCancelling(false);
      setHasCancelled(true);
      setIsCancelDialogOpen(false);

      toast.success("Subscription cancelled", {
        description:
          "Your subscription has been cancelled successfully. You'll have access until the end of your billing period.",
      });
    }, 1500);
  };

  return (
    <Tabs defaultValue="activity" className="w-full">
      <TabsList
        className="grid w-full grid-cols-3 mb-6"
        defaultValue="settings"
      >
        <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>

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

      <TabsContent value="settings">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
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
            </div>
            {isEditing && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
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
              {user.removeads === false
                ? "Manage your premium subscription"
                : "Upgrade to premium for an ad-free experience"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user.removeads === false ? (
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
                <Link href={`/pro-plan`}>
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
                <Link href={`/pro-plan`}>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-300 text-black hover:from-amber-600 hover:to-yellow-400">
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="billing">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Billing Management</CardTitle>
            <CardDescription>
              Manage your subscriptions and payment methods
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Current Subscription</h3>
              {user.removeads === false ? (
                <div className="bg-gradient-to-r from-amber-500/20 to-yellow-300/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaCrown className="h-5 w-5 text-yellow-600 mr-2" />
                      <div>
                        <h4 className="font-medium">Premium Membership</h4>
                        <p className="text-sm text-muted-foreground">
                          {hasCancelled
                            ? "Your subscription will end after the current billing period"
                            : "Your subscription is active"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        hasCancelled
                          ? "text-yellow-600 bg-yellow-50"
                          : "text-green-600 bg-green-50"
                      }
                    >
                      {hasCancelled ? "Cancelled" : "Active"}
                    </Badge>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        {hasCancelled ? "Access until:" : "Next billing date:"}
                      </span>
                      <span className="font-medium">October 15, 2024</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">$14.99</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg p-4">
                  <p className="text-muted-foreground">
                    You don't have any active subscriptions.
                  </p>
                  <Link href="/pro-plan">
                    <Button
                      size="sm"
                      className="mt-2 bg-gradient-to-r from-amber-500 to-yellow-300 text-black hover:from-amber-600 hover:to-yellow-400"
                    >
                      View Plans
                    </Button>
                  </Link>
                </div>
              )}

              {user.removeads === false && !hasCancelled && (
                <>
                  <h3 className="text-lg font-medium mt-6">Billing History</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            Sep 15, 2024
                          </td>
                          <td className="px-4 py-3 text-sm">
                            Premium Membership
                          </td>
                          <td className="px-4 py-3 text-sm">$14.99</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Paid
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            Aug 15, 2024
                          </td>
                          <td className="px-4 py-3 text-sm">
                            Premium Membership
                          </td>
                          <td className="px-4 py-3 text-sm">$14.99</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Paid
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {user.removeads === false && !hasCancelled && (
              <div className="flex flex-col gap-2 mt-6 pt-6 border-t border-gray-200">
                <Link href="/pro-plan">
                  <Button variant="outline" className="w-full">
                    Change Plan
                  </Button>
                </Link>
                <Dialog
                  open={isCancelDialogOpen}
                  onOpenChange={setIsCancelDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Cancel Subscription
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Cancel Premium Subscription</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to cancel your premium
                        subscription?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h4 className="font-medium text-sm">
                            What happens when you cancel:
                          </h4>
                          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                            <li>
                              • Your premium access will continue until October
                              15, 2024
                            </li>
                            <li>
                              • You will not be charged again after that date
                            </li>
                            <li>• You can resubscribe at any time</li>
                            <li>
                              • Ads will appear again after your subscription
                              ends
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="flex sm:justify-between flex-col sm:flex-row gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCancelDialogOpen(false)}
                      >
                        Keep My Subscription
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleCancelSubscription}
                        disabled={isCancelling}
                      >
                        {isCancelling ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Processing...
                          </>
                        ) : (
                          "Confirm Cancellation"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {user.removeads && hasCancelled && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-medium flex items-center">
                    <FaCrown className="h-4 w-4 text-amber-500 mr-2" />
                    Your subscription has been cancelled
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your premium access will end on October 15, 2024. Want to
                    continue enjoying ad-free reading?
                  </p>
                  <Link href="/pro-plan">
                    <Button
                      size="sm"
                      className="mt-3 bg-gradient-to-r from-amber-500 to-yellow-300 text-black hover:from-amber-600 hover:to-yellow-400"
                    >
                      Reactivate Subscription
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
