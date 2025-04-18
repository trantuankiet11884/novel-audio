import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { FaHistory, FaSignOutAlt } from "react-icons/fa";

interface QuickActionsCardProps {
  signOut: () => void;
  user: { removeads?: boolean };
}

export default function QuickActionsCard({
  signOut,
  user,
}: QuickActionsCardProps) {
  return (
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
  );
}
