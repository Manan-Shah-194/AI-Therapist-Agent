"use client";

import { useEffect, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MessageSquare, User } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    sessionsCompleted: 0,
    upcomingSessions: 0,
    messagesExchanged: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user) {
      // Fetch user stats from backend
      fetchUserStats();
    }
  }, [status, session, router]);

  const fetchUserStats = async () => {
    try {
      // This would be replaced with an actual API call
      // For now, using mock data
      setUserStats({
        sessionsCompleted: 12,
        upcomingSessions: 2,
        messagesExchanged: 145,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/30 py-10">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Welcome, {session?.user?.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's an overview of your therapy journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            icon={<Calendar className="w-10 h-10 text-primary" />}
            title="Sessions Completed"
            value={userStats.sessionsCompleted}
            description="Total therapy sessions"
          />
          <StatCard
            icon={<Clock className="w-10 h-10 text-primary" />}
            title="Upcoming Sessions"
            value={userStats.upcomingSessions}
            description="Scheduled for this week"
          />
          <StatCard
            icon={<MessageSquare className="w-10 h-10 text-primary" />}
            title="Messages"
            value={userStats.messagesExchanged}
            description="Total interactions"
          />
        </div>

        {/* Recent Activity */}
        <Card className="p-6 mb-8 border border-primary/10 bg-card/90 backdrop-blur-lg rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <ActivityItem
              title="Therapy Session"
              description="Completed a 30-minute session"
              time="2 days ago"
            />
            <ActivityItem
              title="Goal Updated"
              description="Added a new wellness goal"
              time="5 days ago"
            />
            <ActivityItem
              title="Journal Entry"
              description="Wrote about your progress"
              time="1 week ago"
            />
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border border-primary/10 bg-card/90 backdrop-blur-lg rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Start a Session</h2>
            <p className="text-muted-foreground mb-4">
              Connect with your AI therapist for guidance and support.
            </p>
            <Button className="w-full bg-gradient-to-r from-primary to-primary/80 shadow-md hover:from-primary/80 hover:to-primary">
              Begin Therapy Session
            </Button>
          </Card>
          <Card className="p-6 border border-primary/10 bg-card/90 backdrop-blur-lg rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Your Profile</h2>
            <p className="text-muted-foreground mb-4">
              Update your information and preferences.
            </p>
            <Button
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10"
            >
              View Profile
            </Button>
          </Card>
        </div>
      </Container>
    </div>
  );
}

// Define interfaces for component props
interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: number;
  description: string;
}

// Stat Card Component
function StatCard({ icon, title, value, description }: StatCardProps) {
  return (
    <Card className="p-6 border border-primary/10 bg-card/90 backdrop-blur-lg rounded-xl shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div>{icon}</div>
      </div>
    </Card>
  );
}

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
}

// Activity Item Component
function ActivityItem({ title, description, time }: ActivityItemProps) {
  return (
    <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-primary/5 transition-colors">
      <div className="bg-primary/10 p-2 rounded-full">
        <User className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1">
        <h4 className="text-base font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="text-xs text-muted-foreground">{time}</div>
    </div>
  );
}