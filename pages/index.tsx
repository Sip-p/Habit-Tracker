// habit-tracker/pages/index.tsx
////done
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line,
  CartesianGrid, YAxis
} from 'recharts';

const habitsList: string[] = [
  'Running', 'Reading', 'Swimming', 'Gym', 'Music', 'Cycling','sleep','water intake','screen time',
  'Gaming', 'Yoga', 'Gardening', 'Walking'
];

interface HabitCheckins {
  [key: string]: number;
}

interface DailyGoals {
  [key: string]: number;
}

interface DaywiseData {
  day: string;
  progress: number;
}


export default function HabitTrackerApp() {
  const [screen, setScreen] = useState<'choose' | 'dashboard'>('choose');
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [habitCheckins, setHabitCheckins] = useState<HabitCheckins>({});
  const [dailyGoals, setDailyGoals] = useState<DailyGoals>({});
  const [streak, setStreak] = useState<number>(0);
  const [currentDay, setCurrentDay] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');  // Track theme
 

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('habitTrackerData') || '{}');
    if (data.habitCheckins) setHabitCheckins(data.habitCheckins);
    if (data.dailyGoals) setDailyGoals(data.dailyGoals);
    if (data.streak) setStreak(data.streak);
    if (data.selectedHabits) setSelectedHabits(data.selectedHabits);
    if (data.theme) setTheme(data.theme);
    const today = new Date().toLocaleString('en-us', { weekday: 'short' });
    setCurrentDay(today);
  }, []);
  
  useEffect(() => {
    localStorage.setItem(
      'habitTrackerData',
      JSON.stringify({ habitCheckins, dailyGoals, streak, selectedHabits, theme })
    );
  }, [habitCheckins, dailyGoals, streak, selectedHabits, theme]);
  

  const toggleHabit = (habit: string) => {
    setSelectedHabits(prev =>
      prev.includes(habit) ? prev.filter(h => h !== habit) : [...prev, habit]
    );
  };

  const handleSliderChange = (habit: string, value: number) => {
    if (!dailyGoals[habit]) {
      alert(`Please set a goal for ${habit} first.`);
      return; // Stop slider change
    }
  
    setHabitCheckins(prev => ({ ...prev, [habit]: value }));
  };

  const handleGoalChange = (habit: string, value: any) => {
    setDailyGoals(prev => ({ ...prev, [habit]: value }));
  };

  const totalHabits = selectedHabits.length;
  const completedHabits = selectedHabits.filter(h => (habitCheckins[h] || 0) >= 100).length;
  const percentageComplete = totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);
  const incompleteHabits = selectedHabits.filter(h => (habitCheckins[h] || 0) < 100);
  const daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIndex = daysOfWeek.indexOf(currentDay);

  const getLastFiveDays = () => {
    const today = new Date();
    const lastFiveDays: string[] = [];
    
    for (let i = 4; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i); // Adjust date to get the last 5 days
      lastFiveDays.push(day.toLocaleDateString('en-US', { weekday: 'short' })); // Add day name (e.g., Mon, Tue)
    }
  
    return lastFiveDays;
  };
  
  const lastFiveDays = getLastFiveDays(); // ["Mon", "Tue", "Wed", "Thu", "Fri"]
  
  const daywiseData: DaywiseData[] = lastFiveDays.map((day, index) => {
    let progress: number;
  
    if (index === 4) {
      // 5th day is today, so use your percentage for today
      progress = percentageComplete;
    } else {
      // For previous days, calculate based on some logic
      const base = (day.charCodeAt(0) + index * 7) % 40;
      progress = 50 + base; // You can adjust this logic as per your requirement
    }
  
    return { day, progress };
  });
  
  console.log(daywiseData);
  

  const weeklyData = [
    { week: 'Week 1', progress: 50 },
    { week: 'Week 2', progress: 65 },
    { week: 'Week 3', progress: 70 },
    { week: 'Week 4', progress: 85 },
    { week: 'Week 5', progress: 90 },
    { week: 'Week 6', progress: 95 },
    { week: 'Week 7', progress: 100 }
  ];

 


