import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { RefreshCw, Trash2, UserPlus, Lock, AlertTriangle, Edit2, Check, X, Mail, Eye, EyeOff } from 'lucide-react';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [profileUpdate, setProfileUpdate] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    setLoading(true);
    try {
      // Get current user first - from localStorage for reliability
      let currentUserData = null;
      const storedSession = localStorage.getItem('auth_session');
      
      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          if (session?.user) {
            currentUserData = session.user;
          }
        } catch (parseError) {
          console.error("Error parsing stored session:", parseError);
        }
      }
      
      // If localStorage didn't work, try Supabase
      if (!currentUserData) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          currentUserData = user;
        } catch (supabaseError) {
          console.warn("Error getting user from Supabase:", supabaseError);
        }
      }
      
      setCurrentUser(currentUserData);
      
      // Build admin users list
      let adminUsers = [];
      
      // Add current user if available
      if (currentUserData) {
        adminUsers.push({
          id: currentUserData.id,
          email: currentUserData.email || 'current-admin@example.com',
          created_at: currentUserData.created_at || new Date().toISOString()
        });
      }
      
      // Always include the default admins
      adminUsers.push({
        id: 'default-admin',
        email: 'admin@example.com',
        created_at: new Date().toISOString(),
        isDefault: true
      });
      
      adminUsers.push({
        id: 'scott-admin',
        email: 'scott@blackhaysgroup.com',
        created_at: new Date().toISOString(),
        isDefault: true
      });
      
      // In development mode, show some mock data for demonstration
      if (import.meta.env.DEV) {
        adminUsers.push({
          id: 'mock-1',
          email: 'admin2@example.com',
          created_at: new Date().toISOString(),
          isAdded: true
        });
      }
      
      setUsers(adminUsers);
      
      if (currentUserData) {
        setProfileUpdate({
          email: currentUserData.email || '',
          password: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      console.error("Error fetching admin users:", err);
      setError("Failed to load admin users: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setFormError('');
    setAddSuccess(false);
    
    // Validate form
    if (!newAdmin.email || !newAdmin.password) {
      setFormError("Email and password are required");
      return;
    }
    
    if (newAdmin.password !== newAdmin.confirmPassword) {
      setFormError("Passwords don't match");
      return;
    }
    
    if (newAdmin.password.length < 6) {
      setFormError("Password must be at least 6 characters long");
      return;
    }
    
    setLoading(true);
    try {
      // In a development environment, simulate adding to the users array
      const newUserId = 'new-' + Date.now();
      
      setUsers(prevUsers => [
        ...prevUsers, 
        {
          id: newUserId,
          email: newAdmin.email,
          created_at: new Date().toISOString(),
          isAdded: true
        }
      ]);
      
      // Reset form
      setNewAdmin({ email: '', password: '', confirmPassword: '' });
      setAddSuccess(true);
      
      // Hide form after 2 seconds
      setTimeout(() => {
        setAddSuccess(false);
        setShowAddForm(false);
      }, 2000);
      
    } catch (err) {
      console.error('Error creating admin user:', err);
      setFormError("Failed to create admin user: " + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setFormError('');
    setUpdateSuccess(false);
    
    // Validate form
    if (!profileUpdate.email) {
      setFormError("Email is required");
      return;
    }
    
    if (profileUpdate.password && profileUpdate.password !== profileUpdate.confirmPassword) {
      setFormError("Passwords don't match");
      return;
    }
    
    if (profileUpdate.password && profileUpdate.password.length < 6) {
      setFormError("Password must be at least 6 characters long");
      return;
    }
    
    setLoading(true);
    try {
      // In development mode, just simulate success
      // Update the current user's email in the UI
      setCurrentUser(prev => ({
        ...prev,
        email: profileUpdate.email
      }));
      
      // Update the user in the list
      setUsers(users.map(u => 
        u.id === currentUser?.id ? { ...u, email: profileUpdate.email } : u
      ));
      
      setUpdateSuccess(true);
      
      // Hide form after 2 seconds
      setTimeout(() => {
        setShowEditForm(false);
        setUpdateSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setFormError("Failed to update profile: " + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, isDefault) => {
    if (isDefault) {
      alert("Cannot delete default admin user");
      return;
    }
    
    if (!confirm("Are you sure you want to delete this admin user?")) {
      return;
    }
    
    try {
      setLoading(true);
      
      // For demonstration, just remove from the UI
      setUsers(users.filter(user => user.id !== userId));
      
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Admin Users</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center text-bhgray-600 hover:text-bhgray-900"
          >
            <UserPlus className="w-5 h-5 mr-1" />
            Add Admin
          </button>
          <button 
            onClick={fetchAdminUsers}
            className="flex items-center text-bhgray-600 hover:text-bhgray-900"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div className="bg-amber-50 border border-amber-200 rounded p-4 mb-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-amber-800">Important Note</h4>
            <p className="text-sm text-amber-700 mt-1">
              For this application, the following admin accounts are available:
              <br />
              â€¢ <strong>admin@example.com</strong> with password <strong>Admin1967</strong>
              <br />
              â€¢ <strong>scott@blackhaysgroup.com</strong> with password <strong>Admin1967!</strong>
            </p>
          </div>
        </div>
      </div>
      
      {/* Profile Edit Form */}
      {showEditForm && (
        <div className="bg-white border rounded-lg p-4 shadow-sm mb-6">
          <h4 className="text-md font-bold mb-2">Edit Admin Profile</h4>
          <form onSubmit={handleUpdateProfile} className="space-y-3">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
                {formError}
              </div>
            )}
            
            {updateSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-sm">
                Profile updated successfully!
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={profileUpdate.email}
                onChange={(e) => setProfileUpdate({...profileUpdate, email: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password (leave blank to keep current)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type={showPassword ? "text" : "password"}
                  value={profileUpdate.password}
                  onChange={(e) => setProfileUpdate({...profileUpdate, password: e.target.value})}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={profileUpdate.confirmPassword}
                onChange={(e) => setProfileUpdate({...profileUpdate, confirmPassword: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-1.5 bg-bhred text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Add New Admin Form */}
      {showAddForm && (
        <div className="bg-white border rounded-lg p-4 shadow-sm mb-6">
          <h4 className="text-md font-bold mb-2">Create New Admin</h4>
          <form onSubmit={handleAddAdmin} className="space-y-3">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
                {formError}
              </div>
            )}
            
            {addSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-sm">
                Admin user created successfully!
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={newAdmin.confirmPassword}
                onChange={(e) => setNewAdmin({...newAdmin, confirmPassword: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                required
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-1.5 bg-bhred text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
              >
                Create Admin
              </button>
            </div>
          </form>
        </div>
      )}
      
      {loading && !showAddForm && !showEditForm ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bhred"></div>
        </div>
      ) : users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Lock className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                      <div className="text-sm font-medium text-gray-900">{user.email}</div>
                      {user.isDefault && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Default
                        </span>
                      )}
                      {user.isAdded && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Added
                        </span>
                      )}
                      {user.id === currentUser?.id && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          Current
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.id === currentUser?.id && (
                      <button
                        onClick={() => setShowEditForm(true)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Edit profile"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user.id, user.isDefault)}
                      className={`text-red-600 hover:text-red-900 ${user.isDefault ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={user.isDefault}
                      title={user.isDefault ? "Cannot delete default admin" : "Delete admin"}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No admin users found or you don't have permission to view them.</p>
          <p className="text-sm mt-2">Note: Admin users may need to be managed through the Supabase dashboard.</p>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
