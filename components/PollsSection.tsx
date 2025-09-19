'use client';

import { useState } from 'react';

const initialPolls = [
  {
    id: 401,
    question: "Which destination would you like to visit this summer?",
    options: ["Kashmir", "Himachal Pradesh", "Uttarakhand", "Northeast India"],
    votes: [45, 32, 28, 15],
    isActive: true,
    allowMultiple: false
  }
];

export default function PollsSection() {
  const [polls, setPolls] = useState(initialPolls);

  const voteInPoll = (pollId: number, optionIndex: number) => {
    setPolls(prevPolls => 
      prevPolls.map(poll => {
        if (poll.id === pollId) {
          const newVotes = [...poll.votes];
          newVotes[optionIndex]++;
          return { ...poll, votes: newVotes };
        }
        return poll;
      })
    );
    alert('Thank you for voting!');
  };

  const activePolls = polls.filter(poll => poll.isActive);

  if (activePolls.length === 0) {
    return null;
  }

  return (
    <section id="pollsSection" className="py-16 bg-white/5 backdrop-blur-sm relative z-10">
      <div className="max-w-4xl mx-auto px-5">
        <h2 className="text-xl font-bold text-center text-black mb-8">Your Opinion Matters</h2>
        <div className="flex flex-col space-y-8">
          {activePolls.map(poll => {
            const totalVotes = poll.votes.reduce((sum, votes) => sum + votes, 0);
            
            return (
              <div key={poll.id} className="bg-white/90 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold mb-6 text-gray-800 text-center">
                  {poll.question}
                </h3>
                <div className="flex flex-col space-y-4">
                  {poll.options.map((option, index) => {
                    const percentage = totalVotes > 0 ? ((poll.votes[index] / totalVotes) * 100).toFixed(1) : 0;
                    
                    return (
                      <div 
                        key={index}
                        onClick={() => voteInPoll(poll.id, index)}
                        className="flex items-center p-4 bg-gray-50 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-100 hover:translate-x-1 relative"
                      >
                        <span className="flex-1 font-medium text-gray-800">{option}</span>
                        <div className="flex-2 h-2 bg-gray-200 rounded-sm mx-4 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-sm transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-blue-600 min-w-[50px] text-right">
                          {percentage}%
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="text-center mt-4 text-sm text-gray-600">
                  Total votes: {totalVotes}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}