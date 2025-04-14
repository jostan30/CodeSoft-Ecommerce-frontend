'use client'
import React, { useState, useEffect } from 'react';
import { User, LogOut, Lock, Home, Phone, Mail, Edit, Save } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/lib/useAuth';
import { toast } from 'sonner';

// Define TypeScript interfaces
interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string; // Added country as optional
}

interface UserData { 
  _id?: string,
  name: string,
  email: string,
  password?: string,
  phone: string,
  address: Address,
  role?: string
}

interface PasswordData {
  current: string;
  new: string;
  confirm: string;
}

interface MessageData {
  type: string;
  text: string;
}

const CustomerSettings = () => {
  const token = useAuth();
  const [user, setUser] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  
  const [editedUser, setEditedUser] = useState<UserData>({...user});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [password, setPassword] = useState<PasswordData>({
    current: '',
    new: '',
    confirm: ''
  });
  const [loading, setLoading] = useState<boolean>(true);
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const userData = response.data.user;
        setUser(userData);
        setEditedUser(userData);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Error fetching user data");
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditedUser(prevState => ({
        ...prevState,
        [parent]: {
          ...prevState[parent as keyof UserData] as object,
          [child]: value
        }
      }));
    } else {
      setEditedUser(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/updateprofile`, 
        editedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const updatedUser = response.data.user;
      setUser(updatedUser);
      toast.success("User updated successfully"); 
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      toast.error("Profile not updated")
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password.new !== password.confirm) {
      toast.error("New password does not match")
      return;
    }
    
    setLoading(true);
    
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/changepassword`,
        {
          currentPassword: password.current,
          newPassword: password.new
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setPassword({
        current: '',
        new: '',
        confirm: ''
      });
      
      toast.success("Password changed successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error changing password");
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (loading && !user.name) {
    return (
      <div className="bg-gray-900 min-h-screen text-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer">
            <LogOut size={18} /> Logout
          </button>
        </div>
        
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <User size={20} /> Personal Information
                </h2>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors">
                    <Edit size={16} /> Edit
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="cursor-pointer flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md transition-colors">
                    Cancel
                  </button>
                )}
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editedUser.name}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="py-2 px-3 bg-gray-700 rounded-md">{user.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editedUser.email}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="py-2 px-3 bg-gray-700 rounded-md flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" /> {user.email}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editedUser.phone}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      pattern="[0-9]{10}"
                    />
                  ) : (
                    <p className="py-2 px-3 bg-gray-700 rounded-md flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" /> {user.phone}
                    </p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                  {isEditing ? (
                    <div className="grid gap-4">
                      <input
                        type="text"
                        name="address.street"
                        placeholder="Street Address"
                        value={editedUser.address.street}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="address.city"
                          placeholder="City"
                          value={editedUser.address.city}
                          onChange={handleChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          name="address.state"
                          placeholder="State"
                          value={editedUser.address.state}
                          onChange={handleChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="address.zipCode"
                          placeholder="Zip Code"
                          value={editedUser.address.zipCode}
                          onChange={handleChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          name="address.country"
                          placeholder="Country"
                          value={editedUser.address.country || ''}
                          onChange={handleChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 px-3 bg-gray-700 rounded-md flex items-start gap-2">
                      <Home size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p>{user.address.street}</p>
                        <p>{user.address.city}, {user.address.state} {user.address.zipCode}</p>
                        {user.address.country && <p>{user.address.country}</p>}
                      </div>
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <div className="flex justify-end mt-6">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50">
                      {loading ? 'Saving...' : (
                        <>
                          <Save size={18} /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="cursor-pointer text-xl font-semibold mb-6 flex items-center gap-2">
                <Lock size={20} /> Change Password
              </h2>
              
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                  <input
                    type="password"
                    name="current"
                    value={password.current}
                    onChange={handlePasswordChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                  <input
                    type="password"
                    name="new"
                    value={password.new}
                    onChange={handlePasswordChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={6}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirm"
                    value={password.confirm}
                    onChange={handlePasswordChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={6}
                  />
                </div>
                
                <div className="flex justify-end mt-6">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50">
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
              
              <div className="flex flex-col gap-4">
                <button className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-gray-100 p-3 rounded-md transition-colors w-full text-left">
                  <span className="bg-gray-600 p-2 rounded-full">
                    <User size={16} />
                  </span>
                  <span>Profile Information</span>
                </button>
                
                <button className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-gray-100 p-3 rounded-md transition-colors w-full text-left">
                  <span className="bg-gray-600 p-2 rounded-full">
                    <Home size={16} />
                  </span>
                  <span>Address & Contact</span>
                </button>
                
                <button className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-gray-100 p-3 rounded-md transition-colors w-full text-left">
                  <span className="bg-gray-600 p-2 rounded-full">
                    <Lock size={16} />
                  </span>
                  <span>Security</span>
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="cursor-pointer flex items-center gap-3 bg-red-800 hover:bg-red-700 text-gray-100 p-3 rounded-md transition-colors w-full text-left mt-4">
                  <span className=" bg-red-700 p-2 rounded-full">
                    <LogOut size={16} />
                  </span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerSettings;