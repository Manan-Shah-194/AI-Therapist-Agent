import { Bot, Shield, Brain, Activity, Wifi, LineChart, Fingerprint, Heart, ShieldCheckIcon, Receipt, Users } from 'lucide-react';
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: <Bot className="w-10 h-10 text-primary" />,
    title: "Listener That Truly Remembers You",
    description:
      "You'll never have to repeat yourself. The AI remembers your entire conversation, from the very first message. This allows you to build on previous discussions and receive support that is genuinely aware of your personal journey and context.",
  },
  {
    icon: <Brain className="w-10 h-10 text-primary" />,
    title: " Receive Thoughtful, Empathetic Support",
    description:
      "Get responses that are more than just text. Powered by Google's advanced AI, the agent is trained to understand your feelings and provide guidance that is helpful, empathetic, and sounds natural, helping you feel truly heard and understood.",
  },
  {
    icon: <Activity className="w-10 h-10 text-primary" />,
    title: "Pick Up Your Conversation, Anytime, Anywhere",
    description:
      "Life is busy, and your support should be flexible. You can start a conversation on your laptop in the morning and seamlessly continue it on your phone in the evening. Your chat history is always saved, waiting for you to pick up right where you left off.",
  },

  {
    icon: <ShieldCheckIcon className="w-10 h-10 text-primary" />,
    title: " Confidential and Secure Space",
    description:
    "Your conversations are private. You get your own secure account, ensuring that your thoughts and feelings are for your eyes only. ",
  },

  {
    icon: <Users className="w-10 h-10 text-primary" />,
    title: "Log Your Moods and Wellness Activities",
    description:
    "Take an active role in your mental wellness. The agent allows you to easily log how you're feeling and track positive activities you've completed. This helps create a holistic view of your well-being that you and the AI can work with..",
  },

  {
    icon: <Wifi className="w-10 h-10 text-primary" />,
    title: "Access Your Support on Any Device",
    description:
      "Whether you prefer your computer, tablet, or phone, your AI therapist will be there. The experience is designed to be consistent and accessible on any device, ensuring you can get the support you need, whenever you need it.",
  },
  {
    icon: <LineChart className="w-10 h-10 text-primary" />,
    title: " See Your Progress by Tracking Your Journey",
    description:
      "This is more than just a chat. The agent is designed to help you see patterns over time. By saving your conversations and moods (a future feature this backend supports!), it can help you gain valuable insights into your own mental wellness journey.",
  },
  {
    icon: <Heart className="w-10 h-10 text-primary" />,
    title: "Enjoy a Smooth, Real-Time Chat Experience",
    description:
      "The conversation flows naturally without lag or long waits. The chat is designed to be fast and responsive, making it feel like you're talking to a real person in real-time, ensuring a comfortable and frustration-free experience.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold mb-6 text-center">Platform Features</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-center mb-16">
        Discover how our AI-powered platform revolutionizes mental health support with cutting-edge technology and unwavering privacy protection.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 h-full hover:shadow-lg transition-shadow duration-300 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
