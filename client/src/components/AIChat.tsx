import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

export function AIChat() {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Kullanıcı mesajını ekle
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // API'ye istek gönder
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      
      const data = await response.json();
      
      // AI yanıtını ekle
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>AI Asistanı</CardTitle>
      </CardHeader>
      <CardContent className="h-80 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Merhaba! Size nasıl yardımcı olabilirim?
          </p>
        ) : (
          messages.map((msg, i) => (
            <div 
              key={i} 
              className={`p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground ml-auto' 
                  : 'bg-muted'
              } max-w-[80%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
            >
              {msg.content}
            </div>
          ))
        )}
        {loading && (
          <div className="bg-muted p-3 rounded-lg max-w-[80%] mr-auto">
            <span className="animate-pulse">Yanıt yazılıyor...</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mesajınızı yazın..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend} disabled={loading}>
          Gönder
        </Button>
      </CardFooter>
    </Card>
  );
} 