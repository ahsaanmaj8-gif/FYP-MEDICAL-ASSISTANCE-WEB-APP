import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Backend_Url } from './../../../../utils/utils';

const ScheduleDoc = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [newSlotTime, setNewSlotTime] = useState('09:00');

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${Backend_Url}/doctor/schedule`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSchedule(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast.error('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  // =======================
  // EDIT SCHEDULE FUNCTIONS
  // =======================

  const handleEditDay = (day) => {
    const dayData = schedule.find(d => d.day === day) || { day, slots: [] };
    setSelectedDay(day);
    setTimeSlots(dayData.slots || []);
    setEditing(true);
  };

  const addTimeSlot = () => {
    if (!newSlotTime) {
      toast.error('Please select a time');
      return;
    }

    // Check if slot already exists
    const exists = timeSlots.some(slot => slot.startTime === newSlotTime);
    if (exists) {
      toast.error('This time slot already exists');
      return;
    }

    // Calculate end time (30 minutes later)
    const [hours, minutes] = newSlotTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes + 30, 0);
    const endTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

    setTimeSlots([...timeSlots, { 
      startTime: newSlotTime, 
      endTime, 
      isAvailable: true 
    }]);
    
    setNewSlotTime('09:00'); // Reset to default
  };

  const removeTimeSlot = (index) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const saveDaySchedule = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Update the schedule for the selected day
      const updatedSchedule = schedule.map(day => {
        if (day.day === selectedDay) {
          return { ...day, slots: timeSlots };
        }
        return day;
      });

      // If day wasn't in schedule, add it
      if (!schedule.find(d => d.day === selectedDay)) {
        updatedSchedule.push({
          day: selectedDay,
          slots: timeSlots
        });
      }

      const response = await axios.put(
        `${Backend_Url}/doctor/schedule`,
        { availability: updatedSchedule },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`${formatDay(selectedDay)} schedule updated`);
        setSchedule(updatedSchedule);
        setEditing(false);
        setSelectedDay(null);
        setTimeSlots([]);
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast.error(error.response?.data?.message || 'Failed to update schedule');
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setSelectedDay(null);
    setTimeSlots([]);
  };

  // =======================
  // HELPER FUNCTIONS
  // =======================

  const formatDay = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // Sort schedule by day order
  const sortedSchedule = [...schedule].sort((a, b) => 
    dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
        {!editing && (
          <button
            onClick={() => handleEditDay('monday')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <span className="mr-2">✏️</span>
            Edit Schedule
          </button>
        )}
      </div>

      {/* Edit Schedule Modal */}
      {editing && selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Edit {formatDay(selectedDay)} Schedule
                </h2>
                <button
                  onClick={cancelEdit}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Add New Slot */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add New Time Slot
                </label>
                <div className="flex gap-3">
                  <input
                    type="time"
                    value={newSlotTime}
                    onChange={(e) => setNewSlotTime(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    onClick={addTimeSlot}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Add Slot
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Each slot is 30 minutes long. Example: 09:00 = 9:00 AM, 14:00 = 2:00 PM
                </p>
              </div>

              {/* Current Slots */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Current Time Slots ({timeSlots.length})
                </h3>
                {timeSlots.length === 0 ? (
                  <p className="text-gray-500 text-sm italic p-4 bg-gray-50 rounded-lg">
                    No time slots added for this day
                  </p>
                ) : (
                  <div className="space-y-2">
                    {timeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100"
                      >
                        <div className="flex items-center">
                          <span className="text-green-600 mr-3">⏰</span>
                          <span className="font-medium">{formatTime(slot.startTime)}</span>
                          <span className="mx-2 text-gray-400">to</span>
                          <span className="text-gray-600">{formatTime(slot.endTime)}</span>
                        </div>
                        <button
                          onClick={() => removeTimeSlot(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={saveDaySchedule}
                  className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-medium"
                >
                  Save {formatDay(selectedDay)} Schedule
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Grid */}
      {sortedSchedule.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg border p-12 text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Schedule Set</h3>
          <p className="text-gray-600 mb-6">You haven't set your weekly availability yet.</p>
          <button
            onClick={() => handleEditDay('monday')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 inline-flex items-center"
          >
            <span className="mr-2">✏️</span>
            Set Up Your Schedule
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dayOrder.map((dayName) => {
              const daySchedule = sortedSchedule.find(d => d.day === dayName);
              const slots = daySchedule?.slots || [];
              
              return (
                <div key={dayName} className="bg-white rounded-xl shadow-lg border hover:shadow-xl transition">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-gray-800">
                        {formatDay(dayName)}
                      </h3>
                      <button
                        onClick={() => handleEditDay(dayName)}
                        className="text-gray-400 hover:text-green-600 transition p-2"
                      >
                        ✏️
                      </button>
                    </div>
                    
                    {slots.length === 0 ? (
                      <div className="text-center py-6 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-sm">Not working</p>
                        <button
                          onClick={() => handleEditDay(dayName)}
                          className="mt-2 text-xs text-green-600 hover:text-green-700"
                        >
                          + Add slots
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {slots.map((slot, index) => (
                          <div key={index} className="flex items-center text-sm p-2 bg-green-50 rounded-lg">
                            <span className="text-green-600 mr-2">⏰</span>
                            <span className="font-medium">{formatTime(slot.startTime)}</span>
                            <span className="mx-1 text-gray-400">-</span>
                            <span className="text-gray-600">{formatTime(slot.endTime)}</span>
                          </div>
                        ))}
                        <div className="text-xs text-gray-500 mt-2 text-right">
                          {slots.length} slot{slots.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Schedule Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">📊</div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-800 mb-2">Weekly Schedule Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Working Days</div>
                    <div className="text-2xl font-bold text-green-700">
                      {sortedSchedule.filter(d => d.slots?.length > 0).length}
                    </div>
                    <div className="text-xs text-gray-500">out of 7 days</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Slots</div>
                    <div className="text-2xl font-bold text-blue-700">
                      {sortedSchedule.reduce((total, day) => total + (day.slots?.length || 0), 0)}
                    </div>
                    <div className="text-xs text-gray-500">per week</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Avg. per Day</div>
                    <div className="text-2xl font-bold text-purple-700">
                      {Math.round(
                        sortedSchedule.reduce((total, day) => total + (day.slots?.length || 0), 0) / 
                        (sortedSchedule.filter(d => d.slots?.length > 0).length || 1)
                      )}
                    </div>
                    <div className="text-xs text-gray-500">slots/day</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Busiest Day</div>
                    <div className="text-2xl font-bold text-orange-700">
                      {(() => {
                        const busiest = sortedSchedule.reduce((max, day) => 
                          (day.slots?.length || 0) > (max.slots?.length || 0) ? day : max
                        , { slots: [] });
                        return busiest.slots?.length > 0 ? formatDay(busiest.day).slice(0, 3) : 'N/A';
                      })()}
                    </div>
                    <div className="text-xs text-gray-500">{new Date().toLocaleDateString('default', { month: 'short' })}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">ℹ️</div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">About Your Schedule</h4>
                <p className="text-sm text-blue-700">
                  Click the ✏️ icon on any day to edit your time slots. 
                  Each slot is 30 minutes long. Patients can book appointments in these slots.
                  Your schedule is saved immediately and patients can see available slots.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ScheduleDoc;