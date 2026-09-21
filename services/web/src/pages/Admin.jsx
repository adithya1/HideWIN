import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmailTemplates from './EmailTemplates';
import RichTextEditor from '../components/RichTextEditor';
import { Globe, Mail, ShieldCheck, LayoutDashboard, Users, CreditCard, Settings, LogOut, Sun, Moon, Activity, Key, Smartphone, HardDrive, DownloadCloud, Server, Cpu, Database, Network, Trash2, Box, X, Zap, Edit2, Eye, EyeOff, Upload , ChevronDown, ChevronRight} from "lucide-react";

const MODEL_HIERARCHY = {
  openai: { name: 'OpenAI', models: [{id: 'gpt-4o', name: 'GPT-4o'}, {id: 'gpt-4o-mini', name: 'GPT-4o Mini'}] },
  google: { name: 'Google (Gemini)', models: [{id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro'}, {id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash'}, {id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash'}] },
  anthropic: { name: 'Anthropic', models: [{id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet'}, {id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku'}] },
  groq: { name: 'Groq (Llama/Mixtral)', models: [{id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B'}, {id: 'llama3-70b-8192', name: 'Llama 3 70B'}, {id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7b'}] },
  deepseek: { name: 'DeepSeek', models: [{id: 'deepseek-chat', name: 'DeepSeek Chat V3'}, {id: 'deepseek-reasoner', name: 'DeepSeek Reasoner (R1)'}] }
};

const getProviderFromModel = (modelId) => {
  for (const [provider, data] of Object.entries(MODEL_HIERARCHY)) {
    if (data.models.find(m => m.id === modelId)) return provider;
  }
  return 'openai';
};

const HierarchicalModelSelect = ({ label, value, onChange }) => {
  const currentProvider = getProviderFromModel(value);
  const [selectedProvider, setSelectedProvider] = useState(currentProvider);

  useEffect(() => {
    setSelectedProvider(getProviderFromModel(value));
  }, [value]);

  return (
    <div style={{ display: 'flex', gap: '8px', gridColumn: 'span 1' }}>
       <div style={{ flex: 1 }} className="input-group">
         <label className="input-label">{label} - Provider</label>
         <select className="select-field" value={selectedProvider} onChange={(e) => {
            setSelectedProvider(e.target.value);
            onChange(MODEL_HIERARCHY[e.target.value].models[0].id);
         }}>
            {Object.entries(MODEL_HIERARCHY).map(([key, data]) => (
              <option key={key} value={key}>{data.name}</option>
            ))}
         </select>
       </div>
       <div style={{ flex: 1 }} className="input-group">
         <label className="input-label">Model</label>
         <select className="select-field" value={value} onChange={(e) => onChange(e.target.value)}>
            {MODEL_HIERARCHY[selectedProvider]?.models.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
         </select>
       </div>
    </div>
  );
};

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
    const [activeSettingsTab, setActiveSettingsTab] = useState('email_templates');
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ action_trigger: '', title: '', subject: '', body_html: '' });
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [showKeys, setShowKeys] = useState({});

  const toggleKeyVisibility = (keyId) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  // Dummy Dashboard Data

  const data = {
    overview: {
      users: 1240,
      active: 892,
      revenue: '$14,200',
      mrrGrowth: '+12.4%',
    },
    users: [
      { id: 1, name: 'Tony Stark', email: 'tony@starkindustries.com', role: 'Premium', status: 'Active', lastLogin: '2 mins ago' },
      { id: 2, name: 'Bruce Wayne', email: 'bruce@wayneenterprises.com', role: 'Premium', status: 'Active', lastLogin: '1 hour ago' },
      { id: 3, name: 'Peter Parker', email: 'peter@dailybugle.com', role: 'Free', status: 'Pending', lastLogin: '3 days ago' },
      { id: 4, name: 'Steve Rogers', email: 'steve@shield.gov', role: 'Admin', status: 'Active', lastLogin: 'Just now' },
    ],
    sessions: [
      { device: 'MacBook Pro 16"', location: 'New York, USA', ip: '192.168.1.1', time: 'Active now' },
      { device: 'iPhone 14 Pro', location: 'New York, USA', ip: '10.0.0.5', time: '2 hours ago' }
    ],
    aiKeys: {
      gemini: [
        { id: 'g1', key: 'AIzaSyC***************************3D', status: 'Active', enabled: true },
        { id: 'g2', key: 'AIzaSyA***************************9X', status: 'Disabled', enabled: false }
      ],
      openai: [
        { id: 'o1', key: 'sk-proj-***************************8k', status: 'Active', enabled: true },
        { id: 'o2', key: 'sk-proj-***************************4a', status: 'Cooldown (429)', enabled: true }
      ],
      groq: [
        { id: 'q1', key: 'gsk_***************************3z', status: 'Active', enabled: true }
      ],
      claude: [
        { id: 'c1', key: 'sk-ant-***************************8u', status: 'Active', enabled: true }
      ],
      custom: [
        { id: 'cu1', name: 'Internal Local Server', url: 'http://10.0.0.1:11434', key: 'ollama-key', status: 'Active', enabled: true }
      ]
    }
  };

  const [aiKeys, setAiKeys] = useState({
    gemini: [],
    openai: [],
    groq: [],
    claude: [],
    deepseek: [],
    custom: []
  });
  const [appSettings, setAppSettings] = useState({
    high_tier_model: 'gpt-4o',
    fast_tier_model: 'gemini-1.5-flash',
    fallback_provider: 'anthropic'
  });
  const [sttConfigs, setSttConfigs] = useState([]);
  const [sttForm, setSttForm] = useState({ groq_key: '', deepgram_key: '', custom_name: '', custom_url: '', custom_key: '', groq_buffer: '3' });
  const [sttTestResults, setSttTestResults] = useState({});
  const [sttSaving, setSttSaving] = useState('');

  const [dbUsers, setDbUsers] = useState([]);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, payload: null });
  const [modalForm, setModalForm] = useState({ email: '', password: '', role: 'USER', provider: '', apiKey: '', customUrl: '' });
  const [modalError, setModalError] = useState('');
  const [fetchedModels, setFetchedModels] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);
  const [isFetchingModels, setIsFetchingModels] = useState(false);


  const [smtpConfig, setSmtpConfig] = useState({ smtp_host: '', smtp_port: 587, smtp_user: '', smtp_pass: '' });
  const [smtpTestEmail, setSmtpTestEmail] = useState('');
  const [smtpStatus, setSmtpStatus] = useState({ loading: false, message: '', error: false });
  const [smtpEnv, setSmtpEnv] = useState('production');


  useEffect(() => {
    if (activeSettingsTab === 'email_templates' && emailTemplates.length === 0) {
      fetch('http://127.0.0.1:8000/admin-system/email-templates', { headers: { 'Authorization': `Bearer ${localStorage.getItem('hidewin_token')}` }})
        .then(res => res.json())
        .then(data => {
            if(Array.isArray(data)) {
                setEmailTemplates(data);
                if(data.length > 0) setSelectedTemplate(data[0]);
            }
        })
        .catch(console.error);
    }
  }, [activeSettingsTab]);


  const createTemplate = async () => {
    if (!newTemplate.action_trigger || !newTemplate.title) return alert("Trigger and Title are required");
    try {
        const res = await fetch(`http://127.0.0.1:8000/admin-system/email-templates`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('hidewin_token')}`
            },
            body: JSON.stringify(newTemplate)
        });
        if (res.ok) {
            const created = await res.json();
            setEmailTemplates([...emailTemplates, created]);
            setIsAddingTemplate(false);
            setSelectedTemplate(created);
            setNewTemplate({ action_trigger: '', title: '', subject: '', body_html: '' });
            alert("Template created successfully!");
        }
        else {
            const err = await res.json();
            alert("Failed to create template: " + (err.detail || 'Unknown error'));
        }
    } catch (e) {
        alert("Error creating template.");
    }
  };

  const saveTemplate = async () => {
    if (!selectedTemplate) return;
    try {
        const res = await fetch(`http://127.0.0.1:8000/admin-system/email-templates/${selectedTemplate.action_trigger}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('hidewin_token')}`
            },
            body: JSON.stringify({
                title: selectedTemplate.title,
                subject: selectedTemplate.subject,
                body_html: selectedTemplate.body_html
            })
        });
        if (res.ok) alert("Template saved successfully!");
        else alert("Failed to save template.");
    } catch (e) {
        alert("Error saving template.");
    }
  };

  const fetchAiData = async () => {
    try {
      const token = localStorage.getItem('hidewin_token');
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      
      const keysRes = await fetch('http://127.0.0.1:8000/admin/llm/keys', { headers });
      if (keysRes.ok) {
        const data = await keysRes.json();
        setAiKeys({ gemini: data.aiKeys.gemini || [], openai: data.aiKeys.openai || [], groq: data.aiKeys.groq || [], claude: data.aiKeys.claude || [], deepseek: data.aiKeys.deepseek || [], custom: data.aiKeys.custom || [] });
      }
      
      const settingsRes = await fetch('http://127.0.0.1:8000/admin/settings', { headers });
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setAppSettings(prev => ({ ...prev, ...data.settings }));
        if (data.settings.browser_icon_url) {
          const link = document.querySelector("link[rel~='icon']");
          if (link) { link.href = data.settings.browser_icon_url; }
        }
      }

      const smtpRes = await fetch('http://127.0.0.1:8000/api/admin/smtp', { headers });
      if (smtpRes.ok) {
        const data = await smtpRes.json();
        if (data.config) {
          setSmtpConfig(prev => ({ ...prev, ...data.config }));
        }
      }

      // Load STT configs
      const sttRes = await fetch('http://127.0.0.1:8000/admin/stt/config');
      if (sttRes.ok) {
        const data = await sttRes.json();
        setSttConfigs(data.configs || []);
        // Populate buffer setting for groq if saved
        const groqCfg = (data.configs || []).find(c => c.provider_name === 'groq');
        if (groqCfg) setSttForm(prev => ({ ...prev, groq_buffer: String(groqCfg.buffer_seconds || 3) }));
      }
    } catch (e) {
      console.error("Failed to fetch admin data", e);
    }
  };

  
  const handleFetchGroqModels = async () => {
    const key = sttForm.groq_key;
    if (!key) { alert('Please enter a Groq API key first'); return; }
    try {
      const res = await fetch('http://127.0.0.1:8000/admin/llm/fetch-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'groq', api_key_value: key })
      });
      if (!res.ok) throw new Error('Invalid API Key or network error');
      const data = await res.json();
      setSttGroqModels(data.models.sort());
      setSttGroqModelsSelected(data.models); // Select all by default
      alert('Models loaded successfully');
    } catch (e) {
      alert('Error fetching models: ' + e.message);
    }
  };

  const handleSaveGroqPool = async () => {
    const key = sttForm.groq_key;
    if (!key) return;
    setSttSaving('groq');
    try {
      const res = await fetch('http://127.0.0.1:8000/admin/llm/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'groq', api_key_value: key, enabled_models: sttGroqModelsSelected })
      });
      if (!res.ok) throw new Error('Failed to save to Cloud Pool');
      alert('Key and Model Pool saved successfully to backend cluster!');
      fetchAiData();
    } catch (e) {
      alert('Error saving: ' + e.message);
    }
    setSttSaving(null);
  };

  const handleSaveSttKey = async (providerName) => {
    const modeMap = { groq: 'groq_rest', deepgram: 'deepgram_ws', local: 'local_ws', custom: 'custom_ws' };
    const keyMap  = { groq: 'groq_key', deepgram: 'deepgram_key', custom: 'custom_key' };
    const apiKey  = sttForm[keyMap[providerName]] || '';
    if (!apiKey || apiKey.startsWith('Saved:')) { alert('Enter a new API key to save'); return; }
    setSttSaving(providerName);
    try {
      const payload = {
        provider_name: providerName,
        mode: modeMap[providerName] || 'local_ws',
        api_key: apiKey,
        is_enabled: true,
        is_active: false,
        priority: 1,
        buffer_seconds: parseInt(sttForm.groq_buffer || '3'),
        ...(providerName === 'custom' ? { custom_url: sttForm.custom_url, custom_name: sttForm.custom_name || 'Custom' } : {})
      };
      const r = await fetch('http://127.0.0.1:8000/admin/stt/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error(await r.text());
      fetchAiData();
      alert(`Success! ${providerName} STT key has been saved.`);
    } catch(e) { alert('Save failed: ' + e.message); }
    setSttSaving('');
  };

  const handleActivateStt = async (providerName, mode) => {
    try {
      const payload = { provider_name: providerName, mode, is_enabled: true, is_active: true, priority: 1, buffer_seconds: parseInt(sttForm.groq_buffer || '3') };
      const r = await fetch('http://127.0.0.1:8000/admin/stt/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error(await r.text());
      fetchAiData();
    } catch(e) { alert('Activate failed: ' + e.message); }
  };

  const handleTestStt = async (providerName) => {
    setSttTestResults(prev => ({ ...prev, [providerName]: { loading: true } }));
    try {
      const r = await fetch('http://127.0.0.1:8000/admin/stt/config/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider_name: providerName }) });
      const data = await r.json();
      setSttTestResults(prev => ({ ...prev, [providerName]: data }));
    } catch(e) {
      setSttTestResults(prev => ({ ...prev, [providerName]: { status: 'error', message: 'Cannot reach backend' } }));
    }
  };



  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('hidewin_token');
      const res = await fetch('http://127.0.0.1:8000/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDbUsers(data.users);
      } else if (res.status === 403) {
        alert("You do not have Administrator privileges. Please sign in with an Admin account.");
        handleLogout();
      }
    } catch (e) {
      console.error("Failed to fetch users", e);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('hidewin_token');
    if (!token) {
      navigate('/login');
    } else {
      fetchAiData();
      fetchUsers();
    }
  }, [navigate]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem('hidewin_token');
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

      const handleAddKey = (provider) => {
      setModalForm(prev => ({ ...prev, provider, apiKey: '', customUrl: '' }));
      setModalError('');
      setFetchedModels([]);
      setSelectedModels([]);
      setModalConfig({ isOpen: true, type: 'ADD_KEY', payload: { provider } });
    };

  const handleToggleKey = async (id, currentState) => {
    try {
      const token = localStorage.getItem('hidewin_token');
      await fetch(`http://127.0.0.1:8000/admin/llm/keys/${id}/toggle`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchAiData();
    } catch (e) {
      alert("Error toggling key");
    }
  };

  const handleDeleteKey = (id) => {
    setModalConfig({ isOpen: true, type: 'DELETE_KEY', payload: { id } });
  };

  const handleSettingChange = async (key, value) => {
    setAppSettings(prev => ({ ...prev, [key]: value }));
    try {
      const token = localStorage.getItem('hidewin_token');
      await fetch('http://127.0.0.1:8000/admin/settings', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      });
      fetchAiData();
    } catch (e) {
      alert("Error saving setting");
    }
  };

  const handleSaveSmtp = async () => {
    setSmtpStatus({ loading: true, message: '', error: false });
    try {
      const token = localStorage.getItem('hidewin_token');
      const res = await fetch('http://127.0.0.1:8000/api/admin/smtp', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpConfig)
      });
      if (!res.ok) throw new Error("Failed to save SMTP config");
      setSmtpStatus({ loading: false, message: 'Configuration saved successfully!', error: false });
      setTimeout(() => setSmtpStatus({ loading: false, message: '', error: false }), 3000);
    } catch (e) {
      setSmtpStatus({ loading: false, message: e.message, error: true });
    }
  };

  const handleTestSmtp = async () => {
    if (!smtpTestEmail) {
      setSmtpStatus({ loading: false, message: 'Please enter a test email address', error: true });
      return;
    }
    setSmtpStatus({ loading: true, message: 'Sending test email...', error: false });
    try {
      const token = localStorage.getItem('hidewin_token');
      const res = await fetch('http://127.0.0.1:8000/api/admin/smtp/test', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ test_email: smtpTestEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to send test email");
      setSmtpStatus({ loading: false, message: 'Test email sent successfully!', error: false });
    } catch (e) {
      setSmtpStatus({ loading: false, message: e.message, error: true });
    }
  };

  const handleAddUser = () => {
    setModalForm(prev => ({ ...prev, email: '', password: '', role: 'USER' }));
    setModalError('');
    setModalConfig({ isOpen: true, type: 'ADD_USER' });
  };

  const handleDeleteUser = (id) => {
    setModalConfig({ isOpen: true, type: 'DELETE_USER', payload: { id } });
  };


  const handleUnblockUser = async (userId) => {
    if (!window.confirm('Are you sure you want to unblock this user?')) return;
    try {
      const token = localStorage.getItem('hidewin_token');
      const res = await fetch(`http://127.0.0.1:8000/admin/users/${userId}/unblock`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('User unblocked successfully');
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.detail || 'Failed to unblock user');
      }
    } catch (e) {
      alert('Error connecting to server');
    }
  };

  const handleEditUser = (user) => {

    setModalForm(prev => ({ ...prev, email: user.email, password: '', role: user.role }));
    setModalError('');
    setModalConfig({ isOpen: true, type: 'UPDATE_USER', payload: { id: user.id } });
  };

  
  const handleFetchModels = async (provider, apiKey) => {
    if (!apiKey) { setModalError('Please enter an API key first'); return; }
    setIsFetchingModels(true);
    setModalError('');
    try {
      const res = await fetch('http://127.0.0.1:8000/admin/llm/fetch-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, api_key_value: apiKey })
      });
      if (!res.ok) throw new Error('Failed to fetch models or Invalid API Key');
      const data = await res.json();
      setFetchedModels(data.models.sort());
      setSelectedModels(data.models); // default select all
    } catch (e) {
      setModalError(e.message);
    }
    setIsFetchingModels(false);
  };

  const submitModal = async () => {
    const { type, payload } = modalConfig;
    setModalError('');
    const token = localStorage.getItem('hidewin_token');

    const handleRes = async (res) => {
      if (!res.ok) {
        let errStr = "An error occurred";
        try {
          const errData = await res.json();
          console.error("Backend Error:", errData);
          if (Array.isArray(errData.detail)) {
             errStr = errData.detail.map(e => e.msg).join(', ');
          } else {
             errStr = errData.detail || errStr;
          }
        } catch(e) {}
        throw new Error(errStr);
      }
      return await res.json();
    };

    try {
      if (type === 'ADD_USER') {
        if (!modalForm.email || !modalForm.password) {
          setModalError('Email and password are required');
          return;
        }
        const res = await fetch(`http://127.0.0.1:8000/api/admin/user/create?role=${modalForm.role}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: modalForm.email, password: modalForm.password })
        });
        await handleRes(res);
        fetchUsers();
      } 
      else if (type === 'DELETE_USER') {
        const res = await fetch(`http://127.0.0.1:8000/api/admin/user/${payload.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        await handleRes(res);
        fetchUsers();
      }
      else if (type === 'UPDATE_USER') {
        const res = await fetch(`http://127.0.0.1:8000/api/admin/user/${payload.id}/role`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: modalForm.role })
        });
        await handleRes(res);
        fetchUsers();
      }
              else if (type === 'ADD_KEY') {
          if (!modalForm.apiKey) {
            setModalError('API Key is required');
            return;
          }
          const res = await fetch('http://127.0.0.1:8000/admin/llm/keys', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider: payload.provider, api_key_value: modalForm.apiKey, custom_url: modalForm.customUrl || null, is_enabled: true, enabled_models: selectedModels })
          });
          await handleRes(res);
          fetchAiData();
        }
      else if (type === 'DELETE_KEY') {
        const res = await fetch(`http://127.0.0.1:8000/admin/llm/keys/${payload.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        await handleRes(res);
        fetchAiData();
      }
      
      // Close modal on success
      setModalConfig({ isOpen: false, type: null, payload: null });
    } catch (e) {
      setModalError(e.message || "An error occurred");
    }
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="slider"></span>
    </label>
  );

  return (
    <div className="dashboard-layout">
      <aside className="sidebar custom-scrollbar" style={{ width: '250px', minWidth: '250px', borderRight: '1px solid #e0e0e0', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', overflowY: 'auto' }}>
            <style>
                {`
                    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #8f8f8f; border-radius: 10px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #707070; }
                `}
            </style>
            <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                <img src={(theme === 'dark' ? appSettings?.logo_dark_url : appSettings?.logo_light_url) || appSettings?.logo_light_url || appSettings?.logo_dark_url || "/logo.png"} alt="HideWin" style={{ maxHeight: '36px', maxWidth: '100%', objectFit: 'contain' }} />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 12px' }}>
                
                {/* Regular Items */}
                <button onClick={() => setActiveTab('overview')} style={{
                    display: 'flex', alignItems: 'center', padding: '10px 16px', borderRadius: '6px',
                    border: 'none', background: activeTab === 'overview' ? '#f0f4ff' : 'transparent',
                    color: activeTab === 'overview' ? '#1a73e8' : '#5f6368',
                    fontWeight: activeTab === 'overview' ? '600' : '500', fontSize: '15px', position: 'relative', cursor: 'pointer', textAlign: 'left'
                }}>
                    {activeTab === 'overview' && <div style={{ position: 'absolute', left: '-12px', top: '10px', bottom: '10px', width: '3px', backgroundColor: '#1a73e8', borderRadius: '0 4px 4px 0' }} />}
                    <LayoutDashboard size={18} style={{ marginRight: '16px', color: activeTab === 'overview' ? '#1a73e8' : '#5f6368' }} strokeWidth={activeTab === 'overview' ? 2.5 : 2} />
                    Overview
                </button>

                <button onClick={() => setActiveTab('users')} style={{
                    display: 'flex', alignItems: 'center', padding: '10px 16px', borderRadius: '6px',
                    border: 'none', background: activeTab === 'users' ? '#f0f4ff' : 'transparent',
                    color: activeTab === 'users' ? '#1a73e8' : '#5f6368',
                    fontWeight: activeTab === 'users' ? '600' : '500', fontSize: '15px', position: 'relative', cursor: 'pointer', textAlign: 'left'
                }}>
                    {activeTab === 'users' && <div style={{ position: 'absolute', left: '-12px', top: '10px', bottom: '10px', width: '3px', backgroundColor: '#1a73e8', borderRadius: '0 4px 4px 0' }} />}
                    <Users size={18} style={{ marginRight: '16px', color: activeTab === 'users' ? '#1a73e8' : '#5f6368' }} strokeWidth={activeTab === 'users' ? 2.5 : 2} />
                    Users
                </button>

                <button onClick={() => setActiveTab('billing')} style={{
                    display: 'flex', alignItems: 'center', padding: '10px 16px', borderRadius: '6px',
                    border: 'none', background: activeTab === 'billing' ? '#f0f4ff' : 'transparent',
                    color: activeTab === 'billing' ? '#1a73e8' : '#5f6368',
                    fontWeight: activeTab === 'billing' ? '600' : '500', fontSize: '15px', position: 'relative', cursor: 'pointer', textAlign: 'left'
                }}>
                    {activeTab === 'billing' && <div style={{ position: 'absolute', left: '-12px', top: '10px', bottom: '10px', width: '3px', backgroundColor: '#1a73e8', borderRadius: '0 4px 4px 0' }} />}
                    <CreditCard size={18} style={{ marginRight: '16px', color: activeTab === 'billing' ? '#1a73e8' : '#5f6368' }} strokeWidth={activeTab === 'billing' ? 2.5 : 2} />
                    Billing
                </button>

                <div style={{ margin: '24px 16px 12px 16px', fontSize: '11px', fontWeight: '600', color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    SETTINGS
                </div>

                <div 
                    onClick={() => { setActiveTab('settings'); if (!activeSettingsTab) setActiveSettingsTab('security'); }}
                    style={{
                        display: 'flex', alignItems: 'center', padding: '10px 16px', borderRadius: '6px',
                        cursor: 'pointer', color: activeTab === 'settings' ? '#202124' : '#5f6368',
                        background: 'transparent', border: 'none', fontWeight: '500', fontSize: '15px', textAlign: 'left', width: '100%'
                    }}
                >
                    <Settings size={18} style={{ marginRight: '16px', color: activeTab === 'settings' ? '#202124' : '#5f6368' }} />
                    <span style={{ flex: 1 }}>Configuration</span>
                    {activeTab === 'settings' ? <ChevronDown size={16} color="#5f6368" /> : <ChevronRight size={16} color="#5f6368" />}
                </div>

                {activeTab === 'settings' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '8px' }}>
                        {[
                            { id: 'security', label: 'Security & Auth' },
                            { id: 'ai_models', label: 'AI Models & Keys' },
                            { id: 'transcription', label: 'Live Transcription' },
                            { id: 'architecture', label: 'Architecture' },
                            { id: 'dns', label: 'DNS & Network' },
                            { id: 'email_templates', label: 'Email Templates' },
                            { id: 'branding', label: 'Branding & Logos' }
                        ].map(sub => {
                            const isActive = activeSettingsTab === sub.id;
                            return (
                                <button key={sub.id} onClick={() => setActiveSettingsTab(sub.id)} style={{
                                    display: 'block', padding: '10px 16px 10px 50px', borderRadius: '6px',
                                    border: 'none', background: isActive ? '#f0f4ff' : 'transparent',
                                    color: isActive ? '#1a73e8' : '#6c7f93',
                                    fontWeight: isActive ? '500' : '400', fontSize: '14px', textAlign: 'left', cursor: 'pointer', width: '100%'
                                }}>
                                    {sub.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
            
            <div style={{ marginTop: 'auto', borderTop: '1px solid #e0e0e0', padding: '12px' }}>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, padding: '12px', width: '100%', borderRadius: '8px' }}>
                    <LogOut size={20} style={{ marginRight: '8px' }} /> Sign out
                </button>
            </div>
        </aside>
      
      <main className="main-content" style={{ overflowY: 'auto' }}>
        <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 className="page-title" style={{ textTransform: 'capitalize' }}>{activeTab.replace('-', ' ')}</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Manage your high-performance enterprise environment.</p>
          </div>
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#10b981', fontWeight: 500, fontSize: '14px', background: 'rgba(16, 185, 129, 0.1)', padding: '8px 16px', borderRadius: '9999px' }}>
              <Activity size={16} /> All Systems Operational
            </div>
          )}
        </header>

        {activeTab === 'overview' && (
          <div className="tab-content fade-in">
            <div className="metric-grid">
              <div className="card metric-card">
                <span className="metric-title">Total Users</span>
                <span className="metric-value">{data.overview.users}</span>
                <span className="metric-change positive">â†‘ 12% vs last month</span>
              </div>
              <div className="card metric-card">
                <span className="metric-title">Active Devices</span>
                <span className="metric-value">{data.overview.active}</span>
                <span className="metric-change positive">â†‘ 5% vs last month</span>
              </div>
              <div className="card metric-card">
                <span className="metric-title">Monthly Revenue</span>
                <span className="metric-value">{data.overview.revenue}</span>
                <span className="metric-change positive">â†‘ {data.overview.mrrGrowth} vs last month</span>
              </div>
            </div>

            <div className="card">
              <h2 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: 600 }}>System Health Overview</h2>
              <div style={{ display: 'flex', gap: '40px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}><HardDrive size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: '-3px' }}/> Server Capacity</span>
                    <span>42%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '42%', height: '100%', background: 'var(--primary)' }}></div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}><DownloadCloud size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: '-3px' }}/> Network Traffic</span>
                    <span>78%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '78%', height: '100%', background: '#f59e0b' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="tab-content fade-in">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button className="btn-primary" onClick={handleAddUser} style={{ width: 'auto', padding: '8px 16px' }}>+ Add User</button>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dbUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div className="user-avatar">{getInitials(user.full_name || user.email)}</div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{user.full_name || 'No Name'}</div>
                            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{user.role}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span className={`badge ${user.is_suspended ? 'badge-pending' : 'badge-active'}`}>
                            {user.is_suspended ? 'Suspended' : 'Active'}
                          </span>
                          {user.admin_unblock_required && (
                            <span className="badge" style={{ background: '#fef2f2', color: '#ef4444' }}>Locked</span>
                          )}
                          {user.blocked_until && !user.admin_unblock_required && (
                            <span className="badge" style={{ background: '#fffbeb', color: '#d97706' }}>Cooldown</span>
                          )}
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => handleEditUser(user)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit User">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteUser(user.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete User">
                              <Trash2 size={16} />
                            </button>
                            {(user.admin_unblock_required || user.blocked_until) && (
                              <button onClick={() => handleUnblockUser(user.id)} style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Unblock User">
                                <ShieldCheck size={16} />
                              </button>
                            )}
                          </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BILLING TAB */}
        {activeTab === 'billing' && (
          <div className="tab-content fade-in">
            <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary), #1e3a8a)', color: 'white', border: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 500, opacity: 0.9, marginBottom: '8px' }}>Enterprise Plan</h3>
                  <div style={{ fontSize: '36px', fontWeight: 700 }}>$14,200 <span style={{ fontSize: '16px', fontWeight: 400, opacity: 0.8 }}>/ ARR</span></div>
                </div>
                <button style={{ background: 'white', color: 'var(--primary)', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Manage Subscription</button>
              </div>
            </div>
            
            <div className="card">
              <h3 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: 600 }}>Recent Invoices</h3>
              <table className="data-table" style={{ margin: '-24px', width: 'calc(100% + 48px)' }}>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 500 }}>INV-2026-001</td>
                    <td style={{ color: 'var(--text-muted)' }}>Aug 01, 2026</td>
                    <td>$1,183.33</td>
                    <td><span className="badge badge-active">Paid</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500 }}>INV-2026-002</td>
                    <td style={{ color: 'var(--text-muted)' }}>Jul 01, 2026</td>
                    <td>$1,183.33</td>
                    <td><span className="badge badge-active">Paid</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* NESTED SETTINGS TAB */}
        {activeTab === 'branding' && (
          <div className="tab-content fade-in settings-layout">
            <div className="settings-main">
              <div className="settings-card">
                <h3 className="section-title">Brand Logos</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label">Light Logo URL</label>
                    <input type="text" className="input-field" placeholder="https://example.com/logo-light.svg" value={appSettings?.logo_light_url || ''} onChange={e => handleSettingChange('logo_light_url', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Dark Logo URL</label>
                    <input type="text" className="input-field" placeholder="https://example.com/logo-dark.svg" value={appSettings?.logo_dark_url || ''} onChange={e => handleSettingChange('logo_dark_url', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Browser Icon (Favicon) URL</label>
                    <input type="text" className="input-field" placeholder="https://example.com/favicon.ico" value={appSettings?.browser_icon_url || ''} onChange={e => handleSettingChange('browser_icon_url', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-sidebar">
              <div className="settings-card">
                <h3 className="section-title">Save Changes</h3>
                <p className="text-muted" style={{ marginBottom: '16px', fontSize: '14px' }}>
                  Update your branding settings globally.
                </p>
                <button className="btn-primary" onClick={saveSettings} style={{ width: '100%' }}>
                  Apply Branding
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="tab-content fade-in settings-layout">
            

            {/* Settings Content */}
            <div className="settings-content">
              
              {/* BRANDING & LOGOS */}
              {activeSettingsTab === 'branding' && (
                <div className="fade-in">
                  <div className="card">
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
                      <div style={{ padding: '12px', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', borderRadius: '12px' }}>
                        <Sun size={24} />
                      </div>
                      <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Brand Identity</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Upload your official logos and favicon here.</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      
                      {/* Light Logo */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-subtle)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '120px', height: '60px', background: '#ffffff', border: '1px dashed #d1d5db', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {appSettings?.logo_light_url ? <img src={appSettings.logo_light_url} alt="Light Logo" style={{ maxHeight: '100%', maxWidth: '100%' }} /> : <span style={{fontSize: '12px', color: '#9ca3af'}}>Preview</span>}
                          </div>
                          <div>
                            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>Light Theme Logo</h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Displayed on light backgrounds.</p>
                          </div>
                        </div>
                        <label className="btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', width: 'max-content', minWidth: '140px' }}>
                          <Upload size={16} /> Upload Image
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => handleSettingChange('logo_light_url', ev.target.result);
                              reader.readAsDataURL(file);
                            }
                          }} />
                        </label>
                      </div>
                      
                      {/* Dark Logo */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-subtle)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '120px', height: '60px', background: '#111827', border: '1px dashed #374151', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {appSettings?.logo_dark_url ? <img src={appSettings.logo_dark_url} alt="Dark Logo" style={{ maxHeight: '100%', maxWidth: '100%' }} /> : <span style={{fontSize: '12px', color: '#4b5563'}}>Preview</span>}
                          </div>
                          <div>
                            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>Dark Theme Logo</h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Displayed on dark backgrounds.</p>
                          </div>
                        </div>
                        <label className="btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', width: 'max-content', minWidth: '140px' }}>
                          <Upload size={16} /> Upload Image
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => handleSettingChange('logo_dark_url', ev.target.result);
                              reader.readAsDataURL(file);
                            }
                          }} />
                        </label>
                      </div>

                      {/* Favicon */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-subtle)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '60px', height: '60px', background: '#ffffff', border: '1px dashed #d1d5db', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {appSettings?.browser_icon_url ? <img src={appSettings.browser_icon_url} alt="Favicon" style={{ maxHeight: '32px', maxWidth: '32px' }} /> : <span style={{fontSize: '12px', color: '#9ca3af'}}>16x16</span>}
                          </div>
                          <div>
                            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>Browser Favicon</h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Browser tab icon (.ico or image).</p>
                          </div>
                        </div>
                        <label className="btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', width: 'max-content', minWidth: '140px' }}>
                          <Upload size={16} /> Upload Icon
                          <input type="file" accept="image/*,.ico" style={{ display: 'none' }} onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => handleSettingChange('browser_icon_url', ev.target.result);
                              reader.readAsDataURL(file);
                            }
                          }} />
                        </label>
                      </div>
                      
                    </div>
                    
                    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                      <button className="btn-primary" onClick={() => alert("Branding settings saved successfully!")} style={{ width: 'max-content', padding: '10px 24px' }}>
                        Save Branding Settings
                      </button>
                    </div>
                    
                  </div>
                </div>
              )}
              
              {/* SECURITY & AUTH */}
              {activeSettingsTab === 'security' && (
                <div className="fade-in">
                  <div className="card">
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
                      <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '12px' }}>
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Email OTP Configuration</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Configure your SMTP server for sending authentication OTPs.</p>
                      </div>
                    </div>
                    <div className="card" style={{ marginTop: '24px' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px' }}>
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>OTP Rate Limiting & Blocking</h2>
                          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Configure exponential backoff and permanent block for failed OTP attempts.</p>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gap: '16px', maxWidth: '500px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input 
                            type="checkbox" 
                            checked={appSettings?.otp_rate_limit_enabled ?? true}
                            onChange={(e) => handleSettingChange('otp_rate_limit_enabled', e.target.checked)}
                          />
                          <label>Enable Progressive Rate Limiting</label>
                        </div>
                        <div className="input-group">
                          <label className="input-label">Max Failed Attempts Before Lock</label>
                          <input type="number" className="input-field" value={appSettings?.otp_max_attempts || 3} onChange={e => handleSettingChange('otp_max_attempts', parseInt(e.target.value))} />
                        </div>
                        <div className="input-group">
                          <label className="input-label">Level 1 Block (Minutes)</label>
                          <input type="number" className="input-field" value={appSettings?.otp_block_duration_1_mins || 3} onChange={e => handleSettingChange('otp_block_duration_1_mins', parseInt(e.target.value))} />
                        </div>
                        <div className="input-group">
                          <label className="input-label">Level 2 Block (Minutes)</label>
                          <input type="number" className="input-field" value={appSettings?.otp_block_duration_2_mins || 10} onChange={e => handleSettingChange('otp_block_duration_2_mins', parseInt(e.target.value))} />
                        </div>
                        <div className="input-group">
                          <label className="input-label">Level 3 Block (Minutes)</label>
                          <input type="number" className="input-field" value={appSettings?.otp_block_duration_3_mins || 120} onChange={e => handleSettingChange('otp_block_duration_3_mins', parseInt(e.target.value))} />
                        </div>
                      </div>
                    </div>

                    
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                      <button 
                        className="btn-primary" 
                        onClick={() => setSmtpEnv('production')}
                        style={{ flex: 1, background: smtpEnv === 'production' ? 'var(--primary)' : 'var(--bg-subtle)', color: smtpEnv === 'production' ? 'white' : 'var(--text-main)', border: smtpEnv === 'production' ? 'none' : '1px solid var(--border)' }}
                      >
                        Production Environment
                      </button>
                      <button 
                        className="btn-primary" 
                        onClick={() => {
                          setSmtpEnv('test');
                          setSmtpConfig(prev => ({ ...prev, smtp_host: 'smtp.gmail.com', smtp_port: 587 }));
                        }}
                        style={{ flex: 1, background: smtpEnv === 'test' ? 'var(--primary)' : 'var(--bg-subtle)', color: smtpEnv === 'test' ? 'white' : 'var(--text-main)', border: smtpEnv === 'test' ? 'none' : '1px solid var(--border)' }}
                      >
                        Test Environment (Gmail)
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="input-group">
                        <label className="input-label">SMTP Host</label>
                        <input type="text" className="input-field" placeholder="e.g., smtp.sendgrid.net" value={smtpConfig.smtp_host} onChange={(e) => setSmtpConfig({...smtpConfig, smtp_host: e.target.value})} />
                      </div>
                      <div className="input-group">
                        <label className="input-label">SMTP Port</label>
                        <input type="number" className="input-field" placeholder="e.g., 587" value={smtpConfig.smtp_port} onChange={(e) => setSmtpConfig({...smtpConfig, smtp_port: e.target.value})} />
                      </div>
                      <div className="input-group">
                        <label className="input-label">SMTP Username</label>
                        <input type="text" className="input-field" placeholder="Email address or API Key" value={smtpConfig.smtp_user} onChange={(e) => setSmtpConfig({...smtpConfig, smtp_user: e.target.value})} />
                      </div>
                      <div className="input-group">
                        <label className="input-label">SMTP Password</label>
                        <input type="password" className="input-field" placeholder="App Password or API Secret" value={smtpConfig.smtp_pass} onChange={(e) => setSmtpConfig({...smtpConfig, smtp_pass: e.target.value})} />
                      </div>
                    </div>

                    <div style={{ marginTop: '16px', background: 'var(--bg-subtle)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Test Configuration</h3>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                        <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                          <label className="input-label">Send Test Email To</label>
                          <input type="email" className="input-field" placeholder="Enter an email to verify settings" value={smtpTestEmail} onChange={(e) => setSmtpTestEmail(e.target.value)} />
                        </div>
                        <button className="btn-primary" onClick={handleTestSmtp} disabled={smtpStatus.loading} style={{ width: 'auto', background: 'var(--bg-subtle)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
                          {smtpStatus.loading && !smtpStatus.message ? 'Sending...' : 'Send Test Email'}
                        </button>
                      </div>
                      {smtpStatus.message && (
                        <p style={{ marginTop: '12px', fontSize: '14px', color: smtpStatus.error ? '#ef4444' : '#10b981' }}>{smtpStatus.message}</p>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                      <button className="btn-primary" onClick={handleSaveSmtp} disabled={smtpStatus.loading} style={{ width: 'auto' }}>
                        {smtpStatus.loading && !smtpStatus.error && !smtpStatus.message.includes('Test') ? 'Saving...' : 'Save Configuration'}
                      </button>
                    </div>
                  </div>

                  <div className="card">
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
                      <div style={{ padding: '12px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', borderRadius: '12px' }}>
                        <Key size={24} />
                      </div>
                      <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>API Keys</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Manage access tokens for programmatic API access.</p>
                      </div>
                    </div>
                    <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <code style={{ color: 'var(--text-main)', fontFamily: 'monospace', letterSpacing: '2px' }}>hw_live_***************************892a</code>
                      <button className="btn-primary" style={{ width: 'auto', padding: '8px 16px', fontSize: '14px' }}>Reveal Key</button>
                    </div>
                  </div>

                  <div className="card">
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
                      <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px' }}>
                        <Smartphone size={24} />
                      </div>
                      <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Active Sessions</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Devices currently logged into this admin account.</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {data.sessions.map((session, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: idx === 0 ? '16px' : 0, borderBottom: idx === 0 ? '1px solid var(--border)' : 'none' }}>
                          <div>
                            <div style={{ fontWeight: 500, color: 'var(--text-main)', marginBottom: '4px' }}>{session.device}</div>
                            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{session.location} â€¢ {session.ip}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '14px', color: session.time === 'Active now' ? '#10b981' : 'var(--text-muted)', fontWeight: 500 }}>{session.time}</div>
                            {session.time !== 'Active now' && <button style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '14px', cursor: 'pointer', marginTop: '4px' }}>Revoke</button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* AI MODELS & KEYS */}
              {activeSettingsTab === 'ai_models' && (
                <div className="fade-in">
                  <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>AI Provider Management</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Configure multiple keys per provider for Round-Robin distribution and automatic 429 failover. Map your app features to specific model tiers below.</p>
                  </div>

                  {/* GLOBAL MODEL ROUTING */}
                  <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Global Model Routing</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <HierarchicalModelSelect 
                        label="High/Premium Tier" 
                        value={appSettings.high_tier_model} 
                        onChange={(val) => handleSettingChange('high_tier_model', val)} 
                      />
                      <HierarchicalModelSelect 
                        label="Standard/Fast Tier" 
                        value={appSettings.fast_tier_model} 
                        onChange={(val) => handleSettingChange('fast_tier_model', val)} 
                      />
                      <div className="input-group" style={{ gridColumn: 'span 2' }}>
                        <label className="input-label">Ultimate Fallback Provider (If all keys fail)</label>
                        <select className="select-field" value={appSettings.fallback_provider} onChange={(e) => handleSettingChange('fallback_provider', e.target.value)}>
                          <option value="anthropic">Anthropic</option>
                          <option value="openai">OpenAI</option>
                          <option value="google">Google</option>
                          <option value="groq">Groq</option>
                          <option value="deepseek">DeepSeek</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Gemini Provider */}
                  <div className="card">
                    <div className="provider-header">
                      <div style={{ padding: '8px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', borderRadius: '8px' }}>
                        <Cpu size={20} />
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Google Gemini</h3>
                      <button className="btn-primary" onClick={() => handleAddKey('gemini')} style={{ marginLeft: 'auto', width: 'auto', padding: '6px 12px', fontSize: '13px' }}>+ Add Key</button>
                    </div>
                    {aiKeys.gemini.map(key => (
                      <div key={key.id} className="key-list-item" style={{ opacity: key.is_enabled ? 1 : 0.6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <ToggleSwitch checked={key.is_enabled} onChange={() => handleToggleKey(key.id)} />
                          <code style={{ fontFamily: 'monospace', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {showKeys['ai_'+key.id] ? key.api_key_value : key.api_key_value.slice(0, 15) + '...'}
                            <button onClick={() => toggleKeyVisibility('ai_'+key.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                              {showKeys['ai_'+key.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </code>
                          <span className={`badge ${key.status === 'Active' ? 'badge-active' : 'badge-pending'}`}>{key.status}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <button onClick={() => handleDeleteKey(key.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete Key">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* OpenAI Provider */}
                  <div className="card">
                    <div className="provider-header">
                      <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px' }}>
                        <Cpu size={20} />
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600 }}>OpenAI</h3>
                      <button className="btn-primary" onClick={() => handleAddKey('openai')} style={{ marginLeft: 'auto', width: 'auto', padding: '6px 12px', fontSize: '13px' }}>+ Add Key</button>
                    </div>
                    {aiKeys.openai.map(key => (
                      <div key={key.id} className="key-list-item" style={{ opacity: key.is_enabled ? 1 : 0.6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <ToggleSwitch checked={key.is_enabled} onChange={() => handleToggleKey(key.id)} />
                          <code style={{ fontFamily: 'monospace', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {showKeys['ai_'+key.id] ? key.api_key_value : key.api_key_value.slice(0, 15) + '...'}
                            <button onClick={() => toggleKeyVisibility('ai_'+key.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                              {showKeys['ai_'+key.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </code>
                          <span className={`badge ${key.status === 'Active' ? 'badge-active' : 'badge-pending'}`} style={key.status.includes('Cooldown') ? { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' } : {}}>{key.status}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <button onClick={() => handleDeleteKey(key.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete Key">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Groq Provider */}
                  <div className="card">
                    <div className="provider-header">
                      <div style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px' }}>
                        <Cpu size={20} />
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Groq</h3>
                      <button className="btn-primary" onClick={() => handleAddKey('groq')} style={{ marginLeft: 'auto', width: 'auto', padding: '6px 12px', fontSize: '13px' }}>+ Add Key</button>
                    </div>
                    {aiKeys.groq.map(key => (
                      <div key={key.id} className="key-list-item" style={{ opacity: key.is_enabled ? 1 : 0.6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <ToggleSwitch checked={key.is_enabled} onChange={() => handleToggleKey(key.id)} />
                          <code style={{ fontFamily: 'monospace', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {showKeys['ai_'+key.id] ? key.api_key_value : key.api_key_value.slice(0, 15) + '...'}
                            <button onClick={() => toggleKeyVisibility('ai_'+key.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                              {showKeys['ai_'+key.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </code>
                          <span className={`badge ${key.status === 'Active' ? 'badge-active' : 'badge-pending'}`} style={key.status.includes('Cooldown') ? { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' } : {}}>{key.status}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <button onClick={() => handleDeleteKey(key.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete Key">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Anthropic Provider */}
                  <div className="card">
                    <div className="provider-header">
                      <div style={{ padding: '8px', background: 'rgba(217, 119, 87, 0.1)', color: '#d97757', borderRadius: '8px' }}>
                        <Cpu size={20} />
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Anthropic Claude</h3>
                      <button className="btn-primary" onClick={() => handleAddKey('claude')} style={{ marginLeft: 'auto', width: 'auto', padding: '6px 12px', fontSize: '13px' }}>+ Add Key</button>
                    </div>
                    {aiKeys.claude.map(key => (
                      <div key={key.id} className="key-list-item" style={{ opacity: key.is_enabled ? 1 : 0.6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <ToggleSwitch checked={key.is_enabled} onChange={() => handleToggleKey(key.id)} />
                          <code style={{ fontFamily: 'monospace', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {showKeys['ai_'+key.id] ? key.api_key_value : key.api_key_value.slice(0, 15) + '...'}
                            <button onClick={() => toggleKeyVisibility('ai_'+key.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                              {showKeys['ai_'+key.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </code>
                          <span className={`badge ${key.status === 'Active' ? 'badge-active' : 'badge-pending'}`} style={key.status.includes('Cooldown') ? { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' } : {}}>{key.status}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <button onClick={() => handleDeleteKey(key.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete Key">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* DeepSeek Provider */}
                  <div className="card">
                    <div className="provider-header">
                      <div style={{ padding: '8px', background: 'rgba(78, 110, 242, 0.1)', color: '#4e6ef2', borderRadius: '8px' }}>
                        <Cpu size={20} />
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600 }}>DeepSeek</h3>
                      <button className="btn-primary" onClick={() => handleAddKey('deepseek')} style={{ marginLeft: 'auto', width: 'auto', padding: '6px 12px', fontSize: '13px' }}>+ Add Key</button>
                    </div>
                    {aiKeys.deepseek.map(key => (
                      <div key={key.id} className="key-list-item" style={{ opacity: key.is_enabled ? 1 : 0.6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <ToggleSwitch checked={key.is_enabled} onChange={() => handleToggleKey(key.id)} />
                          <code style={{ fontFamily: 'monospace', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {showKeys['ai_'+key.id] ? key.api_key_value : key.api_key_value.slice(0, 15) + '...'}
                            <button onClick={() => toggleKeyVisibility('ai_'+key.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                              {showKeys['ai_'+key.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </code>
                          <span className={`badge ${key.status === 'Active' ? 'badge-active' : 'badge-pending'}`} style={key.status.includes('Cooldown') ? { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' } : {}}>{key.status}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <button onClick={() => handleDeleteKey(key.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete Key">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Custom Provider */}
                  <div className="card" style={{ border: '1px dashed var(--border)', background: 'transparent' }}>
                    <div className="provider-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '16px' }}>
                      <div style={{ padding: '8px', background: 'var(--bg-main)', color: 'var(--text-muted)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <Box size={20} />
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Custom Provider (Ollama / vLLM)</h3>
                      <button className="btn-primary" onClick={() => handleAddKey('custom')} style={{ marginLeft: 'auto', width: 'auto', padding: '6px 12px', fontSize: '13px', background: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>+ Add Custom Server</button>
                    </div>
                    {aiKeys.custom.map(key => (
                      <div key={key.id} className="key-list-item" style={{ opacity: key.is_enabled ? 1 : 0.6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <ToggleSwitch checked={key.is_enabled} onChange={() => handleToggleKey(key.id)} />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600, fontSize: '14px' }}>{key.custom_url}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {showKeys['ai_'+key.id] ? key.api_key_value : key.api_key_value.slice(0, 10) + '...'}
                              <button onClick={() => toggleKeyVisibility('ai_'+key.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                                {showKeys['ai_'+key.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                              </button>
                            </span>
                          </div>
                          <span className={`badge badge-active`}>{key.status}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <button onClick={() => handleDeleteKey(key.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete Server">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* LIVE TRANSCRIPTION API */}
              {activeSettingsTab === 'transcription' && (() => {
                const activeConf = sttConfigs.find(c => c.is_active);
                const groqConf   = sttConfigs.find(c => c.provider_name === 'groq');
                const dgConf     = sttConfigs.find(c => c.provider_name === 'deepgram');
                const localConf  = sttConfigs.find(c => c.provider_name === 'local');
                const SttBadge = ({ conf }) => conf?.is_active
                  ? <span className="badge badge-active">â— Active</span>
                  : conf?.key_hint
                  ? <span className="badge badge-pending">Configured ({conf.key_hint})</span>
                  : <span className="badge" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>Not configured</span>;
                const TestResult = ({ name }) => {
                  const r = sttTestResults[name];
                  if (!r) return null;
                  if (r.loading) return <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Testing...</span>;
                  return r.status === 'ok'
                    ? <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 500 }}>âœ“ Connected â€” {r.latency_ms}ms</span>
                    : <span style={{ fontSize: '13px', color: '#ef4444' }}>âœ— {r.message}</span>;
                };
                return (
                  <div className="fade-in">
                    <div style={{ marginBottom: '24px' }}>
                      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Live Transcription API</h2>
                      <p style={{ color: 'var(--text-muted)' }}>Configure your STT engine. Keys are Fernet-encrypted in the backend DB â€” never stored on this machine.</p>
                    </div>

                    {/* Active Engine Status */}
                    <div className="card" style={{ borderLeft: activeConf ? '4px solid #10b981' : '4px solid #f59e0b' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>Active Engine</h3>
                      {activeConf
                        ? <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span className="badge badge-active" style={{ fontSize: '13px' }}>â— {activeConf.provider_name === 'groq' ? 'Groq Whisper REST' : activeConf.provider_name === 'deepgram' ? 'Deepgram Nova-2' : activeConf.provider_name === 'local' ? 'Local Whisper' : activeConf.custom_name || 'Custom'}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>is receiving all transcription traffic</span>
                          </div>
                        : <span style={{ color: '#f59e0b', fontSize: '13px' }}>âš  No engine selected â€” defaults to Local Whisper (port 8001)</span>
                      }
                    </div>

                    {/* Groq STT */}
                    <div className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>âš¡ Groq Whisper STT</h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>whisper-large-v3 Â· REST API Â· ~2-3s audio chunks Â· No local server needed</p>
                        </div>
                        <SttBadge conf={groqConf} />
                      </div>
                      <div className="input-group">
                          <label className="input-label">Groq API Key (Auto-detect Models)</label>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, position: 'relative', minWidth: '200px' }}>
                              <input type={showKeys['stt_groq'] ? 'text' : 'password'} className="input-field" placeholder={groqConf?.key_hint ? `Saved: ${groqConf.key_hint} ...` : 'gsk_...'} value={sttForm.groq_key} onChange={e => setSttForm(p => ({ ...p, groq_key: e.target.value }))} onBlur={() => { if(sttForm.groq_key) handleFetchModels('groq', sttForm.groq_key); }} style={{ width: '100%', paddingRight: '40px' }} />
                              <button type="button" onClick={() => toggleKeyVisibility('stt_groq')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                {showKeys['stt_groq'] ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                            <button className="btn-primary" onClick={() => handleFetchModels('groq', sttForm.groq_key)} style={{ width: 'auto', padding: '0 16px', background: '#3b82f6' }} disabled={isFetchingModels}>
                              {isFetchingModels ? 'Fetching...' : 'Fetch Models'}
                            </button>
                          </div>
                        </div>

                        {fetchedModels.length > 0 && (
                          <div style={{ marginBottom: '16px', padding: '12px', border: '2px solid #3b82f6', borderRadius: '8px', background: '#eff6ff', color: '#1e3a8a', marginTop: '10px' }}>
                            <label className="input-label" style={{ marginBottom: '8px' }}>Select Transcription Models (Multi-select pool)</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                              {fetchedModels.map(m => (
                                <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                  <input 
                                    type="checkbox" 
                                    checked={selectedModels.includes(m)} 
                                    onChange={(e) => {
                                      if(e.target.checked) setSelectedModels(prev => [...prev, m]);
                                      else setSelectedModels(prev => prev.filter(x => x !== m));
                                    }}
                                  />
                                  {m}
                                </label>
                              ))}
                            </div>
                            <button className="btn-primary" onClick={() => {
                              // Save as STT
                              fetch('http://127.0.0.1:8000/admin/llm/keys', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ provider: 'groq', api_key_value: sttForm.groq_key, enabled_models: selectedModels })
                              }).then(res => {
                                if(!res.ok) alert('Failed to save to pool');
                                else alert('Key and Pool saved to backend successfully!');
                              });
                            }} style={{ width: 'auto', padding: '6px 16px', marginTop: '12px' }}>
                              Save Key and Pool
                            </button>
                          </div>
                        )}
                      <div className="input-group">
                        <label className="input-label">Audio Buffer (seconds per transcription chunk)</label>
                        <select className="select-field" value={sttForm.groq_buffer} onChange={e => setSttForm(p => ({ ...p, groq_buffer: e.target.value }))}>
                          <option value="1">1 second â€” fastest, less context</option>
                          <option value="2">2 seconds â€” balanced</option>
                          <option value="3">3 seconds â€” recommended</option>
                          <option value="5">5 seconds â€” most accurate, slower</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button className="btn-primary" onClick={() => handleActivateStt('groq', 'groq_rest')} style={{ width: 'auto', padding: '8px 16px' }}>Set as Active Engine</button>
                        <button className="btn-primary" onClick={() => handleTestStt('groq')} style={{ width: 'auto', padding: '8px 16px', background: 'var(--bg-subtle)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>Test Connection</button>
                        <TestResult name="groq" />
                      </div>
                    </div>

                    {/* Deepgram STT */}
                    <div className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>ðŸŒŠ Deepgram Nova-2 STT</h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>WebSocket streaming Â· Real-time word-by-word Â· No local server needed</p>
                        </div>
                        <SttBadge conf={dgConf} />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Deepgram API Key</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <div style={{ flex: 1, position: 'relative' }}>
                            <input type={showKeys['stt_deepgram'] ? 'text' : 'password'} className="input-field" placeholder={dgConf?.key_hint ? `Saved: ${dgConf.key_hint} â€” enter new to update` : 'Enter Deepgram key...'} value={sttForm.deepgram_key} onChange={e => setSttForm(p => ({ ...p, deepgram_key: e.target.value }))} style={{ width: '100%', paddingRight: '40px' }} />
                            <button type="button" onClick={() => toggleKeyVisibility('stt_deepgram')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                              {showKeys['stt_deepgram'] ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          <button className="btn-primary" onClick={() => handleSaveSttKey('deepgram')} disabled={sttSaving === 'deepgram'} style={{ width: 'auto', padding: '0 16px', whiteSpace: 'nowrap' }}>{sttSaving === 'deepgram' ? 'Saving...' : 'Save Key'}</button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button className="btn-primary" onClick={() => handleActivateStt('deepgram', 'deepgram_ws')} style={{ width: 'auto', padding: '8px 16px' }}>Set as Active Engine</button>
                        <button className="btn-primary" onClick={() => handleTestStt('deepgram')} style={{ width: 'auto', padding: '8px 16px', background: 'var(--bg-subtle)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>Test Connection</button>
                        <TestResult name="deepgram" />
                      </div>
                    </div>

                    {/* Local Whisper */}
                    <div className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>ðŸ–¥ï¸ Local Whisper Server</h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>ws://localhost:8001 Â· Free Â· Offline Â· Requires local server running</p>
                        </div>
                        <SttBadge conf={localConf} />
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button className="btn-primary" onClick={() => handleActivateStt('local', 'local_ws')} style={{ width: 'auto', padding: '8px 16px' }}>Set as Active Engine</button>
                        <button className="btn-primary" onClick={() => handleTestStt('local')} style={{ width: 'auto', padding: '8px 16px', background: 'var(--bg-subtle)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>Test Connection</button>
                        <TestResult name="local" />
                      </div>
                    </div>

                    {/* Custom STT */}
                    <div className="card" style={{ border: '1px dashed var(--border)', background: 'transparent' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>ðŸ”§ Custom STT Endpoint</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="input-group">
                          <label className="input-label">Display Name</label>
                          <input type="text" className="input-field" placeholder="e.g. Azure STT" value={sttForm.custom_name} onChange={e => setSttForm(p => ({ ...p, custom_name: e.target.value }))} />
                        </div>
                        <div className="input-group">
                          <label className="input-label">WebSocket URL</label>
                          <input type="text" className="input-field" placeholder="wss://your-stt-endpoint.com/ws" value={sttForm.custom_url} onChange={e => setSttForm(p => ({ ...p, custom_url: e.target.value }))} />
                        </div>
                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                          <label className="input-label">API Key (Optional)</label>
                          <div style={{ position: 'relative' }}>
                            <input type={showKeys['stt_custom'] ? 'text' : 'password'} className="input-field" placeholder="Bearer token or key..." value={sttForm.custom_key} onChange={e => setSttForm(p => ({ ...p, custom_key: e.target.value }))} style={{ width: '100%', paddingRight: '40px' }} />
                            <button type="button" onClick={() => toggleKeyVisibility('stt_custom')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                              {showKeys['stt_custom'] ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                        <button className="btn-primary" onClick={() => handleSaveSttKey('custom')} style={{ width: 'auto', padding: '8px 16px' }}>Save Custom Provider</button>
                        <button className="btn-primary" onClick={() => handleActivateStt('custom', 'custom_ws')} style={{ width: 'auto', padding: '8px 16px', background: 'var(--bg-subtle)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>Set as Active</button>
                      </div>
                    </div>

                    {/* Security Note */}
                    <div className="card" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px', color: '#10b981' }}>Security Architecture</h3>
                      <ul style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8, paddingLeft: '16px', margin: 0 }}>
                        <li>ðŸ” Keys are <strong>Fernet-encrypted</strong> before storage â€” unreadable without the server master key</li>
                        <li>ðŸŽ¤ Audio stays local â€” Electron â†’ FastAPI (localhost) â†’ Cloud STT API (server-side)</li>
                        <li>ðŸ‘ This UI only ever sees key hints (***last4) â€” raw keys never leave FastAPI memory</li>
                      </ul>
                    </div>
                  </div>
                );
              })()}

              
                
                {/* EMAIL TEMPLATES */}
                {activeSettingsTab === 'email_templates' && (
                    <EmailTemplates />
                )}
                
                
            </div>
          </div>
        )}

      </main>

      {/* Global Modal Overlay */}
      {modalConfig.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content fade-in">
            <div className="modal-header">
              <h2 className="modal-title">
                {modalConfig.type === 'ADD_USER' && 'Add New User'}
                {modalConfig.type === 'UPDATE_USER' && 'Update User Role'}
                {modalConfig.type === 'DELETE_USER' && 'Confirm Deletion'}
                {modalConfig.type === 'ADD_KEY' && `Add ${modalConfig.payload?.provider} Key`}
                {modalConfig.type === 'DELETE_KEY' && 'Delete API Key'}
              </h2>
              <button className="modal-close" onClick={() => setModalConfig({ isOpen: false, type: null, payload: null })}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              {modalError && (
                <div className="error-message fade-in" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} />
                  {modalError}
                </div>
              )}

              {modalConfig.type === 'ADD_USER' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label className="input-label">Email Address</label>
                    <input type="email" className="input-field" placeholder="user@example.com" value={modalForm.email} onChange={(e) => setModalForm({...modalForm, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="input-label">Temporary Password</label>
                    <input type="password" className="input-field" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" value={modalForm.password} onChange={(e) => setModalForm({...modalForm, password: e.target.value})} />
                  </div>
                  <div>
                    <label className="input-label">Role</label>
                    <select className="select-field" value={modalForm.role} onChange={(e) => setModalForm({...modalForm, role: e.target.value})}>
                      <option value="USER">Standard User</option>
                      <option value="ADMIN">Administrator</option>
                      <option value="STAFF">Support Staff</option>
                      <option value="VENDOR">Vendor</option>
                    </select>
                  </div>
                </div>
              )}

              {modalConfig.type === 'UPDATE_USER' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label className="input-label">Email Address (Read-only)</label>
                    <input type="email" className="input-field" value={modalForm.email} disabled />
                  </div>
                  <div>
                    <label className="input-label">Role</label>
                    <select className="select-field" value={modalForm.role} onChange={(e) => setModalForm({...modalForm, role: e.target.value})}>
                      <option value="USER">Standard User</option>
                      <option value="ADMIN">Administrator</option>
                      <option value="STAFF">Support Staff</option>
                      <option value="VENDOR">Vendor</option>
                    </select>
                  </div>
                </div>
              )}

              {modalConfig.type === 'DELETE_USER' && (
                <div style={{ color: 'var(--text-muted)' }}>
                  Are you sure you want to permanently delete this user? This action cannot be undone.
                </div>
              )}

                              {modalConfig.type === 'ADD_KEY' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label className="input-label">API Key</label>
                      <div style={{ position: 'relative' }}>
                        <input type={showKeys['modal_key'] ? 'text' : 'password'} className="input-field" placeholder={`Enter ${modalConfig.payload?.provider} Key`} value={modalForm.apiKey} onChange={(e) => setModalForm({...modalForm, apiKey: e.target.value})} onBlur={() => { if(modalForm.apiKey) handleFetchModels(modalConfig.payload.provider, modalForm.apiKey); }} style={{ width: '100%', paddingRight: '40px' }} />
                        <button type="button" onClick={() => toggleKeyVisibility('modal_key')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                          {showKeys['modal_key'] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <button type="button" className="btn-primary" onClick={() => handleFetchModels(modalConfig.payload.provider, modalForm.apiKey)} style={{ marginTop: '8px', padding: '6px 12px', width: 'auto', background: '#3b82f6' }} disabled={isFetchingModels}>
                        {isFetchingModels ? 'Fetching Models...' : 'Fetch Models (Auto-detect)'}
                      </button>
                    </div>
                    
                    {fetchedModels.length > 0 && (
                      <div style={{ padding: '12px', border: '2px solid #3b82f6', borderRadius: '8px', background: '#eff6ff', color: '#1e3a8a', marginTop: '10px' }}>
                        <label className="input-label" style={{ marginBottom: '8px' }}>Select Enabled Models</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                          {fetchedModels.map(m => (
                            <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                              <input 
                                type="checkbox" 
                                checked={selectedModels.includes(m)} 
                                onChange={(e) => {
                                  if(e.target.checked) setSelectedModels(prev => [...prev, m]);
                                  else setSelectedModels(prev => prev.filter(x => x !== m));
                                }}
                              />
                              {m}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="input-label">Custom EndPoint (Optional)</label>
                      <input type="text" className="input-field" placeholder="https://api.custom.com" value={modalForm.customUrl} onChange={(e) => setModalForm({...modalForm, customUrl: e.target.value})} />
                    </div>
                  </div>
                )}

              {modalConfig.type === 'DELETE_KEY' && (
                <div style={{ color: 'var(--text-muted)' }}>
                  Are you sure you want to delete this API key? Services relying on it may break.
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setModalConfig({ isOpen: false, type: null, payload: null })}>Cancel</button>
              <button 
                className="btn-primary" 
                style={{ width: 'auto', padding: '10px 24px', background: modalConfig.type.startsWith('DELETE') ? '#ef4444' : 'var(--primary)' }} 
                onClick={submitModal}
              >
                {modalConfig.type.startsWith('DELETE') ? 'Delete Permanently' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

