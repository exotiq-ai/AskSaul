export type CallStoryData = {
  heading: string;
  caller: { number: string; place: string };
  steps: { time: string; title: string; body: string }[];
  transcript: { from: "saul" | "caller"; text: string; at: number }[];
  lead: [string, string, boolean?][];
  sms: string;
  booked: string;
};

export const HVAC_STORY: CallStoryData = {
  heading: "The call you would have missed.",
  caller: { number: "(720) 555-0144", place: "Longmont, CO" },
  steps: [
    {
      time: "8:43 PM",
      title: "A furnace dies in Longmont.",
      body: "Your crew is home for the night. Normally this call hits voicemail, and the homeowner dials the next shop on Google.",
    },
    {
      time: "8:43 PM",
      title: "Saul answers on the second ring.",
      body: "He says he is an AI assistant, right up front. Callers care more about getting help tonight than who picks up.",
    },
    {
      time: "8:44 PM",
      title: "He asks your questions.",
      body: "Service needed, address, urgency, best callback time. Your intake rules, your service area, your tone.",
    },
    {
      time: "8:46 PM",
      title: "The lead lands in your CRM.",
      body: "A clean record in GoHighLevel with tags and a summary. No mystery voicemails, no half-remembered callbacks.",
    },
    {
      time: "8:46 PM",
      title: "Your on-call tech gets the text.",
      body: "Emergency? It routes now. Can wait? It is first on tomorrow's list. Your rules decide.",
    },
    {
      time: "7:30 AM",
      title: "The job is on the board.",
      body: "One call that used to walk to a competitor is now a booked job. That is the whole point.",
    },
  ],
  transcript: [
    { from: "saul", text: "Thanks for calling Front Range Heating. This is Saul, the AI assistant. What's going on?", at: 1 },
    { from: "caller", text: "Our furnace just quit and it's getting cold fast.", at: 1 },
    { from: "saul", text: "Got it. What's the address, and is anyone at home vulnerable to the cold?", at: 2 },
    { from: "caller", text: "1420 Pratt St, Longmont. Two kids at home.", at: 2 },
  ],
  lead: [
    ["Job", "No heat, furnace"],
    ["Where", "1420 Pratt St, Longmont"],
    ["Urgency", "Emergency", true],
    ["Note", "Two kids at home"],
  ],
  sms: "Emergency no-heat in Longmont, kids at home. Callback requested now.",
  booked: "Booked: 8:00 AM, furnace repair",
};

export const ROOFING_STORY: CallStoryData = {
  heading: "The storm call you would have missed.",
  caller: { number: "(970) 555-0172", place: "Loveland, CO" },
  steps: [
    {
      time: "6:12 PM",
      title: "Hail just rolled through Loveland.",
      body: "Your crew is two roofs deep across town. The calls stack up, and every one that hits voicemail dials the next roofer on Google.",
    },
    {
      time: "6:12 PM",
      title: "Saul picks up every one.",
      body: "He says he is an AI assistant up front, then gets to work. No busy signal, no voicemail box.",
    },
    {
      time: "6:13 PM",
      title: "He asks your questions.",
      body: "Address, damage type, water coming in or not, roof age, claim filed, adjuster scheduled. Retail or insurance.",
    },
    {
      time: "6:15 PM",
      title: "The lead lands in your CRM.",
      body: "A clean record in GoHighLevel with tags and a summary, ready for whoever makes the callback.",
    },
    {
      time: "6:15 PM",
      title: "Active leaks go to the top.",
      body: "Water coming through the ceiling? You get a text now. Inspection requests wait for your morning list. Your rules decide.",
    },
    {
      time: "7:30 AM",
      title: "Inspections on the board.",
      body: "The calls that used to walk to the roofer who picked up are now on your schedule.",
    },
  ],
  transcript: [
    { from: "saul", text: "Thanks for calling Peak Roofing. This is Saul, the AI assistant. How can I help?", at: 1 },
    { from: "caller", text: "Hail just tore through. I think we've got a leak upstairs.", at: 1 },
    { from: "saul", text: "Sorry to hear that. What's the address, and is water coming in right now?", at: 2 },
    { from: "caller", text: "2210 Garfield Ave, Loveland. Yes, it's dripping.", at: 2 },
  ],
  lead: [
    ["Job", "Hail damage, active leak"],
    ["Where", "2210 Garfield Ave, Loveland"],
    ["Urgency", "Tarp tonight", true],
    ["Claim", "Not filed yet"],
  ],
  sms: "Active leak after hail in Loveland. Tarp needed tonight. Callback requested now.",
  booked: "Booked: 8:00 AM inspection, Loveland",
};
