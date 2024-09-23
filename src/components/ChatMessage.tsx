import React from 'react';

type ChatMessageProps = {
  role: 'user' | 'assistant';
  content: string;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  const bgColor = role === 'user' ? 'bg-blue-100' : 'bg-green-100';
  const alignment = role === 'user' ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex ${alignment}`}>
      <div className={`max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-lg p-3 ${bgColor}`}>
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;