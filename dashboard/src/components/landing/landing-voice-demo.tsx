'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Mic, 
  Play, 
  Pause, 
  MessageSquare, 
  PhoneCall, 
  Bot, 
  User, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Waves, 
  Activity
} from 'lucide-react';

const PERSONAS = [
  {
    id: 'rua',
    name: "Ru'a",
    role: 'Lead Qualification & Showing Specialist',
    latency: '245ms',
    avatarBg: 'bg-indigo-600',
    description: 'Warm, highly articulate, and expert at uncovering budget and timeline without sounding scripted.',
    sampleAudioText: [
      { speaker: "Ru'a", text: "Hello! This is Ru'a calling from StateAI Realty. I noticed you were checking out our luxury villa listing on Sunset Drive online right now. Did you get a chance to watch the virtual 3D tour yet?" },
      { speaker: "Client", text: "Hi! Yeah, I did. It looked really nice, but I was curious if the backyard gets afternoon sun?" },
      { speaker: "Ru'a", text: "[Chuckles warmly] Oh, absolutely! It has a perfect southwest orientation so the pool gets drenched in sunlight up until sunset. Are you looking to move within the next 60 days?" },
      { speaker: "Client", text: "We're aiming for around 45 days. And our budget is right around 1.6 million." },
      { speaker: "Ru'a", text: "That fits the timeline right on target! Let's schedule a private walk-through with our senior broker this Thursday at 3 PM so you can experience that sunset glow yourself." }
    ]
  },
  {
    id: 'zayn',
    name: 'Zayn',
    role: 'Outbound MLS Property Pitcher',
    latency: '260ms',
    avatarBg: 'bg-slate-900',
    description: 'Confident and assertive. Ideal for pitching expired listings or re-engaging old database leads.',
    sampleAudioText: [
      { speaker: 'Zayn', text: "Good afternoon! This is Zayn with StateAI Advisory. I'm reaching out because property valuations on your street just jumped 6.4% this quarter, and we have three verified buyers looking in your neighborhood." },
      { speaker: 'Client', text: "Really? What are homes selling for around here lately?" },
      { speaker: 'Zayn', text: "Right now, 4-bedroom homes like yours are closing between $890k and $940k in under 12 days! I can run a customized digital CMA right now and text you the breakdown in 60 seconds." }
    ]
  },
  {
    id: 'laila',
    name: 'Laila',
    role: 'Past Client & VIP Concierge',
    latency: '250ms',
    avatarBg: 'bg-emerald-600',
    description: 'Refined and calming. Manages high-net-worth client follow-ups and annual equity reviews.',
    sampleAudioText: [
      { speaker: 'Laila', text: "Good morning! This is Laila checking in on your 1-year home anniversary at 404 Palm Avenue! How have you and the family been enjoying the neighborhood this past year?" },
      { speaker: 'Client', text: "Hi Laila! Thank you so much, we love it here." },
      { speaker: 'Laila', text: "That is wonderful to hear! We actually just finished your annual home equity report—your property has gained approximately $112,000 in equity since closing. I've sent the PDF straight to your email." }
    ]
  }
];

const QUICK_PROMPTS = [
  "Can I schedule a showing for Sunset Villa this Friday at 3 PM?",
  "I'm looking for a 4-bedroom villa under $1.8M with a private pool.",
  "What happens if a client interrupts Ru'a while she is speaking?"
];

interface ChatMessage {
  id: number;
  sender: 'ai' | 'user' | string;
  text: string;
  timestamp: string;
  leadScore?: number;
}