return (
  <div className="min-h-screen bg-gradient-to-br from-[#314470] to-[#1e293b] p-4 sm:p-6 md:p-8 text-white font-sans">
   
    <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-6">
      {screen === 'choose' ? (
        <div className={`w-full p-6 rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-[#1e293b] bg-opacity-40 backdrop-blur-lg border-2 border-transparent hover:border-white hover:shadow-xl' : 'bg-violet-200 bg-opacity-40 text-black backdrop-blur-lg border-2 border-transparent hover:border-gray-500 hover:shadow-xl'} flex flex-col lg:flex-row justify-evenly gap-4 `}>
          
          {/* Left Panel */}
          <div className={`w-full lg:w-1/3 p-6 rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-[#1c2f4c]' : 'bg-violet-700 text-black'}`}>
            <h2 className="text-lg font-semibold text-center">Let's choose</h2>
            <p className="text-center mb-4 text-pink-600 font-bold text-2xl bg-pink-100 rounded-full">Some Habit</p>
            <p className="text-center text-lg text-white font-bold mb-4">Choose your daily habits</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {habitsList.map(habit => (
                <button
                  key={habit}
                  onClick={() => toggleHabit(habit)}
                  className={`rounded-xl p-3 border ${
                    selectedHabits.includes(habit)
                      ? 'bg-green-500 text-white border-green-600'
                      : 'bg-gray-100 text-black'
                  }`}
                >
                  {habit}
                </button>
              ))}
            </div>
            <button
              className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold"
              onClick={() => setScreen('dashboard')}
            >
              Get Started!
            </button>
          </div>

          {/* Right Panel */}
          <div className={`w-full lg:w-1/3 p-6 rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-[#1e293b]' : 'bg-white text-black'} flex justify-center items-center bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 relative overflow-hidden`}>
  {/* Dazzling Shine Effect */}
  <div className="absolute inset-0 z-0">
    <div className="shine-effect"></div>
  </div>

  {/* Content */}
  <div className="text-center text-white z-10">
    <h1 className="text-3xl font-bold mb-4">Hello Sipra</h1>
    <p className="text-lg font-semibold mb-4">Continue Your Journey</p>
    <div className="border-t-2 border-white w-20 mx-auto mb-4"></div>
    <p className="text-sm font-medium">Let’s make today productive!</p>
  </div>

  {/* Spinning Circle */}
  <div className="absolute w-42 h-42 border-4 border-white rounded-full animate-spin-slow mx-auto top-10 z-0  "></div>

  {/* Styles */}
  <style jsx>{`
    @keyframes spin-slow {
      0% {
        transform: rotateY(0deg);
      }
      100% {
        transform: rotateY(360deg);
      }
    }

    .animate-spin-slow {
      animation: spin-slow 3s infinite linear;
    }

    @keyframes shine {
      0% {
        left: -75%;
      }
      100% {
        left: 125%;
      }
    }

    .shine-effect {
      position: absolute;
      top: 0;
      left: -75%;
      height: 100%;
      width: 50%;
      background: linear-gradient(
        120deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      animation: shine 2.5s infinite;
      transform: skewX(-20deg);




      ///
      /* Add this in your global styles or inside a <style> tag in your component */
@keyframes moveParticles {
  0% {
    transform: translateX(0) translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateX(50px) translateY(30px);
    opacity: 0.8;
  }
  100% {
    transform: translateX(-50px) translateY(-40px);
    opacity: 0.5;
  }
}

.particle {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  width: 6px;
  height: 6px;
  animation: moveParticles 4s infinite ease-in-out;
  opacity: 0.8;
}

.particle:nth-child(odd) {
  animation-duration: 3s;
  animation-delay: -1s;
}

.particle:nth-child(even) {
  animation-duration: 5s;
  animation-delay: -2s;
}

    }
  `}</style>
</div>

        </div>
      ) : (
        <>
          {/* Sidebar */}
          <div className={`w-full lg:w-1/3 p-6 rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-[#1e293b]' : 'bg-white text-black'}`}>
            <div className="flex items-center gap-3 mb-4">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User Avatar" className="rounded-full w-20 h-20" />  
              <div>
                <h3 className="text-sm font-bold">Hello Sipra</h3>
                <p className="text-xs text-gray-500">✨✨✨</p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl p-3 mb-4">
              {completedHabits === totalHabits && totalHabits > 0 ? (
                <p className="text-sm font-bold text-green-700">
                  🎉 All habits completed for today!
                </p>
              ) : (
                <>
                  <p className="text-xl text-blue-800 font-bold">You are almost done!</p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-cyan-500">{completedHabits}/{totalHabits} Habits</p>
                    <div className="text-green-600 font-bold">{percentageComplete}%</div>
                  </div>
                  <div className="text-sm text-white text-xl bg-red-500 p-2.5 border-r-4 border-red-700 rounded-lg mt-2">
                    Incomplete Habits: {incompleteHabits.join(', ')}
                  </div>
                </>
              )}
            </div>

            <h4 className="font-bold mb-2">Your Daily Check-ins</h4>
            <div className="space-y-4 overflow-y-auto max-h-[600px] scrollbar-hide">
              {selectedHabits.map(habit => (
                <div key={habit} className="bg-blue-100 p-3 rounded-xl">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-black">{habit}</span>
                    <span className="text-green-600 font-bold">{habitCheckins[habit] || 0}%</span>
                  </div>
                  <input  
                    type="range"
                    min="0"
                    max="100"
                    value={habitCheckins[habit] || 0}
                    onChange={e => handleSliderChange(habit, parseInt(e.target.value))}
                    className="w-full "
                  />
                  <div className="text-l mt-1 text-gray-500">
                    Daily Goal:
                    <input
                      type="text"  
                      value={dailyGoals[habit] || ''}
                      onChange={e => {
                        const value = e.target.value;
                        // Update the goal with the new text value
                        handleGoalChange(habit, value);
                      }}
                      className="ml-2 border px-1 rounded w-36 text-md h-5 bg-pink-100"
                       
                    />

                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h4 className="font-bold mb-2">Current Streak</h4>
              <div className="bg-green-100 text-green-800 text-center py-2 rounded-xl font-semibold">
                🔥 {streak} Days Streak!
              </div>
            </div>

            <button
              onClick={() => setScreen('choose')}
              className="mt-4 text-sm text-blue-500 underline"
            >
              ← Change Habits
            </button>
          </div>

          {/* Right Chart Section */}
          <div className={`w-full lg:w-2/3 p-6 rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-[#1e293b]' : 'bg-white text-black'}`}>
            <div className="relative flex justify-center gap-4 mb-4">
              <div className="relative bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 p-6 rounded-xl backdrop-blur-md text-center w-full overflow-hidden">
                <h3 className="text-3xl font-semibold text-white z-10 relative">Visualize Your Habit Journey📈📉📊</h3>
                <div className="absolute inset-0 z-0 pointer-events-none">
                  {[...Array(15)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 bg-white opacity-70 absolute rounded-sm animate-blink"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={selectedHabits.map(habit => ({
                habit,
                progress: habitCheckins[habit] || 0
              }))}>
                <XAxis dataKey="habit" stroke="#888" fontSize={12} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="progress" fill="#101280" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={daywiseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#888" fontSize={12} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotoneX" dataKey="progress" stroke="blue" strokeWidth={4} />
              </LineChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" stroke="#888" fontSize={12} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="progress" fill="blue" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full"
    >
      Toggle Theme
    </button>
  </div>
);


}


 




