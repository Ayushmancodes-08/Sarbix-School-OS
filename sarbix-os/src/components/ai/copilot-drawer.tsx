"use client"

import * as React from "react"
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ArrowUpRight,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface CopilotDrawerProps {
  open: boolean
  onClose: () => void
}

interface Message {
  id: string
  sender: "user" | "copilot"
  text: string
  insights?: {
    type: "stat" | "warning" | "recommendation"
    title: string
    content: string
  }[]
}

const PRESET_PROMPTS = [
  "Analyze Grade 10 attendance trends",
  "Show students with fee dues > ₹20,000",
  "Check bus Route 04 morning delay causes",
]

export function CopilotDrawer({ open, onClose }: CopilotDrawerProps) {
  const [input, setInput] = React.useState("")
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "msg-0",
      sender: "copilot",
      text: "Hello! I am your Sarbix Institutional Copilot. I analyze multi-campus academic records, cross-correlate fee dues with attendance, and assist in daily operational governance. What would you like to examine?",
    },
  ])
  const [isProcessing, setIsProcessing] = React.useState(false)

  const handleSend = (queryText: string) => {
    if (!queryText.trim()) return

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: queryText,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsProcessing(true)

    // Simulate intelligent multi-source reasoning response
    setTimeout(() => {
      let response: Message

      if (queryText.toLowerCase().includes("attendance")) {
        response = {
          id: `msg-${Date.now() + 1}`,
          sender: "copilot",
          text: "Here is the real-time attendance diagnosis for Grade 10:",
          insights: [
            {
              type: "stat",
              title: "Average Attendance",
              content: "93.2% across Grade 10 sections A & B today.",
            },
            {
              type: "warning",
              title: "Lateness Pattern Detected",
              content: "Kabir Mehta (10A) was marked late 3 times this week due to Route 02 congestion.",
            },
            {
              type: "recommendation",
              title: "Automated SMS Action",
              content: "Parent notification dispatched via WhatsApp gateway at 08:45 AM.",
            },
          ],
        }
      } else if (queryText.toLowerCase().includes("fee") || queryText.toLowerCase().includes("due")) {
        response = {
          id: `msg-${Date.now() + 1}`,
          sender: "copilot",
          text: "Here is the fee risk analysis for current Term II billing:",
          insights: [
            {
              type: "stat",
              title: "Total Outstanding Dues",
              content: "₹87,000 pending across 4 students in Grade 10 & 11.",
            },
            {
              type: "warning",
              title: "Critical Overdue Risk",
              content: "Kabir Mehta (₹32,000) & Diya Kapoor (₹24,500) have invoices due in < 7 days.",
            },
            {
              type: "recommendation",
              title: "Action Suggested",
              content: "Trigger automated 1-click WhatsApp payment reminders with Razorpay/Stripe smart links.",
            },
          ],
        }
      } else {
        response = {
          id: `msg-${Date.now() + 1}`,
          sender: "copilot",
          text: `Analysis complete for: "${queryText}". Campus telemetry is healthy with 99.8% database synchronization across all academic branches.`,
        }
      }

      setMessages((prev) => [...prev, response])
      setIsProcessing(false)
    }, 700)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
        <div className="w-screen sm:max-w-md border-l border-border bg-background shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-6 bg-muted/30">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold">Sarbix Copilot</h3>
                <p className="text-[11px] text-muted-foreground">Institutional Reasoning Engine</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick prompt chips */}
          <div className="border-b bg-muted/10 p-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Suggested Institutional Inquiries
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="rounded-full border border-indigo-500/20 bg-indigo-500/5 px-2.5 py-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "copilot" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 border border-border text-foreground"
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Render Structured Insights */}
                  {msg.insights && (
                    <div className="mt-3 space-y-2 border-t border-border/60 pt-2">
                      {msg.insights.map((ins, i) => (
                        <div
                          key={i}
                          className="rounded-lg border bg-background/80 p-2 text-[11px]"
                        >
                          <div className="flex items-center space-x-1.5 font-semibold text-foreground">
                            {ins.type === "warning" ? (
                              <AlertTriangle className="h-3 w-3 text-amber-500" />
                            ) : ins.type === "recommendation" ? (
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <ArrowUpRight className="h-3 w-3 text-indigo-500" />
                            )}
                            <span>{ins.title}</span>
                          </div>
                          <p className="mt-1 text-muted-foreground">{ins.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {msg.sender === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-center space-x-2 text-xs text-muted-foreground pl-10">
                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                <span>Copilot is synthesizing academic telemetry...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="border-t p-3 bg-background">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend(input)
              }}
              className="flex items-center space-x-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Copilot about any campus metric..."
                className="h-10 text-xs"
              />
              <Button type="submit" size="sm" className="h-10 px-3">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