export function LandingVoiceDemo() {
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeDialogueIndex, setActiveDialogueIndex] = useState(-1);
  const [displayedText, setDisplayedText] = useState('');
  const [isInterrupted, setIsInterrupted] = useState(false);
  
  // Text Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I'm Ru'a, your AI Real Estate Assistant. Type a question below or click a quick prompt to see how I qualify buyers and schedule calendar appointments in real time!",
      timestamp: 'Just now',
      leadScore: 85
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && !isInterrupted) {
      if (activeDialogueIndex < selectedPersona.sampleAudioText.length) {
        const currentLine = selectedPersona.sampleAudioText[activeDialogueIndex];
        let charIdx = 0;
        setDisplayedText('');
        
        timer = setInterval(() => {
          if (charIdx <= currentLine.text.length) {
            setDisplayedText(currentLine.text.substring(0, charIdx));
            charIdx++;
          } else {
            clearInterval(timer);
            setTimeout(() => {
              if (isPlaying && !isInterrupted) {
                setActiveDialogueIndex((prev) => prev + 1);
              }
            }, 1800);
          }
        }, 28);
      } else {
        setIsPlaying(false);
        setActiveDialogueIndex(-1);
      }
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeDialogueIndex, isInterrupted, selectedPersona]);

  const handleStartPlayback = () => {
    setIsInterrupted(false);
    setIsPlaying(true);
    setActiveDialogueIndex(0);
    setDisplayedText('');
  };

  const handlePausePlayback = () => {
    setIsPlaying(false);
  };

  const handleSimulateBargeIn = () => {
    if (!isPlaying) return;
    setIsInterrupted(true);
    setIsPlaying(false);
    setDisplayedText(
      "[⚡ 118ms Instant Barge-In Cutoff]\nClient interrupted! Ru'a immediately stopped speaking and is listening to the client's new question..."
    );
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: text,
      timestamp: 'Just now'
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = "";
      let leadScoreUpdate = 92;

      if (text.toLowerCase().includes('showing') || text.toLowerCase().includes('schedule') || text.toLowerCase().includes('friday')) {
        aiResponseText = "Perfect! I just checked our agent's live Google Calendar. Friday at 3:00 PM is open for Sunset Villa. I've officially booked your showing slot, synced it to Appwrite CRM, and sent an automated SMS confirmation with directions to your phone.";
        leadScoreUpdate = 98;
      } else if (text.toLowerCase().includes('villa') || text.toLowerCase().includes('4-bedroom') || text.toLowerCase().includes('pool') || text.toLowerCase().includes('1.8m')) {
        aiResponseText = "We actually have an off-market 4-bedroom villa on Palm Way listed at $1.68M—featuring a heated pool and smart home automation. Would you like me to instantly text you the private MLS brochure and book a video tour this afternoon?";
        leadScoreUpdate = 94;
      } else if (text.toLowerCase().includes('interrupt') || text.toLowerCase().includes('barge')) {
        aiResponseText = "Unlike legacy robotic IVRs that talk over you, Ru'a uses real-time full-duplex acoustic processing. If a client speaks over her or clears their throat, she halts within 120 milliseconds, listens, and pivots smoothly just like a real human.";
        leadScoreUpdate = 90;
      } else {
        aiResponseText = `Thank you for asking about "${text.substring(0, 40)}..."! As an autonomous AI assistant powered by StateAI, I check live comps and agent calendars while logging every note right inside your CRM timeline.`;
        leadScoreUpdate = 89;
      }

      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponseText,
        timestamp: 'Just now',
        leadScore: leadScoreUpdate
      };

      setChatMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <section id="voice-demo" className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
            Interactive AI Lab
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-3 mb-3">
            Test Drive <span className="text-indigo-600">Ru&apos;a</span> Right Here.
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto">
            Listen to our human-grade acoustic voice simulation or try our instant text chat assistant.
          </p>
        </div>

        {/* Persona Selector Pill Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {PERSONAS.map((persona) => {
            const isSelected = selectedPersona.id === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => {
                  setSelectedPersona(persona);
                  setIsPlaying(false);
                  setActiveDialogueIndex(-1);
                  setIsInterrupted(false);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all text-left ${
                  isSelected
                    ? 'bg-white border-indigo-600 shadow-sm ring-2 ring-indigo-600/10'
                    : 'bg-white/60 border-slate-200 hover:bg-white text-slate-600'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg ${persona.avatarBg} text-white font-bold flex items-center justify-center text-xs shadow-xs`}>
                  {persona.name.substring(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-900">{persona.name}</span>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                      {persona.latency}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-1">{persona.role}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Demo Box */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <Tabs defaultValue="voice" className="w-full">
            <TabsList className="grid grid-cols-2 h-12 p-1 bg-slate-100 rounded-xl mb-6">
              <TabsTrigger value="voice" className="rounded-lg font-semibold text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-xs flex items-center gap-2">
                <Mic className="w-4 h-4 text-indigo-600" />
                <span>Voice Acoustic Simulator</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="rounded-lg font-semibold text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-xs flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Interactive Text Assistant</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: VOICE ACOUSTICS */}
            <TabsContent value="voice" className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl ${selectedPersona.avatarBg} text-white font-extrabold flex items-center justify-center text-base shadow-xs`}>
                    {selectedPersona.name.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{selectedPersona.name}</h3>
                    <p className="text-xs text-slate-500">{selectedPersona.description}</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
                  <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>Sub-280ms Full Duplex</span>
                </div>
              </div>

              {/* Waveform Box */}
              <div className="h-24 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-center px-6 relative overflow-hidden">
                {isPlaying ? (
                  <div className="flex items-center justify-center gap-1.5 w-full h-full">
                    {[...Array(32)].map((_, i) => {
                      const heights = ['h-4', 'h-8', 'h-14', 'h-16', 'h-10', 'h-6'];
                      const randomH = heights[(i + activeDialogueIndex) % heights.length];
                      return (
                        <div
                          key={i}
                          className={`w-1.5 rounded-full bg-indigo-600 animate-pulse transition-all duration-150 ${randomH}`}
                          style={{ animationDelay: `${i * 35}ms` }}
                        />
                      );
                    })}
                  </div>
                ) : isInterrupted ? (
                  <div className="flex items-center gap-2 text-amber-700 font-medium text-sm">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>Barge-in simulated (<strong className="font-mono">118ms cutoff</strong>). Audio halted instantly.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Waves className="w-5 h-5 text-indigo-600" />
                    <span>Click <strong className="text-slate-900">&quot;Start Voice Simulation&quot;</strong> below to listen</span>
                  </div>
                )}
              </div>

              {/* Live Transcript Box */}
              <div className="min-h-[140px] max-h-[180px] overflow-y-auto bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 space-y-2 font-mono text-xs text-slate-800 leading-relaxed">
                {activeDialogueIndex >= 0 && !isInterrupted ? (
                  <div>
                    <span className="font-bold text-indigo-600 mr-2">
                      [{selectedPersona.sampleAudioText[activeDialogueIndex].speaker}]:
                    </span>
                    <span>{displayedText}</span>
                    <span className="inline-block w-1.5 h-3.5 bg-indigo-600 ml-1 animate-pulse" />
                  </div>
                ) : isInterrupted ? (
                  <div className="text-amber-800 font-sans p-2 bg-amber-50 rounded-lg text-xs">
                    {displayedText}
                  </div>
                ) : (
                  <div className="text-slate-400 italic text-center py-10">
                    Ready to stream acoustic simulation...
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-3">
                  {!isPlaying ? (
                    <Button
                      onClick={handleStartPlayback}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 h-11 rounded-xl shadow-xs flex items-center gap-2 text-sm"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Voice Simulation</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePausePlayback}
                      variant="secondary"
                      className="font-semibold px-6 h-11 rounded-xl flex items-center gap-2 text-sm bg-slate-200 text-slate-900"
                    >
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={handleSimulateBargeIn}
                    disabled={!isPlaying}
                    className="h-11 px-4 rounded-xl border-amber-300 text-amber-800 hover:bg-amber-50 font-medium text-xs flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Test Interruption (Barge-In)</span>
                  </Button>
                </div>
                <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero Monotone Guaranteed</span>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: TEXT CHAT */}
            <TabsContent value="chat" className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isTyping}
                    className="text-xs bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors font-medium text-left disabled:opacity-50 text-slate-700"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Window */}
              <div className="h-[240px] overflow-y-auto bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-start gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                        msg.sender === 'user' ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'
                      }`}>
                        {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </div>
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-slate-900 text-white rounded-tr-none font-medium'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
                      }`}>
                        {msg.text}
                        {msg.leadScore && (
                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-indigo-600 font-semibold">
                            <span>Real-Time CRM Score:</span>
                            <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                              {msg.leadScore}/100 🔥 Hot Lead
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium pl-9">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                    <span>Ru&apos;a is checking MLS & calendar availability...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Bar */}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Ask Ru'a any real estate or scheduling question..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isTyping}
                  className="h-11 rounded-xl bg-white border-slate-200 px-4 text-xs text-slate-900"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={isTyping || !inputMessage.trim()}
                  className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
