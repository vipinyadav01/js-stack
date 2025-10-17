import { type Sponsor, type TwitterTweet } from "./sponsors-api";

// Demo data that will only show on localhost
export const isLocalhost = () => {
  if (typeof window === "undefined") return false;
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
};

export const demoSponsors: Sponsor[] = [
  {
    id: "demo-1",
    name: "Alex Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    amount: 100,
    tier: "Gold",
    duration: "6 months",
    frequency: "monthly",
    startDate: "2024-12-01",
    website: "https://alexjohnson.dev",
    github: "https://github.com/alexjohnson",
    isActive: true,
  },
  {
    id: "demo-2",
    name: "Sarah Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    amount: 50,
    tier: "Silver",
    duration: "3 months",
    frequency: "monthly",
    startDate: "2024-11-15",
    website: "https://sarahchen.com",
    github: "https://github.com/sarahchen",
    isActive: true,
  },
  {
    id: "demo-3",
    name: "Mike Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    amount: 25,
    tier: "Bronze",
    duration: "2 months",
    frequency: "monthly",
    startDate: "2024-12-10",
    github: "https://github.com/mikerodriguez",
    isActive: true,
  },
  {
    id: "demo-4",
    name: "Emma Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    amount: 75,
    tier: "Silver",
    duration: "4 months",
    frequency: "monthly",
    startDate: "2024-10-20",
    website: "https://emmawilson.dev",
    github: "https://github.com/emmawilson",
    isActive: true,
  },
  {
    id: "demo-5",
    name: "David Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    amount: 200,
    tier: "Gold",
    duration: "8 months",
    frequency: "monthly",
    startDate: "2024-09-01",
    website: "https://davidkim.io",
    github: "https://github.com/davidkim",
    isActive: true,
  },
  {
    id: "demo-6",
    name: "Lisa Thompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
    amount: 30,
    tier: "Bronze",
    duration: "1 month",
    frequency: "monthly",
    startDate: "2024-12-15",
    github: "https://github.com/lisathompson",
    isActive: true,
  },
];

export const demoTweets: TwitterTweet[] = [
  {
    id: "demo-tweet-1",
    text: "Just discovered @js-stack and it's absolutely amazing! 🚀 The CLI tool makes setting up full-stack projects so much easier. Highly recommend it to all developers! #JavaScript #FullStack #DevTools",
    user: {
      name: "Alex Johnson",
      username: "alexdev",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      verified: true,
    },
    engagement: {
      likes: 42,
      retweets: 18,
      replies: 7,
    },
    timestamp: "2h",
    url: "https://twitter.com/alexdev/status/1234567890",
  },
  {
    id: "demo-tweet-2",
    text: "Spent the weekend building a new project with @js-stack and I'm blown away by how fast I can get a production-ready app up and running. The template system is incredible! 💯",
    user: {
      name: "Sarah Chen",
      username: "sarahcodes",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      verified: false,
    },
    engagement: {
      likes: 28,
      retweets: 12,
      replies: 4,
    },
    timestamp: "4h",
    url: "https://twitter.com/sarahcodes/status/1234567891",
  },
  {
    id: "demo-tweet-3",
    text: "Finally found the perfect tool for rapid prototyping! @js-stack has everything I need - React, Node.js, databases, auth, testing. It's like having a senior dev as your pair programming partner 🤝",
    user: {
      name: "Mike Rodriguez",
      username: "mikerodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      verified: false,
    },
    engagement: {
      likes: 35,
      retweets: 15,
      replies: 6,
    },
    timestamp: "6h",
    url: "https://twitter.com/mikerodriguez/status/1234567892",
  },
  {
    id: "demo-tweet-4",
    text: "The documentation for @js-stack is top-notch! Clear examples, best practices, and the community is super helpful. This is how open source should be done 👏",
    user: {
      name: "Emma Wilson",
      username: "emmawilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      verified: true,
    },
    engagement: {
      likes: 51,
      retweets: 22,
      replies: 9,
    },
    timestamp: "8h",
    url: "https://twitter.com/emmawilson/status/1234567893",
  },
  {
    id: "demo-tweet-5",
    text: "Used @js-stack for a client project and they were impressed with how quickly we delivered. The built-in TypeScript support and testing setup saved us hours! 🎯",
    user: {
      name: "David Kim",
      username: "davidkimdev",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      verified: true,
    },
    engagement: {
      likes: 38,
      retweets: 16,
      replies: 5,
    },
    timestamp: "12h",
    url: "https://twitter.com/davidkimdev/status/1234567894",
  },
  {
    id: "demo-tweet-6",
    text: "The CLI experience with @js-stack is so smooth! Interactive prompts, smart defaults, and it handles all the boring setup stuff. More time coding, less time configuring 🛠️",
    user: {
      name: "Lisa Thompson",
      username: "lisathompson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
      verified: false,
    },
    engagement: {
      likes: 29,
      retweets: 11,
      replies: 3,
    },
    timestamp: "1d",
    url: "https://twitter.com/lisathompson/status/1234567895",
  },
  {
    id: "demo-tweet-7",
    text: "Just contributed to @js-stack and the maintainers are incredibly responsive! Great project, great community. Keep up the amazing work! 🙌",
    user: {
      name: "Chris Anderson",
      username: "chrisanderson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chris",
      verified: false,
    },
    engagement: {
      likes: 33,
      retweets: 14,
      replies: 8,
    },
    timestamp: "2d",
    url: "https://twitter.com/chrisanderson/status/1234567896",
  },
  {
    id: "demo-tweet-8",
    text: "The database integration in @js-stack is chef's kiss 👌 Prisma, Mongoose, TypeORM - all with proper TypeScript types. No more manual setup headaches!",
    user: {
      name: "Maria Garcia",
      username: "mariagarcia",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
      verified: true,
    },
    engagement: {
      likes: 44,
      retweets: 19,
      replies: 7,
    },
    timestamp: "3d",
    url: "https://twitter.com/mariagarcia/status/1234567897",
  },
];
