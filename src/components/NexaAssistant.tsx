import { useState } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const DEMO_RESPONSES: Record<string, string> = {
  'proof wallet': `The **Proof Wallet** is where all your verified proof cards are stored. Each time a client approves a milestone, a proof card is automatically generated and added to your wallet.

Key features:
• Proof cards are **immutable** and cannot be edited
• Each card has a **"Verified on Nexa"** badge
• You can share proof cards via **public links**
• Anyone can verify your work without accessing your full profile`,

  'create task': `To create a task as a client:

1. Go to your **Client Dashboard**
2. Click the **"Create Task"** button
3. Fill in the task details:
   - Task title and description
   - Total budget
   - Number of milestones
   - Deliverables for each milestone
4. Once created, freelancers can accept the task
5. A **digital contract** is auto-generated and locked after acceptance`,

  'milestone': `**Milestones** break down tasks into manageable chunks:

• Each milestone has its own **budget** and **deliverables**
• Freelancers submit work when a milestone is complete
• Clients can **approve** or **request revision** (max 2 revisions)
• **Approved milestones become proof cards** automatically
• Payment status is tracked separately (Pending/Paid)`,

  'profile': `**Profile Visibility Rules:**

• Profiles are **context-based** - visible only through task relationships
• No public marketplace or searchable profiles
• **Freelancer profiles** show: name, services, skills, and verified proof cards
• **Client profiles** show: name, type, completed tasks, and approval behavior
• Contact details are only visible after task acceptance`,

  'payment': `**Payment Status in Nexa:**

Nexa tracks payment status manually (no real payment gateway in MVP):

• **Pending** - Payment not yet made
• **Paid** - Payment completed

Both parties can see the payment status. This builds transparency and trust between clients and freelancers.

Note: Actual payments happen outside Nexa.`,

  'default': `I'm the **Nexa Assistant** (Demo) - here to help you understand how Nexa works!

You can ask me about:
• 📁 **Proof Wallet** - How verified proof cards work
• 📝 **Creating tasks** - How to post and manage tasks
• ✅ **Milestones** - How the approval workflow works
• 👤 **Profiles** - Profile visibility rules
• 💰 **Payments** - Payment status tracking

Just type your question below!`
};

const getResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('proof') || lowerMessage.includes('wallet') || lowerMessage.includes('card')) {
    return DEMO_RESPONSES['proof wallet'];
  }
  if (lowerMessage.includes('create') || lowerMessage.includes('task') || lowerMessage.includes('project')) {
    return DEMO_RESPONSES['create task'];
  }
  if (lowerMessage.includes('milestone') || lowerMessage.includes('approval') || lowerMessage.includes('approve') || lowerMessage.includes('revision')) {
    return DEMO_RESPONSES['milestone'];
  }
  if (lowerMessage.includes('profile') || lowerMessage.includes('visibility') || lowerMessage.includes('contact')) {
    return DEMO_RESPONSES['profile'];
  }
  if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('money')) {
    return DEMO_RESPONSES['payment'];
  }
  
  return DEMO_RESPONSES['default'];
};

const NexaAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: DEMO_RESPONSES['default']
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getResponse(input)
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Panel */}
      <div className={`fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-card border border-border rounded-2xl shadow-2xl z-50 transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Nexa Assistant</h3>
              <p className="text-xs text-muted-foreground">Demo • Basic Help</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                message.role === 'assistant' 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-secondary text-muted-foreground'
              }`}>
                {message.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`flex-1 p-3 rounded-xl text-sm ${
                message.role === 'assistant'
                  ? 'bg-secondary text-foreground'
                  : 'bg-primary text-primary-foreground'
              }`}>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} className="mb-1 last:mb-0">
                      {line.split(/(\*\*.*?\*\*)/).map((part, j) => 
                        part.startsWith('**') && part.endsWith('**') 
                          ? <strong key={j}>{part.slice(2, -2)}</strong>
                          : part
                      )}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about Nexa..."
              className="flex-1 input-nexa text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Demo assistant with predefined responses
          </p>
        </div>
      </div>
    </>
  );
};

export default NexaAssistant;
