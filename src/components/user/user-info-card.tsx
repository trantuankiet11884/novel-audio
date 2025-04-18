import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { FaCrown } from "react-icons/fa";

interface UserInfoCardProps {
  user: { username?: string; email?: string; removeads?: boolean };
}

export default function UserInfoCard({ user }: UserInfoCardProps) {
  return (
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
            <span className="text-sm text-muted-foreground">Member since</span>
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
          <Link href={`/pro-plan`}>
            <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-300 text-black hover:from-amber-600 hover:to-yellow-400">
              <FaCrown className="mr-2 h-4 w-4" /> Upgrade to Premium
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
